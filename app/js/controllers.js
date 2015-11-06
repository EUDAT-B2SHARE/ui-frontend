'use strict';

/* Controllers */


var b2Controllers = angular.module('b2Controllers', ['angular-loading-bar']);


b2Controllers.controller('HomeCtrl', ['$scope', '$alert', '$location', '$timeout', '$rootScope', '$window', 'Record', 'Helper', 'Upload', 'Session',
    function($scope, $alert, $location, $timeout, $rootScope, $window, Record, Helper, Upload, Session){

    // latest records
    Record.records({page: 1, page_size: 6, order_by: 'created_at', order: 'desc'}, function(data){
        $scope.records = data.records;
    }, function(data){
        // error happend
        $rootScope.Notify.flash_add($alert, 'records', 'Could not load latest records', 'warning');
    });

    // file upload
    $rootScope.uploadForm = {};
    $rootScope.uploadForm.showSubmit = true;
    $rootScope.uploadForm.submitForm = function(){
        if(!$rootScope.uploadForm.files){
            // TODO: user error feedback!
            return;
        }
        // forward to record creation page
        $location.path('/records/create');
    };
    $rootScope.uploadForm.change = function(files){
        // show preview (bind media element)
        $timeout(function() {
            angular.element('.media').media();
        }, 100);
    };
    $rootScope.uploadForm.reset = function(){
        // reset files, scroll to create record
        $rootScope.uploadForm.files = undefined;
        Helper.scrollToInvisible("#create-record-header");
    };

}]);


b2Controllers.controller('DefaultCtrl', ['$scope', '$alert', '$location', '$timeout', '$rootScope', '$window', 'Breadcrumbs', 'PageTitle', 'Session', 'Helper',
    function($scope, $alert, $location, $timeout, $rootScope, $window, Breadcrumbs, PageTitle, Session, Helper){

    // user session
    if(Session.has('user')){
        $rootScope.user = Session.get('user');
    }

    // if($window.sessionStorage.user != undefined){
    //   $rootScope.user = JSON.parse($window.sessionStorage.user);
    // }

    // search
    $scope.searchForm = {};
    $scope.searchForm.submitForm = function() {
        if($scope.searchForm.query == undefined || $scope.searchForm.query == ""){
            $rootScope.Notify.flash_add($alert, 'search', 'Please provide a search value', 'warning');
            return;
        } else {
            $rootScope.Notify.flash_dismiss('search');
        }
        // redirect to search page
        $location.path('/search/query/').search('query', $scope.searchForm.query);
    };

    // content view loaded
    $scope.$on('$viewContentLoaded', function(){
        // colorbox
        var v = angular.element('.colorbox');
        v.colorbox({href: function(){
                // bind href with src of img
                return angular.element(this).attr("src");
            }, maxWidth: "75%", fixed: true, scrolling: false
        });

        // stop background scrolling (body behind colorbox)
        angular.element(document).bind('cbox_open', function(){
            angular.element('body').addClass('stop-scrolling');
        });
        // enable scrolling
        angular.element(document).bind('cbox_closed', function(){
            angular.element('body').removeClass('stop-scrolling');
        });

        // a href hooks
        angular.element('a').each(function(i, a){
            var a = angular.element(a);
            if(a.attr("href") != undefined && !a.attr("href").startsWith("#/")){
                if(a.attr("target") == undefined)
                    // overwrite remote href to _blank target (if target not set)
                    a.attr("target", "_blank");
            } else {
                // attach inner-link helper
                a.addClass("inner-link");
            }
            // detect expanded navs
            var navs = angular.element(document).find('nav .navbar-collapse');
            if(navs.hasClass('in') && a.hasClass('inner-link')){
                // collapse navs on internal link click
                navs.removeClass('in');
            }
        });

        // scroll pages into view (better effect than autofocus="true")
        Helper.scrollToInvisible('#header');

        // breadcrumbs
        Breadcrumbs.load();

        // page title
        PageTitle.reset();

        // load session
        Session.load();


    });
}]);

b2Controllers.controller('AboutCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
    // $rootScope.PageTitle.reset();

}]);

b2Controllers.controller('AboutListCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
    // $rootScope.PageTitle.reset();

}]);

b2Controllers.controller('HelpCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
    // $rootScope.PageTitle.reset();

}]);

b2Controllers.controller('HelpListCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
    // $rootScope.PageTitle.reset();

}]);

b2Controllers.controller('UserCtrl', ['$scope', 'User', '$alert', '$timeout', '$rootScope', '$window', '$location', 'Session',
    function($scope, User, $alert, $timeout, $rootScope, $window, $location, Session){

    // logout user
    // TODO: move do different controller or make an angular function!
    if ($location.path() == "/users/logout"){
        Session.unset('user');
        $rootScope.currentUser = undefined;
        $rootScope.Notify.dismiss();
        $rootScope.Notify.flash_dismiss();
        $rootScope.Notify.flash_add($alert, 'user', 'You\'ve logged out', 'success');
        $rootScope.Notify.dismiss();
        $location.path("/users/login");
    }

    // login form
    $scope.userLogin = {};
    $scope.userLogin.submitForm = function() {
        var f = $scope.userLogin;
        // call user authenticate
        Session.unset('user');
        // delete $window.sessionStorage.user;
        User.authenticate({email: f.email, password: f.password, remember: f.remember}, function(data){
            $rootScope.Notify.flash_dismiss('user');
            // TODO: handle invalid requests here!
            var loc = "session";
            if(f.remember){
                loc = "local";
            }
            Session.set({user: data.user}, loc);
            // user session (load when default not yet loaded)
            $rootScope.user = Session.get('user');
            $scope.info = data.info;
            angular.element("[name=userLoginFormNg]").removeClass("has-error");
            $rootScope.Notify.flash_add($alert, 'user', 'You\'ve logged in as: `'+data.user.name+'`', 'success');
            $location.path('/users/profile');
        }, function(data){
            f.errorBase = data.error.base;
            angular.element("[name=userLoginFormNg]").addClass("has-error");
            if(String(data.status).startsWith("5")){
                $rootScope.Notify.flash_add($alert, 'user', 'An error has occured', 'danger');
            }
        });
    };


}]);

b2Controllers.controller('CommunitiesCtrl',
    ['$scope', '$routeParams', '$rootScope', '$location', '$alert', 'Communities', 'Pagination',
        function($scope, $routeParams, $rootScope, $location, $alert, Communities, Pagination){
            if (!$routeParams.page) {
                $location.path('/communities').search('page', 1);
                return;
            }

            var currentPage = $routeParams.page;
            var pageSize = 20;
            Communities.getAll({page: currentPage, page_size: pageSize}, function(data) {
                console.log('communities', data);
                $scope.communities = data.communities;
                $scope.pagination = Pagination.show(
                    '#communities-paginator', 'communities', currentPage, pageSize, data.communities.length, 10);
            }, function(data) {
                // error happend
                $rootScope.Notify.flash_add($alert, 'communities', 'Could not load list of communities', 'warning');
            });
        }
    ]
);


b2Controllers.controller('UserListCtrl', ['$scope', 'User', '$alert', '$timeout', '$rootScope', '$window', '$location',
        function($scope, User, $alert, $timeout, $rootScope, $window, $location){
    // $rootScope.PageTitle.reset();
}]);

b2Controllers.controller('UserNotifyCtrl', ['$scope', 'User', '$alert', '$timeout', '$rootScope', '$window', '$location', '$routeParams',
        function($scope, User, $alert, $timeout, $rootScope, $window, $location, $routeParams){

    $scope.group = $routeParams.group;
    // load notifications
    $scope.notifications = $rootScope.Notify.getNotifications($scope.group);

    $scope.dismiss = function(){
        // dismiss notifications
        $rootScope.Notify.dismiss();
        // reload scope
        $scope.notifications = $rootScope.Notify.getNotifications($scope.group);
    };



}]);


b2Controllers.controller('SearchCtrl', ['$scope', '$routeParams', '$location',
        function($scope, $routeParams, $location){
    // map parameter on scope
    $scope.query = $routeParams.query;

}]);

b2Controllers.controller('SearchListCtrl', ['$scope', '$routeParams', '$location',
        function($scope, $routeParams, $location){
}]);

b2Controllers.controller('RecordListCtrl', ['$scope', '$routeParams', 'Record', '$rootScope', '$alert', '$location', 'Pagination',
        function($scope, $routeParams, Record, $rootScope, $alert, $location, Pagination){
    // force page offset
    if($routeParams.page == undefined){
        $location.path('/records').search('page', 1);
        return;
    }

    // latest 20 records
    var currentPage = $routeParams.page;
    var pageSize = 20;
    Record.records({page: currentPage, page_size: pageSize, order_by: 'created_at', order: 'desc'}, function(data){
        $scope.records = data.records;
        $scope.info = data.info;
        var totalItemCnt = $scope.info.count;
        // pagination
        $scope.pagination = Pagination.show('#records-paginator', 'records', currentPage, pageSize, data.info.count, 10);
    }, function(data){
        // error happend
        $rootScope.Notify.flash_add($alert, 'records', 'Could not load latest records', 'warning');
    });
}]);



b2Controllers.controller('RecordCtrl', ['$scope', '$routeParams', 'Record', '$rootScope', '$alert', '$window',
        function($scope, $routeParams, Record, $rootScope, $alert, $window){

    // load requested record
    Record.record({uuid: $routeParams.uuid}, function(data){
        $rootScope.PageTitle.setSubject(data.record.title);
        $scope.record = data.record;
        $scope.info = data.info;
    }, function(data){
        // error handling
        $rootScope.Notify.flash_add($alert, 'record', 'Could not load record: `'+$routeParams.uuid+'`', 'warning');
        $window.history.back();
    });

}]);

b2Controllers.controller('RecordCreateCtrl', ['$scope', '$routeParams', 'Record', '$rootScope', '$alert', '$window', 'Session', 'Helper', '$timeout',
        function($scope, $routeParams, Record, $rootScope, $alert, $window, Session, Helper, $timeout){

    // file upload
    if(!$rootScope.uploadForm)
        $rootScope.uploadForm = {};
    else
        $timeout(function() {
            angular.element('.media').media();
        }, 100);
    $rootScope.uploadForm.showSubmit = false;

    $rootScope.uploadForm.submitForm = function(){
        if(!$rootScope.uploadForm.files){
            // TODO: user error feedback!
            return;
        }
        // forward to record creation page
        $location.path('/records/create');
    };
    $rootScope.uploadForm.change = function(files){
        // show preview (bind media element)
        $timeout(function() {
            angular.element('.media').media();
        }, 100);
    };
    $rootScope.uploadForm.reset = function(){
        // reset files, scroll to create record
        $rootScope.uploadForm.files = undefined;
        Helper.scrollToInvisible("#create-record-header");
    };



    var fs = $rootScope.uploadForm.files;

    console.log(fs);

}]);

