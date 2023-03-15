<script lang="ts">
	// svelte
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import { invalidate } from "$app/navigation";

	// types
	import type { PageData } from "./$types";
	import { enhance, type SubmitFunction } from "$app/forms";
	import type { Category } from "$lib/supabase/types";
	import toast from "svelte-french-toast";

	// node_modules

	// components

	//
	let newCategory: Category = {
		id: "",
		name: "",
		created_at: new Date(),
		updated_at: new Date(),
	};

	export let data: PageData;

	let categories: Category[];

	let edit: boolean = false;

	let dialogOpened: boolean = false;

	const add: SubmitFunction = async ({ form, data, action, cancel }) => {
		const { name } = Object.fromEntries(data);

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
			else {
				dialogOpened = false;
				await update();
			}
		};
	};
</script>

<svelte:head>
	<title>Categories</title>
	<meta name="description" content="Category list" />
</svelte:head>

<div class="head">
	<h2 class="flex">category list</h2>

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

<div class="container">
	<div class="container-2">
		{#await data.categories}
			<p>loading data ...</p>
		{:then categories}
			{#each categories as category}
				<div class="tag">
					<span>
						{category.name}
					</span>
					{#if edit}
						<form action="?/delete" method="post" use:enhance>
							<input
								type="hidden"
								name="id"
								bind:value={category.id}
							/>
							<button type="submit" transparent>
								<i class="fa-sharp fa-solid fa-trash-can" />
							</button>
						</form>
					{/if}
				</div>
			{/each}
		{/await}
	</div>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog open={dialogOpened} on:close={() => (dialogOpened = false)}>
	<button
		transparent
		class="rounded dialog-close-btn"
		on:click={() => (dialogOpened = !dialogOpened)}
		><i class="fa-sharp fa-solid fa-circle-xmark" /></button
	>
	<div on:click|stopPropagation>
		<h3>add category</h3>
		<form action="?/add" method="post" use:enhance={add}>
			<label for="name">Name</label>
			<input
				type="text"
				name="name"
				transparent
				bind:value={newCategory.name}
			/>
			<button type="submit">
				<i class="fa-sharp fa-solid fa-plus" />
			</button>
		</form>
	</div>
</dialog>

<style>
	.container {
		align-items: center;
	}
	.container-2 {
		display: block;
	}

	span {
		font-weight: 600;
		letter-spacing: 0.2rem;
	}

	.container-2 * {
		float: left;
	}
</style>
