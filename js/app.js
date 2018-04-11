import Account from "./Account";

document.addEventListener("DOMContentLoaded", () => {
    let account = new Account();
    account.loginFromCookie();
    //todo load classes

    $("#login-button").on('click', (ev) => {
        account.login($("#username-input").val());
    });

    $("#proceed-to-role-page-btn").on('click', (ev) => {
        account.proceedToRolePage();
    });

    document.addEventListener('keypress', (ev) => {
        if (ev.code === 'Enter') {
            account.login($("#username-input").val());
        }
    });
});