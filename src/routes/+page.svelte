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
	export let data: PageData;
</script>

<svelte:head>
	<title>Recipes App</title>
	<meta name="description" content="Recipes App" />
</svelte:head>

<h1>Welcome to my Recipes-App</h1>

<style>
</style>
