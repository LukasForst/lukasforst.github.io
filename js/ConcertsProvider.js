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
                $("#universal-modal-header").html(`<p>${x.performingBand}</p>`);
                let dataToDisply = "";
                x.playlist.sortedPlaylist.forEach((x) => {
                    dataToDisply += `<p><butto class="btn">+</butto><button class="btn">-</button> - ${x}</p>`;
                    $("")
                });

                $("#universal-modal-body").html(dataToDisply);

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