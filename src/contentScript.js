'use strict';

import moment from "moment"

const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

const blockURL = [
  "www.instagram.com",
  "www.facebook.com"
]

const generateHTML = () => (
  `
  <div id="filter">
        <div id="timerContainer">
            <div class="timer" id="focusTimer">
                <div class="title">
                    Focus Session
                </div>
                <div class="clock">
                    24:59
                </div>
            </div>
            <div class="timer" id="breakTimer">
                <div class="title">
                    Breaktime
                </div>
                <div class="clock">
                    05:00
                </div>
            </div>
        </div>
    </div>
  `
)

let now
let isFocus
let isRunning = false
let intervalID = undefined

const blockSite = () => {
  if(blockURL.includes(window.location.hostname)) {
    replaceHead(chrome.runtime.getURL("galaxy-space-textured-background.jpg"))
    document.body.innerHTML = generateHTML();
  }
  chrome.storage.sync.get(["startTime"]).then((result) => {
    console.log("from sync", result.startTime)
    const startTime = moment(result.startTime)
    intervalID = setInterval(() => {
      const now = moment();
      if(Math.abs(startTime.diff(now) % 1000) <= 10) {

        console.log(now.diff(moment(result.startTime)))
      }
    }, 10);
  })
}

const replaceHead = (backgroundURL) => {
  document.head.innerHTML = `
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200&display=swap" rel="stylesheet">
  <style>
      body {
          background: url(${backgroundURL}) no-repeat center center fixed;
          background-size: cover;
          padding: 0px;
      }

      #filter {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0px;
          left: 0px;
          background: linear-gradient(rgba(0,0,0,1), rgba(0,0,0,.4), rgba(0,0,0,1));
      }

      #timerContainer {
          font-weight: 100;
          margin-top: 150px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
      }

      .timer {
          color: rgba(255,255,255,.8);
          font-family: 'Inter', sans-serif;
          text-align: center;
      }

      .title {
          font-size: 30px;
      }

      .clock {
          font-size: 130px;
          margin-top: -15px;
          margin-bottom: -30px;
      }

      #focusTimer {

      }

      #breakTimer {
          transform: scale(.6);
          opacity: .4;
      }
  </style>
  `
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.command === "START") {
    const { isFocus, startTime } = request.payload
    chrome.storage.sync.set({ isFocus })
    if(!isRunning) {
      isRunning = true
      blockSite()
    }
  } else if (request.command === "STOP") {
    chrome.storage.sync.set({ isFocus: false }) 
    isRunning = false
    clearInterval(intervalID)
  }
})

chrome.storage.sync.get(["isFocus"]).then((result) => {
  console.log(result.isFocus)
  isFocus = result.isFocus
  if(result.isFocus == true) {
    isRunning = true
    blockSite()
  }
})
