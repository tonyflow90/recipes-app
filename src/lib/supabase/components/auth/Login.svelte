<script lang="ts">
    // svelte
    import { page } from "$app/stores";

    // types
    import toast from "svelte-french-toast";
    import { supabase } from "$lib/supabase/client";
    import { AuthApiError, type EmailOtpType } from "@supabase/supabase-js";

    //
    let loading: boolean = false;
    let loginRequestSend: boolean = false;

    let email: string = "tonyflow90@gmail.com",
        type: EmailOtpType = "magiclink",
        token: string;

    // functions
    const reset = async () => {
        loginRequestSend = false;
        email = "";
        token = "";
    };

    const login = async () => {
        loading = true;
        try {
            if (!email) {
                throw Error("email is required");
            }

            const { error } = await supabase.auth.signInWithOtp({
                email: String(email),
                options: { shouldCreateUser: false },
            });

            if (error) {
                if (error instanceof AuthApiError) {
                    throw Error(error.message);
                }

                throw Error("Server error. Please try again later");
            }

            loginRequestSend = true;
            toast.success("login request send. Please check ur emails!");
        } catch (error) {
            toast.error(error.message);
        }
        loading = false;
    };

    const verify = async () => {
        loading = true;
        try {
            if (!type) {
                throw Error("type is required");
            }
            if (!email) {
                throw Error("email is required");
            }
            if (!token) {
                throw Error("token is required");
            }

            const { data, error } = await supabase.auth.verifyOtp({
                email: String(email),
                token: String(token),
                type: type,
            });

            if (error) {
                if (error instanceof AuthApiError) {
                    throw Error(error.message);
                }

                throw Error("Server error. Please try again later");
            }

            reset();
            toast.success("token is verified.");
        } catch (error) {
            toast.error(error.message);
        }
        loading = false;
    };
</script>

{#if !$page.data.session}
    {#if !loginRequestSend}
        <form on:submit|preventDefault={login}>
            <input type="hidden" name="type" bind:value={type} />
            <label for="email">Email</label>
            <input
                type="text"
                name="email"
                placeholder="email"
                bind:value={email}
            />
            <button type="submit">login</button>
        </form>
    {:else}
        <form on:submit|preventDefault={verify}>
            <input type="hidden" name="type" bind:value={type} />
            <label for="email">Email</label>
            <input
                type="text"
                name="email"
                placeholder="email"
                disabled
                bind:value={email}
            />
            <label for="token">Token</label>
            <input
                type="text"
                name="token"
                placeholder="token"
                bind:value={token}
            />
            <button type="submit">verify</button>
            <form on:submit|preventDefault={reset}>
                <button type="submit">reset</button>
            </form>
        </form>
    {/if}
{/if}

<style>
</style>
