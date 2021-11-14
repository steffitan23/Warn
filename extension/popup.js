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
