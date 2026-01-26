export interface EmailConfig {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    tenantId: string;
    senderEmail: string;
}

export interface WhatsAppConfig {
    enabled: boolean;
    phoneNumberId: string;
    accessToken: string;
}

export interface MessagingConfig {
    mockMode: boolean;
    email?: EmailConfig;
    whatsapp?: WhatsAppConfig;
}

export interface SendEmailInput {
    to: string;
    subject: string;
    body: string;
    bodyType?: 'Text' | 'HTML';
}

export interface SendWhatsAppInput {
    to: string;
    message: string;
}

export interface MessageResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

export interface BookingConfirmationData {
    jobId: string;
    displayJobId: string | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    countryCode: string;
    homeSize: string;
    collectionDate?: string;
    collectionAddress?: string;
    deliveryAddress?: string;
    busRef: string;
}
