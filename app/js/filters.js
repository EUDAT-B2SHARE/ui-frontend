'use strict';

/* Filters */


angular.module('phonecatFilters', []).filter('checkmark', function(){
  return function(i){ return i ? '\u2713' : '\u2718'; };
});

