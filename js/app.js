import Account from "./Account";
import HashChangeHandler from "./HashChangeHandler";

document.addEventListener("DOMContentLoaded", () => {
    window.location.hash = "welcome-screen";

    let account = new Account();
    account.loginFromCookie();

    $("#login-button").on('click', (ev) => {
        account.login($("#username-input").val());
    });

    $('#log-out').on('click', (ev) => account.logout());

    $("#proceed-to-role-page-btn").on('click', (ev) => {
        account.proceedToRolePage();
    });

    document.addEventListener('keypress', (ev) => {
        if (ev.code === 'Enter') {
            account.login($("#username-input").val());
        }
    });

    let hashChangeHandler = new HashChangeHandler(account);

    $(window).on('hashchange', (ev) => hashChangeHandler.onHashChange(ev));

});