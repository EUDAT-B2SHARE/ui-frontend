'use strict';

var backend = 'http://145.100.1.21:5000';

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
      var content_msg = angular.element('#alerts-container').find('.message.' + clazz).find('[ng-bind-html=content]').html();
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

// session helper
b2Services.factory('Session', ['$rootScope', '$location', '$timeout', '$routeParams', '$window',
  function($rootScope, $location, $timeout, $routeParams, $window){
  var _notify = {flash: []};
  return {
    get: function(name){
      if($window.sessionStorage[name]){
        return JSON.parse($window.sessionStorage[name]);
      }
      return {};
    },
    set: function(values){
      for(var key in values){
        var value = values[key];
        $window.sessionStorage[key] = JSON.stringify(value);
      }
    },
    reset: function(){
      $window.sessionStorage = {};
    }
  };
}]);

// generic helper
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

b2Services.factory('Pagination', ['$rootScope', '$location', '$routeParams', 'Helper',
  function($rootScope, $location, $routeParams, Helper){
  return {
    show: function(self, page, currentPage, pageSize, itemCnt){
      // some calculations
      var p = "#/"+page+"?page="
      var showItems = 10;
      var lastPage = Math.ceil(itemCnt / pageSize);
      currentPage = 1*currentPage;
      var showFirst = currentPage+1 > Math.ceil(showItems / 2);
      var showPrev = currentPage > 1;
      var showNext = currentPage < lastPage;
      var showLast = currentPage < lastPage;
      // wrappers
      var wrap = $('<div/>', { class: 'pagination' });
      var btn_group = $('<div/>', {'class': "btn-group", 'role': "group", 'aria-label': "..."});

      if(showFirst){
        var icon = $('<i/>', {class: "fa fa-fast-backward"});
        var a_first = $('<a/>', {'href': p+""+1, class: "btn btn-warning", 'text': ""});
        icon.prependTo(a_first);
        a_first.appendTo(btn_group);
      }

      // page back
      if(showPrev){
        var icon = $('<i/>', {class: "fa fa-step-backward"});
        var a_prev = $('<a/>', {'href': p+""+(currentPage-1), class: "btn btn-default", 'text': ""});
        icon.prependTo(a_prev);
        a_prev.appendTo(btn_group);
      }

      // current page + surrounding pages
      for(var i = currentPage-(showItems/2); i < currentPage+(showItems/2); i++){
        if(i > lastPage) break;
        if(i < 1) continue;
        var a_curr = $("<a/>", {'href': p+""+i, class: 'btn btn-default ' +
          Helper.pageActive(i), text: i})
        a_curr.appendTo(btn_group);
      }

      // next page
      if(showNext){
        var icon = $('<i/>', {class: "fa fa-step-forward"});
        var a_next = $('<a/>', {'href': p+""+(1*currentPage+1), class: "btn btn-primary", 'text': ""});
        icon.appendTo(a_next);
        a_next.appendTo(btn_group);
      }

      if(showLast){
        var icon = $('<i/>', {class: "fa fa-fast-forward"});
        var a_last = $('<a/>', {'href': p+""+lastPage, class: "btn btn-warning", 'text': ""});
        icon.appendTo(a_last);
        a_last.appendTo(btn_group);
      }

      // wrapper placeholders
      btn_group.appendTo(wrap);
      wrap.appendTo(self);
      // return $sce.trustAsHtml(wrap);
    }
  };
}]);


// MODELS --------------------------------------

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
b2Services.factory('b2Interceptor', ['$window', '$q', '$location', 'Session',
  function($window, $q, $location, Session){
  return {
    request: function(config){
      // inject user token
      var currentUser = Session.get('user');
      if(currentUser && config.url.startsWith("http")){
        config.headers.Authorization = 'B2SHARE ' + currentUser.token;
      }
      return config;
    },
    response: function(response){
      // catch new user token (secure against replay attacks)
      var currentUser = Session.get('user');
      var prefix = "B2SHARE";
      if(currentUser && response.config.url.startsWith("http")){
        var token = response.headers('x-token');
        if(token && token.startsWith(prefix)){
          token = token.substring(prefix.length +1, token.length);
          currentUser.token = token;
          Session.set({user: currentUser}, 'active');
        }
      }
      return response;
    },
    responseError: function(rejection){
      // automatically logout when authentication fails
      if(rejection.status == 401){
        Session.unset('user');
        $location.path('/users/logout');
      }
      return $q.reject(rejection);
    }
  };
}]);

b2Services.factory('Session', ['$rootScope', '$location', '$timeout', '$routeParams', '$window',
  function($rootScope, $location, $timeout, $routeParams, $window){

  return {
    unset: function(key){
      if( key in $window.sessionStorage){
        delete $window.sessionStorage[key];
      }
      if(key in $window.localStorage){
        delete $window.localStorage[key];
      }
    },
    set: function(values, location){
      if(location == "active"){
        location = this.whichStorage('user');
      }
      for(var k in values){
        var value = values[k];
        var done = false;
        if(location == "session"){
          $window.sessionStorage[k] = JSON.stringify(value);
          done = true;
        } else if(location == "local"){
          $window.localStorage[k] = JSON.stringify(value);
          done = true;
        }
        if(done) break;
      }
    },
    get: function(key){
      if(key in $window.sessionStorage){
        return JSON.parse($window.sessionStorage[key]);
      } else if (key in $window.localStorage){
        return JSON.parse($window.localStorage[key]);
      }
    },
    has: function(key){
      return (key in $window.sessionStorage || key in $window.localStorage);
    },
    whichStorage: function(key){
      if (key in $window.sessionStorage){
        return "session";
      } else if(key in $window.localStorage){
        return "local";
      }
    },
    load: function(){
      $rootScope.currentUser = this.get('user');
    }
  };
}]);

