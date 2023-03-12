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
import { addItem, deleteItem } from '$lib/supabase/api/ingredient';

export const load: PageServerLoad = (async ({ parent }) => {
    await parent();

    let items = await readIngredients();

    console.log(items);
    
    debugger;
    return {
        ingredients: items,
        categories: readCategories(),
        recipes: readRecipes()
    };
})

const readIngredients = async () => {
    const { data, error } = await supabase.from("ingredients").select();
    return data;
}

const readCategories = async () => {
    const { data: categories } = await supabase.from("categories").select();
    return categories;
}

const readRecipes = async () => {
    const { data: recipes } = await supabase.from("recipes").select();
    return recipes;
}

const readIngredient = async () => {
    const { data: ingredients } = await supabase.from("ingredients").select();
    return ingredients;
}

export const actions: Actions = {
    addIngredient: async ({ request }) => {
        const formData = await request.formData();

        let ingredient: Ingredient;
        for (const entry of formData.entries()) {
            ingredient[entry[0]] = entry[1];
        }

        if (!ingredient.name) return fail(400, { ingredient, error: true })

        addItem(ingredient);

        console.log(ingredient);

    },
    deleteIngredient: async ({ request }) => {
        const formData = await request.formData();

        let ingredient: Ingredient = {};
        for (const entry of formData.entries()) {
            ingredient[entry[0]] = entry[1];
        }

        if (!ingredient.id) return fail(400, { ingredient, error: true })

        deleteItem(ingredient);

        console.log(ingredient);

    }
};