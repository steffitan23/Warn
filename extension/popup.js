// Initialize butotn with users's prefered color
let getTriggers = document.getElementById("getTriggers");

chrome.storage.sync.get("triggers", ({ triggers }) => {
  console.log("selected triggers:", triggers);
});

// When the button is clicked, inject setPageBackgroundColor into current page
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

checkboxes.forEach(function (checkbox) {
  checkbox.onchange = function () {
    chrome.storage.sync.set({ [this.value]: this.checked });
  };
});

// The body of this function will be execuetd as a content script inside the
// current page
function findTriggers() {
  function parseHtmlString(element) {
    var imgSrcUrls = element.getElementsByTagName("img");
    for (var i = 0; i < imgSrcUrls.length; i++) {
      var urlValue = imgSrcUrls[i].getAttribute("src");
      if (urlValue) {
        console.log(urlValue);
      }
    }
  }

  parseHtmlString(document);
  chrome.storage.sync.get(null, function (result) {
    console.log(result);
  });
}
