// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])




.constant("config", {
  "api_servers": [
    {"name": "local", "url": "http://mars.local:5000"},
    {"name": "prod", "url": "http://www.itlyst.com"},
  ]
})


//.value('api_url', 'http://www.itlyst.com')
.value('api_url', 'http://mars.local:5000')


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

  .state('app.image', {
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
  function ClipboardService($http, config, api_url) {

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

  function VenueService($http, config, api_url) {

    var data = {
      venues: {},
      zoom: 10,
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

    return {
      setVenues: setVenues,
      setForceRefreshVenues: setForceRefreshVenues,
      extractVenues: extractVenues,
      setZoom: setZoom,
      setCity: setCity,
      data: data
    };
  } 

  function VenueApi($http, config, api_url) {

    function remove(id) {
      console.log("About to delete venue id: " + id);

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
  
    return {
      remove: remove,
    };
  }

  function NoteApi($http, config, api_url) {

    function remove(id) {
      console.log("About to delete note id: " + id);

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
    return {
      remove: remove,
    };
  }

  angular
    .module('starter')
    .factory('ApiService', ApiService)
    .factory('VenueService', VenueService)
    .factory('ClipboardService', ClipboardService)
    .factory('VenueApi', VenueApi)
    .factory('NoteApi', NoteApi)

    ;
    

})();
