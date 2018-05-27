import Pub from "./Pub";

export default class PubsApi{
    constructor(){
        this._mock = new PubApiMock();
    }

    get allPubs(){
        return this._mock.allPubs;
    }

    addPub(pub){
        this._mock.addPub(pub);
    }
}

class PubApiMock{
    constructor(){
        this._pubs = [];
        this._populate();
    }

    _populate(){
        this.addPub(new Pub(1,'Peters Pub', 49.4416424, 12.929870499999993));
        this.addPub(new Pub(2,'JazzRock Cafe', 49.43951250000001, 12.929611099999988));
        this.addPub(new Pub(3,'RockClub', 49.4397027, 12.931143499999962));
        this.addPub(new Pub(4,'MKS',49.440131,12.930489999999963));
    }

    get allPubs(){
        return this._pubs;
    }

    addPub(pub){
        this._pubs.push(pub);
    }
}