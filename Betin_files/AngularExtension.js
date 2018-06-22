(function (w) {
    var angularModule = w.GetISBetsAngularModule();
    var iSBetsCore = w.GetISBetsCoreInstance();

    if ((angularModule != null) && (iSBetsCore != null)) {

        angularModule.AddDirective({
            name: 'isOddsclass',
            func: function () {
                var link = function (scope, element, attrs) {                                      

                    if (!scope.mainTemplate)
                        scope.mainTemplate = element.find("[is-oddclass-item]");                  
                    

                    scope.$watch('isOddsclass', function () {
                        
                        var data = scope.isOddsclass;
                        
                        element.empty();
                        if (!data) return;
                        for (var i = 0; i < data.length; i++) {
                                var currentItem = data[i];

                                var template = scope.mainTemplate.clone();
                           
                                if (template[0].attributes["is-oddclass-hndtype"]) {
                                    var labelHND = template[0].attributes["is-oddclass-hndtype"].value;
                                    var hasHND = currentItem[labelHND];
                                    if ((Number(hasHND)) && (hasHND > 0)) {
                                        template.addClass("hnd");
                                    };
                                };             

                                var objCaption = template.find("[is-oddsclass-name]");
                                objCaption.text(currentItem[objCaption.attr("is-oddsclass-name")]);

                                var objQuote = template.find("[is-oddsclass-odd]");
                                var listQuote = currentItem[objQuote.attr("is-oddsclass-odd")];

                                var fieldHND = template.find("[is-oddsclass-hnd]");               
                                fieldHND.text(currentItem[fieldHND.attr("is-oddsclass-hnd")]);

                                var rootOdd = template.find("[is-oddsclass-odd]");
                                var oddTemplate = template.find("[is-oddsclass-odd-item]").clone();

                                rootOdd.empty();
                                template.addClass("c" + listQuote.length);

                                for (var j = 0; j < listQuote.length; j++) {

                                    var currentOdd = listQuote[j];
                                    var customodd = oddTemplate.clone();

                                    var oddID = parseInt(currentOdd[oddTemplate.attr("is-oddsclass-odd-item")]);

                                    var objOddCaption = customodd.find("[is-oddsclass-odd-type]");
                                    var objOddValue = customodd.find("[is-oddsclass-odd-value]");

                                    objOddCaption.text(currentOdd[objOddCaption.attr("is-oddsclass-odd-type")]);
                                    objOddValue.text(currentOdd[objOddValue.attr("is-oddsclass-odd-value")]);

                                    if (iSBetsCore.Sport.method.bet.isInCoupon(oddID)) {
                                        customodd.addClass("sel");
                                    } else {
                                        customodd.removeClass("sel");
                                    }

                                    customodd.attr("data-id-odd", oddID)
                                    customodd.on('click', function () {
                                        var idquota = this.getAttribute("data-id-odd");
                                        iSBetsCore.Sport.method.bet.addCoupon(idquota);
                                    });
                                    customodd.on('CouponChanged', function (evt) {
                                        var idquota = this.getAttribute("data-id-odd");
                                        if (iSBetsCore.Sport.method.bet.isInCoupon(idquota)) {
                                            $(this).addClass("sel");
                                        } else {
                                            $(this).removeClass("sel");
                                        }
                                    });

                                    rootOdd.append(customodd);
                                }

                                element.append(template);
                        }
                   
                    });


                };                
                return {
                    restrict: 'A',
                    replace: true,
                    scope: {
                        isOddsclass: "=",                        
                    },
                    link: link
                };
            }
        });
          
        angularModule.AddDirective({
            name: 'isBindHtml',
            func: function () {
                function link(scope, element, attrs) {
                    var dataHtml = scope.$eval(attrs.isBindHtml);
                    element.html(dataHtml)
                }
                return {
                    restrict: 'A',
                    link: link
                };
            }
        });

        angularModule.AddDirective({
            name: 'isImgLiveBackground',
            func: function () {
                function link(scope, element, attrs) {
                    var idSportType = scope.$eval(attrs.isImgLiveBackground);

                    if (idSportType != "") {
                        var imgPath = iSBetsCore.Sport.method.resources.getLiveBackgroundImagePath(idSportType, "Base");
                        element.css("background-image", ("url(" + imgPath + ")"));
                    };
                }
                return {
                    restrict: 'A',
                    link: link,                   
                };
            }
        });

        angularModule.AddDirective({
            name: 'isImgteam',
            func: function () {
                function link(scope, element, attrs) {
                    var idGroup = scope.$eval(attrs.isImgteam);
                    if (idGroup != "") {
                        var imgPath = iSBetsCore.Sport.method.resources.getGroupImagePath(idGroup);
                        element.css("background-image", ("url(" + imgPath + ")"));
                    };
                }
                return {
                    restrict: 'A',
                    link: link
                };
            }
        });

        angularModule.AddDirective({
            name: 'isImgsport',
            func: function () {
                function link(scope, element, attrs) {
                    var idSport = scope.$eval(attrs.isImgsport);
                    if (idSport != "") {
                        var antepostValue = scope.$eval(attrs.isImgsportAntepost);
                        var antepost = (typeof antepostValue == 'boolean') ? ((antepostValue) ? "1" : "0") : antepostValue;
                        if (typeof antepost == 'undefined') antepost = "0";
                        var imgPath = iSBetsCore.Sport.method.resources.getSportImagePath(idSport, antepost);
                        element.css("background-image", ("url(" + imgPath + ")"));
                    };
                }
                return {
                    restrict: 'A',
                    link: link
                };
            }
        });

        angularModule.AddDirective({
            name: 'isOdd',
            func: function () {
                function link(scope, element, attrs) {
                    var oddID = scope.$eval(attrs.isOdd);
                    if (iSBetsCore.Sport.method.bet.isInCoupon(oddID)) {
                        element.addClass("sel");
                    } else {
                        element.removeClass("sel");
                    }

                    element.bind('click', function () {                        
                            iSBetsCore.Sport.method.bet.addCoupon(oddID);
                        });
                    element.bind('CouponChanged', function () {
                        if (iSBetsCore.Sport.method.bet.isInCoupon(oddID)) {                           
                            element.addClass("sel");
                        } else {                            
                            element.removeClass("sel");
                        }                        
                    });
                }
                return {
                    restrict: 'A',
                    link: link
                };
            }
        });

        angularModule.AddDirective({
            name: 'isLinkSubevent',
            func: function () {
                function link(scope, element, attrs) {
                    var idSubevent = scope.$eval(attrs['isLinkSubevent']);
                    var subEventDetailPath = iSBetsCore.Sport.method.link.getSubeventsDetailPath(idSubevent);
                    element.attr("href", subEventDetailPath);
                }
                return {
                    restrict: 'A',
                    link: link
                };
            }
        });

        angularModule.AddDirective({
            name: 'isLiveEventLink',
            func: function () {
                function link(scope, element, attrs) {
                    var idEvent = scope.$eval(attrs['isLiveEventLink']);
                    var eventDetailPath = iSBetsCore.Sport.method.link.getLiveDetailPath(idEvent);
                    element.attr("href", eventDetailPath);
                }
                return {
                    restrict: 'A',
                    link: link
                };
            }
        });

        angularModule.AddDirective({
            name: 'isLinkautologin',
            func: function () {
                function link(scope, element, attrs) {
                    var destinazione = attrs['isLinkautologin'];
                    var autologinPath = iSBetsCore.Sport.method.link.getAutologinPath(destinazione);
                    
                    element.attr("href", autologinPath);
                }
                return {
                    restrict: 'A',
                    link: link
                };
            }
        });

        angularModule.AddDirective({
            name: 'isCouponDetail',
            func: function () {
                function link(scope, element, attrs) {
                    var couponID = scope.$eval(attrs.isCouponDetail);
                    var addedClass = attrs.isCouponDetailClass;
                    var mode = attrs.isCouponDetailMode;
                    var title = attrs.isCouponDetailTitledb;
                                        
                    var anonymDetail = iSBetsCore.Sport.pages.anonymCouponDetails;
                    var linkDetails = anonymDetail + "?IDCoupon=" + couponID;
                    if (typeof title !== 'string') title = '';
                    var openfunc = function () { iSBetsCore.Sport.method.actionLink.openIFramePopup(title, addedClass, linkDetails); };

                    if (typeof mode === 'string'){
                        switch (mode.toLowerCase()) {
                            case 'popup':
                                openfunc = function () { iSBetsCore.Sport.method.actionLink.openIFramePopup(title, addedClass, linkDetails); };
                                break;
                            case 'newpage':
                                openfunc = function () { window.location = linkDetails; };
                                break;                           
                        }
                    }

                    element.bind('click', openfunc);
                }
                return {
                    restrict: 'A',
                    link: link
                };
            }
        });        

    }  
})(window)