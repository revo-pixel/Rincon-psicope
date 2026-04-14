import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctfhyftixrnlwvjensqz.supabase.co';
const supabaseKey = 'sb_publishable_HAvS05ejG9MASgdrT1BMkw_qyrlSoUU';

export const supabase = createClient(supabaseUrl, supabaseKey);