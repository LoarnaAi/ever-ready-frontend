'use server';

import { getMessagingConfig } from '../messaging/config-loader';
import { MessageResult } from '../messaging/types';
import { getBusinessMaster } from './businessActions';

export interface SendEnquiryNotificationInput {
    recipient: string;
    display_job_id: string;
}

export async function sendEnquiryNotificationTemplateAction(
    busRef: string,
    input: SendEnquiryNotificationInput
): Promise<MessageResult> {
    try {
        console.log('[WHATSAPP_TEMPLATE] sendEnquiryNotificationTemplateAction start', {
            busRef,
            to: maskPhone(input.recipient),
            display_job_id: input.display_job_id,
        });

        const config = getMessagingConfig(busRef);

        // Get business name for body parameter
        const businessResult = await getBusinessMaster(busRef);
        if (!businessResult.success || !businessResult.data) {
            const error = businessResult.error || 'Business not found';
            console.error('[WHATSAPP_TEMPLATE] business lookup failed', { busRef, error });
            return { success: false, error };
        }
        const busName = businessResult.data.name;

        const templatePayload = {
            messaging_product: 'whatsapp',
            to: '',
            type: 'template',
            template: {
                name: 'enquiry_notification',
                language: {
                    code: 'en',
                },
                components: [
                    {
                        type: 'header',
                        parameters: [
                            {
                                type: 'text',
                                text: input.display_job_id,
                            },
                        ],
                    },
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text',
                                text: busName,
                            },
                        ],
                    },
                    {
                        type: 'button',
                        sub_type: 'url',
                        index: '0',
                        parameters: [
                            {
                                type: 'text',
                                text: input.display_job_id,
                            },
                        ],
                    },
                ],
            },
        };

        if (config.mockMode) {
            const mockPayload = { ...templatePayload, to: input.recipient };
            console.log('[MOCK] WhatsApp template would be sent:', JSON.stringify(mockPayload, null, 2));
            return { success: true, messageId: 'mock-whatsapp-template-id' };
        }

        if (!config.whatsapp) {
            console.warn('[WHATSAPP_TEMPLATE] config missing or disabled', { busRef });
            return { success: false, error: 'WhatsApp not configured for this business' };
        }

        const validationResult = validatePhoneNumber(input.recipient);
        if (!validationResult.valid) {
            console.warn('[WHATSAPP_TEMPLATE] invalid phone number', {
                busRef,
                to: maskPhone(input.recipient),
                error: validationResult.error,
            });
            return { success: false, error: validationResult.error };
        }

        // Bypass admin number
        if (validationResult.formattedPhone === '447448440754') {
            console.log('[WHATSAPP_TEMPLATE] bypassing admin WA msg to 44****54');
            return { success: true, messageId: 'bypassed-admin-number' };
        }

        const payload = {
            ...templatePayload,
            to: validationResult.formattedPhone,
        };

        const response = await fetch(
            `https://graph.facebook.com/v18.0/${config.whatsapp.phoneNumberId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.whatsapp.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[WHATSAPP_TEMPLATE] API error', {
                busRef,
                status: response.status,
                error: errorText,
            });
            return { success: false, error: `WhatsApp API error: ${response.status} - ${errorText}` };
        }

        const data = await response.json();
        console.log('[WHATSAPP_TEMPLATE] sent', {
            busRef,
            messageId: data.messages?.[0]?.id || 'whatsapp-template-sent',
        });
        return { success: true, messageId: data.messages?.[0]?.id || 'whatsapp-template-sent' };
    } catch (error) {
        console.error('WhatsApp template send error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
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

function maskPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 4) {
        return cleaned;
    }
    return `${cleaned.slice(0, 2)}****${cleaned.slice(-2)}`;
}
