$(document).ready( function(){
	var array = [];
	var database;

	function addPicture(user, array) {
    //console.log("in add picture");
    firebase.database().ref('users/' + user.uid).update({
      favoritePics: array
    });
  }

	function getRating() {
		var currentRating = $('.ui.rating').rating('get rating');
		alert("current rating is : " + currentRating);
	}
	//Heart Rating
	$('.ui.rating')
	 .rating({
		 fireOnInit: true.
		 onRate: getRating();
	 })
 ;

 $('.ui.rating').click(function() {
	 var url = $('#caption-img').attr('src');
	 var db = firebase.database();
	 var user = firebase.auth().currentUser;
	 //console.log("user");
	 if (user) {
		 database = firebase.database().ref('users/' + user.uid + '/favoritePics');
		 database.on('value', function(snapshot) {
			 array = snapshot.val();
			 //console.log("click, array is: " + array);
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
