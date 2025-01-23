chrome.storage.sync.get({ blockedSites: [] }, ({ blockedSites }) => {
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => ({ redirectUrl: chrome.runtime.getURL("blocked.html") }),
    { urls: blockedSites },
    ["blocking"]
  );
});

// Listen for updates in blocked sites
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites) {
    chrome.webRequest.onBeforeRequest.removeListener();
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => ({ redirectUrl: chrome.runtime.getURL("blocked.html") }),
      { urls: changes.blockedSites.newValue },
      ["blocking"]
    );
  }
});
