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
      if(request.result) {
        document.getElementById('url').innerHTML += request.url
        document.getElementById('result').innerHTML = request.result
        if (request.collection.length === 1) {
          document.getElementById('result-number').innerHTML = request.collection.length + ' result:'
        } else {
          document.getElementById('result-number').innerHTML = request.collection.length + ' results:'
        }
        document.getElementById('collection').innerHTML = JSON.stringify(request.collection)
        let list = document.getElementById('resultList')
        for (let i = 0; i < request.collection.length; i++) {
          let node = document.createElement('LI')
          if (request.collection[i].type == 'img') {
            let textNode = document.createTextNode(request.collection[i].type + ': ' + request.collection[i].src)
            node.appendChild(textNode)
            list.appendChild(node)
          } else if (request.collection[i].type == 'a') {
            let textNode = document.createTextNode(request.collection[i].type + ': ' + request.collection[i].url)
            node.appendChild(textNode)
            list.appendChild(node)
          } else {
            if (request.collection[i].contents) {
              let textNode = document.createTextNode(request.collection[i].type + ': ' + request.collection[i].contents)
              node.appendChild(textNode)
              list.appendChild(node)
            } else {
              let textNode = document.createTextNode('Invalid element type')
              node.appendChild(textNode)
              list.appendChild(node)
            }
          }
        }
      } else {
        document.getElementById('result').innerHTML = 'Select an element to quarry from the page by right clicking.'
        document.getElementById('collection').innerHTML = ''
      }
    }
})

function makeListElement() {

}
