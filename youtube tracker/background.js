import { loadAccumulatedSpentTimes, recordAccumulatedSpentTimes } from './service/storage.js';
import { blockYoutube, checkBlockTimeCondition } from './service/block.js';
import { checkNotificationCondition } from "./service/notification.js";

const DEFAULT_MAXIMUM_USAGE_SECOND = 60;
const activeYouTubeTabs = new Set();
let youTubeTimer = null;
let spentSecond = 0;
let blockStatus = false;
let maximumUsageSecond = DEFAULT_MAXIMUM_USAGE_SECOND;

console.log("maximumUsageSecond=", maximumUsageSecond);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (changeInfo.url.includes("youtube.com")) {
      console.log("You are on youtube.com");
      if (blockStatus) blockYoutube();
      else if (!activeYouTubeTabs.has(tabId)) {
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
    console.log("spentSecond=", spentSecond);
    logTest();
    checkNotificationCondition(spentSecond, maximumUsageSecond);
    if (checkBlockTimeCondition(spentSecond, maximumUsageSecond)) {
      blockStatus = true;
    }
  }, 1000);
}

function stopYouTubeTimer() {
  clearInterval(youTubeTimer);
  youTubeTimer = null;
  console.log("Timer stopped.");
}

// Blocking reset
chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create("reset-block-timer", {
    when: getNextMidnightTime(),
    periodInMinutes: 24 * 60,
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "reset-block-timer") {
    stopYouTubeTimer();
    blockStatus = false;
    console.log("Reset the blocking status.");
    if (activeYouTubeTabs.size !== 0) {
      console.log("Reactivate the timer.");
      startYouTubeTimer(0);
    }
  }
});

function getNextMidnightTime() {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  return nextMidnight.getTime();
}

// Maximum YouTube Usage Time Update
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateMaximumUsageSecond") {
    maximumUsageSecond = message.value;
    console.log("Updated maximumUsageSecond =", maximumUsageSecond);
  }
});
