var blockedUrls = [];
const blockedWebsiteInput = document.getElementById("blocked-website-input");
const submitButton = document.getElementById("blocked-website-submit");
const userBlockedWebsites = document.getElementById("user-blocked-websites");

blockedWebsiteInput.focus();
displayUserBlockedWebsites();

function displayUserBlockedWebsites() {
    userBlockedWebsites.innerHTML = "";

    chrome.storage.local.get({blockedUrls: []}, function(items){
        blockedUrls = items.blockedUrls;

        for(var i = 0; i < blockedUrls.length; i++) {
            const removeButton = document.createElement('button');
            removeButton.id = blockedUrls[i];
            removeButton.innerHTML = "X";
            removeButton.className = "btn btn-danger remove-blocked-url";
            removeButton.style.marginBottom = "2%";

            userBlockedWebsites.appendChild(removeButton);
            userBlockedWebsites.innerHTML += " " + blockedUrls[i] + "<br>";
        }
    });
}

function removeBlockedUrl(blockedUrl) {
    chrome.storage.local.get({blockedUrls: []}, function(items){
        blockedUrls = items.blockedUrls;

        const index = blockedUrls.indexOf(blockedUrl);
        blockedUrls.splice(index, 1);

        chrome.storage.local.set({"blockedUrls": blockedUrls});

        displayUserBlockedWebsites();
    });
}

submitButton.onclick = function() {
    const blockedUrl = blockedWebsiteInput.value;
    blockedWebsiteInput.value = "";

    blockedUrls.push(blockedUrl);
    chrome.storage.local.set({"blockedUrls": blockedUrls});
    blockedWebsiteInput.focus();
    displayUserBlockedWebsites();
}

blockedWebsiteInput.addEventListener("keyup", function(event){
    if(event.keyCode === 13) {
        submitButton.click();
    }
});

document.body.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-blocked-url")) {
       removeBlockedUrl(event.target.id);
    }
});

