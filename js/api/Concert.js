export default class Concert {
    constructor(id, performingBand, date, place, playlist) {
        this.performingBand = performingBand;
        this.playlist = playlist;
        this.date = date;
        this.place = place;
        this.id = id;
    }
}