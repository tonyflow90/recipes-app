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
    import {
        getCollection,
        get,
        update,
    } from "$lib/components/firebase/methods";
    import ImageCarousel from "$lib/components/ImageCarousel.svelte";
    import Tag from "$lib/components/Tag.svelte";
    import FavoriteButton from "$lib/components/FavoriteButton.svelte";
    import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import RoundButton from "$lib/components/RoundButton.svelte";
    import Button from "$lib/components/Button.svelte";
    import Dialog from "$lib/components/Dialog.svelte";

    // variables
    let recipeId = $page.params.id;
    let recipePromise = get("recipes", recipeId);
    let recipe;

    let unitsPromise = getCollection("units");
    let units;

    let imageDialog;

    $: instructions = recipe && recipe.instructions ? recipe.instructions : [];

    $: ingredients = recipe && recipe.ingredients ? recipe.ingredients : [];

    // $: igredients = recipe && recipe.igredients ? recipe.igredients : [];

    $: title = recipe && recipe.name ? recipe.name : "";

    // runtime functions
    onMount(async () => {
        units = await unitsPromise;
        recipe = await recipePromise;
    });

    // functions
    let addImage = async () => {
        recipe.images.push("");
        recipe.images = recipe.images;
    };

    let addInstruction = async () => {
        recipe.instructions.push("");
        recipe.instructions = recipe.instructions;
    };

    let addIngredient = async () => {
        recipe.ingredients.push({ name: "", quantity: 0, unit: "" });
        recipe.ingredients = recipe.ingredients;
    };

    let updateRecipe = async () => {
        let result = await update("recipes", recipe.uuid, recipe);
    };

    let uploadFiles = [];
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<Dialog bind:this={imageDialog}>
    <form class="grid gap-2" action="">
        <label
            class="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300"
        >
            <div class="flex flex-col items-center justify-center pt-7">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clip-rule="evenodd"
                    />
                </svg>
                <p
                    class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600"
                >
                    Select a photo
                </p>
            </div>
            <input type="file" files={uploadFiles} class="opacity-0" />
        </label>
        {#each uploadFiles as f}
            {f}
        {/each}
        <button
            on:click={addImage}
            class="hover:text-secondary text-accent hover:bg-accent bg-secondary border-accent border-2 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            type="button"
        >
            add image +
        </button>
        <button
            on:click={imageDialog.hide()}
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
        >
            cancel
        </button>
    </form>
</Dialog>

<!-- {#await recipePromise}
    <p>...waiting</p>
{:then r} -->
{#if recipe}
    <section class="bg-secondary rounded">
        <ImageCarousel images={recipe.images} />

        <Button>add image +</Button>

        <div class="container mx-auto flex items-center flex-wrap pt-4">
            <nav id="menu" class="w-full top-0 px-6 py-1">
                <div
                    class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-3"
                >
                    <div class="flex">
                        <input
                            class="shadow appearance-none border border-accent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="recipename"
                            type="text"
                            placeholder="name"
                            bind:value={recipe.name}
                        />
                    </div>

                    <div class="flex items-center" id="store-nav-content">
                        <div class="flex items-center" id="store-nav-content" />
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
                <textarea
                    class="shadow appearance-none border border-accent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="recipename"
                    type="text"
                    rows="5"
                    bind:value={recipe.description}
                />
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
                        <input
                            class="shadow appearance-none border border-accent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="recipename"
                            type="text"
                            placeholder="duration"
                            bind:value={recipe.duration}
                        />
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
                        <input
                            class="shadow appearance-none border border-accent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="recipename"
                            type="text"
                            placeholder="servings"
                            bind:value={recipe.servings}
                        />
                    </div>
                </div>

                <div class="pb-3">
                    <h2
                        class="tracking-wide no-underline hover:no-underline font-bold text-xl pb-3"
                    >
                        Ingredients
                    </h2>

                    <ul class="list-outside">
                        {#each ingredients as ingredient}
                            <li class="flex w-full">
                                <span class="w-1/6 text-base">
                                    <input
                                        class="shadow appearance-none border border-accent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="recipename"
                                        type="text"
                                        placeholder="quantity"
                                        bind:value={ingredient.quantity}
                                    />
                                </span>
                                {#await getCollection("units") then units}
                                    <span class="w-1/6 text-base">
                                        <select
                                            class="form-select appearance-none
                                            block
                                            w-full
                                            px-3
                                            py-1.5
                                            text-base
                                            font-normal
                                            text-gray-700
                                            bg-white bg-clip-padding bg-no-repeat
                                            border border-solid border-gray-300
                                            rounded
                                            transition
                                            ease-in-out
                                            m-0
                                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            aria-label="Default select example"
                                        >
                                            {#each units as u}
                                                <option
                                                    selected={ingredient.unit ==
                                                        u.short_name}
                                                    value={u.short_name}
                                                    >{u.short_name}</option
                                                >

                                                {u.name}
                                            {/each}
                                        </select>
                                    </span>
                                {:catch error}
                                    <p style="color: red">{error.message}</p>
                                {/await}
                                <!-- <span class="w-1/6 text-base">
                                    {ingredient.unit}
                                </span> -->
                                <span class="w-4/6 font-bold text-lg">
                                    <input
                                        class="shadow appearance-none border border-accent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="name"
                                        type="text"
                                        placeholder="name"
                                        bind:value={ingredient.name}
                                    />
                                </span>
                            </li>
                        {/each}

                        <!-- <li class="flex w-full">
                            <span class="w-1/6 text-base">
                                <input
                                    class="shadow appearance-none border border-accent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="recipename"
                                    type="text"
                                    placeholder="quantity"
                                />
                            </span>
                            <span class="w-1/6 text-base">
                                {ingredient.unit}
                            </span>
                            <span class="w-4/6 font-bold text-lg">
                                <select
                                    class="form-select appearance-none
                                        block
                                        w-full
                                        px-3
                                        py-1.5
                                        text-base
                                        font-normal
                                        text-gray-700
                                        bg-white bg-clip-padding bg-no-repeat
                                        border border-solid border-gray-300
                                        rounded
                                        transition
                                        ease-in-out
                                        m-0
                                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    aria-label="Default select example"
                                >
                                    <option selected value>t</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </span>
                        </li> -->
                    </ul>

                    <Button on:click={addIngredient}>add ingredient +</Button>
                </div>
            </div>
            <div class="flex flex-col self-start w-full md:w-2/3 lg:w-2/3 py-3">
                <h2
                    class="tracking-wide no-underline hover:no-underline font-bold text-xl pb-3"
                >
                    Instructions
                </h2>
                {#each instructions as instruction, i}
                    <section
                        class="flex w-full bg-white/25 rounded top-0 px-3 py-6 mb-3"
                    >
                        <div
                            class="flex content-center items-center justify-center w-12 h-12 rounded-full bg-accent font-bold text-xl mr-3"
                        >
                            {i + 1}
                        </div>
                        <p class="w-11/12">
                            <textarea
                                class="shadow appearance-none border border-accent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="recipename"
                                type="text"
                                placeholder="instruction {i + 1}"
                                rows="5"
                                bind:value={instruction}
                            />
                        </p>
                    </section>
                {/each}
                <Button on:click={addInstruction}>add instruction +</Button>
            </div>
        </div>
        <div class="flex fixed bottom-10 right-10">
            <button
                class="bg-green-500 hover:bg-green-700 p-0 w-16 h-16 rounded-full text-3xl text-white font-bold focus:outline-none focus:shadow-outline"
                type="button"
                on:click={updateRecipe}
            >
                💾
            </button>
        </div>
    </section>
{/if}

<!-- {:catch error}
    <p style="color: red">{error.message}</p>
{/await} -->
<style>
</style>
