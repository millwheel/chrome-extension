const activeYouTubeTabs = new Set();
let youTimeTrackerTimer = null;
let timeSpent = null;

const TIME_LIMITS = [60 * 1000, 2 * 60 * 1000];
let notificationsSent = [];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("tabId=", tabId);
  console.log("url=", changeInfo.url);
  if (changeInfo.url) {
    if (changeInfo.url.includes("youtube.com")) {
      console.log("You are on youtube.com")
      if (!activeYouTubeTabs.has(tabId)) {
        console.log("Activated Youtube tab added in management=", tabId);
        activeYouTubeTabs.add(tabId);
        startYouTubeTimer();
      }
    } else if (activeYouTubeTabs.has(tabId)) {
      activeYouTubeTabs.delete(tabId);
      console.log("Remained Youtube tab size=", activeYouTubeTabs.size)
      if (activeYouTubeTabs.size === 0) {
        console.log("The Timer will be stopped");
        stopYouTubeTimer();
      }
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (activeYouTubeTabs.has(tabId)) {
    activeYouTubeTabs.delete(tabId);
    console.log("YouTube tab closed. Remained Youtube tab size=", activeYouTubeTabs.size);
    if (activeYouTubeTabs.size === 0) {
      console.log("YouTube tab closed. Stopping the timer.");
      stopYouTubeTimer();
    }
  }
});

function startYouTubeTimer() {
  if (!youTimeTrackerTimer) {
    timeSpent = 0;
    youTimeTrackerTimer = setInterval(() => {
      timeSpent++;
      console.log(`${timeSpent} seconds spent on YouTube`);
    }, 1000);
  }
}
function stopYouTubeTimer() {
  if (youTimeTrackerTimer) {
    clearInterval(youTimeTrackerTimer);
    youTimeTrackerTimer = null;
    console.log("Timer stopped.");
  }
}

function sendNotification(minute) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "warning.png",
    title: "YouTube Usage Tracker Warning",
    message: `You have spent ${minute} minute${
      minute > 1 ? "s" : ""
    } on YouTube!`,
    priority: 1,
  });
}
