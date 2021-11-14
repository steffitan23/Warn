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
      mode: "cors",
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
  async function parseHtmlForImgs(element) {
    function checkForTriggers(response, deleteElement) {
      var toDelete = [];
      response.forEach((trigger) => {
        console.log(trigger);
        chrome.storage.sync.get(null, (stored) => {
          if (trigger.name == "Violence" && stored["violence"]) {
            toDelete.append(deleteElement);
            console.log("VIOLENCE FOUND");
          }
          if (
            (trigger.name == "Explicit Nudity" ||
              trigger.name == "Suggestive") &&
            stored["adult-content"]
          ) {
            toDelete.append(deleteElement);
            console.log("ADULT CONTENT FOUND");
          }
          if (
            trigger.name == "Visually Disturbing" &&
            stored["visually-disturbing"]
          ) {
            toDelete.append(deleteElement);
            console.log("VISUALLY DISUTBRING FOUND");
          }
          if (
            (trigger.name == "Drugs" ||
              trigger.name == "Tobacco" ||
              trigger.name == "Alcohol") &&
            stored["substance-abuse"]
          ) {
            toDelete.append(deleteElement);
            console.log("substance FOUND");
          }
          if (trigger.name == "Gambling" && stored["gambling"]) {
            toDelete.append(deleteElement);
            console.log("VGMABLIGNG FOUND");
          }
          if (trigger.name == "Hate Symbols" && stored["hate"]) {
            toDelete.append(deleteElement);
            console.log("ahatate FOUND");
          }
        });
      });
      toDelete.forEach((item) => {
        item.src = "";
      });
    }
    var imgSrcUrls = element.getElementsByTagName("img");
    for (var i = 0; i < imgSrcUrls.length; i++) {
      var urlValue = imgSrcUrls[i].getAttribute("src");
      if (
        urlValue &&
        imgSrcUrls[i].clientHeight > 50 &&
        imgSrcUrls[i].clientWidth > 50
      ) {
        console.log(urlValue);
        var d = await post_request_image(APP_IP + "/awsModeration", urlValue);
        checkForTriggers(d, imgSrcUrls[i]);
      }
    }
  }

  function parseHtmlForVids(element) {
    var vidSrcUrls = element.getElementsByTagName("video");
    for (var i = 0; i < vidSrcUrls.length; i++) {
      var urlValue = vidSrcUrls[i].getAttribute("src");
      if (
        urlValue &&
        vidSrcUrls[i].clientHeight > 50 &&
        vidSrcUrls[i].clientWidth > 50
      ) {
        console.log(urlValue);
        post_request_image(APP_IP + "/test", urlValue);
      }
    }
  }

  parseHtmlForImgs(document);
  parseHtmlForVids(document);
}

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: findTriggers,
  });
}
