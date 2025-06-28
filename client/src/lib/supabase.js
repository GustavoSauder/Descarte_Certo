import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nxqomjncwxtcxcdzlpix.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cXFvbWpuY3d4dGN4Y2R6bHBpeCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM1MjQ5NjAwLCJleHAiOjIwNTA4MjU2MDB9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

console.log('Configuração do Supabase:', { 
  supabaseUrl, 
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0 
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 