let input = document.querySelector("input");
let searchbtn = document.getElementById("search")
let notFound = document.querySelector(".not-found");
let def = document.querySelector(".definition");
let audio = document.querySelector(".audio");
let loading = document.querySelector(".loading");

let nextBtn = document.querySelector(".nextBtn");
//In real life project api key must be embedded on server side
//not on the client side
let apikey = "8762639a-721d-46e1-938a-c552e3b8cf92"
searchbtn.addEventListener("click",function(e) {
    e.preventDefault();
    triggeredFunction();
})
input.focus();
input.addEventListener("keypress",function(e) {
    if(e.key === "Enter") {
        e.preventDefault();
        triggeredFunction();
    }
})
function triggeredFunction() {
     //clear previous data
     audio.innerHTML = "";
     notFound.innerText ="";
     def.innerText = "";
 
     //Get Input Data
     let word = input.value;
     
     //Call API and get Data
     if(word==="") {
         alert("word is required");
         return;
     }
     getData(word);
 
}
async function getData(word) {
    loading.style.display="block";

    //Ajax Call
    const response = await
    fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apikey}`)
    const data = await response.json();
    // if empty results
    if(!data.length) {
        loading.style.display="none";
        notFound.innerText = "No Result Found";
        return
    }
    //If results are suggestions
    if(typeof data[0] === "string") {
        loading.style.display="none";
        let heading = document.createElement("h3");
        heading.innerText = "Did You Mean?";
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggestion = document.createElement('button');
            suggestion.classList.add("suggested");
            suggestion.innerText = element;
            suggestion.addEventListener('click',function(e) {
            input.value = suggestion.innerText 
            triggeredFunction()
        })
            notFound.appendChild(suggestion);
        })
        return;
    }
    //If result is found
    loading.style.display="none";
    //api sends data of objects and first element is accurate
    let definition = data[0].shortdef[0];
    def.innerText = definition;
    console.log(data);

    //sound
    //This nesting u can understand when printing data from api
    // on browser console u get array of data objects and u have 
    //to find audio from that
    const soundName = data[0].hwi.prs[0].sound.audio
    if(soundName) {
        //Sound file is available
        renderSound(soundName);
    }
}
function renderSound(soundName) {
    let subFolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subFolder}/${soundName}.wav?key=${apikey}`;
    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audio.appendChild(aud);    

}