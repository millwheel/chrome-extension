const NOTIFICATION_SECONDS = [60, 2 * 60];
let notificationsSent = new Set();

export function checkNotificationTimeCondition(spentSecond) {
    if (NOTIFICATION_SECONDS.includes(spentSecond) && !notificationsSent.has(spentSecond)) {
        const minutes = Math.floor(spentSecond / 60);
        sendNotification(minutes);
        notificationsSent.add(spentSecond);
    }
}

function sendNotification(minute) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "warning.png",
        title: "YouTube Usage Time Tracker Warning",
        message: `You have spent ${minute} minute${minute > 1 ? "s" : ""} on YouTube!`,
        priority: 1,
    });
}
