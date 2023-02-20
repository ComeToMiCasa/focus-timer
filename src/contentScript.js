'use strict';

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
  <div>
  test
  <div>
  `
)

let now
let isFocus

const blockSite = () => {
  if(blockURL.includes(window.location.hostname)) {
    document.body.innerHTML = generateHTML();
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.command === "START") {
    const { isFocus } = request.payload
    chrome.storage.sync.set({ isFocus })
    blockSite()
  } else if (request.command === "STOP") {
    chrome.storage.sync.set({ isFocus: false }) 
  } else if (request.command === "TICK") {
    console.log(request.payload)
  }
})

chrome.storage.sync.get(["isFocus"]).then((result) => {
  console.log(result.isFocus)
  isFocus = result.isFocus
  if(result.isFocus == true) {
    blockSite()
  }
})
