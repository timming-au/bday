<script>
	import { onMount } from "svelte";
	import Typewriter from "typewriter-effect/dist/core"
	import grained from "$lib/grained.min.js"
	import anime from "animejs"
	let fps;
	onMount(() => {
		//dev
		// let t0 = 0, t1 = 0, deltaTime;
		// function updateCanvas(timestamp){
        //     if(t0<=t1){
        //         t0 = timestamp
        //     }else if(t0>t1){
        //         t1 = timestamp
        //     }
        //     deltaTime = Math.abs(t1-t0)
        //     fps = Math.floor(1000000/deltaTime)/1000
        //     requestAnimationFrame(updateCanvas)
        // }
		// requestAnimationFrame(updateCanvas)

		//DOM nodes
		let nodeText = document.getElementById("text")

		//grain effect
		grained("#grain",{
			"animate": true,
			"patternWidth": 100,
			"patternHeight": 100,
			"grainOpacity": 0.09,
			"grainDensity": 1,
			"grainWidth": 1,
			"grainHeight": 1
		},document)

		//typewriter
		let date = Date().replace("(","").replace(")","").split(" ")
		let month = date[1]
        let day = date[2]
		let texts = ["Life can be as empty<br>as this page sometimes.", "Write your day like<br>pencil and paper.", `It's ${month} ${day}. What have<br>you achieved this year?`, "Paint your life<br>like a canvas.", "Art can be<br>whatever you wish.", "This repeats like<br>every other day."]
		let typer = new Typewriter(nodeText,{
			autoStart: true,
			cursor: "",
			delay:50,
			deleteSpeed:5,
		})
		const typeSeq = (array) => {
			return new Promise(resolve => {
				let newTyper = typer
				let len = array.length
				// shuffle
				while (len != 0){
					len--
					let rand = Math.floor(Math.random() * len), temp;
					temp = array[rand]
					array[rand] = array[len]
					array[len] = temp
				}
				let i = 0;
				while (i < array.length){
					newTyper.typeString(array[i])
					newTyper.pauseFor(2500)
					newTyper.deleteChars(array[i].length)
					newTyper.pauseFor(300)
					i++
				}
				newTyper.callFunction(() => {
					resolve()
				})
				newTyper.start()
			})
		}
		async function init(){
			typeSeq(texts).then(() => {
				init()
			})
		}
		init()

		//animations
		///blur
		function loopBlur(){
			let rand = Math.random() * 5 + 0.5
			anime({
				targets: "#video",
				filter: `blur(${rand}px)`,
				duration: 1000,
				complete: () => loopBlur()
			})
		}
		loopBlur()
	})

</script>
<div id="landing">
	<!-- <p style="position:absolute; right:0; top:0; color:red;z-index:99999">{fps}</p> -->
	<div id="grain-container">
		<div id="grain"></div>
	</div>
	<p id="text"></p>
	<div id="home-video">
		<span id="shadow-out"></span>
		<span id="shadow-in"></span>
		<img id="video" src="/home.webp" alt="video">
		<a href="https://www.ghibli.jp/marnie/" target="_blank" id="source">src: 思い出のマーニー</a>
	</div>
</div>
<style lang="scss">
	#grain-container{
		position:absolute;
		z-index:1000;
		overflow:hidden;
		height:100%;
		width:100%;
		pointer-events: none;
	}
	#grain{
		height:100%;
		width:100%;
	}
	#landing{
		position:absolute;
		display:flex;
		justify-content:center;
		align-items: center;
		height:100vh;
		width:100vw;
		background-color:rgba(25,26,26,1);
		text-align:center;
		overflow:hidden;
	}
	#home-video{
		position:relative;
		width: 90vw;
		z-index: 2;
		caret-color: transparent;
		transform: rotateX(0);
    }
	#source{
		position:absolute;
		bottom:2vw;
		left:3vw;
		z-index:1000;
		color:white;
		text-decoration: none;
		font-family: 'Klee One', cursive;
		font-size: calc(0.6vw + 0.7vh + 5px);
	}
	#shadow-in, #shadow-out{
		z-index:100;
		width:100%;
		height:100%;
		position:absolute;
	}
	#shadow-out{
		box-shadow: 0 0 10vw 5vw rgba(25,26,26,0.5), 0 0 5vw 5vw rgba(25,26,26,1);
	}
	#shadow-in{
		box-shadow: 0 0 15vw 5vw inset rgba(25,26,26,1), 0 0 5vw 3vw inset rgba(25,26,26,1), 0 0 5vw 3vw inset rgba(25,26,26,1);
	}
	#video{
		filter:blur(5px);
		width:100%;
		transform: rotateX(0);
	}
	#text{
		color:rgba(25,26,26,1);
		z-index:5;
		padding:18vw 0 0 20vw;
		margin:0;
	}
	p{
		position:absolute;
		text-shadow: 4px 4px 2px rgba(0,0,0,0.2);
		font-size: calc(4vw + 5px);
	}
	@media screen and (max-width:700px){
		p{
			font-size: 6vw;
		}
		#home-video{
			width:100vw;
		}
		#video{
			width:150vw;
		}
		#text{
			color:rgba(25,26,26,1);
			z-index:5;
			padding:43vw 0 0 15vw;
			margin:0;
		}
	}
</style>