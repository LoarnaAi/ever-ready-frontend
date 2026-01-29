import { MessagingConfig, EmailConfig, WhatsAppConfig } from './types';

export function getMessagingConfig(busRef: string): MessagingConfig {
    const mockMode = parseEnvBool(process.env.MESSAGING_MOCK_MODE);

    const emailConfig = loadEmailConfig(busRef);
    const whatsappConfig = loadWhatsAppConfig(busRef);

    return {
        mockMode,
        email: emailConfig,
        whatsapp: whatsappConfig,
    };
}

function loadEmailConfig(busRef: string): EmailConfig | undefined {
    // Use project-level constants (not business-specific)
    const enabledRaw = process.env.MESSAGING_EMAIL_ENABLED;
    const enabled = parseEnvBool(enabledRaw);
    const clientId = process.env.MESSAGING_MS_CLIENT_ID;
    const clientSecret = process.env.MESSAGING_MS_CLIENT_SECRET;
    const tenantId = process.env.MESSAGING_MS_TENANT_ID;
    const senderEmail = process.env.MESSAGING_MS_SENDER_EMAIL;

    console.log('[DEBUG] Email config for', busRef, ':', {
        enabled,
        enabledRaw,
        clientId: clientId ? 'SET' : 'MISSING',
        clientSecret: clientSecret ? 'SET' : 'MISSING',
        tenantId: tenantId ? 'SET' : 'MISSING',
        senderEmail,
    });

    if (!enabled) {
        console.warn(`Email not enabled for busRef: ${busRef}`);
        return undefined;
    }

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
    const enabled = parseEnvBool(getEnvVar(`MESSAGING_${busRef}_WHATSAPP_ENABLED`, 'MESSAGING_WHATSAPP_ENABLED'));

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

function parseEnvBool(value: string | undefined): boolean {
    if (!value) {
        return false;
    }

    const normalized = normalizeEnvValue(value).toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on';
}

function normalizeEnvValue(value: string): string {
    const trimmed = value.trim();
    const isWrappedInDoubleQuotes = trimmed.startsWith('"') && trimmed.endsWith('"');
    const isWrappedInSingleQuotes = trimmed.startsWith("'") && trimmed.endsWith("'");

    if (isWrappedInDoubleQuotes || isWrappedInSingleQuotes) {
        return trimmed.slice(1, -1).trim();
    }

    return trimmed;
}
