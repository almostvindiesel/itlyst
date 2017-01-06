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


/*
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
*/

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'AppCtrl'
  })

  .state('app.map', {
    cache: false, 
    url: '/map',
    views: {
      'venues-tab': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }/*,
      'popup@map': { 
          templateUrl: 'templates/popup.html',
          controller: 'PopupCtrl',
          cache: false
      }*/
    }
  })

  .state('app.blank', {
    cache: false, 
    url: '/blank',
    views: {
      'clipboard-tab': {
        templateUrl: 'templates/blank.html',
        controller: 'PopupCtrl',
        cache: false
      }
    }
  })

  .state('app.filters', {
    url: '/filters',
    views: {
      'filters-tab': {
        templateUrl: 'templates/filters.html',
        controller: 'FiltersCtrl'
      }
    }
  })
  /*
  .state('app.profile', {
    url: '/profile',
    views: {
      'profile-tab': {
        templateUrl: 'templates/profile.html',
        controller: 'UserProfileCtrl'
      }
    }
  })
  */

  .state('app.venues', {
    url: '/venues',
    views: {
      'venues-tab': {
        templateUrl: 'templates/venues.html',
        controller: 'VenuesCtrl'
      },
     /* 'popup@venues': { 
          templateUrl: 'templates/popup.html',
          controller: 'PopupCtrl',
          //cache: false
      }*/
    }
  })

  .state('app.venue', {
    url: '/venue/:venueId',
    views: {
      'venues-tab': {
        templateUrl: 'templates/venue_detail.html',
        abstract: true,
        controller: 'VenueDetailCtrl'
      },/*
      'popup@venue': { 
          templateUrl: 'templates/popup.html',
          controller: 'PopupCtrl',
          cache: false, 
         // cache: false
      }*/
    }
  })

  .state('app.image', {
    //cache: false,
    url: '/image/:imageId',
    views: {
      'venues-tab': {
        templateUrl: 'templates/images.html',
        abstract: true,
        controller: 'ImageCtrl'
      }
    }
  })

  .state('app.redirector', {
    url: '/redirector',
    views: {
      'venues-tab': {
        templateUrl: 'templates/redirector.html',
        controller: 'RedirectorCtrl'
      }
    }
  })

  .state('start', {
    url: '/start',
    views: {
      '': {
        templateUrl: 'templates/start.html',
        controller: 'StartCtrl'
      },
    /*  'popup@start': { 
          templateUrl: 'templates/popup.html',
          controller: 'PopupCtrl',
          cache: false
      } */
    }
  })



  .state('app.admin', {
    url: '/admin',
    views: {
      'admin-tab': {
        templateUrl: 'templates/admin.html',
        controller: 'AdminCtrl'
      },/*
      'popup@admin': { 
          templateUrl: 'templates/popup.html',
          controller: 'PopupCtrl',
          cache: false
      }*/
    }
  })
  /*
  .state('app.pages', {
    url: '/pages',
    views: {
      'pages-tab': {
        templateUrl: 'templates/pages.html'
      }
    }
  })
  */

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/start');
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



  function LoginService($base64, $http) {

    var status = {
      isLoggedIn: false
    };

    function init() {
      getEmail();
      getPassword();
      //login(api_url);
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


  //function login(api_url) {
  var login = function (api_url) {
      //Note that the username is the email address in this case
      var username = getEmail();
      var password = getPassword();
      var headers = { headers: {'Authorization': 'Basic '+ $base64.encode( username + ':' + password) } }
      var url = api_url + '/api/v1/login';

      //console.log("--- Params leveraged to make login call");
      //console.log("url: " + url);
      //console.log("username: " + username);
      //console.log("password: " + password);

      
     return $http.get(url, headers)
      .success(function(response){
        status.isLoggedIn = response.login_status;
        console.log("User logged in? " + response.login_status);
        return response;
      })
      .error(function(rejection, status) {
        status.isLoggedIn = rejection.login_status;
        console.error('Rejection login response from server', rejection, status);
        return rejection;
      });
    }

    function getLoginHeader() {
      return {'Authorization': 'Basic '+ $base64.encode( getEmail() + ':' + getPassword()) }
    }

    function getEmail() {
      try {
        return window.localStorage.getItem("email");
      } catch(err) {
        console.log ("No email stored locally");
        return '';
      }
    }

    function getPassword() {
      try {
        return window.localStorage.getItem("password");
      } catch(err) {
        console.log ("No password stored locally");
        return '';
      }
    }

    function setEmail(email) {
      window.localStorage.setItem ("email",email);
    }

    function setPassword(password) {
      window.localStorage.setItem ("password",password);
    }

    return {
      init: init,
      login: login,
      getEmail: getEmail,
      getPassword: getPassword,
      setEmail: setEmail,
      setPassword: setPassword,
      getLoginHeader: getLoginHeader,
      status: status
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
      city: 'San Francisco',
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

    function extractVenues(api_url, loginHeader) {
        var headers = {'headers': loginHeader}
        return {
          async: function() {
            var venue_url = api_url + '/api/v1/venues?' + generateUrlParameters();
            console.log("Querying: " + venue_url);
            return $http.get(venue_url, headers); 
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
        //v.setName();
        setVenueProperties(v, source);
        v.setPostParameters();
        return v;
      }
    }

    function setVenueProperties (v, source) {
      //console.log("1------------------------------");
      //v.setJQueryDocument(response);
      //v.findImageOnPage();    // This function needs to be called before simplifyPageUrl
      v.setName();
      v.setSourceId();
      v.setLatitude();
      v.setLongitude();
      v.setCity();
      v.setRating();
      v.setReviews();
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

    function remove(id, api_url, loginHeader) {
      console.log("About to delete venue id: " + id + " on " + api_url);

      //headers['Content-type'] = 'application/json;charset=utf-8';
      //console.log("delete headers:")
      //console.log(headers.headers);

      $http({
          method: 'DELETE',
          url: api_url + '/api/v1/venue/' + id,
          /*data: {
              user: userId
          },*/
          headers: loginHeader
      })
      .then(function(response) {
          console.log(response.data);
      }, function(rejection) {
          console.log(rejection.data);
      });

    }
  
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
    function remove(id, api_url, loginHeader) {
      console.log("About to delete image id in server: " + id);

      $http({
          method: 'DELETE',
          url: api_url + '/api/v1/image/' + id,
          headers: loginHeader
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
    function remove(id, api_url, loginHeader) {
      console.log("About to delete note id in server: " + id);

      $http({
          method: 'DELETE',
          url: api_url + '/api/v1/note/' + id,
          headers: loginHeader
      })
      .then(function(response) {
          console.log(response.data);

      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    //Edit a venue note
    function edit(id, note, api_url, loginHeader) {
      console.log("About to post edited note to server. note id: " + id + ", note: " + note);
      var headers = loginHeader;
      headers['Content-type'] = 'application/json;charset=utf-8';

      $http({
          method: 'PUT',
          url: api_url + '/api/v1/note/' + id,
          headers: headers,
          data: {
            note: note
          }
      })
      .then(function(response) {
          console.log(response.data);
      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    //Add a venue note
    function add(venue_id, note, api_url, loginHeader) {
      console.log("About to post new note note to server. venue id: " + venue_id + ", note: " + note);
      var headers = loginHeader;
      headers['Content-type'] = 'application/json;charset=utf-8';

      $http({
          method: 'POST',
          url: api_url + '/api/v1/note',
          headers: headers,
          data: {
            note: note,
            venue_id: venue_id
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
    .factory('LoginService', LoginService)
    .factory('ClipboardService', ClipboardService)
    .factory('VenueApi', VenueApi)
    .factory('NoteApi', NoteApi)
    .factory('ImageApi', ImageApi)
    .factory('TextApi', TextApi)

    ;
    

})();
