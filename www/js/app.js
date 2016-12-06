// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.constant("config", {
    //"api_url": "http://mars-mac.local:5000"
    "api_url": "http://localhost:5000"
    //"api_url": "http://itlyst.com"
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
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
      }
    }
  })

  .state('app.single', {
    url: '/venue/:venueId/detail',
    views: {
      'menuContent': {
        templateUrl: 'templates/venue_detail.html',
        controller: 'VenueDetailCtrl'
      }
    }
  })

  .state('app.image', {
    url: '/image/:imageId',
    views: {
      'menuContent': {
        templateUrl: 'templates/images.html',
        controller: 'ImageCtrl'
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

  /*
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
  })

  .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
  })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  */

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/venues');
});

// --------------------------------------------------------------------
// Services

(function(){
  function VenueService($http, config) {

    var venue_base_url = config.api_url + '/api/v1/venue?';
    var data = {
      venues: {},
      zoom: 10,
      city: 'Los Angeles'
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

    function extractVenues() {
        return {
          async: function() {
            var venue_url = venue_base_url + generateUrlParameters();
            console.log("Querying: " + venue_url);
            return $http.get(venue_url); 
            //console.log(response);
            //return response.data; 
          }
        };
    }


/*
      var myService = {
        async: function() {
          var promise = $http.get(venue_url).then(function(response) {
              $timeout(function(){
                setVenues(response.data.venues);
                console.log("Extracted venues. Total Venues: " + data.venues.length);
                return data.venues;
              }, 1000);
          });
          return promise;
        }
      };
      return myService;
    }
*/


    /*
    function setCity(val){
      console.log("Setting city");
      data['city'] = val;
    }*/

    return {
      setVenues: setVenues,
      extractVenues: extractVenues,
      setZoom: setZoom,
      setCity: setCity,
      data: data
      //city: data.city*/
    };
  }

  angular
    .module('starter')
    .factory('VenueService', VenueService);

})();
