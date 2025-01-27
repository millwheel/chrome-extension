(function () {
    const blocker = document.createElement("div");
    blocker.id = "youtube-usage-blocker";
    blocker.innerText = "You have reached maximum YouTube usage time";
    blocker.style.position = "fixed";
    blocker.style.top = 0;
    blocker.style.left = 0;
    blocker.style.width = "100%";
    blocker.style.height = "100%";
    blocker.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    blocker.style.zIndex = "9999";
    blocker.style.color = "white";
    blocker.style.fontSize = "30px";
    blocker.style.display = "flex";
    blocker.style.justifyContent = "center";
    blocker.style.alignItems = "center";

    if (!document.getElementById("youtube-usage-blocker")) {
        document.body.appendChild(blocker);
    }
})();
