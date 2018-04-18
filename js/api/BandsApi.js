import Band from "./Band";

export default class BandsApi extends BandsApiMock {
}

class BandsApiMock {
    constructor() {
        this._bands = [];
        this._populate();
    }

    _populate() {
        this.addBand(new Band('Fousy', ['Lukas', 'Matin', 'Karel', 'Filip']));
        this.addBand(new Band('Poulicni Lampa', ['Lukas', 'Morys', 'Humus', 'Karel']));
        this.addBand(new Band('Rack Bites', ['Vojta', 'Karel', 'Maty']));
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