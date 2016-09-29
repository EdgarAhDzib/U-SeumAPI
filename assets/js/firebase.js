// Initialize Firebase
var config = {
    apiKey: "AIzaSyCFvZM-io7AWOKZLwaXN13laMjamcCXsiY",
    authDomain: "u-seum.firebaseapp.com",
    databaseURL: "https://u-seum.firebaseio.com",
    storageBucket: "u-seum.appspot.com",
    messagingSenderId: "870561197845"
};
firebase.initializeApp(config);

var database = firebase.database();

// Test userId
var userId = 12345;

database.ref().on("value", function(snapshot) {

    // Account settings page
    // Let's find the user's data saved in the database
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
    // Let's find the user's favorite pictures

    // This returns an object of the pictures
    var pictureData = currentSnap.val().favoritePics;
    console.log(pictureData);

    // Convert to an array
    var picArray = Object.keys(pictureData).map(function (key) {
      return pictureData[key];
    });
    console.log(picArray);

    //TODO: Loop through the picures in the array and display them on the screen
    //
    for ( var i = 0; i < picArray.length; i++ ) {

      var displayElement = $('<div class="column">');
      var displayPic = $('<img class="ui fluid large image" src="">').attr("src", picArray[i]);

      displayElement.append(displayPic);
      $('#favoritePics').append(displayElement);

    }

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});
