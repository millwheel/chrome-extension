import { loadAccumulatedSpentTimes, recordAccumulatedSpentTimes } from './service/storage.js';
import { checkNotificationTimeCondition } from './service/notification.js';

const activeYouTubeTabs = new Set();
let youTubeTimer = null;
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

chrome.runtime.onInstalled.addListener(() => {
  const now = new Date();
  const nextMidnightDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

  chrome.alarms.create("demo-default-alarm", {
    delayInMinutes: 5,
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("alarm name: ", alarm, "This time: ", new Date());
});

function addTabIdToActiveYouTubeTabs(tabId) {
  activeYouTubeTabs.add(tabId);
  console.log("Activated Youtube tab added in management=", tabId);
  if (youTubeTimer) {
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
    if (youTubeTimer) {
      stopYouTubeTimer();
      recordAccumulatedSpentTimes(spentSecond);
    }
  }
}

function startYouTubeTimer(startSecond) {
  spentSecond = startSecond;
  youTubeTimer = setInterval(() => {
    spentSecond++;
    console.log(`${spentSecond} seconds spent on YouTube`);
    checkNotificationTimeCondition(spentSecond);
  }, 1000);
}

function stopYouTubeTimer() {
  clearInterval(youTubeTimer);
  youTubeTimer = null;
  console.log("Timer stopped.");
}
