const NOTIFICATION_SECONDS = [60, 2 * 60];
const SPENT_TIME_RECORD = "YouTubeUsageTimeRecord";

const activeYouTubeTabs = new Set();
let youTubeTrackerTimer = null;
let spentSecond = null;
let notificationsSent = new Set();

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
    const startSecond = loadAccumulatedSpentTimes();
    startYouTubeTimer(startSecond);
  }
}

function removeTabIdFromActiveYouTubeTabs(tabId) {
  activeYouTubeTabs.delete(tabId);
  console.log("YouTube tab closed. Remained Youtube tab size=", activeYouTubeTabs.size);
  if (activeYouTubeTabs.size === 0) {
    console.log("There is no more activated Youtube tab. Stopping the timer.");
    if (youTubeTrackerTimer) {
      stopYouTubeTimer();
      recordAccumulatedSpentTimes();
    }
  }
}

function startYouTubeTimer(startSecond) {
  spentSecond = startSecond;
  youTubeTrackerTimer = setInterval(() => {
    spentSecond++;
    console.log(`${spentSecond} seconds spent on YouTube`);
    checkNotificationTimeCondition(spentSecond)
  }, 1000);
}

function stopYouTubeTimer() {
  clearInterval(youTubeTrackerTimer);
  youTubeTrackerTimer = null;
  console.log("Timer stopped.");
}

function loadAccumulatedSpentTimes() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([SPENT_TIME_RECORD], (result) => {
      spentSecond = result[SPENT_TIME_RECORD] || 0;
      console.log("Load YouTube usage time: ", spentSecond, "seconds");
      resolve(spentSecond);
    })
  })
}

function recordAccumulatedSpentTimes() {
  chrome.storage.local.set({ [SPENT_TIME_RECORD]: spentSecond }, () => {
    console.log("Record YouTube usage time: ", spentSecond, "seconds");
  });
}

function checkNotificationTimeCondition(spentSecond) {
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
    message: `You have spent ${minute} minute${
      minute > 1 ? "s" : ""
    } on YouTube!`,
    priority: 1,
  });
}
