(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AccountRoles = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cookies = require('./Cookies');

var _Cookies2 = _interopRequireDefault(_Cookies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Account = function () {
    function Account() {
        _classCallCheck(this, Account);

        //note that this is testing state
        this.activeUserNames = {
            'bandAcc1': AccountRoles.BAND,
            'bandAcc2': AccountRoles.BAND,
            'fan1': AccountRoles.FAN,
            'fan2': AccountRoles.FAN
        };

        this.currentLogedUser = {
            'role': AccountRoles.UNAUTHORIZED,
            'username': 'UNAUTHORIZED'
        };
    }

    _createClass(Account, [{
        key: 'logout',
        value: function logout() {
            _Cookies2.default.deleteCookie('username');
        }
    }, {
        key: 'loginFromCookie',
        value: function loginFromCookie() {
            var userName = _Cookies2.default.getCookie('username');
            if (userName !== '') {
                this.login(userName);
            }
        }
    }, {
        key: 'login',
        value: function login(userName) {
            console.log('Login for: ' + userName);
            var userRole = void 0;
            if (userName) {
                userRole = this.activeUserNames[userName];
                if (userRole) {
                    this.currentLogedUser.role = userRole;
                    this.currentLogedUser.username = userName;
                    _Cookies2.default.setCookie('username', userName, 30);

                    $("#username-fill-field").text('UserName:\t' + userName);
                    $("#role-fill-field").text('Role:\t' + AccountRoles.ToString(userRole));
                    $(".user-logged").removeClass('hidden');
                    $(".user-logged-out").addClass('hidden');
                } else {
                    userRole = AccountRoles.WRONG_USERNAME;
                }
            } else {
                userRole = AccountRoles.UNAUTHORIZED;
            }
        }
    }, {
        key: 'register',
        value: function register(newUserName, role) {
            this.activeUserNames[newUserName] = role;
            this.login(newUserName);
        }
    }, {
        key: 'proceedToRolePage',
        value: function proceedToRolePage() {
            this._showPage(this.currentLogedUser.role);
        }
    }, {
        key: '_showPage',
        value: function _showPage(role) {
            switch (role) {
                case AccountRoles.BAND:
                    $(".welcome-screen, .fan-section").addClass('hidden');
                    $(".band-section").removeClass('hidden');
                    window.location.hash = 'band-section';
                    break;
                case AccountRoles.FAN:
                    $(".welcome-screen, .band-section").addClass('hidden');
                    $(".fan-section").removeClass('hidden');
                    window.location.hash = 'fan-section';
                    break;
                case AccountRoles.UNAUTHORIZED:
                    $(".band-section, .fan-section").addClass('hidden');
                    $(".welcome-screen").removeClass('hidden');
                    window.location.hash = 'header';
                    break;
                case AccountRoles.WRONG_USERNAME:
                    break;
                default:
                    break;
            }
        }
    }]);

    return Account;
}();

exports.default = Account;

var AccountRoles = exports.AccountRoles = function () {
    function AccountRoles() {
        _classCallCheck(this, AccountRoles);
    }

    _createClass(AccountRoles, null, [{
        key: 'ToString',
        value: function ToString(role) {
            switch (role) {
                case AccountRoles.BAND:
                    return "Band administrator.";
                case AccountRoles.FAN:
                    return "Fan";
                default:
                    return "Wrong request.";
            }
        }
    }, {
        key: 'BAND',
        get: function get() {
            return 1;
        }
    }, {
        key: 'FAN',
        get: function get() {
            return 2;
        }
    }, {
        key: 'UNAUTHORIZED',
        get: function get() {
            return 3;
        }
    }, {
        key: 'WRONG_USERNAME',
        get: function get() {
            return 4;
        }
    }]);

    return AccountRoles;
}();

},{"./Cookies":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cookies = function () {
    function Cookies() {
        _classCallCheck(this, Cookies);
    }

    _createClass(Cookies, null, [{
        key: 'getCookie',
        value: function getCookie(cookieName) {
            var name = cookieName + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    }, {
        key: 'setCookie',
        value: function setCookie(cookieName, cookieValue, cookieExpiresDays) {
            var d = new Date();
            d.setTime(d.getTime() + cookieExpiresDays * 24 * 60 * 60 * 1000);
            var expires = "expires=" + d.toUTCString();
            document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
        }
    }, {
        key: 'deleteCookie',
        value: function deleteCookie(cookieName) {
            document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }]);

    return Cookies;
}();

exports.default = Cookies;

},{}],3:[function(require,module,exports){
"use strict";

var _Account = require("./Account");

var _Account2 = _interopRequireDefault(_Account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener("DOMContentLoaded", function () {
    var account = new _Account2.default();
    account.loginFromCookie();
    //todo load classes

    $("#login-button").on('click', function (ev) {
        account.login($("#username-input").val());
    });

    $("#proceed-to-role-page-btn").on('click', function (ev) {
        account.proceedToRolePage();
    });

    document.addEventListener('keypress', function (ev) {
        if (ev.code === 'Enter') {
            account.login($("#username-input").val());
        }
    });
});

},{"./Account":1}]},{},[3]);
