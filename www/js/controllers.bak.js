angular
  .module('starter.controllers', ['ion-autocomplete', 'ngCordova', 'ionic'])
  .config(function ($httpProvider, $httpParamSerializerJQLikeProvider){
      $httpProvider.defaults.transformRequest.unshift($httpParamSerializerJQLikeProvider.$get());
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
  })

.controller('RedirectorCtrl', function($scope, $ionicModal, $timeout, $q, $ionicPlatform, $ionicHistory, config, $location, $state) {
  $scope.$on('$ionicView.enter', function(e) {
    console.log("Redirecting to venues...");
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.venues', {}, {});
  });
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $q, $ionicPlatform, config) {

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

.controller('PopupCtrl', function($scope, $window, $ionicModal, $timeout, $http, $q, $ionicPlatform, $ionicHistory, $ionicPopover, $cordovaClipboard, 
                                  config, $interval, ClipboardService, $location, $state,
                                  VenueService, ApiService, TextApi, VenueApi) {

  // ------------------------------------------------------------------------------------------------ 
  // Popover for Adding Venues
  console.log("Loading clipboard popupctrl...");
  //console.log("  thread status: "+ ClipboardService.data.isThreadActive);
  //console.log("  service status: "+ ClipboardService.data.isServiceActive);

  // .fromTemplate() method
  var template = ''; //<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello from the </ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
    console.log("Opened Popup...");
    //console.log($event);
    //$scope.popover.show();
    //console.log($event);
  };
  $scope.closePopover = function() {
    console.log("Closing Popup...");

    $scope.popover.hide();
    ClipboardService.setIgnoredClipboardData(ClipboardService.data.extractedClipboardData);
    $scope.venueFromReviewSourceName = "";
    $scope.displayUrl = "";
    $scope.additionalVenueNotes = "";
    ClipboardService.setThreadStatus(false);
  };

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
    $interval.cancel(intervalPromise);
    ClipboardService.setServiceStatus(false);
  });
  $scope.$on('popover.hidden', function() {
    console.log("Hiding Edit Dialog");
  });
  $scope.$on('popover.removed', function() {
    console.log("Removing Edit Dialog");
  });


  // --------------------------------------------------------------------------------
  // Detect if an item has been pasted to the clipboard
  if (ClipboardService.data.isServiceActive == false) {
    console.log("Starting clipboard monitoring...");
    ClipboardService.setServiceStatus(true);
    var intervalPromise = $interval(checkClipboard, 3 * 1000);
  }

  function checkClipboard () {  

    // If another thread is still running in the background, don't initiate the process
    console.log("thread status: "+ ClipboardService.data.isThreadActive);
    if (ClipboardService.data.isThreadActive == false) {
      console.log("Checking clipboard...");
      console.log("  addedClipboardData: " + ClipboardService.data.addedClipboardData);
      console.log("  ignoredClipboardData: " + ClipboardService.data.ignoredClipboardData);
      console.log("  extractedClipboardData: " + ClipboardService.data.extractedClipboardData);
      try {
        $cordovaClipboard
          .paste()
          .then(function (copiedText) {
                console.log("  copiedText: " + copiedText);

              if (copiedText && ClipboardService.data.addedClipboardData != copiedText 
                             && ClipboardService.data.ignoredClipboardData != copiedText 
                             && ClipboardService.data.extractedClipboardData != copiedText) {
                  console.log("Found new data in clipboard: " + copiedText);                  
                  classifyCopiedText(copiedText);
              } else {
                  console.log("No new clipboard data found")
              }
          }, function (err) {
              //console.log("Error: " + err);
          });
      } catch(err) {
        console.log ("...Could not read the clipboard"); 

        // Testing for Web browser
        // --------------------------------------------------
        
        /*
        copiedText = 'https://www.tripadvisor.com/Restaurant_Review-g60713-d360064-Reviews-Tartine_Bakery-San_Francisco_California.html';
        copiedText = "https://www.yelp.com/biz/pizzeria-mozza-los-angeles";
        copiedText = "https://www.tripadvisor.com/Restaurant_Review-g32655-d1380148-Reviews-Wurstkuche-Los_Angeles_California.html?m=19904";
        copiedText = "https://www.tripadvisor.com/Restaurant_Review-g60713-d357156-Reviews-San_Tung-San_Francisco_California.html";
        copiedText = "5 Gjusta \n Is there a better day-time eatery than Gjusta at the moment? Except for the paucity of seating, the fare coming out of the massive kitchen and ovens is impressive from beginning to end, starting with the pastries, breads, and sweets. The smoked fish is some of the best in town while the breakfast offers everything from pork sausage and eggs to flatbread pizzas. For lunch, try a prime rib, porchetta, or banh mi sandwich, which comes loaded with house-made pate.";
        copiedText = "Mastro's Ocean Club \n This seaside outlet of the popular steakhouse has some of the most pristine views in Malibu. While the steaks won't necessarily cater to the dry-aging set, the wet-aged examples here are tender, flavorful, and crowd pleasing. The suave service and familiar fare makes this an easy-to-recommend spot for anyone looking for an ocean-view restaurant in Malibu."
        copiedText = "A burrito is a taco, don't forget. ... Kogi Taqueria Palms. Added: Tacos El Karnal, Burritos La Palma, Petty Cash, Kogi Taqueria El Segundo"
        
        console.log("  addedClipboardData: " + ClipboardService.data.addedClipboardData);
        console.log("  ignoredClipboardData: " + ClipboardService.data.ignoredClipboardData);
        console.log("  extractedClipboardData: " + ClipboardService.data.extractedClipboardData);
        console.log("  copiedText: " + copiedText);

        if (copiedText && ClipboardService.data.addedClipboardData != copiedText
                       && ClipboardService.data.ignoredClipboardData != copiedText
                       && ClipboardService.data.extractedClipboardData != copiedText) {
            console.log("Found new data in clipboard: " + copiedText);
            classifyCopiedText(copiedText);
        } else {
            console.log("No new clipboard data found")
        }
        */
        
    
         
        // --------------------------------------------------
        
      }
    }
  }


  function classifyCopiedText(copiedText) {

    console.log("Classifying copied text...");
    var tmd = new TextMetaData(copiedText);
    tmd.findFirstUrl();
    tmd.detectVenueSource();

    //If there is a url, trigger the popup, visit the destination and parse information from it
    if (tmd.original_url) {
      ClipboardService.setThreadStatus(true);
      ClipboardService.setExtractedClipboardData(copiedText);

      //Trigger Popup. User can add withut notes, add with notes, or ignore
      $timeout(function() {
        $scope.displayUrl = tmd.display_url;
        //$scope.venueFromReviewSourceName = "";
      }, 0);
      console.log("Displaying url in popup: " + tmd.display_url);


      
      //Trigger Popup
      $ionicPopover.fromTemplateUrl('clipboardPopup', {
          scope: $scope
        }).then(function(popover) {
          $scope.popover = popover;
          $timeout(function() {
            angular.element(document.getElementById('reviewVenuePopupButton')).triggerHandler('click');
          }, 0);
      });



      //Query supported sources to extract information
      if (tmd.source == 'tripadvisor' || tmd.source == 'foursquare' || tmd.source == 'yelp') {
        
        console.log("Getting data from copied url...");
        $.get(tmd.original_url_without_querystring, function(response) {
            
            /*
            console.log("Response: ");
            console.log("------------------------------  ------------------------------");
            console.log(response);
            console.log("------------------------------  ------------------------------");
            */
            console.log("Received response from url. Parsing...");

            //!!! Ideally, I should detect the final url versus the short linke. We'll keep these seperate for now
            tmd.final_url = tmd.original_url;    

            p = new Page();
            p.url = tmd.final_url;
            p.title = $(response).filter('title').text();

            //Set Attributes for Each Venue Source
            switch(tmd.source) {
              case 'foursquare':
                v = new FoursquareVenue(p);
                v.setJQueryDocument(response);
                v.setName();
                $scope.$apply(function(){
                  $scope.venueFromReviewSourceName = v.name;
                });
                console.log("Found venue on " + tmd.source + ": " + v.name);
              
                setVenueProperties(v, response);
                v.setPostParameters();
                $scope.venue = v;
                break;
              case 'tripadvisor':
                v = new TripadvisorVenue(p);
                v.setJQueryDocument(response);
                v.setName();
                $scope.$apply(function(){
                  $scope.venueFromReviewSourceName = v.name;
                });
                console.log("Found venue on " + tmd.source + ": " + v.name);

                setVenueProperties(v, response);
                v.setPostParameters();
                $scope.venue = v;
                break;
              case 'yelp':
                v = new YelpVenue(p);
                v.setJQueryDocument(response);
                v.setName();
                $scope.$apply(function(){
                  $scope.venueFromReviewSourceName = v.name;
                });
                console.log("Found venue on " + tmd.source + ": " + v.name);

                setVenueProperties(v, response);
                v.setPostParameters();
                $scope.venue = v;
                break;
              default:
                console.log("Unknown source. Just submitting page");
                //savePageNoteToServer(serverUrl, p);
            }
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
            var current_city = "Los Angeles";
            var detectedVenuePromise = VenueApi.search(ApiService.server.url, potential_venues[i], current_city);
            detectedVenuePromise.then(function(detected_venues) {  
              if (detected_venues.length > 0) {
                console.log("Found real foursquare venues: " );
                console.log(detected_venues);
                for (var i=0, len=detected_venues.length; i<len; i++) {
                  $scope.analyzedVenues.push(detected_venues[i].name);
                }
              }
            });
          }
        }
      });

      //Trigger Popup
      $ionicPopover.fromTemplateUrl('clipboardDetectVenuePopup', {
          scope: $scope
        }).then(function(popover) {
          $scope.popover = popover;
          $timeout(function() {
            angular.element(document.getElementById('potentialVenuePopupButton')).triggerHandler('click');
          }, 0);
      });

      



    }
  }

  $scope.addClipboardData = function () {
      console.log("Adding clipboard data from url: " + $scope.displayUrl);
      $scope.venue.page.note = document.getElementById("additionalVenueNotes").value
      console.log("  with notes: " + $scope.venue.page.note);

      ClipboardService.setAddedClipboardData(ClipboardService.data.extractedClipboardData);
      $scope.closePopover();

      //Post the venue to the server, return user to venue listings, and reload venues
      var isVenueUrl = true;
      if (isVenueUrl) {
        $scope.venue.setPostParameters();
        sendToServer($scope.venue.post_params, ApiService.server.url);

        VenueService.setForceRefreshVenues(true);
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.redirector', {}, {});
        //$window.location.reload();
        /*$state.transitionTo($state.current, $stateParams, { 
          reload: true, inherit: true, notify: true
        });*/
      }
  };

  function sendToServer(parameters, server_url) {
    console.log("Posting venue to server: ");
    console.log("  Server: " + server_url);
    console.log("  Post Params: ");
    //console.log(parameters);
    //console.log($httpParamSerializerJQLike(parameters));
    //console.log( JSON.stringify(parameters));
    console.log( $.param(parameters) );


    $http({
        method: 'POST',
        url: server_url + '/addnote',
        data: parameters
    })
    .then(function(response) {
        console.log("Response: ");
        console.log(response);
    }, 
    function(response) { 
        console.log("Response: ");
        console.log(response);
    });
  }

  function setVenueProperties (v, response) {
    //v.setJQueryDocument(response);
    //v.setName();
    v.setSourceId();
    v.setLatitude();
    v.setLongitude();
    v.setCity();
    v.setRating();
    v.setReviews();
    //v.setCategories();
    //v.setPostParameters();
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

.controller('FiltersCtrl', function($scope, $http, $q, VenueService, ApiService, $timeout, config, $ionicHistory, $location) {


  //console.log("---------------------------- Service");
  //console.log(VenueService.venues);

  // --------------------------------------------------------------------------------
  $scope.zoom_options = [
    '1','3','5','10','25','50' 
  ]
  $scope.venue_options = [
    'food','place',"coffee"
  ]

  $scope.go = function ( path ) {
      $ionicHistory.nextViewOptions({
        disableBack: false
      });
      $location.path( path );
  };

  // --------------------------------------------------------------------------------
  // Return List of Venues
  /*
  $http.get('http://mars-mac.local:5000/api/v1/venues?zoom=10').then(function(response) {
      //console.log(response.data);
      //$scope.venues = response.data.venues;
  });
  */

  $scope.model = "";
  $scope.clickedValueModel = "";
  $scope.removedValueModel = "";
  /*$scope.navTitle = '<i class="button" ><i class="fa-filter"></i> filters</i> &nbsp;&nbsp;&nbsp;&nbsp; \
                     Venues  &nbsp;&nbsp;&nbsp;&nbsp; \
                     <i class="button"><i class="fa-map"></i> map</i>&nbsp;&nbsp;&nbsp;&nbsp; \
                     <i class="button" > <i class="fa-bell"></i> updates</i>';*/


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
      VenueService.extractVenues(ApiService.server.url).async().then(function(d) { //2. so you can use .then()
        VenueService.setVenues(d.data.venues);
      });
  };

  $scope.changeZoom = function (distance) {
      VenueService.setZoom(distance);
      VenueService.extractVenues(ApiService.server.url).async().then(function(d) { //2. so you can use .then()
        VenueService.setVenues(d.data.venues);
      });
  };    
})

.controller('VenuesCtrl', function($scope, $http, $q, $ionicPlatform, $cordovaClipboard, $timeout, $ionicPopover, VenueService, ApiService, NoteApi, $location, $ionicListDelegate, $ionicHistory, $state) {

  // ---------------------------------------------------------------------------------------------------------
  // Listing Venues

  $scope.$on('$ionicView.beforeEnter', function(e) {
    if (VenueService.data.refreshVenues == true) {
      console.log("Refreshing venues from service per request...");
      $scope.venues = [];
      VenueService.extractVenues(ApiService.server.url).async().then(function(d) { 
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
      console.log("Retrieving first 10 venues from api since no city was selected");
      VenueService.extractVenues(ApiService.server.url).async().then(function(d) { //2. so you can use .then()
        $scope.venues = d.data.venues.slice(0,9);
        VenueService.setVenues(d.data.venues.slice(0,9));
        $scope.isDoneLoading = true;
      });
    }
  });

  
  $scope.model = "";
  $scope.clickedValueModel = "";
  $scope.removedValueModel = "";

  $scope.go = function ( path ) {
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    $location.path( path );
  };

  // --------------------------------------------------------------------------------
  // Return List of Venues

  $scope.shouldShowDelete = false;
  $scope.listCanSwipe = true;


  // ---------------------------------------------------------------------------------------------------------
  // General Popup Functions
  $scope.$on('$destroy', function() {
    console.log("Destroying Edit Dialog");
    $scope.popover.remove();
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
    NoteApi.edit($scope.noteIdtoEdit, note, ApiService.server.url);
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
          NoteApi.remove(note_id, ApiService.server.url);

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
    NoteApi.add($scope.venueIdtoEdit, note, ApiService.server.url);
    $scope.popover.remove();
    VenueService.setForceRefreshVenues(true);
    $ionicListDelegate.closeOptionButtons();
    console.log("redirecting...");
    $state.go('app.redirector', {}, {});
  };

  $scope.cancelNewNote = function() {
    console.log("Closing edit dialog not saving");
    $scope.popover.remove();
    $ionicListDelegate.closeOptionButtons();
  };



  
  

  // -------------------------------------------------------------------------------------
  //console.log(ele);

  

})


.controller('UserProfileCtrl', function($scope, $http) {
  $scope.userprofile = {
    "name": 'John Marsland',
    "email": 'john@marsland.org',
    "fav_food": 'Butter'
  }
}) 

.controller('VenueDetailCtrl', function($scope, $http, $location, $state, $stateParams, VenueService, ApiService, VenueApi, $ionicHistory) {

  // ------------------------------------------------------------------------------------------------ 

  $scope.deleteVenue = function (venue_id) {
    VenueService.setForceRefreshVenues(true);
    VenueApi.remove(venue_id, ApiService.server.url);
    console.log("redirecting...");
    //$location.path( 'app.venues' );
    $state.go('app.venues', {}, {});
  };
  

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

.controller('ImageCtrl', function($scope, $http, VenueService, ApiService, $stateParams) {



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




