export default class ConcertsProvider {
    constructor(concertsApi) {
        this._concertsApi = concertsApi;
        this._currentDisplayedConcert = undefined;
    }

    displayConcertsForFan() {
        const listHolder = $("#concert-list");
        listHolder.html('');
        const concerts = this._concertsApi.allConcerts;
        concerts.sort((a, b) => a.date - b.date);

        concerts.forEach(x => {
            listHolder.append(
                $(`<li id=concert-list-${x.id} class="list-group-item concert-li"></li>`)
                    .text(`${x.date.toLocaleDateString(navigator.languages[0])} - ${x.place}: ${x.performingBand}`)
            );

            $(`#concert-list-${x.id}`).on('click', (event) => {
                this._currentDisplayedConcert = x;
                this._createConcertsInModal(x);
            });
        });

        $('#close-and-save-modal-button').on('click', this._updateValuesAfterClose.bind(this));

        this._addSearchListener();
    }

    _updateValuesAfterClose() {
        const sorted = $(`#songs-in-list`);
        sorted.children().each((index, value) => {
            const songId = parseInt(value.id.split('-')[3]);
            if(this._currentDisplayedConcert) {
                this._currentDisplayedConcert.playlist.addPointsForSong(songId, sorted.children().length - index);
            }
        });

        $('#universal-modal').modal('hide');
        $('#close-and-save-modal-button').off('click', this._updateValuesAfterClose.bind(this));
        this._currentDisplayedConcert = undefined;
    }

    _createConcertsInModal(concert) {
        $("#universal-modal-header").text(concert.performingBand);
        const modalBody = $("#universal-modal-body");
        modalBody.html('');

        const draggables = $(`<div class="row"></div>`);
        modalBody.append($(`<div class="container-fluid"></div>`).append(draggables));

        const dragableList = $(`<ul id='songs-in-list' class="list-group mx-auto my-auto"></ul>`)
            .sortable()
            .disableSelection();
        concert.playlist.sortedPlaylist.forEach((value, index) => {
            const element = $(`<li id='song-group-item-${value.id}' class='list-group-item'></li>`);
            element.text(value.authorBandName + ' - ' + value.name);
            dragableList.append(element);
        });

        draggables.append(dragableList);
        $("#universal-modal").modal("toggle");
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
}