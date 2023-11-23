const STORAGE_KEY_PREFIX = 'yt-adblock-data';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== "install") return;
  chrome.storage.local.set({
    [`${STORAGE_KEY_PREFIX}-isRunning`]: false
  });
  chrome.storage.local.set({
    [`${STORAGE_KEY_PREFIX}-adsBlocked`]: 0
  });
});

// message handler to interact with session storage from the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'set') {
    chrome.storage.session.set(request.data, function() {
      console.log('Data saved to session storage');
    });
  } else if (request.action === 'get') {
    chrome.storage.session.get(request.key, function(result) {
      sendResponse(result);
    });
    return true; // Needed to indicate that sendResponse will be called asynchronously
  }
});
