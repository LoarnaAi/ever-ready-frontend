'use server';

import { getJobAction } from './jobActions';
import { getBusinessMaster } from './businessActions';
import { sendEmailAction } from './emailActions';
import { renderJobReportPdf } from '../pdf/renderPdf';
import { generateJobReportHtml } from '../templates/jobReportHtml';

export interface JobReportResult {
    success: boolean;
    sentTo: string[];
    errors: Array<{ email: string; error: string }>;
}

export async function sendJobReportToAdminsAction(
    jobId: string,
    busRef: string
): Promise<JobReportResult> {
    const result: JobReportResult = {
        success: false,
        sentTo: [],
        errors: [],
    };

    try {
        const jobResult = await getJobAction(jobId);
        if (!jobResult.success || !jobResult.data) {
            result.errors.push({ email: 'N/A', error: 'Job not found' });
            return result;
        }

        const businessResult = await getBusinessMaster(busRef);
        if (!businessResult.success || !businessResult.data) {
            result.errors.push({ email: 'N/A', error: 'Business not found' });
            return result;
        }

        const job = jobResult.data;
        const business = businessResult.data;

        if (!business.email) {
            result.errors.push({ email: 'N/A', error: 'No business email configured' });
            console.warn(`No business email configured for business ${busRef}`);
            return result;
        }

        let pdfBase64: string | null = null;
        try {
            const pdfBuffer = await renderJobReportPdf(job, business.name);
            pdfBase64 = pdfBuffer.toString('base64');
        } catch (pdfError) {
            console.error('PDF generation failed:', pdfError);
            result.errors.push({
                email: 'N/A',
                error: `PDF generation failed: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`,
            });
        }

        const htmlBody = generateJobReportHtml(job, business);
        const subjectId = job.display_job_id || job.job_id;
        const subject = `New Booking: ${subjectId}`;

        try {
            const emailResult = await sendEmailAction(busRef, {
                to: business.email,
                subject,
                body: htmlBody,
                bodyType: 'HTML',
                attachments: pdfBase64
                    ? [
                        {
                            filename: `job-report-${job.display_job_id || job.job_id}.pdf`,
                            content: pdfBase64,
                            contentType: 'application/pdf',
                        },
                    ]
                    : undefined,
            });

            if (emailResult.success) {
                result.sentTo.push(business.email);
                result.success = true;
            } else {
                result.errors.push({
                    email: business.email,
                    error: emailResult.error || 'Unknown error',
                });
            }
        } catch (error) {
            result.errors.push({
                email: business.email,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
        return result;
    } catch (error) {
        console.error('Unexpected error in sendJobReportToAdminsAction:', error);
        result.errors.push({
            email: 'N/A',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        return result;
    }
}
