import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nxqomjncwxtcxcdzlpix.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cW9tam5jd3h0Y3hjZHpscGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTcyNDIsImV4cCI6MjA2NjI5MzI0Mn0.BeQNm5nAgrHUC526_IaOWVu7jNAhU5BLtJs5M6LE-Vs'

console.log('Configuração do Supabase:', { 
  supabaseUrl, 
  hasKey: !!supabaseKey,
  keyLength: supabaseKey ? supabaseKey.length : 0 
});

export const supabase = createClient(supabaseUrl, supabaseKey) 