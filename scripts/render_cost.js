var jsdom = require("jsdom");
var $ = require("jquery")(jsdom.jsdom().createWindow());

const PRICE = 'price';
const DATETIME = 'datetime';

const TABLE_CLASSES = 'table';
const HEAD_CLASSES = '';
const BODY_ROW_CLASSES = '';
const FOOT_CLASSES = 'danger';

module.exports = function (rootDir, dataPath) {
    dataPath = dataPath.replace(/'/g, '');
    var data = require(rootDir + dataPath);

    var table = $('<table>').addClass(TABLE_CLASSES),
        thead = $('<thead>'),
        tbody = $('<tbody>'),
        tfoot = $('<tfoot>');

    var fields = [],
        totalPrice = 0;

    function buildHead(attrs) {
        var tr = $('<tr>');
        for (var key in attrs) {
            fields.push(key);
            tr.append($('<th>').append(attrs[key]));
        }
        return tr.addClass(HEAD_CLASSES);
    }

    function buildBodyRow(entry, fields) {
        var tr = $('<tr>');
        fields.forEach(function (field) {
            tr.append($('<td>').append(entry[field]));
            if (field === PRICE) {
                totalPrice += parseInt(entry[field]);
            }
        });
        return tr.addClass(BODY_ROW_CLASSES);
    }

    function buildFoot(attrs) {
        var tr = $('<tr>');
        for (var key in attrs) {
            var content = '';
            if (key === PRICE) {
                content = totalPrice;
            }
            tr.append($('<td>').append(content));
        }
        return tr.addClass(FOOT_CLASSES);
    }

    function sortByDate(objA, objB) {
        var dateA = new Date(objA[DATETIME]);
        var dateB = new Date(objB[DATETIME]);
        return dateA.getTime() - dateB.getTime();
    }

    thead.append(buildHead(data.fields));
    data.entries.sort(sortByDate);
    data.entries.forEach(function (entry) {
        tbody.append(buildBodyRow(entry, fields));
    });
    tfoot.append(buildFoot(data.fields));

    return table.append(thead).append(tbody).append(tfoot).get(0).outerHTML;
};


