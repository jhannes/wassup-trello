/* global Trello */
"use strict";

function TrelloListHistory() {
    this.deltas = new Map();
    this.lists = new Set();
}

TrelloListHistory.prototype.getDeltas = function(date) {
    this.deltas[date] = this.deltas[date] || new Map();
    return this.deltas[date];
}

TrelloListHistory.prototype.addToList = function(list, card, date) {
    var delta = this.getDeltas(date);
    this.lists.add(list);
    delta[list] = delta[list] + 1 || +1;    
}
TrelloListHistory.prototype.removeFromList = function(list, card, date) {
    var delta = this.getDeltas(date);
    delta[list] = delta[list] - 1 || -1;    
}

TrelloListHistory.prototype.getDates = function() {
    var dates = [];
    for (var date in this.deltas) {
        dates.push(date);
    }
    dates.sort();    
    return dates;
}
TrelloListHistory.prototype.getCounts = function() {
    var result = new Map();
    var dates = this.getDates();
    var currentValues = new Map();
    for (var date of dates) {
        result[date] = new Map();
        for (var list of this.lists) {
            currentValues[list] = (currentValues[list]||0) + (this.deltas[date][list] || 0);
            result[date][list] = currentValues[list];
        }
    }
    return result;
}
TrelloListHistory.prototype.toAxes = function() {
    var counts = this.getCounts();
    var stats = [];
    
    var x = ["x"];
    for (var date in counts) {
        x.push(date);      
    }
    stats.push(x);

    for (var list of this.lists) {
        var listStats = [list];
        for (var date in counts) {
            listStats.push(counts[date][list]);
        }
        stats.push(listStats);
    }
    return stats;
}


function trelloStats(board, callback) {
    Trello.get('/boards/' + board + '/actions?filter=updateCard,createCard,deleteCard').then(function (data) {
        //data.sort((a,b) => a.date.localeCompare(b.date));
        
        var history = new TrelloListHistory();
        data.forEach(function (action) {
            var date = action.date.substr(0, 10);
            if (action.data.listAfter) {
                history.removeFromList(action.data.listBefore.name, action.data.card.id, date);
                history.addToList(action.data.listAfter.name, action.data.card.id, date);
            }
            if (action.type === "createCard") {
                history.addToList(action.data.list.name, action.data.card.id, date);
            }
            if (action.type === "deleteCard") {
                history.removeFromList(action.data.list.name, action.data.card.id, date);
            }
        });
        //console.log(history.getCounts());
        callback(history.toAxes());
    });
}

if (typeof module !== 'undefined') {
  module.exports = {
    TrelloListHistory: TrelloListHistory
  };
}