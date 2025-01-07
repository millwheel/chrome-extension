let startTime = null;
let timer = null;
const TIME_LIMIT = 60 * 1000;
let activeYouTubeTabId = null;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.includes("youtube.com")) {
    if (activeYouTubeTabId !== tabId) {
      handleYouTubeStart(tabId);
    }
  } else if (activeYouTubeTabId === tabId) {
    handleYouTubeExit();
  }
});

function handleYouTubeStart() {
  if (!startTime) {
    startTime = Date.now();
    console.log("Started tracking YouTube usage!");
    startYouTubeTimer();
  }
}

function handleYouTubeExit() {
  if (startTime) {
    console.log("Left YouTube, stopping timer.");
    stopYouTubeTimer();
  }
}

function startYouTubeTimer() {
  timer = setInterval(() => {
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime >= TIME_LIMIT) {
      sendNotification();
      startTime = Date.now();
    }
  }, 1000);
}

function stopYouTubeTimer() {
  clearInterval(timer);
  timer = null;
  startTime = null;
}

function sendNotification() {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "warning.png",
    title: "YouTube Warning",
    message: `You have spent 1 minute on YouTube!`,
    priority: 1,
  });
}
