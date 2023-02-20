let seconds = 1500
let intervalId = null
let isRunning = false
let isFocus = true

const handleStart = async () => {
    chrome.runtime.sendMessage({
        command: "START"
    })
}

const handleStop = () => {
    chrome.runtime.sendMessage({
        command: "STOP"
    })
}

const addZero = (time) => {
    if(Math.floor(time / 10) == 0) {
        return "0" + time
    }

    return time
}

const port = chrome.runtime.connect({ name: "timerPort" })
port.onMessage.addListener((msg) => {
    console.log(msg)
})

document.getElementById("startBtn").addEventListener("click", handleStart)
document.getElementById("stopBtn").addEventListener("click", handleStop)
