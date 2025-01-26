import { loadAccumulatedSpentTimes, recordAccumulatedSpentTimes } from './service/storage.js';
import { checkNotificationTimeCondition } from './service/notification.js';

const activeYouTubeTabs = new Set();
let youTubeTrackerTimer = null;
let spentSecond = null;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("tabId=", tabId);
  console.log("url=", changeInfo.url);
  if (changeInfo.url) {
    if (changeInfo.url.includes("youtube.com")) {
      console.log("You are on youtube.com");
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
    loadAccumulatedSpentTimes().then((startSecond) => {
      startYouTubeTimer(startSecond);
    });
  }
}

function removeTabIdFromActiveYouTubeTabs(tabId) {
  activeYouTubeTabs.delete(tabId);
  console.log("YouTube tab closed. Remained Youtube tab size=", activeYouTubeTabs.size);
  if (activeYouTubeTabs.size === 0) {
    console.log("There is no more activated Youtube tab. Stopping the timer.");
    if (youTubeTrackerTimer) {
      stopYouTubeTimer();
      recordAccumulatedSpentTimes(spentSecond);
    }
  }
}

function startYouTubeTimer(startSecond) {
  spentSecond = startSecond;
  youTubeTrackerTimer = setInterval(() => {
    spentSecond++;
    console.log(`${spentSecond} seconds spent on YouTube`);
    checkNotificationTimeCondition(spentSecond);
  }, 1000);
}

function stopYouTubeTimer() {
  clearInterval(youTubeTrackerTimer);
  youTubeTrackerTimer = null;
  console.log("Timer stopped.");
}
