import Concert from "./Concert";
import Song from "./Song";
import Playlist from "./Playlist";

export default class ConcertsApi {
    constructor(pubApi, bandApi){
        this._mock = new ConcertsApiMock(pubApi, bandApi);
    }
    get allConcerts() {
        return this._mock.allConcerts;
    }

    addConcert(concert) {
        this._mock.addConcert(concert);
    }

    getConcertsForBand(bandId){
        return this._mock.getConcertsForBand(bandId)
    }
}

class ConcertsApiMock {
    constructor(pubApi, bandApi) {
        this._concerts = [];
        this._populate(pubApi.allPubs, bandApi.allBands);
    }

    _populate(pubs, bands) {
        this.addConcert(
            new Concert(
                1,
                bands[getRandomInt(0, bands.length)],
                new Date('May 18, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length)]),
                generatePlayList(6)
            );

        this.addConcert(
            new Concert(
                2,
                bands[getRandomInt(0, bands.length)],
                new Date('May 20, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length)]),
            generatePlayList(6)
        );

        this.addConcert(
            new Concert(
                3,
                bands[getRandomInt(0, bands.length)],
                new Date('May 21, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length)]),
            generatePlayList(4)
        );

        this.addConcert(
            new Concert(
                4,
                bands[getRandomInt(0, bands.length)],
                new Date('May 22, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length)]),
            generatePlayList(8)
        );
    }


    get allConcerts() {
        return this._concerts;
    }

    addConcert(concert) {
        this._concerts.push(concert);
    }

    getConcertsForBand(bandId){
        return this._concerts.filter(x => x.performingBand.id === bandId)
    }
}

function generatePlayList(songsCount) {
    const songs = [];
    for(let i = 0; i < songsCount; i++){
        songs.push(generateSong());
    }
    return new Playlist(songs);
}

function generateSong() {
    const songs = [
        new Song('Stejne jako ja', 'Chinaski'),
        new Song('Spac', 'Chinaski'),
        new Song('Klidna jako voda', 'Jelen'),
        new Song('Jelen', 'Chinaski'),
        new Song('Malotraktorem', 'Mig21'),
        new Song('Vlci srdce', 'Jelen'),
        new Song('Magdalena', 'Jelen'),
        new Song('Sight not more', 'Mumford n sons'),
        new Song('Lokomotiva', 'Poletime'),
        new Song('Mezi horami', 'Cechomor'),

    ];
    return songs[getRandomInt(0, songs.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
