document.addEventListener('DOMContentLoaded', ()=> {
  //send a message to the background page asking for current state
  chrome.runtime.sendMessage({greeting: 'imReady'})
  //
  let button = document.getElementById('quarry')
  button.addEventListener('click', ()=> {
      //do database/webapp stuff here
  })
})

//set the view with the response (this could be a lot more elegant)
chrome.runtime.onMessage.addListener( (request, sender, sendResponse)=> {
    if (request.greeting == "result") {
      console.log(request.collection)
      if(request.result) {
        document.getElementById('url').innerHTML += request.url
        document.getElementById('result').innerHTML = request.result
        document.getElementById('collection').innerHTML = request.collection
        if (request.collection.length === 1) {
          document.getElementById('result-number').innerHTML = request.collection.length + ' result:'
        } else {
          document.getElementById('result-number').innerHTML = request.collection.length + ' results:'
        }
      } else {
        document.getElementById('result').innerHTML = 'Select an element to quarry from the page by right clicking.'
        document.getElementById('collection').innerHTML = ''
      }
    }
})
