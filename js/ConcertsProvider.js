export default class ConcertsProvider {
    constructor(concertsApi) {
        this._concertsApi = concertsApi;
        this._currentDisplayedConcert = undefined;
    }

    displayConcertsForFan() {
        const listHolder = $("#concert-list");
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
        $('#real-song-dropzone').remove();
        const sorted = $(`#song-dropzone-list`);
        sorted.children().each((index, value) => {
            const songId = parseInt(value.id.split('-')[3]);
            this._currentDisplayedConcert.playlist.addPointsForSong(songId, sorted.children().length - index);
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
        const dropables = $(`<div class="row"></div>`);
        dropables.append($(`<ul id="song-dropzone-list" class="list-group list-group-flush mx-auto my-auto"></ul>`));
        modalBody.append($(`<div class="container-fluid"></div>`).append(dropables).append(draggables));
        this._createNextZoneToDrop();

        const dragableList = $(`<ul id='songs-in-list' class="list-group mx-auto my-auto"></ul>`);
        concert.playlist.sortedPlaylist.forEach((value, index) => {
            const element = $(`<li id='song-group-item-${value.id}' class='list-group-item' draggable='true'></li>`);
            element.text(value.authorBandName + ' - ' + value.name);
            element.on('dragstart', (event) => event.originalEvent.dataTransfer.setData("song", event.target.id));
            dragableList.append(element);
        });

        draggables.append(dragableList);
        $("#universal-modal").modal("toggle");
    }

    _createNextZoneToDrop() {
        const list = $(`#song-dropzone-list`);
        $('#real-song-dropzone').remove();
        const li = $(`<li id='real-song-dropzone' class="list-group-item mx-auto my-auto"></li>`);
        li.text('Drop all sorted music here!');
        li.on('drop', (e) => this._drop(e.originalEvent));
        li.on('dragover', (e) => e.preventDefault());
        list.append(li);
    }

    _drop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData("song");
        const list = $(`#song-dropzone-list`);
        list.append($(`#${data}`));

        const songsLins = $(`#songs-in-list`);
        if (songsLins.children().length !== 0) {
            this._createNextZoneToDrop();
        } else {
            $('#real-song-dropzone').remove();
        }
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