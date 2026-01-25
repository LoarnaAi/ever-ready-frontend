/**
 * Test script to send job report email for a specific job
 * Run with: npx tsx test-job-report.ts
 */

import { sendJobReportToAdminsAction } from './src/lib/actions/jobReportActions';
import { sendBookingNotificationsAction } from './src/lib/actions/notificationActions';
import { getJobAction } from './src/lib/actions/jobActions';
import { BookingConfirmationData } from './src/lib/messaging/types';

const JOB_ID = 'f88ecd38-ae80-47dc-bacf-ea4f0f0f274a';
const BUS_REF = 'LIMO'; // Change if needed

async function testJobReport() {
    console.log('🧪 Testing job report email...');
    console.log(`Job ID: ${JOB_ID}`);
    console.log(`Business: ${BUS_REF}`);
    console.log('---');

    try {
        const jobResult = await getJobAction(JOB_ID);
        if (!jobResult.success || !jobResult.data) {
            throw new Error(jobResult.error || 'Job not found');
        }

        const job = jobResult.data;
        const busRef = job.busRef || BUS_REF;

        const reportResult = await sendJobReportToAdminsAction(JOB_ID, busRef);

        console.log('\n📊 Result:');
        console.log(`Success: ${reportResult.success}`);
        console.log(`Emails sent to: ${reportResult.sentTo.length} recipient(s)`);

        if (reportResult.sentTo.length > 0) {
            console.log('\n✅ Successfully sent to:');
            reportResult.sentTo.forEach(email => console.log(`  - ${email}`));
        }

        if (reportResult.errors.length > 0) {
            console.log('\n❌ Errors:');
            reportResult.errors.forEach(err => {
                console.log(`  - ${err.email}: ${err.error}`);
            });
        }

        // Build booking confirmation payload (mirrors form submission flow)
        const contact = job.contact;
        const bookingData: BookingConfirmationData = {
            jobId: job.job_id,
            displayJobId: job.display_job_id,
            customerName: `${contact.firstName} ${contact.lastName}`.trim() || 'Customer',
            customerEmail: contact.email,
            customerPhone: contact.phone,
            countryCode: contact.countryCode,
            homeSize: job.homeSize,
            collectionDate: job.collectionDate?.date,
            collectionAddress: job.collectionAddress?.address,
            deliveryAddress: job.deliveryAddress?.address,
            busRef,
        };

        console.log('\n📨 Sending booking notifications (email + WhatsApp)...');
        const notifyResult = await sendBookingNotificationsAction(bookingData);
        console.log('\n📊 Notification Result:');
        console.log(`Email success: ${notifyResult.email.success} (${notifyResult.email.error || 'ok'})`);
        console.log(`WhatsApp success: ${notifyResult.whatsapp.success} (${notifyResult.whatsapp.error || 'ok'})`);

        console.log('\n---');
        const allGood = reportResult.success && notifyResult.email.success && notifyResult.whatsapp.success;
        console.log(allGood ? '✅ Test completed successfully!' : '❌ Test failed');
    } catch (error) {
        console.error('\n💥 Unexpected error:', error);
        process.exit(1);
    }
}

testJobReport();
