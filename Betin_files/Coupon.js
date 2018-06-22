function GiocaCouponPrecompilato(idCouponPrecompilato) {
    if (idCouponPrecompilato != -1) {
        var btn = document.getElementById(sCouponPrecompilatoButtonClientID);
        var txt = document.getElementById(sCouponPrecompilatoIDClientID);

        txt.value = idCouponPrecompilato;
        btn.click()
    }
}

function GiocaCouponPrecompilatoConImporto(idCouponPrecompilato, Importo) {
    if (idCouponPrecompilato != -1) {
        var btn = document.getElementById(sCouponPrecompilatoButtonClientID);
        var txt = document.getElementById(sCouponPrecompilatoIDClientID);
        var txtImporto = document.getElementById(sCouponPrecompilatoIDClientImporto);

        txtImporto.value = Importo

        if (sepDec == ",") {
            txtImporto.value = txtImporto.value.replace(".", sepDec);
        }

        txt.value = idCouponPrecompilato;
        btn.click()
    }
}

function arrotonda(importo, decimali) {    
    if (decimali == null) decimali = getNumeroDecimali();//"2";
    
    var fImportoDI;
    switch (decimali.toString()) {
        case "0":
            fImportoDI = Math.round(importo);
            break;
        case "1":
            fImportoDI = Math.round(importo * 10) / 10;
            break;
        case "2":
            fImportoDI = Math.round(importo * 100) / 100;
            break;
        case "3":
            fImportoDI = Math.round(importo * 1000) / 1000;
            break;
        case "4":
            fImportoDI = Math.round(importo * 10000) / 10000;
            break;
    }
    
    return fImportoDI;
}


function tronca(figure, decimals) {
    if (!decimals) decimals = getNumeroDecimali();
    var d = Math.pow(10, decimals);
    return parseFloat((parseInt(figure * d) / d).toFixed(decimals));
};

//function tronca(importo, decimali) {
//    if (decimali == null) decimali = getNumeroDecimali();//"2";

//    var fImportoDI;
//    switch (decimali.toString()) {
//        case "0":
//            fImportoDI = Math.trunc(importo);
//            break;
//        case "1":
//            fImportoDI = Math.trunc(importo * 10) / 10;
//            break;
//        case "2":
//            fImportoDI = Math.trunc(importo * 100) / 100;
//            break;
//        case "3":
//            fImportoDI = Math.trunc(importo * 1000) / 1000;
//            break;
//        case "4":
//            fImportoDI = Math.trunc(importo * 10000) / 10000;
//            break;
//    }

//    return fImportoDI;
//}

function calcVpSingolaMultipla(fQuotaTotale, fQuotaBonus, sObjImportoGiocato, sObjVincitaPotenziale, sObjImgAlert, sObjBonus, fSogliaVincitaMaxBonus) {
    var sDecimalSeparator = sepDec;
    var oImportoGiocato = document.getElementById(sObjImportoGiocato);
    var oVincitaPotenziale = document.getElementById(sObjVincitaPotenziale);
    var oImgCaution = document.getElementById(sObjImgAlert);
    var oBonus = document.getElementById(sObjBonus);

    oImgCaution.style.visibility = "hidden";

    if (oImportoGiocato.value == "") {
        oVincitaPotenziale.innerHTML = "";
        if (oBonus != null) oBonus.innerHTML = "";
        return;
    } else {
        if (isNaN(parseFloat(oImportoGiocato.value.replace(",", ".")))) oImgCaution.style.visibility = "";
    }

    var vincitaPotConBonus = arrotonda(fQuotaTotale * fQuotaBonus * parseFloat(oImportoGiocato.value.replace(",", ".")));
    var vincitaPotSenzaBonus = arrotonda(fQuotaTotale * parseFloat(oImportoGiocato.value.replace(",", ".")));
    var vincitaBonus = vincitaPotConBonus - vincitaPotSenzaBonus;

    var vincitaPot = arrotonda((fQuotaTotale * parseFloat(oImportoGiocato.value.replace(",", "."))) + Math.min(vincitaBonus, fSogliaVincitaMaxBonus));    

    oVincitaPotenziale.innerHTML = vincitaPot;
    if (oBonus != null) oBonus.innerHTML = Math.min((arrotonda(fQuotaTotale * (fQuotaBonus - 1) * parseFloat(oImportoGiocato.value.replace(",", ".")))), fSogliaVincitaMaxBonus);
    
    if (sDecimalSeparator == ",") {
        oVincitaPotenziale.innerHTML = oVincitaPotenziale.innerHTML.replace(".", sepDec);
        if (oBonus != null) oBonus.innerHTML = oBonus.innerHTML.replace(".", sepDec);
    }

    $.event.trigger('CouponChanged');
}

var splitImp = 0;

function splitImportoDI() {
    splitImp = 1;
    var oTxtTotaleDI = document.getElementById(sTxtTotaleDI);
    var oTxtImportoDI = document.getElementById(sTxtImportoDI);
    var oImportoDICombinazioni = document.getElementById(sLblImportoDICombinazioni);
    if (oTxtTotaleDI == null) return;
    if (oTxtImportoDI == null) return;
    if (oImportoDICombinazioni == null) return;

    if (oTxtTotaleDI.value == "") {
        oTxtImportoDI.value = "";
        splitImp = 0;
        return;
    }
    var fTotaleDI = parseFloat(oTxtTotaleDI.value.replace(sepDec, '.'));
    var fnumComb = parseFloat(oImportoDICombinazioni.innerHTML.replace(sepDec, '.'));
    if (isNaN(fTotaleDI)) {
        oTxtImportoDI.value = "";
        splitImp = 0;
        return;
    }

    //Arrotondo max a 4 decimali
    var fImportoDI = parseFloat((fTotaleDI / fnumComb));
    fImportoDI = Math.round(fImportoDI * 10000) / 10000;
    oTxtImportoDI.value = fImportoDI.toString().replace(".", sepDec);

    var oTxtImportoDI = document.getElementById(sTxtImportoDI);
    if (oTxtImportoDI != null) oTxtImportoDI.onkeyup();
    splitImp = 0;
}

function calcVpDI(fQuotaTotale, fQuotaTotaleMin, sObjImportoGiocato, sObjVincitaPotenziale, sObjImportoDIGiocato, sObjImportoDICombinazioni, fBonus, fBonusMin, fSogliaVincitaMaxBonus) {
    var sDecimalSeparator = sepDec;
    var oImportoGiocato = document.getElementById(sObjImportoGiocato);
    var oVincitaPotenziale = document.getElementById(sObjVincitaPotenziale);
    var oVincitaPotenzialeMin = document.getElementById("spanVincitaPotMin").childNodes[0];
    var oImportoDIGiocato = document.getElementById(sObjImportoDIGiocato);
    var oImportoDICombinazioni = document.getElementById(sObjImportoDICombinazioni);
    var oImgCaution = document.getElementById("spanCautionDI").childNodes[0];
    var oBonusMinDI;
    if (document.getElementById("spanBonusMaxDI") != null) oBonusMinDI = document.getElementById("spanBonusMinDI").childNodes[0];
    var oBonusMaxDI;
    if (document.getElementById("spanBonusMaxDI") != null) oBonusMaxDI = document.getElementById("spanBonusMaxDI").childNodes[0];

    oImgCaution.style.display = "none";

    if (oImportoGiocato.value == "") {
        oVincitaPotenziale.innerHTML = "";
        oVincitaPotenzialeMin.innerHTML = "";
        if (oBonusMinDI != null) oBonusMinDI.innerHTML = "";
        if (oBonusMaxDI != null) oBonusMaxDI.innerHTML = "";
        if (oImportoDIGiocato != null) oImportoDIGiocato.value = "";
        return;
    } else {
        if (isNaN(parseFloat(oImportoGiocato.value.replace(",", ".")))) oImgCaution.style.display = "inline";
    }

    if (bBookmkaerIT != true) {
        var VincitaPotenzialeBonus = arrotonda(fQuotaTotale * fBonus * parseFloat(oImportoGiocato.value.replace(",", ".")));
        var VincitaPotenziale = arrotonda(fQuotaTotale * parseFloat(oImportoGiocato.value.replace(",", ".")));

        if ((VincitaPotenzialeBonus - VincitaPotenziale) > fSogliaVincitaMaxBonus) {
            oVincitaPotenziale.innerHTML = VincitaPotenziale + fSogliaVincitaMaxBonus;
        } else {
            oVincitaPotenziale.innerHTML = VincitaPotenzialeBonus
        }

        var VincitaPotenzialeMinBonus = arrotonda(fQuotaTotaleMin * fBonusMin * parseFloat(oImportoGiocato.value.replace(",", ".")));
        var VincitaPotenzialeMin = arrotonda(fQuotaTotaleMin * parseFloat(oImportoGiocato.value.replace(",", ".")));

        if ((VincitaPotenzialeMinBonus - VincitaPotenzialeMin) > fSogliaVincitaMaxBonus) {
            oVincitaPotenzialeMin.innerHTML = VincitaPotenzialeMin + fSogliaVincitaMaxBonus;
        } else {
            oVincitaPotenzialeMin.innerHTML = VincitaPotenzialeMinBonus
        }
    } else {
        oVincitaPotenziale.innerHTML = tronca(fQuotaTotale * fBonus * parseFloat(oImportoGiocato.value.replace(",", ".")));
        oVincitaPotenzialeMin.innerHTML = tronca(fQuotaTotaleMin * fBonusMin * parseFloat(oImportoGiocato.value.replace(",", ".")));
    }
    if (oBonusMinDI != null) {

        if (arrotonda(fQuotaTotaleMin * (fBonusMin - 1) * parseFloat(oImportoGiocato.value.replace(",", "."))) > fSogliaVincitaMaxBonus) {
            oBonusMinDI.innerHTML = fSogliaVincitaMaxBonus;
        } else {
            oBonusMinDI.innerHTML = arrotonda(fQuotaTotaleMin * (fBonusMin - 1) * parseFloat(oImportoGiocato.value.replace(",", ".")));
        }
    } 

    if (oBonusMaxDI != null) {

        if (arrotonda(fQuotaTotale * (fBonus - 1) * parseFloat(oImportoGiocato.value.replace(",", "."))) > fSogliaVincitaMaxBonus) {
            oBonusMaxDI.innerHTML = fSogliaVincitaMaxBonus;
        } else {
            oBonusMaxDI.innerHTML = arrotonda(fQuotaTotale * (fBonus - 1) * parseFloat(oImportoGiocato.value.replace(",", ".")));
        }
    }

    if (splitImp == 0) {
        oImportoDIGiocato.value = arrotonda(parseFloat(oImportoDICombinazioni.innerHTML.replace(",", ".")) * parseFloat(oImportoGiocato.value.replace(",", ".")));
    }

    if (sDecimalSeparator == ",") {
        oVincitaPotenziale.innerHTML = oVincitaPotenziale.innerHTML.replace(".", sepDec);
        oVincitaPotenzialeMin.innerHTML = oVincitaPotenzialeMin.innerHTML.replace(".", sepDec);
        if (oBonusMinDI != null) oBonusMinDI.innerHTML = oBonusMinDI.innerHTML.replace(".", sepDec);
        if (oBonusMaxDI != null) oBonusMaxDI.innerHTML = oBonusMaxDI.innerHTML.replace(".", sepDec);

        if (oImportoDIGiocato != null) oImportoDIGiocato.value = oImportoDIGiocato.value.replace(".", sepDec);
    }

    $.event.trigger('CouponChanged');
}


function calcVpSistema(iTipoComb, iNComb, fQuotaTotale, setImportoSis) {
    var sDecimalSeparator = sepDec;
    var oImportoGiocato = document.getElementById("spanTxtSis" + iTipoComb).childNodes[1];
    var oVincitaPotenziale = document.getElementById("spanVincitaPotSis").childNodes[0];
    var oVPComb = document.getElementById("spanTxtSisTot" + iTipoComb).childNodes[0];
    var oImgCaution = document.getElementById("spanTxtSisTot" + iTipoComb).childNodes[2];
    var oImportoBonus;
    if (document.getElementById("spanBonusSisMax") != null) oImportoBonus = document.getElementById("spanBonusSisMax").childNodes[0];

    oImgCaution.style.visibility = "hidden";

    if (oImportoGiocato.value == "") {
        oVPComb.innerHTML = "";
        oVincitaPotenziale.innerHTML = "";
        if (oImportoBonus != null) oImportoBonus.innerHTML = "";
    } else {
        if (isNaN(parseFloat(oImportoGiocato.value.replace(",", ".")))) oImgCaution.style.visibility = "";
    }
    if (oImportoGiocato.value != "") {
        //oVPComb.innerHTML = truncate((iNComb * parseFloat(oImportoGiocato.value.replace(",", "."))), 2);
        oVPComb.innerHTML = (iNComb * parseFloat(oImportoGiocato.value.replace(",", "."))); 
    }

    if (sDecimalSeparator == ",") {
        oVPComb.innerHTML = oVPComb.innerHTML.replace(".", sepDec);
        oVPComb.innerHTML = oVPComb.innerHTML.replace(".", sepDec);
    }

    calcolaTotaliSistema(sDecimalSeparator, setImportoSis);

    $.event.trigger('CouponChanged');
}

function calcolaTotaliSistema(sDecimalSeparator, setImportoSis) {
    var nDec = getNumeroDecimali();
    var oVincitaPotenziale = document.getElementById("spanVincitaPotSis").childNodes[0];
    var oVincitaPotenzialeMin = document.getElementById("spanVincitaMinSis").childNodes[0];
    var oImportoBonus;
    if (document.getElementById("spanBonusSisMax") != null) oImportoBonus = document.getElementById("spanBonusSisMax").childNodes[0];
    var oImportoBonusMin;
    if (document.getElementById("spanBonusSisMin") != null) oImportoBonusMin = document.getElementById("spanBonusSisMin").childNodes[0];
    var oImportoSis = document.getElementById("spanImportoSis").childNodes[1];

    oVincitaPotenziale.innerHTML = "";
    oVincitaPotenzialeMin.innerHTML = "";
    if (setImportoSis == 1) oImportoSis.value = "";

    if (oImportoBonus != null) oImportoBonus.innerHTML = "";
    if (oImportoBonusMin != null) oImportoBonusMin.innerHTML = "";

    var oTxtSistema, spanSistema, oTxtSistemaTotale, oQuotaComb, oQuotaBonusMin, oQuotaCombNoBonus, oQuotaBonusMinNoBonus;
    var importoMinBonus = 0;
    var TotaleGiocata = 0;
    var fVincitaPotCoupon = 0;
    var fVincitaMinCoupon = 0;
    var fImportoBonus = 0;
    var quotaMinimaBonusCoupon = 0;
    var IDValutaSel = $('#' + getIDDDLValuta()).val();

    for (var i = 1; i <= maxNumRaggruppamenti; i++) {
        spanSistema = document.getElementById("spanTxtSis" + i);
        if (spanSistema != null) {
            oTxtSistema = document.getElementById("spanTxtSis" + i).childNodes[1];
            oTxtSistemaTotale = document.getElementById("spanTxtSisTot" + i).childNodes[0];
            oQuotaComb = document.getElementById("spanHidQuota" + i).childNodes[0];
            //oQuotaBonus = document.getElementById("spanHidQuota" + i).childNodes[1];
            //oQuotaBonusMin = document.getElementById("spanHidQuota" + i).childNodes[2];
            oQuotaBonusMin = document.getElementById("spanHidQuota" + i).childNodes[1];
            oQuotaCombNoBonus = document.getElementById("spanHidQuota" + i).childNodes[2];
            oQuotaBonusMinNoBonus = document.getElementById("spanHidQuota" + i).childNodes[3];

            var oVincitaPotenzialeComb = document.getElementById("spanTxtSisVin" + i).childNodes[0];

            var oVincitaPotenzialeCombMin = $("#spanTxtSisVinMin" + i).children().first();
            var oVincitaPotenzialeCombMax = $("#spanTxtSisVinMax" + i).children().first();

            oVincitaPotenzialeComb.innerHTML = '0';
            oVincitaPotenzialeCombMin.html('0');
            oVincitaPotenzialeCombMax.html('0');

            if (oTxtSistema != null && oTxtSistema.value != "" && oTxtSistema.value != "0" && oTxtSistemaTotale != null && oTxtSistemaTotale.innerHTML != "" && oQuotaComb != null && oQuotaComb.value != "") {
                //Moltiplicatore bonus sul numscommesse
                //var fQuotaBonus;
                //if (oQuotaBonus != null) {
                //    fQuotaBonus = (parseFloat(oQuotaBonus.value));
                //} else {
                //    fQuotaBonus = 1;
                //}
                //Importo inserito dall'utente
                var fImporto = parseFloat(oTxtSistema.value.replace(",", "."));
                //Quota max del raggruppamento
                var fQuota = parseFloat(oQuotaComb.value);
                var fQuotaBonus = parseFloat(oQuotaComb.value) - parseFloat(oQuotaCombNoBonus.value);
                //Quota min del raggruppamento (combinazione piu bassa)
                var fQuotaMin = parseFloat(oQuotaBonusMin.value);
                var fQuotaBonusMin = parseFloat(oQuotaBonusMin.value) - parseFloat(oQuotaBonusMinNoBonus.value);
                //Calcolo importo minimo del bonus del raggr.
                var fImportoBonusMin = parseFloat(fQuotaBonusMin * fImporto);
                var fImportoBonusMax = parseFloat(fQuotaBonus * fImporto);
                //Calcolo vincita min e max del raggruppamento
                var fVincitaMin;
                var fVincitaMax
                if (bBookmkaerIT == true) {
                    fVincitaMin = tronca(parseFloat(fQuotaMin * fImporto));
                    fVincitaMax = tronca(parseFloat(fQuota * fImporto));
                } else {
                    fVincitaMin = parseFloat(fQuotaMin * fImporto);
                    fVincitaMax = parseFloat(fQuota * fImporto);
                }                 
                 
                //Importo cumulativo del bonus per il coupon
                if ((fQuotaBonus > 0) && (quotaMinimaBonusCoupon == 0)) {
                    importoMinBonus = fImportoBonusMin;
                    quotaMinimaBonusCoupon = fQuotaMin;
                } else {
                    if (quotaMinimaBonusCoupon > fQuotaMin) {
                        importoMinBonus = fImportoBonusMin;
                        quotaMinimaBonusCoupon = fQuotaMin;
                    }
                }

                //Importo cumulativo vincita min e max del coupon
                fVincitaPotCoupon += fVincitaMax;
                fImportoBonus += fImportoBonusMax;
                if (fVincitaMinCoupon == 0) {
                    fVincitaMinCoupon = fVincitaMin;
                } else {
                    if (fVincitaMinCoupon > fVincitaMin) {
                        fVincitaMinCoupon = fVincitaMin;
                    }
                }
                
                if (setImportoSis == 1) TotaleGiocata += parseFloat(oTxtSistemaTotale.innerHTML.replace(",", "."));

                if (fImporto == 0) {
                    oVincitaPotenzialeComb.innerHTML = '0';
                    oVincitaPotenzialeCombMin.innerHTML = '0';
                    oVincitaPotenzialeCombMax.innerHTML = '0';
                } else {
                    if (bBookmkaerIT != true) {
                        oVincitaPotenzialeComb.innerHTML = arrotonda(fVincitaMin).toString().replace(".", sepDec) + '&nbsp;/&nbsp;' + arrotonda(fVincitaMax).toString().replace(".", sepDec);
                        oVincitaPotenzialeCombMin.html(arrotonda(fVincitaMin).toString().replace(".", sepDec));
                        oVincitaPotenzialeCombMax.html(arrotonda(fVincitaMax).toString().replace(".", sepDec));
                    } else {
                        oVincitaPotenzialeComb.innerHTML = tronca(fVincitaMin).toString().replace(".", sepDec) + '&nbsp;/&nbsp;' + arrotonda(fVincitaMax).toString().replace(".", sepDec);
                        oVincitaPotenzialeCombMin.html(tronca(fVincitaMin).toString().replace(".", sepDec));
                        oVincitaPotenzialeCombMax.html(tronca(fVincitaMax).toString().replace(".", sepDec));
                    }
                }

            }
        }
    }
    if (oImportoBonusMin != null) oImportoBonusMin.innerHTML = arrotonda(importoMinBonus).toString().replace(".", sepDec);
    if (bBookmkaerIT != true) {
        if (fVincitaPotCoupon > 0) oVincitaPotenziale.innerHTML = arrotonda(fVincitaPotCoupon).toString().replace(".", sepDec);
        if (fVincitaMinCoupon > 0) oVincitaPotenzialeMin.innerHTML = arrotonda(fVincitaMinCoupon).toString().replace(".", sepDec);
    } else {
        if (fVincitaPotCoupon > 0) oVincitaPotenziale.innerHTML = tronca(fVincitaPotCoupon).toString().replace(".", sepDec);
        if (fVincitaMinCoupon > 0) oVincitaPotenzialeMin.innerHTML = tronca(fVincitaMinCoupon).toString().replace(".", sepDec);
    }
    if (oImportoBonus != null) oImportoBonus.innerHTML = arrotonda(fImportoBonus).toString().replace(".", sepDec);

    if (setImportoSis == 1) {
        oImportoSis.value = truncate(parseFloat(TotaleGiocata), nDec).replace(".", sepDec);
        
        //Se abilitata la funzione di cassa valuta devo convertire
        if (valCassa == 1) {
            if (IDValutaUtente == IDValutaSel) {
                $('#txtImportoSisValuta').val("");
            } else {
                //Trovo il valore del cambio (il valore della dropdown)
                var fCambio = getCambio();
                if (isNaN(fCambio)) return;

                //In base alla vlauta cambia il numero di decimali da usare per arrotondare
              

                var fImportoSisValuta = arrotonda((parseFloat(TotaleGiocata) * fCambio), nDec);

                $('#txtImportoSisValuta').val(fImportoSisValuta.toString().replace(".", sepDec));
            }
        }
    }
}

function truncate(numero, cifre) {
    return (Math.floor(numero / Math.pow(10, -cifre)) * Math.pow(10, -cifre)).toFixed(cifre);
}

//funzione chimata dalle coupon per controllare se espandere o mendo il dettaglio combinazine (solo se abilitato da UIConfig)
function mainCheckRaggr(){
    $(".TSChk").each(function () {
        if ($(this).children("INPUT").is(':checked')) {
            $(this).parent(".CpnTipoSisRiep").addClass("sel")
        }
    });
}

//funzione chimata dalle chkbox delle combinazioni
function checkRaggr(chk, evt, NumRaggr) {
    var oTxtSistema;
    oTxtSistema = document.getElementById("spanTxtSis" + NumRaggr);
    if (oTxtSistema == null) return

    oTxtSistema = oTxtSistema.childNodes[1];
    if (oTxtSistema == null) return

    if (chk.checked == false) oTxtSistema.value = "";
    DistribuisciImportoSistema(evt);

    if (chk.checked == false) {
        $(chk).parents(".CpnTipoSisRiep").removeClass("sel")
    } else {
        $(chk).parents(".CpnTipoSisRiep").addClass("sel")
    }
}

function SetCheckRaggr(NumRaggr) {
    var oChkSistema = document.getElementById("spanChkQuota" + NumRaggr);
    if (oChkSistema == null) return
    oChkSistema = oChkSistema.childNodes[0];
    if (oChkSistema == null) return

    if (oChkSistema.checked == false) {
        oChkSistema.checked = true
        $(oChkSistema).parents(".CpnTipoSisRiep").addClass("sel")
    } else {
        if (! ($(oChkSistema).parents(".CpnTipoSisRiep").hasClass("sel"))) {
            $(oChkSistema).parents(".CpnTipoSisRiep").addClass("sel")
        }
    }
}




function DistribuisciImportoSistema(evt) {
    
    if (getKeyPress(evt) == 9 || getKeyPress(evt) == 13) return
    var sDecimalSeparator = sepDec;
    var nDec = getNumeroDecimali();

    var oNumCom, oQuotaComb, oTxtSistema, oTxtImportoTot, oImportoGiocato, oChkSistema, oGiocaSuTutte
    var totComb, numRaggr, importoTot, importoGiocaSuTutte;

    oGiocaSuTutte = document.getElementById("txtGiocaSuTutte")
    oTxtImportoTot = document.getElementById("spanImportoSis").childNodes[1];

    if (oTxtImportoTot == null) return
    if ((oTxtImportoTot.value == "") && (oGiocaSuTutte.value == "")) return
    if (isNaN(parseFloat(oTxtImportoTot.value.replace(",", ".")))) return
    importoTot = parseFloat(oTxtImportoTot.value.replace(",", "."));


    if (importoTot > 0) {
        //Prima di tutto calcolo la somma del numero di combinazioni
        totComb = 0;
        numRaggr = 0;

        for (var i = 1; i <= maxNumRaggruppamenti; i++) {
            oTxtSistema = document.getElementById("spanTxtSis" + i);
            oChkSistema = document.getElementById("spanChkQuota" + i);

            if (oTxtSistema == null || oChkSistema == null) continue

            oTxtSistema = oTxtSistema.childNodes[1];
            oChkSistema = oChkSistema.childNodes[0];

            oNumCom = document.getElementById("spanLbl2Sistema" + i)

            if (oNumCom == null) continue
            if (oChkSistema.checked == false) continue

            oNumCom = oNumCom.childNodes[0];

            if (oNumCom.innerHTML != "") {
                totComb += parseFloat(oNumCom.innerHTML);
                numRaggr += 1;
            }
        }

        var importoRagg = 0;
        var countRagg = 1;
        var resto = importoTot;
        var importoComb = parseFloat(importoTot / totComb);

        //Trovo il valore del cambio (il valore della dropdown)
        var fCambio = getCambio();
        var IDValutaSel = $('#' + getIDDDLValuta()).val();



        for (var i = 1; i <= maxNumRaggruppamenti; i++) {


            oTxtSistema = document.getElementById("spanTxtSis" + i);
            oChkSistema = document.getElementById("spanChkQuota" + i);

            if (oTxtSistema == null || oChkSistema == null) continue

            oTxtSistema = oTxtSistema.childNodes[1];
            oChkSistema = oChkSistema.childNodes[0];

            oNumCom = document.getElementById("spanLbl2Sistema" + i);

            if (oNumCom == null) continue
            if (oChkSistema.checked == false) continue

            oNumCom = oNumCom.childNodes[0];

            oQuotaComb = document.getElementById("spanHidQuota" + i);
            if (oQuotaComb == null) continue
            oQuotaComb = oQuotaComb.childNodes[0];

   

            if (oNumCom.innerHTML != "") {
                //Imposto l'importo del raggruppamento (se sono nell'ultimo raggruppamento faccio la differenza)
                if (numRaggr == countRagg) {
                    if (nDec > 0) {
                        oTxtSistema.value = truncate((resto / parseInt(oNumCom.innerHTML)), 4);
                    } else {
                        oTxtSistema.value = parseInt(resto / parseInt(oNumCom.innerHTML));
                    }
                } else {
                    if (nDec > 0) {
                        oTxtSistema.value = truncate(importoComb, 4);
                    } else {
                        oTxtSistema.value = parseInt(importoComb);
                    }
                    importoRagg = importoComb * parseInt(oNumCom.innerHTML);
                    resto = resto - importoRagg;
                }
                
                //Se abilitata la funzione di cassa valuta devo convertire
                if (valCassa == 1) {
                    if (IDValutaUtente == IDValutaSel) {
                        $('#txtSisValuta' + i).val("");
                    } else {
                        //In base alla vlauta cambia il numero di decimali da usare per arrotondare
                        var fImportoValuta = arrotonda((parseFloat(oTxtSistema.value) * fCambio), nDec);

                        $("#txtSisValuta" + i).val(fImportoValuta.toString().replace(".", sepDec));
                    }
                }
                //Sostituisco l'eventuale separatore decimale
                if (sDecimalSeparator == ",") oTxtSistema.value = oTxtSistema.value.replace(".", sepDec);

                calcVpSistema(i, oNumCom.innerHTML, oQuotaComb.value, 0);

                countRagg += 1;
            } else {
                oTxtSistema.value = "";
            }
        }
    } else {

        if (oGiocaSuTutte.value != "") { CopyAmount(); }
    }

    $.event.trigger('CouponChanged');
}

function NewBet() {
    var objSpanCodPub = document.getElementById("spanCodPub");
    if (objSpanCodPub != null) {
        var objTxtCodPub = objSpanCodPub.childNodes[0];
        if (objTxtCodPub != null) objTxtCodPub.focus();
    }
}

function defaultPressed() {
    var objStato = $get(sHidStatoCoupon);
    if (objStato == null) return;

    //Stato Coupon Nuovo
    if (objStato.value == '0') return false;

    //CouponInCompilazione
    if (objStato.value == '10') {
        __doPostBack(slnkAvantiUniqueID, '')

        return false;
    }

    //CouponInConferma
    if (objStato.value == '20') {

        return false;
    }


    //CouponRegistrato
    if (objStato.value == '30') {

        return false;
    }

    //CouponRegistrato in riserva
    if (objStato.value == '40') {

        return false;
    }
}
function trapNextBet(e, btnNewBet) {
    //ottengo il codice del tasto
    if (e == null) var e = window.event;
    if (e.keyCode != null) code = e.keyCode;
    else if (e.which) code = e.which;

    //Se cliccato + del tastierino numerico (107) o il + della tastiera (187)
    //Imposto il fuoco sul cod.Pub.
    if ((code == 107) || (code == 187)) document.getElementById(btnNewBet).click();
}

function CopyAmount() {

    

    var sDecimalSeparator = sepDec;
    var oTxtAmount = document.getElementById("txtGiocaSuTutte");
    var amount = 0;
    if (oTxtAmount != null) {
        

        if (oTxtAmount.value != "") {
            amount = parseFloat(oTxtAmount.value.replace(",", "."));
            if (isNaN(amount)) {
                amount = 0;
            }
        } else {
            amount = 0;
        }

        if (sDecimalSeparator == ",") {
            oTxtAmount.value = oTxtAmount.value.replace(".", ",");
        } else {
            oTxtAmount.value = oTxtAmount.value.replace(",", ".");
        }
        var importoTot = 0;

        for (var i = 1; i <= maxNumRaggruppamenti; i++) {
            oTxtSistema = document.getElementById("spanTxtSis" + i);
            oChkSistema = document.getElementById("spanChkQuota" + i);

           

            if (oTxtSistema == null || oChkSistema == null) continue
            oTxtSistema = oTxtSistema.childNodes[1];
            oChkSistema = oChkSistema.childNodes[0];

            if (oTxtSistema == null || oChkSistema == null) continue



            oNumCom = document.getElementById("spanLbl2Sistema" + i);

            if (oNumCom == null) continue
            if (oChkSistema.checked == false) continue

            oNumCom = oNumCom.childNodes[0];
            if (oNumCom == null) continue

            oQuotaComb = document.getElementById("spanHidQuota" + i);
            if (oQuotaComb == null) continue
            oQuotaComb = oQuotaComb.childNodes[0];
            if (oQuotaComb == null) continue

            if (oNumCom.innerHTML != "") {
                oTxtSistema.value = amount;

                //Sostituisco l'eventuale separatore decimale
                oTxtSistema.value = oTxtSistema.value.replace(".", sepDec);

                calcVpSistema(i, oNumCom.innerHTML, oQuotaComb.value, 0);
            } else {
                oTxtSistema.value = "";
            }
        }
        calcolaTotaliSistema(sDecimalSeparator, 1);
    }
}

function ImportiTrapEnter(lnkAvantiClientID, evt) {
    var keyCode = null;

    if (evt.which) {
        keyCode = evt.which;
    } else if (evt.keyCode) {
        keyCode = evt.keyCode;
    }

    if (keyCode == 13) {
        evt.returnValue = false;
        evt.cancel = true;

        var btn = $get(lnkAvantiClientID);
        btn.click()
    }
}
function findUser() {
    var ddlUtenti = $get(sCboUtente);
    if (ddlUtenti == null) return;
    var txtUtente = $get(sTxtUtente);
    if (txtUtente == null) return;
    var strUidSelected = txtUtente.value;
    if (strUidSelected == "") {

        ddlUtenti.selectedIndex = 0;
        showSaldoUtente();
        return;
    }

    for (i = 0; i < ddlUtenti.length; i++) {
        var cboText = ddlUtenti.options[i].text;
        if (cboText.indexOf("-") > 0) {
            var strUid = ddlUtenti.options[i].text.split("-")[1];

            if (strUid.substring(0, strUidSelected.length).toLowerCase() == strUidSelected.toLowerCase()) {
                ddlUtenti.selectedIndex = i;
                showSaldoUtente();
                return;
            }
        }
    }

    ddlUtenti.selectedIndex = 0;
    showSaldoUtente();
}
function refreshStatoCoupon() {
    var objHid = document.getElementById(sHidAttesa);

    ISBets.WebPages.Controls.CouponWS.CheckAttesa(objHid.value, OnStatoCoupon);
}

function OnStatoCoupon(results) {
    if (results != null) {
        //var objHid = document.getElementById(sHidAttesa);

        if (results != 1) {
            var objBtnRefresh = document.getElementById(sBtnRefreshAttesa);
            objBtnRefresh.click();
        } else {
            CheckAttesa();
        }
    }
}

function refreshStatoCouponAsync() {
    var objHid = $('#' + sHidCouponAsincrono);
    ISBets.WebPages.Controls.CouponWS.GetStatoCouponAsincrono(objHid.val(), OnStatoCouponAsync);
}

function OnStatoCouponAsync(results) {
    if (results != null) {
        var objHid = $('#' + sHidCouponAsincrono);
        if (results != 99) {
            var objBtnRefresh = document.getElementById(sBtnRefreshAsincrono);
            objBtnRefresh.click();
        } else {
            CheckAsincrono(1);
        }
    }
}

function CheckAttesa() {
    var objHid = document.getElementById(sHidAttesa);
    var objdivAttesa = document.getElementById('divAttesa');
    var objdivCoupon = document.getElementById('divInserimentoScommesse');

    if (objHid.value != '0') {
        objdivAttesa.style.display = "block";
        objdivCoupon.style.display = "none";

        setTimeout('refreshStatoCoupon()', 2000);
    }
    else {
        objdivAttesa.style.display = "none";
        objdivCoupon.style.display = "block";
    }
}

function CheckAsincrono(enableSetTimeout) {
    var objHid = $('#' + sHidCouponAsincrono);

    var objdivAsync = $('#divCouponAsync');
    var objdivCoupon = $('#divInserimentoScommesse');

    

    if (objHid.val() != '0') {
        objdivAsync.show();
        objdivCoupon.hide();

        if (enableSetTimeout == 1) { setTimeout('refreshStatoCouponAsync()', 3000); } else { refreshStatoCouponAsync(); checkScoRiserva(); }

    } else {
        objdivAsync.hide();
        objdivCoupon.show();
       
    }

}

function selezionaQuote(forzaReload) {
    $.event.trigger('couponSelectOdds');
    
    selezionaQuoteLMSport();
    selezionaQuoteLMultiSport();
    selezionaQuotePG();
    selezionaQuoteMMSport();
    selezionaQuotePG1X2();
    selezionaQuoteStatsSco();
    //selezionaQuoteLessThan();
    
    //Per verificare che sia nella pagina Odds.aspx verifico la presenza della hidden OddsASPX
    if (document.getElementById('OddsASPX') == null) return;  
   
    //Verifico se il popup del dettaglio è visibile
    try {
        if (popupStatusDett == 1) {
            window.top.frames["iframeDett"].selezionaQuoteDettaglio()
        }
    } catch (e) { }

    var objModificatoQuote = $get(sHidModificatoQuote);
    if (objModificatoQuote.value != "1" && forzaReload == "1") return;

    //Hidden contenente gli IDQuota separati da pipe |
    var objHidQuote = document.getElementById(sHidIDQuote);
    if (objHidQuote == null) return;
    var quote = objHidQuote.value.split("|");
        
    //Azzero tutte le combo
    // $("select[class*=dropdownQuote]").each(function(i) {
    //     $(this).val("-1");
    // });

    //Resetto tutte le td quote quelli selezionate
    $("td[class*=OddGB_]").removeClass("QuotaSel");
    $(".divOdds .SEs .item .odd[id*=td_]").removeClass("QuotaSel");

    //Resetto tutte le combo
    $("div[class*='divCmb']").removeClass("Sel");
    $("div[class*='divCmb']").html(sCmbSpecials)

    for (var i = 0; i < quote.length; i++) {
        var IDQuota = quote[i].split("&")[0];
        var IDSottoEvento = quote[i].split("&")[1];
        
        var objTd = $("#td_" + IDQuota);

        if (objTd.html() != null) {
            objTd.addClass("QuotaSel");
        } else { 
           
            var objHidInfoQuota = $("#DIQ_" + IDQuota)
            if (objHidInfoQuota.html() != null) {
                var valoriQuota = objHidInfoQuota.html().split("|");
                if (valoriQuota.length == 4) {
                    var strHNDsel = ""
                    if (valoriQuota[3] != 0) { strHNDsel = "&nbsp;" + valoriQuota[3] }

                    //$("div[class*='divCmb'][onclick*='" + IDSottoEvento + "']").html(valoriQuota[0] + strHNDsel + "<span>" + valoriQuota[1] + "&nbsp;" + valoriQuota[2] + "</span>");
                    $("div[class*='divCmb'][onclick*='" + IDSottoEvento + "']").addClass("Sel");
                    
                }
            }
        }

    }

    objModificatoQuote.value = "0";

}

function selezionaQuoteDettaglio() {
    var objHidQuote = document.getElementById(sHidIDQuote);
    if (objHidQuote == null) return;
    var quote = objHidQuote.value.split("|");
    $('#divDett .SEOdd').removeClass("sel");

    for (var i = 0; i < quote.length; i++) {
        var IDQuota = quote[i].split("&")[0];
        if (IDQuota != '') {  $('#divDett #div_' + IDQuota).addClass("sel");}
    }

   
}

//seleziona le quote nel LastMinute
function selezionaQuoteLMSport() {
    if ($('#NESportCnt').length == 0) return;

    //Hidden contenente gli IDQuota separati da pipe |
    var objHidQuote = document.getElementById(sHidIDQuote);
    if (objHidQuote == null) return;
    var quote = objHidQuote.value.split("|");
    
    $('a[idLM]').parent().removeClass("sel");

    for (var i = 0; i < quote.length; i++) {
        var IDQuota = quote[i].split("&")[0];
        var IDSottoEvento = quote[i].split("&")[1];
 
        //Per LastMinutes
        $('a[idLM=' + IDQuota + ']').parent().addClass("sel")
    }
}

function selezionaQuoteLMultiSport() {
    if ($('.LiveBettingSportMain').length == 0) return;

    //Hidden contenente gli IDQuota separati da pipe |
    var objHidQuote = document.getElementById(sHidIDQuote);
    if (objHidQuote == null) return;
    var quote = objHidQuote.value.split("|");

    $('a[idLMulti]').removeClass("sel");

    for (var i = 0; i < quote.length; i++) {
        var IDQuota = quote[i].split("&")[0];
        var IDSottoEvento = quote[i].split("&")[1];

        //Per LastMinutes
        $('a[idLMulti=' + IDQuota + ']').addClass("sel")
    }
}


//seleziona le quote nelle PiuGiocate
function selezionaQuotePG() {
    if ($('#PGContent').length == 0) return;

    //Hidden contenente gli IDQuota separati da pipe |
    var objHidQuote = document.getElementById(sHidIDQuote);
    if (objHidQuote == null) return;
    var quote = objHidQuote.value.split("|");

    $('a[idPG]').parent().removeClass("sel");

    for (var i = 0; i < quote.length; i++) {
        var IDQuota = quote[i].split("&")[0];
        var IDSottoEvento = quote[i].split("&")[1];

        //Per LastMinutes
        $('a[idPG=' + IDQuota + ']').parent().addClass("sel")
    }
}

//seleziona le quote nei MarketMovers
function selezionaQuoteMMSport() {
    if ($('#MMCarousel').length == 0) return;

    //Hidden contenente gli IDQuota separati da pipe |
    var objHidQuote = document.getElementById(sHidIDQuote);
    if (objHidQuote == null) return;
    var quote = objHidQuote.value.split("|");

    $('a[idMM]').parent().removeClass("sel");

    for (var i = 0; i < quote.length; i++) {
        var IDQuota = quote[i].split("&")[0];
        var IDSottoEvento = quote[i].split("&")[1];

        //Per LastMinutes
        $('a[idMM=' + IDQuota + ']').parent().addClass("sel")
    }
}

function selezionaQuoteStatsSco() {
    if ($('#statsScoMain').length == 0) return;
    //Hidden contenente gli IDQuota separati da pipe |
    var objHidQuote = document.getElementById(sHidIDQuote);
    if (objHidQuote == null) return;
    var quote = objHidQuote.value.split("|");

    $('div[idSS]').removeClass("sel");

    for (var i = 0; i < quote.length; i++) {
        var IDQuota = quote[i].split("&")[0];
        var IDSottoEvento = quote[i].split("&")[1];

        //Per LastMinutes
        $('div[idSS=' + IDQuota + ']').addClass("sel")
    }
}


function selezionaQuotePG1X2() {
    if ($('#PGContent1X2').length == 0) return;

    //Hidden contenente gli IDQuota separati da pipe |
    var objHidQuote = document.getElementById(sHidIDQuote);
    if (objHidQuote == null) return;
    var quote = objHidQuote.value.split("|");

    $('a[idPG1X2]').parent().removeClass("sel");

    for (var i = 0; i < quote.length; i++) {
        var IDQuota = quote[i].split("&")[0];
        var IDSottoEvento = quote[i].split("&")[1];

        //Per LastMinutes
        $('a[idPG1X2=' + IDQuota + ']').parent().addClass("sel")
    }
}

function setFocus() {
    var objHidStato = document.getElementById(sHidStatoCoupon);
    if (objHidStato == null) return;

    if (objHidStato.value == "20") {
        //Coupon in conferma
        var objLnkBtn = document.getElementById(sLnkConferma);
        if (objLnkBtn != null) objLnkBtn.focus();
    }

    if ((objHidStato.value == "30")) {
        var objBtnScoAncora = document.getElementById(sBtnScoAncora);
        if (objBtnScoAncora != null) objBtnScoAncora.focus();
    }
}

function selectedUser(source, eventArgs) {
    var ddlUtenti = $get(sCboUtente);
    if (ddlUtenti == null) return;
    var txtUtente = document.getElementById(sTxtUtente);
    if (txtUtente == null) return;
    var txtUidSelected = txtUtente.value;

    for (i = 0; i < ddlUtenti.length; i++) {
        var strUid = ddlUtenti.options[i].text.split("-")[0];
        if (strUid == txtUidSelected) {
            ddlUtenti.selectedIndex = i;
            return;
        }
    }
}
function SetFocusImporto() {
    // In base al tipo di coupon trovo su quale textbox impostare il fuoco
    var hidTipoCoupon = $get(sHidTipoCoupon);
    if (hidTipoCoupon == null) return false;

    var objTxtImporto;
    if (hidTipoCoupon.value == 1) objTxtImporto = $get(sTxtImporto);       //Singola
    if (hidTipoCoupon.value == 2) objTxtImporto = $get(sTxtImportoDI);       //DI
    if (hidTipoCoupon.value == 3) objTxtImporto = $get(sTxtImportoSis);       //Sistemi
    if (hidTipoCoupon.value == 4) objTxtImporto = $get(sTxtImporto);       //Multipla
    if (objTxtImporto == null) return false;

    objTxtImporto.focus();

    return true;
}
function RicaricaTrapEnter() {
    //Verifico se è stato cliccato invio
    if (document.all) {
        if (event.keyCode == 13) {
            event.returnValue = false;
            event.cancel = true;

            SetFocusImporto();

            return;
        }
    }
}

function UserTrapEnter(evt) {
    //Verifico se è stato cliccato invio

    if (evt.keyCode == 13) {
        evt.returnValue = false;
        evt.cancel = true;

        SetFocusImporto();

        return;
    }

    //Se viene premuto il piu del tastierino numerico oil piu normale vado su ricarica
    if ((evt.keyCode == 107) || (evt.keyCode == 187)) {
        var objTxtRicarica = $get(sTxtRicarica);
        if (objTxtRicarica != null) objTxtRicarica.focus();

        var objTxtRicarica = $get(sChkRicarica);
        if (objTxtRicarica != null) objTxtRicarica.checked = true;

        evt.returnValue = false;
        evt.cancel = true;

        return;
    }
    //Se viene premuto il piu del tastierino numerico oil piu normale vado su ricarica
    if ((evt.keyCode == 109) || (evt.keyCode == 189)) {
        var objTxtRicarica = $get(sChkRicarica);
        if (objTxtRicarica != null) objTxtRicarica.checked = false;

        evt.returnValue = false;
        evt.cancel = true;

        return;
    }
}
/*Aggiunge in fondo il separatore solamente se non già presente*/
function addSep(valore) {
    if (valore.indexOf(sepDec) < 0)
        return valore + sepDec;
    else
        return valore;
}
function replaceSepTxt() {
    $('#divContentCoupon input').not($('#divContentCoupon #' + sTxtUtente)).not($('#divContentCoupon #' + sTxtCF)).keydown(function (e) {
        var key = e.charCode || e.keyCode || 0;

        // Enter BackSpace, Tab, Numeri e KeyPad
        if (key == 13 || key == 8 || key == 9 || (key >= 37 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105)) return true;
        //Alt, CTRL, SHIFT
        if ((key == 18) || (key == 17) || (key == 16)) return true;
        //Home End Canc
        if ((key == 36) || (key == 35) || (key == 46)) return true;

        //tasti funzione (per evitare di bloccare F5
        if (key > 111 && key < 124) return true;

        /* 110 punto numpad 188 virgola 190 punto normale */
        if (getNumeroDecimali()>0) {
            if ((key == 110) || (key == 188) || (key == 190)) { $(this).val(addSep($(this).val())); return false; };
        }
     
        return false;
    })
}

function CouponEndRequestHandler(sender, args) {
    replaceSepTxt();
    importoCassa();

    $.event.trigger('CouponChanged');

    if (args.get_error() == undefined) {

        CheckAttesa();
        //CheckAsincrono(0);

        //Verifica scommesse con riserva
        var objRiserva = document.getElementById(sHidRiserva);
        var objAsync = $('#' + sHidPrintAsincrono);

        if (objRiserva != null) {
            if (objRiserva.value == '1') {
                checkScoRiserva();
                objRiserva.value = '-1';
            }
            if (objRiserva.value == '0') {
              if (objAsync.val() != '1') { printCoupon(); }
            }
        }else{
           if (objAsync.val() != '1') { printCoupon(); }
        }

        setFocus();
    }
}

function showOnlySaldoUtente() {

    var objTxtSaldo = $get(sLblOnlySaldo);
    if (objTxtSaldo == null) return;
    var ddlUtenti = $get(sCboUtente);
    if (ddlUtenti == null) return;
    objTxtSaldo.innerHTML = "";
    if (ddlUtenti.selectedIndex == 0) return;

    //Chiamata al webservice che popola i dettagli del saldo
    ISBets.WebPages.Controls.CouponWS.GetSaldo(ddlUtenti.value, OnWSRequestOnlySaldoComplete);
}

//Viene chiamata al termine della chiamata asincrona al webservice che restituisce i dati
function OnWSRequestOnlySaldoComplete(results) {
    if (results != null) {
        var objTxtSaldo = $get(sLblOnlySaldo);
        if (objTxtSaldo == null) return;

        objTxtSaldo.innerHTML = results;
    }
}

function showSaldoUtente() {

    var objTxtSaldo = $get(sLblSaldo);
    if (objTxtSaldo == null) { showSaldoUtenteRicAuto(); return; }
    var ddlUtenti = $get(sCboUtente);
    if (ddlUtenti == null) return;
    objTxtSaldo.innerHTML = "";
    if (ddlUtenti.selectedIndex == 0) return;

    //Chiamata al webservice che popola i dettagli del saldo
    ISBets.WebPages.Controls.CouponWS.GetSaldo(ddlUtenti.value, OnWSRequestComplete);

    ISBets.WebPages.Controls.CouponWS.GetDisbilitazioneGiroconti(ddlUtenti.value, OnWSRequestGirocontiComplete);

    ISBets.WebPages.Controls.CouponWS.EnableTxtCF(ddlUtenti.value, OnWSRequestEnableCFComplete);

}

//Viene chiamata al termine della chiamata asincrona al webservice del coupon per vedere se va mostrata la txt del codice fiscale
function OnWSRequestEnableCFComplete(result) {
    var divCF = document.getElementById(sPnlCF);
    if (result == true) {
        $('#' + sPnlCF).show();

        var ddlUtenti = $get(sCboUtente);
        if (ddlUtenti == null) return;
        ISBets.WebPages.Controls.CouponWS.GetCF(ddlUtenti.value, OnWSRequestGetCFComplete);
    } else {
        $('#' + sPnlCF).hide();
    }
}

//Viene chiamata al termine della chiamata asincrona al webservice del coupon per precompilare il codice fiscale
function OnWSRequestGetCFComplete(result) {
    var objTxtCF = $get(sTxtCF);
    if (result != '') {
        objTxtCF.value = result;
        objTxtCF.disabled = true;
    } else {
        objTxtCF.value = '';
        objTxtCF.disabled = false;
    }
}
        
//Viene chiamata al termine della chiamata asincrona al webservice che restituisce i dati
function OnWSRequestComplete(results) {
    if (results != null) {
        var objTxtSaldo = $get(sLblSaldo);
        if (objTxtSaldo == null) return;

        objTxtSaldo.innerHTML = results;
    }
}

//Viene chiamata al termine della chiamata asincrona al webservice che restituisce l'abilitazione
function OnWSRequestGirocontiComplete(results) {

    if (results == '1') {
        var objTxtRicarica = document.getElementById(sTxtRicarica);
        if (objTxtRicarica) objTxtRicarica.value ='0';
        document.getElementById(sDivRicMan).style.visibility = 'hidden';
    } else {
        document.getElementById(sDivRicMan).style.visibility = 'visible';
    }
}

function showSaldoUtenteRicAuto() {

    var objTxtSaldo = $get(sLblRicAutoSaldo);
    if (objTxtSaldo == null) return;
    var ddlUtenti = $get(sCboUtente);
    if (ddlUtenti == null) return;
    objTxtSaldo.innerHTML = "";
    if (ddlUtenti.selectedIndex == 0) return;

    //Chiamata al webservice che popola i dettagli del saldo
    ISBets.WebPages.Controls.CouponWS.GetSaldo(ddlUtenti.value, OnWSRicAutoRequestComplete);

    ISBets.WebPages.Controls.CouponWS.GetDisbilitazioneGiroconti(ddlUtenti.value, OnWSRicAutoRequestGirocontiComplete);

    ISBets.WebPages.Controls.CouponWS.EnableTxtCF(ddlUtenti.value, OnWSRequestEnableCFComplete);

}

//Viene chiamata al termine della chiamata asincrona al webservice che restituisce l'abilitazione
function OnWSRicAutoRequestGirocontiComplete(results) {

    if (results == '1') {
        var objChkRicarica = $get(sChkRicarica);
        if (objChkRicarica != null) objChkRicarica.checked = false;
        document.getElementById(sDivRicAuto).style.visibility = 'hidden';
    } else {
        document.getElementById(sDivRicAuto).style.visibility = 'visible';
    }
}

//Viene chiamata al termine della chiamata asincrona al webservice che restituisce i dati
function OnWSRicAutoRequestComplete(results) {
    if (results != null) {
    var objTxtSaldo = $get(sLblRicAutoSaldo);
    if (objTxtSaldo == null) return;

        objTxtSaldo.innerHTML = results;
    }
}

function selRaggr(evt) {
    var sDecimalSeparator = sepDec;
    $("#divSis").find("input:checkbox").not(':disabled').each(function () {
        this.checked = !this.checked;
        if (this.checked == true) {
            CopyAmount();
            $(this).parents(".CpnTipoSisRiep").addClass("sel");
        } else {
            $(this).parents(".CpnTipoSisRiep").removeClass("sel");
        }
    });
}

//ABILITA IL DRAG DEL COUPON
function SetCpnDraggable() {
    $("#divCoupon").draggable({ axis: 'x' });
    //imposto la funzione di salvataggio nel cookie della posizione quando termino il drag
    $('#divCoupon').bind('dragstop', function(event, ui) {
        $.cookie('LeftPositionCookie', $("#divCoupon").css('left'), { path: '/' });
    });
    //leggo i valori salvati nel cookie per posizione e apertura
    var oldLeftPosition = $.cookie('LeftPositionCookie');
    var oldHeight = $.cookie('LeftExpandedCookie');
    //se ho valori nei cookie imposto il coupon
    if (oldLeftPosition != null) {
        $("#divCoupon").css('left', oldLeftPosition);
    }
    if (oldHeight != null) {
        if (oldHeight != '1px') {
            $('#divContentCoupon').slideToggle();
        }
    }
}

function ItemVisualizzabili(numEventi) {
    var hItem = $('#divCoupon #listticker .divScomm:first').height();   //altezza singolo Item
    var hCoupon = $('#divCoupon').height();                                   //altezza coupon
    var hItems = $('#listticker').height();                                          //altezza di tutti gli Items
    var hWindow = $(window).height();                                          //altezza finestra
    var SpazioVuoto = hWindow - $('#divCoupon').height();               //altezza spazio libero

    numItemOrig = numEventi;

    if (hCoupon > hWindow) {
        var diffH = hCoupon - hWindow;
        var numItemEccesso = Math.floor(diffH / hItem);
        if (numItemEccesso >= 0) {
            var hCouponInserimento = hCoupon - hItems;
            numItemVis = Math.floor((hWindow - hCouponInserimento) / hItem)
            if (numItemVis > 1) { numItemVis = numItemVis - 1 }
        }
    } else { numItemVis = numEventi + 1 }
}

//RICALCOLA ITEM VISUALIZZABILI IN RESIZE (chiamata due volte in IE...)
function SetCpnScrollableRes() {
    if (varResize == 0) { varResize = 1; }
    else {
        var hCoupon = $('#divCoupon').height();
        var hWindow = $(window).height();
        if (hCoupon > hWindow) { SetCpnScrollable(numItemOrig + 1); }
        varResize = 0;
    }
}
//ESPANDE CONTRAE COUPON
function OpenCloseCpn() {
    $('#divContentCoupon').slideToggle();
    var hContentCoupon = $("#divContentCoupon").css('height')
    //salvo nel cookie l'altezza per sapere se il coupon era aperto o chiuso
    $.cookie('LeftExpandedCookie', hContentCoupon, { path: '/' });
    if (hContentCoupon != '1px') {
        $('#' + sImgBtmOpwnClose).attr("src", sImgOpen);
    } else {
        $('#' + sImgBtmOpwnClose).attr("src", sImgClose);
    }
}

//INIZIALIZZA IL COUPON QUANDO E' BLOCCATO
function setCpnBlocked() {
    divCouponTopPosition = 0;
    $('#divCoupon').css('position', 'relative');
    $('#divCoupon').css('padding-bottom', '0');
    $('#divCoupon').css('top', divCouponTopPosition);
}

//BLOCCA O SBLOCCA IL COUPON QUANDO SCROLLA CON LA PAGINA
function BloccaSbloccaCoupon() {
    var lnkID = '#' + sLnkBlocca;

    if (divCouponTopPosition != 0) {
        divCouponTopPosition = 0;
        $('#divCoupon').css('position', 'relative');
        $('#divCoupon').css('padding-bottom', '0');
        $('#divCoupon').css('top', divCouponTopPosition);
        $(lnkID).addClass('lnkBlocca');
        $(lnkID).removeClass('lnkSblocca');
        $(lnkID).attr('title', sTooltipSblocca);
        $.cookie('BlockedCookie', '1', { path: '/' });
    } else {
        divCouponTopPosition = divCouponOldTopPosition;
        $('#divCoupon').css('position', 'absolute');
        //$('#divCoupon').css('padding-bottom', heightFooter + 'px');
        $(lnkID).addClass('lnkSblocca');
        $(lnkID).removeClass('lnkBlocca');
        $(lnkID).attr('title', sTooltipBlocca);
        $.cookie('BlockedCookie', '0', { path: '/' });
        checkLocation();
    }
}

function printCoupon(idCoupon, force) {
    var objHid = document.getElementById('hidConferma');

    if (objHid != null) {
        var lnkPrint = ''
        //console.log(objHid.value)
        //console.log(force)

        if (typeof (idCoupon) != 'undefined') {
            lnkPrint = sUrlPrintCoupon + idCoupon
        } else {
            lnkPrint = sUrlPrintCoupon + $('#' + sHidIDCoupon).val()
        }

        if (objHid.value == '1' || typeof (force) != 'undefined') {

            if (window.external && 'StampaCoupon' in window.external) {
                window.external.StampaCoupon(lnkPrint);
            } else {
                showPopUpCentered(lnkPrint, 300, 350);
            }

            NewBet();

            // Imposto il valore a -1 perchè altrimenti ad ogni postback mi rilancia la stampa
            objHid.value = -1;
        }

    } 

}

/****************************************************************************************************/
/** ***Funzioni usate nel sistema valuta cassa ***/
/****************************************************************************************************/
function objValuta(IDValuta, Simbolo, CodiceHTML, Cambio, NumeroDecimali) {
    this.IDValuta = IDValuta;
    this.Simbolo = Simbolo;
    this.CodiceHTML = CodiceHTML;
    this.Cambio = Cambio;
    this.NumeroDecimali = NumeroDecimali;
}
function getIDDDLValuta() {
    if (valCassa != 1) return;

    // In base al tipo di coupon trovo su quale textbox impostare la conversione
    var hidTipoCoupon = $get(sHidTipoCoupon);
    if (hidTipoCoupon == null) return false;

    switch (hidTipoCoupon.value) {
        case "1": //Singola
            return sDdlValuta;
            break;
        case "2": //DI
            return sDdlValutaDI;
            break;
        case "3": //Sistema
            return sDdlValutaSis;
            break;
        case "4": //Multipla
            return sDdlValuta;
            break;
    }
}
function getNumeroDecimali() {    
    if (valCassa != 1) return nDecCoupon;
    try {
        return listaValute[document.getElementById(getIDDDLValuta()).selectedIndex].NumeroDecimali;
    } catch (e) { return 2; }
}

function getCambio() {
    if (valCassa != 1) return 1;
    try {
        return listaValute[document.getElementById(getIDDDLValuta()).selectedIndex].Cambio;
    } catch (e) {return 1;}
}
function getSimboloValSel() {
    if (valCassa != 1) return "";
    try {
        return listaValute[document.getElementById(getIDDDLValuta()).selectedIndex].Simbolo;
    } catch (e) {return "";}
}
function getCodiceHTMLValSel() {
    if (valCassa != 1) return "";
    try {
        return listaValute[document.getElementById(getIDDDLValuta()).selectedIndex].CodiceHTML;
    } catch (e) { return "";}
}
function importoCassa() {
    if (valCassa != 1) return;
    // In base al tipo di coupon trovo su quale textbox impostare la conversione
    var hidTipoCoupon = $get(sHidTipoCoupon);
    if (hidTipoCoupon == null) return false;

    switch (hidTipoCoupon.value) {
        case "1": //Singola
            selValutaS();
            importoCassaSingola();
            break;
        case "2": //DI
            selValutaDI();
            importoCassaDI();
            break;
        case "3": //Sistema
            selValutaSis();
            break;
        case "4": //Multipla
            selValutaS();
            importoCassaSingola();
            break;
    }
}
function importoCassaSingola() {
    if (valCassa != 1) return;
    if (!$("#" + sTxtImportoValuta).length) return;

    $('#' + sTxtImportoValuta).keyup(function(e) {
        //Verifico che l'importo inserito sia un numero e faccio eventuale strip di separatori
        var sImportoCassa = $(this).val().replace(",", ".");
        if (isNaN(parseFloat(sImportoCassa))) return;
        var fImportoCassa = parseFloat(sImportoCassa);

        //Trovo il valore del cambio (il valore della dropdown)
        var fCambio = getCambio();

        //Calcolo il controvalore nella valuta specificata
        var fValoreCassa = arrotonda(fImportoCassa / fCambio);

        //Imposto textbox importo
        $('#' + sTxtImporto).val(fValoreCassa.toString().replace(".", sepDec));

        //Eseguo refresh vincitaPot
        $('#' + sTxtImporto).keyup();

        return true;
    })
}
function importoCassaDI() {
    if (valCassa != 1) return;
    if (! $("#" + sTxtImportoCassaDI).length) return;
    
    $('#' + sTxtImportoCassaDI).keyup(function(e) {
        //Verifico che l'importo inserito sia un numero e faccio eventuale strip di separatori
        var sImportoCassa = $(this).val().replace(",", ".");
        if (isNaN(parseFloat(sImportoCassa))) return;
        var fImportoCassa = parseFloat(sImportoCassa);

        //Trovo il valore del cambio (il valore della dropdown)
        var fCambio = getCambio();

        //Calcolo il controvalore nella valuta specificata
        var fValoreCassa = arrotonda(fImportoCassa / fCambio);

        //Imposto textbox importo
        $('#' + sTxtImportoDI).val(fValoreCassa.toString().replace(".", sepDec));

        //Eseguo refresh vincitaPot
        $('#' + sTxtImportoDI).keyup();

        var fnumComb = parseFloat($("#" + sLblImportoDICombinazioni).html().replace(sepDec, '.'));

        var fImportoCassaTotale = arrotonda(sImportoCassa * fnumComb);
        $('#' + sTxtTotaleDIValuta).val(fImportoCassaTotale.toString().replace(".", sepDec));

        return true;
    })
    $('#' + sTxtTotaleDIValuta).keyup(function(e) {
        //Verifico che l'importo inserito sia un numero e faccio eventuale strip di separatori
        var sImportoCassa = $(this).val().replace(",", ".");
        if (isNaN(parseFloat(sImportoCassa))) return;
        var fImportoCassa = parseFloat(sImportoCassa);

        //Trovo il valore del cambio (il valore della dropdown)
        var fCambio = getCambio();

        //Calcolo il controvalore nella valuta specificata
        var fValoreCassa = arrotonda(fImportoCassa / fCambio);
        
        //Imposto textbox importo
        $('#' + sTxtTotaleDI).val(fValoreCassa.toString().replace(".", sepDec));

        //Eseguo refresh vincitaPot
        $('#' + sTxtTotaleDI).keyup();

        //Aggiorno la textbox del valore singolo in base al numero di combinazioni
        var fnumComb = parseFloat($("#" + sLblImportoDICombinazioni).html().replace(sepDec, '.'));

        var fImportoCassaTotale = arrotonda(sImportoCassa / fnumComb);
        $('#' + sTxtImportoCassaDI).val(fImportoCassaTotale.toString().replace(".", sepDec));

        return true;
    })
}
function selValutaSis() {
    if (valCassa != 1) return;
    if (!$("#txtGiocaSuTutte").length) return;
    
    var IDValutaSel = $('#' + getIDDDLValuta()).val();
    if (IDValutaUtente == IDValutaSel) {
        $("#divSis .TextBoxValuta").attr('disabled', true);
        $("#divSis .TextBox").attr('disabled', false);
        $("#txtGiocaSuTutteValuta").attr('disabled', true);
        $("#txtGiocaSuTutte").attr('disabled', false);
        $("#spanImportoSis .TextBoxValuta").attr('disabled', true);
        $("#spanImportoSis .TextBox").attr('disabled', false);
    } else {
        $("#divSis .TextBoxValuta").attr('disabled', false);
        $("#divSis .TextBox").attr('disabled', true);
        $("#txtGiocaSuTutteValuta").attr('disabled', false);
        $("#txtGiocaSuTutte").attr('disabled', true);
        $("#spanImportoSis .TextBoxValuta").attr('disabled', false);
        $("#spanImportoSis .TextBox").attr('disabled', true);

        //Trovo il valore del cambio (il valore della dropdown)
        var fCambio = getCambio();
        
        //In base alla vlauta cambia il numero di decimali da usare per arrotondare
        var nDec = getNumeroDecimali();

        //Valuta selezionata
        var IDValutaSel = $('#' + getIDDDLValuta()).val();
        
        /*Importo Totale coupon*/
        //Verifico che l'importo inserito sia un numero e faccio eventuale strip di separatori
        var sImportoCassa = $('#' + sTxtImportoSis).val().replace(",", ".");
        if (isNaN(parseFloat(sImportoCassa))) return;
        var fImportoCassa = parseFloat(sImportoCassa);

        //Calcolo il controvalore nella valuta specificata
        var fValoreCassa = arrotonda((fImportoCassa * fCambio), nDec);
        
        //Imposto il valore nella valuta desiderata
        $('#txtImportoSisValuta').val(fValoreCassa.toString().replace(".", sepDec));

        /*Singoli valori dei raggruppamenti*/        
        var txtSisValuta;
        for (var i = 1; i <= maxNumRaggruppamenti; i++) {
            if ($("#txtSisValuta" + i).length) {
                if (IDValutaUtente == IDValutaSel) {                   
                    $("txtSisValuta" + i).val("");
                } else {
                var oTxtSistemaTotale = document.getElementById("spanTxtSis" + i).childNodes[1];
                
                if ((oTxtSistemaTotale != null) && (isNaN($(oTxtSistemaTotale).val()))) {
                        var fImportoSis = parseFloat($(oTxtSistemaTotale).val().replace(",", "."));
                 
                        var fImportoSisValuta =  arrotonda((fImportoSis * fCambio), nDec);

                        $("#txtSisValuta" + i).val(fImportoSisValuta.toString().replace(".", sepDec));
                    }
                }
            } 
        }
    }
}
//Selezionata la valuta nel caso Singola
function selValutaS() {
    if (valCassa != 1) return;
    if (!$("#" + sTxtImportoValuta).length) return;
    
    var IDValutaSel = $('#' + getIDDDLValuta()).val();
    if (IDValutaUtente == IDValutaSel) {
        $('#' + sTxtImportoValuta).val("");
        $('#' + sTxtImportoValuta).attr('disabled', true);
        $('#' + sTxtImporto).attr('disabled', false);
    } else {
        $('#' + sTxtImportoValuta).attr('disabled', false);
        $('#' + sTxtImporto).attr('disabled', true);
    
        //Verifico che l'importo inserito sia un numero e faccio eventuale strip di separatori
        var sImportoCassa = $('#' + sTxtImporto).val().replace(",", ".");
        if (isNaN(parseFloat(sImportoCassa))) return;
        var fImportoCassa = parseFloat(sImportoCassa);
    
        //Trovo il valore del cambio (il valore della dropdown)
        var fCambio = getCambio();

        //Calcolo il controvalore nella valuta specificata
        var fValoreCassa = arrotonda(fImportoCassa * fCambio);

        //Imposto il valore nella valuta desiderata
        $('#' + sTxtImportoValuta).val(fValoreCassa.toString().replace(".", sepDec));

    }
}

//Selezionata la valuta nel caso Singola
function selValutaDI() {
    if (valCassa != 1) return;
    if (!$("#" + sTxtTotaleDIValuta).length) return;
    
    var IDValutaSel = $('#' + getIDDDLValuta()).val();
    if (IDValutaUtente == IDValutaSel) {
        $('#' + sTxtImportoCassaDI).val("");
        $('#' + sTxtTotaleDIValuta).val("");

        $('#' + sTxtImportoCassaDI).attr('disabled', true);
        $('#' + sTxtTotaleDIValuta).attr('disabled', true);
        $('#' + sTxtImportoDI).attr('disabled', false);
        $('#' + sTxtTotaleDI).attr('disabled', false);
    } else {
        $('#' + sTxtImportoCassaDI).attr('disabled', false);
        $('#' + sTxtTotaleDIValuta).attr('disabled', false);
        $('#' + sTxtImportoDI).attr('disabled', true);
        $('#' + sTxtTotaleDI).attr('disabled', true);

        //Trovo il valore del cambio (il valore della dropdown)
        var fCambio = getCambio();
        
        //Verifico che l'importo inserito sia un numero e faccio eventuale strip di separatori
        var sImportoCassa = $('#' + sTxtImportoDI).val().replace(",", ".");
        if (isNaN(parseFloat(sImportoCassa))) return;
        var fImportoCassa = parseFloat(sImportoCassa);

        //Calcolo il controvalore nella valuta specificata
        var fValoreCassa = arrotonda(fImportoCassa * fCambio);

        //Imposto il valore nella valuta desiderata
        $('#' + sTxtImportoCassaDI).val(fValoreCassa.toString().replace(".", sepDec));

        //Numero di combinazione della integrale
        var fnumComb = parseFloat($("#" + sLblImportoDICombinazioni).html().replace(sepDec, '.'));

        //Calcolo il controvalore nella valuta specificata
        var fValoreCassaTot = arrotonda(fValoreCassa * fnumComb);
        
        //Imposto il valore nella valuta desiderata
        $('#' + sTxtTotaleDIValuta).val(fValoreCassaTot.toString().replace(".", sepDec));
    }
}

/* Eseguito sul keyup della textbox "Gioca Su Tutte" in valuta*/
function giocaTutteValuta() {
    if (valCassa != 1) return;
    //Trovo il valore del cambio (il valore della dropdown)
    var fCambio = getCambio();

    //Verifico che l'importo inserito sia un numero e faccio eventuale strip di separatori
    var sImportoValuta = $('#txtGiocaSuTutteValuta').val().replace(",", ".");
    if (isNaN(parseFloat(sImportoValuta))) return;
    var fImportoValuta = parseFloat(sImportoValuta);

    var txtSisValuta;
    for (var i = 1; i <= maxNumRaggruppamenti; i++) {
        txtSisValuta  = document.getElementById("txtSisValuta" + i);
        if (txtSisValuta != null) {
            $(txtSisValuta).val(sImportoValuta.replace(".", sepDec));
            giocaRaggValuta(txtSisValuta);
        }
    }
}

/* funzione chiamata sul keyup della textbox del raggruppamento */
function giocaRaggValuta(e) {
    if (valCassa != 1) return;
    //Trovo il valore del cambio (il valore della dropdown)
    var fCambio = getCambio();

    var sImportoValuta = $(e).val().replace(",", ".");
    if (isNaN(parseFloat(sImportoValuta))) return;
    var fImportoValuta = parseFloat(sImportoValuta);

    //Calcolo il controvalore nella valuta specificata
    var fImporto = arrotonda((fImportoValuta / fCambio), 4);

    $(e).siblings(".TextBox").val(fImporto.toString().replace(".", sepDec));
    $(e).siblings(".TextBox").keyup();
}

function giocaSisValuta(e) {
    if (valCassa != 1) return;
    //Trovo il valore del cambio (il valore della dropdown)
    var fCambio = getCambio();

    var sImportoValuta = $(e).val().replace(",", ".");
    if (isNaN(parseFloat(sImportoValuta))) return;
    var fImportoValuta = parseFloat(sImportoValuta);

    //Calcolo il controvalore nella valuta specificata
    var fImporto = arrotonda(fImportoValuta / fCambio);

    $(e).siblings(".TextBox").val(fImporto.toString().replace(".", sepDec));
    $(e).siblings(".TextBox").keyup();
}


