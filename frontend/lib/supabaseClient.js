import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://ecozdwjnqcnxnyjfaxlm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3pkd2pucWNueG55amZheGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUxNjQ0ODMsImV4cCI6MjAwMDc0MDQ4M30.3qUgiP3PprGXy2mg_xyqnX4NuBb6LM0rE_b_Fp09EEo'
)