import { blockYoutube } from './service/block.js';
import {
  addTabIdToActiveYouTubeTabs,
  removeTabIdFromActiveYouTubeTabs,
  startYouTubeTimer,
  stopYouTubeTimer
} from './service/timer.js';
import { appState } from "./state.js";

// const DEFAULT_MAXIMUM_USAGE_SECOND = 60;
// let maximumUsageSecond = DEFAULT_MAXIMUM_USAGE_SECOND;
// const activeYouTubeTabs = new Set();
// let blockStatus = false;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (changeInfo.url.includes("youtube.com")) {
      console.log("You are on youtube.com");
      if (appState.blockStatus) blockYoutube();
      else if (!appState.activeYouTubeTabs.has(tabId)) {
        addTabIdToActiveYouTubeTabs(tabId);
      }
    } else if (appState.activeYouTubeTabs.has(tabId)) {
      removeTabIdFromActiveYouTubeTabs(tabId);
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (appState.activeYouTubeTabs.has(tabId)) {
    removeTabIdFromActiveYouTubeTabs(tabId);
  }
});

// Blocking & Timer reset
chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create("reset-block-timer", {
    when: getNextMidnightTime(),
    periodInMinutes: 24 * 60,
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "reset-block-timer") {
    stopYouTubeTimer();
    appState.blockStatus = false;
    console.log("Reset the blocking status.");
    if (appState.activeYouTubeTabs.size !== 0) {
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
    appState.maximumUsageSecond = message.value;
    console.log("Updated maximumUsageSecond =", appState.maximumUsageSecond);
  }
});
