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

export function checkNotificationCondition(spentSecond, notificationSecond) {
    if (spentSecond === notificationSecond) {
        const minutes = Math.floor(spentSecond / 60);
        sendNotification(minutes);
    }
}

function sendNotification(minute) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "./static/warning.png",
        title: "YouTube Usage Time Tracker Warning",
        message: `You have spent ${minute} minute${minute > 1 ? "s" : ""} on YouTube!`,
        priority: 1,
    });
}
