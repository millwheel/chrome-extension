export function checkBlockTimeCondition(spentSecond, maximumUsageSecond) {
    if (spentSecond === maximumUsageSecond) {
        blockYoutube();
        return true;
    }
    return false;
}

export function blockYoutube() {
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
        tabs.forEach((tab) => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["manipulation/blockOverlay.js"],
            });
        });
    });
}
