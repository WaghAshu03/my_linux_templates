const textarea = document.getElementById("blockedSites");
const saveButton = document.getElementById("save");

// Load stored blocked sites
chrome.storage.sync.get({ blockedSites: [] }, ({ blockedSites }) => {
  textarea.value = blockedSites.join("\n");
});

// Save new blocked sites
saveButton.addEventListener("click", () => {
  const sites = textarea.value.split("\n").map((site) => site.trim()).filter(Boolean);
  const formattedSites = sites.map((site) => (site.startsWith("http") ? site : `*://${site}/*`));
  chrome.storage.sync.set({ blockedSites: formattedSites }, () => {
    alert("Blocked sites updated!");
  });
});
