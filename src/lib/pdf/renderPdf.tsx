import { JobData } from '../database.types';
import { createRequire } from 'module';
import { createJobReportDocument } from './JobReportPdf';

export async function renderJobReportPdf(
    job: JobData,
    businessName: string
): Promise<Buffer> {
    // Use Node's resolver so we load the real `react` package (react.element) instead of
    // Next.js' internal React runtime (react.transitional.element). Mixing them triggers
    // "Minified React error #31" inside @react-pdf/renderer.
    const nodeRequire = createRequire(
        typeof __filename !== 'undefined' ? __filename : import.meta.url
    );

    // `require('@react-pdf/renderer')` intentionally uses the CJS export to avoid ESM/CJS
    // interop issues around yoga-layout in Node's ESM loader.
    const React = nodeRequire('react') as typeof import('react');
    const renderer = nodeRequire('@react-pdf/renderer') as typeof import('@react-pdf/renderer');

    const document = createJobReportDocument(
        React,
        {
            Document: renderer.Document,
            Page: renderer.Page,
            Text: renderer.Text,
            View: renderer.View,
        },
        job,
        businessName
    );

    return renderer.renderToBuffer(document as Parameters<typeof renderer.renderToBuffer>[0]);
}
