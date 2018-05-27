export default class BandProvider {
    constructor(apiData){
        this._apiData = apiData;
    }

    displayDataForBand(bandName){
        $('#name-band-section-header').text(bandName);
    }
}