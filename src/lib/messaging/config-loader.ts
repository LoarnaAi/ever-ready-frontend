import { MessagingConfig, EmailConfig, WhatsAppConfig } from './types';

export function getMessagingConfig(busRef: string): MessagingConfig {
    const mockMode = process.env.MESSAGING_MOCK_MODE === 'true';

    const emailConfig = loadEmailConfig(busRef);
    const whatsappConfig = loadWhatsAppConfig(busRef);

    return {
        mockMode,
        email: emailConfig,
        whatsapp: whatsappConfig,
    };
}

function loadEmailConfig(busRef: string): EmailConfig | undefined {
    const enabled = getEnvVar(`MESSAGING_${busRef}_EMAIL_ENABLED`, 'MESSAGING_EMAIL_ENABLED') === 'true';

    if (!enabled) {
        return undefined;
    }

    const clientId = getEnvVar(`MESSAGING_${busRef}_MS_CLIENT_ID`, 'MESSAGING_MS_CLIENT_ID');
    const clientSecret = getEnvVar(`MESSAGING_${busRef}_MS_CLIENT_SECRET`, 'MESSAGING_MS_CLIENT_SECRET');
    const tenantId = getEnvVar(`MESSAGING_${busRef}_MS_TENANT_ID`, 'MESSAGING_MS_TENANT_ID');
    const senderEmail = getEnvVar(`MESSAGING_${busRef}_MS_SENDER_EMAIL`, 'MESSAGING_MS_SENDER_EMAIL');

    if (!clientId || !clientSecret || !tenantId || !senderEmail) {
        console.warn(`Email config incomplete for busRef: ${busRef}`);
        return undefined;
    }

    return {
        enabled: true,
        clientId,
        clientSecret,
        tenantId,
        senderEmail,
    };
}

function loadWhatsAppConfig(busRef: string): WhatsAppConfig | undefined {
    const enabled = getEnvVar(`MESSAGING_${busRef}_WHATSAPP_ENABLED`, 'MESSAGING_WHATSAPP_ENABLED') === 'true';

    if (!enabled) {
        return undefined;
    }

    const phoneNumberId = getEnvVar(`MESSAGING_${busRef}_WA_PHONE_NUMBER_ID`, 'MESSAGING_WA_PHONE_NUMBER_ID');
    const accessToken = getEnvVar(`MESSAGING_${busRef}_WA_ACCESS_TOKEN`, 'MESSAGING_WA_ACCESS_TOKEN');

    if (!phoneNumberId || !accessToken) {
        console.warn(`WhatsApp config incomplete for busRef: ${busRef}`);
        return undefined;
    }

    return {
        enabled: true,
        phoneNumberId,
        accessToken,
    };
}

function getEnvVar(businessSpecific: string, defaultVar: string): string | undefined {
    return process.env[businessSpecific] || process.env[defaultVar];
}
