'use strict';

/* jasmine specs for controllers go here */
describe('Phonecat controllers', function(){

  beforeEach(module('phonecatApp'));


  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(e){
        return angular.equals(this.actual, e);
      }
    });
  });

  describe('PhoneListCtrl', function(){

    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller){
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('phones/phones.json').respond([
          {'name': 'Nexus S'}, {'name': 'Motorola DROID'}
        ]);
      scope = $rootScope.$new();
      ctrl = $controller('PhoneListCtrl', {$scope: scope});
    }));

    it('should create "phones" model with 2 phones fetched from xhr', function(){
      expect(scope.phones).toEqualData([]);
      $httpBackend.flush();
      expect(scope.phones).toEqualData([
        {'name': 'Nexus S'}, {'name': 'Motorola DROID'}
      ]);
    });

    it('should set the default value of orderProp model', function(){
      expect(scope.orderProp).toBe('age');
    });

  });

  describe('PhoneDetailCtrl', function(){
    var scope, ctrl, $httpBackend;

    var xyzPhoneData = function() {
      return {name: 'phone xyz', images: ['image/url1.png', 'image/url2.png']};
    };

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller){
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('phones/xyz.json').respond(xyzPhoneData());
      scope = $rootScope.$new();
      ctrl = $controller('PhoneDetailCtrl', {$scope: scope, $routeParams: {phoneId: 'xyz'}});
    }));

    it('should fetch phone detail', function(){
      expect(scope.phone).toEqualData({});
      $httpBackend.flush();
      expect(scope.phone).toEqualData(xyzPhoneData());
    });
  });

});
