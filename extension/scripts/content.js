// constant query selectors
const STORAGE_KEY = 'yt-adblock-data';
const SKIP_BUTTON = '.ytp-ad-skip-button-modern';
const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=';
const YTP_AD_TEXT = '[id^="simple-ad-badge"] .ytp-ad-text';

// runtime variables
let intervalId = undefined;
let count = 0;

function updateAdBlockCount() {
    const key = `${STORAGE_KEY}-adsBlocked`;

    chrome.storage.local.get([key])
        .then((res) => {
            chrome.storage.local.set({
                [key]: res[key] + 1
            });
        });

    chrome.runtime.sendMessage({ action: 'get', key }, res => {
        console.log('session', res)
        const data = { [key]: res[key] + 1 }
        console.log(data)
        chrome.runtime.sendMessage({ action: 'set', data })
    });

    chrome.runtime.sendMessage({ action: 'get', key }, res => {
        console.log('post increment session: ', res)
    });
}

function getSkipButton() {
    // returns the skip button
    // we want to click this after we skip the ad for smoothness
    return document.querySelector(SKIP_BUTTON);
}

function isYoutubeVideo() {
    return window.location.toString().startsWith(YOUTUBE_VIDEO_URL);
}

function getVideo() {
    return document.querySelector('video');
}

function adCount() {
    elem = document.querySelector(YTP_AD_TEXT);
    if (elem) {
        text = elem.innerText;
        tokens = text.split(' ');
        return {
            currentAd: tokens[1],
            totalAds: tokens[3]
        };
    }
}

function skip(videoElement) {
    if (count <= 0) {
        return;
    }

    videoElement.currentTime = videoElement.seekable.end(0);
    const skip_button = getSkipButton();
    if (skip_button) {
        skip_button.click();
    }
    count--;
    updateAdBlockCount();
}

function searchAndDestroy() {
    // preliminary check to see if adblock is enabled and we're watching a video
    if (!isYoutubeVideo()) {
        return;
    }
    // search
    const adInfo = adCount();
    if (adInfo) {
        const { currentAd, totalAds } = adInfo;
        count = totalAds - currentAd + 1;
        const videoElement = getVideo()

        if (videoElement) {
            // destroy
            skip(videoElement);

        }
    }

    // in the case there's a survey
    const skip_button = getSkipButton();
    if (skip_button) {
        skip_button.click();
    }
}

function execute () {
    intervalId = setInterval(searchAndDestroy,  100);
}

function start() {
    chrome.storage.local.set({
        [`${STORAGE_KEY}-isRunning`]: true 
    });
    execute();
}

function stop() {
    chrome.storage.local.set({
        [`${STORAGE_KEY}-isRunning`]: false
    });
    if (intervalId) {
        clearInterval(intervalId);
    }
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.content === 'start') {
        start()
    } else if (message.content === 'stop') {
        stop();
    } else {
        console.log('Unable to process message request: ', message.content);
    }
});

chrome.runtime.sendMessage({action: 'set', data: {[`${STORAGE_KEY}-adsBlocked`]: 0}});

chrome.storage.local.get([`${STORAGE_KEY}-isRunning`])
    .then((res) => {
        if (res[`${STORAGE_KEY}-isRunning`]) {
            execute()
        }
    });
