document.addEventListener('DOMContentLoaded', function() {
  $('#flat-slider').slider({
    orientation: 'horizontal',
    range:       false,
    value:      3,
    min:        1,
    max:        72
  });

  chrome.storage.sync.get('hours', function(resultt) {
    if(isNaN(resultt.hours)){
      $('#flat-slider').slider({
        value:      3
      });
    }
    else{
      $('#flat-slider').slider({
        value:      resultt.hours
      });
    }
    document.getElementById("value").innerHTML="Current Value: "+$('#flat-slider').slider("option", "value");
});

  document.getElementById("flat-slider").addEventListener('mouseup', function(){
    var temp=$('#flat-slider').slider("option", "value");
    document.getElementById("value").innerHTML="Current Value: "+temp;
    saveChanges();
  });
});

function saveChanges() {
        // Get a value saved in a form.
        var theValue = $('#flat-slider').slider("option", "value");
        // Check that there's some code there.
        if (!theValue) {
          window.alert('Error: No value specified');
          return;
        }
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set({'hours': theValue}, function() {
          // Notify that we saved.
          window.alert('Settings saved');
        });
      }
