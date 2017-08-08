//content script
let classList = ''


document.addEventListener("contextmenu", (event) => {
  classList = event.target.classList[0]

}, true)

//start an array, loop through class list and add elements with the correct class. send that sucker back to the shit event.js


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(classList)
  message = {
    greeting: "selection",
    classList: classList
  }
  chrome.runtime.sendMessage(message, (response) => {
    //lol
  })
})
