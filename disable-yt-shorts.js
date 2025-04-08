// Function to convert Shorts links to Watch links
function convertShortsLinks() {
  // Select all anchor tags that contain Shorts links
  const shortLinks = [
    ...document.querySelectorAll('a[href*="youtube.com/shorts/"]'),
    ...document.querySelectorAll('a[href*="/shorts/"]'),
  ];

  // Loop through each link and update its href
  shortLinks.forEach((link) => {
    const code = link.href.split("/shorts/")[1].split("?")[0]; // Extract the video code
    link.href = `https://www.youtube.com/watch?v=${code}`;
    link.onclick = () => {};
    link.target = "_blank";
  });
}

// Function to redirect if the current page is a Shorts page
function redirectShortsToWatch() {
  const currentUrl = window.location.href;

  // Check if the current URL is a Shorts URL
  if (currentUrl.includes("youtube.com/shorts/")) {
    const code = currentUrl.split("/shorts/")[1].split("?")[0]; // Extract the video code
    const newUrl = `https://www.youtube.com/watch?v=${code}`;

    // Redirect to the watch URL
    window.location.replace(newUrl);
  }
}

// Observe changes dynamically to update links as new content is loaded
const observer = new MutationObserver(() => {
  convertShortsLinks();
});

// Configuration for observing changes in the <body>
const config = { childList: true, subtree: true };

// Start observing the page for dynamic content updates
observer.observe(document.body, config);

// Run initially to handle the first load
convertShortsLinks();

const runInIntervals = (inpFunc, interval) => {
  setTimeout(inpFunc, 0);
  setInterval(inpFunc, interval);
};

redirectShortsToWatch();
runInIntervals(() => {
  redirectShortsToWatch();

  document.querySelector('[title="Shorts"]').style.display = "none";

  document.querySelector("ytd-rich-grid-renderer").style.display = [
    "https://www.youtube.com/",
    "https://www.youtube.com",
    "www.youtube.com/",
    "www.youtube.com",
    "youtube.com/",
    "youtube.com",
  ].includes(window.location.href)
    ? "none"
    : "flex";

  console.log();
}, 350);

// --------------------------------------------------
// Create a <style> element
const style = document.createElement("style");

// Add CSS rules as text content
style.textContent = `
${
  [
    "https://www.youtube.com/",
    "https://www.youtube.com",
    "www.youtube.com/",
    "www.youtube.com",
    "youtube.com/",
    "youtube.com",
  ].includes(window.location.href)
    ? "ytd-rich-grid-renderer,"
    : ""
} ytd-watch-next-secondary-results-renderer{
  display: none;
}
`;

document.head.appendChild(style);
