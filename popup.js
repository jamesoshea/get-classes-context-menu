document.addEventListener('DOMContentLoaded', ()=> {

  //send a message to the background page asking for current state
  chrome.runtime.sendMessage({greeting: 'imReady'})

  let button = document.getElementById('quarry')
  button.addEventListener('click', ()=> {
      let searchString = document.getElementById('result').innerHTML
      console.log('hello')
      chrome.runtime.sendMessage({greeting: 'getElements', searchString: searchString})
  })
})


//set the view with the response (this could be a lot more elegant)
chrome.runtime.onMessage.addListener( (request, sender, sendResponse)=> {
    if (request.greeting == "result") {
      if(request.result) {
        document.getElementById('result').innerHTML = request.result
        console.log(typeof collection)
        console.log(collection.item(0))
        document.getElementById('collection').innerHTML = request.collection
      } else {
        document.getElementById('result').innerHTML = 'Select an element to quarry from the page by right clicking.'
        document.getElementById('collection').innerHTML = '0 results'
      }
    }
})

function formatResult(collection) {
  return Array.prototype.slice.call(collection)
}
