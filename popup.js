chrome.runtime.sendMessage({greeting: 'imReady'})




chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "result") {
      if(request.result) {
        document.getElementById('result').innerHTML = request.result
      } else {
        document.getElementById('result').innerHTML = 'Select an element to quarry from the page by right clicking.'
      }
    }
})

// document.getElementById('result').innerHTML = request.classList
