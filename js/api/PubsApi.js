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
        this.addPub(new Pub(1,'Peters Pub'));
        this.addPub(new Pub(2,'JazzRock Cafe'));
        this.addPub(new Pub(3,'RockClub'));
        this.addPub(new Pub(4,'MKS'));
    }

    get allPubs(){
        return this._pubs;
    }

    addPub(pub){
        this._pubs.push(pub);
    }
}