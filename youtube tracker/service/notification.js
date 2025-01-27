const DEFAULT_NOTIFICATION_SECOND = 60;
let notificationSecond = DEFAULT_NOTIFICATION_SECOND;

export function checkNotificationTimeCondition(spentSecond) {
    updateNotificationTime();
    console.log(`notification seconds: ${notificationSecond}`);
    if (spentSecond === notificationSecond ) {
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

function updateNotificationTime() {
    chrome.storage.sync.get("notificationTime", (data) => {
        if (data.notificationTime) {
            notificationSecond = data.notificationTime;
        } else {
            notificationSecond = DEFAULT_NOTIFICATION_SECOND;
        }
    });
}
