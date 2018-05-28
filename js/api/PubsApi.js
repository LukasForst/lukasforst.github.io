import Pub from "./Pub";

class PubApiMock {
    constructor() {
        this._pubs = [];
        this._populate();
    }

    _populate() {
        this._pubs.push(new Pub(1, 'Peters Pub', 49.4416424, 12.929870499999993));
        this._pubs.push(new Pub(2, 'JazzRock Cafe', 49.43951250000001, 12.929611099999988));
        this._pubs.push(new Pub(3, 'RockClub', 49.4397027, 12.931143499999962));
        this._pubs.push(new Pub(4, 'MKS', 49.440131, 12.930489999999963));
    }
}

export default class PubsApi extends PubApiMock {
    constructor() {
        super();
    }

    addPub(pub) {
        this._pubs.push(pub);
    }

    get allPubs() {
        return this._pubs;
    }
}