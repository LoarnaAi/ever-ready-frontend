import { NextRequest, NextResponse } from 'next/server';
import { sendEnquiryNotificationTemplateAction } from '@/lib/actions/whatsappTemplateActions';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { busRef, recipient, display_job_id } = body;

        if (!busRef || !recipient || !display_job_id) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: busRef, recipient, display_job_id' },
                { status: 400 }
            );
        }

        // Bypass admin number
        if (recipient === '447448440754') {
            console.log('[WHATSAPP] bypassing admin WA msg to 44****54');
            return NextResponse.json({ success: true, messageId: 'bypassed-admin-number' }, { status: 200 });
        }

        const result = await sendEnquiryNotificationTemplateAction(busRef, {
            recipient,
            display_job_id,
        });

        return NextResponse.json(result, { status: result.success ? 200 : 500 });
    } catch (error) {
        console.error('WhatsApp enquiry notification API error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
