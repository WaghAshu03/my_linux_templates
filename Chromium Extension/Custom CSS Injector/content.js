// Create a style element to hold our custom CSS
let styleElement = document.createElement('style');
document.head.appendChild(styleElement);

// Load and apply saved CSS
chrome.storage.sync.get(['customCSS'], function(result) {
  if (result.customCSS) {
    styleElement.textContent = result.customCSS;
  }
});

// Listen for CSS updates from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'updateCSS') {
    styleElement.textContent = request.css;
  }
});
