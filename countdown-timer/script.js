const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");

const initialDuration = 10;

let timeLeft = initialDuration;
let interval = null;
let isPaused = false;

timerDisplay.textContent = formatTimer(timeLeft);
updateButtons();

startButton.addEventListener("click", () => {
  startButton.disabled = true;
  if (interval !== null) return;
  interval = setInterval(updateTimer, 1000);
  updateButtons();
});

pauseButton.addEventListener("click", () => {
  if (interval === null && !isPaused) return;

  if (!isPaused) {
    clearInterval(interval);
    interval = null;
    isPaused = true;
    pauseButton.textContent = "Resume";
  } else {
    interval = setInterval(updateTimer, 1000);
    isPaused = false;
    pauseButton.textContent = "Pause";
  }
  updateButtons();
});

resetButton.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  isPaused = false;
  timeLeft = initialDuration;
  timerDisplay.textContent = formatTimer(timeLeft);
  timerDisplay.classList.remove("finished");
  updateButtons();
});

// Converts seconds into MM:SS format
function formatTimer(seconds) {
  // 90 seconds : 1 minute and 30 seconds
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;

  if (mins < 10) mins = "0" + mins;
  if (secs < 10) secs = "0" + secs;

  return `${mins}:${secs}`;
}

//Called every second while timer is running
function updateTimer() {
  timeLeft--;

  timerDisplay.textContent = formatTimer(timeLeft);

  if (timeLeft <= 0) {
    clearInterval(interval);
    interval = null;
    timerDisplay.classList.add("finished");
    updateButtons();
  }
}

// Updates which buttons are enabled or disabled
function updateButtons() {
  const isRunning = interval !== null;
  const isFinished = timeLeft <= 0;

  if (isFinished) {
    startButton.disabled = true;
    pauseButton.disabled = true;
    resetButton.disabled = false;
    return;
  }

  if (!isRunning && !isPaused) {
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true;
    return;
  }

  startButton.disabled = true;
  pauseButton.disabled = false;
  resetButton.disabled = false;
}
