<script>
    import { db } from "$lib/config.js"
    import { getDocs, collection } from "firebase/firestore"; 
    import { onMount } from "svelte";
    import grained from "$lib/grained.min.js"
    import anime from "animejs"
	import Typewriter from "typewriter-effect/dist/core"
    let messages
    onMount(() => {
        //DOM Nodes
        messages = document.getElementsByClassName("message")
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
        let inputLabel = document.getElementById("input-label")
        new Typewriter(inputLabel,{
            cursor: "",
            delay:50,
            deleteSpeed:5,
        }).typeString("Your given username:").callFunction(function(){init()}).start()
    })
    // input
    let input = "";
    let stage = 0, username = "";
    function handleInput(e){
        input = e.target.value
        if(e.key == "Enter"){
            signIn()
        }
    }
    async function signIn(){
        if(stage == 0){
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
                        document.getElementById("empty-message").style.display = "block"
                    }
                })
            }else{
                const snapshot = await getDocs(collection(db, "user"));
                snapshot.forEach((doc) => {
                    if(doc.id == input){
                        username = input
                        match = true;
                        successUsername()
                    }
                });
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
                            document.getElementById("error-message").style.display = "block"
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
        if(stage == 1){
            let match = false;
            
        }
    }
    function successUsername(){
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
                document.getElementById("ok-message").style.display = "block"
            }
        })
    }
</script>
<div id="landing">
    <div id="container">
        <p id="title">Oh! Is it your birthday?</p>
        <p id="input-label"></p>
        <input id="input-box" type="text" on:change={(e) => handleInput(e)} on:keydown={(e) => {if(e.key == "Enter") handleInput(e)}}/>
        <button id="enter" data-cursor="interact" on:click={() => signIn()}>Check</button>
        <p id="empty-message" class="message">No no no... you can't enter an empty username...</p>
        <p id="error-message" class="message">Your entered username is wrong... :(</p>
        <p id="ok-message" class="message">Yay! Enter your password next :)</p>
    </div>
    <div id="grain-container">
        <div id="grain"></div>
    </div>
</div>
<style lang="scss">
    p{
        margin:0;
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
    }
    #enter{
        border:1px solid white;
        color:white;
        background-color:transparent;
        width:6rem;
        height:2.5rem;
        font-family: 'Roboto', sans-serif;
        font-size:1.2rem;
        margin-top:5vh;
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
    @media screen and (max-width:700px){
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
    }
</style>