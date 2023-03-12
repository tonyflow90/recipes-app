<script>
    import { fade } from "svelte/transition";
    import { dismissToast, toastMessage, toastType } from "$lib/components/toastStore";
</script>

{#if $toastMessage}
    <div class="toast-container">
        <section class="toast" transition:fade>
            <div class="toast-icon">
                {#if $toastType == "error" || $toastType == "failure"}
                    &#9888;
                {:else if $toastType == "success"}
                    &#10003;
                {:else}
                    &#8505;
                {/if}
            </div>
            <div class="toast-text">
                {$toastMessage}
            </div>

            <button class="toast-close-button" on:click={dismissToast}>x</button
            >
        </section>
    </div>
{/if}

<style>
    .toast-container {
        display: flex;
        position: absolute;
        min-height: 10vh;
        bottom: 0;
        width: 100vw;
        align-items: center;
        justify-content: center;
        z-index: 100;
    }

    .toast {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        background-color: var(--toast-bg-color);
        color: var(--toast-text-color);
        min-width: 200px;
        padding: 0.5rem;
        margin: 0.5rem;
        font-size: 1.2rem;
    }

    .toast * {
        margin: 0.5rem;
    }

    .toast-icon {
        color: var(--toast-accent-color);
        font-size: 2rem;
        font-weight: 500;
    }

    .toast-text {
        flex-grow: 1;
        text-align: center;
    }

    .toast-close-button {
        font-size: 2rem;
        background-color: transparent;
        border: none;
        color: var(--toast-accent-color);
        transform: scale(0.9);
        font-weight: 500;
    }

    .toast-close-button:hover {
        transform: scale(1);
    }
</style>
