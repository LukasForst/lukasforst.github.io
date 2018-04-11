import Cookies from "./Cookies";

export default class Account {
    constructor() {
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

    logout() {
        Cookies.deleteCookie('username');
    }

    loginFromCookie() {
        let userName = Cookies.getCookie('username');
        if (userName !== '') {
            this.login(userName);
        }
    }

    login(userName) {
        console.log('Login for: ' + userName);
        let userRole;
        if (userName) {
            userRole = this.activeUserNames[userName];
            if (userRole) {
                this.currentLogedUser.role = userRole;
                this.currentLogedUser.username = userName;
                Cookies.setCookie('username', userName, 30);
            } else {
                userRole = AccountRoles.WRONG_USERNAME;
            }
        } else {
            userRole = AccountRoles.UNAUTHORIZED;
        }

        this._showPage(userRole);
    }

    register(newUserName, role) {
        this.activeUserNames[newUserName] = role;
        this.login(newUserName);
    }

    _showPage(role) {
        switch (role) {
            case AccountRoles.BAND:
                $(".welcome-header, .fan-section").addClass('hidden');
                $(".band-section").removeClass('hidden');
                window.location.hash = 'band-section';
                break;
            case AccountRoles.FAN:
                $(".welcome-header, .band-section").addClass('hidden');
                $(".fan-section").removeClass('hidden');
                window.location.hash = 'fan-section';
                break;
            case AccountRoles.UNAUTHORIZED:
                $(".band-section, .fan-section").addClass('hidden');
                $(".welcome-header").removeClass('hidden');
                window.location.hash = 'header';
                break;
            case AccountRoles.WRONG_USERNAME:
                alert("Wrong username");
                break;
            default:
                break;
        }
    }
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
}