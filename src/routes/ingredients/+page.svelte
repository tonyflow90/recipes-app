<script lang="ts">
	// svelte
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import { invalidate } from "$app/navigation";

	// types
	import type { PageData } from "./$types";
	import { enhance, type SubmitFunction } from "$app/forms";
	import type { Ingredient } from "$lib/supabase/types";
	import toast from "svelte-french-toast";

	// node_modules

	// components

	//
	let newIngredient: Ingredient = {
		id: "",
		name: "",
		created_at: new Date(),
		updated_at: new Date(),
	};

	let edit: boolean = false;

	let dialogOpened: boolean = false;

	export let data: PageData;

	// functions
	const add: SubmitFunction = async ({ form, data, action, cancel }) => {
		const { name } = Object.fromEntries(data);

		if (!name) {
			toast.error("name is required");
			cancel();
		}
		return async ({ result, update }) => {
			switch (result.type) {
				case "success":
					toast.success("ingredient added!");
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

			if (result.type != "success") await update({ reset: false });
			else {
				dialogOpened = false;
				await update();
			}
		};
	};

	const update: SubmitFunction = async ({ form, data, action, cancel }) => {
		const { id, name } = Object.fromEntries(data);

		if (!id) {
			toast.error("id is required");
			cancel();
		}
		if (!name) {
			toast.error("name is required");
			cancel();
		}
		return async ({ result, update }) => {
			switch (result.type) {
				case "success":
					toast.success("ingredient updated!");
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

			if (result.type != "success") await update({ reset: false });
			else await update();
		};
	};
</script>

<svelte:head>
	<title>Ingredients</title>
	<meta name="description" content="Ingredient list" />
</svelte:head>

<div class="head">
	<h2 class="flex">ingredient list</h2>

	<button transparent on:click={() => (edit = !edit)}>
		{#if edit}
			<i class="fa-sharp fa-solid fa-minus" />
		{:else}
			<i class="fa-sharp fa-solid fa-pen-to-square" />
		{/if}
	</button>

	<button transparent on:click={() => (dialogOpened = !dialogOpened)}>
		<i class="fa-sharp fa-solid fa-plus" />
	</button>
</div>

<ul class="container">
	{#each data.ingredients as ingredient}
		<li>
			<!-- <span class="flex">{ingredient.name}</span> -->
			<form
				class="flex"
				action="?/update"
				method="post"
				use:enhance={update}
			>
				<input
					class="flex"
					type="text"
					name="name"
					placeholder="name"
					transparent
					disabled={!edit}
					bind:value={ingredient.name}
				/>
				<input type="hidden" name="id" bind:value={ingredient.id} />
				<button type="submit" disabled={!edit} hidden={!edit}>
					<i class="fa-sharp fa-regular fa-floppy-disk" />
				</button>
			</form>
			<form hidden={!edit} action="?/delete" method="post" use:enhance>
				<input type="hidden" name="id" bind:value={ingredient.id} />
				<button
					type="submit"
					transparent
					disabled={!edit}
					hidden={!edit}
				>
					<i class="fa-sharp fa-solid fa-trash-can" />
				</button>
			</form>
		</li>
	{/each}
</ul>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog open={dialogOpened} on:close={() => (dialogOpened = false)}>
	<button
		transparent
		class="rounded dialog-close-btn"
		on:click={() => (dialogOpened = !dialogOpened)}
		><i class="fa-sharp fa-solid fa-circle-xmark" /></button
	>
	<div on:click|stopPropagation>
		<h3>add ingredient</h3>
		<form action="?/add" method="post" use:enhance={add}>
			<label for="name">Name</label>
			<input
				type="text"
				name="name"
				transparent
				bind:value={newIngredient.name}
			/>
			<button type="submit">
				<i class="fa-sharp fa-solid fa-plus" />
			</button>
		</form>
	</div>
</dialog>

<style>
	li form {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}
</style>
