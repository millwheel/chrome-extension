let timer = null;
let timeSpent = null;
const TIME_LIMITS = [60 * 1000, 2 * 60 * 1000];
let activeYouTubeTabId = null;
let notificationsSent = [];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("tabId=", tabId);
  console.log("url=", changeInfo.url);
  if (changeInfo.url) {
    if (changeInfo.url.includes("youtube.com")) {
      console.log("The Timer will be activated");
      if (activeYouTubeTabId === null) {
        activeYouTubeTabId = tabId;
        startYouTubeTimer();
      }
    } else if (tabId === activeYouTubeTabId) {
      console.log("The Timer will be stopped");
      stopYouTubeTimer();
      activeYouTubeTabId = null;
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (tabId === activeYouTubeTabId) {
    console.log("YouTube tab closed. Stopping the timer.");
    stopYouTubeTimer();
    activeYouTubeTabId = null;
  }
});

function startYouTubeTimer() {
  if (!timer) {
    timeSpent = 0;
    timer = setInterval(() => {
      timeSpent++;
      console.log(`${timeSpent} seconds spent on YouTube`);
    }, 1000);
  }
}
function stopYouTubeTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
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
