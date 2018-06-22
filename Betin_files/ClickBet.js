    function pubCodeEnd(e)
    { 
        //ottengo il codice del tasto
        if ( e == null ) var e = window.event;
	    if (e.keyCode != null) code = e.keyCode;
	    else if (e.which) code = e.which;	       

	    if((code >= 49 && code <= 59) || code >= 96 && code <= 105) { //numeri || tastierino numerico
            if(document.getElementById("spanCodPub").childNodes[0].value.length>=4 ){
                document.getElementById("spanCodSegno").childNodes[0].focus();
            }
        }
   
    }

    function procediClick(AsyncQBButtonAddClientID, AsyncQBTextClientID){
        var ddSegno = document.getElementById("spanDDSegno").childNodes[0];
        var txCodPub = document.getElementById("spanCodPub").childNodes[0];
        var txCodSegno = document.getElementById("spanCodSegno").childNodes[0];

        if (txCodPub.value == ""){
            var oImporto = document.getElementById("spanImporto");
            if (oImporto != null){
                var txtImporto = oImporto.childNodes[0];
                if (txtImporto != null) txtImporto.focus();
            }
            return false;
        }else{
            AddCoupon(AsyncQBButtonAddClientID, AsyncQBTextClientID,ddSegno.options[ddSegno.selectedIndex].text+'|'+txCodPub.value+'|'+'0')
            txCodPub.value='';
            txCodPub.focus();
            txCodSegno.value='';
            ddSegno.selectedIndex=0;
            __defaultFired = false
        }
        return false;
    }   
    
    function changeDrop(){
        var ddSegno = document.getElementById("spanDDSegno").childNodes[0];
        var txCodSegno = document.getElementById("spanCodSegno").childNodes[0];

        for(x=0;x<ddSegno.length;x++){
            if(ddSegno.options[x].value.toLowerCase()  == txCodSegno.value.toLowerCase() ){
                ddSegno.selectedIndex=x;
                ddSegnoSelIndex = x;
                ddSegno.options[x].selected=true;  

                break;
            }
        }
    }
    
    function trapEnter(e, setFocusBtn){
        //ottengo il codice del tasto
        var e;
        var code;
        if ( e == null ) e = window.event;
	    if (e.keyCode != null) code = e.keyCode;
	    else if (e.which) code = e.which;

	    if(code == 13) { //Invio
            document.getElementById("btnProcedi").click();
            if (setFocusBtn == 1) document.getElementById("btnProcedi").focus();
            return false;
        }

        return true;        
    }