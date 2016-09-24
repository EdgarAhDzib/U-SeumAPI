$(document).ready( function(){

	//This could easily be a function but lets get it working first...
	var Title = 'Hot Air Balloons';
	var Artist = 'Justin Baiko';
	var Culture = 'Mayan';
	var Century = '21';
	var Creditline = 'Harvard API';
	var Sourcelink = 'harvard';
	var Wiki_blurb = 'aoisdjf;oiajwf;oaijewfoaiwjefaoiefja;oewfj;aiefj;aowiefjoiawef;<br>oiajwef;oiajwef;oaijwef';
	var Wikilink = 'Hot Air Balloons';
	var New_image = "";
	var RM = false;

	autoload();

	function parse_title(string) {
		var milk = string;
		var res = milk.split(",");
		for (index in res) {
			console.log("res " + index + ": " + res[index]);
		}
	  return res[2];
	}

	function autoload() {
		var query = "";
		var topics = ["Egyptian","Roman","Classical","European","African","Native American","Celtic","Nordic","Japanese","Greek"];
		var random = Math.floor(Math.random() * topics.length);
		query = topics[random];
		var RMapiKey = "T6Z2QzWq";
		var RMurl = "https://www.rijksmuseum.nl/api/en/collection/?q=" + query + "&key=" + RMapiKey + "&imgonly=True&toppieces=True&format=json";
		var HAMapiKey = "f5d56a80-7c49-11e6-b2ae-0fcc14970146";
		var HAMurl = "http://api.harvardartmuseums.org/object?q=" + query + "&apikey=" + HAMapiKey;

		$.ajax({
			url: RMurl,
			method: 'GET',
		}).done(function(result) {
			RM = true;
			var listLength = result.artObjects.length;
			var artObj = result.artObjects;
			for (i=0; i<listLength; i++) {
				if (artObj[i].hasImage === true && artObj[i].webImage != null) {
					var RMdiv = $("<div>");
					RMdiv.attr("class","hide");
					$(RMdiv).attr("data-title",artObj[i].title);
					//console.log("long title: " + artObj[i].longTitle);
					var timeperiod = parse_title(artObj[i].longTitle);
					//console.log(artObj[i].longTitle);
					var imageCell = $("<img>");
					imageCell.attr("class","thumbnail");
					imageCell.attr("src",artObj[i].webImage.url);
					var longTitle = artObj[i].longTitle + "<br>";
					var maker = artObj[i].principalOrFirstMaker + "<br>";
					var museum = "Rijksmuseum, The Netherlands<br>";

					$(RMdiv).attr("data-artist",artObj[i].principalOrFirstMaker);
					$(RMdiv).attr("data-source","RM");
					$(RMdiv).attr("data-century",timeperiod);



					$("#rmBlock"+i).html(imageCell).attr("href",artObj[i].webImage.url);
					RMdiv.prepend(museum).prepend(maker).prepend(longTitle);
					$("#rmBlock"+i).append(RMdiv);

					$(".hide").hide();

					wikipedia(artObj[i].title,RMdiv);

				}
			}
		});

		$.ajax({
			url: HAMurl,
			//beforeSend: function(xhr){xhr.setRequestHeader('X-Test-Header', 'test-value');},
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
					if (hamResult[i].century !== null) {
					$(HAMdiv).attr("data-century", hamResult[i].century);
					} else {
					$(HAMdiv).attr("data-century", "Unknownd");
					}
					$(HAMdiv).attr("data-culture", hamResult[i].culture);
					$(HAMdiv).attr("data-creditline", hamResult[i].creditline);
					$(HAMdiv).attr("data-sourcelink", hamResult[i].url);
					$(HAMdiv).attr("data-source", "HAM");
					//console.log(hamResult[i]);
					var title = hamResult[i].title + "<br>";
					var century = hamResult[i].century + "<br>";
					var culture = hamResult[i].culture + "<br>";
					var collection = hamResult[i].division + "<br>";
					var creditline = hamResult[i].creditline + "<br>";
					var origURL = "Reference:<br><a href=\""+ hamResult[i].url + "\" target=\"_blank\"> " + hamResult[i].url +" </a><br>";

					$("#hamBlock"+i).html(imageURL).attr("href",hamResult[i].images[0].baseimageurl);

					if (hamResult[i].peoplecount > 0) {
						var author = hamResult[i].people[0].displayname + "<br>";
						imageURL.attr("data-artist", hamResult[i].people[0].displayname);
						HAMdiv.append(author);
					}
					HAMdiv.prepend(origURL).prepend(creditline).prepend(collection).prepend(culture).prepend(century).prepend(title);
					$("#hamBlock"+i).append(HAMdiv);

					$(".hide").hide();

					wikipedia(hamResult[i].title,HAMdiv);

				}
			}

		});

	}

  //When user trys to expand our div, we get the information embedded in the data-attr to populate our caption
	$( ".captions" ).click(function() {

			var url = $(this).find('.thumbnail').attr('src');
			New_image = url;

			console.log(url);

			var title = $(this).find('.hide').data('title');
			Title = title;
			console.log(title);

			var source = $(this).find('.hide').data('source');
			if (source == "RM") {
				RM = true;
			} else {
				RM = false;
			}
			var time = $(this).find('.hide').data('century');
			var matches = time.match(/\d+/g);
				if (matches != null) {
					//console.log("is a number");
					Century = time;
				} else {
				Century = "Unknown";
				}
			console.log("century: " + time);

			var culture = $(this).find('.hide').data('culture');
			Culture = "Unknown";
			console.log("culture: " + culture);

			var creditline = $(this).find('.hide').data('creditline');
			Creditline = "Unknown";
			console.log("credit: " + Creditline);

			var sourcelink = $(this).find('.hide').data('sourcelink');
			Sourcelink = "Unknown";
			console.log("Source: " + Sourcelink);

			Wiki_blurb = "Todo";
			Wikilink = "Todo";

		  var artist = $(this).find('.hide').data('artist');
			Artist = artist;

			console.log("Artist : " + Artist);


	});



	$('.captions').magnificPopup({
	  type: 'ajax',
	  callbacks: {
	    parseAjax: function(mfpResponse) {
	      // mfpResponse.data is a "data" object from ajax "success" callback
	      // for simple HTML file, it will be just String
	      // You may modify it to change contents of the popup
	      // For example, to show just #some-element:
	      // mfpResponse.data = $(mfpResponse.data).find('#some-element');
	``
	      // mfpResponse.data must be a String or a DOM (jQuery) element
	      var HTML_part1 = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>captions</title></head><body><div class="ajax-text-and-image white-popup-block"><style>.ajax-text-and-image {max-width:800px; margin: 20px auto; background: #FFF; padding: 0; line-height: 0;}.ajcol {width: 50%; float:left;}.ajcol img {width: 100%; height: auto;}@media all and (max-width:30em) {.ajcol {width: 100%;float:none;}}</style><div class="ajcol"><img style="object-fit: contain;" src=';
	      var HTML_part2 = '></div><div class="ajcol" style="line-height: 50%;"><div style="padding: 1em"><p><i>'; //Title
	      var HTML_part3 = '</i><sub> by '; //artist
	      var HTML_part4 = '</sub></p><p>'; //culture
	      var HTML_part5 = '<sub> culture</sub></p><p><i>'; //century
				if (RM) {
	      var HTML_part6 = '</i><sub> time period</p><p>'; // sourcelink
				} else {
				var HTML_part6 = '<sup>st</sup></i><sub> century</p><p>'
				}
	      var HTML_part7 = '<sub>source</sub></p><p><em>'; //wiki_blurb
	      var HTML_part8 = '</em><sub>summary</sub></p><p>'; //wikilink
	      var HTML_part9 = '<sub> wiki-link</sub></p><p>'; //creditline
	      var HTML_end =  '<sub> credit</sub></p></div></div><div style="clear:both; line-height: 0;"></div></div></body></html>';


	      var title = Title;
	      var artist = Artist;
	      var culture = Culture;
	      var century = Century;
	      var creditline = Creditline;
	      var sourcelink = Sourcelink;
	      var wiki_blurb = Wiki_blurb;
	      var wikilink = Wikilink;
				RM = false;


	      var new_image = New_image;
	      var newData = HTML_part1 + new_image + HTML_part2 + title + HTML_part3 + artist + HTML_part4 + culture + HTML_part5 + century + HTML_part6 + sourcelink + HTML_part7 + wiki_blurb + HTML_part8 + wikilink + HTML_part9 + creditline + HTML_end;
	      mfpResponse.data = newData;
	      //console.log('Ajax content loaded:', mfpResponse.data);

	    },
	    ajaxContentAdded: function() {
	      // Ajax content is loaded and appended to DOM
	      //console.log(this.content);
	    }
	  }
	});



$('#logo').on('click', function() {
    $('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle')
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
	console.log("in RM");
	RM = true;
	var listLength = result.artObjects.length;
	var artObj = result.artObjects;
	for (i=0; i<listLength; i++) {
		if (artObj[i].hasImage === true && artObj[i].webImage != null) {
			var RMdiv = $("<div>");
			RMdiv.attr("class","hide");
			$(RMdiv).attr("data-title",artObj[i].title);
			//console.log("long title: " + artObj[i].longTitle);
			var timeperiod = parse_title(artObj[i].longTitle);
			//console.log(artObj[i].longTitle);
			var imageCell = $("<img>");
			imageCell.attr("class","thumbnail");
			imageCell.attr("src",artObj[i].webImage.url);
			var longTitle = artObj[i].longTitle + "<br>";
			var maker = artObj[i].principalOrFirstMaker + "<br>";
			var museum = "Rijksmuseum, The Netherlands<br>";

			$(RMdiv).attr("data-artist",artObj[i].principalOrFirstMaker);
			$(RMdiv).attr("data-source","RM");
			$(RMdiv).attr("data-century",timeperiod);



			$("#rmBlock"+i).html(imageCell).attr("href",artObj[i].webImage.url);
			RMdiv.prepend(museum).prepend(maker).prepend(longTitle);
			$("#rmBlock"+i).append(RMdiv);

			$(".hide").hide();

			wikipedia(artObj[i].title,RMdiv);

		}
	}
});

$.ajax({
	url: HAMurl,
	//beforeSend: function(xhr){xhr.setRequestHeader('X-Test-Header', 'test-value');},
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
			if (hamResult[i].century !== null) {
			$(HAMdiv).attr("data-century", hamResult[i].century);
			} else {
			$(HAMdiv).attr("data-century", "Unknownd");
			}
			$(HAMdiv).attr("data-culture", hamResult[i].culture);
			$(HAMdiv).attr("data-creditline", hamResult[i].creditline);
			$(HAMdiv).attr("data-sourcelink", hamResult[i].url);
			$(HAMdiv).attr("data-source", "HAM");
			//console.log(hamResult[i]);
			var title = hamResult[i].title + "<br>";
			var century = hamResult[i].century + "<br>";
			var culture = hamResult[i].culture + "<br>";
			var collection = hamResult[i].division + "<br>";
			var creditline = hamResult[i].creditline + "<br>";
			var origURL = "Reference:<br><a href=\""+ hamResult[i].url + "\" target=\"_blank\"> " + hamResult[i].url +" </a><br>";

			$("#hamBlock"+i).html(imageURL).attr("href",hamResult[i].images[0].baseimageurl);

			if (hamResult[i].peoplecount > 0) {
				var author = hamResult[i].people[0].displayname + "<br>";
				imageURL.attr("data-artist", hamResult[i].people[0].displayname);
				HAMdiv.append(author);
			}
			HAMdiv.prepend(origURL).prepend(creditline).prepend(collection).prepend(culture).prepend(century).prepend(title);
			$("#hamBlock"+i).append(HAMdiv);

			$(".hide").hide();

			wikipedia(hamResult[i].title,HAMdiv);

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
			$.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&gsrlimit=5&generator=search&origin=*&gsrsearch=" + query + "&prop=extracts&exintro&explaintext&exsentences=1", function(jsonData){
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
