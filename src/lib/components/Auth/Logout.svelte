<script lang="ts">
    // svelte
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    // types
    import toast from "svelte-french-toast";
    import { supabase } from "$lib/supabase/client";
    import { AuthApiError } from "@supabase/supabase-js";

    // functions
    const logout = async () => {
        try {
            let { error } = await supabase.auth.signOut();

            if (error) {
                if (error instanceof AuthApiError) {
                    throw Error(error.message);
                }

                throw Error("Server error. Please try again later");
            }

            toast.success("logout successful!");
            goto("/");
        } catch (error) {
            toast.error(error.message);
        }
    };
</script>

{#if $page.data.session}
    <form on:submit|preventDefault={logout}>
        <button transparent="true" type="submit">
            <slot />
            <i class="fa-sharp fa-solid fa-arrow-right-from-bracket" />
        </button>
    </form>
{/if}

<style>
    form {
        display: flex;
        flex-direction: row;
    }
</style>
