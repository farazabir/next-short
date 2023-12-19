document.addEventListener('DOMContentLoaded', function() {
    const powerButton = document.querySelector('.power-button');


    const isActive = localStorage.getItem('extensionActive') === 'true';
    updateButtonAppearance(powerButton, isActive);

    powerButton.addEventListener('click', function() {

        
        const isActive = !this.classList.contains('active');
        localStorage.setItem('extensionActive', isActive);
        updateButtonAppearance(this, isActive);
        this.classList.add('spin');
        setTimeout(() => {
            this.classList.remove('spin');
        }, 1000);
       
  
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: isActive ? startObserver : stopObserver
            });
        });
    });
});

function updateButtonAppearance(button, isActive) {
    button.classList.toggle('active', isActive);
    button.style.backgroundColor = isActive ? '#3F72AF' : '#112D4E';
}

let observer; 
let observerActive = false;

function startObserver() {
     observerActive = true;
    console.log('Observer started');


    function clickNextShortButton() {
        if (!observerActive) return; 
    
        const xpath = '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-shorts/div[4]/div[2]/ytd-button-renderer/yt-button-shape/button/yt-touch-feedback-shape/div/div[2]';
        const nextButton = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        
        if (nextButton) {
            nextButton.click();
            console.log('Next Short button clicked.');
        } else {
            console.log('Next Short button not found.');
        }
    }
    

let progressValues = [];

function observeProgressBar(mutations) {
    for (let mutation of mutations) {
        if (mutation.attributeName === 'aria-valuenow') {
            let newValue = parseInt(mutation.target.getAttribute('aria-valuenow'), 10);
            progressValues.push(newValue);
            console.log('Progress Value:', newValue);

            if (newValue === 0 && progressValues.length > 1) {
                let lastValue = progressValues[progressValues.length - 2];
                console.log("lastvalue",lastValue)
                if (lastValue > 0) {  

                    clickNextShortButton();
                    console.log('Reached end of video.', progressValues);
                  
                    progressValues = []; 
                }
            }
        }
    }
}



function disableObserverTemporarily() {
    observerActive = false;
    setTimeout(() => {
        observerActive = true;
    }, 3000);
}


const progressBar = document.getElementById('progress-bar-line');
if (progressBar) {
    
    observer = new MutationObserver(observeProgressBar);
    observer.observe(progressBar, { attributes: true });
    console.log('Observer attached to progress bar.');

   
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', disableObserverTemporarily);
    });
} else {
    console.log('Progress bar not found.');
}

   
}

function stopObserver() {
    if (observer) {
        observer.disconnect(); 
        observer = null; 
        observerActive = false; 
        console.log('Observer disconnected');
    }
}