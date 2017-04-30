
class WardenLocations {
    constructor(socket) {
        this.socket = socket;
        this.initSocket();
        this.calcLocation();
        this.firepoints = [];
        this.firepolygon = [];
        this.safepoints = [];
        this.firestations = []
        this.initSafepoints();
        this.initStations();
    }

    initSocket() {
        var that = this;
        this.socket.onmessage = function(event) {
            var data = JSON.parse(event.data);

            if (data.points == undefined)
                return;

            data.points.forEach(function (point) {
                console.log("Adding Fire Point");
                that.addFirePoint(point);
            });
			data.polygons.forEach(function (poly) {
				that.drawFirePolygon(poly);
			});
        };
    }

    initSafepoints() {
        //var brisbane = new google.maps.LatLng(-37.2345994,145.4990086);
    }

    initStations() {
        this.firestations.push(new google.maps.LatLng(-37.210648, 145.423647));
        this.firestations.push(new google.maps.LatLng(-37.245319, 145.495032));
        this.firestations.push(new google.maps.LatLng(-37.326335, 145.501906));
        this.firestations.push(new google.maps.LatLng(-37.202354, 145.603453));
        this.firestations.push(new google.maps.LatLng(-37.253031, 145.706050));
        this.firestations.push(new google.maps.LatLng(-37.183643, 145.709246));
    }

    findNearestFirestation(location) {
        var that = this;
        var distanceService = new google.maps.DistanceMatrixService();
        distanceService.getDistanceMatrix( {
            origins:[location],
            destinations: that.firestations.slice(),
            travelMode: 'DRIVING',
        },function (response,status) {
            if (status == 'OK') {
            var chosenDestination;
            var currentMin = 10000000;
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;
            var from;
            var to;
            for (var i = 0;i < origins.length;i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    var element = results[j];
                    var distance = element.distance.value;
                    var duration = element.duration.value;
                    if (distance < currentMin) {
                        chosenDestination = element;
                        currentMin = distance;
                        from = origins[i];
                        to = destinations[j];
                    }
                }

            }
            var request = {
                origin: to,
                destination: from,
                travelMode: 'DRIVING'
            };
            that.directionsService.route(request, function(result, status) {
                if (status == 'OK') {
                    directionsDisplay.setDirections(result);
                }
            });
            }

        });
    }

    /*
        var image = {
              url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
              // This marker is 20 pixels wide by 32 pixels high.
              size: new google.maps.Size(20, 32),
              // The origin for this image is (0, 0).
              origin: new google.maps.Point(0, 0),
              // The anchor for this image is the base of the flagpole at (0, 32).
              anchor: new google.maps.Point(0, 32)
        };
    */


    setMap(map) {
        this.map = map;
        var that = this;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay =  new google.maps.DirectionsRenderer();
        var image = {
              url: '/images/emergency_services_red_32x19.png',
              size: new google.maps.Size(32, 19),
              // The origin for this image is (0, 0).
              origin: new google.maps.Point(0, 0),
              // The anchor for this image is the base of the flagpole at (0, 32).
              anchor: new google.maps.Point(16, 19)
        };

        this.firestations.forEach(function (position) {
            var marker = new google.maps.Marker({
                position: position,
                map:that.map,
                title: 'Firestation',
                icon: image
            });
        });
        this.infowindow = new google.maps.InfoWindow( {
            content: document.getElementById('add_form'),
            enableEventPropagation: true
        });
    }
    get ReportedFirePoints() {
        return [];
    }

    addFirePoint(position) {
        var image = {
              url: '/images/Fire_Icon_OJ_-_20x32.png',
              size: new google.maps.Size(20, 32),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(10, 32)
        };
        var marker = new google.maps.Marker( {
            position: position,
            map: this.map,
            title: 'Potential Fire point',
            icon: image
        });
        var that = this;
        google.maps.event.addListener(marker, 'click', function(event) {
            that.selectedMarker = marker;
            that.infowindow.open(that.map,marker);
        });
        this.firepoints.push(marker);
    }

    requestFirePoints(startTime, endTime) {
        ws.send(JSON.stringify({
            startTime: startTime,
            endTime: endTime,
        }));
    }

    drawFirePolygon(points) {
        var poly = new google.maps.Polygon( {
            paths:points,
            strokeColor:'#fdb617',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#fdb617',
            fillOpacity: 0.35
        });
        poly.setMap(this.map);
        this.firepolygon.push(poly);
    }

	deleteFirePolygons() {
        this.firepolygon.forEach(function (poly) {
            poly.setMap(null);
        });
        this.firepolygon = [];
	}

    deleteFirePoints() {
        this.firepoints.forEach(function (point) {
            point.setMap(null);
        });
        this.firepoints = [];
    }

    submitFirePoints() {
        var temp = [];
        this.firepoints.forEach(function (point) {
            temp.push(point.getPosition());
        });
        ws.send(JSON.stringify(temp));
    }


    get Map() {
        return this.map;
    }

    calcLocation() {
        // Brisbane
        var that = this;
        var brisbane = new google.maps.LatLng(-27.4698,153.0251);
        var murrindinidi = new google.maps.LatLng(-37.1905981,145.1586601);
        this.currentLoc = murrindinidi;
        /*
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                that.currentLoc = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            });
        }
        */
    }

    get currentLocation() {
        return this.currentLoc;
    }

}
