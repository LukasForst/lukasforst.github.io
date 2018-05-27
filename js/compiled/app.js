(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AccountRoles = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cookies = require("./Cookies");

var _Cookies2 = _interopRequireDefault(_Cookies);

var _ConcertsProvider = require("./ConcertsProvider");

var _ConcertsProvider2 = _interopRequireDefault(_ConcertsProvider);

var _BandProvider = require("./BandProvider");

var _BandProvider2 = _interopRequireDefault(_BandProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class is only temporary till some backend will be developed.
 * */
var Account = function () {
    function Account(dataApi) {
        var _this = this;

        _classCallCheck(this, Account);

        this._dataApi = dataApi;
        //note that this is testing state
        this.activeUserNames = {
            'poulicni': AccountRoles.BAND,
            'rackBites': AccountRoles.BAND,
            'fousy': AccountRoles.BAND,
            'fan1': AccountRoles.FAN,
            'fan2': AccountRoles.FAN
        };

        this._userToBandWirring = {
            'poulicni': 'Poulicni Lampa',
            'rackBites': 'Rack Bites',
            'fousy': 'Fousy'
        };

        this._hashToUsername = {};
        this._userNameToHash = {};
        Object.keys(this.activeUserNames).forEach(function (x) {
            var hash = generateHash(x);
            _this._hashToUsername[hash] = x;
            _this._userNameToHash[x] = hash;
        });

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
        key: "register",
        value: function register(newUserName, role) {
            this.activeUserNames[newUserName] = role;
            this.login(newUserName);
        }
    }, {
        key: "loginFromCookie",
        value: function loginFromCookie() {
            var userName = '';
            var userHash = _Cookies2.default.getCookie('userHash');
            if (userHash !== '') userName = this._hashToUsername[userHash];
            if (userName !== undefined && userName !== '') {

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
        key: "loginAndShowPage",
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
        key: "isLoggedIn",
        value: function isLoggedIn() {
            return this.currentLogedUser.role !== AccountRoles.UNAUTHORIZED;
        }
    }, {
        key: "login",
        value: function login(userName) {
            userName = userName.trim();
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
            this._setCurrentUser(userRole, userName);
            return userRole;
        }
    }, {
        key: "proceedToRolePage",
        value: function proceedToRolePage() {
            this._showPage(this.currentLogedUser.role);
        }
    }, {
        key: "logout",
        value: function logout() {
            this._setCurrentUser(AccountRoles.UNAUTHORIZED, '');
            window.location.hash = 'login-screen';
        }
    }, {
        key: "canAccessTag",
        value: function canAccessTag(tag) {
            if (tag === 'not-found' || tag === 'login-screen') return true;
            var role = this.currentLogedUser.role;
            var possibleSitesForRole = this.sitesPermissions[AccountRoles.ToString(role)];
            return possibleSitesForRole.includes(tag);
        }
    }, {
        key: "_setCurrentUser",
        value: function _setCurrentUser(userRole, userName) {
            this.currentLogedUser.role = userRole;
            this.currentLogedUser.username = userName;

            if (userRole !== AccountRoles.WRONG_USERNAME && userRole !== AccountRoles.UNAUTHORIZED) {
                _Cookies2.default.setCookie('userHash', this._userNameToHash[userName], 30);

                $("#username-fill-field").text('UserName:\t' + userName);
                $("#role-fill-field").text('Role:\t' + AccountRoles.ToString(userRole));

                if (userRole === AccountRoles.FAN) {
                    new _ConcertsProvider2.default(this._dataApi.concertsApi).displayConcertsForFan();
                } else if (userRole === AccountRoles.BAND) {
                    new _BandProvider2.default(this._dataApi).displayDataForBand(this._userToBandWirring[userName]);
                }
            } else if (userRole === AccountRoles.WRONG_USERNAME) {
                $('#username-input').val(' ').trigger('focus');
                _Cookies2.default.deleteCookie('userHash');
                alert('Wrong username!');
            } else {
                _Cookies2.default.deleteCookie('userHash');

                $("#username-fill-field").text('UserName:\t');
                $("#role-fill-field").text('Role:\t');
            }
        }
    }, {
        key: "_showPage",
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


function generateHash(string) {
    var hash = 0,
        i = void 0,
        chr = void 0;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

var AccountRoles = exports.AccountRoles = function () {
    function AccountRoles() {
        _classCallCheck(this, AccountRoles);
    }

    _createClass(AccountRoles, null, [{
        key: "ToString",
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
        key: "BAND",
        get: function get() {
            return 1;
        }
    }, {
        key: "FAN",
        get: function get() {
            return 2;
        }
    }, {
        key: "UNAUTHORIZED",
        get: function get() {
            return 3;
        }
    }, {
        key: "WRONG_USERNAME",
        get: function get() {
            return 4;
        }
    }]);

    return AccountRoles;
}();

},{"./BandProvider":2,"./ConcertsProvider":3,"./Cookies":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BandProvider = function () {
    function BandProvider(apiData) {
        _classCallCheck(this, BandProvider);

        this._apiData = apiData;
    }

    _createClass(BandProvider, [{
        key: 'displayDataForBand',
        value: function displayDataForBand(bandName) {
            $('#name-band-section-header').text(bandName);
        }
    }]);

    return BandProvider;
}();

exports.default = BandProvider;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConcertsProvider = function () {
    function ConcertsProvider(concertsApi) {
        _classCallCheck(this, ConcertsProvider);

        this._concertsApi = concertsApi;
        this._currentDisplayedConcert = undefined;
    }

    _createClass(ConcertsProvider, [{
        key: 'displayConcertsForFan',
        value: function displayConcertsForFan() {
            var _this = this;

            var listHolder = $("#concert-list");
            var concerts = this._concertsApi.allConcerts;
            concerts.sort(function (a, b) {
                return a.date - b.date;
            });

            concerts.forEach(function (x) {
                listHolder.append($('<li id=concert-list-' + x.id + ' class="list-group-item concert-li"></li>').text(x.date.toLocaleDateString(navigator.languages[0]) + ' - ' + x.place + ': ' + x.performingBand));

                $('#concert-list-' + x.id).on('click', function (event) {
                    _this._currentDisplayedConcert = x;
                    _this._createConcertsInModal(x);
                });
            });

            $('#close-and-save-modal-button').on('click', this._updateValuesAfterClose.bind(this));

            this._addSearchListener();
        }
    }, {
        key: '_updateValuesAfterClose',
        value: function _updateValuesAfterClose() {
            var _this2 = this;

            $('#real-song-dropzone').remove();
            var sorted = $('#song-dropzone-list');
            sorted.children().each(function (index, value) {
                var songId = parseInt(value.id.split('-')[3]);
                _this2._currentDisplayedConcert.playlist.addPointsForSong(songId, sorted.children().length - index);
            });

            $('#universal-modal').modal('hide');
            $('#close-and-save-modal-button').off('click', this._updateValuesAfterClose.bind(this));
            this._currentDisplayedConcert = undefined;
        }
    }, {
        key: '_createConcertsInModal',
        value: function _createConcertsInModal(concert) {
            $("#universal-modal-header").text(concert.performingBand);
            var modalBody = $("#universal-modal-body");
            modalBody.html('');

            var draggables = $('<div class="row"></div>');
            var dropables = $('<div class="row"></div>');
            dropables.append($('<ul id="song-dropzone-list" class="list-group list-group-flush mx-auto my-auto"></ul>'));
            modalBody.append($('<div class="container-fluid"></div>').append(dropables).append(draggables));
            this._createNextZoneToDrop();

            var dragableList = $('<ul id=\'songs-in-list\' class="list-group mx-auto my-auto"></ul>');
            concert.playlist.sortedPlaylist.forEach(function (value, index) {
                var element = $('<li id=\'song-group-item-' + value.id + '\' class=\'list-group-item\' draggable=\'true\'></li>');
                element.text(value.authorBandName + ' - ' + value.name);
                element.on('dragstart', function (event) {
                    return event.originalEvent.dataTransfer.setData("song", event.target.id);
                });
                dragableList.append(element);
            });

            draggables.append(dragableList);
            $("#universal-modal").modal("toggle");
        }
    }, {
        key: '_createNextZoneToDrop',
        value: function _createNextZoneToDrop() {
            var _this3 = this;

            var list = $('#song-dropzone-list');
            $('#real-song-dropzone').remove();
            var li = $('<li id=\'real-song-dropzone\' class="list-group-item mx-auto my-auto"></li>');
            li.text('Drop all sorted music here!');
            li.on('drop', function (e) {
                return _this3._drop(e.originalEvent);
            });
            li.on('dragover', function (e) {
                return e.preventDefault();
            });
            list.append(li);
        }
    }, {
        key: '_drop',
        value: function _drop(event) {
            event.preventDefault();
            var data = event.dataTransfer.getData("song");
            var list = $('#song-dropzone-list');
            list.append($('#' + data));

            var songsLins = $('#songs-in-list');
            if (songsLins.children().length !== 0) {
                this._createNextZoneToDrop();
            } else {
                $('#real-song-dropzone').remove();
            }
        }
    }, {
        key: '_addSearchListener',
        value: function _addSearchListener() {
            var callback = function callback(event) {
                var records = $(".concert-li");
                for (var i = 0; i < records.length; i++) {
                    if (records[i].innerText.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
                        records[i].style.display = "";
                    } else {
                        records[i].style.display = "none";
                    }
                }
            };

            var searchBar = $("#concerts-search-bar");
            searchBar.on('keydown', function (event) {
                return callback(event);
            });
        }
    }, {
        key: 'showConcertData',
        value: function showConcertData() {}
    }]);

    return ConcertsProvider;
}();

exports.default = ConcertsProvider;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
                } else if (newSection) {
                    newSection = 'not-found';
                } else {
                    newSection = 'login-screen';
                }
            }

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
            if (nextClass === '.login-screen') {
                $('#username-input').trigger('focus');
            }
        }
    }]);

    return HashChangeHandler;
}();

exports.default = HashChangeHandler;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BandsApi = require("./BandsApi");

var _BandsApi2 = _interopRequireDefault(_BandsApi);

var _ConcertsApi = require("./ConcertsApi");

var _ConcertsApi2 = _interopRequireDefault(_ConcertsApi);

var _PubsApi = require("./PubsApi");

var _PubsApi2 = _interopRequireDefault(_PubsApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiData = function ApiData() {
    _classCallCheck(this, ApiData);

    this.bandApi = new _BandsApi2.default();
    this.pubApi = new _PubsApi2.default();
    this.concertsApi = new _ConcertsApi2.default(this.pubApi, this.bandApi);
};

exports.default = ApiData;

},{"./BandsApi":8,"./ConcertsApi":10,"./PubsApi":13}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Band = function () {
    function Band(id, name, members) {
        _classCallCheck(this, Band);

        this.name = name;
        this.members = members;
        this.id = id;
    }

    _createClass(Band, [{
        key: "toString",
        value: function toString() {
            return this.name;
        }
    }]);

    return Band;
}();

exports.default = Band;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Band = require('./Band');

var _Band2 = _interopRequireDefault(_Band);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BandsApi = function () {
    function BandsApi() {
        _classCallCheck(this, BandsApi);

        this._mock = new BandsApiMock();
    }

    _createClass(BandsApi, [{
        key: 'addBand',
        value: function addBand(band) {
            this._mock.addBand(band);
        }
    }, {
        key: 'removeBand',
        value: function removeBand(bandId) {
            this._mock.removeBand(bandId);
        }
    }, {
        key: 'allBands',
        get: function get() {
            return this._mock.allBands;
        }
    }]);

    return BandsApi;
}();

exports.default = BandsApi;

var BandsApiMock = function () {
    function BandsApiMock() {
        _classCallCheck(this, BandsApiMock);

        this._bands = [];
        this._populate();
    }

    _createClass(BandsApiMock, [{
        key: '_populate',
        value: function _populate() {
            this.addBand(new _Band2.default(1, 'Fousy', ['Lukas', 'Matin', 'Karel', 'Filip']));
            this.addBand(new _Band2.default(2, 'Poulicni Lampa', ['Lukas', 'Morys', 'Humus', 'Karel']));
            this.addBand(new _Band2.default(3, 'Rack Bites', ['Vojta', 'Karel', 'Maty']));
        }
    }, {
        key: 'addBand',
        value: function addBand(band) {
            this._bands.push(band);
        }
    }, {
        key: 'removeBand',
        value: function removeBand(bandId) {
            this._bands = this._bands.filter(function (x) {
                return x.id !== bandId;
            });
        }
    }, {
        key: 'allBands',
        get: function get() {
            return this._bands;
        }
    }]);

    return BandsApiMock;
}();

},{"./Band":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Concert = function Concert(id, performingBand, date, place, playlist) {
    _classCallCheck(this, Concert);

    this.performingBand = performingBand;
    this.playlist = playlist;
    this.date = date;
    this.place = place;
    this.id = id;
};

exports.default = Concert;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Concert = require("./Concert");

var _Concert2 = _interopRequireDefault(_Concert);

var _Song = require("./Song");

var _Song2 = _interopRequireDefault(_Song);

var _Playlist = require("./Playlist");

var _Playlist2 = _interopRequireDefault(_Playlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConcertsApi = function () {
    function ConcertsApi(pubApi, bandApi) {
        _classCallCheck(this, ConcertsApi);

        this._mock = new ConcertsApiMock(pubApi, bandApi);
    }

    _createClass(ConcertsApi, [{
        key: "addConcert",
        value: function addConcert(concert) {
            this._mock.addConcert(concert);
        }
    }, {
        key: "getConcertsForBand",
        value: function getConcertsForBand(bandId) {
            return this._mock.getConcertsForBand(bandId);
        }
    }, {
        key: "allConcerts",
        get: function get() {
            return this._mock.allConcerts;
        }
    }]);

    return ConcertsApi;
}();

exports.default = ConcertsApi;

var ConcertsApiMock = function () {
    function ConcertsApiMock(pubApi, bandApi) {
        _classCallCheck(this, ConcertsApiMock);

        this._concerts = [];
        this._populate(pubApi.allPubs, bandApi.allBands);
    }

    _createClass(ConcertsApiMock, [{
        key: "_populate",
        value: function _populate(pubs, bands) {
            this.addConcert(new _Concert2.default(1, bands[getRandomInt(0, bands.length - 1)], new Date('May 18, 2018 20:00:00'), pubs[getRandomInt(0, pubs.length - 1)], generatePlayList(6)));

            this.addConcert(new _Concert2.default(2, bands[getRandomInt(0, bands.length - 1)], new Date('May 20, 2018 20:00:00'), pubs[getRandomInt(0, pubs.length - 1)], generatePlayList(6)));

            this.addConcert(new _Concert2.default(3, bands[getRandomInt(0, bands.length - 1)], new Date('May 21, 2018 20:00:00'), pubs[getRandomInt(0, pubs.length - 1)], generatePlayList(4)));

            this.addConcert(new _Concert2.default(4, bands[getRandomInt(0, bands.length - 1)], new Date('May 22, 2018 20:00:00'), pubs[getRandomInt(0, pubs.length - 1)], generatePlayList(8)));
        }
    }, {
        key: "addConcert",
        value: function addConcert(concert) {
            this._concerts.push(concert);
        }
    }, {
        key: "getConcertsForBand",
        value: function getConcertsForBand(bandId) {
            return this._concerts.filter(function (x) {
                return x.performingBand.id === bandId;
            });
        }
    }, {
        key: "allConcerts",
        get: function get() {
            return this._concerts;
        }
    }]);

    return ConcertsApiMock;
}();

function generatePlayList(songsCount) {
    var songs = [];

    var _loop = function _loop(i) {
        var song = generateSong();
        if (songs.filter(function (x) {
            return x.id === song.id;
        }).length === 0) {
            songs.push(song);
        }
    };

    for (var i = 0; i < songsCount; i++) {
        _loop(i);
    }
    return new _Playlist2.default(songs);
}

function generateSong() {
    var songs = [new _Song2.default(1, 'Stejne jako ja', 'Chinaski'), new _Song2.default(2, 'Spac', 'Chinaski'), new _Song2.default(3, 'Klidna jako voda', 'Jelen'), new _Song2.default(4, 'Jelen', 'Chinaski'), new _Song2.default(5, 'Malotraktorem', 'Mig21'), new _Song2.default(6, 'Vlci srdce', 'Jelen'), new _Song2.default(7, 'Magdalena', 'Jelen'), new _Song2.default(8, 'Sight not more', 'Mumford n sons'), new _Song2.default(9, 'Lokomotiva', 'Poletime'), new _Song2.default(10, 'Mezi horami', 'Cechomor')];
    return songs[getRandomInt(0, songs.length - 1)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

},{"./Concert":9,"./Playlist":11,"./Song":14}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Song = require("./Song");

var _Song2 = _interopRequireDefault(_Song);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Playlist = function () {
    function Playlist(firstSongs) {
        var _this = this;

        _classCallCheck(this, Playlist);

        this._playlist = [];
        firstSongs.forEach(function (x) {
            return _this._playlist.push(x);
        });
        this._playlist.sort(function (a, b) {
            return _Song2.default.comparator(a, b);
        });
    }

    _createClass(Playlist, [{
        key: "addSong",
        value: function addSong(song) {
            this._playlist.push(song);
        }
    }, {
        key: "addPointsForSong",
        value: function addPointsForSong(songId, pointsCount) {
            var songs = this._playlist.filter(function (x) {
                return x.id === songId;
            });
            if (songs.length > 0) {
                songs[0].addVotes(pointsCount);
            }
        }
    }, {
        key: "toString",
        value: function toString() {
            var playlist = this.sortedPlaylist;
            var str = "";
            playlist.forEach(function (x) {
                str += x.toString() + "\n";
            });
            console.log(str);
            return str;
        }
    }, {
        key: "sortedPlaylist",
        get: function get() {
            this._playlist.sort(function (a, b) {
                return _Song2.default.comparator(a, b);
            });
            return this._playlist;
        }
    }]);

    return Playlist;
}();

exports.default = Playlist;

},{"./Song":14}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pub = function () {
    function Pub(id, place) {
        _classCallCheck(this, Pub);

        this.place = place;
        this.id = id;
    }

    _createClass(Pub, [{
        key: "toString",
        value: function toString() {
            return this.place;
        }
    }]);

    return Pub;
}();

exports.default = Pub;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Pub = require('./Pub');

var _Pub2 = _interopRequireDefault(_Pub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PubsApi = function () {
    function PubsApi() {
        _classCallCheck(this, PubsApi);

        this._mock = new PubApiMock();
    }

    _createClass(PubsApi, [{
        key: 'addPub',
        value: function addPub(pub) {
            this._mock.addPub(pub);
        }
    }, {
        key: 'allPubs',
        get: function get() {
            return this._mock.allPubs;
        }
    }]);

    return PubsApi;
}();

exports.default = PubsApi;

var PubApiMock = function () {
    function PubApiMock() {
        _classCallCheck(this, PubApiMock);

        this._pubs = [];
        this._populate();
    }

    _createClass(PubApiMock, [{
        key: '_populate',
        value: function _populate() {
            this.addPub(new _Pub2.default(1, 'Peters Pub'));
            this.addPub(new _Pub2.default(2, 'JazzRock Cafe'));
            this.addPub(new _Pub2.default(3, 'RockClub'));
            this.addPub(new _Pub2.default(4, 'MKS'));
        }
    }, {
        key: 'addPub',
        value: function addPub(pub) {
            this._pubs.push(pub);
        }
    }, {
        key: 'allPubs',
        get: function get() {
            return this._pubs;
        }
    }]);

    return PubApiMock;
}();

},{"./Pub":12}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Song = function () {
    function Song(id, name, authorBandName) {
        _classCallCheck(this, Song);

        this.id = id;
        this.name = name;
        this.authorBandName = authorBandName;
        this.currentVotesUp = 0;
    }

    _createClass(Song, [{
        key: 'upvote',
        value: function upvote() {
            this.currentVotesUp++;
        }
    }, {
        key: 'addVotes',
        value: function addVotes(times) {
            this.currentVotesUp += times;
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.authorBandName + ' - ' + this.name + ' [+' + this.currentVotesUp + ']';
        }
    }, {
        key: 'value',
        get: function get() {
            return this.currentVotesUp;
        }
    }], [{
        key: 'comparator',
        value: function comparator(song1, song2) {
            return song2.value - song1.value;
        }
    }]);

    return Song;
}();

exports.default = Song;

},{}],15:[function(require,module,exports){
"use strict";

var _Account = require("./Account");

var _Account2 = _interopRequireDefault(_Account);

var _HashChangeHandler = require("./HashChangeHandler");

var _HashChangeHandler2 = _interopRequireDefault(_HashChangeHandler);

var _ApiData = require("./api/ApiData");

var _ApiData2 = _interopRequireDefault(_ApiData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener("DOMContentLoaded", function () {
    var api = new _ApiData2.default();

    var account = new _Account2.default(api);
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

    $("#username-input").on('keyup', function (ev) {
        if (ev.originalEvent.code === 'Enter') {
            var input = $("#username-input");
            if (input !== '') {
                account.loginAndShowPage(input.val());
                input.val('');
            }
        }
    });

    var hashChangeHandler = new _HashChangeHandler2.default(account);
    $(window).on('hashchange', function (ev) {
        return hashChangeHandler.onHashChange(ev);
    });
});

},{"./Account":1,"./HashChangeHandler":5,"./api/ApiData":6}]},{},[15]);
