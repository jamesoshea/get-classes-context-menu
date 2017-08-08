//content script
let classList = ''

//save classList when right-click anywhere on page
document.addEventListener("contextmenu", (event) => {
  classList = event.target.classList[0]
  let collection = document.getElementsByClassName(classList)
  console.log(collection)
  message = {
    greeting: "selection",
    classList: classList,
    collection: collection
  }
  chrome.runtime.sendMessage(message, (response) => {
  })
}, true)
