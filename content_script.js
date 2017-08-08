//content script
let classList = ''

//save classList when right-click anywhere on page
document.addEventListener("contextmenu", (event) => {
  classList = event.target.classList[0]
  let collection = document.getElementsByClassName(classList)
  console.log(createObject(collection))
  message = {
    greeting: "selection",
    classList: classList,
    collection: collection
  }
  chrome.runtime.sendMessage(message, (response) => {
  })
}, true)

function createObject(collection) {
  return Array.prototype.slice.call(collection)
}
