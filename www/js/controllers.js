angular
  .module('starter.controllers', ['ion-autocomplete', 'ngCordova', 'ionic', 'base64'])
  .config(function ($httpProvider, $httpParamSerializerJQLikeProvider){
      $httpProvider.defaults.transformRequest.unshift($httpParamSerializerJQLikeProvider.$get());
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
  })
  /*
  .config(function($ionicCloudProvider) {
    $ionicCloudProvider.init({
      "core": {
        "app_id": "582ef426"
      }
    });
  })
  */



.controller('AppCtrl', function($scope, $ionicModal, $timeout, $q, $ionicPlatform, config,  $location, $ionicHistory, LoginService, ApiService) {
  console.log("Loading AppCtrl...");
})


.controller('FtueCtrl', function($scope, $ionicModal, $ionicPlatform, config, VenueService, ApiService, LoginService, $ionicHistory, $location, $q, $http, $base64, $timeout) {
  console.log("loading FtueCtrl...");

  $scope.go_and_complete_ftue = function ( path ) {
    console.log("Going to " + path);
    LoginService.completeMobileFtue(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId());
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $location.path( path );
  };

  $scope.open_app = function (app) {
    if (app =='yelp') {
      window.location.href = "yelp:///";
    } else if (app == 'foursquare') {
      window.location.href = "foursquare://";
    } else if (app == 'tripadvisor') {
      window.location.href = "tripadvisor://";
    } else if (app == 'gmaps') {
      window.location.href = "comgooglemaps://";
    }
  };


  $scope.options = {
    loop: false,
    //effect: 'fade',
    //speed: 500,
  }

  //$scope.ftueTitles = ["Save travel locations from anywhere", "Save places from review apps", "Save pictures from review apps", "Start Lysting!"]
  $scope.ftueTitles = 
    ["Saving notes from Chrome Desktop Extension", 
     "Using Chrome Extension on Computer", 
     "Saving Venue Notes On Your iPhone", 
     "Saving Venue Pictures On Your iPhone 1/2",
     "Saving Venue Pictures On Your iPhone 2/2"];
  $scope.ftueTitle = $scope.ftueTitles[0];

  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
    // data.slider is the instance of Swiper
    $scope.slider = data.slider;
  });

  $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
    console.log('Slide change is beginning');
    console.log("data.slider.activeIndex: " + data.slider.activeIndex);
    $scope.ftueTitle = $scope.ftueTitles[data.slider.activeIndex];
    console.log("$scope.ftueTitle: " + $scope.ftueTitle);
    $scope.$apply();
  });


  $scope.nextSlide = function() {
    console.log("Next slide...");
    console.log($scope.slider);
    $scope.slider._slideTo($scope.slider.activeIndex+1);
    $scope.$apply();
    /*
    $scope.slider.sliderDelegate.activeIndex = $scope.slider.sliderDelegate.activeIndex + 1;
    $scope.slider.currentPage = $scope.slider.sliderDelegate.activeIndex;
    //use $scope.$apply() to refresh any content external to the slider
    */
  }


  

  $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
    // note: the indexes are 0-based
    console.log('slideChangeEnd');

    $scope.activeIndex = data.slider.activeIndex;
    $scope.previousIndex = data.slider.previousIndex;
    
  });

})

.controller('SettingsCtrl', function($scope, $ionicModal, $ionicPlatform, config, VenueService, ApiService, LoginService, $ionicHistory, $location, $q, $http, $base64, $timeout, $ionicScrollDelegate) {
  console.log("loading SettingsCtrl...");

  var totalFAQEntries = 3; 

  $scope.toggleFAQEntry = function (event) {


    //Toggle Visibility of Clicked Element
    var faqEntryDetailElement = angular.element(event.target.parentElement.childNodes[3]);    
    if(faqEntryDetailElement[0].className.indexOf("hide_element") >= 0) {
      faqEntryDetailElement.removeClass('hide_element');
    } else {
      faqEntryDetailElement.addClass('hide_element');
    }

    //Toggle Visibility of Close FAQ Detail Entry Element
    var faqEntryDetailElement = angular.element(event.target.parentElement.childNodes[5]);    
    if(faqEntryDetailElement[0].className.indexOf("hide_element") >= 0) {
      faqEntryDetailElement.removeClass('hide_element');
    } else {
      faqEntryDetailElement.addClass('hide_element');
    }

    //Scroll to top of FAQ
    $timeout(function() {
      $ionicScrollDelegate.scrollTop();
    }, 250);

    

  }

  $scope.go_and_complete_ftue = function ( path ) {
    console.log("Going to " + path);
    LoginService.completeMobileFtue(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId());
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $location.path( path );
  };

  $scope.open_app = function (app) {
    if (app =='yelp') {
      window.location.href = "yelp:///";
    } else if (app == 'foursquare') {
      window.location.href = "foursquare://";
    } else if (app == 'tripadvisor') {
      window.location.href = "tripadvisor://";
    } else if (app == 'gmaps') {
      window.location.href = "comgooglemaps://";
    }
  };


  $scope.options = {
    loop: false,
    //effect: 'fade',
    //speed: 500,
  }

  //$scope.ftueTitles = ["Save travel locations from anywhere", "Save places from review apps", "Save pictures from review apps", "Start Lysting!"]
  $scope.ftueTitles = 
    ["Saving notes from Chrome Desktop Extension", 
     "Using Chrome Extension on Computer", 
     "Saving Venue Notes On Your iPhone", 
     "Saving Venue Pictures On Your iPhone 1/2",
     "Saving Venue Pictures On Your iPhone 2/2"];
  $scope.ftueTitle = $scope.ftueTitles[0];

  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
    // data.slider is the instance of Swiper
    $scope.slider = data.slider;
  });

  $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
    console.log('Slide change is beginning');
    console.log("data.slider.activeIndex: " + data.slider.activeIndex);
    $scope.ftueTitle = $scope.ftueTitles[data.slider.activeIndex];
    console.log("$scope.ftueTitle: " + $scope.ftueTitle);
    $scope.$apply();
  });


  $scope.nextSlide = function() {
    console.log("Next slide...");
    console.log($scope.slider);
    $scope.slider._slideTo($scope.slider.activeIndex+1);
    $scope.$apply();
    /*
    $scope.slider.sliderDelegate.activeIndex = $scope.slider.sliderDelegate.activeIndex + 1;
    $scope.slider.currentPage = $scope.slider.sliderDelegate.activeIndex;
    //use $scope.$apply() to refresh any content external to the slider
    */
  }


  

  $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
    // note: the indexes are 0-based
    console.log('slideChangeEnd');

    $scope.activeIndex = data.slider.activeIndex;
    $scope.previousIndex = data.slider.previousIndex;
    
  });

})

.controller('StartCtrl', function($scope, $ionicModal, $ionicPlatform, config, VenueService, UserCityService, ApiService, LoginService, $ionicHistory, $location, $q, $http, $base64, $timeout, $stateParams) {


  // ------------------------------------------------------------------------------------------------------
  // Change server url depending on whether itlyst is on dev or production
  $scope.getSignupUrl = function () {
    return ApiService.server.url + "/user/register";
  };

  $scope.getForgetPassUrl = function () {
    return ApiService.server.url + "/user/forgot-password";
  };


  // ------------------------------------------------------------------------------------------------------
  // Login Modal

  $scope.$on('$ionicView.enter', function(e) {
    console.log("Entered StartCtrl...");

    $scope.loginData = {'email': LoginService.getEmail(), 'password': LoginService.getPassword()};
    $scope.login_button_message = "Log in";
    $scope.login_error_message = "";
    $scope.isLoggedIn = LoginService.status.isLoggedIn;
    $timeout(function() {
      $scope.isLoggedIn = LoginService.status.isLoggedIn;
    }, 2000);

    //Read url parameters. If login or signup action is present, trigger popup module
    if ($stateParams.action) {
      if ($stateParams.action == 'signup') {
        console.log("Triggering signup module");
        $scope.modal.hide();
        $scope.modalSignup.show();
      } else if ($stateParams.action == 'signin') {
        console.log("Triggering signin module");
        $scope.modal.show();
      } 
    } else {

      /*
      var loginPromise = LoginService.login(ApiService.server.url);
      loginPromise.then(function(response) {
      //console.log("Logged in!:");
        if (response.data.login_status) {
          //console.log("User logged in");
          triggerSuccessfulLoginMethods();
        }
      });
      */
    }

    console.log("Login status: " + $scope.isLoggedIn);
   

    
  });  


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
    $timeout(function() {
      $scope.login_button_message = "Login";
    }, 1500);
  };

  // Open the login modal
  $scope.logout = function() {
    //If there's an existing modal--such as when a user hits login from the signup modal--close it:
    LoginService.status.isLoggedIn = false;
    LoginService.setUserId(0);
    $timeout(function() {
      $scope.isLoggedIn = false;
    }, 300);
  };

  $scope.login = function() {
    //If there's an existing modal--such as when a user hits login from the signup modal--close it:
    if ($scope.modalSignup) {
      $scope.modalSignup.hide();
    }  
    //Now show the login modal
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    LoginService.setEmail($scope.loginData.email);
    LoginService.setPassword($scope.loginData.password);
    $scope.login_button_message = "Logging in...";
    $scope.login_error_message = "";

    //LoginService.login(ApiService.server.url);

    var loginPromise = LoginService.login(ApiService.server.url);
    
    loginPromise.then(function(response) {
      //console.log("Logged in!:");
      if (response.data.login_status) {
        console.log("User logged in");
        $scope.isLoggedIn = LoginService.status.isLoggedIn;
        $scope.login_button_message = "Success";

        //Close the login modal
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);

        triggerSuccessfulLoginMethods();

        
      } else {
        console.log("User NOT logged in");
        $scope.login_button_message = "Log in";
        $scope.login_error_message = "Ruh roh. Something went wrong. Try again?";
      }
    });
  };

  function triggerSuccessfulLoginMethods () {
    //Trigger the FTUE, if needed
    if(LoginService.status.hasCompletedFtue == 0) {
       $timeout(function() {
        $scope.go('ftue')
      }, 1500);
    }

    //Show the last cities selected for easy navigation
    UserCityService.getRecentlyAddedCities(2, ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(response) { 
      $scope.recent_cities = response.data.cities;
      //console.log(response.data.cities);
    });
  }

 // ------------------------------------------------------------------------------------------------------
  // Forget Password 

  // Form data for the login modal
  //$scope.signupData = {};

  // Create the forget pass modal that we will use later
  $ionicModal.fromTemplateUrl('templates/forgetpass.html', {
    scope: $scope
  }).then(function(modalForgetPass) {
    $scope.modalForgetPass = modalForgetPass;
  });

  // Triggered in the forget pass modal to close it
  $scope.closeForgetPass = function() {
    $scope.modalForgetPass.hide();
  };

  // Open the signup modal
  $scope.forgotPass = function() {
    $scope.modal.hide();
    $scope.modalForgetPass.show();
  };

  /*
  $timeout(function() {
      $scope.closeForgetPass();
  }, 1000);
  */




  // ------------------------------------------------------------------------------------------------------
  // Signup 

  // Form data for the login modal
  $scope.signupData = {};

  // Create the Signup modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modalSignup) {
    $scope.modalSignup = modalSignup;
  });

  // Triggered in the signup modal to close it
  $scope.closeSignup = function() {
    $scope.modalSignup.hide();
  };

  // Open the signup modal
  $scope.signup = function() {
    $scope.modal.hide();
    $scope.modalSignup.show();
  };

  /*
  $timeout(function() {
      $scope.closeSignup();
  }, 1000);
  */

  // Perform the signup action when the user submits the signup form
  /*
  $scope.doSignup = function() {
    console.log('Doing signup', $scope.signupData);

    
    $ionicAuth.signup($scope.signupData).then(function() {
      console.log("User is signed up: " + $scope.signupData.email);
    }, function(err) {
      for (var e of err.details) {
        if (e === 'conflict_email') {
          alert('Email already exists.');
        } else {
          // handle other errors
        }
      }
    });
    

    $timeout(function() {
      $scope.closeForgetPass();
    }, 500); 
  };
  */

  // Perform the signup action when the user submits the signup form
  $scope.doSignup = function() {
    console.log('Doing signup', $scope.signupData);

    /*
    $ionicAuth.signup($scope.signupData).then(function() {
      console.log("User is signed up: " + $scope.signupData.email);
    }, function(err) {
      for (var e of err.details) {
        if (e === 'conflict_email') {
          alert('Email already exists.');
        } else {
          // handle other errors
        }
      }
    });
    */

    $timeout(function() {
      $scope.closeSignup();
    }, 500);
  };

  // ------------------------------------------------------------------------------------------------------


  $scope.model = "";
  $scope.clickedValueModel = "";
  $scope.removedValueModel = "";

  $scope.go = function ( path ) {
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $location.path( path );
  };


  /*
  $scope.getCities = function (query) {
    if (query) {
      var temp_data = [];
      var defer = $q.defer();
      var city_query_url = ApiService.server.url + '/api/v1/cities?q=' + query;

      //$http.get(config.apiUrl + '/api/token', { headers: {'Authorization': 'Basic '+ base64.encode( $scope.username + ':' + $scope.password) } })
      headers = { headers: {'Authorization': 'Basic '+ $base64.encode( 'john@marsland.org' + ':' + 'z1qGW4ZG') } }
      $http.get(city_query_url, headers).success(function(response){
          temp_data = { items: response.cities };
          defer.resolve(temp_data);
      });
      return defer.promise;
    }      
  };
  */

  // !!! Same as filters--should abstract
  $scope.getCities = function (query) {
    if (query) {
      var cities = [];
      var defer = $q.defer();
      var city_query_url = ApiService.server.url + '/api/v1/cities?q=' + query;
      $http.get(city_query_url).success(function(response){
        cities = { items: response.cities };
        defer.resolve(cities);
      });
      return defer.promise;
    }      
  };

  //Triggered when an end user selects a recent city instead of searching for one
  //!!! can I combine the selectRecentCity function with the citiesclicked function?
  $scope.selectRecentCity = function(city) {

    console.log("City Selected: " + city.name);
    VenueService.setCity(city.name);
    VenueService.setLatitude(city.latitude);
    VenueService.setLongitude(city.longitude);

    VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { //2. so you can use .then()
      VenueService.setVenues(d.data.venues);
    });

    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $location.path( 'app/venues' );

  }

  // Same as filters--should abstract
  /*
  $scope.citiesClicked = function (callback) {
    $scope.clickedValueModel = callback;
    $scope.city_selected = callback.item.name;

    console.log("City Selected: " + $scope.city_selected);
    VenueService.setCity(callback.item.name);
    VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { //2. so you can use .then()
      VenueService.setVenues(d.data.venues);
    });

   $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $location.path( 'app/venues' );
  };
  */

  // Same as filters--should abstract
  $scope.citiesClicked = function (callback) {
    $scope.clickedValueModel = callback;
    $scope.city_selected = callback.item.city;
    console.log("City Selected: " + $scope.city_selected);
    console.log("Google Place Id : " + callback.item.google_place_id);

    //Set the city name
    VenueService.setCity(callback.item.city);

    //Once the city name is set, find the lat long, then update the venue locations
    VenueService.getLatLngFromGooglePlaceId(callback.item.google_place_id, ApiService.server.url).async().then(function(d) { 
      VenueService.setLatitude(d.data.city.latitude);
      VenueService.setLongitude(d.data.city.longitude);
      VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { 
        VenueService.setVenues(d.data.venues);
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $location.path( 'app/venues' );
      });
    }); 

    
  };



})



.controller('MapCtrl', function($scope, $ionicLoading, $compile, VenueService, ApiService, LoginService, LocationService, $http, $q, $timeout, $state) {

  console.log("Loaded map ctrl");

  $scope.$on('$ionicView.enter', function(e) {
    console.log("Entered map view...");

    
    if (VenueService.data.venues.length > 0) {
      console.log("Extracting venues without refreshing from venue service");
      $scope.venues = VenueService.data.venues;
      initialize();
    } else {
      VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { 
        $scope.venues = d.data.venues;
        VenueService.setVenues($scope.venues);
        console.log("Got venues: " + $scope.venues.length);
        initialize();
      });
    }

      
  });


  
  function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    //controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.backgroundColor = '#fff';
    controlText.style.color = '#387ef5';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '30px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.style.cssFloat = "left";
    controlText.style.color = "#fff";
    controlText.innerHTML = '<i class="icon ion-ios-navigate-outline" style="color:#387ef5"></i>';
    controlUI.appendChild(controlText);

    var gapDiv = document.createElement('div');
    gapDiv.style.lineHeight = '30px';
    gapDiv.style.paddingLeft = '5px';
    gapDiv.style.paddingRight = '5px';
    gapDiv.style.cssFloat = "left";
    gapDiv.innerHTML = ' &nbsp; &nbsp;';
    controlUI.appendChild(gapDiv);

    var filterVisibile = document.createElement('div');
    filterVisibile.style.backgroundColor = '#fff';
    filterVisibile.style.color = '#387ef5';
    filterVisibile.style.fontFamily = 'Roboto,Arial,sans-serif';
    filterVisibile.style.fontSize = '16px';
    filterVisibile.style.lineHeight = '30px';
    filterVisibile.style.paddingLeft = '5px';
    filterVisibile.style.paddingRight = '5px';
    filterVisibile.style.cssFloat = "left";
    filterVisibile.innerHTML = '<i class="icon ion-ios-settings"> Filter Visible</i>';
    controlUI.appendChild(filterVisibile);

    var latlongcoords = {};
    var LatLongPromiseIP  = LocationService.getLatLongFromIPAddress();
    var LatLongPromiseGPS  = LocationService.getLatLongFromGPS();

    function center_and_zoom(coords, zoom) {
      map.setCenter(coords);
      map.setZoom(zoom); 
    }

    // Setup the click event listeners: simply set the map to Chicago.
    controlText.addEventListener('click', function() {
      //Attempt to get Lat Long via GPS Coords. If that isn't possible, get them via IP
      console.log("Attempting to get lat / lng from GPS...");
      LatLongPromiseGPS.then(function(response) {
        if (response.lat && response.lng) {
          console.log("--- Success");
          var latlongcoords = response;
          center_and_zoom(latlongcoords, 14);

          //This is the blue dot. Only works in the phone/gps enabled
          var GeoMarker = new GeolocationMarker(map);
        } else {
          console.log("--- GPS Attempt Failed. Err:");
          console.log(response);
          console.log("Now Attempting to get lat / lng from IP...");
          LatLongPromiseIP.then(function(latlongcoords) {
            console.log(latlongcoords);
            center_and_zoom(latlongcoords, 14);

            //The default blue dot to show when the gps one fails
            var bounds = new google.maps.LatLngBounds();
            var latlng = new google.maps.LatLng(latlongcoords.lat, latlongcoords.lng);
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                venue_id: -1,
                icon: 'img/location-blue-circle.png'
            });
            bounds.extend(marker.position);
          });
        }
      });

    });

    filterVisibile.addEventListener('click', function() {

      // Find all venues (by their ids) that are visible. 
      // Loop through the stored venue list and remove venues that aren't visible 
      // This could be made more efficient, runs in n^2 at the moment.     
      var bounds = map.getBounds();
      var visible_markers = $scope.markers; 
      var all_venues = $scope.venues;
      $scope.venues = Array();         //Resetting back to empty, will add all back

      for(var i = 0; i < visible_markers.length; i++) {   
        if(bounds.contains(visible_markers[i].position)) {
          for(var v = 0; v < all_venues.length; v++) {
            if(all_venues[v].id == visible_markers[i].venue_id) {
              $scope.venues.push(all_venues[v]);
            }
          }
        }
      }
      VenueService.setVenues($scope.venues);
      VenueService.setForceRefreshVenues(false);
      
      $timeout(function() {
        $state.go('app.venues', {}, {});
      }, 1000);  
      

    });

  }


  function initialize() {
      console.log("MapCtrl initializing...");

      google.maps.event.addDomListener(window, 'load', initialize);

      var mapOptions = {
          center: latlng,
          zoom: 14,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"),
          mapOptions);
      var infowindow;

      infowindow = new google.maps.InfoWindow();

      $scope.markers = Array();
      console.log("Adding " + $scope.venues.length + " venues to the map...");
      for (var i=0, len=$scope.venues.length; i<len; i++) {
        var bounds = new google.maps.LatLngBounds();
        var latlng = new google.maps.LatLng($scope.venues[i].latitude, $scope.venues[i].longitude);
        var marker = new google.maps.Marker({
            position: latlng,
            //label: venues[i].name,
            map: map,
            venue_id: $scope.venues[i].id
        });
        $scope.markers.push(marker);


        // Show Venue Name, Notes, and Pictures on Click
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
          return function () {
            var gmapUrl ="http://www.google.com/maps/search/"+$scope.venues[i].name+"/@"+$scope.venues[i].latitude+","+$scope.venues[i].longitude+"/14z";
            var popUpData = "<b>" + $scope.venues[i].name + "</b><br>";
            popUpData    += "<i class='ion-ios-navigate-outline'></i> <a href='"+gmapUrl+"' target='_system'>Get Directions</i></a>";

            //Add notes
            for (var j=0, len_ven=$scope.venues[i].notes.length; j<len_ven; j++) {
              popUpData += "<br>◦ " + $scope.venues[i].notes[j].note;
            }

            //Add images
            console.log("images length: "+ $scope.venues[i].images.length);
            popUpData += "<br>"
            for (var j=0, len_img=$scope.venues[i].images.length; j<len_img; j++) {
              popUpData += "<img src=" + $scope.venues[i].images[j].image_thumb + " width=75>";
              console.log("got here...");
            }


            infowindow.setContent(popUpData);
            infowindow.open(map, marker);
          }
        })(marker, i));

        bounds.extend(marker.position);

      }

      // Display Buttons to Center on Current Location and Filter Visibile Venues
      var centerControlDiv = document.createElement('div');
      var centerControl = new CenterControl(centerControlDiv, map);
      centerControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

      
      var listener = google.maps.event.addListener(map, 'idle', function() { 
        if (map.getZoom() > 16) map.setZoom(10); 
        google.maps.event.removeListener(listener); 
      });
      map.fitBounds(bounds);
      $scope.map = map;
  }
})

.controller('VenueDetailCtrl', function($scope, $http, $location, $state, $timeout, $stateParams, VenueService, ApiService, LoginService, VenueApi, $ionicHistory) {

  console.log("loaded VenueDetailCtrl....");

  $scope.$on('$ionicView.beforeEnter', function(e) {
    console.log('VenueDetailCtrl $ionicView.beforeEnter');
    for (var i = 0, len = VenueService.data.venues.length; i < len; i++) {
      if(VenueService.data.venues[i].id == $stateParams.venueId) {
        $scope.venue = VenueService.data.venues[i]; 
        console.log("Found venue");
        console.log($scope.venue);
        break;
      }
    }

  });

  // ------------------------------------------------------------------------------------------------ 

  $scope.go_uri = function ( source, params ) {
    var uri = '';
    if (source =='yelp') {
      go_to_uri(source, 'yelp:///biz/' + params);
    } else if (source == 'foursquare') {
      go_to_uri(source, 'foursquare://venues/' + params);
    } else if (source == 'tripadvisor') {
      go_to_uri(source, 'tripadvisor://location/' + params);
    } else if (source == 'gmaps') {
      go_to_uri(source, 'comgooglemaps://?' + params);
    }

    function go_to_uri(source, uri) {
      console.log("Launching app for " + source + " to " + uri);
      window.location.href = uri;
    }
  };

  // ------------------------------------------------------------------------------------------------ 

  $scope.deleteVenue = function (venue_id) {
    VenueService.setForceRefreshVenues(true);
    VenueApi.remove(venue_id, ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId());
    console.log("redirecting...");
    //$location.path( 'app.venues' );

    $timeout(function() {
      $state.go('app.venues', {}, {});
    }, 2000);
    
  };
  

  // --------------------------------------------------------------------------------
  // Venue Detail Preferences

  $scope.changeUserRating = function (venue_id, new_user_rating) {
    console.log("venue_id is " + venue_id + "new_user_rating is " + new_user_rating );
  }
})




.controller('VenuesCtrl', function($scope, $http, $q, $ionicPlatform, $cordovaEmailComposer, $cordovaClipboard, $cordovaFileTransfer, $cordovaImagePicker, /*$cordovaCamera,*/ $timeout, $ionicPopover, VenueService, VenueApi, LoginService, ApiService, NoteApi, $location, $ionicListDelegate, $ionicHistory, $state, $stateParams) {

  // ---------------------------------------------------------------------------------------------------------
  // Upload Images
  /* Read more here on how to do this

    Library for uploading images
    https://github.com/sbolel/ionic-image-upload

    Amazon 
    http://coenraets.org/blog/2013/09/how-to-upload-pictures-from-a-phonegap-app-to-amazon-s3/

    Maybe this too?
    https://www.thepolyglotdeveloper.com/2015/01/upload-files-remote-server-using-ionic-framework/

  */

  $scope.selectNoteImages = function() {

    var options = {
     maximumImagesCount: 10,
     width: 800,
     height: 800,
     quality: 80
    };

    /*
    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ');
          console.log(results[i]);
        }
      }, function(error) {
        console.log("Error getting photos");
    });
    */

    var policy = {
        "expiration": "2020-12-31T12:00:00.000Z",
        "conditions": [
            {"bucket": "phonegap-demo"},
            ["starts-with", "$key", ""],
            {"acl": 'public-read'},
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 524288000]
        ]
    };

    var policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
    var s3BucketName = 'itlyst';
    var s3URI = encodeURI("https://" + s3BucketName + ".s3.amazonaws.com/"),
                policyBase64 = policyBase64,
                signature = "",
                awsKey = '',
                acl = "public-read";

    var options = {
        fileKey: "avatar",
        fileName: "aaaa.png",
        chunkedMode: false,
        mimeType: "image/png"
    };

    var imageURI = 'http://almostvindiesel.pythonanywhere.com/static/img/insta/526.jpg';
    $scope.upload = function($cordovaFileTransfer) {
      $cordovaFileTransfer.upload(s3URI, imageURI, options)
          .then(function(result) {
              console.log("SUCCESS: " + JSON.stringify(result.response));
          }, function(err) {
              console.log("ERROR: " + JSON.stringify(err));
          }, function(progress) {
              // constant progress updates
          });
    }

    /* Priorities
       1) Get Images
       2) Upload to S3

    

    /* Launching the camera
        document.addEventListener('deviceready', function() {

            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
            };
            $cordovaCamera.getPicture(options).then(function(imageURI) {
                $scope.imageSrc = imageURI;
                $scope.img = imageURI;

            }, function(err) {
                alert(err);
            });

        }, false); // device ready
    }; // Select picture
    */
  }


  // ---------------------------------------------------------------------------------------------------------
  // Email

  try {
    $cordovaEmailComposer.isAvailable().then(function() {
       // is available
       console.log("cordovaEmailComposer is available")
     }, function () {
       // not available
       console.log("cordovaEmailComposer is NOT available")
     });
  } catch(err) {
    console.log ("Could not initiate cordovaEmailComposer (only available in app)");
  }


  var body = "<b>Urth Caffe</b><br> \
              Yelp: 4/5 Stars, Foursquare: 8.9/10. <a href='#'>Map</a><br>\
              * Amazing coffee. Would go back again in a heartbeat<br> \
              * Love the Spanish Lattes. My absolute fav<br> \
              <img width=150 src=http://www.itlyst.com/static/img/coffee.jpg> \
              <br><br> \
              \
              <p>Sent via <a href=itlyst.com>itlyst:</a>. Remember the places you want to visit</p>"


  $scope.sendEmail = function(){

    var email_subject = $scope.active_city + ' Recs (via itlyst)';
    var yelp_icon = "<img src=http://www.itlyst.com/static/img/yelp-app-icon.jpeg width=15> ";
    var tripadvisor_icon = "<img src=http://www.itlyst.com/static/img/tripadvisor-app-icon.jpeg width=15> ";
    var foursquare_icon = "<img src=http://www.itlyst.com/static/img/foursquare-app-icon.jpg width=15> ";
    var email_body = '';

    for (var i=0, len=$scope.venues.length; i<len; i++) {

      var map_url ="http://www.google.com/maps/search/"+$scope.venues[i].name+"/@"+$scope.venues[i].latitude+","+$scope.venues[i].longitude+"/14z";

      email_body += "<b>" + $scope.venues[i].name + "</b> - <a href=" + map_url + ">Map</a><br>";
      if ($scope.venues[i].yelp_id != null) {
        var yelp_url = $scope.venues[i].yelp_url;
        email_body += "<a href=" + yelp_url + ">" + yelp_icon + $scope.venues[i].yelp_rating + "/5 " + $scope.venues[i].yelp_reviews + " tips</a> ";
      }
      if ($scope.venues[i].foursquare_id != null) {
        var foursquare_url = $scope.venues[i].foursquare_url;
        email_body += "<a href=" + foursquare_url + ">" + foursquare_icon + $scope.venues[i].foursquare_rating + "/10</a> " /*+ $scope.venues[i].foursquare_reviews + " tips "</a> "*/;
      }
      if ($scope.venues[i].tripadvisor_id != null) {
        var tripadvisor_url = $scope.venues[i].tripadvisor_url;
        email_body += "<a href=" + tripadvisor_url + ">" + tripadvisor_icon + $scope.venues[i].tripadvisor_rating + "/5 " + $scope.venues[i].tripadvisor_reviews + " tips</a> ";
      }
      email_body += "<br>";

      for (var n=0, nlen=$scope.venues[i].notes.length; n<nlen; n++) {
        email_body += "• " + $scope.venues[i].notes[n].note + "<br>";
      }
      for (var j=0, ilen=$scope.venues[i].images.length; j<ilen; j++) {
        email_body += "<img width=150 src=" + $scope.venues[i].images[j].image_thumb + "> &nbsp;";
      }
      email_body += "<br><br>";
    }
    email_body += "Remember places you want to visit with <a href=www.itlyt.com>itlyst</a>."
    
    var email = {
//       to: 'jmarsland@gmail.com',
       subject: email_subject,
       body: email_body,
       isHtml: true
    };

   $cordovaEmailComposer.open(email).then(null, function () {
     // user cancelled email
   });

  }
  

  // ---------------------------------------------------------------------------------------------------------
  // User cick events which trigger transitions within the tab or outside the tab

  $scope.go_venue_detail = function ($event, path, venueId ) {
    $event.preventDefault();
    $state.transitionTo('app.venue', {
       venueId: venueId
    });
  };


  $scope.open_app = function (app) {
    if (app =='yelp') {
      window.location.href = "yelp:///";
    } else if (app == 'foursquare') {
      window.location.href = "foursquare://";
    } else if (app == 'tripadvisor') {
      window.location.href = "tripadvisor://";
    } else if (app == 'gmaps') {
      window.location.href = "comgooglemaps://";
    }
  };


  $scope.go_image_detail = function ($event, path, venueId ) {
    $event.preventDefault();
    $state.transitionTo('app.image', {
       imageId: imageId
    });
  };

  $scope.go = function ( path ) {
    console.log("Going to " + path);
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $location.path( path );
  };



  // ---------------------------------------------------------------------------------------------------------
  // Listing Venues

  $scope.refreshVenues = function() {
    console.log("Refreshing venues from service per request...");
    VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { 
      $scope.venues = d.data.venues;
      VenueService.setVenues(d.data.venues);
      VenueService.setForceRefreshVenues(false);
      $scope.isDoneLoading = true;
      $scope.$broadcast('scroll.refreshComplete');
    });

  }


  $scope.$on('$ionicView.beforeEnter', function(e) {
    //LoginService.init();
    //console.log("before loading...");
    //console.log("Scope id beforeEnter: " + $scope.$id)
    $scope.isDoneLoading = false;
    $scope.active_city = VenueService.data.city;

    if (VenueService.data.refreshVenues == true) {
      $scope.refreshVenues();
    // Retrieve last loaded venues from last data pull
    } else if ( VenueService.data.venues && VenueService.data.venues.length > 0) {
      console.log("Retrieving existing venues from service without refreshing");
      //$scope.venues = [];
      $scope.venues = VenueService.data.venues;
      $scope.isDoneLoading = true;

    // Pull default set of venues
    } else {
      console.log("Retrieving up to 100 venues with default location");
      VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { //2. so you can use .then()
        $scope.venues = d.data.venues.slice(0,100);
        VenueService.setVenues(d.data.venues.slice(0,100));
        $scope.isDoneLoading = true;
      });
    }
  });



  // --------------------------------------------------------------------------------
  // Return List of Venues

  $scope.shouldShowDelete = false;
  $scope.listCanSwipe = true;


  // ---------------------------------------------------------------------------------------------------------
  // General Popup Functions
  $scope.$on('$destroy', function() {
    console.log("Destroying Edit Dialog");
    try {
      $scope.popover.remove();
    } catch(err) {
      console.log ("Could not remove popover");
    }
  });
  $scope.$on('popover.hidden', function() {
    console.log("Hiding Edit Dialog");
  });
  $scope.$on('popover.removed', function() {
    console.log("Removing Edit Dialog");
  });

  // ---------------------------------------------------------------------------------------------------------
  // Popup for Editing Existing Venue Notes
  $scope.editNote = function($event, note_id, note) {
    console.log("Opening Edit Dialog for note_id: " + note_id);


    //Create Popup
    console.log("ionicPopover: editNotePopup");
    $ionicPopover.fromTemplateUrl('editNotePopup', {
      scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
        $scope.noteToEdit = note;
        $scope.noteIdtoEdit = note_id;
        $scope.popover.show($event);
    });
  }

  $scope.saveEditedNote = function() {
    //console.log("Closing Edit Dialog and saving");
    var note = document.getElementById("editVenueNote").value;
    var note_id = $scope.noteIdtoEdit;
    console.log("Saving this note: " + note);

    //Find note in scope, update scope
    for (var i=0, len=$scope.venues.length; i<len; i++) {
      for (var j=0, len_ven=$scope.venues[i].notes.length; j<len_ven; j++) {
        if(note_id == $scope.venues[i].notes[j].id) {
          $scope.venues[i].notes[j].note = note;
          NoteApi.edit(note_id, note, ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId());
        }
      }
    }   

    $scope.popover.remove();
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.cancelEditOnNote = function() {
    console.log("Closing Edit Dialog not saving");
    $scope.popover.remove();
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.deleteNote = function(note_id) {
    //Remove note from the UI and issue delete command to server
    //!!! For some reason i get an error when I splice any array that has more than one item. Not sure why...

    for (var i=0, len=$scope.venues.length; i<len; i++) {
      for (var j=0, len_ven=$scope.venues[i].notes.length; j<len_ven; j++) {
        if(note_id == $scope.venues[i].notes[j].id) {
          console.log("Deleting note id: " + $scope.venues[i].notes[j].id);

          //Remove via api
          NoteApi.remove(note_id, ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId());

          //console.log($scope.venues[i].notes.length);
          //Remove in UI
          try {
            $scope.venues[i].notes.splice(j, 1);
          } catch(err) {
            console.log (err);
          }
          //console.log($scope.venues[i].notes.length);
          //$scope.venues.item.splice($scope.venues.indexOf(item), 1);
        }
      }
    }    
  }



  // ---------------------------------------------------------------------------------------------------------
  // Popup for Creating New Venue Notes

  $scope.addNote = function($event, venue_id) {
    console.log("Opening Dialog for venue_id: " + venue_id);
    $scope.venueIdtoEdit = venue_id;

    //Create Popup
    console.log("ionicPopover: newNotePopup");
    $ionicPopover.fromTemplateUrl('newNotePopup', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
      $scope.popover.show($event);

    });
  }

  $scope.saveNewNote = function() {
    //console.log("Closing Edit Dialog and saving");
    note = document.getElementById("newVenueNote").value
    console.log("Saving this note: " + note);
    NoteApi.add($scope.venueIdtoEdit, note, ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId());
    $scope.popover.remove();
    VenueService.setForceRefreshVenues(true);
    $ionicListDelegate.closeOptionButtons();
    console.log("redirecting...");
    $timeout(function() {
      $state.go('app.redirector', {}, {});
    }, 1500); 
  };

  $scope.cancelNewNote = function() {
    console.log("Closing edit dialog not saving");
    $scope.popover.remove();
    $ionicListDelegate.closeOptionButtons();
  };

  // ---------------------------------------------------------------------------------------------------------
  // Popup for Rating Venues
  $scope.toggleUserRatingPrompt = function($event, venue) {
    console.log("Toggling Rate Venue Popover: " + venue.id);

    for (i = 0; i < $scope.venues.length; i++) {
      if($scope.venues[i].id == venue.id) {
          console.log("changing rating of venue...");
          if ($scope.venues[i].user_rating_display == true) {
            $scope.venues[i].user_rating_display = false;
          } else {
            $scope.venues[i].user_rating_display = true;
          }
          break;
      }
    }


    //Create Popup
    //console.log("ionicPopover: rateVenuePopup");
    /*
    $ionicPopover.fromTemplateUrl('rateVenuePopup', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
      $scope.popover.show($event);
    });
    */



  }

  $scope.changeUserRating = function (venue_id, new_user_rating) {
    console.log("Selected rating is " + new_user_rating );
    //$scope.venueToRate.user_rating = new_user_rating;

    //Update Venue 
    for (i = 0; i < $scope.venues.length; i++) {
      if($scope.venues[i].id == venue_id) {
          console.log("changing rating of venue...");
          $scope.venues[i].user_rating = new_user_rating;
          $scope.venues[i].user_rating_display = false;
          break;
      }
    }

    //Make update on server
    VenueApi.edit(new_user_rating, venue_id, ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId());

    /*
    $timeout(function() {
      //$scope.popover.remove();
      console.log("Rating in scope is: " + $scope.venues[i].user_rating);
      console.log($scope.venues);
      $scope.$apply();
    }, 100);  
    */
    
  }

})






.controller('ImageCtrl', function($scope, $http, VenueService, ApiService, LoginService, $stateParams, ImageApi, $state, $stateParams, $timeout) {

  console.log("loading ImageCtrl... ");

  var setupSlider = function() {

    $scope.data.sliderOptions = {
      direction: 'horizontal', //or vertical
      //speed: 300, //0.3s transition
      initialSlide: $scope.initialSlideIndex
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

  //Load Images from Service
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
  console.log("Loaded images. Count: " + $scope.images.length);

  for (i = 0; i < $scope.images.length; i++) {
    if ($scope.images[i].id == $stateParams.imageId) {
      console.log(">>>>Found index of current image");
      $scope.initialSlideIndex = i;
    }
  }
  console.log("Current Image Id: " + $stateParams.imageId);


  $scope.data = {};
  setupSlider();
  console.log("Finished Slider Setup");

  //Assign first slide to scope
  $scope.$on('$ionicView.enter', function(e) {
    $scope.currentImageId = $stateParams.imageId;
    console.log("initial slide: " + $scope.data.sliderOptions.initialSlide);
  });


  $scope.deleteImage = function (image_id) {
    console.log("Deleting image" + image_id);

    //Remove from scope
    for (i = 0; i < $scope.venues.length; i++) {
      if($scope.venues[i].images) {
        for (j = 0; j < $scope.venues[i].images.length; j++) {
          if($scope.venues[i].images[j].id == image_id) {
            //Delete Image
            $scope.venues[i].images.splice(j, 1);
          }
        }
      }
    }
    
    //Remove from server;
    ImageApi.remove(image_id, ApiService.server.url, LoginService.getLoginHeader(),LoginService.getUserId());
    
    console.log("redirecting...");
    $timeout(function() {
      $state.go('app.venues', {}, {});
    }, 0);    
  };


  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
    console.log("----- sliderInitialized");
    $scope.slider = data.slider;
    //$scope.slider.activeIndex = 2;
    console.log($scope.slider);
    console.log($scope.slider.activeIndex);

  });

  $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
    console.log("Current Slide: " + data.slider.activeIndex);
    $scope.currentImageId = $scope.images[data.slider.activeIndex].id;
    console.log("Current Image Id: " + $scope.currentImageId);
  });
})

.controller('PopupCtrl', function($scope, $scope, $window, $ionicModal, $timeout, $http, $q, $ionicPlatform, $ionicHistory, $ionicPopover, $cordovaClipboard, config, $interval, ClipboardService, ApiService, LoginService, $location, $state, VenueService,  TextApi, VenueApi) {

  /*
  $scope.$on('$ionicView.beforeEnter', function(e) {
    console.log("Clearing cache");
    $ionicHistory.clearCache();
    /*
    console.log("About to initialize popover...");
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    
  });
  */


  $scope.go = function ( path ) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $location.path( path );
    //$state.go('app.venues', {}, {});
  };

  /*
  function getScopes(root) {
      var scopes = [];

      function visit(scope) {
          scopes.push(scope);
      }
      function traverse(scope) {
          visit(scope);
          if (scope.$$nextSibling)
              traverse(scope.$$nextSibling);
          if (scope.$$childHead)
              traverse(scope.$$childHead);
      }

      traverse(root);
      return scopes;
  }
  */

  console.log("Loading clipboard popupctrl...");

  // ------------------------------------------------------------------------------------------------ 
  // Changing Detected City
  // !!! Same as filters--should abstract
  $scope.getCities = function (query) {
    $scope.popover.hide();

    if (query) {
      var cities = [];
      var defer = $q.defer();
      var city_query_url = ApiService.server.url + '/api/v1/cities?q=' + query;
      $http.get(city_query_url).success(function(response){
        cities = { items: response.cities };
        defer.resolve(cities);
        //console.log(cities);
      });
      return defer.promise;
    }      
  };


  /*
  $scope.getCities = function (query) {
    $scope.popover.hide();
    if (query) {
      var temp_data = [];
      var defer = $q.defer();
      var city_query_url = ApiService.server.url + '/api/v1/cities?q=' + query;
      $http.get(city_query_url).success(function(response){
          temp_data = { items: response.cities };
          defer.resolve(temp_data);
      });
      return defer.promise;
    }      
  };
  */

  $scope.cancelButtonClickedMethod = function (callback) {
    console.log("Search Cancelled");
    
    //Reset the clipboard service to detect copied text with next refresh
    ClipboardService.setExtractedClipboardData("");
    ClipboardService.setThreadStatus(false);
    //$scope.popover.remove();
    //!!! changed to test to see if this works...
    $scope.popover.hide();
  }

  /*
  $scope.citiesClicked = function (callback) {
      $scope.clickedValueModel = callback;
      $scope.city_selected = callback.item.city;
      console.log("City Selected: " + $scope.city_selected);
      console.log("Google Place Id : " + callback.item.google_place_id);

      //Set the city name
      VenueService.setCity(callback.item.city);

      //Once the city name is set, find the lat long, then update the venue locations
      VenueService.getLatLngFromGooglePlaceId(callback.item.google_place_id, ApiService.server.url).async().then(function(d) { 
        VenueService.setLatitude(d.data.city.latitude);
        VenueService.setLongitude(d.data.city.longitude);
        VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { 
          VenueService.setVenues(d.data.venues);
        });
      }); 
  };
  */

  $scope.citiesClicked = function (callback) {
    $scope.clickedValueModel = callback;
    console.log(callback);
    VenueService.setCity(callback.item.city);
    console.log("City Selected: " + VenueService.data.city);
    console.log("Google Place Id : " + callback.item.google_place_id);

    //Reset the clipboard service to detect copied text with next refresh
    ClipboardService.setExtractedClipboardData("");
    ClipboardService.setThreadStatus(false);
    $scope.popover.remove();

    //Once the city name is set, find the lat long, then update the venue locations
    VenueService.getLatLngFromGooglePlaceId(callback.item.google_place_id, ApiService.server.url).async().then(function(d) { 
      VenueService.setLatitude(d.data.city.latitude);
      VenueService.setLongitude(d.data.city.longitude);
    });      
  };

  $scope.triggerCitySearch = function () {
    console.log("Triggering city search...");
    $timeout(function() {
      angular.element(document.getElementById('citySearch')).focus;
    }, 0);    
  };




  // ------------------------------------------------------------------------------------------------ 
  // Popover for Adding Venues
  
  //console.log("  thread status: "+ ClipboardService.data.isThreadActive);
  //console.log("  service status: "+ ClipboardService.data.isServiceActive);

  
  

  //$scope.detectedVenueNotes = '';

  // .fromTemplate() method
  //var template = ''; //<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello from the </ion-content></ion-popover-view>';

  
  $scope.clearClipboardNotes = function() {
    console.log("Clearing Venue Notes");
    console.log("Current note value: " + document.getElementById("detectedVenueNotes").value);
    document.getElementById("detectedVenueNotes").value = '';
    console.log("New note value:     " + document.getElementById("detectedVenueNotes").value);
  };

  $scope.addedVenueNames = [];
  $scope.saveDetectedVenues = function() {
    console.log("Saving selected venues...");
    
    //console.log("addedVenueCount:" + addedVenueCount);
    for (var i=0, len=$scope.selectedVenues.length; i<len; i++) {
      console.log("Creating venue from: " + $scope.selectedVenues[i].foursquare_url);
      var extractVenueFromUrlPromise = VenueService.extractVenueFromUrl($scope.selectedVenues[i].foursquare_url);

      $scope.detectedVenueNotesText = document.getElementById("detectedVenueNotes").value;


      //var secs = i * 1;
      //console.log ("seconds: " + secs);

      extractVenueFromUrlPromise.then(function(response) {
        //!!! harcoded in foursquare for source and url for now--should get these from the original call
        var venue = VenueService.createVenue(response, 'http://', 'foursquare');

        venue.page.url = 'https://foursquare.com/v/' + venue.source_id;
        venue.page.note =  $scope.detectedVenueNotesText;
        venue.setPostParameters();

        //Set current city to the last city added 
        /*
        if (venue.city != undefined && venue.city.length > 0) {
          VenueService.setCity(venue.city);
        }
        */

        //doSetTimeout(secs);
        console.log(">>>>> About to save venue to server...");
        console.log("  url: " + venue.page.url); 
        console.log("  note: " + venue.page.note); 
        var serverResponsePromise = VenueService.sendToServer(venue.post_params, ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId());
        serverResponsePromise.then(function(serverResponse) {
          console.log(">>> serverResponse: ");
          console.log(serverResponse);
          console.log(serverResponse['venue_name']);
          $scope.addedVenueNames.push(serverResponse['venue_name']);
          //console.log("$scope.addedVenueCount: " + $scope.addedVenueCount);
        });
        

      });
    }

    //console.log("$scope.selectedVenues.length: " + $scope.selectedVenues.length);

    $timeout(function() {
        ClipboardService.setThreadStatus(false);
        VenueService.setForceRefreshVenues(true);

        ClipboardService.setAddedClipboardData(ClipboardService.data.extractedClipboardData);
        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $scope.popover.remove();
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        //$state.go('app.redirector', {}, {});

        
    }, $scope.selectedVenues.length * 100  );


  };

  //using?
  function doSetTimeout(secs) {
    setTimeout(function() { 
      console.log("timeout is ...." + secs);
     }, secs);
  }

  $scope.toggleSelection = function toggleSelection(venue) {
    var idx = $scope.selectedVenues.indexOf(venue);

    // is currently selected
    if (idx > -1) {
      $scope.selectedVenues.splice(idx, 1);
    }
    // is newly selected
    else {
      $scope.selectedVenues.push(venue);
    }

    console.log("Selected venues:");
    console.log($scope.selectedVenues);
    //$scope.addedVenueCount = $scope.selectedVenues.length;
    //console.log("$scope.addedVenueCount toggle selection: " + $scope.addedVenueCount );
    /*$timeout(function() {
        console.log("Current notes: " + document.getElementById("detectedVenueNotes").value)
    }, 0);*/
  };

  $scope.openPopover = function($event) {
    console.log("Opening Popup...");
    //debugger;
    //console.log("Event for the popover: ");
    //console.log($event);
    console.log("scope id: " + $scope.$id);
    $scope.popover.show($event);
    console.log("--------------------");
  };

  $scope.closePopover = function() {
    console.log("Closing Popup...");
    console.log("scope id: " + $scope.$id);

    ClipboardService.setIgnoredClipboardData(ClipboardService.data.extractedClipboardData);
    $scope.venueFromReviewSourceName = "";
    $scope.displayUrl = "";
    $scope.additionalVenueNotes = "";
    ClipboardService.setThreadStatus(false);
    //$scope.popover.hide();
    $scope.popover.remove();
  };

  //Destroy popover and interval service if we're leaving the view
  /*
  $scope.$on('$stateChangeStart', function(e) {
    console.log("CLIPBOARD: $stateChangeStart");
    if (typeof intervalPromise != 'undefined' && intervalPromise) {
      $interval.cancel(intervalPromise);
      ClipboardService.setServiceStatus(false);
    }
    //$scope.popover.remove();
  });
  */

 $scope.cancel = function() {
    $interval.cancel($scope.intervalPromise);
    ClipboardService.setServiceStatus(false);
  }

  //Destroying when we leave the view
  $scope.$on('$destroy', function() {
    console.log("CLIPBOARD: $destroying");
    $scope.cancel();

    /*
    if(intervalPromise ) {
      $interval.cancel(intervalPromise);
      ClipboardService.setServiceStatus(false);
    }
    */
    // Added bc ionic is not firing beforeleave with tabs
    //console.log("scope id: " + $scope.$id);
    //$scope.popover.remove();
    //$scope.popover.remove();

  });
  
  /*
  $scope.$on('popover.hidden', function() {
    console.log("CLIPBOARD popover.hidden");
    //$scope.popover.hide();
  });
  $scope.$on('popover.removed', function() {
    console.log("CLIPBOARD popover.removed");
    //$scope.popover.remove();
  });
  */
  


  // --------------------------------------------------------------------------------
  // Detect if an item has been pasted to the clipboard

   $scope.$on('$ionicView.beforeEnter', function(e) {
    ClipboardService.setThreadStatus(false);
    console.log("service status: "+ ClipboardService.data.isServiceActive);
    if (ClipboardService.data.isServiceActive == false) {
      console.log("Starting clipboard monitoring...");
      ClipboardService.setServiceStatus(true);
      $scope.intervalPromise = $interval(checkClipboard, 1 * 1000);
    }
  });


  function checkClipboard () {  

    // If another thread is still running in the background, don't initiate the process
    //console.log("thread status: "+ ClipboardService.data.isThreadActive);
    if (ClipboardService.data.isThreadActive == false) {
      
      console.log("Checking clipboard...");
      //console.log("  addedClipboardData: " + ClipboardService.data.addedClipboardData);
      //console.log("  ignoredClipboardData: " + ClipboardService.data.ignoredClipboardData);
      //console.log("  extractedClipboardData: " + ClipboardService.data.extractedClipboardData);
      
      try {
        //throw "Throwing on purpose...";
        $cordovaClipboard
          .paste()
          .then(function (copiedText) {
                //console.log("  copiedText: " + copiedText);

              if (copiedText && ClipboardService.data.addedClipboardData != copiedText 
                             && ClipboardService.data.ignoredClipboardData != copiedText 
                             && ClipboardService.data.extractedClipboardData != copiedText) {
                  console.log("Found new data in clipboard: " + copiedText);                  
                  classifyCopiedText(copiedText);
              } else {
                  //console.log("No copied text detected");
              }
          }, function (err) {
              console.log("Error: " + err);
          });
      } catch(err) {
        //console.log ("...Could not read the clipboard"); 
        copiedText = '';

        // Testing for Web browser
        // --------------------------------------------------
        
        copiedText = 'https://www.tripadvisor.com/Restaurant_Review-g60713-d360064-Reviews-Tartine_Bakery-San_Francisco_California.html';
        copiedText = "https://www.tripadvisor.com/Restaurant_Review-g32655-d1380148-Reviews-Wurstkuche-Los_Angeles_California.html?m=19904";
        copiedText = "https://www.tripadvisor.com/Restaurant_Review-g60713-d357156-Reviews-San_Tung-San_Francisco_California.html";
        //copiedText = "Mastro's Ocean Club \n This seaside outlet of the popular steakhouse has some of the most pristine views in Malibu. While the steaks won't necessarily cater to the dry-aging set, the wet-aged examples here are tender, flavorful, and crowd pleasing. The suave service and familiar fare makes this an easy-to-recommend spot for anyone looking for an ocean-view restaurant in Malibu."
        //copiedText = "A burrito is a taco, don't forget. ... Kogi Taqueria Palms. Added: Tacos El Karnal, Burritos La Palma, Petty Cash, Kogi Taqueria El Segundo"
        //copiedText = "5 Gjusta  \n Verve Coffee Roasters \n Is there a better day-time eatery than Gjusta at the moment? Except for the paucity of seating, the fare coming out of the massive kitchen and ovens is impressive from beginning to end, starting with the pastries, breads, and sweets. The smoked fish is some of the best in town while the breakfast offers everything from pork sausage and eggs to flatbread pizzas. For lunch, try a prime rib, porchetta, or banh mi sandwich, which comes loaded with house-made pate.";
        //copiedText = "https://www.yelp.com/biz/pizzeria-mozza-los-angeles";
        //copiedText = "Make sure to eat pasta at Padella, get the matcha soft serve at Tombo, and get the chai and breakfast at Dishoom";
        //copiedText ="Tartine Bakery makes some amazing bread pudding. Rhea's Deli has great sandwiches"
        //copiedText ="I love fried Chicken sando at Bakesale betty. shandong restaurant is great too for chinese";
        copiedText = "Get the dry fried chicken wings at San Tung. Saigon Sandwiches has amazing banh mis. The kouign amanns at B Patisserie are to DIE for"
        copiedText = "Intellientsia Coffee Silver Lake has amazing coffee";
        copiedText = "https://www.yelp.com/biz/rickys-fish-tacos-los-angeles-3";
        copiedText = "2. Special Dumplings. Shan Dong Restaurant (Chinatown) 3. Louisiana BlueCrab & Lobster Thermidor. Pican (Uptown) 4. Tacos Al Pastor. Tacos Mi Rancho";

        //console.log("  addedClipboardData: " + ClipboardService.data.addedClipboardData);
        //console.log("  ignoredClipboardData: " + ClipboardService.data.ignoredClipboardData);
        //console.log("  extractedClipboardData: " + ClipboardService.data.extractedClipboardData);
        //console.log("  copiedText: " + copiedText);

        //copiedText = "https://www.yelp.com/biz_photos/1CkTVogrU7pmy4pkEFIubw?select=fUYM8vA84pHxQdoedWYgug&utm_source=ishare&utm_content=photo&utm_campaign=psb_sq";
        //copiedText = "https://www.yelp.com/biz_photos/bUr4iq2mKKiBOu2HKynylg?select=ImvLt9I8ACHwfYthZw8vVw&utm_source=oshare&utm_content=photo&utm_campaign=psb_sq";
        //copiedText = 'https://www.yelp.com/biz/1CkTVogrU7pmy4pkEFIubw';
        //copiedText = "https://www.yelp.com/biz/scoops-los-angeles";
        //copiedText = "http://4sq.com/OJDpF2";
        //copiedText = "https://www.yelp.com/biz_photos/the-mill-san-francisco?select=Yd2jWpWpogSW23m12O0hIg";
        //copiedText = "https://www.yelp.com/biz/the-mill-san-francisco";
        //copiedText = "https://www.yelp.com/biz/won-kok-restaurant-los-angeles?uid=aP9ItssHKgjX2UaddWfRrA&utm_source=ishare&utm_medium=s_nb_";
        

        if (copiedText && ClipboardService.data.addedClipboardData != copiedText
                       && ClipboardService.data.ignoredClipboardData != copiedText
                       && ClipboardService.data.extractedClipboardData != copiedText) {
            console.log("Found new data in clipboard: " + copiedText);
            classifyCopiedText(copiedText);
        } else {
            //console.log("No new clipboard data found")
        }
        
        
         
        // --------------------------------------------------
        
      }
    }
  }


  function classifyCopiedText(copiedText) {

    console.log("Classifying copied text...");
    var tmd = new TextMetaData(copiedText);
    tmd.findFirstUrl();
    tmd.detectVenueSource();
    //!!! Ideally, I should detect the final url versus the short linke. We'll keep these seperate for now
    tmd.final_url = tmd.original_url; 

    //If there is a url, trigger the popup, visit the destination and parse information from it
    if (tmd.original_url) {
      ClipboardService.setThreadStatus(true);
      ClipboardService.setExtractedClipboardData(copiedText);

      //Trigger Popup. User can add withut notes, add with notes, or ignore
      $timeout(function() {
        $scope.displayUrl = tmd.display_url;
        $scope.venueFromReviewSourceName = "";
        $scope.image_url = "";
      }, 0);
      console.log("Displaying url in popup: " + tmd.display_url);

      //Trigger Popup
      console.log("ionicPopover: clipboardPopup");
      $ionicPopover.fromTemplateUrl('clipboardPopup', {
          scope: $scope
        }).then(function(popover) {
          //console.log("scope id before if statement: " + $scope.$id);
          //if (!$scope.popover) {
          $scope.popover = popover;
          //}
           $timeout(function() {
              console.log("--- About to trigger popup reviewVenuePopupButton");
              console.log("scope id: " + $scope.$id);
              //console.log("all scopes:");
              //console.log(getScopes());
              angular.element(document.getElementById('reviewVenuePopupButton')).triggerHandler('click');
            }, 0);
      });

     

      //Query supported sources to extract information
      if (tmd.source == 'tripadvisor' || tmd.source == 'foursquare' || tmd.source == 'yelp') {     
        console.log("Getting data from copied url...");

        if (tmd.source == 'yelp' && tmd.original_url.indexOf("biz_photos") >=0) {
          //https://www.yelp.com/biz_photos/1CkTVogrU7pmy4pkEFIubw?select=fUYM8vA84pHxQdoedWYgug&utm_source=ishare&utm_content=photo&utm_campaign=psb_sq
          console.log("Detected yelp image url. Saving image ");

          var image_url = YelpVenue.generateImageUrlFromBizPhotoURL(tmd.original_url);
          $timeout(function() {
            $scope.image_url = image_url;
          }, 0);

          tmd.original_url = YelpVenue.generateVenueUrlFromBizPhotoURL(tmd.original_url);
          console.log("- new venue url: " + tmd.original_url);
        }

        var extractVenueFromUrlPromise = VenueService.extractVenueFromUrl(tmd.original_url);  
        extractVenueFromUrlPromise.then(function(response ) {
          $scope.venue = VenueService.createVenue(response, tmd.original_url_without_querystring, tmd.source);

          //Attempt to get source name 2x
          $timeout(function() {
            $scope.venueFromReviewSourceName = $scope.venue.name;
          }, 1000);
          $timeout(function() {
            $scope.venueFromReviewSourceName = $scope.venue.name;
          }, 3000);
           $timeout(function() {
            $scope.venueFromReviewSourceName = $scope.venue.name;
          }, 5000);

          //$scope.image_url = $scope.venue.page.image_url;
          $scope.venue.page.image_url = $scope.image_url;

        });

        
      }
    } else {

      // Look for potential venues in text. If spotted, hit foursquare api to verify them.
      // Then allow end users to add venues 
      console.log("No url in text found... Sending to server and will attempt to detect venues");
      ClipboardService.setThreadStatus(true);
      ClipboardService.setExtractedClipboardData(copiedText);

      var potentialVenuesPromise = TextApi.analyze(ApiService.server.url, copiedText, LoginService.getUserId());
      $scope.copiedText = copiedText;

      $scope.analyzedVenues = new Array();
      potentialVenuesPromise.then(function(potential_venues) {  
        console.log("NPP Tokens: " + potential_venues);
        $scope.analyzedFoursquareVenues = new Array();
        if (potential_venues.length > 0) {
          for (var i=0, len=potential_venues.length; i<len; i++) {
            var detectedVenuePromise = VenueApi.search(ApiService.server.url, potential_venues[i], $scope.selectedCity);
            detectedVenuePromise.then(function(detected_venues) {  
              $scope.hasFoundVenues = true;
              if (detected_venues.length > 0) {
                //console.log("Found real foursquare venues: " );
                //console.log(detected_venues);
                max_venues_to_return_per_token = 1;
                max_venues_to_return_overall = 6;
                for (var i=0, len=detected_venues.length; i<Math.min(len,max_venues_to_return_per_token); i++) {
                  if (detected_venues[i].foursquare_reviews >= 1 && i <= max_venues_to_return_overall) {
                    $scope.analyzedVenues.push(detected_venues[i]);
                  }
                }
              }
            });
          }
        }
      });

      //Trigger Popup
      console.log("ionicPopover: clipboardDetectVenuePopup");
      $ionicPopover.fromTemplateUrl('clipboardDetectVenuePopup', {
          scope: $scope
        }).then(function(popover) {
          $scope.selectedCity = VenueService.data.city;
          $scope.popover = popover;
          $scope.selectedVenues = new Array();

          $timeout(function() {
            console.log("About to trigger popup potentialVenuePopupButton");
            //console.log(document.getElementById('potentialVenuePopupButton'));
            //console.log("scope id: " + $scope.$id);
            angular.element(document.getElementById('potentialVenuePopupButton')).triggerHandler('click');
            document.getElementById("detectedVenueNotes").value = $scope.copiedText;
          }, 0);
          
      });

    }
  }



  $scope.addClipboardData = function () {
      console.log("Adding clipboard data from url: " + $scope.displayUrl);
      
      var note = document.getElementById("additionalVenueNotes").value;
      $scope.venue.page.note = note;
      console.log("  with notes: " + $scope.venue.page.note);

      ClipboardService.setAddedClipboardData(ClipboardService.data.extractedClipboardData);
      
      //Post the venue to the server, return user to venue listings, and reload venues

      var isVenueUrl = true;
      if (isVenueUrl) {
        $scope.venue.setPostParameters();
        //console.log("note after: " + $scope.venue.page.note);

        VenueService.sendToServer($scope.venue.post_params, ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId());

        //Force Venues to refresh, and set current city to the city view that was just added, if possible
        VenueService.setForceRefreshVenues(true);
        /*
        if ($scope.venue.city != undefined && $scope.venue.city.length > 0) {
          VenueService.setCity($scope.venue.city);
        }
        */

        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $scope.closePopover();
        $timeout(function() {
          $state.go('app.redirector', {}, {});
        }, 2500);

        //$window.location.reload();
        /*$state.transitionTo($state.current, $stateParams, { 
          reload: true, inherit: true, notify: true
        });*/
      }
  };

})  



.controller('AccountCtrl', function($scope, $http, $q, $ionicPlatform, ApiService, config, $ionicPopover) {
  $scope.$on('$ionicView.beforeEnter', function(e) {
      console.log("Entering AdminCtrl...")
  });
})

.controller('AdminCtrl', function($scope, $http, $q, $ionicPlatform, ApiService, config, $ionicPopover) {

  $scope.$on('$ionicView.beforeEnter', function(e) {
      console.log("Entering AdminCtrl...")
      
  });


  


  // --------------------------------------------------------------------------------

  // Allows End User to Change the Server URL
  $scope.api_servers = config.api_servers;
  $scope.changeApiServer = function (new_api_server_name) {
    ApiService.setApiServer(new_api_server_name);

    //Hit itlyst.com to wake up heroku unpaid version =D
    if (new_api_server_name == 'prod') {
      $http.get('http://www.itlyst.com/api/v1/cities').then(function(response) {
        console.log("Got response from heroku");
      });
    }
  }
})

.controller('VenueSearchCtrl', function($scope, $http, $q, VenueService, VenueApi, ApiService, LoginService, $timeout, config, $ionicHistory, $location, $state) {

  // --------------------------------------------------------------------------------
   $scope.$on('$ionicView.beforeEnter', function(e) {
      console.log("Entering VenueSearchCtrl...")
      $scope.zoom_options = VenueService.data.zoom_options;
      $scope.city_selected = VenueService.data.city;
      $scope.zoom_selected = VenueService.data.zoom;
      $scope.venue_type_options = VenueService.data.venue_type_options;
      $scope.venue_type_selected = VenueService.data.venue_type;
      $scope.sort_by_options = VenueService.data.sort_by_options;
      $scope.sort_by_selected = VenueService.data.sort_by;
  });



  // --------------------------------------------------------------------------------
  // Search And Add Venue from App
  $scope.getVenues = function (query) {
    if (query) {
      var temp_data = [];
      var defer = $q.defer();

      var detectedVenuePromise = VenueApi.search(ApiService.server.url, query, VenueService.data.city);
      detectedVenuePromise.then(function(venues) {
        //console.log(venues);
        temp_data = { items: venues };
        defer.resolve(temp_data);
      });
      return defer.promise;
    }      
  };

  $scope.venueClicked = function (callback) {
      $scope.clickedValueModel = callback;
      console.log(callback);
      $scope.venue_selected = callback.item.name;
      //VenueSearchCtrl.$render();
      console.log("Venue Selected: " + $scope.venue_selected);
      console.log(callback.item);
      $scope.venueClickedUrl = callback.item.foursquare_url;

  };
 
  //Add that Venue
  $scope.addVenueAndNote = function () {
      console.log("Adding venue and note...");

      var extractVenueFromUrlPromise = VenueService.extractVenueFromUrl($scope.venueClickedUrl);

      extractVenueFromUrlPromise.then(function(response) {
        //console.log("Extracted venue data. Now adding to server...");
        //console.log(">>>>>>>>>>>>>>>>>>>>>>>>")
        //console.log(response);
        
        var venue = VenueService.createVenue(response, 'http://', 'foursquare');

        venue.page.url = $scope.venueClickedUrl;
        venue.page.note =  document.getElementById("optionalVenueNotes").value;
        venue.setPostParameters();

        //Set current city to the last city added 
        /*
        if (venue.city != undefined && venue.city.length > 0) {
          VenueService.setCity(venue.city);
        }
        */

        //doSetTimeout(secs);
        console.log(">>>>> About to save note to server...");
        console.log("  url: " + venue.page.url); 
        console.log("  note: " + venue.page.note); 
        VenueService.sendToServer(venue.post_params, ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId());

        $timeout(function() {
          VenueService.setForceRefreshVenues(true);
          $state.go('app.redirector', {}, {});
        }, 2000);
        

      });
  }
  

  // --------------------------------------------------------------------------------
  // Search City
  $scope.model = "";
  $scope.clickedValueModel = "";
  $scope.removedValueModel = "";

  //!!! copied and pasted function, should probably create a service instead
  $scope.getCities = function (query) {
    if (query) {
      var cities = [];
      var defer = $q.defer();
      var city_query_url = ApiService.server.url + '/api/v1/cities?q=' + query;
      $http.get(city_query_url).success(function(response){
        cities = { items: response.cities };
        defer.resolve(cities);
      });
      return defer.promise;
    }      
  };

 /*
  $scope.cityClicked = function (callback) {
      $scope.clickedValueModel = callback;
      $scope.city_selected = callback.item.city;

      console.log("City Selected: " + $scope.city_selected);
      VenueService.setCity(callback.item.name);
      VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { //2. so you can use .then()
        VenueService.setVenues(d.data.venues);
      });
  };
  */

  $scope.cityClicked = function (callback) {
      $scope.clickedValueModel = callback;
      $scope.city_selected = callback.item.city;

      console.log("City Selected: " + $scope.city_selected);
      console.log("Google Place Id : " + callback.item.google_place_id);

      //Set the city name
      VenueService.setCity(callback.item.city);

      //Once the city name is set, find the lat long, then update the venue locations
      VenueService.getLatLngFromGooglePlaceId(callback.item.google_place_id, ApiService.server.url).async().then(function(d) { 
        VenueService.setLatitude(d.data.city.latitude);
        VenueService.setLongitude(d.data.city.longitude);
        VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { 
          VenueService.setVenues(d.data.venues);
        });
      }); 
  };


  // --------------------------------------------------------------------------------
  // Search City
  $scope.go = function ( path ) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $location.path( path );
    //$state.go('app.venues', {}, {});
  };

 
})



.controller('FiltersCtrl', function($scope, $http, $q, VenueService, ApiService, LoginService, LocationService, $timeout, config, $ionicHistory, $location, $state) {

  // --------------------------------------------------------------------------------
   $scope.$on('$ionicView.beforeEnter', function(e) {
      console.log("Entering FiltersCtrl...")
      $scope.zoom_options = VenueService.data.zoom_options;
      $scope.city_selected = VenueService.data.city;
      $scope.zoom_selected = VenueService.data.zoom;
      $scope.venue_type_options = VenueService.data.venue_type_options;
      $scope.venue_type_selected = VenueService.data.venue_type;
      $scope.sort_by_options = VenueService.data.sort_by_options;
      $scope.sort_by_selected = VenueService.data.sort_by;

  });


   //End User Selects Find Current Location from the search panel instead of selecting a city
  $scope.setCurrentLocation = function() {

    var LatLongPromise = LocationService.getLatLongFromIPAddress();
    LatLongPromise.then(function(response) {
      $scope.city_selected = 'Current Location'; 
      VenueService.setCity("Current Location");
      VenueService.setLatitude(LocationService.data.latitude);
      VenueService.setLongitude(LocationService.data.longitude);

      VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { //2. so you can use .then()
        VenueService.setVenues(d.data.venues);
      });
    });
  }

  $scope.changeSort = function (sort_by) {
    console.log("User selected: " + sort_by);

    VenueService.setSortBy(sort_by);
    VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { //2. so you can use .then()
      VenueService.setVenues(d.data.venues);
    });

  }

  $scope.go = function ( path ) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    
    $timeout(function() {
      $state.go('app.redirector', {}, {});
    }, 2000); 
  };

 
  $scope.model = "";
  $scope.clickedValueModel = "";
  $scope.removedValueModel = "";



  //!!! Terrible hack, but can't figure out how to use binding for selects w/angular and ionic
  $scope.toggleUserRating = function (event) {
    var user_rating_value = event.target.id;

    var iconElem = angular.element(document.getElementById(user_rating_value));
    var divElem = angular.element(document.getElementById("ur" + user_rating_value));

    // If the selected class is present, then remove the class and remove it from the
    // scope. Otherwise add it to the scope and the element
    if(iconElem[0].className.indexOf("selected") >= 0) {
      iconElem.removeClass('selected');
      divElem.removeClass('selected');
      VenueService.removeUserRatingFilter(user_rating_value);
    } else {
      iconElem.addClass('rating-icon selected');
      divElem.addClass('user-rating selected');
      VenueService.addUserRatingFilter(user_rating_value);
    }

    console.log("Saved filters are: ");
    console.log(VenueService.data.user_ratings_filter);

    VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { //2. so you can use .then()
      VenueService.setVenues(d.data.venues);
    });
    

  }



  // --------------------------------------------------------------------------------
  // Return List of Cities for Searchability

  $scope.getCities = function (query) {
    if (query) {
      var cities = [];
      var defer = $q.defer();
      var city_query_url = ApiService.server.url + '/api/v1/cities?q=' + query;
      $http.get(city_query_url).success(function(response){
        cities = { items: response.cities };
        defer.resolve(cities);
      });
      return defer.promise;
    }      
  };

  $scope.citiesClicked = function (callback) {
      $scope.clickedValueModel = callback;
      $scope.city_selected = callback.item.city;
      console.log("City Selected: " + $scope.city_selected);
      console.log("Google Place Id : " + callback.item.google_place_id);

      //Set the city name
      VenueService.setCity(callback.item.city);

      //Once the city name is set, find the lat long, then update the venue locations
      VenueService.getLatLngFromGooglePlaceId(callback.item.google_place_id, ApiService.server.url).async().then(function(d) { 
        VenueService.setLatitude(d.data.city.latitude);
        VenueService.setLongitude(d.data.city.longitude);
        VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { 
          VenueService.setVenues(d.data.venues);
        });
      }); 
  };

  $scope.changeZoom = function (distance) {
      VenueService.setZoom(distance);
      VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader(), LoginService.getUserId()).async().then(function(d) { 
        VenueService.setVenues(d.data.venues);
      });
  };    
})

.controller('UserProfileCtrl', function($scope, $http) {
  $scope.userprofile = {
    "name": 'John Marsland',
    "email": 'john@marsland.org',
    "fav_food": 'Butter'
  }
}) 



.controller('RedirectorCtrl', function($scope, $ionicModal, $timeout, $q, $ionicPlatform, $ionicHistory, config, $location, $state) {
  $scope.$on('$ionicView.enter', function(e) {
    console.log("Redirecting to venues...");
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.venues', {}, {});
  });
});



