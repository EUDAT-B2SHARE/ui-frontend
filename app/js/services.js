'use strict';

var backend = 'http://localhost:5000';

/* Services */

var b2Services = angular.module('b2Services', ['ngResource']);

// page title object (only used here)

b2Services.factory('PageTitle', ['$rootScope', '$location', '$timeout', '$routeParams',
  function($rootScope, $location, $timeout, $routeParams){
  var _pageTitle = {page: "", subject: "", title: "B2SHARE"};
  return {
    reset: function(){
      _pageTitle = {page: "", subject: "", title: "B2SHARE"};
      // preset title via breadcrumb parsed page names
      if($rootScope.Breadcrumbs.present()){
        _pageTitle.page = $rootScope.Breadcrumbs.getBreadcrumbs()[0].name;
      }
    },
    getTitle: function(){
      return $rootScope.Notify.getCountStr() + "" +_pageTitle.subject.capitalize() + " " +
        _pageTitle.page.capitalize() + " - " + _pageTitle.title;
    },
    setPage: function(page){
      _pageTitle.page = page;
    },
    setSubject: function(subject){
      _pageTitle.subject = subject;
    }
  };
}]);

// breadcrumbs


b2Services.factory('Breadcrumbs', ['$rootScope', '$location', '$timeout', '$routeParams',
  function($rootScope, $location, $timeout, $routeParams){
  var _breadcrumbs = [];
  return {
    present: function(){
      return _breadcrumbs.length > 0;
    },
    length: function(){
      return _breadcrumbs.length;
    },
    getBreadcrumbs: function(){
      return _breadcrumbs;
    },
    load: function(){
      var uri = $location.path();
      // strip parameters
      var end = uri.indexOf('?');
      if(end == -1)
        end = uri.length;
      // strip prefix and empty entries
      var as = uri.substring(1, end).split('/').filter(function(a){ return a != ""; });
      // map as expected result
      _breadcrumbs = as.map(function(a, i){
        var href = "#/" + as.slice(0, i+1).join('/');
        var active = as.length -1 != i;
        return {'name': a, 'href': href, 'active': active};
      });
    }
  };
}]);

// system to user notification


b2Services.factory('Notify', ['$rootScope', '$location', '$timeout', '$routeParams', '$window',
  function($rootScope, $location, $timeout, $routeParams, $window){
  var _notify = {flash: []};
  return {
    getCountStr: function(){
      // hide count for guests
      if($window.sessionStorage.user == undefined)
        return "";
      // show count for users who have messages
      var cnt = this.getCount();
      if(cnt > 0)
        return "(" + cnt + ") ";
      return "";
    },
    getCount: function(){
      var cnt = 0;
      for(var n in _notify){
        var val = _notify[n];
        if(val != undefined)
          cnt += val.length;
      }
      return cnt;
    },
    getNotifications: function(group){
      //TODO: group undefined should group all types together
      if(group == undefined)
        group = 'flash';
      return _notify[group];
    },
    present: function(){
      return this.getCount() > 0;
    },
    dismiss: function(){
      _notify = {flash: []};
    },
    flash_add: function(action, clazz, content, type, duration){
      if(type == undefined) type = "warning";
      if(duration == undefined) duration = 4;
      var flash = {action: action, html_class: clazz, content: content, type: type, time: (new Date().getTime())};
      _notify.flash.push(flash);
      // show flash notification
      var content_msg = $('#alerts-container').find('.message.' + clazz).find('[ng-bind-html=content]').html();
      if(content_msg != content){
        action({content: content, title: "", type: type, animation: 'am-fade-and-slide-top message ' + clazz, duration: duration});
      }
    },
    flash_dismiss: function(clazz){
      $timeout(function() {
        if(clazz == undefined){
          // dismiss all
          angular.element('#alerts-container').find('button').trigger('click');
        } else {
          // dismiss specific class
          angular.element('#alerts-container').find('.' + clazz + ' button').trigger('click');
        }
      }, 100);
    },
  };
}]);


b2Services.factory('Helper', ['$rootScope', '$location', '$timeout', '$routeParams',
  function($rootScope, $location, $timeout, $routeParams){
  return {
    // path redirection
    path: function(data){
      $location.path(data);
    },
    // return active to be injected into <div class="..."> upon active route
    routeActive: function(route){
      if($location.path() == route){
        return "active";
      }
    },
    pageActive: function(page){
      if($routeParams.page == page){
        return "active";
      }
    },
  };
}]);


b2Services.factory('User', ['$resource', function($resource){
  return $resource(backend + '/user/:action.json', {}, {
    authenticate: { method: 'POST', params: {action: "authenticate", remember: '@remember'},
      transformRequest: function(data){
        delete data['remember'];
        return angular.toJson(data);
      }
      },
  });
}]);

b2Services.factory('Deposit', ['$resource', '$window',  function($resource, $window){
  // deposit functions
  return $resource(backend + '/deposit/:action.json', {}, {
    deposits: { method: 'GET', params: {action: 'index', order: '@order', order_by: '@order_by', page: '@page', page_size: '@page_size'}},
    deposit: { method: 'GET', params: {action: 'deposit', uuid: '@uuid'}},
  });
}]);

// intercept all http requests
b2Services.factory('b2Interceptor', ['$window', '$q', '$location', '$rootScope', function($window, $q, $location, $rootScope){
  return {
    request: function(config){
      // inject user token
      var currentUser = $window.sessionStorage.user;
      // console.log(currentUser);
      if(currentUser && config.url.startsWith("http")){
        console.log(config);
        config.headers.Authorization = 'B2SHARE ' + JSON.parse(currentUser).token;
        // config.params.token = JSON.parse(currentUser).token;
      }
      return config;
    },
    response: function(response){
      // catch new user token (secure against replay attacks)
      var currentUser = $window.sessionStorage.user;
      if(currentUser && response.config.url.startsWith("http")){
        var token = response.headers('x-token');
        if(token){
          var prefix = "B2SHARE"
          if(token.startsWith(prefix)){
            token = token.substring(prefix.length +1, token.length);
          }
          var currentUser = JSON.parse(currentUser);
          currentUser.token = token;
          $window.sessionStorage.user = JSON.stringify(currentUser);
          $rootScope.currentUser = currentUser;
        }
      }
      return response;
    },
    responseError: function(rejection){
      // automatically logout when authentication fails
      if(rejection.status == 401){
        console.log(rejection);
        $location.path('/users/logout');
      }
      return $q.reject(rejection);
    }
  };
}]);

