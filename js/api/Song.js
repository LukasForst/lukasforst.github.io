export default class Song {
    constructor(name, authorBandName) {
        this.name = name;
        this.authorBandName = authorBandName;
        this.currentVotesUp = 0;
    }

    upvote() {
        this.currentVotesUp++;
    }

    get value() {
        return this.currentVotesUp;
    }

    toString() {
        return this.authorBandName + ' - ' + this.name + ' [+' + this.currentVotesUp + ']';
    }

    static comparator(song1, song2){
        return song1.value - song2.value;
    }
}