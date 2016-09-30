// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCFvZM-io7AWOKZLwaXN13laMjamcCXsiY",
    authDomain: "u-seum.firebaseapp.com",
    databaseURL: "https://u-seum.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "870561197845"
  };
  firebase.initializeApp(config);

  var db = firebase.database();
  var database;
  var array;

  function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }

  function addPicture(user, array) {
    firebase.database().ref('users/' + user.uid).update({
      favoritePics: array
    });
  }

  function signOut() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  }
  /* Takes to long to return from async call, must call directly in code.
  function retrieve_fav_pictures(user) {
    console.log("retrieving pictures");
    var database = firebase.database().ref('users/' + user.uid + '/favorites');
    var array;
    database.on('value', function(snapshot) {
      array = snapshot.val().picture;
      console.log("array is: " + array);
      return array;
    });
  }
  */

  //
  $( document ).ready(function() {

    $(function () {

<<<<<<< HEAD
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // Retrieves favorite pictures from saved list & adds a new one. Basically everytime we would hit the like button it would call this function.
          database = firebase.database().ref('users/' + user.uid + '/favorites');
          database.on('value', function(snapshot) {
            array = snapshot.val().picture;
            console.log("array is: " + array);
            //return array;
          });
          var pics = array;
          console.log("pics");
          pics.push("new image url");
          addPicture(user,pics);

          console.log("signed in");
          $('#sign-in').html('Sign out');
          $('#sign-in').click(function(){
            signOut();
            $.magnificPopup.close();
          });

=======
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
>>>>>>> 28c372c382bff3529c7c156182dac7ddba73c861



        } else {
          // No user is signed in.
          $('#sign-in').html('Sign in');
          console.log("signed out");
        }
      });
    	$('.popup-modal').magnificPopup({
    		type: 'inline',
    		preloader: false,
    		focus: '#username',
    		modal: true
    	});
      $('.popup-modal').magnificPopup({
    		type: 'inline',
    		preloader: false,
    		focus: '#username',
    		modal: true
    	});
      $('#signup-button').click(function(){
        var email = $('#email-signup').val();
        var password = $('#password-signup').val();
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {

        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
        $.magnificPopup.close();
      });
    	$(document).on('click', '.popup-modal-dismiss', function (e) {
    		e.preventDefault();
    		$.magnificPopup.close();
    	});


      $('#login-button').click(function(){
        var email = $('#email-field').val();
        var password = $('#password-field').val();
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {

          var errorCode = error.code;
          var errorMessage = error.message;

          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);

        });

        $.magnificPopup.close();
      });
    });

/*
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });*/

        var userId = 12345;

        firebase.database().ref().on("value", function(snapshot) {

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

          // var pictureSnap = snapshot.child("/users/" + userId + "/favoritePics");

          //TODO: Loop through the available picures and display them on the screen
          // <div class="column">
          //   <div class="ui segment">
          //     <img>
          //   </div>
          // </div>
          var picture = $('<img src="">').attr("src", currentSnap.val().favoritePics.pic1);

          $('#favoritePics').html(picture);

      }, function(errorObject) {
          console.log("The read failed: " + errorObject.code);
      });
});
