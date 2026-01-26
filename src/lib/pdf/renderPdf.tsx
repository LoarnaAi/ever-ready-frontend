import { JobData } from '../database.types';

export async function renderJobReportPdf(
    job: JobData,
    businessName: string
): Promise<Buffer> {
    // Dynamic imports to avoid bundling issues in serverless environments
    const { renderToBuffer } = await import('@react-pdf/renderer');
    const { createJobReportDocument } = await import('./JobReportPdf');

    // createJobReportDocument now handles its own React/component imports
    const document = await createJobReportDocument(job, businessName);
    return renderToBuffer(document as Parameters<typeof renderToBuffer>[0]);
}
