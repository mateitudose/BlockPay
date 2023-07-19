const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    'https://ecozdwjnqcnxnyjfaxlm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3pkd2pucWNueG55amZheGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEwNDQzNDgsImV4cCI6MTk5NjYyMDM0OH0.TCvEDsuk95eUySv9G0HUx1yNVE3-MR5XpEJ86swQn9U'
)