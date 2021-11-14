var loadfunction = window.onload;
window.onload = function (event) {
  chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
    console.log(response.farewell);
  });
  if (loadfunction) loadfunction(event);
};
