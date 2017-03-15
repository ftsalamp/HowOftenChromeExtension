function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

function renderResult(resultText) {
  document.getElementById('result').textContent = resultText;
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get('hours', function(resultt) {
    if(isNaN(resultt.hours)){
      chrome.storage.sync.set({'hours': 3}, function() {
      });
    }
  });

  getCurrentTabUrl(function(url) {
  var counter=0;
    chrome.storage.sync.get('hours',function(savedSetting){
      var d = new Date();
      var n = d.getTime();
      chrome.history.getVisits({"url":url}, function(visitedItems){
        console.log(visitedItems);
        visitedItems.forEach(function(item){
            console.log(n-item.visitTime);
            console.log(savedSetting.hours*36*100000);
            if((n-item.visitTime)<=(savedSetting.hours*36*100000)){
              counter++;
            }
            console.log("render");
            renderResult('Search term: ' + url + '\n' +
              'Times visited: '+ counter);
        });
      });

    });
  });
  document.getElementById("settings").addEventListener("click", function(){
      chrome.tabs.create({ 'url': "options.html" });
  });

});
