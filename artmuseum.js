//This is the main JavaScript file for our project
$(document).ready( function(){
var RMapiKey = "T6Z2QzWq";
$(".submit").on("click", function(){
//$("#fieldSpace").empty();
var query = $("input:text[name=searchBar]").val();
console.log(query);
var RMurl = "https://www.rijksmuseum.nl/api/en/collection/?q=" + query + "&key=" + RMapiKey + "&imgonly=True&toppieces=True&format=json";

var HAMapiKey = "f5d56a80-7c49-11e6-b2ae-0fcc14970146";
var HAMurl = "http://api.harvardartmuseums.org/object?q=" + query + "&apikey=" + HAMapiKey;

$.ajax({
	url: RMurl,
	method: 'GET',
}).done(function(result) {
	var listLength = result.artObjects.length;
	console.log(result.artObjects);
	//console.log(listLength);
	var artObj = result.artObjects;
	for (i=0; i<listLength; i++) {
		if (artObj[i].hasImage === true && artObj[i].webImage != null) {
			var RMdiv = $("<div>");
			RMdiv.attr("class","grid-item");
			$(RMdiv).attr("data-title",artObj[i].longTitle + " " + artObj[i].principalOrFirstMaker + " " + query);
			var imageCell = $("<img>");
			imageCell.attr("class","thumbnail");
			imageCell.attr("src",artObj[i].webImage.url);
			//var imageURL = "<img src=\"" + artObj[i].webImage.url + "\"/>";
			//console.log(JSON.stringify(artObj[i]));
			var imgWidth = parseInt(artObj[i].webImage.width);
			var imgHeight = parseInt(artObj[i].webImage.height);
			var ratio = imgWidth / imgHeight;
			//console.log(ratio);
			var longTitle = artObj[i].longTitle + "<br>";
			var maker = artObj[i].principalOrFirstMaker + "<br>";
			var museum = "Rijksmuseum, The Netherlands<br>";
			//Add link to original page
			RMdiv.append(imageCell).append(longTitle).append(maker).append(museum);
			console.log(imageCell);
/*
				for (i=0; i<7; i++) {
					$("#imgBlock"+i).html(imageCell);
				}
				*/
			//$("#fieldSpace").append(RMdiv);
		}
	}
});

$.ajax({
	url: HAMurl,
	method: 'GET',
}).done(function(result) {
	var hamResult = result.records;
	console.log(hamResult);
	var HAMlistLength = hamResult.length;
	for (i=0; i<HAMlistLength; i++) {
		if (hamResult[i].imagecount>0 && hamResult[i].images.length>0) {
			var HAMdiv = $("<div>");
			HAMdiv.attr("class","grid-item");
			$(HAMdiv).attr("data-title",hamResult[i].title + " " + hamResult[i].culture + " " + query);
			var imageURL = "<img class=\"thumbnail\" src=\" "+ hamResult[i].images[0].baseimageurl + " \" alt=\"Art museum image\"/><br>";
			//var imgWidth = $(hamResult[i].images[0].baseimageurl).width();
			//var imgHeight = $(hamResult[i].images[0].baseimageurl).height();
			//console.log(imgWidth + "wide " + imgHeight + "high");
			//console.log(JSON.stringify(hamResult[i]));
			var title = hamResult[i].title + "<br>";
			var century = hamResult[i].century + "<br>";
			var culture = hamResult[i].culture + "<br>";
			var collection = hamResult[i].division + "<br>";
			var creditline = hamResult[i].creditline + "<br>";
			var origURL = "Reference:<br><a href=\""+ hamResult[i].url + "\" target=\"_blank\"> " + hamResult[i].url +" </a><br>";
			HAMdiv.append(imageURL).append(title).append(century).append(culture).append(collection).append(creditline).append(origURL);
			if (hamResult[i].peoplecount > 0) {
				console.log(hamResult[i].peoplecount);
				var author = hamResult[i].people[0].displayname + "<br>";
				//var authorAlt = hamResult[i].people[0].name + "<br>";
				HAMdiv.append(author);//.append(authorAlt);
			}
			//$("#fieldSpace").append(HAMdiv);
		}
	}

});

return false;
/* required for Wikipedia API:
var headers = {
'User-Agent': 'U-Seum API Project (edgarmdcesp@gmail.com, http://[HEROKU])'
};
*/

});

$(document).on('click', ".grid-item", function() {
	var wikiTopic = $(this).data("title");
	//console.log(wikiTopic);
	var wikiURL = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrsearch=" + wikiTopic + "&gsrlimit=10&prop=extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max";
	$.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&gsrlimit=5&generator=search&origin=*&gsrsearch=" + wikiTopic + "&prop=extracts&exintro&explaintext&exsentences=1", function(data){
		//console.log(data);
		if (data.query) {
			var wikiLinks = data.query.pages;
			//console.log(wikiLinks);
			for (value in wikiLinks) {console.log(value);
				//console.log(wikiLinks[value].extract);
				if (wikiLinks[value].extract) {
					console.log("This extract: " + value + " " + wikiLinks[value].extract);
					console.log("https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid);
				}
			};
		}
	});
/*
	$.ajax({
		url: wikiURL,
		method: 'GET',
		headers: {'User-Agent': 'U-Seum API Project (edgarmdcesp@gmail.com, http://edgarmartindelcampo.com)'},
	}).done(function(result) {
		var wikiJSON = result;
		console.log(wikiJSON);
	});

	Other notes:
	https://en.wikipedia.org/w/api.php?action=parse&page=[TOPIC]&prop=text&format=json&callback

(Check the (g)srprop parameter for snippet)
var headers = {
'User-Agent': 'U-Seum API Project (edgarmdcesp@gmail.com, http://[HEROKU])'
};

	*/
});

});