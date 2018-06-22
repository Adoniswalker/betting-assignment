(function (w) {

    var _private = {
        errorMessage: '',
        objDOM: { txtUsername: null, txtPassword: null, btnlogin: null },
        initialize: function () {
            $('body').bind('loginError', function (evt, data) {
                $(document).ready(function () {
                    if ((data != null) && (typeof data === 'object')) {
                        _private.objDOM.txtUsername = $("#" + data.uidFieldID);
                        _private.objDOM.txtPassword = $("#" + data.passFieldID);
                        _private.objDOM.btnlogin = $("#" + data.loginButtonID)[0];
                        _private.errorMessage = data.error;
                        _private.createLoginPanel();
                    };
                })
            });
            $('body').bind('loginWrongCodeError', function (evt, data) {
                $(document).ready(function () {
                    if ((data != null) && (typeof data === 'object')) {
                        _private.errorMessage = data.error;
                        _private.createCustomPanel();
                    };
                })
            });
        },
        createLoginPanel: function () {
            var bodyPanel = $("body");
            var errorLoginPanel = bodyPanel.children("#errorLogin");
            var username = errorLoginPanel.find("#invalidLoginUsername");
            var password = errorLoginPanel.find("#invalidLoginPassword");
            var buttonLogin = errorLoginPanel.find("#invalidLoginButton");
            var buttonClose = errorLoginPanel.find("#invalidLoginClose");
            var errorArea = errorLoginPanel.find("#invalidLoginErrorMessage");

            errorArea.html(_private.errorMessage);
            setTimeout(function () { errorArea.html(""); }, 300000);
               
            var keydownFunc = function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    _private.login();
                };
            };
            username.keydown(keydownFunc);
            password.keydown(keydownFunc);
            buttonClose.click(function () { errorLoginPanel.remove(); });
            buttonLogin.click(_private.login);
            errorLoginPanel.show();
        },
        createCustomPanel: function () {
            var bodyPanel = $("body");
            var errorLoginPanel = bodyPanel.children("#loginWrongCodeError");
            var buttonClose = errorLoginPanel.find("#wrongCodeClose");
            var errorArea = errorLoginPanel.find("#wrongCodeErrorMessage");
            errorArea.html(_private.errorMessage);

            var keydownFunc = function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                };
            };
            buttonClose.click(function () { errorLoginPanel.remove(); });
            errorLoginPanel.show();
        },
        login: function (user, pass) {
            var bodyPanel = $("body");
            var errorLoginPanel = bodyPanel.children("#errorLogin");
            var username = errorLoginPanel.find("#invalidLoginUsername");
            var password = errorLoginPanel.find("#invalidLoginPassword");
            var buttonLogin = errorLoginPanel.find("#invalidLoginButton");
            var user = username.val();
            var pass = password.val();
            if ((user != '') && (pass != '')) {
                _private.objDOM.txtUsername.val(user);
                _private.objDOM.txtPassword.val(pass);
                _private.objDOM.btnlogin.click();
            };                                  
        }
    };

    //Initialize class
    _private.initialize();

})(window)