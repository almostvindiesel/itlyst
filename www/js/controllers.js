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

  console.log("Loading app controller...");

  //----------------------------------------------------------------


  //Login on startup of the app
  LoginService.init();
  LoginService.login(ApiService.server.url);


  //----------------------------------------------------------------

  

  




  //----------------------------------------------------------------

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
  };$timeout(function() {
      $scope.closeSignup();
  }, 1000);

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



})



.controller('StartCtrl', function($scope, $ionicModal, $ionicPlatform, config, VenueService, ApiService, LoginService, $ionicHistory, $location, $q, $http, $base64, $timeout) {

// ------------------------------------------------------------------------------------------------------
// Login Component of the Controller


$scope.$on('$ionicView.enter', function(e) {
    $scope.loginData = {'email': LoginService.getEmail(), 'password': LoginService.getPassword()};
    $scope.login_button_message = "Log in";
    $scope.login_error_message = "";
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
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };$timeout(function() {
     $scope.closeLogin();
  }, 1000);

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
        $scope.login_button_message = "Success";
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);
        
      } else {
        console.log("User NOT logged in");
        $scope.login_button_message = "Log in";
        $scope.login_error_message = "Ruh roh. Something went wrong. Try again?";

      }
    });
    

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


    // Same as filters--should abstract
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

  // Same as filters--should abstract
  $scope.citiesClicked = function (callback) {
    $scope.clickedValueModel = callback;
    $scope.city_selected = callback.item.name;

    console.log("City Selected: " + $scope.city_selected);
    VenueService.setCity(callback.item.name);
    VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader()).async().then(function(d) { //2. so you can use .then()
      VenueService.setVenues(d.data.venues);
    });


   $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $location.path( 'app/venues' );

  };


})

.controller('MapCtrl', function($scope, $ionicLoading, $compile, VenueService, ApiService, LoginService) {

  console.log("Loaded map ctrl");

  $scope.$on('$ionicView.enter', function(e) {
      console.log("Entered view...");

    if (VenueService.data.venues.length <=0) {
        $scope.venues = VenueService.data.venues;
        initialize();
    } else {
      VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader()).async().then(function(d) { 
        $scope.venues = d.data.venues;
        VenueService.setVenues($scope.venues);
        console.log("Got venues: " + $scope.venues.length);
        initialize();
      });
    }
      
  });

  function initialize() {
      console.log("MapCtrl initializing...");

      google.maps.event.addDomListener(window, 'load', initialize);

      var map = new google.maps.Map(document.getElementById("map"),
          mapOptions);
      var infowindow;

      infowindow = new google.maps.InfoWindow();


      console.log("Adding " + $scope.venues.length + " venues to the map...");
      for (var i=0, len=$scope.venues.length; i<len; i++) {
        var bounds = new google.maps.LatLngBounds();
        var latlng = new google.maps.LatLng($scope.venues[i].latitude, $scope.venues[i].longitude);
        var marker = new google.maps.Marker({
            position: latlng,
            //label: venues[i].name,
            map: map
        });

        var mapOptions = {
          center: latlng,
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // Show Venue Name on Click
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
          return function () {
            var gmapUrl ="http://www.google.com/maps/search/"+$scope.venues[i].name+"/@"+$scope.venues[i].latitude+","+$scope.venues[i].longitude+"/14z";
            var popUpData = "<b>" + $scope.venues[i].name + "</b><br>";
            popUpData    += "<i class='ion-ios-navigate-outline'></i> <a href='"+gmapUrl+"' target='_system'>Get Directions</i></a>";

            



            infowindow.setContent(popUpData);
            infowindow.open(map, marker);
          }
        })(marker, i));

        bounds.extend(marker.position);

      }

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
    VenueApi.remove(venue_id, ApiService.server.url, LoginService.getLoginHeader());
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

.controller('VenuesCtrl', function($scope, $http, $q, $ionicPlatform, $cordovaClipboard, $timeout, $ionicPopover, VenueService, LoginService, ApiService, NoteApi, $location, $ionicListDelegate, $ionicHistory, $state, $stateParams) {

  // ---------------------------------------------------------------------------------------------------------
  // User cick events which trigger transitions within the tab or outside the tab

  $scope.go_venue_detail = function ($event, path, venueId ) {
    $event.preventDefault();
    $state.transitionTo('app.venue', {
       venueId: venueId
    });
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


  $scope.$on('$ionicView.beforeEnter', function(e) {
    //console.log("before loading...");
    if (VenueService.data.refreshVenues == true) {
      console.log("Refreshing venues from service per request...");
      $scope.venues = [];
      VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader()).async().then(function(d) { 
        $scope.venues = d.data.venues;
        VenueService.setVenues(d.data.venues);
        $scope.isDoneLoading = true;
        VenueService.setForceRefreshVenues(false);
      });
    }
  });


  $scope.$on('$ionicView.enter', function(e) {
    $scope.isDoneLoading = false;

    console.log("Entered venue tab");

    // Retrieve last loaded venues from last data pull
    if ( VenueService.data.venues && VenueService.data.venues.length > 0) {
      console.log("Retrieving venues from service...");
      $scope.venues = [];
      $scope.venues = VenueService.data.venues;
      $scope.isDoneLoading = true;

    // Pull default set of venues
    } else {
      console.log("Retrieving first 50 venues from api since no city was selected");
      VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader()).async().then(function(d) { //2. so you can use .then()
        $scope.venues = d.data.venues.slice(0,49);
        VenueService.setVenues(d.data.venues.slice(0,49));
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
    note = document.getElementById("editVenueNote").value
    console.log("Saving this note: " + note);
    NoteApi.edit($scope.noteIdtoEdit, note, ApiService.server.url, LoginService.getLoginHeader());
    $scope.popover.remove();
    VenueService.setForceRefreshVenues(true);
    $ionicListDelegate.closeOptionButtons();
    console.log("redirecting...");
    $state.go('app.redirector', {}, {});
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
          NoteApi.remove(note_id, ApiService.server.url, LoginService.getLoginHeader());

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
    NoteApi.add($scope.venueIdtoEdit, note, ApiService.server.url, LoginService.getLoginHeader());
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

  

  // -------------------------------------------------------------------------------------
  //console.log(ele);
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
    
    VenueService.setForceRefreshVenues(true);
    ImageApi.remove(image_id, ApiService.server.url, LoginService.getLoginHeader());
    console.log("redirecting...");
    $timeout(function() {
      $state.go('app.redirector', {}, {});
    }, 1500);    
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

  console.log("Loading clipboard popupctrl...");

  // ------------------------------------------------------------------------------------------------ 
  // Changing Detected City
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

  $scope.cancelButtonClickedMethod = function (callback) {
    console.log("Search Cancelled");
    
    //Reset the clipboard service to detect copied text with next refresh
    ClipboardService.setExtractedClipboardData("");
    ClipboardService.setThreadStatus(false);
    //$scope.popover.remove();
    //!!! changed to test to see if this works...
    $scope.popover.hide();
  }

  $scope.citiesClicked = function (callback) {
      $scope.clickedValueModel = callback;
      VenueService.setCity(callback.item.name);
      console.log("City Selected: " + VenueService.data.city);

      //Reset the clipboard service to detect copied text with next refresh
      ClipboardService.setExtractedClipboardData("");
      ClipboardService.setThreadStatus(false);
      $scope.popover.remove();
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

        //doSetTimeout(secs);
        console.log(">>>>> About to save venue to server...");
        console.log("  url: " + venue.page.url); 
        console.log("  note: " + venue.page.note); 
        var serverResponsePromise = sendToServer(venue.post_params, ApiService.server.url, LoginService.getLoginHeader());
        serverResponsePromise.then(function(serverResponse) {
          console.log(">>> serverResponse: ");
          console.log(serverResponse);
          console.log(serverResponse['venue_name']);
          $scope.addedVenueNames.push(serverResponse['venue_name']);
          //console.log("$scope.addedVenueCount: " + $scope.addedVenueCount);
        });
        

      });
    }

    console.log("$scope.selectedVenues.length" + $scope.selectedVenues.length);

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
    console.log("$scope.addedVenueCount toggle selection: " + $scope.addedVenueCount );
    $timeout(function() {
        console.log("Current notes: " + document.getElementById("detectedVenueNotes").value)
    }, 0);
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
        //copiedText = "2. Special Dumplings. Shan Dong Restaurant (Chinatown) 3. Louisiana BlueCrab & Lobster Thermidor. Pican (Uptown) 4. Tacos Al Pastor. Tacos Mi Rancho";


        //console.log("  addedClipboardData: " + ClipboardService.data.addedClipboardData);
        //console.log("  ignoredClipboardData: " + ClipboardService.data.ignoredClipboardData);
        //console.log("  extractedClipboardData: " + ClipboardService.data.extractedClipboardData);
        //console.log("  copiedText: " + copiedText);

        //copiedText = "https://www.yelp.com/biz_photos/1CkTVogrU7pmy4pkEFIubw?select=fUYM8vA84pHxQdoedWYgug&utm_source=ishare&utm_content=photo&utm_campaign=psb_sq";
        //copiedText = "https://www.yelp.com/biz_photos/bUr4iq2mKKiBOu2HKynylg?select=ImvLt9I8ACHwfYthZw8vVw&utm_source=oshare&utm_content=photo&utm_campaign=psb_sq";
        //copiedText = 'https://www.yelp.com/biz/1CkTVogrU7pmy4pkEFIubw';
        //copiedText = "https://www.yelp.com/biz/scoops-los-angeles";
        

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

      var potentialVenuesPromise = TextApi.analyze(ApiService.server.url, copiedText);
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
                for (var i=0, len=detected_venues.length; i<len; i++) {
                  if (detected_venues[i].foursquare_reviews >= 1 && i <= 8) {
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
            console.log("scope id: " + $scope.$id);
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

        sendToServer($scope.venue.post_params, ApiService.server.url, LoginService.getLoginHeader());

        VenueService.setForceRefreshVenues(true);
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

  function sendToServer(parameters, server_url, loginHeader) {
    console.log("Posting venue to server: ");
    console.log("  Server: " + server_url);
    console.log("  Post Params: ");
    //console.log(parameters);
    //console.log($httpParamSerializerJQLike(parameters));
    //console.log( JSON.stringify(parameters));
    console.log( parameters );
    var headers = loginHeader;
    headers['Content-type'] = 'application/json;charset=utf-8';

    return $http({
        method: 'POST',
        url: server_url + '/addnote',
        data: parameters,
        headers: headers
    })
    .then(function(response) {
        console.log("Response: ");
        console.log(response.data);
        return response.data;
    }, 
    function(rejection) { 
        console.log("Rejection: ");
        console.log(rejection);
        return rejection;
    });
  }
})  

.controller('AdminCtrl', function($scope, $http, $q, $ionicPlatform, ApiService, config, $ionicPopover) {

  


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

.controller('FiltersCtrl', function($scope, $http, $q, VenueService, ApiService, LoginService, $timeout, config, $ionicHistory, $location, $state) {


  // --------------------------------------------------------------------------------
   $scope.$on('$ionicView.beforeEnter', function(e) {
      console.log("Entering FiltersCtrl...")
      $scope.zoom_options = VenueService.data.zoom_options;
      $scope.city_selected = VenueService.data.city;
      $scope.zoom_selected = VenueService.data.zoom;
      $scope.venue_type_options = VenueService.data.venue_type_options;
      $scope.venue_type_selected = VenueService.data.venue_type;
  });



  $scope.go = function ( path ) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $location.path( path );
    //$state.go('app.venues', {}, {});
  };

 
  $scope.model = "";
  $scope.clickedValueModel = "";
  $scope.removedValueModel = "";


  // --------------------------------------------------------------------------------
  // Return List of Cities for Searchability

  $scope.getCities = function (query) {
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


  $scope.citiesClicked = function (callback) {
      $scope.clickedValueModel = callback;
      $scope.city_selected = callback.item.name;

      console.log("City Selected: " + $scope.city_selected);
      VenueService.setCity(callback.item.name);
      VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader()).async().then(function(d) { //2. so you can use .then()
        VenueService.setVenues(d.data.venues);
      });
  };

  $scope.changeZoom = function (distance) {
      VenueService.setZoom(distance);
      VenueService.extractVenues(ApiService.server.url, LoginService.getLoginHeader()).async().then(function(d) { //2. so you can use .then()
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




