let startTime = null; // Track when the user starts visiting YouTube
let timer = null; // Reference to the interval timer
const TIME_LIMIT = 60 * 1000; // 1 minute in milliseconds

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isYouTube(changeInfo.url)) {
    console.log("YouTube detected!");
    handleYouTubeStart();
  } else {
    handleYouTubeExit();
  }
});

function isYouTube(url) {
  return url && url.includes("youtube.com");
}

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
    iconUrl: "orange.jpeg",
    title: "YouTube Warning",
    message: `You have spent 1 minute on YouTube!`,
    priority: 1,
  });
}
