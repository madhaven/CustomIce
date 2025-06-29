// Assumes db-utils.js is included before this script in popup.html

const cssTextArea = document.getElementById('css_input');
const button = document.getElementById('apply_button');
let hostname;

// load saved CSS when popup opens
getCurrentTabHostname(hname => {
    if (!hname) return;
    hostname = hname;
    loadCssForHost(hname).then(css => {
        if (!css) return;
        cssTextArea.value = css;
    });
});

// sends CSS to the content-script and saves to indexed-DB (extension specific)
button.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {type: 'inject-css', css: cssTextArea.value});
    saveCssForHost(hostname, cssTextArea.value);
});

// Returns a Promise that resolves to the hostname of the current active tab
async function getCurrentTabHostname(callback) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    try {
        const url = new URL(tab.url);
        callback(url.hostname);
    } catch (e) {
        callback(null);
    }
}