let username = ''
let password = ''
let userId
let isLoggedIn = false

let state = {
  classList: '',
  collection: [],
  url: '',
  rows: [[],[]],
  message: ''
}

//functions to be run when page loads, esp. click event listeners
document.addEventListener('DOMContentLoaded', ()=> {
  if(isLoggedIn) {
    document.querySelector('#login').style.display = 'none'
    document.querySelector('#main-content').style.display = 'block'  
  }
  //send a message to the background page asking for current state
  chrome.runtime.sendMessage({greeting: 'isLoggedIn'}, (response)=> {
    if(response) {
      document.querySelector('#main-conttent').display = 'block'
      document.querySelector('#main-conttent').display = 'none'
    }
  })
  chrome.runtime.sendMessage({greeting: 'getState'}, (response)=> {
    state = response.state
    setView()
  })

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
    chrome.runtime.sendMessage({greeting: 'setState', state: state})
  })
  //button to clear spreadsheet
  button = document.getElementById('clear-sheet')
  button.addEventListener('click', ()=> {
    clearState(true)
    setView()
    chrome.runtime.sendMessage({greeting: 'setState', state: state})
  })
  document.getElementById('add-column').addEventListener('click', ()=> {
      let name = document.getElementById('name-input').value
      addColumn(name, state.collection)
      chrome.runtime.sendMessage({greeting: 'setState', state: state})
      document.getElementById('name-input').value = ''
  })
  document.getElementById('no-login').addEventListener('click', noLogin)
  document.getElementById('login-button', login)
})

//send to Server
function sendData() {
  fetch('http://quarry-17.herokuapp.com/scrapes/newscrape/', {
    method: 'post',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      userId: userId,
      state: state
    })
  })
  .then((response) => {
    if (response.status !== 200) {
      state.message = 'Server Error. Please try again'
      return
    }
    response.json()
    .then((data) => {
      state.message = 'Saved! The id of your scrape is:<br/><a href="http://quarry-17.herokuapp.com/users/'+ userId + '/' + data +'" target="blank">' + data + '</a>'
      setView()
    })
  })
  .catch((error) => {
    state.message = 'Server Error. Please try again'
  })
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
  document.getElementById('fields').innerHTML = 'Fields'
  document.getElementById('field-list').innerHTML = ''
  if (state.rows[0].length) {
    makeFieldList()
  }
  document.getElementById('message').innerHTML = state.message
  if (state.classList) {
    document.getElementById('field-input').style.display = 'initial'
  } else {
    document.getElementById('field-input').style.display = 'none'
  }
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=> {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function login() {
  fetch('http://localhost:3000/users/login/', {
    method: 'post',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
  .then((response) => {
    if (response.status !== 200) {
      state.message = 'Server Error. Please try again'
      return
    }
    response.json()
    .then((data) => {
      userId = response.userId
    })
  })
  .catch((error) => {
    state.message = 'Server Error. Please try again'
  })
}

function noLogin() {
  if(!localStorage.getItem('userId')) {
    localStorage.setItem('userId', uuidv4())
  }
  userId = localStorage.getItem('userId')
  chrome.runtime.sendMessage({greeting: 'logMeIn'}, (response)=> {
    console.log(response)
    isLoggedIn = response
  })
}

function copyText() {
  const element = document.createElement('textarea')
  element.value = document.getElementById('user-id').innerHTML
  document.body.appendChild(element)
  element.focus()
  element.setSelectionRange(0, element.value.length)
  document.execCommand('copy')
  document.body.removeChild(element)
}
