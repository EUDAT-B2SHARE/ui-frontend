'use strict';

/* Filters */

angular.module('phonecatFilters', []).filter('checkmark', function(){
  return function(i){ return i ? '\u2713' : '\u2718'; };
});

// map filter for {deposits: [{deposit: {}}, {deposit: {}, ...}]}
angular.module('phonecatFilters', []).filter('compact', function(){
  return function(ds) {
    return $.map(ds, function(val, i){
      return val.deposit;
    });
  }
});

// angular.module('phonecatFilters', []).filter('parameters', function(){
//   return function(bc) {
//     return $.map(bc, function(val, i){
//       if(val.href.startsWith("#/deposits")){
//         if(val.href.includes("page"))
//           return a;
//       }
//       return val;
//     });
//   }
// });


