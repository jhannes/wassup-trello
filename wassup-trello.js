/* global Trello */
function trelloStats(board, callback) {
    var stats = {};
    var lists = new Set();
    Trello.get('/boards/' + board + '/actions?filter=updateCard,createCard,deleteCard').then(function (data) {

        var deltas = {};
        data.forEach(function (action) {
            var date = action.date.substr(0, 10);
            deltas[date] = deltas[date] || {};
            if (action.data.listAfter) {
                lists.add(action.data.listAfter.name);
                deltas[date][action.data.listBefore.name] = deltas[date][action.data.listBefore.name] - 1 || -1;
                deltas[date][action.data.listAfter.name] = deltas[date][action.data.listAfter.name] + 1 || +1;
            }
            if (action.type === "createCard") {
                lists.add(action.data.list.name);
                deltas[date][action.data.list.name] = deltas[date][action.data.list.name] + 1 || +1;
            }
            if (action.type === "deleteCard") {
                deltas[date][action.data.list.name] = deltas[date][action.data.list.name] - 1 || -1;
            }
        });

        stats["x"] = [];
        var currents = [];
        for (var list of lists) {
            stats[list] = [];
            currents[list] = 0;
        }
        var dates = [];
        for (var date in deltas) {
            dates.push(date);
        }
        dates.sort();

        for (var date of dates) {
            stats["x"].push(date);
            for (var list of lists) {
                currents[list] += deltas[date][list] || 0;
                stats[list].push(currents[list]);
            }
        }

        var data = [];
        for (var axis in stats) {
            var axisData = [axis];
            for (var item of stats[axis]) {
                axisData.push(item);
            }
            data.push(axisData);
        }
        callback(data);
    });
}
