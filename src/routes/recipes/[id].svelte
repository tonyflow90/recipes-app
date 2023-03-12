<script>
    // svelte libs
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import { goto } from "$app/navigation";

    // other libs

    // app stores
    import { user } from "$lib/stores/user";

    // app components
    import { get, update } from "$lib/components/firebase/methods";
    import ImageCarousel from "$lib/components/ImageCarousel.svelte";
    import Tag from "$lib/components/Tag.svelte";
    import FavoriteButton from "$lib/components/FavoriteButton.svelte";
    import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import RoundButton from "$lib/components/RoundButton.svelte";

    // variables
    let recipeId = $page.params.id;
    let recipePromise = get("recipes", recipeId);
    let recipe;

    $: servingsCount = recipe && recipe.servings ? recipe.servings : 0;

    $: isFav =
        recipe && recipe.favorites
            ? recipe.favorites.find((id) => id == $user.uid)
            : false;

    $: title = recipe && recipe.name ? recipe.name : "";

    // runtime functions
    onMount(async () => {
        recipe = await recipePromise;
    });

    // functions
    let addToFavorite = async () => {
        let r = await recipePromise;
        let bFav = r.favorites.find((id) => id == $user.uid);

        if (bFav) {
            recipe.favorites.pop($user.uid);
        } else {
            r.favorites.push($user.uid);
        }
        recipe = r;
        let result = await update("recipes", recipe.uuid, recipe);
    };
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

{#await recipePromise}
    <p>...waiting</p>
{:then recipe}
    <section class="bg-secondary rounded">
        <ImageCarousel images={recipe.images} />

        <div class="container mx-auto flex items-center flex-wrap pt-4">
            <nav id="menu" class="w-full top-0 px-6 py-1">
                <div
                    class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-3"
                >
                    <div class="flex">
                        <a
                            class="tracking-wide no-underline hover:no-underline font-bold text-xl"
                            href="{base}/recipes"
                        >
                            <h1>{recipe.name}</h1>
                        </a>
                    </div>

                    <div class="flex items-center" id="store-nav-content">
                        <div class="flex items-center" id="store-nav-content">
                            <LinkButton href="{base}/recipes/edit/{recipe.uuid}"
                                >edit</LinkButton
                            >
                            <FavoriteButton
                                on:click={addToFavorite}
                                favorite={isFav}
                            />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <div
            class="container mx-auto flex items-center flex-wrap top-0 px-6 py-1 pb-6"
        >
            <div class="w-full py-3">
                {#each recipe.tags as t}
                    {#await get("tags", t.id)}
                        <LoadingIndicator />
                    {:then tag}
                        <Tag name={tag.name} />
                    {/await}
                {/each}
            </div>
            <div class="w-full py-3">
                {recipe.description}
            </div>
            <div
                class="flex flex-col self-start w-full md:w-1/3 lg:w-1/3 md:float-rigth py-3"
            >
                <div class="pb-3">
                    <h2
                        class="tracking-wide no-underline hover:no-underline font-bold text-xl pb-3"
                    >
                        Duration
                    </h2>

                    <div
                        class="flex flex-wrap items-center justify-between w-48"
                    >
                        <span class="font-bold w-12 h-12"
                            >{recipe.duration}</span
                        >
                    </div>
                </div>

                <div class="pb-3">
                    <h2
                        class="tracking-wide no-underline hover:no-underline font-bold text-xl pb-3"
                    >
                        Servings
                    </h2>

                    <div
                        class="flex flex-wrap items-center justify-between w-48"
                    >
                        <RoundButton on:click={() => (servingsCount -= 1)}
                            >-</RoundButton
                        >
                        <span class="font-bold">{servingsCount}</span>
                        <RoundButton on:click={() => (servingsCount += 1)}
                            >+</RoundButton
                        >
                    </div>
                </div>

                <div class="pb-3">
                    <h2
                        class="tracking-wide no-underline hover:no-underline font-bold text-xl pb-3"
                    >
                        Ingredients
                    </h2>
                    <ul class="list-outside">
                        {#each recipe.ingredients as ingredient}
                            <li class="flex w-full">
                                <span class="w-1/6 text-base">
                                    {(ingredient.quantity / recipe.servings) *
                                        servingsCount}
                                </span>
                                <span class="w-1/6 text-base">
                                    {ingredient.unit}
                                </span>
                                <span class="w-4/6 font-bold text-lg"
                                    >{ingredient.name}</span
                                >
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
            <div class="flex flex-col self-start w-full md:w-2/3 lg:w-2/3 py-3">
                <h2
                    class="tracking-wide no-underline hover:no-underline font-bold text-xl pb-3"
                >
                    Instructions
                </h2>
                {#each recipe.instructions as instruction, i}
                    <section
                        class="flex w-full bg-white/25 rounded top-0 px-3 py-6 mb-3"
                    >
                        <div
                            class="flex content-center items-center justify-center w-12 h-12 rounded-full bg-accent font-bold text-xl mr-3"
                        >
                            {i + 1}
                        </div>
                        <p class="w-11/12">
                            {instruction}
                        </p>
                    </section>
                {/each}
            </div>
        </div>
    </section>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<style>
</style>
