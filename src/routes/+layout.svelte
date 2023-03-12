<script lang="ts">
	import { supabase } from "$lib/supabase/client";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import "./styles.css";

	import type { PageData } from "./$types";
	import { dev } from "$app/environment";
	import { page } from "$app/stores";
	import toast, { Toaster } from "svelte-french-toast";
	import Login from "$lib/components/Auth/Login.svelte";
	import Logout from "$lib/components/Auth/Logout.svelte";

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(() => {
			invalidate("supabase:auth");
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	export let data: PageData;
</script>

<Toaster />

<div class="app">
	{#if dev}
		<button
			type="button"
			on:click={() => {
				let sessionData = document.getElementById("sessionData");
				if (sessionData.style.display == "none") {
					sessionData.style.display = "block";
				} else {
					sessionData.style.display = "none";
				}
			}}>show session data</button
		>
		<pre id="sessionData" style="display: none;">
			{JSON.stringify($page.data.session, null, 2)}
		</pre>
	{/if}

	{#if !data.session && $page.url.pathname !== "/auth"}
		<main>
			<h1>Please login</h1>
			<Login />
		</main>
	{:else}
		<Logout />
		<main>
			<slot />
		</main>
	{/if}
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
