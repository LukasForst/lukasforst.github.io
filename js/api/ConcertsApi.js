import Concert from "./Concert";
import Song from "./Song";
import Playlist from "./Playlist";

export class ConcertsApiMock {
    constructor(allPubs, allBands) {
        this._concerts = [];
        this._populate(allPubs, allBands);
    }

    _populate(pubs, bands) {
        this._concerts = [];
        this._concerts.push(
            new Concert(
                1,
                bands[getRandomInt(0, bands.length - 1)],
                new Date('May 18, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length - 1)],
                generatePlayList(6))
        );

        this._concerts.push(
            new Concert(
                2,
                bands[getRandomInt(0, bands.length - 1)],
                new Date('May 20, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length - 1)],
                generatePlayList(6))
        );

        this._concerts.push(
            new Concert(
                3,
                bands[getRandomInt(0, bands.length - 1)],
                new Date('May 21, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length - 1)],
                generatePlayList(4)
            ));

        this._concerts.push(
            new Concert(
                4,
                bands[getRandomInt(0, bands.length - 1)],
                new Date('May 22, 2018 20:00:00'),
                pubs[getRandomInt(0, pubs.length - 1)],
                generatePlayList(8))
        );
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


export default class ConcertsApi extends ConcertsApiMock {
    constructor(allPubs, allBands) {
        super(allPubs, allBands);
    }

    get allConcerts() {
        return this._concerts;
    }

    getConcertsForBand(bandId) {
        return this.allConcerts.filter(x => x.performingBand.id === bandId)
    }

    addConcert(concert) {
        this._concerts.push(concert);
    }
}