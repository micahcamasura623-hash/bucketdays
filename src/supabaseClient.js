import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uycdcwtnzpfzqysfulik.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5Y2Rjd3RuenBmenF5c2Z1bGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzkzMTgsImV4cCI6MjEwMTk1NTMxOH0.8EStEIAdjSLPKYlu9PrYjUm08Ije2OVqgKXijPEdNwM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
