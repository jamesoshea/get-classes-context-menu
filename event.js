// background (event) page
var parent = chrome.contextMenus.create({
  "title": "Remove Element",
  "id": "ekjfhvqeriuy87rvh",
  "contexts": ["all"]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.sendMessage(tab.id, {});
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "selection") {
      console.log(request.classString)
      sendResponse({farewell: "goodbye"})
    }
})
