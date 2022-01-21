<script>
    import { db } from "$lib/config.js"
    import { getDocs, collection } from "firebase/firestore"; 
    import { onMount } from "svelte";
    import grained from "$lib/grained.min.js"
    import anime from "animejs"
	import Typewriter from "typewriter-effect/dist/core"
    let messages, okMessage, emptyMessage, errorMessage, typewriterLabel, title, checkingText;
    onMount(() => {
        //DOM Nodes
        messages = document.getElementsByClassName("message")
        okMessage = document.getElementById("ok-message")
        emptyMessage = document.getElementById("empty-message")
        errorMessage = document.getElementById("error-message")
        title = document.getElementById("title")
        checkingText = document.getElementById("checking-text")
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
    })
    // input
    let input = "";
    let stage = 0, username = "", ePw = "";
    function handleInput(e){
        input = e.target.value
        if(e.key == "Enter"){
            signIn(e)
        }
    }
    async function signIn(e){
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
                        username = input
                        ePw = doc.data().pw
                        match = true;
                        success(e,"username")
                    }
                });
            }else if(stage == 1){
                if(ePw == input){
                    match = true,
                    success(e,"pw")
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
    function success(e,value){
        e.target.value = ""
        if(value == "username" && stage == 0){
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
                    title.innerHTML = "Is it really your birthday?"
                }
            }).add({
                opacity:1,
            })
            emptyMessage.innerHTML = "Passwords wouldn't be empty..."
            errorMessage.innerHTML = "That doesn't seem quite right..."
            typewriterLabel.deleteChars(9).pauseFor(200).typeString("password:").start()
        }
        if(value == "pw" && stage == 1){
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
                    okMessage.innerHTML = "Yay! Heads up!"
                }
            })
        }
    }
</script>
<div id="landing">
    <div id="container">
        <p id="title">Oh! Is it your birthday?</p>
        <p id="input-label"></p>
        <input id="input-box" type="text" on:change={(e) => handleInput(e)} on:keydown={(e) => {if(e.key == "Enter") handleInput(e)}}/>
        <p id="checking-text">Checking...</p>
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