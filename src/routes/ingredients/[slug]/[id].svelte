<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    import recipes from "$lib/stores/recipes.js";

    import ListItem from "$lib/ListItem.svelte";

    onMount(async () => {
        let id = $page.params.id;
        recipeIndex = $recipes.findIndex((w) => w.uuid == id);
    });

    let addExercise = () => {
        $recipes[recipeIndex].exercises = [
            ...$recipes[recipeIndex].exercises,
            new Exercise(),
        ];
    };

    let recipeIndex = undefined;

    $: recipe = $recipes[recipeIndex];
</script>

<svelte:head>
    <!-- <title>{recipe.name}</title> -->
</svelte:head>

{#if recipe != undefined}
    <button on:click={addExercise}>add +</button>

    <div class="recipes">
        <h1>{recipe.name}</h1>

        <ul>
            {#each recipe.exercises as e, i}
                <ListItem>
                    <div slot="icon">
                        <span>&#127947;</span>
                    </div>
                    <a
                        class="list-item-content"
                        href="/recipes/{recipe.uuid}/exercise/{e.uuid}"
                    >
                        <span>
                            {e.name}
                        </span>
                        <span>
                            {e.time / 1000}
                        </span>
                    </a>
                </ListItem>
                <ListItem>
                    <div slot="icon">
                        <span>&#9749;</span>
                    </div>
                    <div class="list-item-content">
                        <span> Pause </span>
                        <span class="seconds">
                            {recipe.pauseTime / 1000}
                        </span>
                    </div>
                </ListItem>
            {/each}
        </ul>
    </div>
{/if}

<style>
</style>
