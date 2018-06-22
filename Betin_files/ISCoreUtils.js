(function(w){
    var iSBetsCore = w.GetISBetsCoreInstance();
    iSBetsCore.Utils = iSBetsCore.Utils || {};
    var _this = iSBetsCore.Utils;

    _this.httpGetAsync = function (theUrl, value, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(JSON.parse(xmlHttp.responseText));
        }
        xmlHttp.open("POST", theUrl, true); // true for asynchronous 
        xmlHttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xmlHttp.send(JSON.stringify(value));
        return xmlHttp
    };

    _this.isElement = function (obj) {
        try {
            //Using W3 DOM2 (works for FF, Opera and Chrom)
            return obj instanceof HTMLElement;
        }
        catch (e) {
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have. (works on IE7)
            return (typeof obj === "object") &&
            (obj.nodeType === 1) && (typeof obj.style === "object") &&
            (typeof obj.ownerDocument === "object");
        }
    };   


    //estensioni jQuery
    _this.isOnScreen = function (selector) {
        var win = $(window);
        var element = $(selector)

        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = element.offset();
        if ((bounds == null) || (typeof (bounds) == 'undefined')) return true

        bounds.right = bounds.left + element.outerWidth();
        bounds.bottom = bounds.top + element.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    };

    _this.isOnScreenByID = function (idElement) {
        return _this.isOnScreen("#" + idElement);
    };

    _this.isVisible = function (elementID) {
        return (_this.isOnScreenByID(elementID) && _this.isShown(elementID));
    };

    _this.isShown = function (elementID) {

        var elementDOM = document.getElementById(elementID);
        if (!elementDOM) { return false; }
        var elementPos = elementDOM.getBoundingClientRect();

        var offset = 100;

        for (var y = 0; y <= elementPos.height; y = y + offset) {
            for (var x = 0; x <= elementPos.width; x = x + offset) {
                var currentX = x + elementPos.left;
                var currentY = y + elementPos.top;
                if ((currentX <= (x + elementPos.width)) || (currentY <= (y + elementPos.height))) {
                    var elementInPos = document.elementFromPoint(currentX, currentY);
                    var isVisible = ((elementInPos == null) || (elementInPos === elementDOM) || ($.contains(elementDOM, elementInPos)));
                    if (isVisible) return true
                }
            }
        }
        return false
    };

    _this.sendEvent = function (eventName, data) {        
        $('body').trigger(eventName, data);        
    };

    _this.getEvent = function (eventName, eventFunc) {        
        return $('body').bind(eventName, eventFunc);
    };

    _this.parseJSONDate = function (date) {
        return new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
    };

    _this.stringTrim = function(string){
        var stringTrimRegex = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;     
        return (string || "").replace(stringTrimRegex, "");
    };

    _this.parseJSON = function (jsonString) {
        if (typeof jsonString == "string") {
            jsonString = _this.stringTrim(jsonString);
            if (jsonString) {
                if (window.JSON && window.JSON.parse) // Use native parsing where available
                    return window.JSON.parse(jsonString);
                return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
            }
        }
        return null;
    };

    _this.stringifyJSON=  function (data, replacer, space) {   // replacer and space are optional
        if ((typeof JSON == "undefined") || (typeof JSON.stringify == "undefined"))
            throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
        return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
    };

    _this.saveToBrowserStorage = function (key, object) {        
        if (typeof w.localStorage !== 'undefined') {
            var storage = w.localStorage;
            storage.setItem(key, JSON.stringify(object));
            return true
        };
        return false
    };

    _this.getFromBrowserStorage = function (key) {        
        if (typeof w.localStorage !== 'undefined') {
            var storage = w.localStorage;
            var object = storage.getItem(key);
            return (typeof object !== 'undefined') ? JSON.parse(object) : null;
        };
        return null
    };

    _this.removeFromBrowserStorage = function (key) {
        if (typeof w.localStorage !== 'undefined') {
            var storage = w.localStorage;
           storage.removeItem(key);
           return true
        };
        return false
    };
    
    _this.getFormattedDate = function (value, format) {
        var date = new Date(_this.parseJSONDate(value));

        format = format.replace(new RegExp("GG", "g"), iSBetsCore.Sport.contents.daysNamesList[date.getDay()]);
        format = format.replace(new RegExp("gg", "g"), iSBetsCore.Sport.contents.shortDaysNamesList[date.getDay()]);
        format = format.replace(new RegExp("dd", "g"), date.getDate());

        format = format.replace(new RegExp("MM", "g"), iSBetsCore.Sport.contents.monthsNamesList[date.getMonth()]);
        format = format.replace(new RegExp("mm", "g"), iSBetsCore.Sport.contents.shortMonthsNamesList[date.getMonth()]);
        format = format.replace(new RegExp("MN", "g"), date.getMonth() + 1);

        format = format.replace(new RegExp("YY", "g"), date.getFullYear());
        
        return format;
    }


})(window)

