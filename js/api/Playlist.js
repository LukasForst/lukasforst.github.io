import Song from "./Song";

export default class Playlist {
    constructor(firstSongs) {
        this._playlist = [];
        firstSongs.forEach(x => this._playlist.push(x));
        this._playlist.sort((a, b) => Song.comparator(a, b));
    }

    addSong(song) {
        this._playlist.push(song);
    }

    get sortedPlaylist() {
        this._playlist.sort((a, b) => Song.comparator(a, b));
        return this._playlist;
    }
}