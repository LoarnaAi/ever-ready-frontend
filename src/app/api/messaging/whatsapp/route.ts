import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppAction } from '@/lib/actions/whatsappActions';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { busRef, to, message } = body;

        if (!busRef || !to || !message) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: busRef, to, message' },
                { status: 400 }
            );
        }

        const result = await sendWhatsAppAction(busRef, {
            to,
            message,
        });

        return NextResponse.json(result, { status: result.success ? 200 : 500 });
    } catch (error) {
        console.error('WhatsApp API error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
