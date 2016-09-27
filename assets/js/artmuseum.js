$(document).ready( function(){

	//This could easily be a function but lets get it working first...
	var Title = '';
	var Artist = '';
	var Culture = '';
	var Century = '';
	var Creditline = '';
	var Sourcelink = '';
	var Wiki_blurb = '';
	var Wikilink = '';
	var New_image = "";
	var objArray = [];

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

var HAMapiKey = "deee3870-8274-11e6-adf8-390fc8eac8b5";
var HAMurl = "http://api.harvardartmuseums.org/object?q=" + query + "&apikey=" + HAMapiKey;

objArray = [];

$.ajax({
	url: RMurl,
	method: 'GET',
}).done(function(result) {
	var listLength = result.artObjects.length;
	var artObj = result.artObjects;
	for (i=0; i<listLength; i++) {
		var dataObj = {id:"", image:"", title:"", maker:"", culture:"", century:"", museum:"", origLink:"", wikiExtract:"", wikiUrl:""};
		var urlFromAPI;
		var extractFromAPI;
		if (artObj[i].hasImage === true && artObj[i].webImage != null) {

			var RMdiv = $("<div>");
			RMdiv.attr("class","hide");
			$(RMdiv).attr("data-title",artObj[i].longTitle + " " + artObj[i].principalOrFirstMaker + " " + query);

			var imageCell = $("<img>");
			imageCell.attr("class","thumbnail");
			imageCell.attr("src",artObj[i].webImage.url);
			dataObj.id = "rmBlock"+i;
			dataObj.image = artObj[i].webImage.url;
			dataObj.title = artObj[i].longTitle;
			dataObj.maker = artObj[i].principalOrFirstMaker;
			dataObj.origLink = artObj[i].links.web;
			dataObj.museum = "Rijksmuseum, The Netherlands";
			objArray.push(dataObj);

			$("#rmBlock"+i).html(imageCell).attr("href",artObj[i].webImage.url);
			$("#rmBlock"+i).append(RMdiv);

			$(".hide").hide();

			/* wikipedia(artObj[i].title,RMdiv, function (data) {
				var wikiObj = {id:"", title:"", wikiExtract:"",wikiUrl:""};
				var wikiObjLen = wikiArray.length;
				wikiObj.id = data[0];
				wikiObj.wikiExtract = data[1];
				wikiObj.wikiUrl = data[2];
				wikiArray.push(wikiObj);
			}); */
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
		var dataObj = {id:"", image:"", title:"", maker:"", culture:"", century:"", museum:"", origLink:"", wikiExtract:"", wikiUrl:""};
		if (hamResult[i].imagecount>0 && hamResult[i].images.length>0) {
			var HAMdiv = $("<div>");
			HAMdiv.attr("class","hide");
			$(HAMdiv).attr("data-title",hamResult[i].title + " " + hamResult[i].culture + " " + query);
			var imageURL = $("<img>");
			imageURL.attr("class","thumbnail");

			/*
			var httpsSplice = hamResult[i].images[0].baseimageurl.substring(0,4);
			var newHttps = httpsSplice+"s"+hamResult[i].images[0].baseimageurl.substring(4);
			imageURL.attr("src",newHttps);
			*/

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
			dataObj.image = "http://ids.lib.harvard.edu/ids/view/" + hamResult[i].images[0].idsid; // changed from baseimageurl
			dataObj.title = hamResult[i].title;
			dataObj.origLink = hamResult[i].url;
			dataObj.museum = hamResult[i].creditline;
			objArray.push(dataObj);
			console.log(objArray);

			$("#hamBlock"+i).html(imageURL).attr("href",dataObj.image); // changed from baseimageurl
			$("#hamBlock"+i).append(HAMdiv);

			console.log(hamResult[i]);
			var collection = hamResult[i].division + "<br>";

			$(".hide").hide();

			var wikiSearch = query + " " + dataObj.culture;
			console.log(wikiSearch);
			wikipedia(wikiSearch,HAMdiv);

		}
	}

});

return false;

}); //end of click function

$(".captions").on("click", function(){
	var thisId = $(this).attr("id");
	var arrIndex = objArray.findIndex(x=>x.id==thisId);
	console.log(arrIndex);
	New_image = objArray[arrIndex].image;
	Title = objArray[arrIndex].title;

	Wiki_blurb = $(this).find('.wikiExtract').data('extract');

	Wikilink = $(this).find('.wikiUrl').data('wiki');
	console.log(Wiki_blurb, Wikilink);
/*
	console.log(wikiArray);
	var wikiIndex = wikiArray.findIndex(x=>x.id==thisId);
	console.log(wikiIndex);
*/
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

	Creditline = objArray[arrIndex].museum;
	Sourcelink = objArray[arrIndex].origLink;
	//Wiki_blurb = wikiArray[wikiIndex].wikiExtract;
	//Wikilink = wikiArray[wikiIndex].wikiUrl;

	  //When user trys to expand our div, we get the information embedded in the data-attr to populate our caption

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
	      var HTML_part6 = '<sup>st</sup></i><sub> century</p>'; // sourcelink
	      var HTML_part7 = '<p><a href="' + Sourcelink + '" target="_blank">' + Sourcelink + '</a><sub>source</sub></p><p><em>'; //wiki_blurb
	      var HTML_part8 = '</em><sub>summary</sub></p>'; //wikilink
	      var HTML_part9 = '<p><a href = "https://en.wikipedia.org/?curid=' + Wikilink + '" target="_blank">https://en.wikipedia.org/?curid=' + Wikilink + '</a><sub> wiki-link</sub></p>'; //creditline
	      var HTML_end =  '<p><sub> credit</sub></p></div></div><div style="clear:both; line-height: 0;"></div></div></body></html>';


	      var title = Title;
	      var artist = Artist;
	      var culture = Culture;
	      var century = Century;
	      var creditline = Creditline;
	    //  var wiki_blurb = Wiki_blurb;
	    //  var wikilink = Wikilink;

	      var parts1To4 = HTML_part1 + New_image + HTML_part2 + title + HTML_part3 + artist + HTML_part4;
	      if (Culture != "") {
	      	parts1To4 += culture + HTML_part5;
	      }
	      if (Century != "") {
	      	parts1To4 += century + HTML_part6;
	      }
	      var parts7To9 = HTML_part7 + Wiki_blurb + HTML_part8 + HTML_part9 + creditline + HTML_end;
	      var newData = parts1To4 + parts7To9;
	      mfpResponse.data = newData;
	      //console.log('Ajax content loaded:', mfpResponse.data);

	    },
	    ajaxContentAdded: function() {
	      // Ajax content is loaded and appended to DOM
	      //console.log(this.content);
	    }
	  }
	});

});

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
					var wikiExtract = "<div class=\"wikiExtract\" data-extract=\"" + wikiLinks[value].extract + "\">" + wikiLinks[value].extract + "<br></div>";
					var wikiUrl = "<div class=\"wikiUrl\" data-wiki=\"" + wikiLinks[value].pageid + "\"><a href = \"https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "\" target = \"_blank\" >https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "</a></div>";
					div.append(wikiExtract).append(wikiUrl);
					//var wikiId = id;
					//var wikiExtVal = wikiLinks[value].extract;
					//var wikiPageId = wikiLinks[value].pageid;
					//var wikiArray = [id,wikiExtVal,wikiPageId];
					//callback(wikiArray);
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
						var wikiExtract = "<div class=\"wikiExtract\" data-extract=\"" + wikiLinks[value].extract + "\">" + wikiLinks[value].extract + "<br></div>";
						var wikiUrl = "<div class=\"wikiUrl\" data-wiki=\"" + wikiLinks[value].pageid + "\"><a href = \"https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "\" target = \"_blank\" >https://en.wikipedia.org/?curid=" + wikiLinks[value].pageid + "</a></div>";
						div.append(wikiExtract).append(wikiUrl);
						//var wikiId = id;
						//var wikiExtVal = wikiLinks[value].extract;
						//var wikiPageId = wikiLinks[value].pageid;
						//var wikiArray = [id,wikiExtVal,wikiPageId];
						//callback(wikiArray);
					}
				};
			}
		});
	}

});
}