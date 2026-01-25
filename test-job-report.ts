/**
 * Test script to send job report email for a specific job
 * Run with: npx tsx test-job-report.ts
 */

import { sendJobReportToAdminsAction } from './src/lib/actions/jobReportActions';

const JOB_ID = 'f88ecd38-ae80-47dc-bacf-ea4f0f0f274a';
const BUS_REF = 'LIMO'; // Change if needed

async function testJobReport() {
    console.log('🧪 Testing job report email...');
    console.log(`Job ID: ${JOB_ID}`);
    console.log(`Business: ${BUS_REF}`);
    console.log('---');

    try {
        const result = await sendJobReportToAdminsAction(JOB_ID, BUS_REF);

        console.log('\n📊 Result:');
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
        console.log(result.success ? '✅ Test completed successfully!' : '❌ Test failed');
    } catch (error) {
        console.error('\n💥 Unexpected error:', error);
        process.exit(1);
    }
}

testJobReport();
