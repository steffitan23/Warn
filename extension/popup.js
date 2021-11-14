let getTriggers = document.getElementById("getTriggers"); //guse dom to select button

getTriggers.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: findTriggers,
  });
});

const checkboxes = document.querySelectorAll(
  "input[type=checkbox][name=trigger-name]"
);

checkboxes.forEach((checkbox) => {
  checkbox.onchange = function () {
    chrome.storage.sync.set({ [this.value]: this.checked });
  };
  chrome.storage.sync.get(checkbox.value, (e) => {
    checkbox.checked = e[checkbox.value];
  });
});

function findTriggers() {
  function parseHtmlString(element) {
    var imgSrcUrls = element.getElementsByTagName("img");
    for (var i = 0; i < imgSrcUrls.length; i++) {
      var urlValue = imgSrcUrls[i].getAttribute("src");
      if (urlValue && imgSrcUrls[i].clientHeight > 50 && imgSrcUrls[i].clientWidth > 50) {
        console.log(urlValue);
      }
    }
  }

  parseHtmlString(document);
}
