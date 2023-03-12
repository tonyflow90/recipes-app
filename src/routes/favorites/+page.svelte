<script>
	import recipe from "$lib/data/recipe.js";

	import recipes from "$lib/stores/recipes.js";

</script>

<svelte:head>
	<title>Favorites</title>
	<meta name="description" content="Favorite list of recipes" />
</svelte:head>

<h1 class="text-6xl font-bold underline">Favorites</h1>

<div class="recipes">
	{#each $recipes as w}
		<li>
			<a sveltekit:prefetch href="recipes/{w.uuid}">{w.name}</a>
		</li>
	{/each}
</div>

<style>
</style>
