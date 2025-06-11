const cssTextArea = document.getElementById('css_input');
const button = document.getElementById('apply_css');

// load saved CSS when popup opens
chrome.storage.local.get('custom_ice_css', async (result) => {
    if (result.custom_ice_css !== undefined) {
        cssTextArea.value = result.custom_ice_css;
    }
});

document.getElementById('apply_css').addEventListener('click', async () => {
    await updatePageCSS(cssTextArea.value);
    chrome.storage.local.set({ custom_ice_css: cssTextArea.value });
});

async function updatePageCSS(withCss) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {type: 'inject-css', css: withCss});
}