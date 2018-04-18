export default class Song {
    constructor(name, authorBandName) {
        this.name = name;
        this.authorBandName = authorBandName;
        this.currentVotesUp = 0;
        this.currentVotesDown = 0;
    }

    upvote() {
        this.currentVotesUp++;
    }

    downvote() {
        this.currentVotesDown++;
    }

    get value() {
        return this.currentVotesUp - this.currentVotesDown;
    }

    toString() {
        return this.authorBandName + ' - ' + this.name + ' [+' + this.currentVotesUp + ', -' + this.currentVotesDown + ']';
    }

    static comparator(song1, song2){
        return song1.value - song2.value;
    }
}