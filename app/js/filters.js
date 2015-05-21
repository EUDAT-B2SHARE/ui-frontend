'use strict';

/* Filters */

var b2Filters = angular.module('b2Filters', []);

b2Filters.filter('checkmark', function(){
  return function(i){ return i ? '\u2713' : '\u2718'; };
});

// map filter for {deposits: [{deposit: {}}, {deposit: {}, ...}]}
b2Filters.filter('compact', function(){
  return function(ds) {
    if(ds != undefined)
      return $.map(ds, function(val, i){
        return val.deposit;
      });
  }
});

// reverse array with objects (sort by key)
b2Filters.filter('reverse', function(){
  return function(dict, key) {
    if(dict != undefined)
      return dict.sort(function(a,b){
        var ka = a[key];
        var kb = b[key];
        if(kb < ka) return -1;
        else if(kb > ka) return 1;
        return 0;
      });
  }
});