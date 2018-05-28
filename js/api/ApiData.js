import BandsApi from "./BandsApi";
import ConcertsApi from "./ConcertsApi";
import PubsApi from "./PubsApi";

export default class ApiData{
    constructor(){
        this.bandApi = new BandsApi();
        this.pubApi = new PubsApi();
        this.concertsApi = new ConcertsApi(this.pubApi.allPubs, this.bandApi.allBands);
    }
}