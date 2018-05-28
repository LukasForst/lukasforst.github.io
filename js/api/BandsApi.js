import Band from "./Band";

class BandsApiMock {
    constructor() {
        this._bands = [];
        this._populate();
    }

    _populate() {
        this._bands.push(new Band(1, 'Fousy', ['Lukas', 'Matin', 'Karel', 'Filip']));
        this._bands.push(new Band(2, 'Poulicni Lampa', ['Lukas', 'Morys', 'Humus', 'Karel']));
        this._bands.push(new Band(3, 'Rack Bites', ['Vojta', 'Karel', 'Maty']));
    }
}

export default class BandsApi extends BandsApiMock {
    constructor() {
        super();
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