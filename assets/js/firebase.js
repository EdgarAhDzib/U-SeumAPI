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

// Test userId
var userId = 12345;

database.ref().on("value", function (snapshot) {

    // Account settings page
    //Let's find the user's data saved in the database
    var currentSnap = snapshot.child("/users/" + userId);

    $('#cardName').html(currentSnap.val().firstName);
    $('#joinDate').html("Joined: " + currentSnap.val().joinDate);
    $('#shortBio').html(currentSnap.val().shortBio);
    $('#friendCount').html('<i class="user icon"></i>' + currentSnap.val().friendCount + " Friends");
    $('#longBio').html(currentSnap.val().longBio);
    $('#favCount').html(currentSnap.val().favCount);
    $('#viewCount').html(currentSnap.val().viewCount);
    $('#timeSpent').html(currentSnap.val().timeSpent);

    // Favorite pic pages
    //Let's find the user's favorite pictures

    // var pictureSnap = snapshot.child("/users/" + userId + "/favoritePics");

    //TODO: Loop through the available picures and display them on the screen
    // <div class="column">
    //   <div class="ui segment">
    //     <img>
    //   </div>
    // </div>
    var picture = $('<img src="">').attr("src", currentSnap.val().favoritePics.pic1);

    $('#favoritePics').html(picture);

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
