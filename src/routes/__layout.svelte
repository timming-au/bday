<script>
    import '../app.css'
    import { onMount } from 'svelte'
	// particles
	let particles, particlesConfig, cursor;
	onMount(async () => {
        let isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
        //particles
		const module = await import("svelte-particles");
		particlesConfig = {
			particles: {
				color: {
					value: "#000",
				},
				links: {
					enable: true,
					color: "#000",
					distance: 180,
				},
				move: {
					enable: true,
                    speed: Math.sqrt((window.innerHeight + window.innerWidth)) / 20,
				},
				number:{
					value: Math.floor((window.innerHeight + window.innerWidth) / 50) + 5,
				}
			},
            fpsLimit: (isMobile ? 30 : 60),
		};
		particles = module.default;
        
        //cursor
        if(!isMobile){
            const cursorModule = await import('./_cursor.svelte')
            cursor = cursorModule.default
        }else{
            // @ts-ignore
            document.querySelector("*").style.cursor = "none";
        }
	});
</script>
<div id="particles">
    <svelte:component
        this={particles}
        id="tsparticles"
        options={particlesConfig}
    />
</div>
<svelte:component this={cursor}/>
<slot/>
<style lang="scss">
    #particles{
        z-index:1;
        position: absolute;
    }
</style>