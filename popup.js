let token = null

let state = {
  classList: '',
  collection: [],
  url: '',
  rows: [[],[]],
  message: ''
}

if(!localStorage.getItem('userId')) {
  localStorage.setItem('userId', uuidv4())
}

let userId = localStorage.getItem('userId')

if(!localStorage.getItem('token')) {
  getToken(userId)
}

document.getElementById('user-id').innerHTML = 'user id: ' + userId

//functions to be run when page loads, esp. click event listeners
document.addEventListener('DOMContentLoaded', ()=> {
  //send a message to the background page asking for current state
  chrome.runtime.sendMessage({greeting: 'getState'})

  //button to send data to server
  let button = document.getElementById('quarry')
  button.addEventListener('click', ()=> {
    sendData(state)
  })
  //button to clear view
  button = document.getElementById('clear-items')
  button.addEventListener('click', ()=> {
    clearState(false)
    setView()
    chrome.runtime.sendMessage({greeting: 'setState', state: state}, (response)=>{
    })
  })
  //button to clear spreadsheet
  button = document.getElementById('clear-sheet')
  button.addEventListener('click', ()=> {
    clearState(true)
    setView()
    chrome.runtime.sendMessage({greeting: 'setState', state: state}, (response)=>{
    })
  })
  //button to add column to sheet
  button = document.getElementById('add-column')
  button.addEventListener('click', ()=> {
      let name = document.getElementById('name-input').value
      addColumn(name, state.collection)
      chrome.runtime.sendMessage({greeting: 'setState', state: state}, (response)=>{
      })
      document.getElementById('name-input').value = ''
  })
  //button to export csv file
  button = document.getElementById('csv')
  button.addEventListener('click', ()=> {
      exportToCsv(state.url + '.csv', state.rows)
  })
})

//set the view with the response (this could be a lot more elegant)
chrome.runtime.onMessage.addListener( (request, sender, sendResponse)=> {
    if (request.greeting == "result") {
      state = request.state
      setView()
    }
})

//send to Server
function sendData() {
  let http = new XMLHttpRequest()
  let toUrl = "http://localhost:3000";
  http.open("POST", toUrl, true);
  http.setRequestHeader("Content-type", "application/json");
  http.onreadystatechange = function() {
  	if(http.readyState == 4 && http.status == 200) {
      state.message = 'Saved! The id of your scrape is:<br/><a href="http://localhost:3000/scrapes/'+ userId + '/' + http.responseText +'" target="blank">' + http.responseText + '</a>'
      setView()
  	}
  }
  http.send(JSON.stringify({
    userId: userId,
    state: state
  }));
}

function addColumn(colName, data) {
  //add column name into first row
  state.rows[0].push(colName)
  state.rows[1].push(state.classList)
  for (let row = 0; row < data.length; row++){
    if(!Array.isArray(state.rows[row + 2])){
      state.rows.push([])
    }
    state.rows[row + 2][state.rows[0].length - 1] = data[row].contents
  }
  clearState(false)
  setView()
}

function exportToCsv(filename, rows) {
  //go through sheet setting all undefined to empty strings
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if(rows[i][j] === undefined) {
        rows[i][j] = ''
      }
    }
  }
  console.log(filename)
  //let's get into it
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
  csvFile += state.url + '\n'

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

function clearState(clearSheet) {
  state.classList = ''
  state.collection = []
  state.message = ''
  if (clearSheet) {
    state.rows = [[],[]]
  }
}

//append items from collection to UI list
function makeList() {
  let list = document.getElementById('result-list')
  for (let i = 0; i < state.collection.length; i++) {
    let node = document.createElement('LI')
    let textNode = document.createTextNode(state.collection[i].type + ': ' + state.collection[i].contents)
    node.appendChild(textNode)
    list.appendChild(node)
  }
}

function makeFieldList() {
  let list = document.getElementById('field-list')
  for (let i = 0; i < state.rows[0].length; i++) {
    let node = document.createElement('LI')
    let textNode = document.createTextNode(state.rows[0][i])
    node.appendChild(textNode)
    list.appendChild(node)
  }
}

function setView() {
  document.getElementById('url').innerHTML = state.url.slice(0, 50) + '...'
  let len = state.collection.length
  document.getElementById('class-list').innerHTML = state.classList
  if (len === 1) {
    document.getElementById('result-number').innerHTML = len + ' result:'
  } else if (len > 1) {
    document.getElementById('result-number').innerHTML = len + ' results:'
  } else {
    document.getElementById('class-list').innerHTML = 'Select an element to quarry from the page by right clicking.'
    document.getElementById('result-number').innerHTML = ''
  }
  if(len) {
    makeList()
  } else {
    document.getElementById('result-list').innerHTML = ''
  }
  document.getElementById('fields').innerHTML = 'Fields:'
  document.getElementById('field-list').innerHTML = ''
  if (state.rows[0].length) {
    makeFieldList()
  }
  document.getElementById('message').innerHTML = state.message
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=> {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16);
  })
}

function getToken(userId) {
  let http = new XMLHttpRequest()
  let toUrl = "http://localhost:3000/createToken";
  http.open("POST", toUrl, true);
  http.setRequestHeader("Content-type", "application/json");
  http.onreadystatechange = function() {
  	if(http.readyState == 4 && http.status == 200) {
      let token = http.responseText
      console.log(token)
  	}
  }
  http.send(JSON.stringify({
    userId: userId
  }));
}
