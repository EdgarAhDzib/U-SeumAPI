$(document).ready( function(){

$('#logo').on('click', function() {
    $('.ui.sidebar').sidebar('toggle');
});

var RMapiKey = "T6Z2QzWq";

var query = "";

$(".submit").on("click", function(){
query = $("input:text[name=searchBar]").val().trim();

	if (query === "") {
    	$('#searchInput').transition('slide left');
	}

var RMurl = "https://www.rijksmuseum.nl/api/en/collection/?q=" + query + "&key=" + RMapiKey + "&imgonly=True&toppieces=True&format=json";

var HAMapiKey = "f5d56a80-7c49-11e6-b2ae-0fcc14970146";
var HAMurl = "http://api.harvardartmuseums.org/object?q=" + query + "&apikey=" + HAMapiKey;

$.ajax({
	url: RMurl,
	method: 'GET',
}).done(function(result) {
	var listLength = result.artObjects.length;
	var artObj = result.artObjects;
	for (i=0; i<listLength; i++) {
		if (artObj[i].hasImage === true && artObj[i].webImage != null) {
			var RMdiv = $("<div>");
			RMdiv.attr("class","hide");
			$(RMdiv).attr("data-title",artObj[i].longTitle + " " + artObj[i].principalOrFirstMaker + " " + query);
			var imageCell = $("<img>");
			imageCell.attr("class","thumbnail");
			imageCell.attr("src",artObj[i].webImage.url);
			var longTitle = artObj[i].longTitle + "<br>";
			var maker = artObj[i].principalOrFirstMaker + "<br>";
			var museum = "Rijksmuseum, The Netherlands<br>";
			var origLink = "Reference:<br><a href=\""+ artObj[i].links.web + "\" target=\"_blank\"> " + artObj[i].links.web +" </a><br>";

			$("#rmBlock"+i).html(imageCell).attr("href",artObj[i].webImage.url);
			RMdiv.prepend(origLink).prepend(museum).prepend(maker).prepend(longTitle);
			$("#rmBlock"+i).append(RMdiv);

			$(".hide").hide();

			wikipedia(artObj[i].title,RMdiv);

		}
	}
});

$.ajax({
	url: HAMurl,
	method: 'GET',
}).done(function(result) {
	var hamResult = result.records;
	var HAMlistLength = hamResult.length;
	for (i=0; i<HAMlistLength; i++) {
		if (hamResult[i].imagecount>0 && hamResult[i].images.length>0) {
			var HAMdiv = $("<div>");
			HAMdiv.attr("class","hide");
			$(HAMdiv).attr("data-title",hamResult[i].title + " " + hamResult[i].culture + " " + query);
			var imageURL = $("<img>");
			imageURL.attr("class","thumbnail");
			imageURL.attr("src",hamResult[i].images[0].baseimageurl);
			imageURL.attr("data-title",i + "=" + hamResult[i].title);
			var theCulture = hamResult[i].culture;
			cultCode(theCulture);

		function cultCode(cultObject) {
		var result = {};
		    for (var key in cultObject) {
		        if (cultObject[key] == theCulture) {
		            result[key] = cultObject[key];
		            var cultureCode = result[key];
					return cultureCode;
		        }
			}
	    }

			var title = hamResult[i].title + "<br>";
			var century = hamResult[i].century + "<br>";
			var culture = theCulture + "<br>";
			var collection = hamResult[i].division + "<br>";
			var creditline = hamResult[i].creditline + "<br>";
			var origURL = "Reference:<br><a href=\""+ hamResult[i].url + "\" target=\"_blank\"> " + hamResult[i].url +" </a><br>";

			$("#hamBlock"+i).html(imageURL).attr("href",hamResult[i].images[0].baseimageurl);

			if (hamResult[i].peoplecount > 0) {
				var author = hamResult[i].people[0].displayname + "<br>";
				HAMdiv.append(author);
			}
			HAMdiv.prepend(origURL).prepend(creditline).prepend(collection).prepend(culture).prepend(century).prepend(title);
			$("#hamBlock"+i).append(HAMdiv);

			$(".hide").hide();

			wikipedia(hamResult[i].title,HAMdiv);

			$('.grid').magnificPopup({

				delegate: 'div',
				type: 'image',
				tLoading: 'Loading image #%curr%...',
				mainClass: 'mfp-img-mobile',
				gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0,1] // Will preload 0 - before current, and 1 after the current image
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					titleSrc: function(item) {
							return item.el.find('.hide').html();
					}
				}
			});

		}
	}

});

return false;

}); //end of click function

}); //end of document ready

function wikipedia(argument,div) {
	var wikiTopic = "https://en.wikipedia.org/w/api.php?action=query&format=json&gsrlimit=5&generator=search&origin=*&gsrsearch=" + argument + "&prop=extracts&exintro&explaintext&exsentences=1";
		//console.log(wikiTopic);
		$.getJSON(wikiTopic, function(data){
				//console.log(data);
		if (data.query) {
			var wikiLinks = data.query.pages;
			//console.log(wikiLinks);
			for (value in wikiLinks) {//console.log(value);
						//console.log(wikiLinks[value].extract);
				if (wikiLinks[value].extract) {
					//console.log("This extract for RM iteration "+i+"(if.extract): " + value + " " + wikiLinks[value].extract);
					//console.log("https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid);
					var wikiExtract = "<div>" + wikiLinks[value].extract + "<br></div>";
					var wikiUrl = "<a href = \"https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "\" target = \"_blank\" >https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "</a>";
					div.append(wikiExtract).append(wikiUrl);
					//console.log(RMdiv);
				}
			};
		} else {
			$.getJSON(wikiTopic, function(jsonData){
					//console.log(jsonData);
			if (jsonData.query) {
				var wikiLinks = jsonData.query.pages;
				for (value in wikiLinks) {
					if (wikiLinks[value].extract) {
						//console.log("This extract for RM iteration "+i+"(for query): " + value + " " + wikiLinks[value].extract);
						//console.log("https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid);
						var wikiExtract = "<div>" + wikiLinks[value].extract + "<br></div>";
						var wikiUrl = "<a href = \"https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "\" target = \"_blank\" >https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "</a>";
						div.append(wikiExtract).append(wikiUrl);
						//console.log(RMdiv);
					}
				};
			}
		});
	}
});
}

//});