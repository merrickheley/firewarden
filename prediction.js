var humidityArray;
var tempArray;
var windUArray;
var windVArray;


var fs = require('fs');

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyB8Xam62TS4-Hl6K9SdE-hBurybdDVT6gQ'
});

exports.initialise = function() {
  humidityArray = readCSV("Relativehumiditylevel97500Pa.csv");
  tempArray = readCSV("Temperaturelevel97500Pa.csv");
  windUArray = readCSV("Ucomponentofwindlevel97500Pa.csv");
  windVArray = readCSV("Vcomponentofwindlevel97500Pa.csv");
}

exports.coolTests = function () {
    console.log(humidityArray.length);
    console.log(humidityArray[0].length);
    console.log(getValue(-27,355, humidityArray));
}

function calcDistance(lat1, lat2, lon1, lon2) {
  var R = 6371000; // m
  var dLat = (lat2 - lat1) * Math.PI/180;
  var dLon = (lon2 - lon1) * Math.PI/180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function calcNewPosition(lat1, lon1, bearing, distance) {
  var R = 6371000; // m
  lat1 = lat1 * Math.PI / 180;
  lon1 = lon1 * Math.PI / 180;
  var lat2 = Math.asin( Math.sin(lat1)*Math.cos(distance/R) +
            Math.cos(lat1)*Math.sin(distance/R)*
            Math.cos(bearing * Math.PI/180) );
  var lon2 = lon1 + Math.atan2(Math.sin(bearing * Math.PI/180)*Math.sin(distance/R)*
            Math.cos(lat1), Math.cos(distance/R)-
            Math.sin(lat1)*Math.sin(lat2));
  //console.log("stuff: " + Math.sin(bearing * Math.PI/180), Math.sin(distance/R))
  return [lat2 * 180 / Math.PI, lon2 * 180 / Math.PI];
}

function readCSV(path) {
  var csv;
  // fill in

  return csv;
}

function getValue(lat, lon, array) {
    if(lat < -90 | lat > 90 | lon < 0 | lon > 360) {
        console.log("lat,long out of bounds:",lat,lon);
    }
  return array[Math.floor(lat+90)][Math.floor(lon)];
}

function getRate(slopeFactor, temp, humidity, windSpeed) {
  var h = 5; // drought factor
  var c = humidity;
  var d = windSpeed * 3.6; // km/h
  var b = temp - 273; // degrees c
  var fuelLoad = 12.5; // estimated

  var k=2*(Math.exp((0.987*Math.log(h+0.001))-0.45-(0.0345*c)+(0.0338*b)+(0.0234*d)));

  return rate = 0.0012 * k * slopeFactor * fuelLoad;
}

// Needs to be enconded as [{ lat: lat, lng: }]
function getElevation(latLngs) {
  // go to google and get elevation in m
	return new Promise(function (resolve,reject) {
		googleMapsClient.elevation(
			latLngs,
			function (err,response) {
				if (err) reject(err);
				resolve(response);
		});
	});
}

function drawShape() {

}

function getSlope(elev1, elev2, distance) {
  var diff = elev2 - elev1;
  console.log(diff)
  return Math.atan2(diff, distance) * 180 / Math.PI;
}

function getSlopeFactor(angle) {
  if(angle >= 0) {
    return Math.exp(0.069 * angle)
  } else {
    return Math.exp(-0.069 * angle) / (2 * Math.exp(-0.069 * angle) - 1)
  }
}

function predict(lat, lon, timeDifference, elevations) {
  // get VALUES
  var humidity, temp, windU, windV, windSpeed, windBearing;
  humidity = getValue(lat, lon, humidityArray);
  temp = getValue(lat, lon, tempArray);
  windU = getValue(lat, lon, windUArray);
  windV = getValue(lat, long, windVArray);

  windSpeed = Math.sqrt(windU * windU + windV * windV);
  windBearing = Math.atan2(windU, windV) * 180 / Math.PI;

  var angle = 0;
  // get slopes

  var points = [];

  for(var i = 0; i < 8; ++i) {
    // get slopes
    var slope = getSlope(elevations[0], elevations[i + 1], 50);
    // get wind in correct direction
    var relativeWindSpeed = windSpeed * Math.cos(*windBearing - angle) * Math.PI / 180);
    // get rates
    var rate = getRate(getSlopeFactor(slope), temp, humidity, relativeWindSpeed);
    // get point as lat, lon
    var newPoint = calcNewPosition(lat, lon, angle, rate * time);
    points.push(newPoint);
    angle += 45;
  }
  return points;
}
exports.test = function () {
  console.log(getSlope(55, 55, 50));
  console.log(getSlope(60, 55, 50));
  console.log(getSlope(50, 55, 50));
};
