(function (w) {

    var nextEvents = function () {
        var _this = this;

        var _immutables = {
            WEBSERVICE: { SPORTLIST: 'NextEventsList' },
            BASE_CONTROLLER: 'userController',
            DEBUG_MODE: false,
        };

        var _configuration = { objConfiguration: null, w: null, isCoreInstance: null, ApplicationId: '', templateUrl: '', wsUrl: '', interval: 0, databaseDIEnable: false };
        var _serviceParams = { IDPalinsesto: 0, IDLingua: 0, NumEventi: 0, ShowTodayEvents: false };
        var _handler = { hndlrUpdateData: null };
        var _ngInstance = null;

        var _writeLog = function (message) {
            if (_immutables.DEBUG_MODE)
                console.log(message);
        };

         //Initialize         
        _this.Initialize = function (objConfiguration) {

            _writeLog("Initializing NextEventsOdds controls...");

            var iSBetsCore = w.GetISBetsCoreInstance();
            var angularModule = w.GetISBetsAngularModule();

            if (typeof iSBetsCore != 'object') {
                _writeLog("iSBetsCore instance not found");
                return;
            };

            //set configuration value	     	        
            _configuration.ApplicationId = objConfiguration.ApplicationId;
            _configuration.interval = objConfiguration.interval;                     
            _configuration.templateUrl = objConfiguration.templateUrl;            
            _configuration.wsUrl = iSBetsCore.Sport.services.controlsService;                         
            _configuration.databaseDIEnable = iSBetsCore.Sport.services.controlsService;

            _serviceParams.IDPalinsesto = iSBetsCore.config.idPalimpsest;
            _serviceParams.IDLingua = iSBetsCore.config.idLanguage;
            _serviceParams.NumEventi = objConfiguration.NumEventi;            
            _serviceParams.ShowTodayEvents = objConfiguration.showTodayEvents;

            //ISBetsCore Instance
            _configuration.isCoreInstance = iSBetsCore;

            //Initialize App
            _ngInstance = angular.module(_configuration.ApplicationId, ['ngAnimate', angularModule.getModule()]);

            _ngInstance.config(['$compileProvider',
                function ($compileProvider) {
                    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|javascript|chrome-extension):/);
                }]);

            //Add Controller
            _ngInstance.controller(_immutables.BASE_CONTROLLER, function ($scope, $http, $timeout, $utils) {

			            $scope.templatePath = _configuration.templateUrl;			        
			            $scope.actualSport = 0;
			            $scope.loading = true;
			            $scope.enableOddsToday = objConfiguration.showTodayEvents;
			            $scope.listSports = [];
			            $scope.TipiSportList = [];
			            
			            //Load source and set timeout
			            var updateSportsList =
                            function (onSuccess, onError) {
                                _writeLog("Update Sports List ApplicationID: " + _configuration.ApplicationId);
                           
                                $http.post(_configuration.wsUrl + '/' + _immutables.WEBSERVICE.SPORTLIST, _serviceParams).success(
						            function (data) {
						                $scope.loading = false;
						                $scope.listSports = data.d.TipiSport;
						                var tipiSportList = [];

						                for (var i = 0; i < $scope.listSports.length; i++) {
						                    var tipoSport = { IDTipoSport: 0, TipoSport: "" };
						                    tipoSport.IDTipoSport = data.d.TipiSport[i].IDTipoSport;
						                    tipoSport.TipoSport = data.d.TipiSport[i].TipoSport;
						                    tipiSportList.push(tipoSport);
						                };

						                if (($scope.actualSport == 0) && ($scope.listSports) && ($scope.listSports.length > 0)) {
						                    $scope.actualSport = $scope.listSports[0].IDTipoSport;
						                };

						                $scope.TipiSportList = tipiSportList;
						               
						                if (typeof onSuccess == 'function') onSuccess();
						            })
                                    .error(
                                    function (data) {
                                        _writeLog("Error on request LiveBetting Data...");
                                        $scope.listSports = [];
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

			            $scope.getSubEventDetail = function (IDEvento) {
			                _writeLog("getSubEventDetail");
			                return iSBetsCore.Sport.method.palimpsest.loadAsyncSubevent(IDEvento);
			            }
                
			            $scope.openOddToday = function (sportID) {			                        
			                iSBetsCore.Sport.method.actionLink.openOddsToday(sportID);			                
			            }

			            $scope.showOddsTodayPanel = function (tipoSport, index) {
			                if (!_configuration.databaseDIEnable) return false;
			                if (!objConfiguration.showTodayEvents) return false;
			                var sottoeventiLength = tipoSport.SottoEventi.length;			                
			                if (index >= sottoeventiLength -1) return true;                            			                			                
			                if ((tipoSport.SottoEventi[index].IDSport) !== (tipoSport.SottoEventi[index + 1].IDSport)) return true;
                            return false
			            }			            
			        });

            //Manually start Angular application
            angular.bootstrap(w.document.getElementById(_configuration.ApplicationId), [_configuration.ApplicationId]);
        };
    };

    var isCoreInitializer = w.GetInitializerInstance();
    isCoreInitializer.ClientControlScriptRegistration('NextEventsOdds', nextEvents);

})(window);
