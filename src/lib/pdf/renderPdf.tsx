import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { JobReportPdf } from './JobReportPdf';
import { JobData } from '../database.types';

export async function renderJobReportPdf(
    job: JobData,
    businessName: string
): Promise<Buffer> {
    return renderToBuffer(<JobReportPdf job={job} businessName={businessName} />);
}
