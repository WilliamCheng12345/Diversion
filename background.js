var currTabUrl;
var timer;
var urlToTimeSpentStorage = {};
var urlToVisitCountStorage = {};
var blockedUrls = [];

chrome.storage.local.clear();
trackVisitCountAndTimeSpentOnSite();

function trackVisitCountAndTimeSpentOnSite() {
    chrome.tabs.query({active: true}, function(listOfTabs){
        currTabUrl = new URL(listOfTabs[0].url);
        recordVisitCount();
        recordTimeSpent();
    });
}

function recordVisitCount() {
    urlToVisitCountStorage[currTabUrl.hostname] = getVisitCount() + 1;
    chrome.storage.local.set({"urlToVisitCountStorage": urlToVisitCountStorage});
}

function recordTimeSpent() {
    timer = setInterval(function() {
        urlToTimeSpentStorage[currTabUrl.hostname] = getTimeSpent() + 1000;
        chrome.storage.local.set({"urlToTimeSpentStorage": urlToTimeSpentStorage});
    }, 1000);
}

function getVisitCount() {
    var visitCount = urlToVisitCountStorage[currTabUrl.hostname];
    visitCount = isNaN(visitCount) ? 0 : visitCount;

    return visitCount;
}

function getTimeSpent() {
    var timeSpent = urlToTimeSpentStorage[currTabUrl.hostname];
    timeSpent = isNaN(timeSpent) ? 0 : timeSpent;

    return timeSpent;
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    clearInterval(timer);
    trackVisitCountAndTimeSpentOnSite();
});

// When a tab is created, the onActivated and onUpdated listeners will both be fired.
// This will lead a single visit to be counted twice, so we need a onCreated listener that
// will remove a visit.
chrome.tabs.onCreated.addListener(function(tab){
    chrome.tabs.query({active: true}, function(listOfTabs){
        currTabUrl = new URL(listOfTabs[0].url);
        urlToVisitCountStorage[currTabUrl.hostname] = getVisitCount() - 1;
        chrome.storage.local.set({"urlToVisitCountStorage": urlToVisitCountStorage});
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
     if(changeInfo.status === "complete"){
        chrome.tabs.query({active: true}, function(listOfTabs){
            currTabUrl = new URL(listOfTabs[0].url);
            recordVisitCount();
        })
     }
});

chrome.browserAction.onClicked.addListener(function(activeTab) {
    chrome.tabs.create({ url: chrome.extension.getURL("diversion.html") });
});

chrome.storage.onChanged.addListener(function(changes, areaName){
    chrome.storage.local.get({blockedUrls: []}, function(items){
        blockedUrls = items.blockedUrls;
        console.log(blockedUrls);
    });
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    const currTabUrl = new URL(details.url);

    if(blockedUrls) {
        for(var i = 0; i < blockedUrls.length; i++) {
            if(currTabUrl.hostname === blockedUrls[i]) {
                chrome.storage.local.set({"accessedBlockedWebsite": currTabUrl.hostname});
                return {redirectUrl: chrome.extension.getURL("blocked-website-warning.html")};
            }
        }
    }
}, {urls:["<all_urls>"]}, ["blocking"]);


