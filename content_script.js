//content script
var clickedElement;

document.addEventListener("mousedown", function(event){
  clickedElement = event.target;
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(clickedElement)
    message = {
      greeting: "selection",
      classString: clickedElement.classList.toString() 
    }
    chrome.runtime.sendMessage(message, function(response) {
      //lol
    })
  }
);
