import { supabase } from "../client";
import type { Ingredient } from "../types";

const TABLE = "ingredients"

export const addItem = (name: string) => {
    return supabase
        .from(TABLE)
        .insert({ name: name });
};

export const updateItem = (itemData: Ingredient) => {
    return supabase
        .from(TABLE)
        .update(itemData)
        .eq("id", itemData.id);
};

export const deleteItem = (itemData: Ingredient) => {
    return supabase
        .from(TABLE)
        .delete()
        .eq("id", itemData.id);
};
// const readItems = async () => {
//     const { data, error } = await supabase.from("ingredients").select();
//     if (error) {
//         showToast("No items found", "Error", 3000);
//         return [];
//     }
//     return data;
// };

// const update = async (item) => {
//     let id = item.id;
//     let name = "hello";
//     const { data, error } = await supabase
//         .from("ingredients")
//         .update({ name: name })
//         .eq("id", id);

//     if (error) {
//         showToast(error.message, "Error", 3000);
//         return;
//     }
//     showToast("item updated", "Success", 300000);
// };

// const deleteItem = async (item) => {
//     const id = item.id;
//     const { data, error } = await supabase
//         .from("ingredients")
//         .delete()
//         .eq("id", id);

//     if (error) {
//         showToast(error.message, "Error", 3000);
//         return;
//     }
//     showToast("item deleted", "Success", 300000);
// };