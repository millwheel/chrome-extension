function populateDropdown(id, start, end, step = 1) {
    const dropdown = document.getElementById(id);
    for (let i = start; i <= end; i += step) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        dropdown.appendChild(option);
    }
}

populateDropdown("hours", 0, 4);
populateDropdown("minutes", 0, 50, 10);

document.getElementById("submit-button").addEventListener("click", (event) => {
    event.preventDefault();

    const hoursDropdown = document.getElementById("hours");
    const minutesDropdown = document.getElementById("minutes");

    const hoursValue = hoursDropdown.value;
    const minutesValue = minutesDropdown.value;

    if (isNaN(hoursValue) && isNaN(minutesValue)) {
        alert("Please select a valid time for Hours and Minutes.");
        return;
    }

    const hours = parseInt(hoursValue, 10) || 0;
    const minutes = parseInt(minutesValue, 10) || 0;

    if (hours === 0 && minutes === 0) {
        alert("Please set a time greater than 0.");
        return;
    }

    setMaximumUsageTime(hours, minutes);
});

function setMaximumUsageTime(hours, minutes) {
    const maximumUsageSeconds = hours * 3600 + minutes * 60;

    chrome.storage.sync.set({ customUsageSeconds : maximumUsageSeconds }, () => {
        let message = "";
        if (hours === 1) {
            message += `${hours} hour `;
        } else if (hours >= 2) {
            message += `${hours} hours `;
        }
        if (minutes > 0) {
            message += `${minutes} minutes`;
        }
        alert(`Your YouTube usage time is set to ${message}.`);

        chrome.runtime.sendMessage({ action: "updateMaximumUsageSecond", value: maximumUsageSeconds });
    });
}
