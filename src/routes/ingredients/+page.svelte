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

			await update({ reset: false });
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

<h1>add ingredient</h1>
<form action="?/add" method="post" use:enhance={add}>
	<label for="name">Name</label>
	<input type="text" name="name" bind:value={newIngredient.name} />
	<button type="submit">
		add <i class="fa-sharp fa-solid fa-plus" />
	</button>
</form>

<h1>ingredient list</h1>

<ul>
	{#each data.ingredients as ingredient}
		<li>
			<!-- <span class="flex">{ingredient.name}</span> -->
			<form action="?/update" method="post" use:enhance={update}>
				<input
					class="flex"
					type="text"
					name="name"
					placeholder="name"
					transparent="true"
					bind:value={ingredient.name}
				/>
				<input type="hidden" name="id" bind:value={ingredient.id} />
				<button type="submit">
					<i class="fa-sharp fa-regular fa-floppy-disk" />
				</button>
			</form>
			<form action="?/delete" method="post" use:enhance>
				<input type="hidden" name="id" bind:value={ingredient.id} />
				<button type="submit" transparent="true">
					<i class="fa-sharp fa-solid fa-trash-can" />
				</button>
			</form>
		</li>
	{/each}
</ul>

<style>
</style>
