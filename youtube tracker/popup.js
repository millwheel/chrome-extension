document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["youtubeTrackerData"], (result) => {
    const data = result.youtubeTrackerData || { totalTime: 0 };
    const minutes = Math.floor(data.totalTime / 60000);
    document.getElementById(
      "visitCount"
    ).textContent = `Total time spent on YouTube: ${minutes} minutes`;
  });
});
