import type { PageLoad } from './$types';

// export const load: PageLoad = (async ({ parent }) => {
//     await parent();
//     console.log("PAGE.TS");

//     console.log(JSON.stringify(session, null, 2))

//     return { session };
// })
import type { LayoutLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load: PageLoad = async ({ parent }) => {
    const { session } = await parent()
    //   const session = await getSupabase(event);
    //   //     console.log(JSON.stringify(session, null, 2))
    //       console.log(`session: ${session != null}`)

    return { session };
}