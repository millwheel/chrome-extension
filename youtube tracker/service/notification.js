const DEFAULT_NOTIFICATION_SECOND = 60;
let blockSecond = DEFAULT_NOTIFICATION_SECOND;

export function checkNotificationTimeCondition(spentSecond) {
    updateBlockTime();
    console.log(`blocking seconds: ${blockSecond}`);
    if (spentSecond === blockSecond ) {
        const minutes = Math.floor(spentSecond / 60);
        blockYoutube(minutes);
    }
}

function blockYoutube(minute) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "./static/warning.png",
        title: "YouTube Usage Time Tracker Warning",
        message: `You have spent ${minute} minute${minute > 1 ? "s" : ""} on YouTube!`,
        priority: 1,
    });
}

function updateBlockTime() {
    chrome.storage.sync.get("blockTime", (data) => {
        if (data.blockTime) {
            blockSecond = data.blockTime;
        }
    });
}
