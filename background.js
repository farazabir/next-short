function setBadgeColor(color) {
  chrome.action.setBadgeBackgroundColor({ color: color });
}

function setBadgeNumber(number) {
  chrome.action.setBadgeText({ text: number.toString() });
}

function incrementShotCounter() {
  let shotCounter = parseInt(localStorage.getItem('shotCounter') || '0', 10);
  shotCounter++;
  localStorage.setItem('shotCounter', shotCounter.toString()); 
  setBadgeNumber(shotCounter); 
}

function resetShotCounter() {
  localStorage.setItem('shotCounter', '0');
  setBadgeNumber(0); 
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "incrementShotCounter") {
      incrementShotCounter();
  } else if (message.action === "resetShotCounter") {
      resetShotCounter();
  } else if (message.action === "changeBadgeProperties") {
      if (message.color) {
          setBadgeColor(message.color);
      }
      if (message.number !== undefined) {
          setBadgeNumber(message.number);
      }
  }
});
