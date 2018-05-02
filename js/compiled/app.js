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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class is only temporary till some backend will be developed.
 * */
var Account = function () {
    function Account(dataApi) {
        _classCallCheck(this, Account);

        this._dayaApi = dataApi;
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
        key: "register",
        value: function register(newUserName, role) {
            this.activeUserNames[newUserName] = role;
            this.login(newUserName);
        }
    }, {
        key: "loginFromCookie",
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
        key: "proceedToRolePage",
        value: function proceedToRolePage() {
            this._showPage(this.currentLogedUser.role);
        }
    }, {
        key: "logout",
        value: function logout() {
            this._setCurrentUSsr(AccountRoles.UNAUTHORIZED, '');
            window.location.hash = 'login-screen';
        }
    }, {
        key: "canAccessTag",
        value: function canAccessTag(tag) {
            var role = this.currentLogedUser.role;
            var possibleSitesForRole = this.sitesPermissions[AccountRoles.ToString(role)];
            return possibleSitesForRole.includes(tag);
        }
    }, {
        key: "_setCurrentUSsr",
        value: function _setCurrentUSsr(userRole, userName) {
            this.currentLogedUser.role = userRole;
            this.currentLogedUser.username = userName;

            console.log('Current username: ' + userName);
            console.log('Current role: ' + userRole);
            if (userRole !== AccountRoles.WRONG_USERNAME && userRole !== AccountRoles.UNAUTHORIZED) {
                _Cookies2.default.setCookie('username', userName, 30);

                $("#username-fill-field").text('UserName:\t' + userName);
                $("#role-fill-field").text('Role:\t' + AccountRoles.ToString(userRole));

                new _ConcertsProvider2.default(this._dayaApi.concertsApi).displayConcertsForFan();
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

},{"./ConcertsProvider":2,"./Cookies":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConcertsProvider = function () {
    function ConcertsProvider(concertsApi) {
        _classCallCheck(this, ConcertsProvider);

        this._concertsApi = concertsApi;
    }

    _createClass(ConcertsProvider, [{
        key: "displayConcertsForFan",
        value: function displayConcertsForFan() {
            var listHolder = $("#concert-list");
            var concerts = this._concertsApi.allConcerts;
            concerts.sort(function (a, b) {
                return a.date - b.date;
            });

            concerts.forEach(function (x) {
                listHolder.append("<li id=concert-list-" + x.id + " class=\"list-group-item concert-li\">" + x.date.toLocaleDateString(navigator.languages[0]) + " - " + x.place + ": " + x.performingBand + "</li>");

                $("#concert-list-" + x.id).on('click', function (event) {
                    $("#universal-modal-header").html("<p>" + x.performingBand + "</p>");
                    var dataToDisply = "";
                    x.playlist.sortedPlaylist.forEach(function (x) {
                        dataToDisply += "<p><butto class=\"btn\">+</butto><button class=\"btn\">-</button> - " + x + "</p>";
                        $("");
                    });

                    $("#universal-modal-body").html(dataToDisply);

                    $("#universal-modal").modal("toggle");
                    console.log(event);
                });
            });
            this._addSearchListener();
        }
    }, {
        key: "_addSearchListener",
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
        key: "showConcertData",
        value: function showConcertData() {}
    }]);

    return ConcertsProvider;
}();

exports.default = ConcertsProvider;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./BandsApi":7,"./ConcertsApi":9,"./PubsApi":12}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./Band":6}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
    for (var i = 0; i < songsCount; i++) {
        songs.push(generateSong());
    }
    return new _Playlist2.default(songs);
}

function generateSong() {
    var songs = [new _Song2.default('Stejne jako ja', 'Chinaski'), new _Song2.default('Spac', 'Chinaski'), new _Song2.default('Klidna jako voda', 'Jelen'), new _Song2.default('Jelen', 'Chinaski'), new _Song2.default('Malotraktorem', 'Mig21'), new _Song2.default('Vlci srdce', 'Jelen'), new _Song2.default('Magdalena', 'Jelen'), new _Song2.default('Sight not more', 'Mumford n sons'), new _Song2.default('Lokomotiva', 'Poletime'), new _Song2.default('Mezi horami', 'Cechomor')];
    return songs[getRandomInt(0, songs.length - 1)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

},{"./Concert":8,"./Playlist":10,"./Song":13}],10:[function(require,module,exports){
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

},{"./Song":13}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./Pub":11}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Song = function () {
    function Song(name, authorBandName) {
        _classCallCheck(this, Song);

        this.name = name;
        this.authorBandName = authorBandName;
        this.currentVotesUp = 0;
        this.currentVotesDown = 0;
    }

    _createClass(Song, [{
        key: 'upvote',
        value: function upvote() {
            this.currentVotesUp++;
        }
    }, {
        key: 'downvote',
        value: function downvote() {
            this.currentVotesDown++;
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.authorBandName + ' - ' + this.name + ' [+' + this.currentVotesUp + ', -' + this.currentVotesDown + ']';
        }
    }, {
        key: 'value',
        get: function get() {
            return this.currentVotesUp - this.currentVotesDown;
        }
    }], [{
        key: 'comparator',
        value: function comparator(song1, song2) {
            return song1.value - song2.value;
        }
    }]);

    return Song;
}();

exports.default = Song;

},{}],14:[function(require,module,exports){
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

    // document.addEventListener('keypress', (ev) => {
    //     if (ev.code === 'Enter') {
    //         let input =$("#username-input");
    //         account.loginAndShowPage(input.val());
    //         input.val('');
    //     }
    // });

    var hashChangeHandler = new _HashChangeHandler2.default(account);
    $(window).on('hashchange', function (ev) {
        return hashChangeHandler.onHashChange(ev);
    });

    console.log(api.bandApi.allBands);
    console.log(api.pubApi.allPubs);

    console.log(api.concertsApi.allConcerts);
});

},{"./Account":1,"./HashChangeHandler":4,"./api/ApiData":5}]},{},[14]);
