import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hvsvlzliyjsftetjxyxw.supabase.co';  
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2c3ZsemxpeWpzZnRldGp4eXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODU0ODgsImV4cCI6MjA2MDM2MTQ4OH0.H8DP8z8UyHCl_OPlsnDe0lTQMra9CNikGPBfjzQ9FA8';                

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
