const STORAGE_KEY = "youtubeTrackerData";
const DEFAULT_STORAGE_DATA = {
  totalTime: 0,
  lastStartTime: null,
  notificationsSent: [],
};

let startTime = null;
let timer = null;
const TIME_LIMITS = [60 * 1000, 120 * 1000];
let activeYouTubeTabId = null;
let notificationsSent = [];

chrome.storage.local.get([STORAGE_KEY], (result) => {
  const data = result[STORAGE_KEY] || DEFAULT_STORAGE_DATA;
  notificationsSent = data.notificationsSent;
  if (data.lastStartTime) {
    startTime = Date.now();
    const elapsedTime = data.totalTime || 0;
    updateStoredTime(elapsedTime);
  }
});

function updateStoredTime(totalTime) {
  console.log(
    `Updating storage - Total time: ${Math.floor(totalTime / 1000)}s`
  );
  chrome.storage.local.set(
    {
      [STORAGE_KEY]: {
        totalTime,
        lastStartTime: startTime,
        notificationsSent,
      },
    },
    () => {
      console.log("Storage update completed");
    }
  );
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (isYouTubeUrl(changeInfo.url)) {
      if (activeYouTubeTabId !== tabId) {
        handleYouTubeTimeTrackerStart(tabId);
      }
    } else if (activeYouTubeTabId === tabId) {
      handleYouTubeTimeTrackerExit();
    }
  }
});

function isYouTubeUrl(url) {
  return url.includes("youtube.com");
}

function handleYouTubeTimeTrackerStart(tabId) {
  console.log(`YouTube tracker starting for tab ${tabId}`);
  if (!startTime) {
    activeYouTubeTabId = tabId;
    startTime = Date.now();
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const data = result[STORAGE_KEY] || DEFAULT_STORAGE_DATA;
      console.log(`Loaded stored data:`, data);
      notificationsSent = data.notificationsSent;
      updateStoredTime(data.totalTime || 0);
      console.log("Started tracking YouTube usage!");
      startYouTubeTimer(data.totalTime || 0);
    });
  }
}

function handleYouTubeTimeTrackerExit() {
  console.log("Exiting YouTube tracker");
  if (startTime) {
    stopYouTubeTimer();
    activeYouTubeTabId = null;
    startTime = null;
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const data = result[STORAGE_KEY] || DEFAULT_STORAGE_DATA;
      console.log(
        `Saving final time on exit: ${Math.floor(data.totalTime / 1000)}s`
      );
      updateStoredTime(data.totalTime);
    });
  }
}

function startYouTubeTimer(initialTime = 0) {
  console.log(
    `Timer started with initial time: ${initialTime}ms (${Math.floor(
      initialTime / 1000
    )} seconds)`
  );

  timer = setInterval(() => {
    const currentTime = Date.now();
    const sessionTime = currentTime - startTime;
    const totalElapsedTime = initialTime + sessionTime;

    // Debug logging every second
    console.log(`
      -------- Timer Debug --------
      Session time: ${Math.floor(sessionTime / 1000)}s
      Total time: ${Math.floor(totalElapsedTime / 1000)}s
      Notifications sent: ${notificationsSent.length}
      Active YouTube tab: ${activeYouTubeTabId}
      ------------------------
    `);

    for (let i = 0; i < TIME_LIMITS.length; i++) {
      if (
        totalElapsedTime >= TIME_LIMITS[i] &&
        !notificationsSent.includes(TIME_LIMITS[i])
      ) {
        console.log(
          `Sending notification for ${TIME_LIMITS[i] / 1000} seconds threshold`
        );
        sendNotification(i + 1);
        notificationsSent.push(TIME_LIMITS[i]);
        updateStoredTime(totalElapsedTime);
      }
    }

    if (notificationsSent.length === TIME_LIMITS.length) {
      console.log("All notifications sent. Stopping timer.");
      stopYouTubeTimer();
    }

    // Update stored time every minute
    if (sessionTime % 60000 < 1000) {
      console.log(
        `Storing updated total time: ${Math.floor(totalElapsedTime / 1000)}s`
      );
      updateStoredTime(totalElapsedTime);
    }
  }, 1000);
}

function stopYouTubeTimer() {
  console.log("Stopping timer.");
  clearInterval(timer);
  timer = null;
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

function resetTracking() {
  console.log("Resetting all tracking data");
  chrome.storage.local.set(
    {
      [STORAGE_KEY]: DEFAULT_STORAGE_DATA,
    },
    () => {
      console.log("Reset completed");
    }
  );
  startTime = null;
  notificationsSent = [];
  stopYouTubeTimer();
}
