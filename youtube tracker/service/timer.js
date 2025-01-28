import { loadAccumulatedSpentTimes, recordAccumulatedSpentTimes } from './storage.js';
import { checkNotificationCondition } from "./notification.js";
import { checkBlockTimeCondition } from './block.js';
import {appState} from "../state.js";

let youTubeTimer = null;
let spentSecond = 0;

// Tab manager
export function addTabIdToActiveYouTubeTabs(tabId) {
    appState.activeYouTubeTabs.add(tabId);
    console.log("Active Youtube tab was added in management=", tabId);
    if (youTubeTimer) {
        console.log("The Timer already was activated so nothing happened.");
    } else {
        loadAccumulatedSpentTimes().then((startSecond) => {
            startYouTubeTimer(startSecond);
        });
    }
}

export function removeTabIdFromActiveYouTubeTabs(tabId) {
    appState.activeYouTubeTabs.delete(tabId);
    console.log("YouTube tab was closed. Remained Youtube tab size=", appState.activeYouTubeTabs.size);
    if (appState.activeYouTubeTabs.size === 0) {
        console.log("There is no more activated Youtube tab. Stopping the timer.");
        if (youTubeTimer) {
            stopYouTubeTimer();
            recordAccumulatedSpentTimes(spentSecond);
        }
    }
}

// Timer
export function startYouTubeTimer(startSecond) {
    spentSecond = startSecond;
    youTubeTimer = setInterval(() => {
        spentSecond++;
        console.log("spentSecond=", spentSecond);
        checkNotificationCondition(spentSecond, appState.maximumUsageSecond);
        if (checkBlockTimeCondition(spentSecond, appState.maximumUsageSecond)) {
            appState.blockStatus = true;
        }
    }, 1000);
}

export function stopYouTubeTimer() {
    clearInterval(youTubeTimer);
    youTubeTimer = null;
    console.log("Timer stopped.");
}
