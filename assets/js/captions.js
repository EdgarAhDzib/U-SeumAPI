$(document).ready( function(){
	var array;
	var database;

	function addPicture(user, array) {
    firebase.database().ref('users/' + user.uid + '/favorites').update({
      picture: array
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
		 database = firebase.database().ref('users/12345/favoritePics');
		 database.on('value', function(snapshot) {
			 array = snapshot.val().picture;
			 console.log("array is: " + array);
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