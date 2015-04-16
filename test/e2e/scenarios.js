'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */




describe('PhoneCat App', function(){

  it('should redirect index.html to index.html#/phones', function(){
    browser.get('app/index.html');
    browser.getLocationAbsUrl().then(function(url){
      expect(url.split('#')[1]).toBe('/phones');
    });
  });

  describe('Phone list view', function(){

    beforeEach(function(){
      browser.get('app/index.html#/phones');
    });

    it('should be possible to control phone order via the drop down select box', function(){
      var phoneNameColumn = element.all(by.repeater('phone in phones').column('phone.name'));
      var query = element(by.model('query'));

      function getNames(){
        return phoneNameColumn.map(function(e){ return e.getText(); });
      }

      // search for nexus
      query.sendKeys('nexus');
      expect(getNames()).toEqual(["Nexus S"]);
      query.clear();

      // order by first
      element(by.model('orderProp')).element(by.css('option[value="name"]')).click();
      expect(getNames()).toContain("Dell Streak 7");
      expect(getNames()).toContain("Dell Venue");
    });

    it('should render phone specific links', function(){
      var query = element(by.model('query'));
      query.sendKeys('nexus');
      element.all(by.css('.phones li a')).first().click();
      browser.getLocationAbsUrl().then(function(url){
        expect(url.split('#')[1]).toBe('/phones/nexus-s');
      });
    });
  });

  describe('Phone detail view', function(){
    beforeEach(function(){
      browser.get('app/index.html#/phones/nexus-s');
    });

    it('should display nexus-s page', function(){
      expect(element(by.binding('phone.name')).getText()).toBe('Nexus S');
    });

    it('should display details with four images', function(){
      expect(element.all(by.css('.phone-tumbs li img')).count()).toBe(4);
    });

    it('should display the first pone image as the main phone image', function(){
      expect(element(by.css('img.phone')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
    });

    it('should swap main image if a thumbnail image is clicked', function(){
      element(by.css('.phone-tumbs li:nth-child(3) img')).click();
      expect(element(by.css('img.phone')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);
      element(by.css('.phone-tumbs li:nth-child(1) img')).click();
      expect(element(by.css('img.phone')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
    });

  });

});