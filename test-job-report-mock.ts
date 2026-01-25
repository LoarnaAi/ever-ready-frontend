/**
 * Test script to send job report email for a specific job (MOCK MODE)
 * Run with: MESSAGING_MOCK_MODE=true npx tsx test-job-report-mock.ts
 */

// Set mock mode before importing
process.env.MESSAGING_MOCK_MODE = 'true';

import { sendJobReportToAdminsAction } from './src/lib/actions/jobReportActions';

const JOB_ID = '3abed2a7-edea-4abc-9467-97cbd44e98cb';
const BUS_REF = 'LIMO';

async function testJobReport() {
    console.log('🧪 Testing job report email (MOCK MODE)...');
    console.log(`Job ID: ${JOB_ID}`);
    console.log(`Business: ${BUS_REF}`);
    console.log('---\n');

    try {
        const result = await sendJobReportToAdminsAction(JOB_ID, BUS_REF);

        console.log('📊 Result:');
        console.log(`Success: ${result.success}`);
        console.log(`Emails sent to: ${result.sentTo.length} recipient(s)`);

        if (result.sentTo.length > 0) {
            console.log('\n✅ Successfully sent to:');
            result.sentTo.forEach(email => console.log(`  - ${email}`));
        }

        if (result.errors.length > 0) {
            console.log('\n❌ Errors:');
            result.errors.forEach(err => {
                console.log(`  - ${err.email}: ${err.error}`);
            });
        }

        console.log('\n---');
        if (result.success) {
            console.log('✅ Test completed successfully!');
            console.log('📧 Email would be sent to: Removals@lionsmoves.co.uk');
            console.log('📎 With PDF attachment containing job details');
        } else {
            console.log('❌ Test failed');
        }
    } catch (error) {
        console.error('\n💥 Unexpected error:', error);
        process.exit(1);
    }
}

testJobReport();
