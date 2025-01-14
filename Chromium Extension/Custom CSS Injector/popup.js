document.addEventListener('DOMContentLoaded', function() {
  const cssInput = document.getElementById('cssInput');
  const saveButton = document.getElementById('saveButton');

  // Load saved CSS
  chrome.storage.sync.get(['customCSS'], function(result) {
    if (result.customCSS) {
      cssInput.value = result.customCSS;
    }
  });

  // Save CSS when button is clicked
  saveButton.addEventListener('click', function() {
    const css = cssInput.value;
    chrome.storage.sync.set({ customCSS: css }, function() {
      // Notify all tabs to update CSS
      chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
          chrome.tabs.sendMessage(tab.id, { type: 'updateCSS', css: css });
        });
      });
    });
  });
});
