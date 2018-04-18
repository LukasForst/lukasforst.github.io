import Band from "./Band";

export default class BandsApi {
    constructor() {
        this._mock = new BandsApiMock();
    }

    get allBands() {
        return this._mock.allBands;
    }

    addBand(band) {
        this._mock.addBand(band);
    }

    removeBand(bandId) {
        this._mock.removeBand(bandId);
    }

}

class BandsApiMock {
    constructor() {
        this._bands = [];
        this._populate();
    }

    _populate() {
        this.addBand(new Band(1, 'Fousy', ['Lukas', 'Matin', 'Karel', 'Filip']));
        this.addBand(new Band(2, 'Poulicni Lampa', ['Lukas', 'Morys', 'Humus', 'Karel']));
        this.addBand(new Band(3, 'Rack Bites', ['Vojta', 'Karel', 'Maty']));
    }

    get allBands() {
        return this._bands;
    }

    addBand(band) {
        this._bands.push(band);
    }

    removeBand(bandId) {
        this._bands = this._bands.filter(x => x.id !== bandId);
    }
}