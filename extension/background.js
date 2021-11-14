let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

// chrome.action.onClicked.addListener((tab) => {
//   const checkboxes = document.querySelectorAll(
//     "input[type=checkbox][name=trigger-name]"
//   );
//   console.log(checkboxes);
//   checkboxes.forEach(function (checkbox) {
//     checkbox.onchange = function () {
//       chrome.storage.sync.set({ [this.value]: this.checked });
//       chrome.storage.sync.get(checkbox.value, function (d) {
//         console.log(d);
//         checkbox.checked = d;
//       });
//     };
//   });
// });
