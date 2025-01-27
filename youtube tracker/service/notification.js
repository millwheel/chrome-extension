const DEFAULT_NOTIFICATION_SECOND = 60;

export function checkNotificationTimeCondition(spentSecond) {
    if (spentSecond === DEFAULT_NOTIFICATION_SECOND) {
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

