(function (w) {
    var livebetting = function () {
        var _this = this;

        var _immutables = {
            WEBSERVICE: { SPORTLIST: 'Live_getSportList' },
            BASE_CONTROLLER: 'userController',
            DEBUG_MODE: false,
        };

        var _configuration = {
            objConfiguration: null, w: null, isCoreInstance: null, ApplicationId: '',
            templateUrl: '', wsUrl: '', livePath: '', interval: 0, LimitBRWidgetSportTypeID: [],
            updateEventOnSportTypeChange: false
        };
        var _widgetConfig = {
            name: 'widgets.lmts',
            config: {
                container: '.lmts-container',
                matchId: 'idContainer_testIdContainer',
                sidebarLayout: 'dynamic',
                showMomentum: false,
                showSidebar: false,
                showStats: false,
                collapse_startCollapsed: true,
                pitchCrowd: true
            }
        }
        var _serviceParams = { IDBookmaker: 0, IDLingua: 0, idGMT: 0, ShowUpcoming: 0, NumEventi: 0, NumEventiUpcoming: 0 };
        var _handler = { hndlrUpdateData: null };
        var _ngInstance = null;

        var _writeLog = function (message) {
            if (_immutables.DEBUG_MODE)
                console.log(message);
        };

        var _betRadar = {
            isBetradarEnabled: function () {         
                return ((_configuration.enableBRTrackerWidget) && (typeof SRLive === 'object'))
            },
            searchFirstEventTraked: function (scope) {
                var tipisport = scope.TipiSportList;
                for (var i = 0; i < tipisport.length; i++) {
                    var currIDTipoSport = tipisport[i].IDTipoSport;
                    var listaeventi = scope.listSports[currIDTipoSport].LiveEvents;

                    for (var j = 0; j < listaeventi.length; j++) {
                        var currEvent = listaeventi[j];
                        if (_betRadar.isMatchIDvalid(currEvent.BrMatchID, currEvent.IDTipoSport)) {
                            return currEvent;
                        }
                    }
                };
                return null;
            },
            getScript: function (onSuccess, onDone, onFail) {
                $.getScript(iSBetsCore.Sport.externalPages.BRTrackerWidget, onSuccess).done(function (script, textStatus) {
                    _writeLog(textStatus);
                }).fail(function (jqxhr, settings, exception) {
                    _writeLog(exception);
                });
            },
            isMatchIDvalid: function (matchID, sportTypeID) {
                if (!_betRadar.isBetradarEnabled()) return false;
                var allowedSportType = _configuration.LimitBRWidgetSportTypeID;
                return (((allowedSportType.length == 0) || ($.inArray(sportTypeID, allowedSportType) >= 0)) &&
                    (matchID != '') && (matchID != null) && (typeof (matchID) !== 'undefined'));
            }
        }

        //Initialize         
        _this.Initialize = function (objConfiguration) {
            _writeLog("Initializing LiveBettingJS controls...");

            var iSBetsCore = w.GetISBetsCoreInstance();
            var angularModule = w.GetISBetsAngularModule();

            if (typeof iSBetsCore != 'object') {
                _writeLog("iSBetsCore instance not found");
                return;
            };

            //set configuration value	     	        
            _configuration.ApplicationId = objConfiguration.ApplicationId;
            _configuration.interval = objConfiguration.interval;
            _serviceParams.ShowUpcoming = objConfiguration.ShowUpcoming;
            _serviceParams.NumEventi = objConfiguration.NumEventi;
            _serviceParams.NumEventiUpcoming = objConfiguration.NumEventiUpcoming;
            _configuration.templateUrl = objConfiguration.templateUrl;
            _configuration.LimitBRWidgetSportTypeID = objConfiguration.LimitBRWidgetSportTypeID;
            _configuration.updateEventOnSportTypeChange = objConfiguration.updateEventOnSportTypeChange;

            _configuration.wsUrl = iSBetsCore.Sport.services.controlsService;
            _configuration.livePath = iSBetsCore.Sport.pages.livePage;            
            _configuration.enableBRTrackerWidget = ((iSBetsCore.Sport.thirdParties.enableBRTrackerWidget) && (objConfiguration.enableBetradarWidget));

            _serviceParams.IDBookmaker = iSBetsCore.config.idBookmaker;
            _serviceParams.IDLingua = iSBetsCore.config.idLanguage;
            _serviceParams.idGMT = iSBetsCore.config.idGmt;

            //ISBetsCore Instance
            _configuration.isCoreInstance = iSBetsCore;

            //Initialize App
            _ngInstance = angular.module(_configuration.ApplicationId, ['ngAnimate', angularModule.getModule()]);

            //Add Controller
            _ngInstance.controller(_immutables.BASE_CONTROLLER, function ($scope, $http, $timeout, $utils) {

                $scope.templatePath = _configuration.templateUrl;
                $scope.livePath = _configuration.livePath;
                $scope.actualSport = 0;
                $scope.loading = true;
                $scope.listSports = [];
                $scope.TipiSportList = [];
                $scope.hasBetradar = false;
                $scope.EventData = null;
                $scope.actualEventID = 0;
                $scope.widgetsLoaded = false;

                //Load source and set timeout
                var updateSportsList =
                    function (onSuccess, onError) {
                        _writeLog("Update Sports List ApplicationID: " + _configuration.ApplicationId);

                        $http.post(_configuration.wsUrl + '/' + _immutables.WEBSERVICE.SPORTLIST, _serviceParams).success(
                            function (data) {
                                $scope.loading = false;
                                $scope.listSports = data.d.TipiSport;
                                $scope.totalEvents = data.d.TotalLiveEvents;
                                var tipiSportList = [];
                                var listSports = [];

                                for (i = 0; i < data.d.TipiSport.length; i++) {
                                    var tipoSport = { IDTipoSport: 0, TipoSport: "", NumeroQuote: 0, LiveIcon: "", NumEventiUpcoming: 0 };
                                    tipoSport.IDTipoSport = data.d.TipiSport[i].IDTipoSport;
                                    tipoSport.TipoSport = data.d.TipiSport[i].TipoSport;
                                    tipoSport.NumeroQuote = data.d.TipiSport[i].NumeroQuote;
                                    tipoSport.LiveIcon = data.d.TipiSport[i].LiveIcon;
                                    tipoSport.NumEventiLive = data.d.TipiSport[i].NumEventiUpcoming;
                                    tipiSportList.push(tipoSport);

                                    listSports[data.d.TipiSport[i].IDTipoSport] = data.d.TipiSport[i];
                                };

                                if (($scope.actualSport == 0) && ($scope.listSports) && ($scope.listSports.length > 0)) {
                                    $scope.actualSport = _serviceParams.IDTipoSport = data.d.TipiSport[0].IDTipoSport;
                                };

                                $scope.TipiSportList = tipiSportList;
                                $scope.listSports = listSports;

                                if (typeof onSuccess == 'function') onSuccess();
                            })
                            .error(
                            function (data) {
                                _writeLog("Error on request LiveBetting Data...");
                                $scope.listSports = [];
                                $scope.TipiSportList = [];
                                $scope.totalEvents = 0;
                                $scope.loading = false;

                                if (typeof onError == 'function') onError();
                            });
                    };
                
                $utils.registerUpdate(updateSportsList, _configuration.interval, _configuration.ApplicationId, false);

                //Change Sport Type
                $scope.changeSport = function () {
                    _writeLog("changeSport");
                    $scope.actualSport = this.tipoSport.IDTipoSport;
                };

                $scope.getEvents = function () {
                    _writeLog("getEvents");
                    if ($scope.listSports[$scope.actualSport]) { return $scope.listSports[$scope.actualSport].LiveEvents; }
                    else return [];
                };

                $scope.changePanel = function (event) {      
                    _writeLog("changePanel");
                    $scope.EventData = event;
                    $scope.actualEventID = event.IDEvento;                    
                    $scope.brChangeWidget($scope.EventData.BrMatchID, $scope.EventData.IDEvento, $scope.EventData.IDTipoSport);
                };

                var selectFirstSportEvent = function () {
                    _writeLog("selectFirstSportEvent")
                    var listSports = $scope.listSports;
                    var actualSport = $scope.actualSport;
                    if ((actualSport > 0) && (listSports[actualSport])) {
                        if ((listSports[actualSport].LiveEvents) && (listSports[actualSport].LiveEvents.length > 0)) {                          
                            $scope.changePanel(listSports[actualSport].LiveEvents[0]);                               
                        } else {
                            $scope.EventData = null;
                            $scope.actualEventID = 0;
                        }
                    }
                };               

                $scope.getBackgroundImage = function (idSportType) {
                    if (idSportType > 0) {
                        var imgPath = iSBetsCore.Sport.method.resources.getLiveBackgroundImagePath(idSportType, "Base");
                        return { backgroundImage: "url(" + imgPath + ")" };
                    };
                };

                $scope.isBetRadarReady = function () {
                    return ((!_configuration.enableBRTrackerWidget) || $scope.widgetsLoaded);
                }

                if (_configuration.enableBRTrackerWidget) {
                    $.ajaxSetup({ cache: true });
                    $scope.hasBetradar = true;

                    $timeout(function () { 
                        _betRadar.getScript(function (data, textStatus, jqxhr) {
                            SRLive.addWidget({
                                name: _widgetConfig.name,
                                config: _widgetConfig.config,                              
                                callback: function () {                                
                                    $timeout(function () {
                                        $scope.widgetsLoaded = true;
                                        if ($scope.actualEventID == 0) {
                                            var eventoTracker = _betRadar.searchFirstEventTraked($scope);
                                            if (eventoTracker != null) {
                                                $scope.changePanel(eventoTracker);
                                            }
                                        } else {
                                            $scope.changePanel($scope.EventData);                                    
                                        }
                                    }, 0);
                                }
                            });
                        });
                    }, 0)

                    $scope.brChangeWidget = function (matchID, EventID, sportTypeID) {                               
                        if ((_betRadar.isMatchIDvalid(matchID, sportTypeID)) &&
                            (_betRadar.isBetradarEnabled()) && (SRLive.event) && (matchID != '')) {
                            SRLive.event.trigger('set_match_focus', {
                                matchId: matchID, idContainer: 'testIdContainer'
                            });
                        }                        
                    };

                    $scope.isMatchIDvalid = function (matchID, sportTypeID) {
                        return _betRadar.isMatchIDvalid(matchID, sportTypeID)
                    };
                }

                if (_configuration.updateEventOnSportTypeChange) {
                    $scope.$watch('actualSport', function () {
                        selectFirstSportEvent();
                    });
                } else {
                    $timeout(function () { selectFirstSportEvent(); }, 0);
                }
            });

            //Manually start Angular application
            angular.bootstrap(w.document.getElementById(_configuration.ApplicationId), [_configuration.ApplicationId]);
        };
    };

    var isCoreInitializer = w.GetInitializerInstance();
    isCoreInitializer.ClientControlScriptRegistration('livebetting', livebetting);

})(window);
