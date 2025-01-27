function populateDropdown(id, start, end, step = 1) {
    const dropdown = document.getElementById(id);
    for (let i = start; i <= end; i += step) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        dropdown.appendChild(option);
    }
}

populateDropdown("hours", 0, 3);
populateDropdown("minutes", 0, 50, 10);

document.getElementById("submit-button").addEventListener("click", (event) => {
    event.preventDefault();

    const hours = parseInt(document.getElementById("hours").value || "0", 10);
    const minutes = parseInt(document.getElementById("minutes").value || "0", 10);

    const totalSeconds = hours * 3600 + minutes * 60;

    chrome.storage.sync.set({ notificationTime: totalSeconds }, () => {
        console.log(`Notification time set to ${hours} hours and ${minutes} minutes (${totalSeconds} seconds).`);
        alert("Notification time updated!");
    });
});
