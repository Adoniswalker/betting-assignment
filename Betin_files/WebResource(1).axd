//ISBetsCore
(function (w) {

    var ISBetsMainCore = function () {
        var _this = this;

        var _immutables = {
            DEBUG_MODE: false
        };

        var _stringCollection = [];

        var _mergeArray = function () {
            var ret = {};
            var len = arguments.length;
            for (var i = 0; i < len; i++) {
                for (p in arguments[i]) {
                    if (arguments[i].hasOwnProperty(p)) {
                        ret[p] = arguments[i][p];
                    }
                }
            }
            return ret;
        };

        //Debug Area
        var _debug = {
            _writeLog: function (message) {
                if (_immutables.DEBUG_MODE)
                    console.log(message);
            }
        };

        var _private = {
            _isPostBack: false
        };

        //Public Property 
        _this.config = {
            idPalimpsest: 0,
            idPalimpsestLive: 0,
            idBookmaker: 0,
            idLanguage: 0,
            idGmt: 0,
            idCurrency: 0,
        };

        _this.currentDomain = {
            currentThemePath: '',
            currenteTheme: ''
        };

        _this.profile = {
            userID: 0,
            isAnonymous: true
        };

        _this.content = {
            addStringList: function (objString) {
                _stringCollection = _mergeArray(_stringCollection, objString);
            },
            addString: function (key, value) {
                _stringCollection[key] = value;
            },
            getString: function (key) {
                return _stringCollection[key];
            }
        };

        _this.page = {
            isPostBack: function () {
                return _private._isPostBack;
            }
        };


        //Initialize Area
        _this.Initialize = function (objConfig) {
            _debug._writeLog("Initializing iSBetsCore...");

            _this.config.idBookmaker = objConfig.idBookmaker;
            _this.config.idPalimpsest = objConfig.idPalimpsest;
            _this.config.idPalimpsestLive = objConfig.idPalimpsestLive;
            _this.config.idLanguage = objConfig.idLanguage;
            _this.config.idGmt = objConfig.idGmt;
            _this.config.idCurrency = objConfig.idCurrency;

            _this.currentDomain.currenteTheme = objConfig.currenteTheme;
            _this.currentDomain.currentThemePath = objConfig.currentThemePath;

            _this.profile.userID = objConfig.userID;
            _this.profile.isAnonymous = objConfig.isAnonymous;

            _private.isPostBack = objConfig.isPostBack;
        };
    }

    var APPLICATION_NAME = 'iSBetsCore';

    var iSBetsCore = w[APPLICATION_NAME] = new ISBetsMainCore();

    //Get ISBets Core Instance
    w['GetISBetsCoreInstance'] = function () {
        var currentInstance = window[APPLICATION_NAME];
        return (typeof currentInstance !== 'undefined') ? currentInstance : null;
    }
})(window);



// INITIALIZER
(function (w) {

    var controlsInitializer = function () {
        var _this = this;
        var _controls = [];
        var _registeredControls = [];

        var _util = {
            _onReady: function (callback) {

                var addListener = document.addEventListener || document.attachEvent;
                var eventName = document.addEventListener ? "DOMContentLoaded" : "onreadystatechange";

                addListener.call(document, eventName, function () {
                    callback();
                }, false);
            }
        };

        var _private = {
            _initializeControls: function () {

                for (var i = 0; i < _controls.length; i++) {
                    var currentControl = _controls[i];
                    var baseObject = _private.getControlInstance(currentControl.appName);

                    if ((baseObject) && (baseObject.Initialize)) {
                        baseObject.Initialize(currentControl.appConfiguration);
                    }
                }
            },
            initialize: function () {
                _util._onReady(_private._initializeControls);
            },
            registerNewControlScript: function (controlName, controlClass) {
                _registeredControls[controlName] = controlClass;
            },
            getControlInstance: function (controlName) {
                if (typeof _registeredControls[controlName] === 'function') {
                    return new _registeredControls[controlName]();
                } else {
                    return null
                };
            }
        };

        //ClientControlScriptRegistration
        //@scriptName : nome del controllo
        //@scriptClass : classe base del controllo.
        _this.ClientControlScriptRegistration = function (scriptName, scriptClass) {
            _private.registerNewControlScript(scriptName, scriptClass);
        };

        _this.AddInitializeOptions = function (controlName, controlConfiguration) {
            _controls.push({ appName: controlName, appConfiguration: controlConfiguration });
        };
              
        //Initialize Controls
        _private.initialize()
    };

    //Startup Controls  
    var initializer = w['initializer'] = new controlsInitializer();
    w['GetInitializerInstance'] = function () {
        var currentInstance = initializer;
        return (typeof currentInstance !== 'undefined') ? currentInstance : null;
    };
    
})(window);



(function (w) {
    var CommonAngularModule = function (w) {
        var _this = this;

        var angularModule = 'iSBetsAngularModule';
        var iSBetsCore = w.GetISBetsCoreInstance();
        var moduleInstance = null;

        var utils = {
            isVisible: function (elementID) {
                return (utils.isOnScreenByID(elementID) && utils.isShown(elementID));
            },
            isOnScreenByID: function (elementID) {

                var win = $(w);
                var element = $("#" +elementID);

                var viewport = {
                    top: win.scrollTop(),
                        left: win.scrollLeft()
                };
                viewport.right = viewport.left + win.width();
                viewport.bottom = viewport.top +win.height();

                var bounds = element.offset();
                if ((bounds == null) || (typeof (bounds) == 'undefined')) return true

                bounds.right = bounds.left + element.outerWidth();
                bounds.bottom = bounds.top +element.outerHeight();

                return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
            },
            isShown: function(elementID) {    
                var elementDOM = document.getElementById(elementID);
                if (!elementDOM) { return false; }
                var elementPos = elementDOM.getBoundingClientRect();

                var offset = 100;

                for (var y = 0; y <= elementPos.height; y = y + offset) {
                    for (var x = 0; x <= elementPos.width; x = x + offset) {
                        var currentX = x + elementPos.left;
                        var currentY = y + elementPos.top;
                        if ((currentX <= (x +elementPos.width)) || (currentY <= (y +elementPos.height))) {
                            var elementInPos = document.elementFromPoint(currentX, currentY);
                            var isVisible = ((elementInPos == null) || (elementInPos === elementDOM) || ($.contains(elementDOM, elementInPos)));
                            if (isVisible) return true
                        }
                    }
                }
                return false
            }
        };

        var _private = {
            updateData: {
                updateHndlr:  null,
                registeredControlsUpdate: [],
                registerControlUpdate: function (updateFunction, interval, idElementDOM, alwaysUpdate, $timeout) {

                    if (interval <= 0) {
                        updateFunction();
                        return
                    };

                    var hndlrUpdateData = null;
                    var updateData = function () {
                        var currentControlDetail = _private.updateData.getControlData(idElementDOM);                        
                        updateFunction(function () {
                            if (currentControlDetail.alwaysUpdate || (currentControlDetail.isOnScreen)) {
                                $timeout.cancel(hndlrUpdateData);
                                hndlrUpdateData = $timeout(updateData, interval);
                                currentControlDetail.isPolling = true;
                            } else {                                
                                currentControlDetail.isPolling = false;
                            }                            
                        }, function () {
                            $timeout.cancel(hndlrUpdateData);
                            currentControlDetail.isPolling = false;
                            currentControlDetail.errorData = true;
                        });                                                   
                    };

                    var newControlUpdate = {
                        applicationID: idElementDOM,
                        elementID: idElementDOM,
                        alwaysUpdate: alwaysUpdate,
                        updateFunction: updateData,
                        interval: interval,
                        isOnScreen: true,
                        isPolling: false,
                        errorData: false                        
                    };

                    _private.updateData.registeredControlsUpdate.push(newControlUpdate);
                         
                    if (_private.updateData.updateHndlr == null) {
                        var checkControl = function () {
                            var registeredControlsList = _private.updateData.registeredControlsUpdate;

                            for (var i = 0; i < registeredControlsList.length; i++) {
                                var currentControl = registeredControlsList[i];                                                             
                                _private.updateData.refreshControlStatus(currentControl);
                            }
                        };
                        _private.updateData.updateHndlr = w.setInterval(checkControl, 1000);
                    };
                   
                    if (!newControlUpdate.isPolling) newControlUpdate.updateFunction();

                },
                refreshControlStatus: function (currentControl) {
                    currentControl.isOnScreen = utils.isVisible(currentControl.elementID);

                    if (currentControl.errorData) return;
                    if ((!currentControl.isPolling) &&
                            (currentControl.alwaysUpdate || currentControl.isOnScreen)) {
                        currentControl.updateFunction();
                    };
                },
                getControlData: function (applicationID) {
                    var registeredControlsList = _private.updateData.registeredControlsUpdate;
                    for (var i = 0; i < registeredControlsList.length; i++) {
                        var currentControl = registeredControlsList[i];
                        if (currentControl.applicationID == applicationID) return currentControl;
                    }
                    return null
                }
            }
            
        };

        var angularDefs = {
            directive: [],
            services: [],
            filters: []
        };

        var _existAngularInstance = function () {
            var ng = w.angular;
            if (typeof ng !== 'undefined') {
                var module;
                try {
                    module = ng.module(angularModule);
                } catch (err) { module = null; }

                return (module != null)
            }
            return false
        };

        var _initModule = function () {
            var ng = w.angular;
            if (typeof ng === 'undefined') return false;
            var isCore = w['iSBetsCore'];

            moduleInstance = ng.module(angularModule, []);

            // GLOBAL DIRECTIVE
            _this.AddDirective({
                name: 'ngTextdb',
                func: function () {
                    function link(scope, element, attrs) {
                        var codeStr = attrs['ngTextdb'];
                        element.text(isCore.content.getString(codeStr));
                    }
                    return {
                        link: link
                    };
                }
            });
            _this.AddDirective({
                name: 'isTextdb',
                func: function () {
                    function link(scope, element, attrs) {
                        var codeStr = attrs['isTextdb'];
                        element.text(isCore.content.getString(codeStr));
                    };
                    return {
                        link: link
                    };
                }
            });

            _this.AddDirective({
                name: 'isExtend',
                func: function () {
                    function link(scope, element, attrs) {
                        if ((element.length) && (element.length > 0)) {
                            var elementTag = (element.length > 0) ? element[0].tagName : null;
                            var elementType = (element.length > 0) ? element[0].type : null;
                            var functionName = attrs.isExtend;
                            if ((typeof w[functionName] == 'function') &&
                                (elementTag == 'INPUT') &&
                                (elementType == 'hidden')) {
                                w[functionName](scope);
                                element.val("extended");
                            } else {
                                element.val("not extended");
                            }
                        }
                    };
                    return {
                        restrict: 'A',
                        link: link
                    };
                }
            });


            // GLOBAL SERVICES
            _this.AddService({
                name: '$utils', 
                func: function ($timeout) {
                    return {
                        registerUpdate: function (updateControlsFunc, interval, idElementDOM, alwaysUpdate) {                           

                            _private.updateData.registerControlUpdate(updateControlsFunc, interval, idElementDOM, alwaysUpdate, $timeout);
                        }

                    }
                }
            });

            //GLOBAL FILTERS
            _this.AddFilters({
                name: 'reverse',
                func: function () {
                    return function (items) {
                        return items.slice().reverse();
                    };
                }
            });


            for (var i = 0; i < angularDefs.directive.length; i++) {
                var currentItem = angularDefs.directive[i];
                moduleInstance.directive(currentItem.name, currentItem.func);
            };

            for (var i = 0; i < angularDefs.services.length; i++) {
                var currentItem = angularDefs.services[i];

                moduleInstance.factory(currentItem.name, currentItem.func);
            };

            for (var i = 0; i < angularDefs.filters.length; i++) {
                var currentItem = angularDefs.filters[i];
                moduleInstance.filter(currentItem.name, currentItem.func);
            };

            return (moduleInstance != null)
        };

        //Public Method
        _this.AddDirective = function (objItem) {
            angularDefs.directive.push(objItem);
        };

        _this.AddService = function (objItem) {
            angularDefs.services.push(objItem);
        };

        _this.AddFilters = function (objItem) {
            angularDefs.filters.push(objItem);
        };

        _this.getModule = function () {
            if (!_existAngularInstance()) {
                return (_initModule()) ? angularModule : null;
            }
            return angularModule
        };
    };

    var isBetsAngularModule = w['isBetsAngularModule'] = new CommonAngularModule(w);
    w['GetISBetsAngularModule'] = function () {
        var currentInstance = isBetsAngularModule;
        return (typeof currentInstance !== 'undefined') ? currentInstance : null;
    };
})(window);



