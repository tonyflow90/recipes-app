<script lang="ts">
	import { supabase } from "$lib/supabase/client";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import "./styles.css";

	import type { PageData } from "./$types";
	import { dev } from "$app/environment";
	import { page } from "$app/stores";
	import toast, { Toaster } from "svelte-french-toast";
	import Login from "$lib/supabase/components/auth/Login.svelte";
	import Logout from "$lib/supabase/components/auth/Logout.svelte";
	import Navbar from "$lib/components/Navbar.svelte";

	import logo from "$lib/images/logo.png";
	import Modal from "$lib/components/Modal.svelte";

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

	type Link = {
		name: string;
		path: string;
	};

	let links: Link[] = [
		{ name: "home", path: `${base}/` },
		{ name: "favorites", path: `${base}/favorites` },
		{ name: "recipes", path: `${base}/recipes` },
		{ name: "categories", path: `${base}/categories` },
		{ name: "ingredients", path: `${base}/ingredients` },
	];

	let isOpen: boolean = false;

	export let data: PageData;

	import { getContext } from "svelte";
	// const { close } = getContext('simple-modal');
	let open: boolean = false;
</script>

<Toaster />

<!-- <Modal bind:open>
	<div slot="header">
		<h2>HELLO</h2>
	</div>
	<div slot="bottom">
		<button type="button" on:click={() => (open = !open)}>close</button>
	</div>
</Modal> -->

<div class="app">
	<!-- {#if dev}
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
	{/if} -->

	{#if !data.session && $page.url.pathname !== "/auth"}
		<main>
			<h2>Please login</h2>
			<Login />
		</main>
	{:else}
		<nav class:navbar-opened={isOpen}>
			<Navbar bind:opened={isOpen} {links}>
				<div class="navbar-bottom" slot="bottom">
					<a
						class="big nav-link"
						data-sveltekit-prefetch
						href="{base}/settings"
					>
						<i class="fa-sharp fa-solid fa-gear" />
					</a>
					<a
						class="big nav-link"
						data-sveltekit-prefetch
						href="{base}/profile"
					>
						<i class="fa-sharp fa-regular fa-user" />
					</a>
					{#if $page.data.session}
						<div class="big flex flex-end">
							<Logout />
						</div>
						<!-- <form on:submit|preventDefault={logout}>
							<button
								class="big flex flex-end"
								transparent
								type="submit"
								on:click={() => (isOpen = !isOpen)}
							>
								<i
									class="fa-sharp fa-solid fa-arrow-right-from-bracket"
								/>
							</button>
						</form> -->
					{/if}
				</div>
				<Logout />
			</Navbar>
		</nav>

		<header class:navbar-opened={isOpen}>
			<div class="header-item">
				{#if isOpen}
					<button
						transparent
						class="header-item big"
						on:click={() => (isOpen = !isOpen)}
					>
						<i class="fa-sharp fa-solid fa-xmark" />
					</button>
				{:else}
					<button
						transparent
						class="header-item big"
						on:click={() => (isOpen = !isOpen)}
					>
						<i class="fa-sharp fa-solid fa-bars" />
					</button>
				{/if}
			</div>
			<a class="header-item flex" href={base}>
				<img class="logo" src={logo} alt="Logo" />
			</a>
			<div class="header-item">
				<!-- <Darkmode /> -->
			</div>
		</header>
		<main class:navbar-opened={isOpen}>
			<slot />
		</main>
	{/if}
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100vw;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		overflow-x: hidden;
	}

	nav {
		display: flex;
		height: 100vh;
		width: var(--navbar-width);
		transform: translateX(calc(var(--navbar-width) * -1));
		-webkit-transform: translateX(calc(var(--navbar-width) * -1));
		position: fixed;
		transition: transform 700ms ease;
		overflow-x: hidden;
	}

	nav.navbar-opened {
		transform: translateX(0%);
		-webkit-transform: translateX(0%);
	}

	header {
		display: flex;
		align-items: center;
		gap: 2rem;
		width: 100vw;
		height: 10vh;
		max-height: 96px;
		transform: translateX(0px);
		-webkit-transform: translateX(0px);
		transition: transform 700ms ease;
		justify-content: space-between;
	}

	header.navbar-opened {
		transform: translateX(var(--navbar-width));
		-webkit-transform: translateX(var(--navbar-width));
	}

	.header-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20vw;
	}

	.logo {
		max-width: 120px;
		max-height: 7vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		width: 100vw;
		min-height: 90vh;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	main {
		transition: transform 700ms ease;
		position: relative;
		transform: translateX(0px);
		-webkit-transform: translateX(0px);
	}

	main.navbar-opened {
		transform: translateX(var(--navbar-width));
		-webkit-transform: translateX(var(--navbar-width));
	}

	.navbar-bottom {
		display: flex;
		width: 100%;
		flex-direction: row;
		margin: 0.5rem 1rem;
	}

	@media (min-width: 480px) {
		.header-item {
			width: 150px;
		}
	}
</style>
