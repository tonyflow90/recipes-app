import '$lib/supabase/client'

// import { getSupabase } from '@supabase/auth-helpers-sveltekit'
// import type { Handle } from '@sveltejs/kit'
// import type { LayoutLoad } from './routes/$types';

// export const load: LayoutLoad = async (event) => {
//     const session = await getSupabase(event);
//     console.log('hello');
    
//     return { session };
// }

// export const handle: Handle = async ({ event, resolve }) => {
//     const { session, supabaseClient } = await getSupabase(event);

//     event.locals.supabaseClient = supabaseClient;
//     event.locals.session = session;

//     return resolve(event)
// }