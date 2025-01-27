import { loadAccumulatedSpentTimes, recordAccumulatedSpentTimes } from './service/storage.js';
import { checkNotificationTimeCondition } from './service/notification.js';

const activeYouTubeTabs = new Set();
let youTubeTimer = null;
let spentSecond = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
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

// Tab manager
function addTabIdToActiveYouTubeTabs(tabId) {
  activeYouTubeTabs.add(tabId);
  console.log("Active Youtube tab was added in management=", tabId);
  if (youTubeTimer) {
    console.log("The Timer already was activated so nothing happened.");
  } else {
    loadAccumulatedSpentTimes().then((startSecond) => {
      startYouTubeTimer(startSecond);
    });
  }
}

function removeTabIdFromActiveYouTubeTabs(tabId) {
  activeYouTubeTabs.delete(tabId);
  console.log("YouTube tab was closed. Remained Youtube tab size=", activeYouTubeTabs.size);
  if (activeYouTubeTabs.size === 0) {
    console.log("There is no more activated Youtube tab. Stopping the timer.");
    if (youTubeTimer) {
      stopYouTubeTimer();
      recordAccumulatedSpentTimes(spentSecond);
    }
  }
}

// Timer
function startYouTubeTimer(startSecond) {
  spentSecond = startSecond;
  youTubeTimer = setInterval(() => {
    spentSecond++;
    checkNotificationTimeCondition(spentSecond);
  }, 1000);
}

function stopYouTubeTimer() {
  clearInterval(youTubeTimer);
  youTubeTimer = null;
  console.log("Timer stopped.");
}

// Blocking reset
chrome.runtime.onInstalled.addListener(() => {
  // const now = new Date();
  // const nextMidnightDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

  chrome.alarms.create("demo-default-alarm", {
    delayInMinutes: 2,
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (activeYouTubeTabs.size === 0) {
    youTubeTimer = null;
  } else {
    console.log("Reset the blocking, Reactivate the timer from zero.");
    startYouTubeTimer(0);
  }
});
