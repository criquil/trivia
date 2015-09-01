var ObserverList = (function () {
    var observerList = new Array();

    function _add(obj) {
        return observerList.push(obj);
    };

    function _count() {
        return observerList.length;
    };

    function _get(index) {
        if (index > -1 && index < observerList.length) {
            return observerList[index];
        }
    };

    function _indexOf(obj, startIndex) {
        var i = startIndex;

        while (i < observerList.length) {
            if (observerList[i] === obj) {
                return i;
            }
            i++;
        }

        return -1;
    };

    function _removeAt(index) {
        observerList.splice(index, 1);
    };

    return {
        add: _add,
        count: _count,
        get: _get,
        indexOf: _indexOf
    };
})();

exports.ObserverList = ObserverList;