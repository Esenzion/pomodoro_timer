let pageConfig = {
  shortBreak: '05:00',
  longBreak: '15:00',
  pomodoro: '25:00'
}

let pomodoroScript = {
  1: "pomodoro",
  2: "short",
  3: "pomodoro",
  4: "short",
  5: "pomodoro",
  6: "short",
  7: "pomodoro",
  8: "short",
  9: "long"
}

let currentTime = pageConfig.pomodoro
let actualTime = currentTime
let timerInterval;
let currentStage = 1;

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('timer').innerHTML = currentTime
});

document.querySelectorAll('.switchChild').forEach(element => {
  element.addEventListener('click', () => {
    document.querySelectorAll('.switchChild').forEach(elem => {
      elem.classList.remove('active')
    })

    stopTimer()
    toggleControlButtonsIfPauseIsActive()
    
    switch (element.classList[1]) {
      case 'pomodoro-time':
        updateTimer(pageConfig.pomodoro)
        changeCurrentStage("pomodoro")
        break;
      case 'short-time':
        updateTimer(pageConfig.shortBreak)
        changeCurrentStage("short")
        break;
      case 'long-time':
        updateTimer(pageConfig.longBreak)
        changeCurrentStage("long")
        break;
      default:
        break;
    }

    console.log(element.classList)
    element.classList.add("active")
  })
})

document.getElementById('startButton').addEventListener('click', (element) => {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
        let updatedSeconds = getSecondsFromTimeString(actualTime) - 1
        if (updatedSeconds >= 0) {
          updateTimer(getTimeStringFromSeconds(updatedSeconds));
        }
        else if (updatedSeconds < 0) {
          stopTimer()
          currentStage = currentStage + 1
          switchStage(currentStage)
        }
    }, 10);
  }
  event.target.classList.toggle('visible')
  document.getElementById('pauseButton').classList.toggle('visible')
})

document.getElementById('pauseButton').addEventListener('click', (element) => {
  if (timerInterval) {
    stopTimer()
  }
  event.target.classList.toggle('visible')
  document.getElementById('startButton').classList.toggle('visible')
})


let updateTimer = (time) => {
  document.getElementById('timer').innerHTML = time
  actualTime = time
}

let getSecondsFromTimeString = (timeString) => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return (minutes * 60) + seconds;
}

let getTimeStringFromSeconds = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

let switchStage = (currentStage) => {
  let localCurrentStage = currentStage;
  let timeClass;
  while (localCurrentStage >= 9) {
    localCurrentStage = localCurrentStage - 9
  }
  document.querySelectorAll('.switchChild').forEach(elem => {
    elem.classList.remove('active')
  })
  stopTimer()
  toggleControlButtonsIfPauseIsActive()
  switch (pomodoroScript[localCurrentStage]) {
    case 'pomodoro':
      updateTimer(pageConfig.pomodoro)
      timeClass = "pomodoro-time"
      break;
    case 'short':
      updateTimer(pageConfig.shortBreak)
      timeClass = "short-time"
      break;
    case 'long':
      updateTimer(pageConfig.longBreak)
      timeClass = "long-time"
      break;
    default:
      break;
  }
  document.querySelectorAll(`.${timeClass}`).forEach(elem => {
    elem.classList.add('active')
  })
}

let stopTimer = () => {
  clearInterval(timerInterval)
  timerInterval = null
}

let toggleControlButtonsIfPauseIsActive = () => {
  if (document.getElementById('pauseButton').classList.contains('visible')) {
    document.getElementById('startButton').classList.add('visible')
    document.getElementById('pauseButton').classList.remove('visible')
  }
}

let changeCurrentStage = (desiredStage) => {
  for (let i = currentStage; i++; i < 11) {
    if (i === 10) {
      i = 1
      console.log('returning init value')
    }

    if (pomodoroScript[i] == desiredStage) {
      console.log("found")
      currentStage = i
      return
    }
  }
}