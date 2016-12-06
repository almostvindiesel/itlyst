angular.module('starter.controllers', ['ion-autocomplete', 'ngCordova', 'ionic'])

//.constant('ItLystUrl', '')
//.constant('ItLystUrl','https://www.itlyst.com')

//In production, make this the real URL




.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // $scope.$on('$ionicView.enter', function(e) {
  // });


  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('FiltersCtrl', function($scope, $http, $q, VenueService, $timeout, config) {


  //console.log("---------------------------- Service");
  //console.log(VenueService.venues);

  // --------------------------------------------------------------------------------
  $scope.zoom_options = [
    '1','3','5','10','25','50' 
  ]
  $scope.venue_options = [
    'food','place',"coffee"
  ]

  // --------------------------------------------------------------------------------
  // Return List of Venues
  /*
  $http.get('http://mars-mac.local:5000/api/v1/venue?zoom=10').then(function(response) {
      //console.log(response.data);
      //$scope.venues = response.data.venues;
  });
  */

  $scope.model = "";
  $scope.clickedValueModel = "";
  $scope.removedValueModel = "";
  $scope.navTitle = '<i class="button" ><i class="fa-filter"></i> filters</i> &nbsp;&nbsp;&nbsp;&nbsp; \
                     Venues  &nbsp;&nbsp;&nbsp;&nbsp; \
                     <i class="button"><i class="fa-map"></i> map</i>&nbsp;&nbsp;&nbsp;&nbsp; \
                     <i class="button" > <i class="fa-bell"></i> updates</i>';


  // --------------------------------------------------------------------------------
  // Return List of Cities for Searchability

  $scope.getCities = function (query) {
    if (query) {
      var temp_data = [];
      var defer = $q.defer();
      var city_query_url = config.api_url + '/api/v1/city?q=' + query;
      $http.get(city_query_url).success(function(response){
          temp_data = { items: response.cities };
          defer.resolve(temp_data);
      });
      return defer.promise;
    }      
  };

  $scope.citiesClicked = function (callback) {
      $scope.clickedValueModel = callback;
      $scope.city_selected = callback.item.name;

      console.log("City Selected: " + $scope.city_selected);
      VenueService.setCity(callback.item.name);
      VenueService.extractVenues().async().then(function(d) { //2. so you can use .then()
        VenueService.setVenues(d.data.venues);
      });

  };

  $scope.changeZoom = function (distance) {
      VenueService.setZoom(distance);
      VenueService.extractVenues().async().then(function(d) { //2. so you can use .then()
        VenueService.setVenues(d.data.venues);
      });
  };    





})

.controller('VenuesCtrl', function($scope, $http, $q, $ionicPlatform, $interval, $cordovaClipboard, VenueService, $timeout) {

  // --------------------------------------------------------------------------------
  // Detect if an item has been pasted to the clipboard
  //var venue_url = 'https://foursquare.com/v/tartine-bakery/42814b00f964a52002221fe3';                  
  //extractVenue(venue_url);

  //var venue_url = 'https://www.yelp.com/biz/tartine-bakery-and-cafe-san-francisco';                  
  //extractVenue(venue_url);

  //var venue_url = 'https://www.tripadvisor.com/Restaurant_Review-g60713-d360064-Reviews-Tartine_Bakery-San_Francisco_California.html';                  
  //extractVenue(venue_url);


  $scope.hasClipboardData = false;
  $scope.addedClipboardData == "";
  $scope.copiedClipboardData = false;

  $ionicPlatform.ready(function() {
      // Check clipboad every two seconds to see if content has been added, but only on mobile app
      if (checkClipboard != null) {
        $interval(checkClipboard, 4*1000);
      } 
  });

  var checkClipboard = function() {    
    console.log('Checking the clipboard...');
    $cordovaClipboard
        .paste()
        .then(function (result) {
            //console.log(result);
            if (result && $scope.addedClipboardData != result) {
                $scope.copiedText = result;
                if ($scope.copiedText.indexOf('foursquare.com/v') >=0) {
                  console.log("Detected Foursquare Venue");
                  extractVenue($scope.copiedText);
                  $scope.hasClipboardData = true;

                } else if ($scope.copiedText.indexOf('www.tripadvisor') >=0) {
                  console.log("Detected Tripadvisor Venue");
                  extractVenue($scope.copiedText);
                  $scope.hasClipboardData = true;

                }
            } else {
                $scope.hasClipboardData = false;
            }
        }, function (e) {
            // error - do nothing cuz we don't care
        });
  };



  $scope.addClipboardData = function (callback) {
      console.log("Adding clipboard data...")
      $scope.addedClipboardData = $scope.copiedText;
      $scope.hasClipboardData = false;
      $scope.copiedClipboardData = true;

      var isVenueUrl = true;
      if (isVenueUrl) {
        var venue_url = $scope.copiedText;
        extractVenue(venue_url);
      }
  };

  function extractVenue(venue_url) {
    console.log ("--- Fetching external url: " + venue_url);
    $.get(venue_url, function(response) {
        // Set Page Attributes

        //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        //console.log(response);

        p = new Page();
        p.url = venue_url;
        p.title = $(response).filter('title').text();
        var source = detectSource(p.url)

        //Set Attributes for Each Venue Source
        switch(source) {
          case 'foursquare':
            v = new FoursquareVenue(p);
            setVenueProperties(v, response);
            $scope.venueFromReviewSourceName = v.name;
            console.log("Extracted Parameters from Foursquare URL: ");
            console.log(v.post_params);

            //sendtoServer(v.post_params, 'http://localhost:5000');
            break;
          case 'tripadvisor':
            v = new TripadvisorVenue(p);
            setVenueProperties(v, response);
            $scope.venueFromReviewSourceName = v.name;
            //sendtoServer(v.post_params, 'http://localhost:5000');
            break;
          case 'yelp':
            v = new YelpVenue(p);
            setVenueProperties(v, response);
            $scope.venueFromReviewSourceName = v.name;

            //sendtoServer(v.post_params, 'http://localhost:5000');
            break;
          default:
            console.log("Unknown source. Just submitting page");
            //savePageNoteToServer(serverUrl, p);
        }
    });
  }

  function sendtoServer(parameters, serverUrl) {
    $http({
        url: serverUrl + '/addnote',
        method: "POST",
        data: parameters
    })
    .then(function(response) {
        alert(response);
    }, 
    function(response) { 
        alert(response);
    });
  }



  function setVenueProperties (v, response) {
    v.setJQueryDocument(response);
    v.setName();
    v.setSourceId();
    v.setLatitude();
    v.setLongitude();
    v.setCity();
    v.setRating();
    v.setReviews();
    //v.setCategories();
    v.setPostParameters();
  }


  // --------------------------------------------------------------------------------
  // Return List of Venues

  // If end user has already applied a filter, leverage it. Otherwise, return venues from default city:
  $scope.$on('$ionicView.enter', function(e) {
    $scope.isDoneLoading = false;

    //Set this to false so that if a url has been added this message will go away
    $scope.copiedClipboardData = false;


    console.log("Entered venue tab");
    //console.log("--- Zoom: " + VenueService.data.zoom);

    //console.log("Current venues: ")
    //console.log(VenueService.data.venues);
    if (VenueService.data.venues && VenueService.data.venues.length > 0) {
      console.log("Retrieving venues from service");
      $scope.venues = VenueService.data.venues;
      //console.log("Venues: ");
      //console.log(VenueService.venues);
      $scope.isDoneLoading = true;

    } else {
      console.log("Retrieving first 10 venues from api since no city was selected");

      VenueService.extractVenues().async().then(function(d) { //2. so you can use .then()
        $scope.venues = d.data.venues.slice(0,9);
        VenueService.setVenues(d.data.venues.slice(0,9));
        $scope.isDoneLoading = true;
      });
    }
  });

  $scope.model = "";
  $scope.clickedValueModel = "";
  $scope.removedValueModel = "";
})



.controller('UserProfileCtrl', function($scope, $http) {
  $scope.userprofile = {
    "name": 'John Marsland',
    "email": 'john@marsland.org',
    "fav_food": 'Butter'
  }
 }) 


.controller('VenueDetailCtrl', function($scope, $http, $stateParams, VenueService) {



  // --------------------------------------------------------------------------------
  // Venue Detail Preferences
  $scope.$on('$ionicView.enter', function(e) {
    console.log("venue id from url: " + $stateParams.venueId);
    for (var i = 0, len = VenueService.data.venues.length; i < len; i++) {
      if(VenueService.data.venues[i].id == $stateParams.venueId) {
        $scope.venue = VenueService.data.venues[i]; 
        console.log("Found venue");
        console.log($scope.venue);
        break;
      }
    }
    
  });

  $scope.changeUserRating = function (venue_id, new_user_rating) {
    console.log("venue_id is " + venue_id + "new_user_rating is " + new_user_rating );
  }


})

.controller('ImageCtrl', function($scope, $http, VenueService, $stateParams) {


  //Get Venue and Images 
  $scope.$on('$ionicView.enter', function(e) {

    //console.log($stateParams.imageId);

    $scope.venues = VenueService.data.venues;

    $scope.images = []; 
    //console.log("Venues length: " +  $scope.venues.length);
    for (i = 0; i < $scope.venues.length; i++) {
      if($scope.venues[i].images) {
        for (j = 0; j < $scope.venues[i].images.length; j++) {
          $scope.venues[i].images[j]['venue_name'] = $scope.venues[i].name;
          $scope.images.push($scope.venues[i].images[j]);
        }
      }
    }

    // --------------------------------------------------------------------------------
    // Image Slider Preferences -- !!! None of htese are working at the moment... something to do with the data.slider definition



    var setupSlider = function() {
        //some options to pass to our slider
        console.log("got here");

        $scope.data = {};
        $scope.data.bgColors = [];
        $scope.data.currentPage = 0;

        $scope.data.sliderOptions = {
          initialSlide: 3,
          //direction: 'horizontal', //or vertical
          speed: 300 //0.3s transition
        };

        //create delegate reference to link with slider
        $scope.data.sliderDelegate = null;

        //watch our sliderDelegate reference, and use it when it becomes available
        $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
          if (newVal != null) {
            $scope.data.sliderDelegate.on('slideChangeEnd', function() {
              $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
              //use $scope.$apply() to refresh any content external to the slider
              $scope.$apply();
            });
          }
        });
      };

      setupSlider();
      console.log($scope.data.currentPage);

  });


});




