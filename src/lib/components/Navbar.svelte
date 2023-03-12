<script lang="ts">
    // svelte
    import { base } from "$app/paths";
    import { page } from "$app/stores";

    // node_modules

    // components

    //
    export let links: Object[] = [];

    export let opened: boolean = false;
</script>

<div class="navbar" class:opened>
    <ul class="navbar-items">
        {#each links as link}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li
                class="navbar-item"
                class:active={$page.url.pathname === link.path}
                on:click={() => (opened = false)}
            >
                <a data-sveltekit-prefetch href={link.path}>
                    <span>{link.name}</span>
                </a>
            </li>
        {/each}
    </ul>
    <div class="navbar-bottom">
        <slot name="bottom" />

        <!-- <slot name="bottom" />
        <ul class="navbar-bottom-grid">
            {#each links2 as link}
                svelte-ignore a11y-click-events-have-key-events
                <li
                    class:active={$page.url.pathname === link.path}
                    on:click={() => (opened = false)}
                >
                    <a data-sveltekit-prefetch href={link.path}>
                        <span>{link.name}</span>
                    </a>
                </li>
            {/each}
            <li class="">
                <button rounded inverted on:click>Sign Out</button>
            </li>
        </ul> -->
    </div>

    <!-- <div class="navbar-background-pattern" /> -->
</div>

<style>
    .navbar {
        display: flex;
        height: 100vh;
        width: var(--navbar-width, 400px);
        align-items: center;
        background-color: var(--navbar-bg-color, black);
        position: fixed;
        overflow: hidden;
    }

    .navbar-bottom {
        display: flex;
        width: 100%;
        position: absolute;
        bottom: 0;
    }

    .navbar-item {
        display: block;
        list-style: none;
        border: none;
        transition: opacity 700ms ease;
    }

    .navbar-item a {
        color: var(--navbar-text-color, white);
        font-size: clamp(2rem, 2vw, 2rem);
        font-family: var(--navbar-font-family, "Fira Mono", monospace);

        text-decoration: none;
        padding: clamp(0.25rem, 0.5vw, 1rem) 0rem;
    }

    .navbar-items {
        z-index: 2;
        margin-left: calc(var(--navbar-width, 400px) * 0.1);
    }
    .navbar-items:hover > .navbar-item {
        opacity: 0.3;
    }

    .navbar-items:hover > .navbar-item:hover {
        opacity: 1;
    }

    .navbar-item.active a {
        color: var(--navbar-text-active-color, white);
    }
</style>
