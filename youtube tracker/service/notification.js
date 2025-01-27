const DEFAULT_MAXIMUM_USAGE_MINUTE = 1;
let maximumUsageMinute = DEFAULT_MAXIMUM_USAGE_MINUTE;

export function checkNotificationTimeCondition(spentSecond) {
    updateBlockTime();
    const minutes = Math.floor(spentSecond / 60);
    if (minutes === maximumUsageMinute) {
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
    chrome.storage.sync.get("customUsageMinutes", (data) => {
        if (data.customUsageMinutes) {
            maximumUsageMinute = data.customUsageMinutes;
        }
    });
}
