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

/**
 * This class is only temporary till some backend will be developed.
 * */
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

        this.sitesPermissions = {
            'band': ['band-section', 'not-found', 'welcome-screen'],
            'fan': ['fan-section', 'not-found', 'welcome-screen'],
            'unauthorized': ['not-found', 'login-screen']
        };
    }

    _createClass(Account, [{
        key: 'register',
        value: function register(newUserName, role) {
            this.activeUserNames[newUserName] = role;
            this.login(newUserName);
        }
    }, {
        key: 'loginFromCookie',
        value: function loginFromCookie() {
            var userName = _Cookies2.default.getCookie('username');
            if (userName !== '') {
                if (this.login(userName) === AccountRoles.UNAUTHORIZED) {
                    window.location.hash = 'login-screen';
                } else {
                    window.location.hash = !window.location.hash ? 'welcome-screen' : window.location.hash;
                }
            } else {
                window.location.hash = 'login-screen';
            }
        }
    }, {
        key: 'loginAndShowPage',
        value: function loginAndShowPage(username) {
            var role = this.login(username);
            switch (role) {
                case AccountRoles.UNAUTHORIZED:
                    console.log('login - unauthorized');
                    break;
                case AccountRoles.WRONG_USERNAME:
                    alert('Wrong username!');
                    break;
                default:
                    window.location.hash = 'welcome-screen';
                    break;
            }
        }
    }, {
        key: 'isLoggedIn',
        value: function isLoggedIn() {
            return this.currentLogedUser.role !== AccountRoles.UNAUTHORIZED;
        }
    }, {
        key: 'login',
        value: function login(userName) {
            userName = userName.trim();
            console.log('Login for: ' + userName);
            var userRole = void 0;
            if (userName) {
                userRole = this.activeUserNames[userName];

                if (!userRole) {
                    userName = 'unauthorized';
                    userRole = AccountRoles.WRONG_USERNAME;
                }
            } else {
                userName = 'unauthorized';
                userRole = AccountRoles.UNAUTHORIZED;
            }
            this._setCurrentUSsr(userRole, userName);
            return userRole;
        }
    }, {
        key: 'proceedToRolePage',
        value: function proceedToRolePage() {
            this._showPage(this.currentLogedUser.role);
        }
    }, {
        key: 'logout',
        value: function logout() {
            this._setCurrentUSsr(AccountRoles.UNAUTHORIZED, '');
            window.location.hash = 'login-screen';
        }
    }, {
        key: 'canAccessTag',
        value: function canAccessTag(tag) {
            var role = this.currentLogedUser.role;
            var possibleSitesForRole = this.sitesPermissions[AccountRoles.ToString(role)];
            return possibleSitesForRole.includes(tag);
        }
    }, {
        key: '_setCurrentUSsr',
        value: function _setCurrentUSsr(userRole, userName) {
            this.currentLogedUser.role = userRole;
            this.currentLogedUser.username = userName;

            console.log('Current username: ' + userName);
            console.log('Current role: ' + userRole);
            if (userRole !== AccountRoles.WRONG_USERNAME && userRole !== AccountRoles.UNAUTHORIZED) {
                _Cookies2.default.setCookie('username', userName, 30);

                $("#username-fill-field").text('UserName:\t' + userName);
                $("#role-fill-field").text('Role:\t' + AccountRoles.ToString(userRole));
            } else if (userRole === AccountRoles.WRONG_USERNAME) {
                $('#username-input').val(' ').trigger('focus');
                _Cookies2.default.deleteCookie('username');
                alert('Wrong username!');
            } else {
                _Cookies2.default.deleteCookie('username');

                $("#username-fill-field").text('UserName:\t');
                $("#role-fill-field").text('Role:\t');
            }
        }
    }, {
        key: '_showPage',
        value: function _showPage(role) {
            switch (role) {
                case AccountRoles.BAND:
                    window.location.hash = 'band-section';
                    break;
                case AccountRoles.FAN:
                    window.location.hash = 'fan-section';
                    break;
                case AccountRoles.UNAUTHORIZED:
                    window.location.hash = 'welcome-screen';
                    break;
                case AccountRoles.WRONG_USERNAME:
                    alert('Wrong username!');
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
                    return "band";
                case AccountRoles.FAN:
                    return "fan";
                case AccountRoles.UNAUTHORIZED:
                    return 'unauthorized';
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
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HashChangeHandler = function () {
    function HashChangeHandler(account) {
        _classCallCheck(this, HashChangeHandler);

        this.account = account;
        this.currentSection = '';
        this.history = [];

        var hash = window.location.hash;
        if (hash) {
            this.onHashChange({
                'originalEvent': {
                    'newURL': window.location.href
                }
            });
        }
    }

    _createClass(HashChangeHandler, [{
        key: 'onHashChange',
        value: function onHashChange(event) {
            var newUrl = event.originalEvent.newURL;
            var newSection = newUrl.split('#')[1];

            if (!this.account.canAccessTag(newSection)) {
                if (newSection === 'login-screen' && this.account.isLoggedIn()) {
                    newSection = 'welcome-screen';
                } else {
                    newSection = newSection ? 'not-found' : 'welcome-screen';
                }
            }

            // $('section').removeClass('active');
            // let className = '.' + newSection;
            // $(className).addClass('active');
            this.changeSections(this.currentSection, newSection);
            this.currentSection = newSection;
            this.history.push(newSection);
        }
    }, {
        key: 'changeSections',
        value: function changeSections(current, next) {
            var currentClass = '.' + current;
            var nextClass = '.' + next;

            if (current !== '') {
                $(currentClass).removeClass('active');
            }
            $(nextClass).addClass('active');
        }
    }]);

    return HashChangeHandler;
}();

exports.default = HashChangeHandler;

},{}],4:[function(require,module,exports){
"use strict";

var _Account = require("./Account");

var _Account2 = _interopRequireDefault(_Account);

var _HashChangeHandler = require("./HashChangeHandler");

var _HashChangeHandler2 = _interopRequireDefault(_HashChangeHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener("DOMContentLoaded", function () {

    var account = new _Account2.default();
    account.loginFromCookie();

    $("#login-button").on('click', function (ev) {
        var input = $("#username-input");
        account.loginAndShowPage(input.val());
        input.val('');
    });

    $('#log-out').on('click', function (ev) {
        return account.logout();
    });

    $("#proceed-to-role-page-btn").on('click', function (ev) {
        account.proceedToRolePage();
    });

    document.addEventListener('keypress', function (ev) {
        if (ev.code === 'Enter') {
            var input = $("#username-input");
            account.loginAndShowPage(input.val());
            input.val('');
        }
    });

    var hashChangeHandler = new _HashChangeHandler2.default(account);
    $(window).on('hashchange', function (ev) {
        return hashChangeHandler.onHashChange(ev);
    });
});

},{"./Account":1,"./HashChangeHandler":3}]},{},[4]);
