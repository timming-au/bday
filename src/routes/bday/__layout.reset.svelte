<script>
    import '../../app.css'
    import { onMount } from 'svelte'
	// particles
	let cursor;
	onMount(async () => {
        let isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
        //cursor
        if(!isMobile){
            const cursorModule = await import('../_cursor.svelte')
            cursor = cursorModule.default
        }else{
            // @ts-ignore
            document.querySelector("*").style.cursor = "none";
        }
	});
</script>

<svelte:component this={cursor}/>
<slot/>