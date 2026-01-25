/**
 * Check job details before testing
 * Run with: npx tsx check-job.ts
 */

import { supabase } from './src/lib/supabase';

const JOB_ID = '3abed2a7-edea-4abc-9467-97cbd44e98cb';

async function checkJob() {
    console.log('🔍 Checking job details...\n');

    const { data: job, error } = await supabase
        .from('jobs')
        .select('job_id, display_job_id, bus_ref, status, home_size, created_at')
        .eq('job_id', JOB_ID)
        .single();

    if (error || !job) {
        console.error('❌ Job not found:', error?.message);
        return;
    }

    console.log('✅ Job found:');
    console.log(`  Job ID: ${job.job_id}`);
    console.log(`  Display ID: ${job.display_job_id}`);
    console.log(`  Business: ${job.bus_ref || 'None'}`);
    console.log(`  Status: ${job.status}`);
    console.log(`  Home Size: ${job.home_size}`);
    console.log(`  Created: ${job.created_at}`);

    if (job.bus_ref) {
        console.log('\n🏢 Checking business admins...');
        const { data: business, error: busError } = await supabase
            .from('business_master')
            .select('bus_ref, bus_name, bus_email, admins')
            .eq('bus_ref', job.bus_ref)
            .single();

        if (busError || !business) {
            console.error('❌ Business not found:', busError?.message);
            return;
        }

        console.log(`  Business: ${business.bus_name}`);
        console.log(`  Email: ${business.bus_email || 'None'}`);
        console.log(`  Admins: ${business.admins ? business.admins.join(', ') : 'None configured'}`);

        if (!business.admins || business.admins.length === 0) {
            console.warn('\n⚠️  WARNING: No admins configured for this business!');
            console.log('   Emails will not be sent.');
        }
    } else {
        console.warn('\n⚠️  WARNING: Job has no business reference!');
    }
}

checkJob();
