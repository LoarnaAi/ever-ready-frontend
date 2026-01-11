/** @format */

import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl =
  process.env.SUPABASE_URL || "https://jvzaqzydaxarywfkwexi.supabase.co";
const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2emFxenlkYXhhcnl3Zmt3ZXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMDgxMzYsImV4cCI6MjA1NjY4NDEzNn0.UL0RQ9Rnii0mdrMwgQUYwz3iJCc5uC_-6LnQ5-8sVeA";

export const supabase = createClient(supabaseUrl, supabaseKey);
