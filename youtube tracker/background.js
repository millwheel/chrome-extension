let startTime = null;
let timer = null;
const TIME_LIMITS = [60 * 1000, 120 * 1000];
let activeYouTubeTabId = null;
let notificationsSent = [];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.includes("youtube.com")) {
    if (activeYouTubeTabId !== tabId) {
      handleYouTubeStart(tabId);
    }
  } else if (activeYouTubeTabId === tabId) {
    handleYouTubeExit();
  }
});

function handleYouTubeStart(tabId) {
  if (!startTime) {
    activeYouTubeTabId = tabId;
    startTime = Date.now();
    notificationsSent = [];
    console.log("Started tracking YouTube usage!");
    startYouTubeTimer();
  }
}

function handleYouTubeExit() {
  if (startTime) {
    stopYouTubeTimer();
    activeYouTubeTabId = null;
    startTime = null;
    notificationsSent = [];
  }
}

function startYouTubeTimer() {
  timer = setInterval(() => {
    const elapsedTime = Date.now() - startTime;

    for (let i = 0; i < TIME_LIMITS.length; i++) {
      if (elapsedTime >= TIME_LIMITS[i] && !notificationsSent.includes(TIME_LIMITS[i])) {
        sendNotification(i + 1);
        notificationsSent.push(TIME_LIMITS[i]);
      }
    }

    if (notificationsSent.length === TIME_LIMITS.length) {
      console.log("All notifications sent. Stopping timer.");
      stopYouTubeTimer();
    }

  }, 1000);
}

function stopYouTubeTimer() {
  clearInterval(timer);
  timer = null;
}

function sendNotification(minute) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "warning.png",
    title: "YouTube Usage Tracker Warning",
    message: `You have spent ${minute} minute${minute > 1 ? "s" : ""} on YouTube!`,
    priority: 1,
  });
}
