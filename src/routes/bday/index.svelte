<script>
    import { db } from "$lib/config.js"
    import { getDocs, collection } from "firebase/firestore"; 
    import { onMount } from "svelte";
    import grained from "$lib/grained.min.js"
    import anime from "animejs"
	import Typewriter from "typewriter-effect/dist/core"
    let messages, okMessage, emptyMessage, errorMessage, typewriterLabel, typewriterTitle, title, checkingText, inputBox;
    let letterTriangle, letter, letterContainer, letterTo;
    let rName, rMessage;
    onMount(() => {
        //DOM Nodes
        inputBox = document.getElementById("input-box")
        messages = document.getElementsByClassName("message")
        okMessage = document.getElementById("ok-message")
        emptyMessage = document.getElementById("empty-message")
        errorMessage = document.getElementById("error-message")
        title = document.getElementById("title")
        checkingText = document.getElementById("checking-text")
        letterTriangle = document.getElementById("letter-triangle")
        letter = document.getElementById("letter-letter")
        letterContainer = document.getElementById("letter")
        letterTo = document.getElementById('letter-to')
        let inputLabel = document.getElementById("input-label")
        //grain effect
        grained("#grain",{
            "animate": true,
            "patternWidth": 100,
            "patternHeight": 100,
            "grainOpacity": 0.06,
            "grainDensity": 1,
            "grainWidth": 1,
            "grainHeight": 1
        },document)
        function init(){
            let elements = document.querySelectorAll("#input-box, #enter")
            anime({
                targets: elements,
                opacity:1,
                duration:300,
                easing:"easeInOutQuad",
            })
        }
        typewriterLabel = new Typewriter(inputLabel,{
            cursor: "",
            delay:50,
            deleteSpeed:5,
        }).typeString("Your given username:").callFunction(function(){init()}).start()
        typewriterTitle = new Typewriter(title,{
            delay:0,
            deleteSpeed:30,
            cursor:"",
        }).pasteString("Oh! Is it your birthday?").start()
    })
    let particles, particlesConfig;
    onMount(async () => {
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
		};
		particles = module.default;
    })
    // input
    let input = "";
    let stage = 0, ePw = "";
    function handleInput(e){
        input = inputBox.value
        if(e.key == "Enter"){
            signIn()
        }
    }
    async function signIn(){
        let match = false;
        if(input == ""){
            anime({
                targets: "#empty-message",
                easing:"easeInOutQuad",
                opacity: 1,
                duration:200,
                begin:function(){
                    for(let i = 0, n = messages.length; i < n; i++){
                        messages[i].style.display = "none"
                    }
                    emptyMessage.style.display = "block"
                }
            })
        }else{
            if(stage == 0){
                anime({
                    targets: checkingText,
                    opacity:1,
                    duration:200,
                })
                let snapshot = await getDocs(collection(db, "user"));
                anime({
                    targets: checkingText,
                    opacity:0,
                    duration:200,
                })
                snapshot.forEach((doc) => {
                    if(doc.id == input){
                        ePw = doc.data().pw
                        rName = doc.data().name
                        rMessage = doc.data().message
                        match = true;
                        success("username")
                    }
                });
            }else if(stage == 1){
                if(ePw == input){
                    match = true,
                    success("pw")
                }
            }else{
                console.log("What?...")
            }
            if(!match) {
                let xMax = 17
                anime.timeline({
                    targets: "#error-message",
                }).add({
                    easing:"easeInOutQuad",
                    opacity: 1,
                    duration:200,
                    begin:function(){
                        for(let i = 0, n = messages.length; i < n; i++){
                            messages[i].style.display = "none"
                        }
                        errorMessage.style.display = "block"
                    }
                }).add({
                    easing: 'easeInOutSine',
                    duration: 450,
                    translateX: [
                        {
                            value: xMax * -1,
                        },
                        {
                            value: xMax,
                        },
                        {
                            value: xMax/-2,
                        },
                        {
                            value: xMax/2,
                        },
                        {
                            value: 0
                        }
                    ],
                })
            }
        }
    }
    function success(value){
        inputBox.value = ""
        if(value == "username" && stage == 0){
            console.log("username correct")
            stage = 1
            anime({
                targets: "#ok-message",
                opacity: 1,
                duration: 200,
                easing:"easeInOutQuad",
                begin:function(){
                    for(let i = 0, n = messages.length; i < n; i++){
                        messages[i].style.display = "none"
                    }
                    okMessage.style.display = "block"
                }
            })
            anime.timeline({
                targets: "#title",
                duration:300,
                easing:"linear",
            }).add({
                opacity:0,
                complete: function(){
                    typewriterTitle.deleteAll().typeString("Is it really your birthday?").start()
                }
            }).add({
                delay:150,
                opacity:1,
            })
            emptyMessage.innerHTML = "Passwords wouldn't be empty..."
            errorMessage.innerHTML = "That doesn't seem quite right..."
            typewriterLabel.deleteChars(9).pauseFor(200).typeString("password:").start()
        }
        if(value == "pw" && stage == 1){
            launchBirthday()
        }
    }
    function launchBirthday(){
        anime.timeline({
            targets: "#ok-message",
        }).add({
            opacity: 1,
            duration: 200,
            easing:"easeInOutQuad",
            begin:function(){
                for(let i = 0, n = messages.length; i < n; i++){
                    messages[i].style.display = "none"
                }
                okMessage.style.display = "block"
                okMessage.innerHTML = "Yay! Heads up!"
            },
        }).add({
            easing:"easeInOutQuad",
            delay:700,
            translateY:["0", "10vh", "-40vh"],
            duration:900,
        })
        anime({
            targets: "#grain-container",
            opacity:0,
            duration:1000,
            easing:"linear",
            complete:function(){
                document.getElementById("grain-container").style.display = "none";
            }
        })
        anime({
            targets: "#landing",
            backgroundColor: "#dfebf7",
            easing:"easeInOutQuad",
            delay:1500,
            duration:700,
        })
        anime({
            targets: "#disappear",
            delay:1400,
            opacity:0,
            easing:"easeInOutQuad",
            duration:900,
            complete:function(){
                document.getElementById("disappear").style.display = "none"
            }
        })
        let canvas = document.querySelector("#tsparticles > canvas")
        anime({
            delay:800,
            targets: canvas,
            easing: "easeInOutQuad",
            filter: "blur(5px)",
            opacity: {
                value: 0,
                duration:2000,
            },
        })
        anime({
            targets: title,
            delay:1000,
            easing:"easeInOutQuad",
            color:"#000"
        })
        anime({
            targets: title,
            delay:2000,
            easing:"linear",
            translateY:"15vh",
        })
        function showLetter(){
            anime({
                targets: title,
                easing:"easeInOutQuad",
                translateY:"0vh",
                complete:function(){
                    anime({
                        targets: letterContainer,
                        translateY: ["55vh","10vh"],
                        begin:function(){
                            letterContainer.style.display = "flex"
                        }
                    })
                    anime({
                        targets: "#arrow",
                        translateY: {
                            value: "30vh",
                            duration: 0,
                        },
                        translateX: {
                            value: [`-70vw`,`-30vw`],
                            duration: 800,
                        }
                    })
                }
            })
        }
        typewriterTitle.changeDelay(40).pauseFor(2000).deleteChars(27).pauseFor(200).typeString("It is...").pauseFor(300).typeString("your birthday!").callFunction(function(){showLetter()}).start()
        letterTo.innerHTML = `致：${rName}`;
    }
    let letterIsOpen = false, letterIsRevealed = false;
    function smallOpenLetter(action){
        if(!letterIsOpen){
            anime({
                targets: letterTriangle,
                rotateX: (action == "up" ? "20deg" : "0deg"),
                duration:200,
                easing:"easeInOutQuad",
            })
        }
    }
    function openLetter(){
        letterIsOpen = true;
        anime({
            targets: letterTriangle,
            rotateX: "180deg",
            duration:500,
            easing:"easeInOutQuad",
            begin:function(){
                anime({
                    targets: letter,
                    delay:300,
                    duration:400,
                    easing:"easeInOutQuad",
                    translateY: "-8vw",
                })
            },
            complete:function(){
                letterTriangle.style.zIndex = "1"
                letterTriangle.dataset.cursor = "default"
                letter.dataset.cursor = "interact"
            }
        })
    }
    function moveLetter(action){
        if(!letterIsRevealed){
            anime({
                targets: letter,
                duration:200,
                easing:"easeInOutQuad",
                translateY: (action == "down" ? "-8vw" : "-12vw"),
            })
        }
    }
    function revealLetter(){
        if(letterIsOpen && !letterIsRevealed){
            letterIsRevealed = true
            document.getElementById("letter-message").innerHTML = rMessage
            document.getElementById("letter-recipient").innerHTML = rName
            anime({
                targets: letter,
                duration:700,
                easing:"easeInOutQuad",
                translateY: ["-12vw", "-30vw", "-12vw"],
                zIndex: ["3","10","10"],
                complete:function(){
                    anime({
                        targets: letter,
                        duration: 1000,
                        easing:"easeInOutQuad",
                        scaleX: ["1","0.6","12"],
                        scaleY: ["1","0.6","12"],
                        complete:function(){
                            anime({
                                targets: "#temp-dark",
                                opacity: ["1","0"],
                                duration:1000,
                                easing: "linear",
                            })
                            document.getElementById("real-letter-container").style.display = "flex";
                            anime({
                                targets: "#real-letter-container",
                                opacity:1,
                                filter: ["blur(10px)","blur(0px)"],
                                delay:1000,
                                duration:1200,
                                easing:"easeInOutQuad"
                            })
                        }
                    })
                }
            })
        }
    }
</script>
<div id="particles">
    <svelte:component
        this={particles}
        id="tsparticles"
        options={particlesConfig}
    />
</div>
<div id="landing">
    <div id="container">
        <p id="empty-message" class="message">No no no... you can't enter an empty username...</p>
        <p id="error-message" class="message">Your entered username is wrong... :(</p>
        <p id="ok-message" class="message">Yay! Enter your password next :)</p>
        <p id="title"></p>
        <div id="disappear">
            <p id="input-label"></p>
            <input id="input-box" type="text" on:change={(e) => handleInput(e)} on:keydown={(e) => {if(e.key == "Enter") handleInput(e)}}/>
            <p id="checking-text">Checking...</p>
            <button id="enter" data-cursor="interact" on:click={() => signIn()}>Check</button>
        </div>
        <div id="letter">
            <div id="letter-triangle" on:click={() => openLetter()} on:mouseenter={() => smallOpenLetter("up")} on:mouseleave={() => smallOpenLetter("down")} data-cursor="interact"></div>
            <div id="letter-rect"></div>
            <div id="letter-letter" on:mouseenter={() => moveLetter("up")} on:mouseleave={() => moveLetter("down")} on:click={() => revealLetter()}></div>
            <div id="letter-to"></div>
        </div>
        <div id="arrow">
            <p id="arrow-text">Open me!</p>
            <img id="arrow-image" src="/arrow.webp" alt="arrow">
        </div>
        <div id="real-letter-container">
            <div id="real-letter-bg"></div>
            <div id="real-letter">
                <p id="letter-recipient"></p>
                <br>
                <p id="letter-message"></p>
                <br>
                <p id="letter-date">二零二二</p>
                <p id="letter-author">添明</p>
            </div>
        </div>
    </div>
    <div id="temp-dark"></div>
    <div id="grain-container">
        <div id="grain"></div>
    </div>
</div>
<style lang="scss">
    p{
        margin:0;
    }
    #particles{
        z-index:1;
        position: absolute;
    }
    #checking-text{
        opacity:0;
    }
    #container{
        position:relative;
        padding:20vh 10vw 10vh;
        display:flex;
        width:80vw;
        height:70vh;
        flex-direction:column;
        align-items:center;
        z-index:1000;
        color:white;
        overflow:hidden;
    }
    #disappear{
        position:relative;
        display:flex;
        width:100%;
        height:100%;
        flex-direction:column;
        align-items:center;
    }
    #enter{
        border:1px solid white;
        color:white;
        background-color:transparent;
        width:6rem;
        height:2.5rem;
        font-family: 'Roboto', sans-serif;
        font-size:1.2rem;
        margin-top:3vh;
        transition:.2s ease-in-out;
        &:hover{
            background-color:white;
            color:black;
        }
        opacity:0;
    }
    #grain-container{
		position:absolute;
		z-index:1000;
		overflow:hidden;
		height:100%;
		width:100%;
		pointer-events: none;
        left:0;
        top:0;
	}
    #grain{
        position:relative;
		height:100%;
		width:100%;
	}
    .message{
        font-size:1.5rem;
        padding:1rem 1rem;
        border-radius: 0.5rem;
        font-weight:300;
        text-align:center;
        margin-top: 5vh;
        display:none;
        opacity:0;
        position:absolute;
        top:5vh;
    }
    #empty-message{
        background-color:rgb(70, 70, 70);
        color:#afafaf;
        border:1px solid #202020;
    }
    #ok-message{
        background-color:rgb(159, 255, 167);
        color:#165e2b;
        border:1px solid #35802e;
    }
    #error-message{
        background-color:pink;
        color:#992950;
        border:1px solid #992950;
    }
    #title{
        font-size:calc(3vw + 2vh + 10px);
        text-align:center;
        margin:5vh 5vh 10vh;
    }
    #input-label{
        font-size:calc(1.5vw + 1vh + 5px);
    }
    #landing{
        background-color:rgba(25,26,26,1);
        width:100vw;
        height:100vh;
        position:relative;
    }
    #input-box{
        background:white;
        outline:none;
        border:none;
        border-radius:2px;
        width:35vw;
        height:1.9em;
        margin:calc(1vw + 1vh + 5px);
        font-size:1.5rem;
        font-family: 'Roboto', sans-serif;
        text-align:center;
        opacity:0;
    }
    #letter{
        position:relative;
        transform:translateY(70vh);
        display:none;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        z-index:2;
    }
    #letter-triangle{
        caret-color: transparent;
        position:absolute;
        width:10vw;
        height:10vw;
        border-left: 10vw solid transparent;
        border-right: 10vw solid transparent;
        border-top: 10vw solid #92b5de;
        transform-origin: center top;
        z-index:4;
    }
    #letter-letter{
        caret-color: transparent;
        transform: translateY(0vw);
        position:absolute;
        background:#3e4a57;
        width:25vw;
        height:16vw;
        z-index:2;
        border-radius:0.5rem;
        box-shadow: 0 0 2px 1px rgba(0,0,0,0.4);
    }
    #letter-rect{
        caret-color: transparent;
        width:30vw;
        height:20vw;
        background-color:#b0d4ff;
        box-shadow: 0 0 3px 2px rgba(0,0,0,0.4);
        z-index:3;
    }
    #letter-to{
        position:absolute;
        right:0;
        bottom:0;
        padding:1vw;
        z-index:5;
        font-family: 'Ma Shan Zheng', cursive;
        color:#38424d;
        font-size:1.5rem;
    }
    #arrow{
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
    }
    #arrow{
        position:absolute;
        transform:translate(-100vw, 40vh);
        color:#202020;
        font-size:1.3rem;
    }
    #arrow-text{
        transform: translateX(calc(-0.6vw - 0.6vh - 5px));
    }
    #arrow-image{
        width:calc(2vw + 2vh + 10px);
    }
    #real-letter-bg{
        position:absolute;
        width:100vw;
        height:100vh;
        background-image:url('/letterbg.webp');
        background-repeat: no-repeat;
        background-size: cover;
        filter:blur(2px);
    }
    #real-letter-container{
        position:absolute;
        width:100vw;
        height:100vh;
        background-color:#b0d4ff;
        display:none;
        align-items: center;
        justify-content:center;
        top:0;
        left:0;
        z-index:100;
        opacity:0;
    }
    #real-letter{
        z-index:5;
        background-color:#3e4a57;
        width:calc(40vw + 100px);
        margin:5vh 0;
        height:calc(84vh - 20px);
        padding:calc(3vh + 10px) calc(3vh + 10px);
        border-radius:1vw;
        box-shadow: 0 2px 4px 4px rgba(0,0,0,0.5);
        font-family: 'Ma Shan Zheng', cursive;
        font-size:calc(1vw + 0.6vh + 1rem);
        overflow-y:scroll;
        scrollbar-width: none;
        text-align:justify;
        &::-webkit-scrollbar{
            display: none;
        }
    }
    #letter-message{
        text-indent:calc(2vw + 1.2vh + 2rem);
    }
    #letter-author{
        text-align:right;
    }
    #letter-date{
        text-align:right;
    }
    #temp-dark{
        background-color:#3e4a57;
        width:100vw;
        height:100vh;
        position:absolute;
        opacity:0;
    }
    @media screen and (max-width:700px){
        .message{
            font-size:1.3rem;
        }
        #container{
            position:relative;
            padding:20vh 5vw 10vh;
            display:flex;
            width:90vw;
            height:70vh;
            flex-direction:column;
            align-items:center;
            z-index:1000;
            color:white;
        }
        #input-box{
            width:60vw;
        }
        #letter{
            position:relative;
            transform:translateY(70vh);
            display:none;
            align-items:center;
            justify-content:center;
            flex-direction:column;
        }
        #letter-triangle{
            caret-color: transparent;
            position:absolute;
            width:15vw;
            height:15vw;
            border-left: 15vw solid transparent;
            border-right: 15vw solid transparent;
            border-top: 15vw solid #92b5de;
            transform-origin: center top;
            z-index:4;
        }
        #letter-letter{
            caret-color: transparent;
            transform: translateY(0vw);
            position:absolute;
            background:#3e4a57;
            width:40vw;
            height:25vw;
            z-index:2;
            border-radius:0.5rem;
            box-shadow: 0 0 2px 1px rgba(0,0,0,0.4);
        }
        #letter-rect{
            caret-color: transparent;
            width:45vw;
            height:30vw;
            background-color:#b0d4ff;
            box-shadow: 0 0 3px 2px rgba(0,0,0,0.4);
            z-index:3;
        }
        #letter-to{
            position:absolute;
            right:0;
            bottom:0;
            padding:1vw;
            z-index:5;
            font-family: 'Ma Shan Zheng', cursive;
            color:#202020;
        }
    }
</style>