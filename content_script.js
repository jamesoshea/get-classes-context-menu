//content script
let clickedElement = {
  alt: null,
  className: null,
  classList: null,
  id: null,
  innerHTML: null,
  src: null,
  tagName: null
}

document.addEventListener("contextmenu", function(event){
  // clickedElement.alt = event.target.getAttribute('alt')
  clickedElement.className = event.target.className
  clickedElement.classList = event.target.classList
  clickedElement.id = event.target.id
  clickedElement.innerHTML = event.target.innerHTML
  clickedElement.src = event.target.src
  clickedElement.tagName = event.target.tagName.toLowerCase()
}, true)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(clickedElement)
    message = {
      greeting: "selection",
      element: clickedElement
    }
  })
