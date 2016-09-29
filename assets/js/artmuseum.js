$(document).ready( function(){

	//This could easily be a function but lets get it working first...
	//!!! THESE VARIABLES ARE FOR CAPTIONS USE ONLY
	var Title = "";
	var Artist = "";
	var Culture = "";
	var Century = "";
	var Creditline = "";
	var Sourcelink = "";
	var Wiki_blurb = "";
	var Wikilink = "";
	var New_image = "";
	var Collection_info = "";
	var RM = false;
	var objArray = [];
	autoload();

	function parse_title(string) {
		var milk = string;
		var res = milk.split(",");
		for (index in res) {
			//console.log("res " + index + ": " + res[index]);
		}
	  return res[2];
	}

	function autoload() {
		var query = "";
		var topics = ["Egyptian","Roman","Classical","African","Native American","Celtic","Japan","Greek"];
		var random = Math.floor(Math.random() * topics.length);
		query = topics[random];
		var RMapiKey = "T6Z2QzWq";
		var RMurl = "https://www.rijksmuseum.nl/api/en/collection/?q=" + query + "&key=" + RMapiKey + "&imgonly=True&toppieces=True&format=json";
		var HAMapiKey = "deee3870-8274-11e6-adf8-390fc8eac8b5";
		var HAMurl = "http://api.harvardartmuseums.org/object?q=" + query + "&apikey=" + HAMapiKey;

		objArray = [];

		$.ajax({
			url: RMurl,
			method: 'GET',
		}).done(function(result) {
			RM = true;
			var listLength = result.artObjects.length;
			var artObj = result.artObjects;
			for (i=0; i<listLength; i++) {
				var dataObj = {id:"", image:"", title:"", maker:"", culture:"", century:"", museum:"", collection:"", origLink:"", wikiExtract:"", wikiUrl:""};
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
					var imageCell = $("<img>");
					imageCell.attr("class","thumbnail");
					imageCell.attr("src",artObj[i].webImage.url);
					dataObj.id = "rmBlock"+i;
					dataObj.image = artObj[i].webImage.url;
					dataObj.title = artObj[i].longTitle;
					dataObj.maker = artObj[i].principalOrFirstMaker;
					dataObj.century = timeperiod;
					dataObj.origLink = artObj[i].links.web;
					dataObj.museum = "Rijksmuseum, The Netherlands";
					objArray.push(dataObj);
					$("#rmBlock"+i).html(imageCell).attr("href",artObj[i].webImage.url);
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
				var dataObj = {id:"", image:"", title:"", maker:"", culture:"", century:"", museum:"", collection:"", origLink:"", wikiExtract:"", wikiUrl:""};
				if (hamResult[i].imagecount>0 && hamResult[i].images.length>0) {
					var HAMdiv = $("<div>");
					HAMdiv.attr("class","hide");
					$(HAMdiv).attr("data-title",hamResult[i].title + " " + hamResult[i].culture + " " + query);
					var imageURL = $("<img>");
					imageURL.attr("class","thumbnail");
					imageURL.attr("src",hamResult[i].images[0].baseimageurl);
					imageURL.attr("data-title",hamResult[i].title);

					if (hamResult[i].century !== null) {
					dataObj.century = hamResult[i].century;
					} else {
					dataObj.century = "Unknown Century";
					}
					if (hamResult[i].peoplecount > 0) {
						dataObj.maker = hamResult[i].people[0].displayname;
					}

					dataObj.id = "hamBlock"+i;
					dataObj.culture = hamResult[i].culture;
					dataObj.image = "https://ids.lib.harvard.edu/ids/iiif/" + hamResult[i].images[0].idsid + "/full/full/0/native.jpg";
					dataObj.title = hamResult[i].title;
					dataObj.origLink = hamResult[i].url;
					dataObj.museum = hamResult[i].creditline;
					dataObj.collection = hamResult[i].division;
					objArray.push(dataObj);
					//console.log(objArray);

					$("#hamBlock"+i).html(imageURL).attr("href",dataObj.image);
					$("#hamBlock"+i).append(HAMdiv);
					$(".hide").hide();

					var hamString = dataObj.title;
					hamString = hamString.replace("(","")
					hamString = hamString.replace(")","")
					hamString = hamString.replace(",","");
					var cleanString = hamString.split(" ");
					if (cleanString.length >= 8) {
						var lastWords = cleanString.length - 7;
						cleanString.splice(8,lastWords);
						//var newString = cleanString.toString();
						hamString = cleanString.join(" ");
					}
					hamString = hamString + " " + hamResult[i].culture;
					if (hamResult[i].peoplecount > 0 && hamResult[i].people[0].displayname != "Unidentified Artist") {
						hamString = hamString + " " + hamResult[i].people[0].displayname;
					}

					wikipedia(hamString,HAMdiv);

				}
			}

		});

	}

  //When user trys to expand our div, we get the information embedded in the data-attr to populate our caption
	$( ".captions" ).click(function() {

	var thisId = $(this).attr("id");
	var arrIndex = objArray.findIndex(x=>x.id==thisId);
	//console.log(arrIndex);
	New_image = objArray[arrIndex].image;
	Title = objArray[arrIndex].title;

	Wiki_blurb = $(this).find('.wikiExtract').data('extract');
	Wikilink = $(this).find('.wikiUrl').data('wiki');
	//console.log(Wiki_blurb, Wikilink);
	Artist = objArray[arrIndex].maker;

	if (objArray[arrIndex].century != "") {
		Century = objArray[arrIndex].century;
	} else {
		Century = "";
	}

	if (objArray[arrIndex].culture != "") {
		Culture = objArray[arrIndex].culture;
	} else {
		Culture = "";
	}

	if (objArray[arrIndex].collection != "") {
		Collection_info = objArray[arrIndex].collection;
	} else {
		Collection_info = "";
	}

	if (Creditline == "Rijksmuseum, The Netherlands") {
		RM = true;
	} else {
		RM = false;
	}

	Creditline = objArray[arrIndex].museum;
	Sourcelink = objArray[arrIndex].origLink;

			/* Needs integration
			var time = $(this).find('.hide').data('century');
			var matches = time.match(/\d+/g);
				if (matches != null) {
					//console.log("is a number");
					Century = time;
				} else {
				Century = "Unknown";
				}
			console.log("century: " + time);
			*/

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
	      var HTML_part2 = '></div><div class="ajcol" style="line-height: 120%;"><div style="padding: 1em"><p><i>'; //Title
	      var HTML_part3 = '</i><sub> by '; //artist
	      var HTML_part4 = '</sub></p><p>'; //culture
	      var HTML_part5 = '<sub> culture</sub></p><p><i>'; //century
	      var HTML_part6 = '</i><sub> date</p>'; // sourcelink
	      var HTML_part7 = '<p><a href="' + Sourcelink + '" target="_blank">' + Sourcelink + '</a><sub>source</sub></p><p><em>'; //wiki_blurb
	      var HTML_part8 = '</em><sub>summary</sub></p>'; //wikilink
	      var HTML_part9 = '<p><a href = "https://en.wikipedia.org/?curid=' + Wikilink + '" target="_blank">https://en.wikipedia.org/?curid=' + Wikilink + '</a><sub> wiki-link</sub></p>'; //creditline
	      var HTML_part10 = '<p><sub> credit</sub></p>';

	      if (Collection_info != "") {
	      	HTML_part10 += '<p>' + Collection_info + '</p><p><sub> collection</sub></p>';
	      }
	      
	      var HTML_end =  '</div></div><div style="clear:both; line-height: 0;"></div></div></body></html>';
// Add the Collection to this code
	      var title = Title;
	      var artist = Artist;
	      var culture = Culture;
	      var century = Century;
	      var creditline = Creditline;
		  RM = false;

	      var parts1To4 = HTML_part1 + New_image + HTML_part2 + title + HTML_part3 + artist + HTML_part4;
	      if (Culture != "") {
	      	parts1To4 += culture + HTML_part5;
	      }
	      if (Century != "") {
	      	parts1To4 += century + HTML_part6;
	      }
	      var parts7To10 = HTML_part7 + Wiki_blurb + HTML_part8 + HTML_part9 + creditline + HTML_part10 + HTML_end;
	      var newData = parts1To4 + parts7To10;
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

$("input:text[name=searchBar]").keypress(function(event) {
	if (event.which == 13) {
		searchTheMuseums();
	}
});

$(document).on("click", ".submit", searchTheMuseums);

function searchTheMuseums() {
query = $("input:text[name=searchBar]").val().trim();

	if (query === "") {
    	$('#searchInput').transition('slide left');
	}
	else {
		var userId = 12345;
		database.ref('users/' + userId + '/searchHistory').push({
				search: query
			});
		}

var RMurl = "https://www.rijksmuseum.nl/api/en/collection/?q=" + query + "&key=" + RMapiKey + "&imgonly=True&toppieces=True&format=json";

var HAMapiKey = "f5d56a80-7c49-11e6-b2ae-0fcc14970146";
var HAMurl = "http://api.harvardartmuseums.org/object?q=" + query + "&apikey=" + HAMapiKey;

objArray = [];

$.ajax({
	url: RMurl,
	method: 'GET',
}).done(function(result) {
	//console.log("in RM");
	RM = true;
	var listLength = result.artObjects.length;
	var artObj = result.artObjects;
	for (i=0; i<listLength; i++) {
		var dataObj = {id:"", image:"", title:"", maker:"", culture:"", century:"", museum:"", collection:"", origLink:"", wikiExtract:"", wikiUrl:""};
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

			dataObj.id = "rmBlock"+i;
			dataObj.image = artObj[i].webImage.url;
			dataObj.title = artObj[i].longTitle;
			dataObj.maker = artObj[i].principalOrFirstMaker;
			dataObj.century = timeperiod;
			dataObj.origLink = artObj[i].links.web;
			dataObj.museum = "Rijksmuseum, The Netherlands";
			objArray.push(dataObj);
			$("#rmBlock"+i).html(imageCell).attr("href",artObj[i].webImage.url);
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
		var dataObj = {id:"", image:"", title:"", maker:"", culture:"", century:"", museum:"", collection:"", origLink:"", wikiExtract:"", wikiUrl:""};
		if (hamResult[i].imagecount>0 && hamResult[i].images.length>0) {
			var HAMdiv = $("<div>");
			HAMdiv.attr("class","hide");
			$(HAMdiv).attr("data-title",hamResult[i].title + " " + hamResult[i].culture + " " + query);
			var imageURL = $("<img>");
			imageURL.attr("class","thumbnail");
			imageURL.attr("src",hamResult[i].images[0].baseimageurl);
			imageURL.attr("data-title",hamResult[i].title);

			if (hamResult[i].century !== null) {
			dataObj.century = hamResult[i].century;
			} else {
			dataObj.century = "Unknown Century";
			}
			if (hamResult[i].peoplecount > 0) {
				dataObj.maker = hamResult[i].people[0].displayname;
			}

			dataObj.id = "hamBlock"+i;
			dataObj.culture = hamResult[i].culture;
			dataObj.image = "https://ids.lib.harvard.edu/ids/iiif/" + hamResult[i].images[0].idsid + "/full/full/0/native.jpg";
			dataObj.title = hamResult[i].title;
			dataObj.origLink = hamResult[i].url;
			dataObj.museum = hamResult[i].creditline;
			dataObj.collection = hamResult[i].division;
			objArray.push(dataObj);

			$("#hamBlock"+i).html(imageURL).attr("href",dataObj.image); // changed from baseimageurl
			$("#hamBlock"+i).append(HAMdiv);

			$(".hide").hide();

			var hamString = dataObj.title;
			hamString = hamString.replace("(","")
			hamString = hamString.replace(")","")
			hamString = hamString.replace(",","");
			var cleanString = hamString.split(" ");
			if (cleanString.length >= 8) {
				var lastWords = cleanString.length - 7;
				cleanString.splice(8,lastWords);
				hamString = cleanString.join(" ");
			}
			hamString = hamString + " " + hamResult[i].culture;
			if (hamResult[i].peoplecount > 0 && hamResult[i].people[0].displayname != "Unidentified Artist") {
				hamString = hamString + " " + hamResult[i].people[0].displayname;
			}

			wikipedia(hamString,HAMdiv);

		}
	}

});

return false;

}; //end of click function

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
					//console.log("This extract (if.extract): " + wikiLinks[value].extract);
					//console.log("https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid);
					var wikiExtract = "<div class=\"wikiExtract\" data-extract=\"" + wikiLinks[value].extract + "\">" + wikiLinks[value].extract + "<br></div>";
					var wikiUrl = "<div class=\"wikiUrl\" data-wiki=\"" + wikiLinks[value].pageid + "\"><a href = \"https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "\" target = \"_blank\" >https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "</a></div>";
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
						//console.log("This extract (for query): " + wikiLinks[value].extract);
						//console.log("https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid);
						var wikiExtract = "<div class=\"wikiExtract\" data-extract=\"" + wikiLinks[value].extract + "\">" + wikiLinks[value].extract + "<br></div>";
						var wikiUrl = "<div class=\"wikiUrl\" data-wiki=\"" + wikiLinks[value].pageid + "\"><a href = \"https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "\" target = \"_blank\" >https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "</a></div>";
						div.append(wikiExtract).append(wikiUrl);
						//console.log(RMdiv);
					}
				};
			}
		});
	}
});
}