let pokemonName = localStorage.getItem("pokemonName") || "";
let score = parseInt(localStorage.getItem("score")) || 0;
let heart = parseInt(localStorage.getItem("heart")) || 5;
let maxValue = parseInt(localStorage.getItem("maxValue")) || 1025;
let minValue = parseInt(localStorage.getItem("minValue")) || 1;
//GameSound
const correctSound = new Audio("resource/audio/correct-choice.mp3");
const wrongSound = new Audio("resource/audio/wrong-choice.mp3");
const gameOver = new Audio("resource/audio/game-over-.mp3");
const gameStart = new Audio("resource/audio/gamestart.mp3");
const dontKnowSound = new Audio("resource/audio/DontKnow.mp3");

async function getPokemon() {
  try {
    let randomId = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    if (!response.ok)
      throw new Error(`HTTP error!! Status: ${response.status}`);
    let data = await response.json();
    pokemonName = data.name;
    localStorage.setItem("pokemonName", pokemonName);
    triggerPokeballSpin();
    let pokemonImage = data.sprites.front_default;
    document.getElementById("ChangesStatement").style.display = "none";
    document.getElementById("lives").innerText = heart;
    document.getElementById("scoreDisplay").textContent = score;
    document.getElementById("pokemonImage").src = pokemonImage;
    document.getElementById("resultMessage").style.display = "none";
    document.getElementById("pokemonInput").value = "";
    document.getElementById("pokemonImage").style.filter = "brightness(0%)";
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }
}

getPokemon();
gameStart.play();

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && e.target.matches("#pokemonInput")) {
    guessPokemon();
  }
});

document.addEventListener("click", function (e) {
  if (e.target.matches(".Gen")) {
    const isAlreadyChecked = e.target.classList.contains("Checked");

    document
      .querySelectorAll(".Gen")
      .forEach((btn) => btn.classList.remove("Checked"));

    if (!isAlreadyChecked) {
      e.target.classList.add("Checked");
      minValue = parseInt(e.target.dataset.min);
      maxValue = parseInt(e.target.dataset.max);
      localStorage.setItem("minValue", minValue);
      localStorage.setItem("maxValue", maxValue);
      document.getElementById("ChangesStatement").style.display = "block";
    } else {
      minValue = 1;
      maxValue = 1025;
      localStorage.setItem("minValue", minValue);
      localStorage.setItem("maxValue", maxValue);
      document.getElementById("ChangesStatement").style.display = "none";
    }
  }
});
function guessPokemon() {
  let answer = document
    .getElementById("pokemonInput")
    .value.trim()
    .toLowerCase();

  let resultMessage = document.getElementById("resultMessage");

  if (answer === pokemonName.toLowerCase()) {
    resultMessage.style.display = "block";
    resultMessage.innerHTML = `Correct! It's ${pokemonName}`;
    const pokemonImage = document.getElementById("pokemonImage");
    pokemonImage.style.filter = "brightness(100%)";
    score++;
    localStorage.setItem("score", score);
    localStorage.setItem("heart", heart);
    document.getElementById("scoreDisplay").textContent = score;
    setTimeout(getPokemon, 600);
    correctSound.play();
  } else {
    resultMessage.style.display = "block";
    resultMessage.innerHTML = "Try Again!";
    document.getElementById("pokemonInput").value = "";
    heart--;
    localStorage.setItem("heart", heart);
    document.getElementById("lives").textContent = heart;
    wrongSound.play();
    if (heart === 0) {
      GameOver();
      score = 0;
    }
  }
}

function dontKnow() {
  document.getElementById("resultMessage").style.display = "block";
  document.getElementById("resultMessage").innerText = `It's ${pokemonName}`;
  document.getElementById("pokemonImage").style.filter = "brightness(100%)";
  document.getElementById("ChangesStatement").style.display = "none";
  dontKnowSound.play();
  setTimeout(getPokemon, 1000);
}

function GameOver() {
  document.getElementById("pokemonImage").src = "resource/image/GAMEoVER.png";
  document.getElementById("pokemonImage").style.filter = "brightness(100%)";
  document.getElementById(
    "resultMessage"
  ).innerText = `Out of Lives!! Ans: ${pokemonName}`;
  document.getElementById("pokemonInput").value = "";
  gameOver.play();
  score = 0;
  heart = 5;
  localStorage.setItem("score", score);
  localStorage.setItem("heart", heart);
  setTimeout(getPokemon, 2500);
}

function triggerPokeballSpin() {
  const pokeball = document.getElementById("pokeball");

  pokeball.classList.add("spin");

  setTimeout(() => {
    pokeball.classList.remove("spin");
  }, 3000);
}
