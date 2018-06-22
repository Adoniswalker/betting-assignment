(function (w) {

    var ViewModeSelectorApp = function () {
        var _this = this;

        var _immutables = {
            BASE_CONTROLLER: 'userController',
            DEBUG_MODE: false,
        };

        var _configuration = { objConfiguration: null, w: null, isCoreInstance: null, ApplicationId: '', templateUrl: '', sliderStep: [] };
        var _ngInstance = null;       
        var _private = {           
            hndlrGetPalimsest: null,            
        };

        var _writeLog = function (message) {
            if (_immutables.DEBUG_MODE)
                console.log(message);
        };

        //Initialize         
        _this.Initialize = function (objConfiguration) {
            _writeLog("Initializing ViewModeSelector controls...");

            var iSBetsCore = w.GetISBetsCoreInstance();
            var angularModule = w.GetISBetsAngularModule();

            if (typeof iSBetsCore != 'object') {
                _writeLog("iSBetsCore instance not found");
                return;
            }

            //set configuration value	     	        
            _configuration.ApplicationId = objConfiguration.ApplicationId;
            _configuration.templateUrl = objConfiguration.templateUrl;
            _configuration.sliderStep = objConfiguration.sliderStep;

            //ISBetsCore Instance
            _configuration.isCoreInstance = iSBetsCore;

            //Initialize App
            _ngInstance = angular.module(_configuration.ApplicationId, ['ngAnimate', 'rzModule',  angularModule.getModule()]);

            //Add Controller
            _ngInstance.controller(_immutables.BASE_CONTROLLER, function ($scope, $http, $timeout, $utils) {

                var getStepPosition = function (listStep, value) {
                    for (var i = 0; i < listStep.length; i++) {
                        if (listStep[i].value == value) return i
                    }
                    return 0
                };

                $scope.listStep = _configuration.sliderStep;
                $scope.currentTypeVis = iSBetsCore.Sport.method.palimpsest.getVisualizationType();
                $scope.templatePath = _configuration.templateUrl;
                
                if ($scope.listStep.length > 0) {
                    $scope.timeSlider = {
                        floor: 0,
                        ceil: $scope.listStep.length - 1,
                        value: getStepPosition($scope.listStep, $scope.currentTypeVis),
                    };
                };

                $scope.onChange = function (evt) {
                    w.clearTimeout(_private.hndlrGetPalimsest);
                    _private.hndlrGetPalimsest = setTimeout(function () {
                        var item = $scope.listStep[$scope.timeSlider.value];                        
                        if (typeof item == 'object') {                            
                            iSBetsCore.Sport.method.palimpsest.changeVisualizationType(item.value);
                        }                        
                    }, 400)
                };

                iSBetsCore.Sport.method.bindEvents.onChangeTypeVisualization(function (data) {
                    $scope.currentTypeVis = iSBetsCore.Sport.method.palimpsest.getVisualizationType();
                    $scope.timeSlider.value = getStepPosition($scope.listStep, $scope.currentTypeVis);
                    $timeout(function () { }, 0);
                });          
                
                $scope.changeTypeVis = function (typeVis) {               
                    iSBetsCore.Sport.method.palimpsest.changeVisualizationType(typeVis);                    
                };

                $scope.openLive = function () {
                    iSBetsCore.Sport.method.actionLink.openLivePage();
                };

            });

            //Manually start Angular application
            angular.bootstrap(w.document.getElementById(_configuration.ApplicationId), [_configuration.ApplicationId]);
        };
    };

    var isCoreInitializer = w.GetInitializerInstance();
    isCoreInitializer.ClientControlScriptRegistration('ViewModeSelector', ViewModeSelectorApp);

})(window);

