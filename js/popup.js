function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0]; //get the 1st active tab
    var url = tab.url; //get the url
    console.assert(typeof url == 'string', 'tab.url should be a string'); // if the url is not a string replace it with a string error message

    callback(url);
  });
}

function renderResult(resultText) {
  document.getElementById('result').textContent = resultText; //show result in popup.html
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get('hours', function(resultt) { //get the saved value for hours
    if(isNaN(resultt.hours)){ //if there isn't a value saved
      chrome.storage.sync.set({'hours': 3}, function() { //3 is the fallback value
      });
    }
  });

  getCurrentTabUrl(function(url) {
  var counter=0; //initialize counter
    chrome.storage.sync.get('hours',function(savedSetting){
      var d = new Date();
      var n = d.getTime(); //get current time
      chrome.history.getVisits({"url":url}, function(visitedItems){ //get all the visits loged in the history for the given url
        visitedItems.forEach(function(item){ //for each history entry
            if((n-item.visitTime)<=(savedSetting.hours*36*100000)){ //compare current time to visited time - time conversion to milliseconds
              counter++;
            }
            renderResult('Search term: ' + url + '\n' +
              'Times visited: '+ counter);
        });
      });

    });
  });
  document.getElementById("settings").addEventListener("click", function(){ //add event listener to the settings icon
      chrome.tabs.create({ 'url': "options.html" }); //open extension settings in new tab
  });

});
