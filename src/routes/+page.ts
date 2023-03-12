// import type { PageLoad } from './$types'
// import { supabase } from '$lib/supabase/client';

// export const load: PageLoad = async ({ parent }) => {
//     await parent();

//     return {
//         ingredients: readIngredients(),
//         categories: readCategories(),
//         recipes: readRecipes()
//     };
// }

// const readIngredients = async () => {
//     const { data, error } = await supabase.from("ingredients").select();
//     return data;
// }

// const readCategories = async () => {
//     const { data: categories } = await supabase.from("categories").select();
//     return categories;
// }

// const readRecipes = async () => {
//     const { data: recipes } = await supabase.from("recipes").select();
//     return recipes;
// }

// const readIngredient = async () => {
//     const { data: ingredients } = await supabase.from("ingredients").select();
//     return ingredients;
// }