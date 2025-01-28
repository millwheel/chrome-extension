const DEFAULT_NOTIFICATION_SECOND_BEFORE = 5 * 60;


export function checkNotificationCondition(spentSecond, maximumUsageSecond) {
    if (spentSecond === maximumUsageSecond - DEFAULT_NOTIFICATION_SECOND_BEFORE) {
        const minutes = Math.floor(spentSecond / 60);
        sendNotification(minutes);
    }
    if (spentSecond === maximumUsageSecond) {
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
