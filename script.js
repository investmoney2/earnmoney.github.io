let steps = ["Adın: Fidan", "Soyadın: Gozelova", "Nefret ettiğin şey: Butona basarak gör"];
let index = 0;

function nextStep() {
    if (index < steps.length) {
        document.querySelector("h3").innerText = steps[index];
        index++;
    } else {
        document.querySelector("button").innerText = "Devam Et";
        document.querySelector("button").setAttribute("onclick", "redirectToYoutube()");
    }
}

function redirectToYoutube() {
    window.location.href = "https://www.youtube.com/watch?v=CQ_AtLVs3iY";
}
