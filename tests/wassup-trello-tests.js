/* global expect */

if (typeof require !== 'undefined') {
  var expect = require('chai').expect;
  var TrelloListHistory = require('../wassup-trello').TrelloListHistory;
}

describe('trello reports', function() {
    
    it("groups by date", function() {
        var history = new TrelloListHistory();
        history.addToList("todo", "some action", "2016-02-10");
        history.addToList("todo", "some other action", "2016-02-14");
        expect(history.getCounts()).to.contain.keys("2016-02-10", "2016-02-14");
    });
    
    it("groups by list", function() {
        var history = new TrelloListHistory();
        history.addToList("todo", "some action", "2016-02-10");
        history.addToList("doing", "some other action", "2016-02-10");
        expect(history.getCounts()["2016-02-10"]).to.contain.keys("todo", "doing");        
    });
    
});
