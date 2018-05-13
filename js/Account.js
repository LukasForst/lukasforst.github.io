import Cookies from "./Cookies";
import ConcertsProvider from "./ConcertsProvider";

/**
 * This class is only temporary till some backend will be developed.
 * */
export default class Account {
    constructor(dataApi) {
        this._dayaApi = dataApi;
        //note that this is testing state
        this.activeUserNames = {
            'bandAcc1': AccountRoles.BAND,
            'bandAcc2': AccountRoles.BAND,
            'fan1': AccountRoles.FAN,
            'fan2': AccountRoles.FAN
        };

        this._hashToUsername = {};
        this._userNameToHash = {};
        Object.keys(this.activeUserNames).forEach(x => {
            const hash = generateHash(x);
            this._hashToUsername[hash] = x;
            this._userNameToHash[x] = hash;

        });

        this.currentLogedUser = {
            'role': AccountRoles.UNAUTHORIZED,
            'username': 'UNAUTHORIZED'
        };

        this.sitesPermissions = {
            'band': ['band-section', 'not-found', 'welcome-screen'],
            'fan': ['fan-section', 'not-found', 'welcome-screen'],
            'unauthorized': ['not-found', 'login-screen']
        }
    }

    register(newUserName, role) {
        this.activeUserNames[newUserName] = role;
        this.login(newUserName);
    }

    loginFromCookie() {
        let userName = '';
        const userHash = Cookies.getCookie('userHash');
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

    loginAndShowPage(username) {
        let role = this.login(username);
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

    isLoggedIn() {
        return this.currentLogedUser.role !== AccountRoles.UNAUTHORIZED;
    }

    login(userName) {
        userName = userName.trim();
        let userRole;
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

    proceedToRolePage() {
        this._showPage(this.currentLogedUser.role);
    }


    logout() {
        this._setCurrentUser(AccountRoles.UNAUTHORIZED, '');
        window.location.hash = 'login-screen';
    }

    canAccessTag(tag) {
        let role = this.currentLogedUser.role;
        let possibleSitesForRole = this.sitesPermissions[AccountRoles.ToString(role)];
        return possibleSitesForRole.includes(tag);
    }

    _setCurrentUser(userRole, userName) {
        this.currentLogedUser.role = userRole;
        this.currentLogedUser.username = userName;

        if (userRole !== AccountRoles.WRONG_USERNAME && userRole !== AccountRoles.UNAUTHORIZED) {
            Cookies.setCookie('userHash', this._userNameToHash[userName], 30);

            $("#username-fill-field").text('UserName:\t' + userName);
            $("#role-fill-field").text('Role:\t' + AccountRoles.ToString(userRole));

            new ConcertsProvider(this._dayaApi.concertsApi).displayConcertsForFan();
        } else if (userRole === AccountRoles.WRONG_USERNAME) {
            $('#username-input').val(' ').trigger('focus');
            Cookies.deleteCookie('userHash');
            alert('Wrong username!');
        } else {
            Cookies.deleteCookie('userHash');

            $("#username-fill-field").text('UserName:\t');
            $("#role-fill-field").text('Role:\t');
        }
    }


    _showPage(role) {
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
}

function generateHash(string) {
    let hash = 0, i, chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export class AccountRoles {
    static get BAND() {
        return 1;
    }

    static get FAN() {
        return 2;
    }

    static get UNAUTHORIZED() {
        return 3;
    }

    static get WRONG_USERNAME() {
        return 4;
    }

    static ToString(role) {
        switch (role) {
            case AccountRoles.BAND:
                return "band";
            case AccountRoles.FAN:
                return "fan";
            case AccountRoles.UNAUTHORIZED:
                return 'unauthorized';
            default:
                return "Wrong request."
        }
    }
}