$(document).ready( function(){
	var array;
	var database;

	function addPicture(user, array) {
    //console.log("in add picture");
    firebase.database().ref('users/' + user.uid).update({
      favoritePics: array
    });
  }

	function checkRating(array) {
			//getRating();
      var url = $('#caption-img').attr('src');
			console.log("length of array is : " + array.length);
      for (var i = 0; i < array.length; i++) {
				console.log("array value " + i + " is " + array[i]);
				if (url === array[i]) {
					$('.icon').addClass("active");
					console.log("true");
					//getRating();
        return true;
				}
      }
			return false;

  }

	//Heart Rating
	$('.ui.rating')
	 .rating()
	 var user = firebase.auth().currentUser;
	 //console.log("user");
	 if (user) {
		 console.log("in this code");
		 database = firebase.database().ref('users/' + user.uid + '/favoritePics');
		 database.once('value', function(snapshot) {
			 array = snapshot.val();
			 console.log("favorite pics list: " + array);
			 checkRating(array);
			 //return array;
		 });
	}
 ;

 $('.ui.rating').click(function() {
	 var url = $('#caption-img').attr('src');
	 var user = firebase.auth().currentUser;
	 //console.log("user");
	 if (user) {
		 database = firebase.database().ref('users/' + user.uid + '/favoritePics');
		 database.once('value', function(snapshot) {
			 array = snapshot.val();
			 //checkRating(array);
			 console.log("favorite pics list: " + array);
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
