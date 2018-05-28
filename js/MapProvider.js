export default class MapProvider {
    constructor(concertsApi) {
        this.concertsApi = concertsApi;
        this.map = null;
        this.showMap(false);
    }

    showMap(useLocation) {
        const mapDiv = $("#concerts-map");
        const mapProp = {
            //default center at city of Domazlice
            center: new google.maps.LatLng(49.4397027, 12.931143499999962),
            zoom: 13,
        };
        this.map = new google.maps.Map(mapDiv.get(0), mapProp);

        if(useLocation) this.initGeo(this.map);

        const concerts = this.concertsApi.allConcerts;
        const places = concerts.map(x => x.place).filter(((v, i, a) => a.indexOf(v) === i));
        const placesWithConcerts = {};
        places.forEach(x => placesWithConcerts[x] = concerts.filter(y => y.place === x));

        let idx = 0;
        for (const key of Object.keys(placesWithConcerts)) {
            const place = places.filter(x => x.place === key)[0];
            const pin = new google.maps.Marker({
                position: new google.maps.LatLng(place.latitude, place.longtitude),
                title: key
            });
            pin.setMap(this.map);

            let tempLiHolder = $(`<ul id="temporary-list-holder-${idx}" style="display:none"></ul>`);
            placesWithConcerts[key].forEach(x => {
                tempLiHolder.append(
                    $(`<li id=temporary-list-holder-${idx}-${x.id} class="list-group-item concert-li map-text"></li>`)
                        .text(`${x.date.toLocaleDateString(navigator.languages[0])} - ${x.place}: ${x.performingBand}`)
                );
            });
            //little hack, we need to append list to see it's outerHTML
            mapDiv.append(tempLiHolder);
            tempLiHolder = $(`#temporary-list-holder-${idx}`);
            tempLiHolder.css('display', '');
            const html = tempLiHolder[0].outerHTML;
            tempLiHolder.remove();

            const infowindow = new google.maps.InfoWindow({
                content: html
            });

            google.maps.event.addListener(pin, 'click', () => {
                infowindow.open(this.map, pin);
            });

            idx++;
        }
    }

    initGeo(map) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                const icon = {
                    url: "img/you-are-here-icon.png",
                    scaledSize: new google.maps.Size(60, 60),
                };

                const marker = new google.maps.Marker({
                    position: pos,
                    animation: google.maps.Animation.BOUNCE,
                    icon: icon
                });
                marker.setMap(map);
                map.setCenter(pos);
            }, function () {
                console.error("Could not find location.");
            });
        } else {
            console.log('Browser does not support geolocation.');
        }
    }
}