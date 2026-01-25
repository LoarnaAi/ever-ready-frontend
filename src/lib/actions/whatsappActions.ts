'use server';

import { getMessagingConfig } from '../messaging/config-loader';
import { SendWhatsAppInput, MessageResult, BookingConfirmationData } from '../messaging/types';

export async function sendWhatsAppAction(
    busRef: string,
    input: SendWhatsAppInput
): Promise<MessageResult> {
    try {
        const config = getMessagingConfig(busRef);

        if (config.mockMode) {
            console.log('[MOCK] WhatsApp would be sent:', { busRef, to: input.to, message: input.message });
            return { success: true, messageId: 'mock-whatsapp-id' };
        }

        if (!config.whatsapp) {
            return { success: false, error: 'WhatsApp not configured for this business' };
        }

        const validationResult = validatePhoneNumber(input.to);
        if (!validationResult.valid) {
            return { success: false, error: validationResult.error };
        }

        const response = await fetch(
            `https://graph.facebook.com/v18.0/${config.whatsapp.phoneNumberId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.whatsapp.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: validationResult.formattedPhone,
                    type: 'text',
                    text: {
                        body: input.message,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: `WhatsApp API error: ${response.status} - ${errorText}` };
        }

        const data = await response.json();
        return { success: true, messageId: data.messages?.[0]?.id || 'whatsapp-sent' };
    } catch (error) {
        console.error('WhatsApp send error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function sendBookingConfirmationWhatsAppAction(
    data: BookingConfirmationData
): Promise<MessageResult> {
    const message = buildWhatsAppMessage(data);
    const phoneNumber = `${data.countryCode}${data.customerPhone}`;

    return sendWhatsAppAction(data.busRef, {
        to: phoneNumber,
        message,
    });
}

function validatePhoneNumber(phone: string): { valid: boolean; formattedPhone?: string; error?: string } {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length !== 12) {
        return {
            valid: false,
            error: `Invalid phone number format. Expected 12 digits (including 2-digit country code), got ${cleaned.length} digits.`,
        };
    }

    return {
        valid: true,
        formattedPhone: cleaned,
    };
}

function buildWhatsAppMessage(data: BookingConfirmationData): string {
    let message = `🏠 *EVERREADY - Booking Confirmed*\n\n`;
    message += `Hi ${data.customerName},\n\n`;
    message += `Your home removal booking has been confirmed!\n\n`;
    message += `📋 *Booking Reference:* ${data.displayJobId || data.jobId}\n`;
    message += `🏡 *Home Size:* ${data.homeSize}\n`;

    if (data.collectionDate) {
        message += `📅 *Collection Date:* ${data.collectionDate}\n`;
    }

    if (data.collectionAddress) {
        message += `📍 *Collection:* ${data.collectionAddress}\n`;
    }

    if (data.deliveryAddress) {
        message += `📍 *Delivery:* ${data.deliveryAddress}\n`;
    }

    message += `\nWe'll contact you shortly to confirm final details.\n\n`;
    message += `Thank you for choosing EverReady! 🚚`;

    return message;
}
