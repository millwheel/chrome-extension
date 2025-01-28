export function scheduleDailyAlarm() {
    chrome.alarms.create("reset-block-timer", {
        when: getNextMidnightTime(),
        periodInMinutes: 24 * 60,
    });
}

export function getNextMidnightTime() {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    return nextMidnight.getTime();
}
