// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCFvZM-io7AWOKZLwaXN13laMjamcCXsiY",
    authDomain: "u-seum.firebaseapp.com",
    databaseURL: "https://u-seum.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "870561197845"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var userId = user.uid;

firebase.database().ref().once("value", function(snapshot) {

    var currentSnap = snapshot.child("/users/" + userId + "/searchHistory");
    var searchData = currentSnap.val();

    var searchArray = Object.keys(searchData).map(function (key) {
      return searchData[key];
    });
    console.log(searchArray);

    for (var i = 0; i < searchArray.length; i++){

      console.log(searchArray[i].search);
      console.log(searchArray[i].searchTimeStamp);

      var searchTermDiv = $('<div class="ui segment">');
      var searchTimeStampDiv = $('<div class="ui segment">');

      var date = new Date (parseInt(searchArray[i].searchTimeStamp));
      console.log(date);

      // date is in standard javascript format
      // Let's make it friendlier to read

      var formatDateTime = date.toTimeString();
      var formatDateDay = date.toDateString();

      searchTermDiv.append(searchArray[i].search);
      searchTimeStampDiv.append(formatDateTime + " || " + formatDateDay);

      $('#searchTerm').append(searchTermDiv);
      $('#timeStamp').append(searchTimeStampDiv);
    }

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});
