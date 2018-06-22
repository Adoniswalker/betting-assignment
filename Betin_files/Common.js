//Variabili Offset CenterPopup
var popupOffsetTop = 0;


function getKeyPress(e) {
    var code;
    if (!e) var e = window.event;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;

    if (e && code)
        return code;
    else
        return -1;
}

function filterNumeric(objThis, evt, sep, decNum) {

    var numericKey = function (e) {
        var key = e.charCode || e.keyCode || 0;
        return (key >= 48 && key <= 57) || (key >= 96 && key <= 105);
    }

    var isClearKey = function (e) {
        var key = e.charCode || e.keyCode || 0;
        return  ((key == 13) || (key == 8) || (key == 46) || (key == 16))
    }

    var validKey = function (e, objThis) {
        var key = e.charCode || e.keyCode || 0;

        // Enter BackSpace, Tab, Numeri e KeyPad
        if (key == 13 || key == 8 || key == 9 || (key >= 37 && key <= 40) || numericKey(e)) return true;
        //Alt, CTRL, SHIFT
        if ((key == 18) || (key == 17) || (key == 16)) return true;
        //Home End Canc
        if ((key == 36) || (key == 35) || (key == 46)) return true;

        //tasti funzione (per evitare di bloccare F5)
        if (key > 111 && key < 124) return true;

        /* 110 punto numpad 188 virgola 190 punto normale */
        if (decNum > 0) {
            if ((key == 110) || (key == 188) || (key == 190)) { $(objThis).val(addSep($(objThis).val())); return false; };
        }

        return false;
    }

    if (!validKey(evt, objThis)) {
        evt.preventDefault();
    }
}

//Funzione per ottenere coordinate x e y di un elemento
function ObjectPosition(obj) {
    var curleft = 0;
    var curtop = 0;

    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return [curleft, curtop];
}

//Ricarica un coupon
function ReloadCoupon(linkID, txtID, IDCoupon) {
    //Verifico che il coupon non sia in attesa
    var objHid = document.getElementById(sHidAttesa);
    if (objHid.value != 0) return;

    var link = document.getElementById(linkID);
    var txt = document.getElementById(txtID);

    txt.value = IDCoupon;
    //alert(txt.value);
    link.click();

}

//Aggiunge una quota al Coupon
function AddCoupon(linkID, txtID, IDQuota) {
    //Verifico che il coupon non sia in attesa
    var objHid = document.getElementById(sHidAttesa);
    if (objHid.value != 0) return;

    var link = document.getElementById(linkID);
    var txt = document.getElementById(txtID);

    txt.value = IDQuota;
    link.click();
}

//Aggiunge una quota al Coupon
function AddAsync(IDQuota) {
    //Verifico che il coupon non sia in attesa
    var objHid = $('#' + sHidAttesa);
    if (objHid.val() != 0) return;

    var link = $('#' + sCPbtn);
    var txt = $('#' + sCPqt);

    txt.val(IDQuota);
    link.click();
}


//Visualizza eventi effettuando una chiamata asincrona nella pagina
function ShowEvent(txtID, linkID, IDEvento, node) {
    var link = document.getElementById(linkID);
    var txt = document.getElementById(txtID);

    //Prima di aggiungere l'IDEvento verifico che non sia già presente
    if (txt.value != "") {
        var IDs = new Array();
        IDs = txt.value.split(",");
        for (i = 0; i < IDs.length; i++) {
            if (IDs[i] == IDEvento) {
                //Se lo trovo rimuovo la selezione
                IDs.splice(i, 1);

                //Seleziona la check
                if (node != null) node.UnCheck();

                txt.value = IDs.join(",");
                link.click();
                return
            }
        }

        var strIDEventoOld = txt.value
        txt.value = IDEvento + "," + strIDEventoOld;
    } else {
        txt.value = IDEvento;
    }

    link.click();

    //Seleziona la check
    if (node != null) node.Check();
}



//Visualizza eventi selezionati effettuando una chiamata asincrona
function ShowEvents(txtID, linkID, nodes) {
    var link = document.getElementById(linkID);
    var txt = document.getElementById(txtID);

    var nodeValue = '';
    var events = '';

    //Elenco degli eventi
    for (var i = 0; i < nodes.length; i++) {
        nodeValue = nodes[i].value;

        if (nodeValue != null) {
            events += nodeValue + ',';
        }
    }

    if (events.length > 0) {
        txt.value = events.substring(0, events.length - 1);
        link.click();
    }
}

// Nasconde / visualizza un oggetto
function ShowHideObject(id) {
    var obj = document.getElementById(id);

    if (obj.style.display == 'none')
        obj.style.display = 'inline';
    else
        obj.style.display = 'none';
}


// Visualizza / Nasconde il riquadro con l'area di ricerca e visualizza le immagini relative
function ShowHideSearch(id, imgHideID, imgShowID) {
    ShowHideObject(id);
    ShowHideObject(imgHideID);
    ShowHideObject(imgShowID);
}

function showPopUpCentered(url, w, h, scrollbars, resizable) {
    var top = (screen.height / 2) - (h / 2);
    var left = (screen.width / 2) - (w / 2);
    if (scrollbars == "") scrollbars = no;
    if (resizable == "") resizable = no;

    window.open(url, null, "top=" + top + ",left=" + left + ",height=" + h + ",width=" + w + ",status=no,toolbar=no,menubar=no,location=no,scrollbars=" + scrollbars + ",resizable=" + resizable);
}


//Cambia la selezione nelle combo Cashier
function changeSel(destCbo, sourceCbo) {
    var oDestCbo = document.getElementById(destCbo);
    var oSourceCbo = document.getElementById(sourceCbo);

    if (oDestCbo != null) {
        if (oSourceCbo.selectedIndex == 0) {
            oDestCbo.selectedIndex = 1;
        } else {
            oDestCbo.selectedIndex = 0;
        }
    }
}

//Visualizza la pop up per la selezione dell'utente
function openUserPopUp(Url, idFieldName, autoPostBack, VisualizzaSottoAgenti, NascondiUtentiDisabilitati) {
    var urlToOpen = Url + '?valField=' + idFieldName;

    if (autoPostBack == 'True')
        urlToOpen = urlToOpen + '&AutoPostBack=1';
    if (VisualizzaSottoAgenti == 'True')
        urlToOpen = urlToOpen + '&VisualizzaSottoAgenti=1';
    if (NascondiUtentiDisabilitati == 'True')
        urlToOpen = urlToOpen + '&NascondiUtentiDisabilitati=1';

    var winUser = window.open(urlToOpen, 'userpopup_window', 'width=400,height=350,left=430px,top=450px');
    winUser.focus();
}

// Visualizza la pop up per la selezione dell'utente
function openUserPopUpRete(Url, idFieldName, descFieldName, userFilter) {
    var urlToOpen = Url + '?valField=' + idFieldName + '&descField=' + descFieldName + '&userFilter=' + userFilter;

    var winUser = window.open(urlToOpen, 'userpopup_window', 'width=600,height=450,left=330px,top=300px');
    winUser.focus();
}

// Visualizza la pop up per la selezione dell'anagrafica
function openAnagraficaPopUp(Url, idFieldName, descFieldName, idHidID, idHinCognome, idHidNome, btnSblocca, userFilter, idHidIDUtente, autoPostBack) {
    var urlToOpen = Url + '?valField=' + idFieldName + '&descField=' + descFieldName + '&HidID=' + idHidID + '&HidCognome=' + idHinCognome + '&HidNome=' + idHidNome + '&btnSblocca=' + btnSblocca + '&userFilter=' + userFilter + '&HidIDUtente=' + idHidIDUtente;
    if (autoPostBack == 'True')
        urlToOpen = urlToOpen + '&AutoPostBack=1';

    var winUser = window.open(urlToOpen, 'userpopup_window', 'width=600,height=450,left=330px,top=300px');
    winUser.focus();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function CouponPageResize() {

    //se il coupone e' piu' lungo della pagina, alzo la pagina
    var tblMain = document.getElementById("tblMainContent");
    var objCpn = document.getElementById("divCoupon");
    var tblMainOldHeight
    if (tblMain == null || objCpn == null) return;

    tblMainOldHeight = tblMain.clientHeight
    if ((objCpn.clientHeight - heightFooter) > tblMain.clientHeight) {
        tblMain.style.height = (objCpn.clientHeight - heightFooter) + "px"
    } else if (tblMain.clientHeight > objCpn.clientHeight) {
        tblMain.style.height = ""
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Funzione usata in un timer per controllare la posizione del coupon e della treeview
function checkLocation() {

    if (typeof (couponPositionCSSFixed) == 'undefined') { CouponPageResize(); }

    if (divCouponTopPosition == null) return
    if (divCouponTopPosition <= 0) return

    if (typeof (couponPositionCSSFixed) == 'undefined') {
        setTop("divCoupon", divCouponTopPosition);
    } else {
        setTopCSSFixed("divCoupon", divCouponTopPosition);
    }

    setTimeout("checkLocation()", 100);
}

function setTopCSSFixed(documentId, minOffset) {

    var obj = document.getElementById(documentId);
    if (obj == null) return;

    var bodyHeight = 0;

    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        bodyHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        bodyHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        bodyHeight = document.body.clientHeight;
    }

    var scrollTopVal = 0
    if (pageYOffset) {
        scrollTopVal = pageYOffset
    } else {
        var doc = document.documentElement ? document.documentElement : document.body;
        scrollTopVal = doc.scrollTop
    }


    if (scrollTopVal == 0) {
        if ($('#' + documentId).height() >= bodyHeight - divCouponTopPosition) {
            $('#' + documentId).css('top', bodyHeight - $('#' + documentId).height());
        } else {
            $('#' + documentId).css('top', divCouponTopPosition);
        }
    } else {
        if (scrollTopVal < divCouponTopPosition) {

            if ($('#' + documentId).height() >= bodyHeight - mindivCouponTopPosition) {
                $('#' + documentId).css('top', bodyHeight - $('#' + documentId).height());
            } else {

                if (mindivCouponTopPosition + (scrollTopVal - divCouponTopPosition) <= 0) {
                    $('#' + documentId).css('top', divCouponTopPosition - scrollTopVal);
                } else { $('#' + documentId).css('top', mindivCouponTopPosition); }

            }
        } else {

            if ($('#' + documentId).height() >= bodyHeight - mindivCouponTopPosition) {
                $('#' + documentId).css('top', bodyHeight - $('#' + documentId).height());
            } else {
                $('#' + documentId).css('top', mindivCouponTopPosition);
            }
        }
    }

}

function setTop(documentId, minOffset) {
    var obj = document.getElementById(documentId);
    if (obj == null) return;

    var divMainHeight = $("#tblMainContent").height();
    var y = minOffset;
    var offsetY = 0;
    var posY = 0;
    var couponTotal = 0
    var CpnTop = 0

    var bodyHeight = 0;
    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        bodyHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        bodyHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        bodyHeight = document.body.clientHeight;
    }

    if (navigator.appName == "Netscape") {
        if ((window.pageYOffset > minOffset) && (bodyHeight > obj.clientHeight)) {
            obj.style.top = (window.pageYOffset) + "px";
            CpnTop = window.pageYOffset
        } else {
            if ((window.pageYOffset < minOffset) || ((window.pageYOffset - (obj.clientHeight - bodyHeight)) < minOffset)) {
                obj.style.top = minOffset + "px";
                CpnTop = minOffset
            } else {
                obj.style.top = window.pageYOffset - (obj.clientHeight - bodyHeight) + "px";
                CpnTop = window.pageYOffset - (obj.clientHeight - bodyHeight)
            }
        }
    }
    else {
        var doc = document.documentElement ? document.documentElement : document.body;


        if ((doc.scrollTop > minOffset) && (bodyHeight > (obj.clientHeight))) {
            //coupon da spostare più basso della pagina
            obj.style.pixelTop = doc.scrollTop;
            CpnTop = doc.scrollTop;

        } else {
            if ((doc.scrollTop < minOffset) || ((doc.scrollTop - (obj.clientHeight - bodyHeight)) < minOffset)) {
                //coupon in alto
                obj.style.pixelTop = minOffset;
                CpnTop = minOffset;
            } else {

                //coupon da spostare più alto della pagina
                obj.style.pixelTop = doc.scrollTop - (obj.clientHeight - bodyHeight);
                CpnTop = doc.scrollTop - (obj.clientHeight - bodyHeight);
            }
        }
    }

    
    if ((obj.clientHeight + CpnTop) >= divMainHeight) {
        $('#divCoupon').css('padding-bottom', heightFooter + 'px');
    } else { $('#divCoupon').css('padding-bottom', '0px'); }    

    if ((obj.clientHeight + CpnTop) >= divMainHeight && obj.offsetTop - heightFooter > divCouponTopPosition) {
        obj.style.top = (obj.offsetTop - heightFooter) + "px"; 
    }

    
}

function getScrollTop() {
    if (typeof pageYOffset != 'undefined') {
        //most browsers        
        return pageYOffset;
    } else {
        var B = document.body;
        //IE 'quirks'        
        var D = document.documentElement;
        //IE with doctype
        D = (D.clientHeight) ? D : B; return D.scrollTop;
    }
}

//centering modal PopUp
function centerPopup(IDPopup, IDBackground) {
    //request data for centering
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var popupHeight = $("#" + IDPopup).height();
    var popupWidth = $("#" + IDPopup).width();
    
    $.event.trigger({
        type: "centerPopup",
        idPopup: IDPopup,
        idBackground: IDBackground});


    if (typeof enableCSSModal != 'undefined') {
        return;
    }
    //centering
    $("#" + IDPopup).css({
        "position": "fixed",
        "top": windowHeight / 2 - popupHeight / 2,
        "left": windowWidth / 2 - popupWidth / 2
    });

    //only need force for IE6
    $("#" + IDBackground).css({
        "height": windowHeight
    });
}

function loadPopup(IDPopup, IDBackground) {
    //loads popup only if it is disabled
    $("#" + IDBackground).css({
        "opacity": "0.7"
    });
    $("#" + IDBackground).fadeIn("slow");
    $("#" + IDPopup).fadeIn("slow");
}

function disablePopup(IDPopup, IDBackground) {
    $.event.trigger({ type: "closePopup"});
    //disables popup only if it is enabled
    $("#" + IDBackground).fadeOut("slow");
    $("#" + IDPopup).fadeOut("slow");
}

function initializePopup(closebtn, IDPopup, IDBackground) {
    //CLOSING POPUP
    //Click the x event!
    $("#" + closebtn).click(function () {
        disablePopup(IDPopup, IDBackground);
    });
    //Click out event!
    $("#" + IDBackground).click(function () {
        disablePopup(IDPopup, IDBackground);
    });
    //Press Escape event!
    $(document).keypress(function (e) {
        if (e.keyCode == 27) {
            disablePopup(IDPopup, IDBackground);
        }
    });

}

function initializeModalPopup(closebtn, IDPopup, IDBackground) {
    //CLOSING POPUP
    //Click the x event!
    $("#" + closebtn).click(function () {
        disablePopup(IDPopup, IDBackground);
    });
    //Click out event!
    //$("#" + IDBackground).click(function () {
    //    disablePopup(IDPopup, IDBackground);
    //});
    //Press Escape event!
    //$(document).keypress(function (e) {
    //    if (e.keyCode == 27) {
    //        disablePopup(IDPopup, IDBackground);
    //    }
    //});

}

//Funzioni per assegnare lo stile al bottone (on MouseOver  e on MouseOut)
function RollIn(button, classname) {
    button.className = classname;
}

function RollOut(button, classname) {
    button.className = classname;
}


function getWindowHeight() {
    var bodyHeight = 0;
    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        bodyHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        bodyHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        bodyHeight = document.body.clientHeight;
    }
    return bodyHeight
}

/* Funzioni usate per verificare la lunghezza delle textbox multiline */
function checkTextAreaMaxLength(textBox, e, mLen) {
    var maxLength = parseInt(mLen);
    if (!checkSpecialKeys(e)) {
        if (textBox.value.length > maxLength - 1) {
            if (window.event)//IE
                e.returnValue = false;
            else//Firefox
                e.preventDefault();
        }
    }
}
function checkSpecialKeys(e) {
    if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40)
        return false;
    else
        return true;
}


//Funzione per il "fading" dei banner
function FadeBanner(classDiv) {
    //se ho un solo bannere non animo
    if ($('.' + classDiv + ' A').length == 1) return


    var $active = $('.' + classDiv + ' A.active');
    if ($active.length == 0) $active = $('.' + classDiv + ' A:last');

    var $next = $active.next().length ? $active.next() : $('.' + classDiv + ' A:first');
    $active.addClass('last-active');
    $next.css({ opacity: 0.0 })
            .addClass('active')
            .animate({ opacity: 1.0 }, 1000, function () {
                $active.removeClass('active last-active');
            });
}

function HideErrorCF() {
    $("body").click(function () {
        $(".ErrCodiceFiscale").hide();
    });
}

function miniSitePopup(url) {
    new_win = window.open(url, "new_win", "status=0, menubar=0,toolbar=0, scrollbars=1, resizable=0, height=700,width=820");
}


function expandCollapse(divClicked, divToExpand) {
    $(divToExpand).slideToggle(500, function () {
        $(divClicked).toggleClass('Sel');
    });
}

/*stampa anagrafica*/
function stampaAnagrafica(urlToOpen, IDAnagrafica, IDCoupon) {
    if (IDAnagrafica != "") {
        var winUser = window.open(urlToOpen + '?IDAnagrafica=' + IDAnagrafica + '&IDCoupon=' + IDCoupon, 'userPrint_window', 'scrollbars=1, menubar=1,width=600,height=450,left=330px,top=300px');
        winUser.focus();
    }
}

function getNumberFromString(myNumber) {
    return parseFloat(myNumber.replace(sepDec, "."));
}

/* abilita il div di wait per i report agente */
function enableWaitReport(show) {
    if (typeof jQuery != 'undefined') {
        if (show == true) {
            $('#divWaitReport').show();
        } else {
            $('#divWaitReport').hide();
        }
    } else {
        console.log('Common.enableWaitReport() - jQuery not defined!');
    }
}

function checkTxtNumber(mainEvent, decimalSeparator,numDecimal) {
    var sepKeyCode = 0;

    if (numDecimal > 0) {
        if (decimalSeparator == ',') {
            sepKeyCode = 188;
        } else if (decimalSeparator == '.') {
            sepKeyCode = 190;
        } else {
            sepKeyCode = decimalSeparator.charCodeAt(0);
        }
    }

    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(mainEvent.keyCode, [46, 8, 9, 27, 13, 110, sepKeyCode]) !== -1 ||
        // Allow: Ctrl+A
        (mainEvent.keyCode == 65 && mainEvent.ctrlKey === true) ||
        // Allow: home, end, left, right
        (mainEvent.keyCode >= 35 && mainEvent.keyCode <= 39)) {
        return;
    }

    // Ensure that it is a number and stop the keypress
    if ((mainEvent.shiftKey || (mainEvent.keyCode < 48 || mainEvent.keyCode > 57)) && (mainEvent.keyCode < 96 || mainEvent.keyCode > 105)) {
        mainEvent.preventDefault();
    }
}

function disabledEventPropagation(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    else if (window.event) {
        window.event.cancelBubble = true;
    }
}

function clickOnconfirm(confirmText, idButton) {
    if (confirm(confirmText)) {
        if (typeof $("#" + idButton).click === 'function') $("#" + idButton).click();        
    }    
}