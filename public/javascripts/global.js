
class WardenLocations {
    constructor() {
        //map = m;
        this.calcLocation();
        this.firepoints = [];
    }

    setMap(map) {
        this.map = map;
    }
    get ReportedFirePoints() {
        return [];
    }

    addFirePoint(position) {
        var marker = new google.maps.Marker( {
            position: position,
            map:this.map,
            title: 'Potential Fire point'
        });
        this.firepoints.push(marker);
    }

    get Map() {
        return this.map;
    }

    calcLocation() {
        // Brisbane
        var that = this;
        this.currentLoc = new google.maps.LatLng(-27.4698,153.0251);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                that.currentLoc = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            });
        }
    }

    get currentLocation() {
        return this.currentLoc;
    }

}
