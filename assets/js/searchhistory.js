
var user;
console.log("user is :" + user);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("is this working. plz let it be");
        user =  = firebase.auth().currentUser;

        console.log("signed in");
        $('#sign-in').html('Sign out');
        $('#sign-in').click(function() {
            signOut();
            $.magnificPopup.close();
        });



    } else {
        // No user is signed in.
        $('#sign-in').html('Sign in');
        console.log("not signed in");
    }
});


firebase.database().ref().once("value", function(snapshot) {

    var currentSnap = snapshot.child("/users/" + user.uid + "/searchHistory");
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
