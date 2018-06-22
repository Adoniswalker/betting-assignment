(function (w) {

    var sportMenuApp = function () {
        var _this = this;

        var _immutables = {
            WEBSERVICE: { SPORTLIST: 'GetPalimpsest' },
            BASE_CONTROLLER: 'userController',
            DEBUG_MODE: false,
        };

        var _configuration = {
            objConfiguration: null, isCoreInstance: null, ApplicationId: '', templateUrl: '', showSportImage: false, showGroupImage: false
        };
        var _utils = {
            oddsViewMode: function () {                
                return (!!w['OddsViewMode']);
            }
        }
        var _handler = { hndlrUpdateData: null };
        var _ngInstance = null;

        var _writeLog = function (message) {
            if (_immutables.DEBUG_MODE)
                console.log(message);
        };

        //Initialize         
        _this.Initialize = function (objConfiguration) {
            _writeLog("Initializing SportMenu controls...");

            var iSBetsCore = w.GetISBetsCoreInstance();
            var angularModule = w.GetISBetsAngularModule();

            if (typeof iSBetsCore != 'object') {
                _writeLog("iSBetsCore instance not found");
                return;
            }

            //set configuration value	     	        
            _configuration.ApplicationId = objConfiguration.ApplicationId;
            _configuration.templateUrl = objConfiguration.templateUrl;            
            _configuration.showSportImage = objConfiguration.showSportImage;
            _configuration.showGroupImage = objConfiguration.showGroupImage;       
                        
            //ISBetsCore Instance
            _configuration.isCoreInstance = iSBetsCore;

            //Initialize App
            _ngInstance = angular.module(_configuration.ApplicationId, ['ngAnimate', angularModule.getModule()]);

            var _util = {
                isSelectedSport : function (idSport, antepost, openSportList) {                                        
                    for (var i = 0; i < openSportList.length; i++) {
                        var currentSport = openSportList[i];
                        if ((currentSport.idSport == idSport) && (currentSport.antepost == antepost))
                            return true;                                            
                    }
                    return false;
                },
                openSelected: function (scope) {
                    var sportList = scope.SportList;
                    for (var i = 0; i < sportList.length; i++) {
                        var currentSport = sportList[i];
                        if (_util.isSelectedSport(currentSport.IDSport, currentSport.Antepost, scope.openSportList))
                            currentSport.selectedMenu = true;

                        for (var j = 0; j < currentSport.GroupList.length; j++) {
                            var currentGroup = currentSport.GroupList[j];
                            for (var x = 0; x < currentGroup.EventList.length; x++) {
                                var currentEvent = currentGroup.EventList[x];
                                var idEvento = currentEvent.IDEvento;                                
                                if ((scope.selectedEvents.indexOf(idEvento.toString()) >= 0)||
                                     (scope.selectedEvents.indexOf(Number(idEvento)) >= 0)) {
                                    currentSport.selectedMenu = true;
                                    currentGroup.selectedMenu = true;
                                };
                            };
                        };
                    };                                        
                    return sportList;
                },
                getPalimpsest: function (scope, timeout) {
                    _handler.hndlrUpdateData =
                        iSBetsCore.Sport.method.palimpsest.getPalimpsest(
                                function (typeVisualization, sportList) {
                                    scope.loading = false;
                                    scope.retreiveDataComplete = true;
                                    scope.typeVisualization = typeVisualization;
                                    scope.SportList = sportList
                                    _util.openSelected(scope, sportList);                                    
                                    
                                    timeout(function () { }, 0);
                                },
                                function (error) {
                                    scope.loading = false;
                                });
                },
                openSport: function (objSport, scope) {                               
                    var listSport = [];
                    listSport.push(objSport);
                    for (var i = 0; i < scope.SportList.length; i++) {
                        var currentSport = scope.SportList[i];                        
                        if (_util.isSelectedSport(currentSport.IDSport, currentSport.Antepost, listSport))
                            currentSport.selectedMenu = true;
                    };                    
                },
                listenCommand: function (scope, timeout) {
                    iSBetsCore.Utils.getEvent("SportMenu_setSport", function (evt, data) {
                         var objSport = data;
                         if ((scope.retreiveDataComplete) && (typeof objSport === 'object')) {
                             _util.openSport(objSport, scope);
                             timeout(function () { }, 0);
                        } else {
                            scope.openSportList.push(objSport);
                        };                                                
                    });
                }
            };
                          
            //Add Controller
            _ngInstance.controller(_immutables.BASE_CONTROLLER, function ($scope, $http, $timeout, $utils) {

                $scope.SportList = [];
                $scope.retreiveDataComplete = false;
                $scope.openSportList = [];
                $scope.selectedEvents = iSBetsCore.Sport.method.palimpsest.getActualSubEventsList(_utils.oddsViewMode());
                $scope.templatePath = _configuration.templateUrl;
                $scope.showSportImage = objConfiguration.showSportImage;
                $scope.showGroupImage = objConfiguration.showGroupImage;
                $scope.loading = true;
                             
                _util.getPalimpsest($scope, $timeout);
                _util.listenCommand($scope, $timeout);

                var updateEventList = function () {                    
                    var currentEvents = iSBetsCore.Sport.method.palimpsest.getActualSubEventsList(_utils.oddsViewMode());
                    $scope.selectedEvents = (currentEvents == null) ? [] : currentEvents;
                    $timeout(function () { }, 0);
                };

                iSBetsCore.Sport.method.bindEvents.onCloseSubEvent(updateEventList);
                iSBetsCore.Sport.method.bindEvents.onEventClose(updateEventList);                
                iSBetsCore.Sport.method.bindEvents.onEventComplete(updateEventList);
                iSBetsCore.Sport.method.bindEvents.onEventComplete(function () {
                    _util.openSelected($scope);
                });

                iSBetsCore.Sport.method.bindEvents.onChangeTypeVisualization(function (data) {
                    _util.getPalimpsest($scope, $timeout);
                });
                $scope.openLive = function () {
                    iSBetsCore.Sport.method.actionLink.openLivePage();
                };
                $scope.toggleMenu = function (item) {                    
                    _writeLog("toggleMenu");
                    item.selectedMenu = !item.selectedMenu;
                };
                $scope.openGroupDetail = function () {
                    var itemSport = this.itemSport;
                    if (typeof itemSport == 'object') {
                        var sportID = itemSport.IDSport;
                        var antepost = itemSport.Antepost;

                        iSBetsCore.Sport.method.actionLink.openGroupDetail(sportID, antepost);
                    };
                };
                $scope.isSelected = function (idEvento) {

                    if ((typeof $scope.selectedEvents !== 'undefined') && (typeof $scope.selectedEvents.indexOf === 'function')) {
                        return (($scope.selectedEvents.indexOf(Number(idEvento)) > -1) ||
                            ($scope.selectedEvents.indexOf(idEvento.toString()) > -1));
                    };
                    return false;
                };
                $scope.openEvent = function () {
                    _writeLog("openEvent");                   
                    var eventID = this.itemEvent.IDEvento;
                    var currentEvents = (_utils.oddsViewMode()) ? iSBetsCore.Sport.method.palimpsest.loadSubevent(eventID) : iSBetsCore.Sport.method.palimpsest.loadAsyncSubevent(eventID);
                    if (!_utils.oddsViewMode()) { $scope.selectedEvents = (currentEvents == null) ? [] : currentEvents; }
                };

            });

            //Manually start Angular application
            angular.bootstrap(w.document.getElementById(_configuration.ApplicationId), [_configuration.ApplicationId]);
        };
    };

    var isCoreInitializer = w.GetInitializerInstance();
    isCoreInitializer.ClientControlScriptRegistration('SportMenu', sportMenuApp);
})(window);

