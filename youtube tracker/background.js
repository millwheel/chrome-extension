let visitCount = 0;
const VISIT_LIMIT = 3;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.includes("youtube.com")) {
    visitCount++;
    console.log(`YouTube visit count: ${visitCount}`);

    if (visitCount >= VISIT_LIMIT) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "https://www.quanta.org/orange/orange.jpg"
        title: "YouTube Warning",
        message: `You have visited YouTube ${visitCount} times!`,
        priority: 2,
      });
    }
  }
});
