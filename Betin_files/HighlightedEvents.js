(function (w) {

    var getHighlightedEvents = function () {
        var _this = this;

        var _immutables = {
            WEBSERVICE: { SPORTLIST: 'HighlightedEvents' },
            BASE_CONTROLLER: 'userController',
            DEBUG_MODE: false,
        };

        var _configuration = { objConfiguration: null, w: null, isCoreInstance: null, ApplicationId: '', templateUrl: '', wsUrl: '', interval: 0 };
        var _serviceParams = { IDBookmaker:0, IDLingua: 0, Top: 0 };
        var _handler = { hndlrUpdateData: null };
        var _ngInstance = null;

        var _writeLog = function (message) {
            if (_immutables.DEBUG_MODE)
                console.log(message);
        };

        //Initialize         
        _this.Initialize = function (objConfiguration) {

            _writeLog("Initializing HighlightedEvents controls...");

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

            _serviceParams.IDLingua = iSBetsCore.config.idLanguage;
            _serviceParams.Top = objConfiguration.Top;
            _serviceParams.IDBookmaker = iSBetsCore.config.idBookmaker;

            //ISBetsCore Instance
            _configuration.isCoreInstance = iSBetsCore;

            //Initialize App
            _ngInstance = angular.module(_configuration.ApplicationId, ['ngAnimate', angularModule.getModule()]);


            //Add Controller
            _ngInstance.controller(_immutables.BASE_CONTROLLER, function ($scope, $http, $timeout, $utils) {

                $scope.templatePath = _configuration.templateUrl;
                $scope.actualSport = 0;
                $scope.actualEvent = 0;
                $scope.loading = true;
                $scope.ListTipiSport = [];
                $scope.EventiInd = [];
                $scope.SottoEventiInd = [];

                //Load source and set timeout
                var updateSportsList =
                    function (onSuccess, onError) {
                        _writeLog("Update Sports List ApplicationID: " + _configuration.ApplicationId);

                        $http.post(_configuration.wsUrl + '/' + _immutables.WEBSERVICE.SPORTLIST, _serviceParams).success(
                            function (data) {
                                $scope.loading = false;
                                var dataTipiSport = data.d;
                                var listTipiSport = [];
                                var eventiInd = [];
                                var sottoEventiInd = [];

                                for (var i = 0; i < dataTipiSport.TipiSport.length; i++) {
                                    var tipoSport = { IDTipoSport: 0, TipoSport: "", IDPrimoEvento: 0 };
                                    var currentSport = dataTipiSport.TipiSport[i];
                                    tipoSport.IDTipoSport = currentSport.IDTipoSport;
                                    tipoSport.TipoSport = currentSport.TipoSport;
                                    tipoSport.IDPrimoEvento = currentSport.Eventi[0].IDEvento;
                                    listTipiSport.push(tipoSport);

                                    var eventi = [];
                                    for (var a = 0; a < currentSport.Eventi.length; a++) {
                                        var evento = { IDTipoSport: 0, IDEvento: 0, Gruppo: "", Evento: "", OrdineEvento: 0, NumSottoEventi: 0, NumQuote: 0, DataInizio: "" }
                                        var currentEvento = currentSport.Eventi[a];
                                        evento.IDTipoSport = currentEvento.IDTipoSport;
                                        evento.IDEvento = currentEvento.IDEvento;
                                        evento.Gruppo = currentEvento.Gruppo;
                                        evento.Evento = currentEvento.Evento;
                                        evento.OrdineEvento = currentEvento.OrdineEvento;
                                        evento.NumSottoEventi = currentEvento.NumSottoEventi;
                                        evento.NumQuote = currentEvento.NumQuote;
                                        evento.DataInizio = currentEvento.DataInizio;
                                        eventi.push(evento);

                                        var key = "key_" + currentSport.IDTipoSport + "_" + currentEvento.IDEvento;
                                        sottoEventiInd[key] = currentEvento;
                                    }
                                    eventiInd[tipoSport.IDTipoSport] = eventi;
                                }

                                if (($scope.actualSport == 0) && (listTipiSport.length > 0)) {
                                    $scope.actualSport = listTipiSport[0].IDTipoSport;
                                    if ((eventiInd) && (eventiInd.length > 0)) {
                                        if ($scope.actualEvent == 0) {
                                            $scope.actualEvent = eventiInd[$scope.actualSport][0].IDEvento;
                                        };
                                    };                   
                                };

                                $scope.ListTipiSport = listTipiSport;
                                $scope.EventiInd = eventiInd;
                                $scope.SottoEventiInd = sottoEventiInd;

                                if (typeof onSuccess == 'function') onSuccess();
                            })
                            .error(
                            function (data) {
                                _writeLog("Error on request LiveBetting Data...");                              
                                $scope.loading = false;

                                if (typeof onError == 'function') onError();
                            });
                    };

                $utils.registerUpdate(updateSportsList, _configuration.interval, _configuration.ApplicationId, false);

                //Cambia Sport
                $scope.changeSport = function () {
                    _writeLog("changeSport");
                    $scope.actualSport = this.tipoSport.IDTipoSport;
                    $scope.actualEvent = this.tipoSport.IDPrimoEvento; 
                };

                //Cambia Evento
                $scope.changeEvent = function () {
                    _writeLog("changeEvent");
                    $scope.actualEvent = this.evento.IDEvento;
                };

                //Lista SottoEvento per lo sport e l'evento selezionato
                $scope.getSubEvent = function () {
                    _writeLog("getSubEvent");
                    var key = "key_" + $scope.actualSport + "_" + $scope.actualEvent;
                    if ($scope.SottoEventiInd[key]) return $scope.SottoEventiInd[key].SottoEventi;
                };

                //Lista degli Eventi per lo sport selezionato
                $scope.getEvents = function () {
                    _writeLog("getEvents");
                    if ($scope.EventiInd[$scope.actualSport]) return $scope.EventiInd[$scope.actualSport];
                };
            });

            //Manually start Angular application
            angular.bootstrap(w.document.getElementById(_configuration.ApplicationId), [_configuration.ApplicationId]);
        };
    };

    var isCoreInitializer = w.GetInitializerInstance();
    isCoreInitializer.ClientControlScriptRegistration('HighlightedEvents', getHighlightedEvents);

})(window);
