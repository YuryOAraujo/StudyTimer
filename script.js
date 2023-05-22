const circle = document.querySelector('.circle');
const timer = document.getElementById('timer');
const startBtn = document.querySelector('#startBtn');
const timeDisplay = document.querySelector("#timeDisplay");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");
const totalTime = 14400;
const dots = 60;
const rotate = 360 / dots;
const interval = Math.floor(totalTime * 1000 / dots);

let elapsedTime = localStorage.getItem("elapsedTime") || 0;
let elapsed = elapsedTime / 1000;
let marked = Math.floor((elapsedTime/totalTime * 60) / 1000);
let points = '';
let startTime = 0;
let paused = true;
let intervalId;
let hrs = 0;
let mins = 0;
let secs = 0;
let countdown = JSON.parse(localStorage.getItem("countdown")) || false;

for (let i = 0; i < dots; i++) {
  points += `<div class="points" style="--i: ${i}; --rot: ${rotate}deg"></div>`;
}
circle.innerHTML = points;

const pointsMarked = circle.querySelectorAll('.points');

function updateProgressBar() {
  let i = 0;
  for (i = 0; i < dots; i++) {
    if (i < marked) {
      if (elapsed <= totalTime * 0.15) {
        setColor(i, 'white');
      } 
      else if(elapsed <= totalTime * 0.25){
        setColor(i, 'white');
      }
      else {
        setColor(i, 'white');
      }
      pointsMarked[i].classList.add('marked');
    } else {
      pointsMarked[i].classList.remove('marked');
      pointsMarked[i].style.backgroundColor = '#0007';
    }
  }
}

function setColor(i, color){
  pointsMarked[i].style.setProperty('--bgColor', color);
  timeDisplay.style.setProperty('--bgColor', color);
  pointsMarked[i].style.backgroundColor = color;
  setButtonColor(color);
}

function setButtonColor(color){
  startBtn.style.borderColor = color;
  startBtn.style.color = color;
  pauseBtn.style.borderColor = color;
  pauseBtn.style.color = color;
  resetBtn.style.borderColor = color;
  resetBtn.style.color = color;
}

startBtn.addEventListener("click", () =>{
    if(paused && startBtn.innerHTML == "Start"){
        setProperties(false,  "Countdown",false, updateTime);
    }
    else if(!paused || startBtn.innerHTML == "Countdown"){
        setProperties(true, "Start", true, updateCountdown);
    }
});

function setProperties(valueCountdown, valueButton, valuePaused, functionName){
  countdown = valueCountdown;
  localStorage.setItem("countdown", JSON.stringify(countdown));
  startBtn.innerHTML = valueButton;
  paused = valuePaused;
  if(valueCountdown == false)
    startTime = Date.now() - elapsedTime;
  clearInterval(intervalId);
  intervalId = setInterval(functionName, 1000);
}

pauseBtn.addEventListener("click", () => {
  if (startBtn.innerHTML === "Countdown") {
      countdown = false;
      localStorage.setItem("countdown", JSON.stringify(countdown));
      startBtn.innerHTML = "Start";
  }
  setMode();
  if (!countdown) {
      elapsedTime = Date.now() - startTime;
  }
  paused = true;
  clearInterval(intervalId);
});

resetBtn.addEventListener("click", () =>{
    paused = true;
    clearInterval(intervalId);
    startTime = Date.now();
    elapsedTime = 0;
    hrs = 0;
    mins = 0;
    secs = 0;
    timeDisplay.textContent = "00:00:00";
    startBtn.innerHTML = "Start";
    localStorage.removeItem("elapsedTime");
    localStorage.removeItem("countdown");
    resetProgressBar();
});

function updateTime(){
    if (elapsed >= totalTime) {
        clearInterval(intervalId);
        paused = true;
    } else {
        elapsedTime = Date.now() - startTime;
        elapsed = Math.floor(elapsedTime / 1000);
        displayTime();
        marked = Math.floor((elapsed / totalTime) * dots);
        updateProgressBar();
    }
    localStorage.setItem("elapsedTime", elapsedTime);
}

function updateCountdown(){
    if (elapsedTime <= 0) {
        clearInterval(intervalId);
        paused = true;
        elapsedTime = 0;
        countdown = false;
        localStorage.setItem("countdown", JSON.stringify(countdown));
        startBtn.innerHTML = "Start";
    } else {
        elapsedTime -= 1000;
        elapsed = Math.floor(elapsedTime / 1000);
        displayTime();
        marked = Math.floor((elapsed / totalTime) * dots);
        updateProgressBar();
    }
    localStorage.setItem("elapsedTime", elapsedTime);
}

function displayTime() {
  if(elapsedTime > 0){
    secs = Math.floor((elapsedTime / 1000) % 60);
    mins = Math.floor((elapsedTime / (1000 * 60)) % 60);
    hrs = Math.floor((elapsedTime / (1000 * 60 * 60)) % 60);

    secs = pad(secs);
    mins = pad(mins);
    hrs = pad(hrs);

    function pad(unit) {
      return (("0") + unit).slice(-2);
    }  
    timeDisplay.textContent = `${hrs}:${mins}:${secs}`;
  }  
}

function setMode(){
    countdown == true ? startBtn.innerHTML = "Countdown" : startBtn.innerHTML = "Start";
}

function resetProgressBar() {
  marked = 0;
  for (let i = 0; i < dots; i++) {
    pointsMarked[i].classList.remove('marked');
    pointsMarked[i].style.backgroundColor = '#0007';
  }
  timeDisplay.style.removeProperty('--bgColor');
  setButtonColor('white');
}

updateProgressBar();
displayTime();
setButtonColor('white');
setMode();
