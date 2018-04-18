export default class Band{
    constructor(name, members){
        this.name = name;
        this.members = members;
        this.id = BandIdGenerator.generateId();
    }
}

//this is here only for mock purposes
class BandIdGenerator{
    static _currId = 1;

    static generateId(){
        return this._currId++;
    }
}