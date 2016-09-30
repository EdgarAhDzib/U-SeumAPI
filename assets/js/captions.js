$(document).ready( function(){
	var array = [];
	var database;

	function addPicture(user, array) {
    console.log("in add picture");
    firebase.database().ref('users/' + user.uid).update({
      favoritePics: array
    });
  }


	//Heart Rating
	$('.ui.rating')
	 .rating()
 ;
 $('.ui.rating').click(function() {
	 var url = $('#caption-img').attr('src');
	 var db = firebase.database();
	 var user = firebase.auth().currentUser;
	 console.log("user");
	 if (user) {
		 database = firebase.database().ref('users/' + user.uid);
		 database.on('value', function(snapshot) {
			 array = snapshot.val();
			 console.log("array is: " + array[0]);
			 //return array;
		 });
		 var updated_list = array;
		 updated_list.push(url);
		 addPicture(user,updated_list);
	 } else {
		 console.log("user not logged in, cannot save pics");
	 }
	 return false;
 });

});
