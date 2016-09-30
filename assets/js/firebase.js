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
      shortBio: "short",
      timeSpent: 0,
      viewCount: 0,
      longBio: "long",
      friendCount: 0,
      favCount: 0
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

  function checkRating(array) {
      var url = $('#caption-img').attr('src');
      for (var i = 0; i < array.length; i++) {
        if (url === array[i])
        console.log("true");
      }

  }

    $(function () {

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

          // Retrieves favorite pictures from saved list & adds a new one. Basically everytime we would hit the like button it would call this function.
          database = firebase.database().ref('users/' + user.uid);
          database.on('value', function(snapshot) {
            console.log("snapshot value: " + snapshot.val());
            array = snapshot.val().favoritePics;
            checkRating(array);
            console.log("the retrieved list is: " + array);
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

    });
