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

  function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }
  function writePictures(userId, array) {
    firebase.database().ref('users/' + userId + '/favorites').set({
      picture: array
    });
  }
  function addPicture(user, array) {
    firebase.database().ref('users/' + user.uid + '/favorites').update({
      picture: array
    });
  }

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

  function retrievePictures(snapshot) {
    console.log("retrieving pictures");
    var array = snapshot.val().picture;
    return array;
  }

  function getPictures() {
    console.log("in get pictures");
    return database.once('value').then(retrievePictures(snapshot));
  }


  //
  $( document ).ready(function() {

    $(function () {

      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }, function(error) {
        // An error happened.
      });

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          database = firebase.database().ref('users/' + user.uid + '/favorites');
          database.on('value', function(snapshot) {
            array = snapshot.val().picture;
            //console.log("array is: " + array);
            //return array;
          });
          var pics = array;
          console.log("pics");
          pics.push("new image url");
          console.log("pics :" + pics);
          //console.log("database: " + database);
          // User is signed in.
          //var pics = retrieve_fav_pictures(user);
          //console.log("signed in");
          //console.log(user);
          //writeUserData(user.uid,"Test_user",user.email,"http:www.test_url.com");
          //writePictures(user.uid,"image here");

          //console.log("pictures list: " + pics);

          addPicture(user,pics);
        } else {
          // No user is signed in.
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
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
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
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          // [END_EXCLUDE]
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
});
