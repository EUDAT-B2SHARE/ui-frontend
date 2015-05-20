'use strict';

/* Animations Module */

var b2Animations = angular.module('b2Animations', ['ngAnimate', 'mgcrea.ngStrap']);


b2Animations.animation('.am-fade-and-slide-top', function(){
	var animateUp = function(element, className, done){
		element.css({position: 'absolute', top: 500, left: 0, display: 'block'});
		jQuery(element).animate({top: 0}, done);
	};
	return {addClass: animateUp};
});


// phonecatAnimations.animation('.phone', function(){
//   var animateUp = function(element, className, done){
//     if(className != 'active'){
//       return;
//     }
//     element.css({position: 'absolute', top: 500, left: 0, display: 'block'});
//     jQuery(element).animate({top: 0}, done);
//     return function(cancel){
//       if(cancel){
//         element.stop();
//       }
//     };
//   };

//   var animateDown = function(element, className, done){
//     if(className != 'active'){
//       return;
//     }
//     element.css({position: 'abosolute', left: 0, top: 0});
//     jQuery(element).animate({top: -500}, done);
//     return function(cancel){
//       if(cancel){
//         element.stop();
//       }
//     };
//   };

//   return { addClass: animateUp, removeClass: animateDown };

// });
