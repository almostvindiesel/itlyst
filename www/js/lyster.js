// ---------------------------------------------------------------------------------------------------------
// http://phrogz.net/js/classes/OOPinJS2.html
/*
function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}
*/


TextMetaData.prototype = new TextMetaData();  
TextMetaData.prototype.constructor=TextMetaData; 
function TextMetaData (original_text) {
	this.original_text = original_text;
	this.original_url = "";
	this.original_url_without_querystring = "";
	this.display_url = "";
	this.final_url = "";
	this.source = "";

	//Find the first url in the string)
	this.findFirstUrl = function () {
		console.log("Searching for url in copied text: ");
		var urlRegex = /(https?:\/\/[^\s]+)/g;
		if (parsedUrls = this.original_text.match(urlRegex)) {
			this.original_url = parsedUrls[0];
			console.log("Found url: ")
			console.log(this.original_url);

			if (this.original_url.indexOf("?") > -1 ) {
				this.original_url_without_querystring = this.original_url.substring(0, this.original_url.indexOf("?"));
			} else {
				this.original_url_without_querystring = this.original_url;
			}
			console.log("URL w querystrings removed: ");
			console.log(this.original_url_without_querystring);

			//Create a url to display with extras chopped off
			this.display_url = this.original_url_without_querystring;
			var stringsToReplace = ["http://", "https://", "www."];
			for (var i = 0; i < stringsToReplace.length; i++) {
			    this.display_url = this.display_url.replace(stringsToReplace[i],"");
			}
			console.log("URL for display:");
			console.log(this.display_url);

		} else {
			console.log("Did not find a url");
		}
	}

	this.detectVenueSource = function () {
		if (this.original_url) {
			this.source = detectSource(this.original_url);
		} else {
			this.source = 'unknown';
		}
		console.log("Detected Source: " + this.source);
	}

}



function Page () {
	this.url = "";
	this.title = "";
	this.note = "";
	this.image_url = "";
}
/*
Page.prototype = {
    constructor: Page
}
*/


function Location () {
	this.latitude = null;
	this.longitude = null;
	this.city = "";
	this.state = "";
	this.country = "";
}
/*
Location.prototype = {
    constructor: Location
}
*/


function Venue () {
	this.source_id = null;
	this.name = "";
	this.source = "";
	this.url = "";
	this.rating = "";
	this.reviews = "";
	this.categories = [];
	this.location = new Location();
	this.post_params = {};

	this.jqdoc = null;
}
Venue.prototype.setPostParameters = function ()  {
	this.post_params = { 
		"source_id": this.source_id,
		"source": this.source,
		"name": this.name,
		"categories": this.categories,
		"rating": this.rating,
		"reviews": this.reviews,

		"page_url": this.page.url,
		"page_title": this.page.title,
		"note": this.page.note, 
		"image_url": this.page.image_url, 

		"latitude": this.location.latitude,
		"longitude": this.location.longitude,
		"city": this.location.city,

		"action": "new_venue_note_from_venue"
	};
	console.log("Post params:")
	console.log(this.post_params);
}
Venue.prototype.setJQueryDocument = function (jquery_document) {
	this.jqdoc = jquery_document;
}


FoursquareVenue.prototype = new Venue();  
FoursquareVenue.prototype.constructor=FoursquareVenue; 
function FoursquareVenue(page){
	this.source = 'foursquare';
	this.page = page;

	this.setName = function () {
		//this.name = document.querySelectorAll("[property='og:title']")[0].content;
		//this.name = $("[property='og:title']").first().attr('content');
		this.name = $(this.jqdoc).filter("[property='og:title']").first().attr('content');
	}

	//<meta content="foursquare://venues/48ff3964f964a52056521fe3" property="al:iphone:url" />
	this.setSourceId = function () {
		//this.source_id = document.querySelectorAll("[property='al:iphone:url']")[0].content.replace('foursquare://venues/','');
		this.source_id = $(this.jqdoc).filter("[property='al:iphone:url']").first().attr('content').replace('foursquare://venues/','');
	}

	this.setLatitude = function () {
		//this.location.latitude = document.querySelectorAll("[property='playfoursquare:location:latitude']")[0].content;
		this.location.latitude = $(this.jqdoc).filter("[property='playfoursquare:location:latitude']").first().attr('content');
	}

	this.setLongitude = function () {
		//this.location.longitude = document.querySelectorAll("[property='playfoursquare:location:longitude']")[0].content;
		this.location.longitude = $(this.jqdoc).filter("[property='playfoursquare:location:longitude']").first().attr('content');
	}

	//<span class="venueCity">Florence</span>
	this.setCity = function () {
	    //var elements = document.querySelectorAll(".mapContainer")[0];
		//this.location.latitude = elements.getAttribute('data-lat');
		//this.location.city = 
		//console.log(this.jqdoc);
		this.location.city = $(this.jqdoc).find("[itemprop='addressLocality']").text(); 
	}

	//<span itemprop="ratingValue">9.4</span>
	this.setRating = function () {
		this.rating = $(this.jqdoc).find("[itemprop='ratingValue']").text(); 
	} 

	//<div class="numRatings" itemprop="ratingCount">314</div>
	this.setReviews = function () {
		this.reviews = $(this.jqdoc).find("div.numRatings").text();
		this.reviews = this.reviews.replace(',','');
	}

	//<span property="servesCuisine" content="Street Food"/></span>
	/* var category = $("*[property='servesCuisine']")[0].content; <-- why wont this work?
	   instead have to us this crazy hack:
		<div id="PAGE" class=" non_hotels_like desktop gutterAd scopedSearch" vocab="http://schema.org/" typeof="FoodEstablishment">
		<span property="servesCuisine" content="Poop"/></span>
		<span property="servesCuisine" content="Italian"/></span>
		</div>
	*/
	this.setCategories = function () {

		/* !!!
		var cats = [];
		$('span.unlinkedCategory').each(function(){
			console.log($(this).text());			
		    this.cats.push($(this).text());
		});

		this.categories = cats;
		*/
	}
}




TripadvisorVenue.prototype = new Venue();  
TripadvisorVenue.prototype.constructor=TripadvisorVenue; 
function TripadvisorVenue(page){
	this.source = 'tripadvisor';
	this.page = page;

	this.pageJson = null;

	//Overrides standard setJQueryDocument for tripadvisor
	this.setJQueryDocument = function (jquery_document) {
		this.jqdoc = jquery_document;

		//Tripadvisor has embedded json which has a lot of the data needed, specifically on the mobile page
		//When other methods fail, use this to populate parameters
		this.pageJson = "";
		try {
			var jsonDataIndexStart = this.jqdoc.indexOf("script");
			var jsonDataIndexEnd = this.jqdoc.substring(jsonDataIndexStart+34).indexOf("script");
			var jsonStr = this.jqdoc.substring(jsonDataIndexStart+34, jsonDataIndexStart+34+jsonDataIndexEnd-2);
			this.pageJson = jQuery.parseJSON(jsonStr);
		} catch(err) {
			console.log("Could not find embedded json on page: " + err.message);
		}
	}

	//<div class="warLocName">River Buna Spring</div>
	this.setName = function () {

		try {
			this.name = $(this.jqdoc).find("div.warLocName").first().text();
			var s = this.jqdoc.indexOf("<body");
			var e = this.jqdoc.indexOf("FOOT_CONTAINER");
			var len = this.jqdoc.length;

			if (this.name.length < 1) {
				throw "Could not find name in first attempt. Retrying";
			}
		} catch(err) {
			console.log("Error: " + err.message);

			try {
				this.name = page.page_title;
				console.log(" partial name: " + this.name);
				
				var dashIndex = this.name.indexOf("-");
				this.name = this.name.substring(0, dashIndex);
				console.log(" partial name 2: " + this.name);
				var commaIndex = this.name.lastIndexOf(",");
				this.name = this.name.substring(0,commaIndex);

				if (this.name.length < 1) {
					throw "Could not find name on second attempt. Retrying final time";
				}
			} catch(err) {
				console.log("Error: " + err.message);

				try {
					this.name = this.pageJson.name;

					if (this.name.length < 1) {
						throw "Could not find name on third attempt. Failing";
					}
				} catch(err) {
					console.log("Error: " + err.message);
				}
			}
		}
		console.log("--- name: " + this.name);
		   
	}

	//https://www.tripadvisor.com/Attraction_Review-g1759888-d6601942-Reviews-River_Buna_Spring-Blagaj_Herzegovina_Neretva_Canton.html
	//between 'Review-' and '-Review'
	this.setSourceId = function () {
		var textWhichContainsSourceId = this.page.url;
		this.source_id = textWhichContainsSourceId.match("Review-(.*)-Review")[1];
		console.log("--- source_id: " + this.source_id);
	}

	//<div class="mapContainer" data-lat="37.798454" data-lng="-122.40787" data-name="Molinari Delicatessen"...>
	this.setLatitude = function () {
		try {
		    //var elements = document.querySelectorAll(".mapContainer")[0];
			//this.location.latitude = elements.getAttribute('data-lat');
			var elements = $(this.jqdoc).find(".mapWrap").first();
			this.location.latitude = $(elements).find("div.mapContainer").first().attr('data-lat');

			if (!(isNumeric(this.location.latitude))) {
				throw "Lat parsed is not a number";
			}

		}
		catch(err) {
			console.log("Could not get latitude. Error: " + err.message);
		}
		console.log("--- latitude: " + this.location.latitude);
	}

	//<div class="mapContainer" data-lat="37.798454" data-lng="-122.40787" data-name="Molinari Delicatessen"...>
	this.setLongitude = function () {
		try {
			//var elements = document.querySelectorAll(".mapContainer")[0];
			//this.location.longitude = elements.getAttribute('data-lng');
			this.location.longitude = $(this.jqdoc).find(".mapWrap div.mapContainer").first().attr('data-lng');

			if (!(isNumeric(this.location.longitude))) {
				throw "Long parsed is not a number";
			}

		} catch(err) {
			console.log("Could not get longitude. Error: " + err.message);
		}
		console.log("--- longitude: " + this.location.longitude);
	}

	//<span class="geoName" data-title="Florence">Florence</span>
	this.setCity = function () {
		
		/*
		try {
			this.location.city = $(this.jqdoc).find("span.geoName").text(); 		
			console.log("--- city: " + this.location.city);
		} catch(err) {
			console.log("Could not get city. Error: " + err.message);
		}
		*/
		
		if ( this.location.city.length < 1) {
			console.log("Could not get city. Retrying with different method by parsing json");

			try {
				this.location.city = this.pageJson.address.addressLocality;

				console.log("Also setting rating, name, and reviews since we have them with this object");

			} catch(err) {
				console.log("Could not get city. Error: " + err.message);
			}
		}
	}

	//property="ratingValue" content="4.0"
	this.setRating = function () {
		try {
			this.rating = $(this.jqdoc).find("[property='ratingValue']").first().attr('alt').substring(0, 3);
			if (!(isNumeric(this.rating)))  {
				throw "Rating parsed is not a number. Retrying";
			}
		} catch(err) {
			console.log("Could not get rating. Error: " + err.message);
			try {
				this.rating = this.pageJson.aggregateRating.ratingValue;
			} catch(err) {
				console.log("Could not get rating on second attempt. Giving up. Error: " + err.message);
			}
		}
	} 

	//<div class="numRatings" itemprop="ratingCount">314</div>
	this.setReviews = function () {
		try {
			var reviewsStr = $(this.jqdoc).find("a.more").text();		//property="ratingValue" content="4.0"
			reviewsStr = reviewsStr.replace(',','');
			var index = reviewsStr.indexOf(' ');
			this.reviews = reviewsStr.substring(0, index);
			
			if (!(isNumeric(this.reviews))) {
				throw "Reviews parsed is not a number. Retrying...";
			}
		} catch(err) {
			console.log("Could not get reviews. Error: " + err.message);
			try {
				this.reviews = this.pageJson.aggregateRating.reviewCount.replace(',','');
			} catch(err) {
				console.log("Could not get reviews on second attempt. Giving up. Error: " + err.message);
			}
		}
	} 


	this.setCategories = function () {
		/*
		try {
			var i = 0;
			do {
			    this.categories[i] = $("#PAGE").find("span").eq(i).attr("content")
			    i++;
			}
			while ($("#PAGE").find("span[property='servesCuisine']").eq(i).attr("content"))
		}
		catch(err) {
			console.log("Could not set categories. Error: " + err.message);
		}
		*/
	}

	
}

YelpVenue.prototype = new Venue();  
YelpVenue.prototype.constructor=YelpVenue; 
function YelpVenue(page){
	this.source = 'yelp';
	this.page = page;

 	// <h1 class="biz-page-title embossed-text-white shortenough" itemprop="name">Proof Bakery</h1> 
	this.setName = function () {
		this.name = $(this.jqdoc).find(".biz-page-title").first().text().trim();

		// iOS: <meta itemprop="name" content="Ohana Poke" />
		if (!(this.name.length > 0)) {
			console.log("First attempt to find name failed. Retrying...");
			//this.name = $(this.jqdoc).filter("[itemprop='name']")[1].attr('content');
			this.name = $(this.jqdoc).find("[itemprop='name']").last().attr('content');

			console.log("Second attempt to find name: " + this.name);
			console.log("Other name stuff: ");
			//console.log($(this.jqdoc).filter("[itemprop='name']")[0]);
		}

		console.log("Yelp Name: " + this.name);

	}



	// Regular page:
	// <meta name="yelp-biz-id" content="jQXj5x1V-mtVMFYoMQYOkg">
	// image page: 
	// <meta property="twitter:app:url:iphone" content="yelp:///biz/photo?biz_id=BmDHbBWKESB6d3ZFRT5y_Q&amp;....">
	this.setSourceId = function () {
		try {
			//this.source_id = document.querySelectorAll("[name='yelp-biz-id']")[0].content;
			this.source_id = $(this.jqdoc).filter("[name='yelp-biz-id']").first().attr('content');

		} catch(err) {
			console.log("Could not get source_id. Retrying via other method: " + err.message);
			try {
				//var textWhichContainsSourceId= document.querySelectorAll("[property='twitter:app:url:iphone']")[0].content;
				var textWhichContainsSourceId= $(this.jqdoc).filter("[property='twitter:app:url:iphone']").first().attr('content');
				textWhichContainsSourceId =  textWhichContainsSourceId.match("id(.*)campaign")[1];
				textWhichContainsSourceId = textWhichContainsSourceId.replace("&","");
				textWhichContainsSourceId = textWhichContainsSourceId.replace("=","");
				this.source_id = textWhichContainsSourceId.replace("utm_","");
			} catch(err) {
				console.log("ERROR. Could not get source_id second time. Retrying via other method: " + err.message);			
			}
		}
		console.log("Yelp Source ID: " + this.source_id);

	}

	//<div class="lightbox-map hidden"...
	this.setLatitude = function () {
		try {
			var textWhichContainsLatitude = $(this.jqdoc).find(".lightbox-map").first().attr('data-map-state');
			//console.log(textWhichContainsLatitude);
			textWhichContainsLatitude = textWhichContainsLatitude.match("url(.*)starred_business")[1];
			textWhichContainsLatitude = textWhichContainsLatitude.match("latitude(.*)longitude")[1];
			textWhichContainsLatitude = textWhichContainsLatitude.replace(/"/g,"");
			textWhichContainsLatitude = textWhichContainsLatitude.replace(":","");
			textWhichContainsLatitude = textWhichContainsLatitude.replace(",","");



			this.location.latitude = textWhichContainsLatitude.trim();
		} catch(err) {
			console.log("ERROR. Could not get latitude " + err.message);	
			try {
				//latitude": 37.761412279396, "longitude"


				var textWhichContainsLatitude = this.jqdoc.match("latitude(.*)longitude")[1];
				textWhichContainsLatitude = textWhichContainsLatitude.replace(",","");
				textWhichContainsLatitude = textWhichContainsLatitude.replace(":","");
				textWhichContainsLatitude = textWhichContainsLatitude.replace(" ","");
				textWhichContainsLatitude = textWhichContainsLatitude.replace(/"/g,"");
				var n = textWhichContainsLatitude.indexOf("longitude");
				textWhichContainsLatitude = textWhichContainsLatitude.substring(0,n-1);
				//textWhichContainsLatitude = textWhichContainsLatitude.replace(/longitude*//,"");
				//console.log("@@@@@@@@@@@@@@@@@@ latitude @@@@@@@@@@@@@@@@@@");
				//console.log(textWhichContainsLatitude);
				this.location.latitude = textWhichContainsLatitude;
			
			} catch(err) {
				console.log("ERROR. Could not get latitude second time " + err.message);		
			}	
		}	
	}

			


	this.setLongitude = function () {
		try {
			var textWhichContainsLongitude = $(this.jqdoc).find(".lightbox-map").first().attr('data-map-state');
			//console.log(textWhichContainsLongitude);
			textWhichContainsLongitude = textWhichContainsLongitude.match("url(.*)starred_business")[1];
			textWhichContainsLongitude = textWhichContainsLongitude.match("longitude(.*)key")[1];
			textWhichContainsLongitude = textWhichContainsLongitude.replace(/"/g,"");
			textWhichContainsLongitude = textWhichContainsLongitude.replace(":","");
			textWhichContainsLongitude = textWhichContainsLongitude.replace(",","");
			textWhichContainsLongitude = textWhichContainsLongitude.replace("}","");
			this.location.longitude = textWhichContainsLongitude.trim();
		} catch(err) {
			console.log("ERROR. Could not get longitude " + err.message);	
			try {
				var textWhichContainsLongitude = this.jqdoc.match("longitude(.*)zoom")[1];
				textWhichContainsLongitude = textWhichContainsLongitude.replace(",","");
				textWhichContainsLongitude = textWhichContainsLongitude.replace(":","");
				textWhichContainsLongitude = textWhichContainsLongitude.replace(" ","");
				textWhichContainsLongitude = textWhichContainsLongitude.replace(/"/g,"");
				var n = textWhichContainsLongitude.indexOf("}");
				textWhichContainsLongitude = textWhichContainsLongitude.substring(0,n);
				//console.log("@@@@@@@@@@@@@@@@@@ Longitude @@@@@@@@@@@@@@@@@@");
				//console.log(textWhichContainsLongitude);
				this.location.longitude = textWhichContainsLongitude;
			} catch(err) {
				console.log("ERROR. Could not get longitude second time " + err.message);		
			}	
		}	
	}

	//<span itemprop="addressLocality">Los Angeles</span>
	this.setCity = function () {
		try {
			//this.location.city = document.querySelectorAll("[itemprop='addressLocality']")[0].textContent;
			//this.location.city = $(this.jqdoc).filter("[itemprop='addressLocality']").first().text();
			
			// --> this.location.city = $(this.jqdoc).find('.map-box-address [itemprop="addressLocality"]').first().text();
			this.location.city = $(this.jqdoc).find('[itemprop="address"] [itemprop="addressLocality"]').first().text();

			//console.log("----- city:")
			//console.log( $(this.jqdoc).find('.map-box-address [itemprop="addressLocality"]').first().text() );
			//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
			//console.log(this.jqdoc);
			//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

		} catch(err) {
			console.log("ERROR. Could not get city " + err.message);		
		}

	
 	}

	//<meta itemprop="ratingValue" content="4.0">
	this.setRating = function () {
		try {
			//this.rating = document.querySelectorAll("[itemprop='ratingValue']")[0].content;
			this.rating = $(this.jqdoc).find("[itemprop='ratingValue']").first().attr('content');
		} catch(err) {
			console.log("ERROR. Could not set rating " + err.message);		
		}


	} 

	//<span itemprop="reviewCount">591</span> reviews
	this.setReviews = function () {
		try { 
			//this.reviews = document.querySelectorAll("[itemprop='reviewCount']")[0].textContent;
			this.reviews = $(this.jqdoc).find("[itemprop='reviewCount']").first().text();
		} catch(err) {
			console.log("ERROR. Could not set reviews " + err.message);		
		}
	}

	/*
	<span class="category-str-list">
        <a href="/c/la/bakeries">Bakeries</a>,
        <a href="/c/la/coffee">Coffee & Tea</a>
	</span>
	*/
	this.setCategories = function () {
		// !!!
	}
}


function detectSource (url) {
	if (url.search("foursquare.com/v") >= 0) {
		return 'foursquare'; 
	} else if (url.search("4sq.com/") >= 0) {
		return 'foursquare';
	} else if (url.search("yelp.com/biz") >= 0) {
		return 'yelp'; 
	} else if (url.search("www.tripadvisor") >= 0 && url.search("Review-") >= 0) {
		return 'tripadvisor'; 
	} else {
		return 'unknown';
	}
}

function isNumeric(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}



