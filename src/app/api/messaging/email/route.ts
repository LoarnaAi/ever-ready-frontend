import { NextRequest, NextResponse } from 'next/server';
import { sendEmailAction } from '@/lib/actions/emailActions';

export async function POST(request: NextRequest) {
    try {
        console.log('Email API: request received');
        const body = await request.json();
        const { busRef, to, subject, bodyContent, bodyType } = body;
        console.log('Email API: parsed request', {
            busRef,
            to,
            subject,
            bodyType: bodyType || 'Text',
            bodyLength: typeof bodyContent === 'string' ? bodyContent.length : null,
        });

        if (!busRef || !to || !subject || !bodyContent) {
            console.warn('Email API: missing required fields', {
                busRef: !!busRef,
                to: !!to,
                subject: !!subject,
                bodyContent: !!bodyContent,
            });
            return NextResponse.json(
                { success: false, error: 'Missing required fields: busRef, to, subject, bodyContent' },
                { status: 400 }
            );
        }

        console.log('Email API: sending email', { busRef, toEmail: to, subject, bodyType: bodyType || 'Text' });
        const result = await sendEmailAction(busRef, {
            to,
            subject,
            body: bodyContent,
            bodyType: bodyType || 'Text',
        });
        console.log('Email API: send result', { toEmail: to, result });

        return NextResponse.json(result, { status: result.success ? 200 : 500 });
    } catch (error) {
        console.error('Email API error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
