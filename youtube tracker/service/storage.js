const SPENT_TIME_RECORD = "YouTubeUsageTimeRecord";

export function loadAccumulatedSpentTimes() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([SPENT_TIME_RECORD], (result) => {
            const spentSecond = result[SPENT_TIME_RECORD] || 0;
            console.log("Load YouTube usage time: ", spentSecond, "seconds");
            resolve(spentSecond);
        });
    });
}

export function recordAccumulatedSpentTimes(spentSecond) {
    chrome.storage.local.set({ [SPENT_TIME_RECORD]: spentSecond }, () => {
        console.log("Record YouTube usage time: ", spentSecond, "seconds");
    });
}
