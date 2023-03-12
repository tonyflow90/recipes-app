<script>
	// svelte libs
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { goto } from "$app/navigation";

	// other libs

	// app stores
	import { user } from "$lib/stores/user";

	// app components
	import { getCollection, get } from "$lib/components/firebase/methods";
	import Tag from "$lib/components/Tag.svelte";
	import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
	import LinkButton from "$lib/components/LinkButton.svelte";

	// variables
	let recipes;

	// runtime functions
	onMount(async () => {
		import("darkmode-component");
	});

	// functions
</script>

<svelte:head>
	<title>Recipes</title>
	<meta name="description" content="A recipe list" />
</svelte:head>

{#await getCollection("recipes")}
	<p>...waiting</p>
{:then recipes}
	<section class="bg-secondary py-8 rounded">
		<div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
			<nav id="store" class="w-full top-0 px-6 py-1">
				<div
					class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3"
				>
					<a
						class="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl "
						href="{base}/recipes"
					>
						<h1>Recipes</h1>
					</a>

					<div class="flex items-center" id="store-nav-content">
						<LinkButton href="{base}/recipes/create">
							new Recipe
						</LinkButton>
						<LinkButton href="#">
							<svg
								class="fill-current text-accent hover:text-white hover:bg-accent rounded"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							>
								<path
									d="M7 11H17V13H7zM4 7H20V9H4zM10 15H14V17H10z"
								/>
							</svg>
						</LinkButton>
						<LinkButton href="#">
							<svg
								class="fill-current text-accent hover:text-white hover:bg-accent rounded"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							>
								<path
									d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z"
								/>
							</svg>
						</LinkButton>
					</div>
				</div>
			</nav>

			{#each recipes as r}
				<div class="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col">
					<a href="{base}/recipes/{r.uuid}">
						<img
							class="hover:grow hover:shadow-lg w-full"
							src={r.images[0].src}
						/>
						<div class="pt-3 flex items-center justify-between">
							<p class="font-bold">{r.name}</p>
						</div>
					</a>
					<div class="flex overflow-hidden pt-2">
						{#each r.tags as t}
							{#await get("tags", t.id)}
								<LoadingIndicator />
							{:then tag}
								<Tag name={tag.name} />
							{/await}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<style>
	.work-sans {
		font-family: "Work Sans", sans-serif;
	}

	#menu-toggle:checked + #menu {
		display: block;
	}

	.hover\:grow {
		transition: all 0.3s;
		transform: scale(1);
	}

	.hover\:grow:hover {
		transform: scale(1.02);
	}

	.carousel-open:checked + .carousel-item {
		position: static;
		opacity: 100;
	}

	.carousel-item {
		-webkit-transition: opacity 0.6s ease-out;
		transition: opacity 0.6s ease-out;
	}

	#carousel-1:checked ~ .control-1,
	#carousel-2:checked ~ .control-2,
	#carousel-3:checked ~ .control-3 {
		display: block;
	}

	.carousel-indicators {
		list-style: none;
		margin: 0;
		padding: 0;
		position: absolute;
		bottom: 2%;
		left: 0;
		right: 0;
		text-align: center;
		z-index: 10;
	}

	#carousel-1:checked
		~ .control-1
		~ .carousel-indicators
		li:nth-child(1)
		.carousel-bullet,
	#carousel-2:checked
		~ .control-2
		~ .carousel-indicators
		li:nth-child(2)
		.carousel-bullet,
	#carousel-3:checked
		~ .control-3
		~ .carousel-indicators
		li:nth-child(3)
		.carousel-bullet {
		color: #000;
		/*Set to match the Tailwind colour you want the active one to be */
	}
</style>
