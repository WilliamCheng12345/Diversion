const blockedWebsiteWarning = document.getElementById("blocked-website-warning");

chrome.storage.local.get({accessedBlockedWebsite :[]}, function(items){
    var blockedWebsite = items.accessedBlockedWebsite;
    blockedWebsiteWarning.innerHTML = "You have blocked " + blockedWebsite +
    ". Do not get distracted!";
});