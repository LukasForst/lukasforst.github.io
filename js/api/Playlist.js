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

    addPointsForSong(songId, pointsCount){
        const songs = this._playlist.filter(x => x.id === songId);
        if(songs.length > 0){
            songs[0].addVotes(pointsCount);
        }
    }

    toString(){
        let playlist = this.sortedPlaylist;
        let str = "";
        playlist.forEach(x => {
            str += x.toString() + "\n";
        });
        console.log(str);
        return str;
    }
}