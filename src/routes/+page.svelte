<script lang="ts">
	// svelte
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import { invalidate } from "$app/navigation";

	// types
	import type { PageData } from "./$types";
	import { dev } from "$app/environment";
	import { enhance } from "$app/forms";
	// import type { Ingredient } from "$lib/supabase/types";

	// node_modules

	// components
	// import Card from "$lib/components/Card.svelte";

	//

	let ingredient: Ingredient = {
		id: "",
		name: "",
		created_at: new Date(),
		updated_at: new Date(),
	};

	export let data: PageData;
</script>

<svelte:head>
	<title>Supabase + SvelteKit</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if dev}
	<button
		type="button"
		on:click={() => {
			let pageData = document.getElementById("pageData");
			if (pageData.style.display == "none") {
				pageData.style.display = "block";
			} else {
				pageData.style.display = "none";
			}
		}}>show page data</button
	>
	<pre id="pageData" style="display: none;">
		{JSON.stringify($page.data, null, 2)}
	</pre>
{/if}

<h1>add ingredient</h1>
<form action="?/addIngredient" method="post" use:enhance>
	<label for="name">Name</label>
	<input type="text" name="name" bind:value={ingredient.name} />
	<button type="submit">
		add<i class="fa-sharp fa-solid fa-plus" />
	</button>
</form>

<h1>ingredient list</h1>
<ul>
	{#each data.ingredients as ingredient}
		<li>
			<!-- <span class="flex">{ingredient.name}</span> -->
			<input
				class="flex"
				type="text"
				name="name"
				placeholder="name"
				transparent="true"
				bind:value={ingredient.name}
			/>
			<form action="?/updateIngredient" method="post" use:enhance>
				<input type="hidden" name="id" bind:value={ingredient.id} />
				<button type="submit"> update </button>
			</form>
			<form action="?/deleteIngredient" method="post" use:enhance>
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
