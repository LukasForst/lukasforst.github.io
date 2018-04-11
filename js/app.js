document.addEventListener("DOMContentLoaded", () => {
    //todo load classes
    $("#click-me").on('click', (ev) => {
        ev.currentTarget.textContent = "Hell Yeah";
        let overlay = $(".overlay");
        if(overlay.hasClass("hidden")){
            overlay.removeClass("hidden");
        } else{
            overlay.addClass("hidden");
        }

    })
});