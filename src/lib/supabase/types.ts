import type { EmailOtpType } from "@supabase/supabase-js"

export type Login = {
    email: string,
    type: EmailOtpType,
    token: string
}

export type Ingredient = {
    id: string,
    name: string,
    created_at: Date,
    updated_at: Date
}

export type Category = {
    id: string,
    name: string,
    created_at: Date,
    updated_at: Date
}

export type Recipe = {
    id: string,
    title: string,
    description: string,
    image_url: URL,
    prep_time: number,
    cook_time: number,
    servings: number,
    created_at: Date,
    updated_at: Date
}