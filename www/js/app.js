// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


console.log("Opened app.js");


angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

/*
.directive('capture', function(){
   return {
     link : function(scope, element, attributes){
       element.contents().find('body').bind('click', function () {
            console.log("hello");
            alert("hello");
        });
     }
   };
 })
 */

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


/*
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
*/

.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider) {

  //!!! potential security issue?
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
  /*
  $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // Allow loading from our assets domain.  Notice the difference between * and **.
   'http://www.itlyst.com/**']);
  */

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
      'map-tab': {
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
  .state('app.account', {
    url: '/account',
    views: {
      'account-tab': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  })
*/
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

  .state('app.venue_search', {
    cache: false, 
    url: '/venue_search',
    views: {
      'venues-tab': {
        templateUrl: 'templates/venue_search.html',
        controller: 'VenueSearchCtrl'
      }
    }
  })

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

  .state('ftue', {
    url: '/ftue',
    views: {
      '': {
        templateUrl: 'templates/ftue.html',
        abstract: true,
        controller: 'FtueCtrl'
      }
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
      isLoggedIn: false,
      hasCompletedFtue: 0
    };


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

  var login = function (api_url) {
      //Note that the username is the email address in this case
      console.log("Attempting to login...");
      var username = getEmail();
      var password = getPassword();
      if (username == null && password == null) {
        var msg = "No username and password stored in local storage.";
        console.log(msg);
        return msg;
        
      } else {
        //status.hasCompletedFtue = true;

        var headers = { headers: {'Authorization': 'Basic '+ $base64.encode( username + ':' + password) } }
        //console.log("auth heads --------------------");
        //console.log("Encoding: " + $base64.encode( username + ':' + password));
        //console.log(headers);
        //console.log("--------------------");

        var url = api_url + '/api/v1/login';

       return $http.get(url, headers)
        .success(function(response){

          //Set the login status
          status.isLoggedIn = response.login_status;
          console.log("--- User completed mobile ftue: " + response.has_completed_mobile_ftue);
          console.log("--- User logged stauts: " + response.login_status);
          //console.log(response);
          status.hasCompletedFtue = response.has_completed_mobile_ftue;

          //Set the user id
          setUserId(response.user_id);
          //console.log("User Id: ", getUserId());
          return response;
        })
        .error(function(rejection, status) {
          status.isLoggedIn = rejection.login_status;
          console.error('Rejection login response from server', rejection, status);
          return rejection;
        });
      }

    }

    function getLoginHeader() {
      return {'Authorization': 'Basic '+ $base64.encode( getEmail() + ':' + getPassword()) }
    }

    function getUserId() {
      return window.localStorage.getItem("userId");
    }

    function getEmail() {
      return window.localStorage.getItem("email");
    }

    function getPassword() {
      return window.localStorage.getItem("password");
    }

    function setUserId(user_id) {
      window.localStorage.setItem ("userId",user_id);
    }

    function setEmail(email) {
      window.localStorage.setItem ("email",email);
    }

    function setPassword(password) {
      window.localStorage.setItem ("password",password);
    }



    function completeMobileFtue(api_url, loginHeader, user_id) {
      status.hasCompletedFtue = true;
      var headers = loginHeader;
      headers['Content-type'] = 'application/json;charset=utf-8';

      //var headers = {'headers': loginHeader}

      return $http({
          method: 'POST',
          url: api_url + '/api/v1/user',
          data: {
            has_completed_mobile_ftue: 1,
            user_id: user_id
          }, 
          headers: headers
      })
      .then(function(response) {
          //console.log("Response: " + response.data);
          return response.data //.data['venues'];
      }, function(rejection) {
          //console.log(rejection.data);
          return rejection.data;
      });
    }


    return {
      login: login,
      getEmail: getEmail,
      getPassword: getPassword,
      getUserId: getUserId,
      setEmail: setEmail,
      setPassword: setPassword,
      setUserId: setUserId,
      getLoginHeader: getLoginHeader,
      completeMobileFtue: completeMobileFtue,
      status: status
    };
  }



  function LocationService($http, config) {

    //Default lat/long arbritrary set to San Francisco
    var data = {
      latitude: 37.773972,
      longitude: -122.431297
    };

    function getLatLongFromIPAddress() {
        return $http({
              method: 'GET',
              url: 'http://freegeoip.net/json/'
          })
          .then(function(response) {
              data.latitude = response.data.latitude;
              data.longitude = response.data.longitude;
              //console.log("User IP Lat: "+ data.latitude);
              //console.log("User IP Long: "+ data.longitude);
              return {lat: data.latitude, lng: data.longitude}
          }, function(rejection) {
              return response;
      });
      }

    return {
      getLatLongFromIPAddress: getLatLongFromIPAddress,
      data: data
    };

  }



  function UserCityService($http, config) {

    function getRecentlyAddedCities(numCities, api_url, loginHeader, user_id) {
        var headers = {'headers': loginHeader};
        return {
          async: function() {
            var url = api_url + '/api/v1/usercity/' + numCities + "?user_id=" + user_id;
            //console.log("Querying: " + url);
            return $http.get(url, headers); 
          }
        };
      }

    return {
      getRecentlyAddedCities: getRecentlyAddedCities
    };

  }




  function VenueService($http, config) {

    var zoom_options = [1, 3, 5, 10, 25, 50];
    var venue_type_options = [ 'food', 'place', 'coffee', 'all' ]
    var sort_by_options = [ 'recent', 'rating', 'distance' ]
    
    var data = {
      venues: {},
      zoom_options: zoom_options,
      zoom: 50,
      latitude: 0,
      longitude: 0,
      user_ratings_filter: Array("0","1","4"),
      venue_type_options: venue_type_options,
      venue_type: 'all',
      sort_by_options: sort_by_options,
      sort_by: 'recent',
      city: 'Los Angeles',
      google_place_id: null,
      refreshVenues: false
    };

    // Generates the parameters used to query the api. 
    function generateVenueUrlParameters () {
      //console.log(data);

      var params_obj = {};
      params_obj['zoom'] = data['zoom'];
      params_obj['city'] = data['city'];
      params_obj['latitude'] = data.latitude;
      params_obj['longitude'] = data.longitude;
      params_obj['city'] = data['city'];
      
      params_obj['sort_by'] = data['sort_by'];
      params_obj['user_rating'] = data.user_ratings_filter.join(",");

      //console.log(params_obj);

      return jQuery.param(params_obj);
    }

    function setForceRefreshVenues(bol){
      console.log("--- Setting refreshVenues: " + bol);
      data['refreshVenues'] = bol;
    }


    function setLatitude(val){
      console.log("--- Setting latitude: " + val);
      data['latitude'] = val;
    }

    function setLongitude(val){
      console.log("--- Setting longitude: " + val);
      data['longitude'] = val;
    }

    function setCity(val){
      console.log("--- Setting city: " + val);
      //console.log("Setting city from city object: ");
      //console.log(obj);
      data['city'] = val;
      //data['google_place_id'] = obj.google_place_id;
    }

    function addUserRatingFilter(val){
      console.log("--- Adding user rating filter: " + val);
      data.user_ratings_filter.push(val);
    }

    function removeUserRatingFilter(val){
      console.log("Removing user rating filter: " + val);
      for (i = 0; i < data.user_ratings_filter.length; i++) {
        if(data.user_ratings_filter[i] == val) {
          data.user_ratings_filter.splice(i,1);
        }      
      }
    }

    function setSortBy(val){
      console.log("Setting sort_by: " + val);
      data['sort_by'] = val;
    }

    function setZoom(val){
      console.log("Setting zoom: " + val);
      data['zoom'] = val;
    }

    function setVenues(val){
      console.log("Setting venues, count: " + val.length);
      data['venues'] = val;
    }

    function getLatLngFromGooglePlaceId(google_place_id, api_url) {
        //var headers = {'headers': loginHeader}
        return {
          async: function() {
            var url = api_url + '/api/v1/city?google_place_id=' + google_place_id; // + "&user_id=" + user_id;
            console.log("Querying: " + url);
            return $http.get(url); //, headers); 
          }
        };
    }

    function extractVenues(api_url, loginHeader, user_id) {
        var headers = {'headers': loginHeader}
        return {
          async: function() {
            var venue_url = api_url + '/api/v1/venues?' + generateVenueUrlParameters() + "&user_id=" + user_id;
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
        //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        //console.log(response);
        //v.setName();
        setVenueProperties(v, source);
        v.setPostParameters();
        return v;
      }
    }


    function sendToServer(parameters, server_url, loginHeader, user_id) {
      parameters.user_id = user_id;
      console.log("Posting venue to server: ");
      console.log("  Server: " + server_url);
      console.log("  Post Params: ");
      console.log(parameters);
      //console.log($httpParamSerializerJQLike(parameters));
      //console.log( JSON.stringify(parameters));
      //console.log( parameters );
      var headers = loginHeader;
      headers['Content-type'] = 'application/json;charset=utf-8';
      console.log("  Headers: ");
      console.log(headers);

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
      getLatLngFromGooglePlaceId: getLatLngFromGooglePlaceId,
      sendToServer: sendToServer,
      addUserRatingFilter: addUserRatingFilter,
      removeUserRatingFilter: removeUserRatingFilter,
      setZoom: setZoom,
      setLatitude: setLatitude,
      setLongitude: setLongitude,
      setSortBy: setSortBy,
      setCity: setCity,
      data: data
    };
  } 

  function VenueApi($http, config) {

    function remove(id, api_url, loginHeader, user_id) {
      console.log("About to delete venue id: " + id + " on " + api_url);

      //headers['Content-type'] = 'application/json;charset=utf-8';
      //console.log("delete headers:")
      //console.log(headers.headers);
      console.log("user_id-->: " + user_id);

      $http({
          method: 'DELETE',
          url: api_url + '/api/v1/venue/' + id,
          data: {
              user_id: user_id
          },
          headers: loginHeader
      })
      .then(function(response) {
          console.log(response.data);
      }, function(rejection) {
          console.log(rejection.data);
      });

    }

    function edit(user_rating, venue_id, api_url, loginHeader, user_id) {
      console.log("About to put edited note to server. user_rating: " + user_rating + ", venue_id: " + venue_id, " user_id: " + user_id);
      var headers = loginHeader;
      headers['Content-type'] = 'application/json;charset=utf-8';

      $http({
          method: 'PUT',
          url: api_url + '/api/v1/venue/' + venue_id,
          headers: headers,
          data: {
            user_rating: user_rating,
            user_id: user_id
          }
      })
      .then(function(response) {
          console.log(response.data);
      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    //!!! should have headers here too...
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
          //console.log("Foursquare API Response: ");
          //console.log(response.data['venues']);
          return response.data['venues'];
      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    return {
      remove: remove,
      edit: edit,
      search: search
    };
  }

  function ImageApi($http, config) {

    //Remove an image
    function remove(id, api_url, loginHeader, user_id) {
      console.log("About to delete image id in server: " + id);

      $http({
          method: 'DELETE',
          url: api_url + '/api/v1/image/' + id,
          data: {
            user_id: user_id  
          }, 
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
    function remove(id, api_url, loginHeader, user_id) {
      console.log("About to delete note id in server: " + id);

      $http({
          method: 'DELETE',
          url: api_url + '/api/v1/note/' + id,
          headers: loginHeader,
          data: {
            user_id: user_id
          }
      })
      .then(function(response) {
          console.log(response.data);

      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    //Edit a venue note
    function edit(id, note, api_url, loginHeader, user_id) {
      console.log("About to put edited note to server. note id: " + id + ", note: " + note, " user_id: " + user_id);
      var headers = loginHeader;
      headers['Content-type'] = 'application/json;charset=utf-8';

      $http({
          method: 'PUT',
          url: api_url + '/api/v1/note/' + id,
          headers: headers,
          data: {
            note: note,
            user_id: user_id
          }
      })
      .then(function(response) {
          console.log(response.data);
      }, function(rejection) {
          console.log(rejection.data);
      });
    }

    //Add a venue note
    function add(venue_id, note, api_url, loginHeader, user_id) {
      console.log("About to post new note note to server. venue id: " + venue_id + ", note: " + note);
      var headers = loginHeader;
      headers['Content-type'] = 'application/json;charset=utf-8';

      $http({
          method: 'POST',
          url: api_url + '/api/v1/note',
          headers: headers,
          data: {
            note: note,
            venue_id: venue_id,
            user_id: user_id
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
    //!!! need to add authentication here too
    var analyze = function(api_url, text, user_id) {
      console.log("About to post text to server: " + text);

      return $http({
          method: 'POST',
          url: api_url + '/api/v1/text',
          data: {
            text: text,
            user_id: user_id             
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
    .factory('LocationService', LocationService)
    .factory('ClipboardService', ClipboardService)
    .factory('UserCityService', UserCityService)
    .factory('VenueApi', VenueApi)
    .factory('NoteApi', NoteApi)
    .factory('ImageApi', ImageApi)
    .factory('TextApi', TextApi)

  ;
    

})();
