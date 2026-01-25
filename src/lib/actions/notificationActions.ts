'use server';

import { BookingConfirmationData, MessageResult } from '../messaging/types';
import { sendBookingConfirmationEmailAction } from './emailActions';
import { sendWhatsAppAction } from './whatsappActions';
import { getBusinessMaster } from './businessActions';

export interface NotificationResults {
    email: MessageResult;
    whatsapp: MessageResult;
}

export async function sendBookingNotificationsAction(
    data: BookingConfirmationData
): Promise<NotificationResults> {
    console.log('[NOTIFICATIONS] booking notifications start', {
        busRef: data.busRef,
        jobId: data.jobId,
        customerEmail: data.customerEmail,
        customerPhone: maskPhone(`${data.countryCode}${data.customerPhone}`),
    });

    const businessResult = await getBusinessMaster(data.busRef);
    if (!businessResult.success || !businessResult.data) {
        const error = businessResult.error || 'Business not found';
        console.error('[NOTIFICATIONS] business lookup failed', { busRef: data.busRef, error });
        return {
            email: { success: false, error },
            whatsapp: { success: false, error },
        };
    }

    const admins = businessResult.data.admins?.filter(Boolean) || [];

    const emailPromise = sendBookingConfirmationEmailAction(data);
    const whatsappPromise = sendWhatsAppToAdmins(admins, data);

    const [emailResult, whatsappResult] = await Promise.all([emailPromise, whatsappPromise]);

    console.log('[NOTIFICATIONS] booking notifications result', {
        busRef: data.busRef,
        jobId: data.jobId,
        emailSuccess: emailResult.success,
        whatsappSuccess: whatsappResult.success,
        emailError: emailResult.error,
        whatsappError: whatsappResult.error,
    });

    return {
        email: emailResult,
        whatsapp: whatsappResult,
    };
}

async function sendWhatsAppToAdmins(adminPhones: string[], data: BookingConfirmationData): Promise<MessageResult> {
    if (adminPhones.length === 0) {
        console.warn('[NOTIFICATIONS] no admin phone numbers configured', { busRef: data.busRef });
        return { success: false, error: 'No admin phone numbers configured' };
    }

    const message = buildAdminWhatsAppMessage(data);

    const results = await Promise.all(
        adminPhones.map(async (phone) => {
            const res = await sendWhatsAppAction(data.busRef, {
                to: phone,
                message,
            });
            return { phone, res };
        })
    );

    const failed = results.filter(r => !r.res.success);
    const succeeded = results.filter(r => r.res.success);

    if (failed.length > 0) {
        console.error('[NOTIFICATIONS] WhatsApp admin send failures', {
            busRef: data.busRef,
            failed: failed.map(f => ({ phone: maskPhone(f.phone), error: f.res.error })),
        });
    }

    return {
        success: failed.length === 0,
        messageId: succeeded[0]?.res.messageId,
        error: failed.length ? `Failed for ${failed.length} admin(s)` : undefined,
    };
}

function buildAdminWhatsAppMessage(data: BookingConfirmationData): string {
    let message = `📦 New Booking - ${data.displayJobId || data.jobId}\n`;
    message += `Customer: ${data.customerName}\n`;
    message += `Phone: ${data.countryCode}${data.customerPhone}\n`;
    message += `Home Size: ${data.homeSize}\n`;
    if (data.collectionDate) message += `Collection Date: ${data.collectionDate}\n`;
    if (data.collectionAddress) message += `Collection: ${data.collectionAddress}\n`;
    if (data.deliveryAddress) message += `Delivery: ${data.deliveryAddress}\n`;
    message += `\nPlease follow up with the customer to confirm details.`;
    return message;
}

function maskPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 4) {
        return cleaned;
    }
    return `${cleaned.slice(0, 2)}****${cleaned.slice(-2)}`;
}
