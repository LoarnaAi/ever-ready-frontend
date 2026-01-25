/**
 * Verify the actual business email in database
 */

import { supabase } from './src/lib/supabase';

async function verifyBusinessEmail() {
    const { data, error } = await supabase
        .from('business_master')
        .select('bus_ref, bus_name, bus_email')
        .eq('bus_ref', 'LIMO')
        .single();

    if (error || !data) {
        console.error('Error:', error?.message);
        return;
    }

    console.log('✅ LIMO Business Email Configuration:');
    console.log(`   Business: ${data.bus_name}`);
    console.log(`   Email: ${data.bus_email}`);
}

verifyBusinessEmail();
