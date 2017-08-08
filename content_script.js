//content script
let classList = ''

//save classList when right-click anywhere on page
document.addEventListener("contextmenu", (event) => {
  classList = event.target.classList[0]
  message = {
    greeting: "selection",
    classList: classList
  }
  chrome.runtime.sendMessage(message, (response) => {
  })
}, true)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // if (request.greeting == "getElements") {
  //   console.log('hello')
  //   let collection = document.getElementsByClassName(request.searchString)
  //   message = {
  //     greeting: "gotYourElements",
  //     collection: collection
  //   }
  //   chrome.runtime.sendMessage(message, (response) => {
  //     //lol
  //   })
  // }

  //send a response to what exactly?
})

//get elements from web page and send them to popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

})
