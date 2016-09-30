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
  var userId;

  function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl,
      firstName: fName,
      joinDate: jDate,
      shortBio: sBio,
      timeSpent: tSpent,
      viewCount: vCount,
      longBio: lBio,
      friendCount: fCount,
      favCount: favCount
    });
  }
  /*
  function addPicture(user, array) {
    console.log("in add picture");
    firebase.database().ref('users/' + user.uid).update({
      favoritePics: array
    });
  }
  */
  function signOut() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  }

    $(function () {

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

          // Retrieves favorite pictures from saved list & adds a new one. Basically everytime we would hit the like button it would call this function.
          database = firebase.database().ref('users/' + user.uid + '/favoritePics');
          database.on('value', function(snapshot) {
            array = snapshot.val();
            console.log("array is: " + array);
            //return array;
          });

          userID = user.uid;

          console.log("signed in");
          $('#sign-in').html('Sign out');
          $('#sign-in').click(function(){
            signOut();
            $.magnificPopup.close();
          });



        } else {
          // No user is signed in.
          $('#sign-in').html('Sign in');
          console.log("not signed in");
        }
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



      firebase.database().ref().once("value", function(snapshot) {
        if (user) {
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

        // This returns an object of the pictures
        var pictureData = currentSnap.val().favoritePics;
        console.log(pictureData);

        // Convert to an array
        var picArray = Object.keys(pictureData).map(function (key) {
          return pictureData[key];
        });
        //console.log(picArray);

        //TODO: Loop through the picures in the array and display them on the screen
        //
        for ( var i = 0; i < picArray.length; i++ ) {

          var displayElement = $('<div class="column">');
          var displayPic = $('<img class="ui fluid large image" src="">').attr("src", picArray[i]);

          displayElement.append(displayPic);
          $('#favoritePics').append(displayElement);

        }
      }

    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });



    });
