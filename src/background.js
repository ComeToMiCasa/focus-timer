'use strict';

let seconds = 1500;

const tick = () => {
  console.log("test")
  setInterval(() => {
    chrome.tabs.query({}).then((tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: "BACKGROUND",
          command: "TICK",
          payload: {
            seconds
          }
        })
      })
      seconds--;
    })
  }, 1000);
}

const handleStart = async () => {
  console.log("start")
  await chrome.storage.local.set({ isFocus: true })

  chrome.tabs.query({}).then((tabs) => {
    tabs.forEach((tab, index) => {
      chrome.tabs.sendMessage(tab.id, {
        from: "BACKGROUND",
        command: "START",
        payload: {
          isFocus: true 
        }
      })
    })
  })

  tick()
}

const handleStop = async () => {
  chrome.tabs.query({}).then((tabs) => {
    console.log(tabs)
    tabs.forEach((tab, index) => {
      chrome.tabs.sendMessage(tab.id, {
        from: "BACKGROUND",
        command: "STOP",
      })
    })
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.command === 'START') {
    handleStart()
  } else if (request.command === 'STOP') {
    handleStop()
  }
})

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === "timerPort") 
})