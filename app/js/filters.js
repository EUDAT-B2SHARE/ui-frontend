'use strict';

/* Filters */

var b2Filters = angular.module('b2Filters', []);

b2Filters.filter('checkmark', function(){
    return function(i){ return i ? '\u2713' : '\u2718'; };
});

// map filter for {records: [{record: {}}, {record: {}, ...}]}
b2Filters.filter('compact', function(){
    return function(ds) {
        if (ds)
            return $.map(ds, function(val, i){
                return val.record;
            });
    };
});

// reverse array with objects (sort by key)
b2Filters.filter('reverse', function(){
    return function(dict, key) {
        if (dict)
            return dict.sort(function(a,b){
                var ka = a[key];
                var kb = b[key];
                if(kb < ka) return -1;
                else if(kb > ka) return 1;
                return 0;
            });
    };
});

b2Filters.filter('size_byte2kilobyte', function(){
    return function(val) {
        return Math.round(val / 1024);
    };
});
