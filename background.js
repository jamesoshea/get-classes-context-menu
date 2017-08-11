let result = ''
let collection = null
let url = ''
let rows = [[],[]]

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
    chrome.tabs.sendMessage(tab.id, {greeting: "clicked", url: info.pageUrl})
  }
})

//save classList
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "selection") {
      result = request.classList
      collection = request.collection
      url = request.url
      chrome.browserAction.setBadgeText({text: collection.length.toString()})
    } else if (request.greeting == "fieldAdded") {
      rows = request.rows
    }
})

//send classList to popup.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == 'getState') {
      console.log('fetching state')
    }
    else if (request.greeting == "imReady") {
      chrome.runtime.sendMessage({greeting: "result", result: result, collection: collection, url: url, rows: rows})
    } else if (request.greeting == "clearItems") {
      clearItems()

    } else if (request.greeting == "clearSheet") {
      clearItems()
      rows = [[],[]]
    }
  }
)

function clearItems() {
  result = ''
  collection = null
  url = ''
  chrome.browserAction.setBadgeText({text: ''})
}
