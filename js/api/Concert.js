export default class Concert {
    constructor(performingBand, date, place, playlist) {
        this.performingBand = performingBand;
        this.playlist = playlist;
        this.date = date;
        this.place = place;
        this.id = ConcertIdGenerator.generateId();
    }


}

//this is only for mock purposes
class ConcertIdGenerator {
    static _currId = 1;

    static generateId() {
        return this._currId++;
    }
}