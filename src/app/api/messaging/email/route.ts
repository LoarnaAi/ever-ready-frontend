import { NextRequest, NextResponse } from 'next/server';
import { sendEmailAction } from '@/lib/actions/emailActions';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { busRef, to, subject, bodyContent, bodyType, attachments } = body;

        if (!busRef || !to || !subject || !bodyContent) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: busRef, to, subject, bodyContent' },
                { status: 400 }
            );
        }

        const result = await sendEmailAction(busRef, {
            to,
            subject,
            body: bodyContent,
            bodyType: bodyType || 'Text',
            attachments,
        });

        return NextResponse.json(result, { status: result.success ? 200 : 500 });
    } catch (error) {
        console.error('Email API error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
