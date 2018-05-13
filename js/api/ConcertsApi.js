import Concert from "./Concert";
import Song from "./Song";
import Playlist from "./Playlist";

export default class ConcertsApi {
    constructor(pubApi, bandApi) {
        this._mock = new ConcertsApiMock(pubApi, bandApi);
    }

    get allConcerts() {
        return this._mock.allConcerts;
    }

    addConcert(concert) {
        this._mock.addConcert(concert);
    }

    getConcertsForBand(bandId) {
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
                bands[getRandomInt(0, bands.length - 1)],
                new Date('May 18, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length - 1)],
                generatePlayList(6))
        );

        this.addConcert(
            new Concert(
                2,
                bands[getRandomInt(0, bands.length - 1)],
                new Date('May 20, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length - 1)],
                generatePlayList(6))
        );

        this.addConcert(
            new Concert(
                3,
                bands[getRandomInt(0, bands.length - 1)],
                new Date('May 21, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length - 1)],
                generatePlayList(4)
            ));

        this.addConcert(
            new Concert(
                4,
                bands[getRandomInt(0, bands.length - 1)],
                new Date('May 22, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length - 1)],
                generatePlayList(8))
        );
    }


    get allConcerts() {
        return this._concerts;
    }

    addConcert(concert) {
        this._concerts.push(concert);
    }

    getConcertsForBand(bandId) {
        return this._concerts.filter(x => x.performingBand.id === bandId)
    }
}

function generatePlayList(songsCount) {
    const songs = [];
    for (let i = 0; i < songsCount; i++) {
        const song = generateSong();
        if (songs.filter(x => x.id === song.id).length === 0) {
            songs.push(song);
        }
    }
    return new Playlist(songs);
}

function generateSong() {
    const songs = [
        new Song(1, 'Stejne jako ja', 'Chinaski'),
        new Song(2, 'Spac', 'Chinaski'),
        new Song(3, 'Klidna jako voda', 'Jelen'),
        new Song(4, 'Jelen', 'Chinaski'),
        new Song(5, 'Malotraktorem', 'Mig21'),
        new Song(6, 'Vlci srdce', 'Jelen'),
        new Song(7, 'Magdalena', 'Jelen'),
        new Song(8, 'Sight not more', 'Mumford n sons'),
        new Song(9, 'Lokomotiva', 'Poletime'),
        new Song(10, 'Mezi horami', 'Cechomor'),

    ];
    return songs[getRandomInt(0, songs.length - 1)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
