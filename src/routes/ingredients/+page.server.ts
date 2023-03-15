import { dev } from '$app/environment';
import type { PageLoad } from "./$types";


// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;

import { supabase } from "$lib/supabase/client";

import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Ingredient } from '$lib/supabase/types';
import { addItem, updateItem, deleteItem } from '$lib/supabase/api/ingredient';

export const load: PageServerLoad = (async ({ parent }) => {
    await parent();

    return {
        ingredients: readIngredients2()
    };
})

const readIngredients2 = async () => {
    const { data, error } = await supabase.from("ingredients").select();
    return new Promise(resolve => setTimeout(resolve(data), 6000));
}
const readIngredients = async () => {
    const { data, error } = await supabase.from("ingredients").select();
    return data;
}

export const actions: Actions = {
    add: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());
        const name = formData.name

        if (!name) return fail(400, { name, error: true })

        const { data, error } = await addItem(name);

        if (error) {
            if (error.message) {
                return fail(400, {
                    data: formData,
                    error: error.details
                })
            }

            return fail(500, {
                data: formData,
                error: 'Server error. Please try again later'
            })
        }
        return { status: 200, type: 'success', data: data };
    },
    update: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());
        const id = formData.id
        const name = formData.name

        if (!id) return fail(400, { id, error: true })
        if (!name) return fail(400, { name, error: true })

        const ingredient: Ingredient = {
            name: name,
            id: id,
            updated_at: new Date()
        }

        const { data, error } = await updateItem(ingredient);

        if (error) {
            if (error.message) {
                return fail(400, {
                    data: formData,
                    error: error.details
                })
            }

            return fail(500, {
                data: formData,
                error: 'Server error. Please try again later'
            })
        }
        return { status: 200, type: 'success', data: data };
    },
    delete: async ({ request }) => {
        const formData = await request.formData();

        const id: string = String(formData.get('id'));

        if (!id) return fail(400, { id, error: true })

        const ingredient: Ingredient = {
            name: '',
            id: id,
            created_at: new Date(),
            updated_at: new Date()
        }

        const { data, error } = await deleteItem(ingredient);

        if (error) {
            if (error.message) {
                return fail(400, {
                    data: formData,
                    error: error.details
                })
            }

            return fail(500, {
                data: formData,
                error: 'Server error. Please try again later'
            })
        }
        return { status: 200, type: 'success', data: data };
    }
};