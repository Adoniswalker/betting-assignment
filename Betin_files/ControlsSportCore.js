(function (w) {
    var iSBetsCore = w.GetISBetsCoreInstance();

    // Favorites Module
    var favoritesModule = function () {
        var _this = this;        
        var _area = { SubEvent: 'S', Event: 'E', LiveEvent: 'LE' };
        var _favoriteKey = 'iSBetsFavorites';

        var _handler = {
            _listCallback: [],
            onFavoriteChange: function (callback) {
                _handler._listCallback.push(callback);
            },
            triggerChanged: function () {
                for(var i=0; i<_handler._listCallback.length; i++ ){
                    var currentFunc = _handler._listCallback[i];
                    if (typeof currentFunc === 'function') currentFunc(_private._favoriteList, _area);
                }
            }
        };
        var _private = {
            _favoriteList: {},
            initialize: function () {                
                _private.refreshFavoriteList();
                var favoriteList = _private._favoriteList;        

                if (typeof favoriteList[_area.SubEvent] === 'undefined') favoriteList[_area.SubEvent] = [];
                if (typeof favoriteList[_area.Event] === 'undefined') favoriteList[_area.Event] = [];
                if (typeof favoriteList[_area.LiveEvent] === 'undefined') favoriteList[_area.LiveEvent] = [];
            
                _private.updateFavoriteList();
            },
            refreshFavoriteList: function () {
                var currentList = iSBetsCore.Utils.getFromBrowserStorage(_favoriteKey);
                _private._favoriteList = (currentList != null) ? currentList : {};
            },
            updateFavoriteList: function () {
                iSBetsCore.Utils.saveToBrowserStorage(_favoriteKey, _private._favoriteList);
                _handler.triggerChanged();
            },
            addFavorite: function (area, id) {
                var currentList = _private._favoriteList[area];
                if ((typeof currentList !== 'undefined') && (currentList.indexOf(id) == -1)) {
                    currentList.push(id);
                };
                _private.updateFavoriteList();              
            },
            isFavorite: function (area, id) {
                var currentList = _private._favoriteList[area];
                return ((typeof currentList !== 'undefined') && (currentList.indexOf(id) != -1));
            },
            getFavoriteList: function (area) {
                var currentList = _private._favoriteList[area];
                return currentList
            },
            removeFavorite: function (area, id) {
              //  _private.refreshFavoriteList();
                var currentList = _private._favoriteList[area];
                if ((typeof currentList !== 'undefined') && (currentList.indexOf(id) > -1)) {
                    currentList.splice(currentList.indexOf(id), 1);
                };
                _private.updateFavoriteList();
            }
        };

        _this.addLiveEvent = function (idEvent) {
            _private.addFavorite(_area.LiveEvent, idEvent);
        };
        _this.removeLiveEvent = function (idEvent) {
            _private.removeFavorite(_area.LiveEvent, idEvent);
        };
        _this.isFavoriteLive = function (idEvent) {
            return _private.isFavorite(_area.LiveEvent, idEvent);
        };
        _this.getLiveEventsList = function () {
            return _private.getFavoriteList(_area.LiveEvent);
        };
        _this.onFavoriteChange = function (callback) {
            _handler.onFavoriteChange(callback);
        };

        //Initialize
        _private.initialize();
    };



    var SportCoreExtension = function (isCoreInstance) {
        var _this = this;                
        var isCore = isCoreInstance;

        var _immutables = {
            EVENTS: {
                CLOSESUBEVENT: 'oddsAsyncRemoved', CHANGETYPEVIS: 'oddsTimeSliderChanged', CHANGECOUPON: 'CouponChanged',
                LOADEVENTDETAIL: 'oddsView_LoadEvent', LOADEVENTCOMPLETE: 'oddsView_LoadEventComplete', CLOSEEVENTDETAIL: 'oddsView_CloseEvent',
            },
            WEBSERVICE: { SPORTLIST: 'GetPalimpsest' },
            SESSIONSERVICE: { CHANGETYPEVISULIZATION: 1 },
            TYPEVISUALIZATION: { ALL: 1, TODAY: 2, TODAYAFTER:3, WEEK:7, DATE: 4 }
        };
        
        var _private = {
            _palimpsest: {
                _sportList: [],
                _loadedEvents: [],
                changeVisualizationType: function (typeVis, startDate, endDate) {
                    var currentTypevis = isCore.Sport.config.typeVisualization;
                    if (typeVis != currentTypevis || typeVis == _immutables.TYPEVISUALIZATION.DATE) {
                        var webService = isCore.Sport.services.sessionService;                        
                        var changeTypeRequest = {
                            newValue: typeVis,
                            startDate: startDate,
                            endDate: endDate
                        };
                        var value = {
                            opType: _immutables.SESSIONSERVICE.CHANGETYPEVISULIZATION,
                            value: JSON.stringify(changeTypeRequest)
                        };
                        isCore.Utils.httpGetAsync(webService, value, function (data) {
                            var response = data;
                            isCore.Sport.config.typeVisualization = data.value;
                            isCore.Sport.config.typeVisualizationStartDate = (data.value == 4)?data.startDate:null;
                            isCore.Sport.config.typeVisualizationEndDate = (data.value == 4)?data.endDate:null;

                            isCore.Utils.sendEvent(_immutables.EVENTS.CHANGETYPEVIS, data.value);
                        });
                        return typeVis
                    } else {
                        return typeVis
                    }
                },
                getPalimpsest: function (callback, onError) {
                    var service = (isCore.Sport.services.controlsService + "/" + _immutables.WEBSERVICE.SPORTLIST);
                                        
                    var value = {
                        IDPalinsesto: isCore.config.idPalimpsest,
                        IDLingua: isCore.config.idLanguage,
                        TipoVisualizzazione: isCore.Sport.config.typeVisualization,
                        StartDate: isCore.Sport.config.typeVisualizationStartDate,
                        EndDate: isCore.Sport.config.typeVisualizationEndDate
                    }
                    return isCore.Utils.httpGetAsync(service, value, function (data) {
                        var newPalimpsest = data.d;

                        isCore.Sport.config.typeVisualization = newPalimpsest.VisualizationType;
                        isCore.Sport.config.typeVisualizationStartDate = newPalimpsest.VisualizationTypeEndDate;
                        isCore.Sport.config.typeVisualizationEndDate = newPalimpsest.VisualizationTypeStartDate;

                        _private._palimpsest._sportList = newPalimpsest.SportList;
                        callback(isCore.Sport.config.typeVisualization, _private._palimpsest._sportList);
                    })
                }
            },            
        };

        var _favorites = new favoritesModule();

        var _iSBetsNativeMethod = {
            addCoupon: function (idQuota) {                
                if ((typeof w.sCouponButtonClientID === 'string') &&
                   (typeof w.sCouponQuotaClientID === 'string') &&
                   (typeof w.AddCoupon === 'function')) {                    
                    if (idQuota > 0) {                          
                            w.AddCoupon(w.sCouponButtonClientID, w.sCouponQuotaClientID, idQuota);
                        }
                    }
            },
            loadAsyncSubevent: function (idEvento) {
                if ((typeof w.sTxtEventi === 'string') &&
                    (w.isOddsPage) && (typeof w.ShowEventAsync === 'function')) {
                    w.ShowEventAsync(w.sTxtEventi, idEvento);
                    return _iSBetsNativeMethod.getActualSubEventsList(false);
                } else {
                    var oddsViewer = isCore.Sport.pages.oddsViewer;
                    oddsViewer = (oddsViewer + "?EventID=" + idEvento);
                    w.location = oddsViewer;
                    return null
                }
            },
            loadSubevent: function (idEvento) {
                var dataEvent = {
                    eventID: idEvento,
                    options: {}
                }                
                isCore.Utils.sendEvent(_immutables.EVENTS.LOADEVENTDETAIL, dataEvent);
            },
            loadEventComplete: function (dataEvent) {
                _private._palimpsest._loadedEvents = dataEvent.loadedEvents;
                isCore.Utils.sendEvent(_immutables.EVENTS.LOADEVENTCOMPLETE, _private._palimpsest._loadedEvents);
            },
            closeEvent: function (dataEvent) {
                _private._palimpsest._loadedEvents = dataEvent.loadedEvents;
                isCore.Utils.sendEvent(_immutables.EVENTS.CLOSEEVENTDETAIL, _private._palimpsest._loadedEvents);
            },
            getActualSubEventsList: function (useOddsControl) {
                if (useOddsControl) {
                    return _private._palimpsest._loadedEvents;
                } else {
                    var currentEventsDOM = document.getElementById(w.sTxtEventi);
                    if (currentEventsDOM == null) return [];
                    var currentEvents = currentEventsDOM.value;
                    if (currentEvents == '') {
                        return []
                    } else {
                        return currentEvents.split(',');
                    }
                }                
            }
        };

        _this.AddModule = function(moduleName, moduleClass){        
            _this[moduleName] = new moduleClass(isCore)
        };

        _this.bet = {
            getBetslipList : function () {       
                if (typeof w.sHidIDQuote != 'string') return null;
                var _objectDOM = document.getElementById(w.sHidIDQuote);
                if (_objectDOM == null) return [];

                var betList = [];
                var value = _objectDOM.value;

                var uncodedBetList = value.split("|")
                for (var i = 0; i < uncodedBetList.length; i++) {
                    var currentItem = uncodedBetList[i].split("&");
                    if (currentItem.length == 2) betList.push({ oddID: currentItem[0], sueventID: currentItem[1] });
                }
                return betList
            },
            addCoupon: function (idQuota) {
                _iSBetsNativeMethod.addCoupon(idQuota);
            },
            isInCoupon: function (idQuota){
                var betslipList = _this.bet.getBetslipList();
                
                if (betslipList == null) return false
                for (var i = 0; i < betslipList.length; i++) {
                    if (betslipList[i].oddID == idQuota) return true;
                }
                return false
            }
        };
        _this.resources = {
            getSportImagePath: function (idSport, antepost) {
                var idBook = isCore.config.idBookmaker;           
                var imgPath = isCore.Sport.services.imgSportPath;

                return (imgPath + "?IDBook=" + idBook + "&IDSport=" + idSport + "&Antepost=" + antepost);
            },
            getGroupImagePath: function (idGroup) {
                var idBook = isCore.config.idBookmaker;
                var theme = isCore.currentDomain.currenteTheme;
                var imgPath = isCore.Sport.services.imgGroupPath;

                return (imgPath + "?IDBook=" + idBook + "&IDGruppo=" + idGroup + "&Tema=" + theme);
            },
            getLiveBackgroundImagePath: function (idSportType, theme) {
                var idBook = isCore.config.idBookmaker;               
                var originalPath = isCore.Sport.services.imgLiveBackgroundPath;
                var imgPath = originalPath
                                .concat("?IDTipoSport=" + idSportType)
                                .concat("&IDBook=" + idBook)
                                .concat("&IDTipoImm=4")
                                .concat("&code=background")
                                .concat("&tema=" + theme)
                                .concat("&LiveType=2");
                return imgPath;
            }
        };
        _this.link = {
            getSubeventsDetailPath : function (idSubevent) {
                var subEventPath = isCore.Sport.pages.subEvents;
                return (subEventPath + "?SubEventID=" + idSubevent);
            },
            getLiveDetailPath : function (idEventLive) {
                var livePage = isCore.Sport.pages.livePage;
                return (livePage + "?IDEvento=" + idEventLive);
            },
            getOpenOddsTodayPath: function (idSport, antepost) {
                var oddsTodayPage = isCore.Sport.pages.oddsToday;
                var url = (oddsTodayPage + "?IDSport=" + idSport);
                if (antepost) url = url + "&Antepost=1";
                return url;
            },
            getOpenGroupPath: function (idSport, antepost, typeVis) {
                var groupsPage = isCore.Sport.pages.groupsPage;                
                var url = (groupsPage + "?IDSport=" + idSport + "&Antepost=" + ((antepost) ? "1" : "0"));
                if (typeof typeVis === 'number') {
                    url = url + "&TipoVis=" + typeVis;
                }
                return url;
            },
            getPrintOddsPath: function (idEvent) {
                var printPage = isCore.Sport.pages.printPage;
                return (printPage + "?IDEvento=" + idEvent);
            },
            getAutologinPath: function (destination) {
                var autologinPage = isCore.Sport.pages.autologinPage;

                return (autologinPage + "?Destinazione=" + destination);
            }
        };
        _this.actionLink = {
            openPopup: function (title, extClass, contentDOM) {
                var windowWidth = document.documentElement.clientWidth;
                var windowHeight = document.documentElement.clientHeight;
                var bodyPanel = document.getElementsByTagName('body')[0];
                var mainDiv = document.createElement('div');
                var bg = document.createElement('div');
                var content = document.createElement('div');
                var titlePopup = document.createElement('div');
                var closeButton = document.createElement('div');
                var mainContent = document.createElement('div');
                mainDiv.id = 'popupWindow' ;
                mainDiv.className = 'popupWindow ' + ((typeof extClass === 'string')?extClass:'');
                bg.className = 'popupBG';
                content.className = 'popupContent'
                titlePopup.className = 'titlePopup';
                closeButton.className = 'closePopup';
                mainContent.className = 'mainContent';

                if (iSBetsCore.Utils.isElement(contentDOM)) mainContent.appendChild(contentDOM);
                if (typeof title === 'string') titlePopup.innerHTML = isCore.content.getString(title);
                
                titlePopup.appendChild(closeButton);
                content.appendChild(titlePopup);
                content.appendChild(mainContent);
                mainDiv.appendChild(bg);
                mainDiv.appendChild(content);
                
                bg.addEventListener("click", function () { bodyPanel.removeChild(mainDiv); });
                closeButton.addEventListener("click", function () { bodyPanel.removeChild(mainDiv); });
                
                bodyPanel.appendChild(mainDiv);
            },
            openIFramePopup: function (title, extClass, link) {
                var iframeDOM = document.createElement('iframe');
                iframeDOM.setAttribute("width", "100%");
                iframeDOM.setAttribute("height", "100%");
                iframeDOM.setAttribute("scrolling", "auto");
                iframeDOM.setAttribute("frameborder", "0");
                iframeDOM.setAttribute("border", "0");
                iframeDOM.setAttribute("marginwidth", "0");
                iframeDOM.setAttribute("marginheight", "0");
                iframeDOM.setAttribute("src", link);

                _this.actionLink.openPopup(title, extClass, iframeDOM);
            },
            openGroups: function () {
                var groupsPage = isCore.Sport.pages.groupsPage;
                w.location = groupsPage;
            },            
            openOddsToday: function (idSport, antepost) {                
                var link = _this.link.getOpenOddsTodayPath(idSport, antepost);             
                w.location = link;
            },
            openGroupDetail: function (idSport, antepost, typeVis){
                var link = _this.link.getOpenGroupPath(idSport, antepost, typeVis);             
                w.location = link;
            },
            openPrintOdds: function (idEvent) {
                var link = _this.link.getPrintOddsPath(idEvent);
                w.location = link;
            },
            openLivePage: function(){
                var liveLink = isCore.Sport.pages.livePage;
                w.location = liveLink;
            }
        };
        _this.palimpsest = {
            getVisualizationType: function (typeVis) {
                return isCore.Sport.config.typeVisualization;
            },
            changeVisualizationType: function (typeVis) {
                return _private._palimpsest.changeVisualizationType(typeVis, new Date(), new Date());
            },
            changeVisualizationTypeToDate: function (startDate, endDate) {
                return _private._palimpsest.changeVisualizationType(_immutables.TYPEVISUALIZATION.DATE, startDate, endDate);
            },
            loadAsyncSubevent: function (idEvento) {
                return _iSBetsNativeMethod.loadAsyncSubevent(idEvento);
            },
            loadSubevent: function (idEvento) {
                return _iSBetsNativeMethod.loadSubevent(idEvento);
            },
            loadEventComplete: function (dataEvent) {
                _iSBetsNativeMethod.loadEventComplete(dataEvent);
            },
            closeEvent: function (dataEvent) {
                return _iSBetsNativeMethod.closeEvent(dataEvent);
            },
            getActualSubEventsList: function (useOddsControl) {
                return _iSBetsNativeMethod.getActualSubEventsList(useOddsControl);
            },
            getPalimpsest: function (callback, onError) {
                var currentSportList = _private._sportList;
                var typeVis = isCore.Sport.config.typeVisualization;
                if ((currentSportList != typeVis) || (currentSportList == null)) {
                    return _private._palimpsest.getPalimpsest(callback, onError);
                } else {
                    callback(typeVis, currentSportList);
                    return null
                }            
            }
        };
        _this.favorites = {
            addLiveEvent: function (idEvent) {
                _favorites.addLiveEvent(idEvent);
            },
            removeLiveEvent: function (idEvent) {
                _favorites.removeLiveEvent(idEvent);
            },
            isFavoriteLive: function (idEvent) {           
                return _favorites.isFavoriteLive(idEvent);
            },
            getLiveEventsList: function () {
                return _favorites.getLiveEventsList();
            },
            onFavoriteChange: function (callback) {
                _favorites.onFavoriteChange(callback);
            },
            
        };
        _this.bindEvents = {
            onCloseSubEvent: function (eventFunc) {
                return isCore.Utils.getEvent(_immutables.EVENTS.CLOSESUBEVENT, eventFunc);
            },
            onChangeTypeVisualization: function (eventFunc) {
                return isCore.Utils.getEvent(_immutables.EVENTS.CHANGETYPEVIS, eventFunc);
            },
            onChangeCoupon: function (eventFunc) {
                return isCore.Utils.getEvent(_immutables.EVENTS.CHANGECOUPON, eventFunc);
            },
            onEventRequest: function (eventFunc) {
                return isCore.Utils.getEvent(_immutables.EVENTS.LOADEVENTDETAIL, eventFunc);
            },
            onEventComplete: function (eventFunc) {
                return isCore.Utils.getEvent(_immutables.EVENTS.LOADEVENTCOMPLETE, eventFunc);
            },
            onEventClose: function (eventFunc) {
                return isCore.Utils.getEvent(_immutables.EVENTS.CLOSEEVENTDETAIL, eventFunc);
            }    
        };
    };
    
    var AddSportMethodOnCore = function (isCore) {
        if (typeof isCore === 'undefined') return false;
        if (typeof isCore.Sport === 'undefined') return false;
        var sportObject = isCore.Sport;
        sportObject.method = new SportCoreExtension(isCore);
        return true
    };

    //Extend isCore with Sport method
    AddSportMethodOnCore(iSBetsCore);
})(window)