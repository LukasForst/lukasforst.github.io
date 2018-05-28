import Account from "./Account";
import HashChangeHandler from "./HashChangeHandler";
import ApiData from "./api/ApiData";
import MapProvider from "./MapProvider";

document.addEventListener("DOMContentLoaded", () => {
    const api = new ApiData();

    const account = new Account(api);
    account.loginFromCookie();

    $("#login-button").on('click', (ev) => {
        let input = $("#username-input");
        account.loginAndShowPage(input.val());
        setUpNavBar(account, map);
        input.val('');
    });

    $('#log-out').on('click', (ev) => {
        account.logout();
        setUpNavBar(account, map);
    });

    const map = new MapProvider(api.concertsApi);
    $("#proceed-to-map-btn").on('click', () => {
        window.location.hash = 'map-section';
        map.showMap(true);
    });

    $("#proceed-to-role-page-btn").on('click', (ev) => account.proceedToRolePage());

    $("#username-input").on('keyup', (ev) => {
        if (ev.originalEvent.code === 'Enter') {
            let input = $("#username-input");
            if (input !== '') {
                account.loginAndShowPage(input.val());
                setUpNavBar(account, map);
                input.val('');
            }
        }
    });

    setUpNavBar(account, map);

    const hashChangeHandler = new HashChangeHandler(account, map);
    $(window).on('hashchange', (ev) => hashChangeHandler.onHashChange(ev));

});

function setUpNavBar(account, mapProvider){
    const yourProfile = $("#your-profile-link");
    yourProfile.off().on('click', (ev) => {
        ev.preventDefault();
        account.proceedToRolePage()
    });

    const logout = $('#log-out-link');
    logout.off().on('click', (ev) => {
        ev.preventDefault();
        account.logout();
        setUpNavBar(account, mapProvider);
    });

    const logIn = $('#log-in-link');
    logIn.off().on('click', (ev) => {
        ev.preventDefault();
        window.location.hash = 'login-screen';
    });

    const welcomeScreen = $('#welcome-screen-link');
    welcomeScreen.off().on('click', (ev) => {
        ev.preventDefault();
        window.location.hash = 'welcome-screen';
    });

    $('#map-link').off().on('click', (ev) => {
        ev.preventDefault();
        window.location.hash = 'map-section';
        mapProvider.showMap(true);
    });

    if(!account.isLoggedIn()){
        yourProfile.css('display', 'none');
        welcomeScreen.css('display', 'none');
        logout.css('display', 'none');

        logIn.css('display', '');
    } else {
        yourProfile.css('display', '');
        welcomeScreen.css('display', '');
        logout.css('display', '');

        logIn.css('display', 'none');
    }
}
