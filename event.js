let currentClasses = []

// background (event) page
let parent = chrome.contextMenus.create({
  "title": "console.log this element",
  "id": "ekjfhvqeriuy87rvh",
  "contexts": ["all"]
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.sendMessage(tab.id, {})
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("hello")
    if (request.greeting == "selection") {
      console.log("hello")
    }
})
