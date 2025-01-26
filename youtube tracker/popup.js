function populateDropdown(id, start, end, step = 1) {
    const dropdown = document.getElementById(id);
    for (let i = start; i <= end; i += step) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        dropdown.appendChild(option);
    }
}

populateDropdown("hours", 0, 3);       // Hours: 0, 1, 2, 3
populateDropdown("minutes", 0, 55, 5); // Minutes: 0, 5, 10, ..., 55
