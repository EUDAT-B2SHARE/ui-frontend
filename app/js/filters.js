'use strict';

/* Filters */

angular.module('b2Filters', []).filter('checkmark', function(){
  return function(i){ return i ? '\u2713' : '\u2718'; };
});

// map filter for {deposits: [{deposit: {}}, {deposit: {}, ...}]}
angular.module('b2Filters', []).filter('compact', function(){
  return function(ds) {
  	if(ds != undefined)
	    return $.map(ds, function(val, i){
	      return val.deposit;
	    });
  }
});

