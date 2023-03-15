<script lang="ts">
	import "../app.postcss";
	import { supabase } from "$lib/supabase/client";
	import { goto, invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	// import "./styles.css";

	import type { PageData } from "./$types";
	import { dev } from "$app/environment";
	import { page } from "$app/stores";
	import { Toast, toastStore } from "@skeletonlabs/skeleton";
	import type { ToastSettings } from "@skeletonlabs/skeleton";
	import Login from "$lib/supabase/components/auth/Login.svelte";
	import Logout from "$lib/supabase/components/auth/Logout.svelte";
	import Navbar from "$lib/components/Navbar.svelte";

	import logo from "$lib/images/logo.png";

	import { AppShell, AppBar, AppRailTile } from "@skeletonlabs/skeleton";
	import { AppRail } from "@skeletonlabs/skeleton";
	import { writable, type Writable } from "svelte/store";

	// Your selected Skeleton theme:
	import "@skeletonlabs/skeleton/themes/theme-skeleton.css";

	// This contains the bulk of Skeletons required styles:
	import "@skeletonlabs/skeleton/styles/all.css";

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import "../app.postcss";

	import { LightSwitch } from "@skeletonlabs/skeleton";

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
		cssClasses: string;
	};

	let links: Link[] = [
		{
			name: "home",
			path: `${base}/`,
			cssClasses: "fa-sharp fa-solid fa-house",
		},
		{
			name: "favorites",
			path: `${base}/favorites`,
			cssClasses: "fa-sharp fa-solid fa-heart",
		},
		{
			name: "recipes",
			path: `${base}/recipes`,
			cssClasses: "fa-sharp fa-solid fa-book",
		},
		{
			name: "categories",
			path: `${base}/categories`,
			cssClasses: "fa-sharp fa-solid fa-tag",
		},
		{
			name: "ingredients",
			path: `${base}/ingredients`,
			cssClasses: "fa-sharp fa-solid fa-leaf",
		},
	];

	let opened: boolean = false;

	export let data: PageData;

	import { getContext } from "svelte";
	import { AuthApiError, type EmailOtpType } from "@supabase/supabase-js";

	let open: boolean = false;

	//
	let loading: boolean = false;
	let loginRequestSend: boolean = false;

	let email: string = "tonyflow90@gmail.com",
		type: EmailOtpType = "magiclink",
		token: string;

	const toastError: ToastSettings = {
		message: "",
		timeout: 1500,
		background: "variant-filled-warning",
	};

	const toastSuccess: ToastSettings = {
		message: "",
		timeout: 1500,
		background: "variant-filled-warning",
	};

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
			toastSuccess.message =
				"login request send. Please check ur emails!";
			toastStore.trigger(toastSuccess);
		} catch (error) {
			toastError.message = error.message;
			toastStore.trigger(toastError);
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
			toastSuccess.message =
				"token verified!";
			toastStore.trigger(toastSuccess);
		} catch (error) {
			toastError.message = error.message;
			toastStore.trigger(toastError);
		}
		loading = false;
	};

	const logout = async () => {
		try {
			let { error } = await supabase.auth.signOut();

			if (error) {
				if (error instanceof AuthApiError) {
					throw Error(error.message);
				}

				throw Error("Server error. Please try again later");
			}

			toastSuccess.message = "logout successful!";
			toastStore.trigger(toastSuccess);
			goto("/");
		} catch (error) {
			toastError.message = error.message;
			toastStore.trigger(toastError);
		}
	};
</script>

<Toast />

{#if !data.session && $page.url.pathname !== "/auth"}
	<AppShell>
		<div class="flex justify-center items-start p-4">
			{#if loading}
				<section class="card w-96">
					<div class="p-4 space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<div class="placeholder animate-pulse" />
						</div>
						<div class="grid grid-cols-4 gap-4">
							<div class="placeholder animate-pulse" />
						</div>
						<div class="placeholder animate-pulse" />
						<div class="grid grid-cols-2 gap-4">
							<div class="placeholder animate-pulse" />
						</div>
					</div>
				</section>
			{:else if !loginRequestSend}
				<div class="card w-96">
					<header class="card-header">
						<h2>Please login</h2>
					</header>
					<form on:submit|preventDefault={login}>
						<section class="p-4">
							<input
								type="hidden"
								name="type"
								bind:value={type}
							/>
							<label class="label">
								<span>Email</span>
								<input
									class="input"
									type="text"
									name="email"
									placeholder="email"
									bind:value={email}
								/>
							</label>
						</section>
						<footer class="card-footer">
							<button class="btn variant-filled" type="submit"
								>login</button
							>
						</footer>
					</form>
				</div>
			{:else}
				<div class="card w-96">
					<header class="card-header">
						<h2>Please login</h2>
					</header>
					<form on:submit|preventDefault={verify}>
						<section class="p-4">
							<input
								type="hidden"
								name="type"
								bind:value={type}
							/>
							<label class="label">
								<span>Email</span>
								<input
									class="input"
									type="text"
									name="email"
									placeholder="email"
									disabled
									bind:value={email}
								/>
							</label>
							<label class="label">
								<span>Token</span>
								<input
									class="input"
									type="text"
									name="token"
									placeholder="token"
									bind:value={token}
								/>
							</label>
						</section>
						<footer class="card-footer">
							<button class="btn variant-filled" type="submit"
								>verify</button
							>
							<button class="btn variant-filled" on:click={reset}
								>reset</button
							>
						</footer>
					</form>
				</div>
			{/if}
		</div>
	</AppShell>
{:else}
	<AppShell>
		<svelte:fragment slot="header">
			<AppBar
				gridColumns="grid-cols-3"
				slotDefault="place-self-center"
				slotTrail="place-content-end"
			>
				<svelte:fragment slot="lead">
					<button
						type="button"
						class="btn bg-initial"
						on:click={() => {
							opened = !opened;
						}}
					>
						<i class="fa-sharp fa-solid fa-bars" />
					</button>
				</svelte:fragment>
				<a href={base}>
					<img class="w-12 h-12" src={logo} alt="Logo" />
				</a>
				<svelte:fragment slot="trail">
					<LightSwitch />
				</svelte:fragment>
			</AppBar>
		</svelte:fragment>
		<svelte:fragment slot="sidebarLeft">
			<div style="height:100%" hidden={opened}>
				<AppRail>
					{#each links as link}
						<AppRailTile
							tag="a"
							label={link.name}
							href={link.path}
							class={link.path === $page.url.pathname
								? "!bg-primary-500"
								: ""}
						>
							<i class={link.cssClasses} />
						</AppRailTile>
					{/each}
					<svelte:fragment slot="trail">
						<AppRailTile>
							<button
								type="button"
								class="btn bg-initial"
								on:click|preventDefault={logout}
							>
								<i
									class="fa-sharp fa-solid fa-right-from-bracket"
								/>
							</button>
						</AppRailTile>
					</svelte:fragment>
				</AppRail>
			</div>
		</svelte:fragment>
		<svelte:fragment slot="pageHeader" />
		<div class="flex justify-center items-start pt-4 pl-4 pr-4">
			<div class="max-w-full">
				<slot />
			</div>
		</div>
		<!-- <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
		<svelte:fragment slot="footer">Footer</svelte:fragment> -->
	</AppShell>
{/if}

<style>
</style>
