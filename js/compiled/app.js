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
            'band': ['band-section', 'not-found', 'welcome-screen', 'map-section'],
            'fan': ['fan-section', 'not-found', 'welcome-screen', 'map-section'],
            'unauthorized': ['not-found', 'login-screen', 'map-section']
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
            } else {
                _Cookies2.default.deleteCookie('userHash');
                $('#username-input').val('').trigger('focus');
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
                    window.location.hash = 'login-screen';
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
            listHolder.html('');
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

            var sorted = $('#songs-in-list');
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
            modalBody.append($('<div class="container-fluid"></div>').append(draggables));

            var dragableList = $('<ul id=\'songs-in-list\' class="list-group mx-auto my-auto"></ul>').sortable().disableSelection();
            concert.playlist.sortedPlaylist.forEach(function (value, index) {
                var element = $('<li id=\'song-group-item-' + value.id + '\' class=\'list-group-item\'></li>');
                element.text(value.authorBandName + ' - ' + value.name);
                dragableList.append(element);
            });

            draggables.append(dragableList);
            $("#universal-modal").modal("toggle");
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
    function HashChangeHandler(account, mapProvider) {
        _classCallCheck(this, HashChangeHandler);

        this.account = account;
        this.mapProvider = mapProvider;
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
            } else if (nextClass === '.map-section') {
                this.mapProvider.showMap();
            }
        }
    }]);

    return HashChangeHandler;
}();

exports.default = HashChangeHandler;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapProvider = function () {
    function MapProvider(concertsApi) {
        _classCallCheck(this, MapProvider);

        this.concertsApi = concertsApi;
        this.map = null;
        this.currentPosition = null;
    }

    _createClass(MapProvider, [{
        key: 'showMap',
        value: function showMap() {
            var _this = this;

            if (this.map !== null) {
                if (this.currentPosition !== null) {
                    this.map.setCenter(this.currentPosition);
                } else {
                    this.initGeo(this.map);
                }
                return;
            }

            var mapDiv = $("#concerts-map");
            var mapProp = {
                //default center at city of Domazlice
                center: new google.maps.LatLng(49.4397027, 12.931143499999962),
                zoom: 13
            };
            this.map = new google.maps.Map(mapDiv.get(0), mapProp);

            this.initGeo(this.map);

            var concerts = this.concertsApi.allConcerts;
            var places = concerts.map(function (x) {
                return x.place;
            }).filter(function (v, i, a) {
                return a.indexOf(v) === i;
            });
            var placesWithConcerts = {};
            places.forEach(function (x) {
                return placesWithConcerts[x] = concerts.filter(function (y) {
                    return y.place === x;
                });
            });

            var idx = 0;

            var _loop = function _loop(key) {
                var place = places.filter(function (x) {
                    return x.place === key;
                })[0];
                var pin = new google.maps.Marker({
                    position: new google.maps.LatLng(place.latitude, place.longtitude),
                    title: key
                });
                pin.setMap(_this.map);

                var tempLiHolder = $('<ul id="temporary-list-holder-' + idx + '" style="display:none"></ul>');
                placesWithConcerts[key].forEach(function (x) {
                    tempLiHolder.append($('<li id=temporary-list-holder-' + idx + '-' + x.id + ' class="list-group-item concert-li map-text"></li>').text(x.date.toLocaleDateString(navigator.languages[0]) + ' - ' + x.place + ': ' + x.performingBand));
                });
                //little hack, we need to append list to see it's outerHTML
                mapDiv.append(tempLiHolder);
                tempLiHolder = $('#temporary-list-holder-' + idx);
                tempLiHolder.css('display', '');
                var html = tempLiHolder[0].outerHTML;
                tempLiHolder.remove();

                var infowindow = new google.maps.InfoWindow({
                    content: html
                });

                google.maps.event.addListener(pin, 'click', function () {
                    infowindow.open(_this.map, pin);
                });

                idx++;
            };

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(placesWithConcerts)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    _loop(key);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'initGeo',
        value: function initGeo(map) {
            var _this2 = this;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    var icon = {
                        url: "img/you-are-here-icon.png",
                        scaledSize: new google.maps.Size(60, 60)
                    };

                    var marker = new google.maps.Marker({
                        position: pos,
                        animation: google.maps.Animation.BOUNCE,
                        icon: icon
                    });
                    marker.setMap(map);
                    map.setCenter(pos);
                    _this2.currentPosition = pos;
                }, function () {
                    console.error("Could not find location.");
                });
            } else {
                console.log('Browser does not support geolocation.');
            }
        }
    }]);

    return MapProvider;
}();

exports.default = MapProvider;

},{}],7:[function(require,module,exports){
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

},{"./BandsApi":9,"./ConcertsApi":11,"./PubsApi":14}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./Band":8}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./Concert":10,"./Playlist":12,"./Song":15}],12:[function(require,module,exports){
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

},{"./Song":15}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pub = function () {
    function Pub(id, place, latitude, longtitude) {
        _classCallCheck(this, Pub);

        this.place = place;
        this.id = id;
        this.latitude = latitude;
        this.longtitude = longtitude;
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

},{}],14:[function(require,module,exports){
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
            this.addPub(new _Pub2.default(1, 'Peters Pub', 49.4416424, 12.929870499999993));
            this.addPub(new _Pub2.default(2, 'JazzRock Cafe', 49.43951250000001, 12.929611099999988));
            this.addPub(new _Pub2.default(3, 'RockClub', 49.4397027, 12.931143499999962));
            this.addPub(new _Pub2.default(4, 'MKS', 49.440131, 12.930489999999963));
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

},{"./Pub":13}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
"use strict";

var _Account = require("./Account");

var _Account2 = _interopRequireDefault(_Account);

var _HashChangeHandler = require("./HashChangeHandler");

var _HashChangeHandler2 = _interopRequireDefault(_HashChangeHandler);

var _ApiData = require("./api/ApiData");

var _ApiData2 = _interopRequireDefault(_ApiData);

var _MapProvider = require("./MapProvider");

var _MapProvider2 = _interopRequireDefault(_MapProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener("DOMContentLoaded", function () {
    var api = new _ApiData2.default();

    var account = new _Account2.default(api);
    account.loginFromCookie();

    $("#login-button").on('click', function (ev) {
        var input = $("#username-input");
        account.loginAndShowPage(input.val());
        setUpNavBar(account, map);
        input.val('');
    });

    $('#log-out').on('click', function (ev) {
        account.logout();
        setUpNavBar(account, map);
    });

    var map = new _MapProvider2.default(api.concertsApi);
    $("#proceed-to-map-btn").on('click', function () {
        window.location.hash = 'map-section';
        map.showMap(true);
    });

    $("#proceed-to-role-page-btn").on('click', function (ev) {
        return account.proceedToRolePage();
    });

    $("#username-input").on('keyup', function (ev) {
        if (ev.originalEvent.code === 'Enter') {
            var input = $("#username-input");
            if (input !== '') {
                account.loginAndShowPage(input.val());
                setUpNavBar(account, map);
                input.val('');
            }
        }
    });

    setUpNavBar(account, map);

    var hashChangeHandler = new _HashChangeHandler2.default(account, map);
    $(window).on('hashchange', function (ev) {
        return hashChangeHandler.onHashChange(ev);
    });
});

function setUpNavBar(account, mapProvider) {
    var yourProfile = $("#your-profile-link");
    yourProfile.off().on('click', function (ev) {
        ev.preventDefault();
        account.proceedToRolePage();
    });

    var logout = $('#log-out-link');
    logout.off().on('click', function (ev) {
        ev.preventDefault();
        account.logout();
        setUpNavBar(account, mapProvider);
    });

    var welcomeScreen = $('#welcome-screen-link');
    welcomeScreen.off().on('click', function (ev) {
        ev.preventDefault();
        window.location.hash = 'welcome-screen';
    });

    $('#map-link').off().on('click', function (ev) {
        ev.preventDefault();
        window.location.hash = 'map-section';
        mapProvider.showMap(true);
    });

    if (!account.isLoggedIn()) {
        yourProfile.css('display', 'none');
        welcomeScreen.css('display', 'none');
        logout.css('display', 'none');
    } else {
        yourProfile.css('display', '');
        welcomeScreen.css('display', '');
        logout.css('display', '');
    }
}

},{"./Account":1,"./HashChangeHandler":5,"./MapProvider":6,"./api/ApiData":7}]},{},[16]);
