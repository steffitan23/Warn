chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  getCurrentTab();
  if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
});

function findTriggers() {
  const APP_IP = "http://127.0.0.1:5000";
  async function post_request_image(url, image_url) {
    return fetch(url, {
      body: "image_uri=" + image_url,
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    }).then((response) => response.json());
  }

  async function post_request_text(url, text) {
    return fetch(url, {
      body: "text=" + text,
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    }).then((response) => response.json());
  }
  function parseHtmlForImgs(element) {
    console.log("parsing", element);
    var imgSrcUrls = element.getElementsByTagName("img");
    for (var i = 0; i < imgSrcUrls.length; i++) {
      console.log("IN THE LOOP");
      var urlValue = imgSrcUrls[i].getAttribute("src");
      if (
        urlValue &&
        imgSrcUrls[i].clientHeight > 50 &&
        imgSrcUrls[i].clientWidth > 50
      ) {
        console.log(urlValue);
        post_request_image(APP_IP + "/test", urlValue);
      }
    }
  }
  parseHtmlForImgs(document);
}

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: findTriggers,
  });
}
