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

  //
  $( document ).ready(function() {

      $('#sign-in').magnificPopup({
    	  type: 'ajax',
        closeOnBgClick: false, 
    	  callbacks: {
    	    parseAjax: function(mfpResponse) {

    	      mfpResponse.data = '<html><head><meta charset="utf-8"><title></title><script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js" integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk=" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/semantic-ui/2.2.4/semantic.min.js"></script><link rel="stylesheet" href="https://cdn.jsdelivr.net/semantic-ui/2.2.4/semantic.min.css"><style type="text/css">body {background-color: #DADADA;}body > .grid {height: 100%;}.image {margin-top: -100px;}.column {max-width: 450px;}</style><style type="text/css">body {background-color: #DADADA;}body > .grid {height: 100%;}.image {margin-top: -100px;}.column {max-width: 450px;}</style><script>$(document).ready(function() {$(".ui.form").form({fields: {email: {identifier  : "email",rules: [{type   : "empty",prompt : "Please enter your e-mail"},{type   : "email",prompt : "Please enter a valid e-mail"}]},password: {identifier  : "password",rules: [{type   : "empty",prompt : "Please enter your password"},{type   : "length[6]",prompt : "Your password must be at least 6 characters"}]}}});});</script></head><body><div class="ajax-text-and-image white-popup-block"><div class="ajcol"><div class="ui middle aligned center aligned grid"><div class="column"><h2 class="ui teal image header"><img src="assets/images/useum_logo.png" class="image"><div class="content">Log-in to your account</div></h2><form class="ui large form"><div class="ui stacked segment"><div class="field"><div class="ui left icon input"><i class="user icon"></i><input type="text" name="email" placeholder="E-mail address"></div></div><div class="field"><div class="ui left icon input"><i class="lock icon"></i><input type="password" name="password" placeholder="Password"></div></div><div class="ui fluid large teal submit button">Login</div></div><div class="ui error message"></div></form><div class="ui message">New to us? <a href="#">Sign Up</a></div></div></div></div><div style="clear:both; line-height: 0;"></div></div></body></html>';

    	      //console.log('Ajax content loaded:', mfpResponse.data);

    	    },
    	    ajaxContentAdded: function() {
    	      // Ajax content is loaded and appended to DOM
    	      //console.log(this.content);
    	    }
    	  }
    	});

/*
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });*/
});
