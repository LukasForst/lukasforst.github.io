import Account from "./Account";
import HashChangeHandler from "./HashChangeHandler";
import ApiData from "./api/ApiData";

document.addEventListener("DOMContentLoaded", () => {
    let api = new ApiData();

    let account = new Account(api);
    account.loginFromCookie();

    $("#login-button").on('click', (ev) => {
        let input =$("#username-input");
        account.loginAndShowPage(input.val());
        input.val('');
    });

    $('#log-out').on('click', (ev) => account.logout());

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

    let hashChangeHandler = new HashChangeHandler(account);
    $(window).on('hashchange', (ev) => hashChangeHandler.onHashChange(ev));
});