document.addEventListener('DOMContentLoaded', function() {
    const powerButton = document.querySelector('.power-button');
    updatePopupContent();
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

    if (isActive) {
        chrome.runtime.sendMessage({ action: "changeBadgeProperties", color: [0, 255, 0, 255] });
      } else {
        chrome.runtime.sendMessage({ action: "changeBadgeProperties", color: [128, 128, 128, 255], number:'0' });
      }

}

function updatePopupContent() {
    const title = localStorage.getItem('videoTitle') || 'Title not found';
    const views = localStorage.getItem('videoViews') || 'Views not found';
    const likes = localStorage.getItem('videoLikes') || 'Likes not found';

    document.getElementById('videoTitle').querySelector('span').textContent = title;
    document.getElementById('viewCount').querySelector('span').textContent = `Views: ${views}`;
    document.getElementById('likeCount').querySelector('span').textContent = `Likes: ${likes}`;
}



let observer; 
let observerActive = false;

function startObserver() {
     observerActive = true;
    console.log('Observer started');
    setTimeout(fetchData, 1000);
    updatePopupContent();
    function updatePopupContent() {
        const titleContainer = document.querySelector('#videoTitle');
        const viewsContainer = document.querySelector('#viewCount');
        const likesContainer = document.querySelector('#videoTitle');
    
    
        const title = localStorage.getItem('videoTitle') || 'Title not found';
        console.log("updating content")
        console.log("updating content")
        console.log("updating content")
        const views = localStorage.getItem('videoViews') || 'Views not found';
        console.log("updatingviews",views)
        const likes = localStorage.getItem('videoLikes') || 'Likes not found';
    
        titleContainer.textContent = title;
        viewsContainer.textContent = `Views: ${views}`;
        likesContainer.textContent = `Likes: ${likes}`;
    }
    function fetchData() {
        const likeCountElement = document.querySelector('#like-button > yt-button-shape > label > div > span');
        const viewsCountElement = document.querySelector('#factoids > view-count-factoid-renderer > factoid-renderer > div > span.YtwFactoidRendererValue > span');
    
        const titleElement = document.querySelector('#shorts-title > yt-formatted-string > span:nth-child(1)');
    
        let likeCount = 'Not found';
        let viewsCount = 'Not found';
        let title = 'Not found';
    
        if (likeCountElement) {
            likeCount = likeCountElement.textContent || 'Not found';
            console.log('Like count:', likeCount);
        } else {
            console.log('Like count element not found');
        }
    
        if (viewsCountElement) {
            viewsCount = viewsCountElement.textContent || 'Not found';
            console.log('Views count:', viewsCount);
        } else {
            console.log('Views count element not found');
        }
        if (titleElement) {
            title = titleElement.textContent || 'Not found';
            console.log('Title is :',title);
        } else {
            console.log('Title element not found');
        }  
       
        localStorage.setItem('videoTitle', title);
        localStorage.setItem('videoViews', viewsCount);
        localStorage.setItem('videoLikes', likeCount);
    }

    function clickNextShortButton() {
        if (!observerActive) return; 
        const xpath = '//*[@id="navigation-button-down"]/ytd-button-renderer/yt-button-shape/button/yt-touch-feedback-shape/div/div[2]';
    
        const nextButton = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        
        if (nextButton) {
            nextButton.click();
            
            updatePopupContent();
            updatePopupContent();
            updatePopupContent();
            updatePopupContent();
            updatePopupContent();
            console.clear();
            console.log('Next Short button clicked.');
            fetchData();
            let shotCounter = parseInt(localStorage.getItem('shotCounter') || '0', 10);
            shotCounter++;
            localStorage.setItem('shotCounter', shotCounter);
    
            
            if (shotCounter !== undefined && shotCounter !== null) {
                
                chrome.runtime.sendMessage({ action: "changeBadgeProperties", number: shotCounter.toString() });
            } else {
                console.error('Shot counter is undefined.');
            }
    
            setTimeout(() => {
                console.log('Reached end of video.', progressValues);
                startObserver();
            }, 1000);            
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
                startObserver();
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


