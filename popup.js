document.addEventListener("DOMContentLoaded", () => {
    let statusText = document.getElementById("currentStatus");

    // Lấy trạng thái hiện tại từ storage
    chrome.storage.sync.get(["autoFarmStatus"], (result) => {
        let currentStatus = result.autoFarmStatus || "OFF";
        statusText.textContent = currentStatus;
    });

    function injectContentScript(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0 || !tabs[0].url.startsWith("https://sunflower-land.com")) {
                console.warn("⚠️ Không thể chạy trên trang này.");
                return;
            }

            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    files: ["content.js"],
                },
                () => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    }
                    if (callback) callback();
                }
            );
        });
    }

    // Bật tool khi bấm ON
    document.getElementById("btnOn").addEventListener("click", () => {
        chrome.storage.sync.set({ autoFarmStatus: "ON" }, () => {
            statusText.textContent = "ON";
            injectContentScript(() => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "startTool" });
                });
            });
        });
    });

    // Tắt tool khi bấm OFF
    document.getElementById("btnOff").addEventListener("click", () => {
        chrome.storage.sync.set({ autoFarmStatus: "OFF" }, () => {
            statusText.textContent = "OFF";
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "stopTool" });
            });
        });
    });
});
