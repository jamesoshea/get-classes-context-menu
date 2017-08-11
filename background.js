let state = {
  classList: '',
  collection: [],
  url: '',
  columns: 0,
  rows: [[],[]],
  message: ''
}

// background (event) page
let parent = chrome.contextMenus.create({
  "title": "Quarry for this",
  "id": "ekjfhvqeriuy87rvh",
  "contexts": ["all"]
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  //no idea what this line does but nothing works without it
  chrome.tabs.sendMessage(tab.id, {})
  if(info.menuItemId == 'ekjfhvqeriuy87rvh'){
    state.url = info.pageUrl
    chrome.tabs.sendMessage(tab.id, {greeting: "clicked", url: info.pageUrl})
  }
})

//save classList
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "selection") {
      state.classList = request.classList
      state.collection = request.collection
      chrome.browserAction.setBadgeText({text: state.collection.length.toString()})
    } else if (request.greeting == "fieldAdded") {
      state.rows = request.rows
    }
})

//send classList to popup.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "imReady") {
      chrome.runtime.sendMessage({greeting: "result", classList: state.classList, collection: state.collection, url: state.url, rows: state.rows})
    } else if (request.greeting == "clearItems") {
      clearItems(false)
    } else if (request.greeting == "clearSheet") {
      clearItems(true)
    }
  }
)

function clearItems(sheet) {
  state.classList = ''
  state.collection = []
  if (sheet) state.rows = [[],[]]
  chrome.browserAction.setBadgeText({text: ''})
}
