var urlToTimeSpentStorage = {};
var urlToVisitCountStorage = {};
const userBrowsingData = document.getElementById("user-browsing-data");

displayUserBrowsingData();

function displayUserBrowsingData() {
    chrome.storage.local.get("urlToTimeSpentStorage", function(items){
        urlToTimeSpentStorage = items.urlToTimeSpentStorage;

        chrome.storage.local.get("urlToVisitCountStorage", function(items){
            urlToVisitCountStorage = items.urlToVisitCountStorage;
            const urlList = Object.keys(urlToTimeSpentStorage);
            var urlData = "";

            for(var i = 0; i < urlList.length; i++) {
                urlData += urlList[i] + ": " +  parseInt(urlToTimeSpentStorage[urlList[i]]/1000) + " seconds " +
                urlToVisitCountStorage[urlList[i]] + " visits " + "<br>";
            }

            userBrowsingData.innerHTML = urlData;
        });
    });
}

chrome.storage.onChanged.addListener(function(changes, areaName){
    displayUserBrowsingData();
});

