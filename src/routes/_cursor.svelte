<script>
import { onMount } from 'svelte';

    import store from '../stores.js'
    // Handles cursor movement
    let cursorNode;
    onMount(() => {
        cursorNode = document.getElementById("cursor")
    })
    function handleCursor(e){
        let target = e.target.dataset.cursor
        if(target){
            if($store.cursor == "default"){
                if(target == "interact"){
                    $store.cursor = "interact"
                }
            }
        }
        else{
            $store.cursor = "default"
        }
        // Set cursor position
        cursorNode.style.left = e.clientX - 8 + "px"
        cursorNode.style.top = e.clientY - 1 + "px"
    }
</script>

<span id="cursor">
    <!-- Did not include svg parent as d-path attribute does not update. Why??? -->
    {#if $store.cursor == "default"}
    <svg xmlns="http://www.w3.org/2000/svg" class="cursor-icon" style="transform: rotate(-90deg)" viewBox="-2 -2 24 24" width="1.5rem" fill="#000"><path d="M18.919 2.635l-5.953 16.08c-.376 1.016-1.459 1.538-2.418 1.165a1.851 1.851 0 0 1-1.045-1.054l-1.887-4.77a3.712 3.712 0 0 0-1.955-2.052l-4.542-1.981C.174 9.61-.256 8.465.157 7.465a1.97 1.97 0 0 1 1.067-1.079L16.54.136c.967-.395 2.04.101 2.395 1.109.157.446.151.94-.015 1.39z"/></svg>
    {:else}
    <svg xmlns="http://www.w3.org/2000/svg" class="cursor-icon" style="transform: rotate(-90deg)" viewBox="-1 -2 24 24" width="1.5rem" fill="#000"><path d="M15.092 8.02l-2.829-2.828L16.506.95a1 1 0 0 1 1.414 0l1.415 1.414a1 1 0 0 1 0 1.414l-4.243 4.243zm-1.414 1.415l-9.9 9.9a1 1 0 0 1-1.414 0L.95 17.92a1 1 0 0 1 0-1.414l9.9-9.9 2.828 2.829zM8.728.243l1.393.704 1.435-.704-.679 1.46.68 1.368-1.384-.664-1.445.664.689-1.42-.69-1.408zm9.9 7.07l1.393.705 1.435-.704-.68 1.46.68 1.368-1.384-.664-1.445.664.69-1.42-.69-1.408z"/></svg>
    {/if}
</span>
<svelte:window on:mousemove={(e) => handleCursor(e)}/>
<style lang="scss">
    .cursor-icon{
        filter: drop-shadow(0 0 0.7rem white) drop-shadow(-0.2rem 0.3rem 0.1rem rgba(0,0,0,0.7));
    }
    #cursor{
        transform: translateX(calc(8px - 0.1rem));
        z-index:99999;
        position:fixed;
        pointer-events: none;
    }
</style>