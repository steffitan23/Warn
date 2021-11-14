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

  function initial_assembly_req(url) {
    return fetch(APP_IP + "/assembly", {
      mode: "cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "audio_url=" + url,
      method: "POST",
    }).then((response) => response.json());
  }

  function poll_assembly(id) {
    return fetch(APP_IP + "/assemblyPoll", {
      body: "id=" + id,
      mode: "cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    }).then((response) => response.json());
  }

  async function request_Assembly(url, toDelete) {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let delay_time = 0;
    let response = await initial_assembly_req(url);
    console.log(response);
    let id = response.id;
    let poll_response = await poll_assembly(id);
    while (poll_response.status != "completed" && delay_time < 4) {
      await delay(7000);
      console.log(poll_response.status);
      poll_response = await poll_assembly(id);
      delay_time += 1;
    }
    console.log(poll_response);
    var summary = poll_response.content_safety_labels.summary;
    chrome.storage.sync.get(null, (stored) => {
      if (
        (summary.nsfw >= 0.7 || summary.profanity >= 0.7) &&
        stored["adult-content"]
      ) {
        toDelete.remove();
        console.log("removed element bc adult content");
      }
      if (summary.gambling >= 0.7 && stored["gambling"]) {
        toDelete.remove();
        console.log("removed element bc gambling");
      }
      if (
        (summary.alcohol >= 0.7 || summary.drugs >= 0.7) &&
        stored["substance-abuse"]
      ) {
        toDelete.remove();
        console.log("removed element bc substances");
      }
    });
  }

  async function parseHtmlForImgs(element) {
    const replaceImage = "images/replace.png";
    function checkForTriggers(response, deleteElement) {
      response.forEach((trigger) => {
        console.log(trigger);
        chrome.storage.sync.get(null, (stored) => {
          if (trigger.name == "Violence" && stored["violence"]) {
            deleteElement.src = replaceImage;
            console.log("VIOLENCE FOUND");
          }
          if (
            (trigger.name == "Explicit Nudity" ||
              trigger.name == "Suggestive") &&
            stored["adult-content"]
          ) {
            deleteElement.src = replaceImage;
            console.log("ADULT CONTENT FOUND");
          }
          if (
            trigger.name == "Visually Disturbing" &&
            stored["visually-disturbing"]
          ) {
            deleteElement.src = replaceImage;
            console.log("VISUALLY DISUTBRING FOUND");
          }
          if (
            (trigger.name == "Drugs" ||
              trigger.name == "Tobacco" ||
              trigger.name == "Alcohol") &&
            stored["substance-abuse"]
          ) {
            deleteElement.src = replaceImage;
            console.log("substance FOUND");
          }
          if (trigger.name == "Gambling" && stored["gambling"]) {
            deleteElement.src = replaceImage;
            console.log("VGMABLIGNG FOUND");
          }
          if (trigger.name == "Hate Symbols" && stored["hate"]) {
            deleteElement.src = replaceImage;
            console.log("ahatate FOUND");
          }
        });
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
    var vidSrcUrls = element.getElementsByTagName("audio");
    for (var i = 0; i < vidSrcUrls.length; i++) {
      var urlValue = vidSrcUrls[i].src;
      if (urlValue) {
        console.log(urlValue);
        request_Assembly(urlValue, vidSrcUrls[i]);
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
