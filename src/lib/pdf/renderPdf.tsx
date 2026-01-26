import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { JobReportPdf } from './JobReportPdf';
import { JobData } from '../database.types';

export async function renderJobReportPdf(
    job: JobData,
    businessName: string
): Promise<Buffer> {
    // Use React.createElement to avoid JSX runtime issues in serverless environments
    const document = React.createElement(JobReportPdf, { job, businessName });
    return renderToBuffer(document as Parameters<typeof renderToBuffer>[0]);
}
