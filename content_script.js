//content script
let classList = ''

//save classList when right-click anywhere on page
document.addEventListener("contextmenu", (event) => {
  classList = event.target.classList[0]
  let collection = document.getElementsByClassName(classList)
  message = {
    greeting: "selection",
    classList: classList,
    collection: createArray(collection)
  }
  chrome.runtime.sendMessage(message, (response) => {
  })
}, true)

function createArray(collection) {
  return Array.prototype.slice.call(collection)
}
