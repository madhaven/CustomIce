// create style tag
const styleTag = document.createElement('style');
styleTag.id = 'custom-ice-style';
document.head.appendChild(styleTag);

// inject saved CSS when page loads
chrome.storage.local.get('custom_ice_css', (result) => {
    if (result.custom_ice_css) {
        styleTag.textContent = result.custom_ice_css
    }
})

// listen for update signal
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "inject-css") {
        styleTag.textContent = message.css;
        sendResponse({status: 'success'});
    }
});