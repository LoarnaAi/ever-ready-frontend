'use server';

import { BookingConfirmationData, MessageResult } from '../messaging/types';
import { sendBookingConfirmationEmailAction } from './emailActions';
import { sendBookingConfirmationWhatsAppAction } from './whatsappActions';

export interface NotificationResults {
    email: MessageResult;
    whatsapp: MessageResult;
}

export async function sendBookingNotificationsAction(
    data: BookingConfirmationData
): Promise<NotificationResults> {
    const [emailResult, whatsappResult] = await Promise.all([
        sendBookingConfirmationEmailAction(data),
        sendBookingConfirmationWhatsAppAction(data),
    ]);

    return {
        email: emailResult,
        whatsapp: whatsappResult,
    };
}
