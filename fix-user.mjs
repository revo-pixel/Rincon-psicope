import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctfhyftixrnlwvjensqz.supabase.co';
const supabaseKey = 'sb_publishable_HAvS05ejG9MASgdrT1BMkw_qyrlSoUU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Attempting sign in to check status...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'admin@psicope.com',
    password: 'psicope1986'
  });

  if (signInData?.user) {
    console.log('User is already working and confirmed!');
    return;
  }

  console.log('Sign In Error:', signInError?.message);

  console.log('Attempting sign up...');
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: 'admin@psicope.com',
    password: 'psicope1986'
  });

  if (signUpError) {
    console.log('Sign up error:', signUpError.message);
  } else {
    console.log('Sign up successful! Is email confirmed?', signUpData.user?.email_confirmed_at ? 'Yes' : 'No');
  }
}

run();
