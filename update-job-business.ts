/**
 * Update job to assign a business reference
 * Run with: npx tsx update-job-business.ts
 */

import { supabase } from './src/lib/supabase';

const JOB_ID = '3abed2a7-edea-4abc-9467-97cbd44e98cb';
const BUS_REF = 'LIMO'; // Using LIMO which has admins configured

async function updateJobBusiness() {
    console.log('🔧 Updating job business reference...\n');

    // First check if LIMO business exists and has admins
    const { data: business, error: busError } = await supabase
        .from('business_master')
        .select('bus_ref, bus_name, admins')
        .eq('bus_ref', BUS_REF)
        .single();

    if (busError || !business) {
        console.error('❌ Business not found:', busError?.message);
        return;
    }

    console.log(`✅ Business found: ${business.bus_name}`);
    console.log(`   Admins: ${business.admins ? business.admins.join(', ') : 'None'}`);

    if (!business.admins || business.admins.length === 0) {
        console.warn('\n⚠️  WARNING: This business has no admins configured!');
        console.log('   You may want to add admins first.');
    }

    // Update the job
    const { error: updateError } = await supabase
        .from('jobs')
        .update({ bus_ref: BUS_REF })
        .eq('job_id', JOB_ID);

    if (updateError) {
        console.error('\n❌ Failed to update job:', updateError.message);
        return;
    }

    console.log(`\n✅ Job updated successfully!`);
    console.log(`   Job ${JOB_ID} now assigned to ${BUS_REF}`);
}

updateJobBusiness();
