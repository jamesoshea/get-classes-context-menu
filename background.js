let result = ''
let collection = null
let url = ''

// background (event) page
let parent = chrome.contextMenus.create({
  "title": "Quarry for this",
  "id": "ekjfhvqeriuy87rvh",
  "contexts": ["all"]
})

//no idea what this does but nothing works without it
chrome.contextMenus.onClicked.addListener(function (info, tab) {
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
      console.log(collection)
      url = request.url
      chrome.browserAction.setBadgeText({text: collection.length.toString()})
    }
})

//send classList to popup.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "imReady") {
      chrome.runtime.sendMessage({greeting: "result", result: result, collection: collection, url: url})
    }
})
