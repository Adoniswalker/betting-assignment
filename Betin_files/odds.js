
function treeCheckAll(chk) {
    $('#menuSports :checkbox').attr('checked', chk.checked);
}

function apriEvento(IDEvento) {
    var idG = $('#e' + IDEvento).attr("idG");
    var idS = $('#g' + idG).attr("idS");
    $('#s' + idS + ' ul:first').show();

    //Apro l'ul del gruppo    
    var chkElement = $('#g' + idG + ' ul:first');
    chkElement.show();

    //Imposto la classe Sel all'evento
    $('#e' + IDEvento + ' a:first').addClass("VoceSel");
}

function initMenu() {
    //Nascondo i menu
    $('#menuSports ul').hide();

    //Verifico se è valorizzato l'IDEvento
    if (typeof (sTxtEventi) != "undefined") {
        var oTxtEventi = document.getElementById(sTxtEventi);
        if (oTxtEventi.value != "") {
            var IDs = new Array();
            IDs = oTxtEventi.value.split(",");
            for (i = 0; i < IDs.length; i++) {
                apriEvento(IDs[i]);

                //Imposto la classe Sel all'evento
                $('#chke' + IDs[i]).attr('checked', true);
            }
        }
    }

    $('#menuSports li a').click(
                function() {
                    var checkElement = $(this).next();

                    if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
                        checkElement.css('display', 'none');
                    } else {
                        checkElement.css('display', '');
                    }
                }
            );

    $('#menuSports .chkSport').click(
                function() {
                    $(this).closest("li").find(".chkGruppo").attr('checked', $(this).is(':checked'));
                    $(this).closest("li").find(".chkEvento").attr('checked', $(this).is(':checked'));
                }
            );

    $('#menuSports .chkGruppo').click(
                function() {
                    $(this).closest("li").find(".chkEvento").attr('checked', $(this).is(':checked'));
                }
            );

    $('#menuSports li ul li ul li a').click(
                function() {
                    if ($(this).hasClass("VoceSel")) {
                        $(this).removeClass("VoceSel");
                        //Check
                        $(this).parent().find('.chkEvento').attr('checked', false);
                    } else {
                        $(this).addClass("VoceSel");
                        //Check
                        $(this).parent().find('.chkEvento').attr('checked', true);
                    }
                }
            );

}
function TVCheckedHandler() {
    var checkedNodes = $('#menuSports .chkEvento:checked');

    if (checkedNodes.length > TVClientLimiteCampionati) {
        alert(TVClientLimiteCampionatiErr)
    } else {
        if (typeof (sTxtEventi) != "undefined") {
            ShowEvents(sTxtEventi, sBtnLoadEventi, checkedNodes);
        } else {
            GoTV(0);
        }
    }
    return false;
}


//GESTIONE QUOTE ASYNC
function ShowEventAsync(txtID, IDEvento, showGQ, showDate, IDGruppoQuota, IDTipoEvento, GruppiSep, mainDiv) {
    var txt = document.getElementById(txtID);
    var IDRiquadro;
    var IDmainDiv
    var limitElement = (typeof (LimiteEventiVisualizzabili) =='number') ? LimiteEventiVisualizzabili: -1;

    if (typeof (mainDiv) == "undefined") {
        IDmainDiv = "#divMainEvents"
    } else {
        IDmainDiv = "#" + mainDiv
    }

    //Prima di aggiungere l'IDEvento verifico che non sia già presente
    if (GruppiSep == 1) {
        IDRiquadro = IDEvento + 'G' + IDGruppoQuota
    } else {
        IDRiquadro = IDEvento
    }

    if (txt.value != "") {
        var IDs = new Array();
        IDs = txt.value.split(",");
        for (i = 0; i < IDs.length; i++) {
            if (IDs[i] == IDEvento) {
                //Se lo trovo rimuovo la selezione
                IDs.splice(i, 1);

                txt.value = IDs.join(",");
                if (IDTipoEvento == 10) {
                    $('#riqEL' + IDRiquadro).remove();
                    $.event.trigger('oddsAsyncRemoved', IDEvento);
                }
                else {
                    $('#riqE' + IDRiquadro).remove();             
                    $.event.trigger('oddsAsyncRemoved', IDEvento);
                }
                if ($(IDmainDiv).children().length == 0) { ShowHideOddsMsg(txtID); }
                return
            }
        }

        var strIDEventoOld = txt.value
        var eventsCount = strIDEventoOld.split(",").length;

        if ((limitElement <= 0) ||(eventsCount < limitElement)) {
            txt.value = IDEvento + "," + strIDEventoOld;
        } else { return }
    } else {
        txt.value = IDEvento;        
    }

     //Seleziona la check
        //if (node != null) node.Check();
    if (IDGruppoQuota == null) {
        LoadEventAsync(IDEvento, null, txtID, showGQ, showDate, IDTipoEvento, GruppiSep, mainDiv);
    } else {
        LoadEventAsyncConIDGQ(IDEvento, IDGruppoQuota, txtID, showGQ, showDate, IDTipoEvento, GruppiSep, mainDiv);
    }
}
//aggiorna dati per evento e gruppoquota
function LoadEventAsyncConIDGQ(IDEvento, IDGruppoQuota, txtID, showGQ, showDate, IDTipoEvento, GruppiSep, mainDiv) {
    var objUpdate = '#' + sUpdateProgress;

    var IDmainDiv
    if (typeof (mainDiv) == "undefined") {
        IDmainDiv = "#divMainEvents"
    } else {
        IDmainDiv = "#" + mainDiv
    }

    //Se il parametro showGQ o showDate non vengono passati default = 1
    if (showGQ == null) showGQ = 1;
    if (showDate == null) showDate = 1;

    try {

        $(objUpdate).show();

        var srnd = String(Math.random())
        srnd = srnd.replace(".", "").replace(",", "");

        //Se il tipo evento è LIve devo utilizzare una pagina differete
        var nomePagina;

      
        
        if (IDTipoEvento == 10) {
            if (typeof (nomePaginaLive) == "undefined") {
                nomePagina = "OddsEventLive";
            } else {
               nomePagina = nomePaginaLive;  
            }
        } else {
            nomePagina = "OddsEvent";
        }


        if (typeof (nomePaginaOddsAsync) != "undefined") {
            nomePagina = nomePaginaOddsAsync;
        }

        var percorsoControls = (typeof (controlsFolderPath) == "string") ? controlsFolderPath : "../Controls";        

        $.get(percorsoControls + '/' + nomePagina + '.aspx?ShowLinkFastBet=' + ShowLinkFB() + '&showDate=' + showDate + '&showGQ=' + showGQ + '&rnd=' + srnd + '&EventID=' + IDEvento + '&IDGruppoQuota=' + IDGruppoQuota + '&GroupSep=' + GruppiSep, function (data) { $(IDmainDiv).prepend(data); selezionaQuote(); ShowHideOddsMsg(txtID); $(objUpdate).hide(); $.event.trigger('oddsAsyncIDGQAdded', IDEvento); });

    } catch (ex) {
        $(objUpdate).hide();
    }
}
//aggiorna dati per evento e gruppoquota
function LoadEventAsync(IDEvento, IDGruppoQuota, txtID, showGQ, showDate, IDTipoEvento, GruppiSep, mainDiv) {  
    var IDmainDiv
    if (typeof (mainDiv) == "undefined") {
        IDmainDiv = "#divMainEvents"
    } else {
        IDmainDiv = "#" + mainDiv
    }

    var objUpdate = '#' + sUpdateProgress;
    //Se il parametro showGQ o showDate non vengono passati default = 1
    if (showGQ == null) showGQ = 1;
    if (showDate == null) showDate = 1;

    try {
        $(objUpdate).show();

        var srnd = String(Math.random())
        srnd = srnd.replace(".", "").replace(",", "");

        //Se il tipo evento è LIve devo utilizzare una pagina differete
        var nomePagina;
        var nomeRiquadro = "riqE"
        if (IDTipoEvento == 10) {
            nomePagina = "OddsEventLive";
            nomeRiquadro = "riqEL"
        } else {
            nomePagina = "OddsEvent";
            nomeRiquadro = "riqE"
        }

        if (typeof (nomePaginaOddsAsync) != "undefined") {
            nomePagina = nomePaginaOddsAsync
        }

        var percorsoControls = (typeof (controlsFolderPath) == "string") ? controlsFolderPath : "../Controls";

        if (IDGruppoQuota == null) {
            $.get(percorsoControls +'/' + nomePagina + '.aspx?ShowLinkFastBet=' + ShowLinkFB() + '&showDate=' + showDate + '&showGQ=' + showGQ + '&rnd=' + srnd + '&EventID=' + IDEvento + '&GroupSep=' + GruppiSep, function (data) { $(IDmainDiv).prepend(data); selezionaQuote(); ShowHideOddsMsg(txtID); $(objUpdate).hide(); $.event.trigger('oddsAsyncAdded', IDEvento); });
        } else {
            //Verifico se ho chiesto il cambio gruppo quota di un evento live
           
            if (GruppiSep == 1) {
                if (document.getElementById(nomeRiquadro + IDEvento + 'G' + IDGruppoQuota) == null) return;
                $.get(percorsoControls +'/' + nomePagina + '.aspx?ShowLinkFastBet=' + ShowLinkFB() + '&showDate=' + showDate + '&showGQ=' + showGQ + '&rnd=' + srnd + '&EventID=' + IDEvento + '&IDGruppoQuota=' + IDGruppoQuota + '&GroupSep=' + GruppiSep, function (data) { $('#' + nomeRiquadro + IDEvento + 'G' + IDGruppoQuota).replaceWith(data); selezionaQuote(); ShowHideOddsMsg(txtID); $(objUpdate).hide(); $.event.trigger('oddsAsyncAdded', IDEvento); });

            } else {
                if (document.getElementById(nomeRiquadro + IDEvento) == null) return;
                $.get(percorsoControls +'/' + nomePagina + '.aspx?ShowLinkFastBet=' + ShowLinkFB() + '&showDate=' + showDate + '&showGQ=' + showGQ + '&rnd=' + srnd + '&EventID=' + IDEvento + '&IDGruppoQuota=' + IDGruppoQuota + '&GroupSep=' + GruppiSep, function (data) { $('#' + nomeRiquadro + IDEvento).replaceWith(data); selezionaQuote(); ShowHideOddsMsg(txtID); $(objUpdate).hide(); $.event.trigger('oddsAsyncGroupChanged', IDEvento); });
            }
        }
    } catch (ex) {
        $(objUpdate).hide();
    }
}

//Verifico il parametro che abilita il linkFB
function ShowLinkFB() {
    if (typeof (showLinkCodPub) == "undefined") {
        return 0;
    } else {
        return showLinkCodPub;
    }
}


function FirstLoadEventAsync(IDEvento, txtID, showGQ, showDate, IDTipoEvento, GruppiSep) {
   
    var objUpdate = '#' + sUpdateProgress;

    //Se il parametro showGQ o showDate non vengono passati default = 1
    if (showGQ == null) showGQ = 1;
    if (showDate == null) showDate = 1;

    try {

        $(objUpdate).show();

        var srnd = String(Math.random())
        srnd = srnd.replace(".", "").replace(",", "");

        //Se il tipo evento è LIve devo utilizzare una pagina differete
        var nomePagina;
        if (IDTipoEvento == 10)
            nomePagina = "OddsEventLive";
        else
            nomePagina = "OddsEvent";


        if (typeof (nomePaginaOddsAsync) != "undefined") {
            nomePagina = nomePaginaOddsAsync;
        }

        var percorsoControls = (typeof (controlsFolderPath) == "string") ? controlsFolderPath : "../Controls";

        if ($('#' + sTxtEventiIDGruppoQuota).val() != '') {
            $.get(percorsoControls + '/' + nomePagina + '.aspx?ShowLinkFastBet=' + ShowLinkFB() + '&showDate=' + showDate + '&showGQ=' + showGQ + '&rnd=' + srnd + '&EventID=' + IDEvento + '&IDGruppoQuota=' + $('#' + sTxtEventiIDGruppoQuota).val() + '&GroupSep=' + GruppiSep, function (data) { $('#divMainEvents').append(data); selezionaQuote(); ShowHideOddsMsg(txtID); $(objUpdate).hide(); $.event.trigger('oddsAsyncAdded', IDEvento); });
        } else {
            $.get(percorsoControls + '/' + nomePagina + '.aspx?ShowLinkFastBet=' + ShowLinkFB() + '&showDate=' + showDate + '&showGQ=' + showGQ + '&rnd=' + srnd + '&EventID=' + IDEvento + '&GroupSep=' + GruppiSep, function (data) { $('#divMainEvents').append(data); selezionaQuote(); ShowHideOddsMsg(txtID); $(objUpdate).hide(); $.event.trigger('oddsAsyncAdded', IDEvento); });
        }
   
    } catch (ex) {
        $(objUpdate).hide();
    }
}


function RefreshEventAsync(IDEvento, IDGruppoQuota, txtID, showGQ, showDate, IDTipoEvento, GruppiSep) {
    var srnd = String(Math.random())
    srnd = srnd.replace(".", "").replace(",", "");
  
    //Se il tipo evento è LIve devo utilizzare una pagina differete
    var nomePagina;
    var nomeRiquadro = "riqE"
    if (IDTipoEvento == 10) {
        if (typeof (nomePaginaLive) == "undefined") {
            nomePagina = "OddsEventLive";
        } else {
            nomePagina = nomePaginaLive;
        }
        nomeRiquadro = "riqEL"
    } else {
        nomePagina = "OddsEvent";
        nomeRiquadro = "riqE"
    }

    if (typeof (nomePaginaOddsAsync) != "undefined") {
        nomePagina = nomePaginaOddsAsync
    }

    var objUpdate = '#' + sUpdateProgress;

    //Se il parametro showGQ o showDate non vengono passati default = 1
    if (showGQ == null) showGQ = 1;
    if (showDate == null) showDate = 1;

  
    try {
        $(objUpdate).show();
        var percorsoControls = (typeof (controlsFolderPath) == "string") ? controlsFolderPath : "../Controls";

        if (GruppiSep == 1) {
          
            $.get(percorsoControls + '/' + nomePagina + '.aspx?ShowLinkFastBet=' + ShowLinkFB() + '&showDate=' + showDate + '&showGQ=' + showGQ + '&rnd=' + srnd + '&EventID=' + IDEvento + '&IDGruppoQuota=' + IDGruppoQuota + '&GroupSep=' + GruppiSep, function (data) { $('#' + nomeRiquadro + IDEvento + 'G' + IDGruppoQuota).replaceWith(data); selezionaQuote(); ShowHideOddsMsg(txtID); $.event.trigger('oddsAsyncRefreshed', IDEvento); $(objUpdate).hide(); });

        } else {
            var oldItemCSS = $('#' + nomeRiquadro + IDEvento).attr('class');
            var oldlnkOtherCSS = 'lnkOther'
            if ($('#' + nomeRiquadro + IDEvento + ' .lnkOther').lenght > 0){
                oldlnkOtherCSS = $('#' + nomeRiquadro + IDEvento + ' .lnkOther').attr('class');
            }
 
            $.get(percorsoControls + '/' + nomePagina + '.aspx?ShowLinkFastBet=' + ShowLinkFB() + '&showDate=' + showDate + '&showGQ=' + showGQ + '&rnd=' + srnd + '&EventID=' + IDEvento + '&IDGruppoQuota=' + IDGruppoQuota + '&GroupSep=' + GruppiSep, function (data) {
                if (data.length == 0) { CloseBoxOdds(IDEvento); }
                if (IDTipoEvento == 10) {
                    data = data.replace('class="item"', 'class="' + oldItemCSS + '"')
                    data = data.replace('class="lnkOther"', 'class="' + oldlnkOtherCSS + '"')
                }
                $('#' + nomeRiquadro + IDEvento).replaceWith(data);
                selezionaQuote();
                ShowHideOddsMsg(txtID);
                $.event.trigger('oddsAsyncRefreshed', IDEvento);
                $(objUpdate).hide();

            });
            
        }
       
    } catch (ex) {
        $(objUpdate).hide();
    }
}

//Visualizza/Nasconde il messaggio di errore e giocabilità
function ShowHideOddsMsg(txtID) {    
    var txt = document.getElementById(txtID);

    if (txt.value == '') {
        $('#oddsAsyncMsg_Empty').show();
        $('#oddsAsyncMsg_Many').hide();
        $('#oddsAsyncLgnd').hide();
        return;
    } else {
        var IDs = new Array();
        IDs = txt.value.split(",");
        if ((IDs.length >= LimiteEventiVisualizzabili) && (LimiteEventiVisualizzabili > 0)) {
            $('#oddsAsyncMsg_Many').show();
            $('#oddsAsyncMsg_Empty').hide();
            $('#oddsAsyncLgnd').hide();
            return;
        } 
        if ($("#divMainEvents").html() == '') {
            $('#oddsAsyncMsg_Empty').show();
            $('#oddsAsyncLgnd').hide();
            return
        }
    }
    $('#oddsAsyncMsg_Empty').hide();
    $('#oddsAsyncMsg_Many').hide();
    $('#oddsAsyncLgnd').show();
}

function setFBCode(codiceFB) {
    //Imposto il codicepub cliccato nella textbox
    $("#txtCodPub").val(codiceFB);

    //Chiamata al ws che compila la dropdown
    getTQ();
}

function CloseBoxOdds(IDE) {
    var tree = null

    //deseleziono l'eventuale checkbox dalla TreeView
    var nodoTV = $('#menuSports #chke' + IDE + '.chkEvento:checked ');
    if (nodoTV.attr('checked') == true) { nodoTV.attr('checked', false) }

    $.event.trigger('oddsAsyncRemoved', IDE);

    //nascondo quota    
    ShowEventAsync(sTxtEventi, IDE);
}

function SelOddsDet(IDQuota) {
    $('.SETQCon #div_' + IDQuota).toggleClass('sel')
}
