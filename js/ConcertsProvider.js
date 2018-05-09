export default class ConcertsProvider {
    constructor(concertsApi) {
        this._concertsApi = concertsApi;
    }

    displayConcertsForFan() {
        const listHolder = $("#concert-list");
        const concerts = this._concertsApi.allConcerts;
        concerts.sort((a, b) => a.date - b.date);

        concerts.forEach(x => {
            listHolder.append(
                `<li id=concert-list-${x.id} class="list-group-item concert-li">${x.date.toLocaleDateString(navigator.languages[0])} - ${x.place}: ${x.performingBand}</li>`
            );

            $(`#concert-list-${x.id}`).on('click', (event) => {
                let idx = 0;
                $("#universal-modal-header").text(x.performingBand);
                let dataToDisply = $(`<ul></ul>`);
                x.playlist.sortedPlaylist.forEach((x) => {
                    dataToDisply.append(
                        $("<li></li>")
                            .append(`<input type="checkbox" class="form-check-input" id="checkbox-${idx}-${x.authorBandName}-${x.name}">`)
                            .append(`<label class="form-check-label" for="checkbox-${idx}-${x.authorBandName}-${x.name}">${x.authorBandName} - ${x.name}</label>`));
                    idx++;
                });

                $("#universal-modal-body").html('').append(dataToDisply);
                $("#universal-modal").modal("toggle");
                console.log(event)
            });

        });
        this._addSearchListener();
    }

    _addSearchListener() {
        const callback = function (event) {
            const records = $(".concert-li");
            for (let i = 0; i < records.length; i++) {
                if (records[i].innerText.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
                    records[i].style.display = "";
                } else {
                    records[i].style.display = "none";
                }
            }
        };

        const searchBar = $("#concerts-search-bar");
        searchBar.on('keydown', (event) => callback(event));
    }

    showConcertData() {

    }
}