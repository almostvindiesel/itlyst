// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

console.log("Opened app.js");


angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

//Triggers focus on iOS Keyboards (potentially on other devices as well) 

.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {

      $timeout(function() {
        element[0].focus(); 
      });
    }
  };
})


.constant("config", {
  "api_servers": [
    {"name": "local", "url": "http://mars.local:5000"},
    {"name": "prod", "url": "http://www.itlyst.com"},
  ]
})


.value('api_url', 'http://www.itlyst.com')
//.value('api_url', 'http://mars.local:5000')
//.value('api_url', 'http://localhost:5000')


.run(function($ionicPlatform) {
  console.log("Starting ionic ready...");


  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      console.log("Loading keyboard plugin settings...");
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    console.log("Completed ionicPlatform.ready...");

  });
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })


  .state('app.filters', {
    url: '/filters',
    views: {
      'menuContent': {
        templateUrl: 'templates/filters.html',
        controller: 'FiltersCtrl'
      }
    }
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'UserProfileCtrl'
      }
    }
  })

  .state('app.venues', {
    url: '/venues',
    views: {
      'menuContent': {
        templateUrl: 'templates/venues.html',
        controller: 'VenuesCtrl'
      },
      'popup@venues': { 
          templateUrl: 'templates/popup.html',
          controller: 'PopupCtrl',
          cache: false
      }
    }
  })

  .state('app.venue', {
    url: '/venue/:venueId/detail',
    views: {
      'menuContent': {
        templateUrl: 'templates/venue_detail.html',
        controller: 'VenueDetailCtrl'
      }
    }
  })

  .state('app.redirector', {
    url: '/redirector',
    views: {
      'menuContent': {
        templateUrl: 'templates/redirector.html',
        controller: 'RedirectorCtrl'
      }
    }
  })

  .state('app.start', {
    url: '/start',
    views: {
      'menuContent': {
        templateUrl: 'templates/start.html',
        controller: 'StartCtrl'
      },
      'popup@start': { 
          templateUrl: 'templates/popup.html',
          controller: 'PopupCtrl',
          cache: false
      }
    }
  })

  .state('app.image', {
    cache: false,
    url: '/image/:imageId',
    views: {
      'menuContent': {
        templateUrl: 'templates/images.html',
        controller: 'ImageCtrl'
      }
    }
  })

  .state('app.admin', {
    url: '/admin',
    views: {
      'menuContent': {
        templateUrl: 'templates/admin.html',
        controller: 'AdminCtrl'
      },
      'popup@admin': { 
          templateUrl: 'templates/popup.html',
          controller: 'PopupCtrl',
          cache: false
      }
    }
  })

  .state('app.pages', {
    url: '/pages',
    views: {
      'menuContent': {
        templateUrl: 'templates/pages.html'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/start');
});

// --------------------------------------------------------------------
// Services

(function(){
  function ClipboardService(config) {

    var data = {
      addedClipboardData: "",
      ignoredClipboardData: "",
      extractedClipboardData: "",
      isServiceActive: false,
      isThreadActive: false
    };


    function setAddedClipboardData(dat){
      data.addedClipboardData = dat;
    }

    function setIgnoredClipboardData(dat){
      data.ignoredClipboardData = dat;
    }

    function setExtractedClipboardData(dat){
      data.extractedClipboardData = dat;
    }

    function setExtractedClipboardData(dat){
      data.extractedClipboardData = dat;
    }

    function setServiceStatus(bol){
      data.isServiceActive = bol;
    }
    function setThreadStatus(bol){
      data.isThreadActive = bol;
    }

    return {
      setAddedClipboardData: setAddedClipboardData,
      setIgnoredClipboardData: setIgnoredClipboardData,
      setExtractedClipboardData: setExtractedClipboardData,
      setServiceStatus: setServiceStatus,
      setThreadStatus: setThreadStatus,
      data: data
    };
  }

  function ApiService($http, config, api_url) {

    var server = {
      name: 'local',
      url: api_url,
    };

    function setApiServer(api_server_name){
      console.log("Setting api server ....");
      for (var i = 0, len = config.api_servers.length; i < len; i++) {
        if(config.api_servers[i].name == api_server_name) {
            server.name = config.api_servers[i].name;
            server.url  = config.api_servers[i].url;
            console.log("New API Server is: " + config.api_servers[i].name + " with url: " +  config.api_servers[i].url)
        }
      }
    }

    return {
      setApiServer: setApiServer,
      server: server
    };
  }



  function VenueService($http, config) {

    var zoom_options = [1, 3, 5, 10, 25, 50];
    var venue_type_options = [ 'food', 'place', 'coffee', 'all' ]
    

    var data = {
      venues: {},
      zoom_options: zoom_options,
      zoom: 50,
      venue_type_options: venue_type_options,
      venue_type: 'all',
      city: 'Los Angeles',
      refreshVenues: false
    };

    // Generates the parameters used to query the api. 
    function generateUrlParameters () {
      var params_obj = data;

      delete params_obj.venues;  
      for (var key in params_obj) {
        if (params_obj[key] == null) {
          delete params_obj[key]; 
        }
      }
      return jQuery.param(params_obj);

    }

    function setForceRefreshVenues(bol){
      console.log("Setting refreshVenues: " + bol);
      data['refreshVenues'] = bol;
    }

    function setCity(val){
      console.log("Setting city: " + val);
      data['city'] = val;
    }
    
    function setZoom(val){
      console.log("Setting zoom: " + val);
      data['zoom'] = val;
    }

    function setVenues(val){
      console.log("Setting venues, count: " + val.length);
      data['venues'] = val;
    }

    function extractVenues(api_url) {
        return {
          async: function() {
            var venue_url = api_url + '/api/v1/venues?' + generateUrlParameters();
            console.log("Querying: " + venue_url);
            return $http.get(venue_url); 
          }
        };
    }


    var extractVenueFromUrl = function (venue_url) {
      console.log("Querying: " + venue_url);
      return $http({
              method: 'GET',
              url: venue_url
          })
          .then(function(response) {
              //console.log(response.data);
              return response.data;
          }, function(rejection) {
              return response;
      });
    }


    function createVenue(response, venue_url, source) {
      console.log("Creating venue: " + venue_url);

      //Set page object
      p = new Page();
      p.url = venue_url;
      p.title = $(response).filter('title').text();

      //Set attributes for supported venue object
      if (source == 'foursquare') {
        v = new FoursquareVenue(p);
      } else if (source == 'yelp') {
        v = new YelpVenue(p);
      } else if (source == 'tripadvisor') {
        v = new TripadvisorVenue(p);
      } else {
        console.log("Unknown source. Just submitting page");
        v = null; 
        // !!! .....
      }

      if (v) {
        console.log("Found venue on " + source + ": " + v.name);
        v.setJQueryDocument(response);
        v.setName();
        setVenueProperties(v, response);
        v.setPostParameters();
        return v;
      }
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
      //add image detected here
      v.findImageOnPage();    //This needs to come before the simplify url call
      v.simplifyPageUrl();
      //v.setCategories();
      //v.setPostParameters();
    }

    return {
      extractVenues: extractVenues,
      extractVenueFromUrl: extractVenueFromUrl,
      createVenue: createVenue,
      setVenues: setVenues,
      setForceRefreshVenues: setForceRefreshVenues,
      setZoom: setZoom,
      setCity: setCity,
      data: data
    };
  } 

  function VenueApi($http, config) {

    function remove(id, api_url) {
      console.log("About to delete venue id: " + id + " on " + api_url);

      $http({
          method: 'DELETE',
          url: api_url + '/api/v1/venue/' + id,
          /*data: {
              user: userId
          },*/
          headers: {
              'Content-type': 'application/json;charset=utf-8'
          }
      })
      .then(function(response) {
          console.log(response.data);
      }, function(rejection) {
          console.log(rejection.data);
      });

    }
  
    //Add a venue note
    function search(api_url, name, city) {
      console.log("About to search for venue name: " + name);

      return $http({
          method: 'POST',
          url: api_url + '/api/v1/venue/search',
          data: {
            name: name,
            city: city       
          }, 
          headers: {
            'Content-type': 'application/json;charset=utf-8'
          }
      })
      .then(function(response) {
          console.log("Foursquare API Response: ");
          console.log(response.data['venues']);
          return response.data['venues'];
      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    return {
      remove: remove,
      search: search
    };
  }

  function ImageApi($http, config) {

    //Remove an image
    function remove(id, api_url) {
      console.log("About to delete image id in server: " + id);

      $http({
          method: 'DELETE',
          url: api_url + '/api/v1/image/' + id,
          headers: {
              'Content-type': 'application/json;charset=utf-8'
          }
      })
      .then(function(response) {
          console.log(response.data);

      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    return {
      remove: remove
    };
  }

  function NoteApi($http, config) {

    //Remove a venue note
    function remove(id, api_url) {
      console.log("About to delete note id in server: " + id);

      $http({
          method: 'DELETE',
          url: api_url + '/api/v1/note/' + id,
          headers: {
              'Content-type': 'application/json;charset=utf-8'
          }
      })
      .then(function(response) {
          console.log(response.data);

      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    //Edit a venue note
    function edit(id, note, api_url) {
      console.log("About to post edited note to server. note id: " + id + ", note: " + note);

      $http({
          method: 'PUT',
          url: api_url + '/api/v1/note/' + id,
          data: {
            note: note
          },
          headers: {
            'Content-type': 'application/json;charset=utf-8'
          }
      })
      .then(function(response) {
          console.log(response.data);
      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    //Add a venue note
    function add(venue_id, note, api_url) {
      console.log("About to post new note note to server. venue id: " + venue_id + ", note: " + note);

      $http({
          method: 'POST',
          url: api_url + '/api/v1/note',
          data: {
            note: note,
            venue_id: venue_id
          },
          headers: {
            'Content-type': 'application/json;charset=utf-8'
          }
      })
      .then(function(response) {
          console.log(response.data);
      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    return {
      remove: remove,
      edit: edit,
      add: add
    };
  }

  function TextApi($http, config) {

    //Add a venue note
    var analyze = function(api_url, text) {
      console.log("About to post text to server: " + text);

      return $http({
          method: 'POST',
          url: api_url + '/api/v1/text',
          data: {
            text: text          
          }, 
          headers: {
            'Content-type': 'application/json;charset=utf-8'
          }
      })
      .then(function(response) {
          console.log("Text API Response: ");
          console.log(response.data['potential_venues']);
          return response.data['potential_venues'];
      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    return {
      analyze: analyze
    };
  }


  angular
    .module('starter')
    .factory('ApiService', ApiService)
    .factory('VenueService', VenueService)
    .factory('ClipboardService', ClipboardService)
    .factory('VenueApi', VenueApi)
    .factory('NoteApi', NoteApi)
    .factory('ImageApi', ImageApi)
    .factory('TextApi', TextApi)

    ;
    

})();
