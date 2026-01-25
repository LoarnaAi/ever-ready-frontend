/**
 * Check all businesses and their admin configurations
 * Run with: npx tsx check-all-businesses.ts
 */

import { supabase } from './src/lib/supabase';

async function checkBusinesses() {
    console.log('🏢 Checking all businesses...\n');

    const { data: businesses, error } = await supabase
        .from('business_master')
        .select('bus_ref, bus_name, bus_email, admins');

    if (error) {
        console.error('❌ Error:', error.message);
        return;
    }

    if (!businesses || businesses.length === 0) {
        console.log('No businesses found.');
        return;
    }

    businesses.forEach((business) => {
        console.log(`\n📋 ${business.bus_ref} - ${business.bus_name}`);
        console.log(`   Email: ${business.bus_email || 'None'}`);
        console.log(`   Admins: ${business.admins ? JSON.stringify(business.admins) : 'None'}`);

        if (business.admins && business.admins.length > 0) {
            const hasEmailAdmins = business.admins.some((admin: string) => admin.includes('@'));
            if (!hasEmailAdmins) {
                console.log('   ⚠️  No email addresses found in admins (phone numbers only)');
            }
        }
    });

    console.log('\n---');
    console.log('💡 TIP: For email notifications, admins should be email addresses.');
    console.log('   Example: UPDATE business_master SET admins = ARRAY[\'admin@example.com\'] WHERE bus_ref = \'LIMO\';');
}

checkBusinesses();
