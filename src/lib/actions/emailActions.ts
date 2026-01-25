'use server';

import { getMessagingConfig } from '../messaging/config-loader';
import { SendEmailInput, MessageResult, BookingConfirmationData } from '../messaging/types';

export async function sendEmailAction(
    busRef: string,
    input: SendEmailInput
): Promise<MessageResult> {
    try {
        const config = getMessagingConfig(busRef);

        if (config.mockMode) {
            console.log('[MOCK] Email would be sent:', { busRef, to: input.to, subject: input.subject });
            return { success: true, messageId: 'mock-email-id' };
        }

        if (!config.email) {
            return { success: false, error: 'Email not configured for this business' };
        }

        const accessToken = await getMicrosoftAccessToken(
            config.email.clientId,
            config.email.clientSecret,
            config.email.tenantId
        );

        const response = await fetch(
            `https://graph.microsoft.com/v1.0/users/${config.email.senderEmail}/sendMail`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: {
                        subject: input.subject,
                        body: {
                            contentType: input.bodyType || 'Text',
                            content: input.body,
                        },
                        toRecipients: [
                            {
                                emailAddress: {
                                    address: input.to,
                                },
                            },
                        ],
                        attachments: input.attachments?.map(att => ({
                            '@odata.type': '#microsoft.graph.fileAttachment',
                            name: att.filename,
                            contentType: att.contentType,
                            contentBytes: att.content,
                        })) || [],
                    },
                }),
            }
        );

        if (response.status === 202 || response.ok) {
            return { success: true, messageId: 'email-sent' };
        }

        const errorText = await response.text();
        return { success: false, error: `Email API error: ${response.status} - ${errorText}` };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function sendBookingConfirmationEmailAction(
    data: BookingConfirmationData
): Promise<MessageResult> {
    const subject = `Booking Confirmation - ${data.displayJobId || data.jobId}`;
    const body = buildEmailTemplate(data);

    return sendEmailAction(data.busRef, {
        to: data.customerEmail,
        subject,
        body,
        bodyType: 'Text',
    });
}

async function getMicrosoftAccessToken(
    clientId: string,
    clientSecret: string,
    tenantId: string
): Promise<string> {
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
    });

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
}

function buildEmailTemplate(data: BookingConfirmationData): string {
    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   EVERREADY - BOOKING CONFIRMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear ${data.customerName},

Thank you for choosing EverReady! Your home removal booking has been confirmed.

BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking Reference: ${data.displayJobId || data.jobId}
Home Size: ${data.homeSize}
${data.collectionDate ? `Collection Date: ${data.collectionDate}` : ''}
${data.collectionAddress ? `Collection Address: ${data.collectionAddress}` : ''}
${data.deliveryAddress ? `Delivery Address: ${data.deliveryAddress}` : ''}

CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.customerName}
Email: ${data.customerEmail}
Phone: ${data.customerPhone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We will contact you shortly to confirm the final details of your move.

If you have any questions, please don't hesitate to reach out.

Best regards,
The EverReady Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  © ${new Date().getFullYear()} EverReady - Your Trusted Moving Partner
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();
}
