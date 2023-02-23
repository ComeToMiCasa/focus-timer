'use strict';

let seconds = 1500;
import moment from "moment"

const handleStart = async () => {
  await chrome.storage.local.set({ isFocus: true })
  const now = moment();
  console.log(now.format())
  await chrome.storage.sync.set({ startTime: now.format("MM/DD/YYYY HH:mm:ss.SSS") })
  console.log(now)

  chrome.tabs.query({}).then((tabs) => {
    tabs.forEach((tab, index) => {
      chrome.tabs.sendMessage(tab.id, {
        from: "BACKGROUND",
        command: "START",
        payload: {
          isFocus: true,
          startTime: now.format("MM/DD/YYYY HH:mm:ss.SSS")
        }
      })
    })
  })
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