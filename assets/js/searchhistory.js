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
var userId = "12345";

firebase.database().ref().once("value", function(snapshot) {

    var currentSnap = snapshot.child("/users/" + userId + "/searchHistory");
    var searchData = currentSnap.child("search");

    var searchArray = Object.keys(searchData).map(function (key) {
      return searchData[key];
    });
    console.log(searchArray);
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});
