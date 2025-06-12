// Assumes db-utils.js is included before this script in manifest.json or as a module

const hostname = window.location.hostname;

// create style tag
const styleTag = document.createElement('style');
styleTag.id = 'custom-ice-style';
document.head.appendChild(styleTag);

// console.log("loading css for", hostname);
loadCssForHost(hostname).then(css => {
    if (!css) return;
    styleTag.textContent = css;
});

// listen for update signal
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "inject-css") {
        saveCssForHost(hostname, message.css);
        styleTag.textContent = message.css;
        sendResponse({status: 'success'});
    }
});