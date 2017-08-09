let result = ''
let collection = null
let url = ''

document.addEventListener('DOMContentLoaded', ()=> {
  //send a message to the background page asking for current state
  chrome.runtime.sendMessage({greeting: 'imReady'})
  //
  let button = document.getElementById('quarry')
  button.addEventListener('click', ()=> {
      sendData(result, collection, url)
  })

  button = document.getElementById('clearItems')
  button.addEventListener('click', ()=> {
    chrome.runtime.sendMessage({greeting: 'clearItems'}, (response)=>{
      document.getElementById('url').innerHTML = ''
      document.getElementById('result-number').innerHTML = '0 results'
      document.getElementById('result').innerHTML = 'Select an element to quarry from the page by right clicking.'
      document.getElementById('resultList').innerHTML = ''
    })
  })
})

//set the view with the response (this could be a lot more elegant)
chrome.runtime.onMessage.addListener( (request, sender, sendResponse)=> {
    if (request.greeting == "result") {
      collection = request.collection
      url = request.url
      result = request.result
      if(request.result) {
        document.getElementById('url').innerHTML += '<a href="' + request.url + '" target="blank">' + request.url + '</a>'
        document.getElementById('result').innerHTML = request.result
        if (request.collection.length === 1) {
          document.getElementById('result-number').innerHTML = request.collection.length + ' result:'
        } else {
          document.getElementById('result-number').innerHTML = request.collection.length + ' results:'
        }
        // document.getElementById('collection').innerHTML = JSON.stringify(request.collection)
        let list = document.getElementById('resultList')
        makeList(request.collection, list)
      } else {
        document.getElementById('result').innerHTML = 'Select an element to quarry from the page by right clicking.'
      }
    }
})

//append items from collection to UI list
function makeList(collection, list) {
  for (let i = 0; i < collection.length; i++) {
    let node = document.createElement('LI')
    if (collection[i].type == 'img') {
      let textNode = document.createTextNode(collection[i].type + ': ' + collection[i].src)
      node.appendChild(textNode)
    } else if (collection[i].type == 'a') {
      let textNode = document.createTextNode(collection[i].type + ': ' + collection[i].url)
      node.appendChild(textNode)
    } else {
      if (collection[i].contents) {
        let textNode = document.createTextNode(collection[i].type + ': ' + collection[i].contents)
        node.appendChild(textNode)
      } else {
        let textNode = document.createTextNode('Invalid element type')
        node.appendChild(textNode)
      }
    }
    list.appendChild(node)
  }
}

//send to Server
function sendData(result, collection, url) {

  let http = new XMLHttpRequest()
  let toUrl = "http://localhost:3000";
  let data = {
    classes: result,
    collection: collection,
    url: url
  }
  http.open("POST", toUrl, true);
  http.setRequestHeader("Content-type", "application/json");
  http.onreadystatechange = function() {
  	if(http.readyState == 4 && http.status == 200) {
  		console.log(http.responseText);
      document.getElementById('message').innerHTML = 'Saved!'
      document.getElementById('quarry').style.display = 'none' 
  	}
  }
  http.send(JSON.stringify(data));
}
