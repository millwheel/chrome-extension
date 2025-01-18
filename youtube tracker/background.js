const NOTIFICATION_SECONDS = [60, 2 * 60];

const activeYouTubeTabs = new Set();
let youTubeTrackerTimer = null;
let timeSpent = null;
let notificationsSent = new Set();

let timeStore = null;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("tabId=", tabId);
  console.log("url=", changeInfo.url);
  if (changeInfo.url) {
    if (changeInfo.url.includes("youtube.com")) {
      console.log("You are on youtube.com")
      if (!activeYouTubeTabs.has(tabId)) {
        addTabIdToActiveYouTubeTabs(tabId);
      }
    } else if (activeYouTubeTabs.has(tabId)) {
      removeTabIdFromActiveYouTubeTabs(tabId);
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (activeYouTubeTabs.has(tabId)) {
    removeTabIdFromActiveYouTubeTabs(tabId);
  }
});

function addTabIdToActiveYouTubeTabs(tabId) {
  activeYouTubeTabs.add(tabId);
  console.log("Activated Youtube tab added in management=", tabId);
  if (youTubeTrackerTimer) {
    console.log("The Timer already activated so nothing happened.");
  } else {
    const startTime = timeStore || 0;
    timeStore = null;
    startYouTubeTimer(startTime);
  }
}

function removeTabIdFromActiveYouTubeTabs(tabId) {
  activeYouTubeTabs.delete(tabId);
  console.log("YouTube tab closed. Remained Youtube tab size=", activeYouTubeTabs.size);
  if (activeYouTubeTabs.size === 0) {
    console.log("There is no more activated Youtube tab. Stopping the timer.");
    if (youTubeTrackerTimer) {
      stopYouTubeTimer();
    }
  }
}

function startYouTubeTimer(startTime) {
  timeSpent = startTime;
  youTubeTrackerTimer = setInterval(() => {
    timeSpent++;
    console.log(`${timeSpent} seconds spent on YouTube`);
    checkNotificationTimeCondition()
  }, 1000);
}

function stopYouTubeTimer() {
  clearInterval(youTubeTrackerTimer);
  youTubeTrackerTimer = null;
  console.log("Timer stopped.");
}

function checkNotificationTimeCondition() {
  if (NOTIFICATION_SECONDS.includes(timeSpent) && !notificationsSent.has(timeSpent)) {
    const minutes = Math.floor(timeSpent / 60);
    sendNotification(minutes);
    notificationsSent.add(timeSpent);
  }
}

function sendNotification(minute) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "warning.png",
    title: "YouTube Time Tracker Warning",
    message: `You have spent ${minute} minute${
      minute > 1 ? "s" : ""
    } on YouTube!`,
    priority: 1,
  });
}
