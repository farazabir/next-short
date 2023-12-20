// background.js

function setBadgeColor(color) {
    chrome.action.setBadgeBackgroundColor({ color: color });
  }
  
  function setBadgeNumber(number) {
    chrome.action.setBadgeText({ text: number.toString() });
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "changeBadgeProperties") {
      setBadgeColor(message.color);
      setBadgeNumber(message.number);

      console.log("haslfj")
    }
  });
  