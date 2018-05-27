import Account from "./Account";
import HashChangeHandler from "./HashChangeHandler";
import ApiData from "./api/ApiData";
import MapProvider from "./MapProvider";

document.addEventListener("DOMContentLoaded", () => {
    const api = new ApiData();

    const account = new Account(api);
    account.loginFromCookie();

    $("#login-button").on('click', (ev) => {
        let input =$("#username-input");
        account.loginAndShowPage(input.val());
        input.val('');
    });

    $('#log-out').on('click', (ev) => account.logout());

    const map = new MapProvider(api.concertsApi);
    $("#proceed-to-map-btn").on('click', () => {
        window.location.hash = 'map-section';
        map.showMap(true);
    });

    $("#proceed-to-role-page-btn").on('click', (ev) => {
        account.proceedToRolePage();
    });

    $("#username-input").on('keyup', (ev) => {
        if (ev.originalEvent.code === 'Enter') {
            let input = $("#username-input");
            if(input !== ''){
                account.loginAndShowPage(input.val());
                input.val('');
            }
        }
    });

    const hashChangeHandler = new HashChangeHandler(account);
    $(window).on('hashchange', (ev) => hashChangeHandler.onHashChange(ev));

});
