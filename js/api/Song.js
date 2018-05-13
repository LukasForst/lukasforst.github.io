export default class Song {
    constructor(id, name, authorBandName) {
        this.id = id;
        this.name = name;
        this.authorBandName = authorBandName;
        this.currentVotesUp = 0;
    }

    upvote() {
        this.currentVotesUp++;
    }

    addVotes(times){
        this.currentVotesUp += times;
    }

    get value() {
        return this.currentVotesUp;
    }

    toString() {
        return this.authorBandName + ' - ' + this.name + ' [+' + this.currentVotesUp + ']';
    }

    static comparator(song1, song2){
        return song2.value - song1.value;
    }
}