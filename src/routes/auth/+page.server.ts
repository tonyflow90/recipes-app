import { dev } from '$app/environment';

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;

import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect, type Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { supabase } from "$lib/supabase/client";

import { getServerSession } from '@supabase/auth-helpers-sveltekit'
import { invalidateAll } from '$app/navigation';

export const load: PageServerLoad = async (event) => {
    return {
        session: await getServerSession(event),
    }
}

// export const load: LayoutServerLoad = async ({parent}) => {
//     await parent()
//     // const session = await getServerSession(event);
//     // return { session: await getServerSession(event) }
// }

export const actions: Actions = {
    reset: async ({ request, locals }) => {
        return null;
    },
    logout: async ({ request, locals }) => {
        let { error } = await supabase.auth.signOut();
        console.log('server component');
        console.log(JSON.stringify(locals, null, 2))
        if (error) {
            if (error instanceof AuthApiError) {
                return fail(error.status, {
                    data: {},
                    error: error.message
                })
            }

            return fail(500, {
                data: {},
                error: 'Server error. Please try again later'
            })
        }
        return {success: true}
        throw redirect(300, '/');
    },
    login: async ({ request, locals }) => {
        const formData = Object.fromEntries(await request.formData());
        const email = formData.email

        if (!email) return fail(400, { error: 'email is required' })

        const { error } = await supabase.auth.signInWithOtp({
            email: String(email),
            options: { shouldCreateUser: false },
        });

        if (error) {
            if (error instanceof AuthApiError) {
                return fail(error.status, {
                    data: formData,
                    error: error.message
                })
            }

            return fail(500, {
                data: formData,
                error: 'Server error. Please try again later'
            })
        }
        return { status: 200, type: 'success', data: formData };
    },
    verify: async ({ request, locals }) => {
        const formData = Object.fromEntries(await request.formData());

        const email = formData.email
        const type = String(formData.type)
        const token = formData.token

        if (!email) return fail(400, { data: formData, error: 'email is required' })
        if (!type) return fail(400, { data: formData, error: 'type is required' })
        if (!token) return fail(400, { data: formData, error: 'token is required' })

        const { data, error } = await supabase.auth.verifyOtp({
            email: String(email),
            token: String(token),
            type: type,
        });

        if (error) {
            if (error instanceof AuthApiError) {
                return fail(error.status, {
                    data: formData,
                    error: error.message
                })
            }

            return fail(500, {
                data: formData,
                error: 'Server error. Please try again later'
            })
        }
        throw redirect(300, '/');
    }
};