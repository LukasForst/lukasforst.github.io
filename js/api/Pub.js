export default class Pub{
    constructor(id, place, latitude, longtitude){
        this.place = place;
        this.id = id;
        this.latitude = latitude;
        this.longtitude = longtitude;
    }

    toString(){
        return this.place;
    }
}