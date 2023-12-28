// random user name generation
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateString(length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
//To find the browser
let browserName = "";
let userAgent = navigator.userAgent;
console.log(userAgent);
if (userAgent.indexOf("Firefox") > -1) {
  browserName = "Mozilla Firefox";
} else if (userAgent.search("Edg/") > -1) {
  browserName = "Microsoft Edge";
} else if (userAgent.indexOf("Chrome") > -1) {
  browserName = "Google Chrome";
} else if (userAgent.indexOf("Safari") > -1) {
  browserName = "Apple Safari";
} else if (userAgent.indexOf("Opera") > -1) {
  browserName = "Opera";
} else if (
  userAgent.indexOf("MSIE") > -1 ||
  userAgent.indexOf("Trident/") > -1
) {
  browserName = "Internet Explorer";
} else {
  browserName = "Unknown Browser";
}
//logged time and date
let getDate = new Date();
let year = getDate.getFullYear();
let month = (getDate.getMonth() + 1).toString().padStart(2, "0");
let day = getDate.getDate();
let date = year + "" + month + "" + day.toLocaleString();
let hh = getDate.getHours();
let mm = getDate.getMinutes();
let ss = getDate.getSeconds();
let time =
  hh.toLocaleString() + ":" + mm.toLocaleString() + ":" + ss.toLocaleString();
let obj = {};

//function to store in Session storage
function storage(value) {
  sessionStorage.setItem("usernames", JSON.stringify(value));
}

//to get ip adress
fetch("https://api.ipify.org?format=json")
  .then((response) => response.json())
  .then((data) => {
    const ipAddress = data.ip;
    console.log("User IP address:", ipAddress);
    var storedName = sessionStorage.getItem("usernames");
    obj = {
      userInfo: [
        {
          ip: ipAddress,
          userName: generateString(5),
          browserName: browserName,
          dates: date,
          time: time,
        },
      ],
      userEvents: [],
    };
    try {
      var userNameKey = JSON.parse(sessionStorage.usernames);
      var ipCheck = userNameKey.userInfo[0].ip;
    } catch {
      storage(obj);
    }
    var userNameKey = JSON.parse(sessionStorage.usernames);
    var ipCheck = userNameKey.userInfo[0].ip;
    if (ipAddress != ipCheck) {
      storage(obj);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
let pageName = "";
function determineCurrentScreen() {
  let currentURL = window.location.href;
  pageName = currentURL.substring(currentURL.lastIndexOf("/") + 1);
  console.log("Current page name: " + pageName);
}

document.addEventListener("DOMContentLoaded", function () {
  determineCurrentScreen();
});
function changedPagename(flag) {
  if (flag) {
    pageName = newPageName;
  }
  return pageName;
}
let ls = {};
let clickCounts = {};
let newPageName = "";
let isPageChanged = false;
(function () {
  let captureObject = {};
  let clickCounts = {};

  function updateClickCount(tagId, tagType) {
    if (!clickCounts[tagId]) {
      clickCounts[tagId] = 1;
    } else {
      clickCounts[tagId]++;
    }

    const clickCountDisplay = document.getElementById(
      `${tagType}${tagId}_click_count`
    );
    if (clickCountDisplay) {
      clickCountDisplay.textContent = clickCounts[tagId];
    }

    // Update captureObject with nested structure
    if (!captureObject[pageName]) {
      captureObject[pageName] = {};
    }

    captureObject[pageName][`${tagType}${tagId}`] = clickCounts[tagId];

    obj.userEvents = [{ ...captureObject }];
    console.log(JSON.stringify(obj));
    storage(obj);
  }

  function handleButtonClick(event) {
    const target = event.target;

    if (target.tagName === "BUTTON") {
      const buttonId = target.textContent;
      updateClickCount(buttonId, "btn_");
      changedPagename(isPageChanged);
    }

    if (target.tagName === "A") {
      const linkId = target.textContent;
      updateClickCount(linkId, "link_");
      changedPagename(isPageChanged);
    }
  }
  document.addEventListener("click", handleButtonClick);
})();
function startObserving() {
  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    console.log("Current URL:", currentUrl);
    newPageName = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    console.log("Last index" + newPageName);
    if (newPageName !== pageName) {
      isPageChanged = true;
      console.log("Switched to screen: " + newPageName);
    }
  });
  // Use document.body as the target node
  const targetNode = document.body;
  const observerConfig = { subtree: true, childList: true };
  observer.observe(targetNode, observerConfig);
}

// Run the observer after the DOM has fully loaded
document.addEventListener("DOMContentLoaded", startObserving);
