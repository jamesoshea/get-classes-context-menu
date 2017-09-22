let state = {
  classList: '',
  collection: [],
  url: '',
  rows: [[],[]],
  message: ''
}

let isLoggedIn = false;

// background (event) page
let parent = chrome.contextMenus.create({
  'title': 'Quarry for this',
  'id': 'ekjfhvqeriuy87rvh',
  'contexts': ['all']
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  //no idea what this line does but nothing works without it
  chrome.tabs.sendMessage(tab.id, {})
  //back to reality
  if(info.menuItemId === 'ekjfhvqeriuy87rvh'){
    state.url = info.pageUrl
    chrome.tabs.sendMessage(tab.id, {greeting: 'clicked', url: info.pageUrl}, (response)=> {
      state.classList = response.classList
      state.collection = response.collection
      chrome.browserAction.setBadgeText({text: state.collection.length.toString()})
    })
  }
})

//send classList to popup.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting === 'getState') {
      sendResponse({greeting: 'result', state: state})
    } else if (request.greeting === 'setState') {
      state = request.state
      chrome.browserAction.setBadgeText({text: state.collection.length.toString()})
    } else if (request.greeting === 'isLoggedIn') {
      sendResponse(isLoggedIn)
    } else if (request.greeting === 'logMeIn') {
      isLoggedIn = true
      sendResponse(true)
    }
  }
)
