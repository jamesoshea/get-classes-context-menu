//initial state, updated by background.js
let result = ''
let collection = null
let url = ''
let columns = 0
let rows = [[],[]]

//functions to be run when page loads, esp. click event listeners
document.addEventListener('DOMContentLoaded', ()=> {
  //send a message to the background page asking for current state
  chrome.runtime.sendMessage({greeting: 'imReady'})

  //send data to server
  let button = document.getElementById('quarry')
  button.addEventListener('click', ()=> {
      sendData(rows, url)
  })
  //clear view
  button = document.getElementById('clearItems')
  button.addEventListener('click', ()=> {
    chrome.runtime.sendMessage({greeting: 'clearItems'}, (response)=>{
      clearItems()
    })
  })
  button = document.getElementById('clearSheet')
  button.addEventListener('click', ()=> {
    chrome.runtime.sendMessage({greeting: 'clearSheet'}, (response)=>{
      clearItems()
      rows = [[],[]]
    })
  })
  //add column to sheet to sheet
  button = document.getElementById('addColumn')
  button.addEventListener('click', ()=> {
      let name = document.getElementById('name-input').value
      addColumn(name, collection)
      chrome.runtime.sendMessage({greeting: 'clearItems'}, (response)=>{
        clearItems()
      })
      document.getElementById('name-input').value = ''
  })
  button = document.getElementById('csv')
  button.addEventListener('click', ()=> {
      exportToCsv(url + 'data.csv', rows)
  })
})

//set the view with the response (this could be a lot more elegant)
chrome.runtime.onMessage.addListener( (request, sender, sendResponse)=> {
    if (request.greeting == "result") {
      collection = request.collection
      url = request.url
      result = request.result
      rows = request.rows
      if(request.result) {
        document.getElementById('url').innerHTML += '<a href="' + request.url + '" target="blank">' + request.url + '</a>'
        document.getElementById('result').innerHTML = request.result
        document.getElementById('quarry').style.display = 'inline'
        if (request.collection.length === 1) {
          document.getElementById('result-number').innerHTML = request.collection.length + ' result:'
        } else {
          document.getElementById('result-number').innerHTML = request.collection.length + ' results:'
        }
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
    let textNode = document.createTextNode(collection[i].type + ': ' + collection[i].contents)
    node.appendChild(textNode)
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
      document.getElementById('message').innerHTML = 'Saved! The id of your scrape is:<br/>' + http.responseText
      document.getElementById('quarry').style.display = 'none'
  	}
  }
  http.send(JSON.stringify(data));
}

function addColumn(colName, data) {
  //add column name into first row
  rows[0].push(colName)
  rows[1].push(result)
  for (let row = 0; row < data.length; row++){
    if(!Array.isArray(rows[row + 2])){
      rows.push([])
    }
    rows[row + 2][rows[0].length - 1] = data[row].contents
  }
  chrome.runtime.sendMessage({greeting: 'fieldAdded', rows: rows})
}

function exportToCsv(filename, rows) {
  var processRow = function (row) {
    var finalVal = '';
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      };
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0)
        result = '"' + result + '"';
      if (j > 0)
        finalVal += ',';
      finalVal += result;
    }
    return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function clearItems() {
  document.getElementById('url').innerHTML = ''
  document.getElementById('result-number').innerHTML = ''
  document.getElementById('result').innerHTML = 'Select an element to quarry from the page by right clicking.'
  document.getElementById('resultList').innerHTML = ''
  document.getElementById('message').innerHTML = ''
  document.getElementById('quarry').style.display = 'none'
}
