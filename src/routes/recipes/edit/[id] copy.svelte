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
    import Dialog from "../$lib/components/Dialog.svelte";

    // variables
    let recipeId = $page.params.id;
    let recipePromise = get("recipes", recipeId);
    let recipe;

    let imageDialog;

    $: instructions = recipe && recipe.instructions ? recipe.instructions : [];

    $: title = recipe && recipe.name ? recipe.name : "";

    // runtime functions
    onMount(async () => {
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

    let updateRecipe = async () => {
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

    let uploadFiles = [];
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

{#await recipePromise}
    <p>...waiting</p>
{:then recipe}
    <section class="flex contentr-center bg-secondary rounded">
        <ImageCarousel images={recipe.images} />

        <button
            on:click={imageDialog.show()}
            class="text-accent hover:text-white hover:bg-accent font-bold py-3 px-3 rounded-full focus:outline-none focus:shadow-outline"
            type="button"
        >
            add image +
        </button>

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
                            value={recipe.name}
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
                        <div role="status">
                            <svg
                                aria-hidden="true"
                                class="mr-2 w-8 h-8 text-primary animate-spin fill-accent"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    {:then tag}
                        <span
                            class="inline-block bg-accent rounded-full px-3 py-1 text-sm font-semibold mr-2"
                        >
                            #{tag.name}
                        </span>
                    {/await}
                {/each}
            </div>
            <div class="w-full py-3">
                <textarea
                    class="shadow appearance-none border border-accent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="recipename"
                    type="text"
                    placeholder="description"
                    value={recipe.description}
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
                            value={recipe.duration}
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
                            value={recipe.servings}
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
                        {#each recipe.ingredients as ingredient}
                            <li class="flex w-full">
                                <span class="w-1/6 text-base">
                                    <input
                                        class="shadow appearance-none border border-accent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="recipename"
                                        type="text"
                                        placeholder="quantity"
                                        value={ingredient.quantity}
                                    />
                                </span>
                                <span class="w-1/6 text-base">
                                    {ingredient.unit}
                                </span>
                                <span class="w-4/6 font-bold text-lg"
                                    >{ingredient.name}</span
                                >
                            </li>
                        {/each}

                        <li class="flex w-full">
                            <span class="w-1/6 text-base">
                                <input
                                    class="shadow appearance-none border border-accent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="recipename"
                                    type="text"
                                    placeholder="quantity"
                                />
                            </span>
                            <span class="w-1/6 text-base">
                                <!-- {ingredient.unit} -->
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
                        </li>
                    </ul>
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
                                value={instruction}
                            />
                        </p>
                    </section>
                {/each}
                <button
                    on:click={addInstruction}
                    class="text-accent hover:text-white hover:bg-accent font-bold py-3 px-3 rounded-full focus:outline-none focus:shadow-outline"
                    type="button"
                >
                    add instruction +
                </button>
            </div>
        </div>
    </section>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<style>
</style>
