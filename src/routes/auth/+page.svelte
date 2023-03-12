<script lang="ts">
	// svelte
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import { goto, invalidate } from "$app/navigation";

	// types
	import type { ActionData, PageData } from "../login/$types";
	import { dev } from "$app/environment";
	import { enhance, type SubmitFunction } from "$app/forms";
	import toast from "svelte-french-toast";

	// node_modules

	// components
	// import Card from "$lib/components/Card.svelte";

	//
	export let form: ActionData;
	export let data: PageData;

	// functions
	const reset: SubmitFunction = async ({ form, data, action, cancel }) => {
		return async ({ result, update }) => {
			await update();
		};
	};

	const login: SubmitFunction = async ({ form, data, action, cancel }) => {
		const { email } = Object.fromEntries(data);

		if (!email) {
			toast.error("email is required");
			cancel();
		}
		return async ({ result, update }) => {
			switch (result.type) {
				case "success":
					toast.success(
						"login request send. Please check ur emails!"
					);
					// applyAction(result);
					break;
				case "failure":
					toast.error(result.data.error);
					break;
				case "error":
					toast.error(result.data.error);
					break;
				default:
					break;
			}

			await update({ reset: false });
		};
	};

	const verify: SubmitFunction = async ({ form, data, action, cancel }) => {
		const { type, email, token } = Object.fromEntries(data);

		if (!type) {
			toast.error("type is required");
			cancel();
		}
		if (!email) {
			toast.error("email is required");
			cancel();
		}
		if (!token) {
			toast.error("token is required");
			cancel();
		}
		return async ({ result, update }) => {
			switch (result.type) {
				case "failure":
					toast.error(result.data.error);
					break;
				case "redirect":
					toast.success("token is verified.");
					break;
				case "error":
					toast.error(result.data.error);
					break;
				default:
					break;
			}

			await update({ reset: false });
		};
	};

	const logout: SubmitFunction = async ({ form, data, action, cancel }) => {
		// console.log(JSON.stringify(data.session, null, 2))

		return async ({ result, update }) => {
			switch (result.type) {
				case "success":
					toast.success("logout successful!");
					break;
				case "failure":
					toast.error(result.data.error);
					break;
				case "error":
					toast.error(result.data.error);
					break;
				default:
					break;
			}

			await update();
		};
	};
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login" />
</svelte:head>

<!-- {#if dev}
	<pre>
		{JSON.stringify(form, null, 2)}
	</pre>
{/if} -->

{JSON.stringify(data.session, null, 2)}
{#if !data.session}
	{#if !form?.type && form?.type != "success"}
		<form action="?/login" method="post" use:enhance={login}>
			<input
				type="hidden"
				name="type"
				value={form?.data?.type ?? "email"}
			/>
			<label for="email">Email</label>
			<input
				type="text"
				name="email"
				placeholder="email"
				value={form?.data?.email ?? "tonyflow90@gmail.com"}
			/>
			<button type="submit">login</button>
		</form>
	{:else}
		<form action="?/verify" method="post" use:enhance={verify}>
			<input
				type="hidden"
				name="type"
				value={form?.data?.type ?? "email"}
			/>
			<label for="email">Email</label>
			<input
				type="text"
				name="email"
				placeholder="email"
				value={form?.data?.email ?? ""}
			/>
			<label for="token">Token</label>
			<input
				type="text"
				name="token"
				placeholder="token"
				value={form?.data?.token ?? ""}
			/>
			<button type="submit">verify</button>
			<form action="?/reset" method="post" use:enhance={reset}>
				<button type="submit" formaction="?/reset">reset</button>
			</form>
		</form>
	{/if}
{:else}
	<form action="?/logout" method="post" use:enhance={logout}>
		<button type="submit">logout</button>
	</form>
{/if}

<style>
</style>
