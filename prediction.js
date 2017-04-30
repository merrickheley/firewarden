var humidityArray;
var tempArray;
var windUArray;
var windVArray;

function initialise() {
  humidityArray = readCSV("data/Relativehumiditylevel97500PA.csv");
  tempArray = readCSV("data/Temparaturelevel97500Pa.csv");
  windUArray = readCSV("data/Ucomponentofwindlevel97500PA.csv");
  windVArray = readCSV("data/Vcomponentofwindlevel97500.csv");
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
  var lat2 = Math.asin( Math.sin(lat1 * Math.PI/180)*Math.cos(distance/R) +
            Math.cos(lat1 * Math.PI/180)*Math.sin(distance/R)*
            Math.cos(bearing * Math.PI/180) );
  var lon2 = lon1 + Math.atan2(Math.sin(bearing * Math.PI/180)*Math.sin(distance/R)*
            Math.cos(lat1 * Math.PI/180), Math.cos(distance/R)-
            Math.sin(lat1* Math.PI/180)*Math.sin(lat2 * Math.PI/180));
  return [lat2, lon2];
}

function readCSV(path) {
  var csv;
  // fill in

  return csv;
}

function getValue(lat, lon, array) {
  return array[Math.floor(lat)][Math.floor(lon)];
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

function getElevation() {
  // go to google and get elevation in m

  return 0;
}

function drawShape() {

}

function getSlope(lat1, lon1) {
  var slope;

  return slope;
}

function getSlopeFactor(angle) {
  if(angle >= 0) {
    return Math.exp(0.069 * angle)
  } else {
    return Math.exp(-0.069 * angle) / (2 * Math.exp(-0.069 * angle) - 1)
  }
}

function predict(lat, lon, timeDifference) {
  // get VALUES
  var humidity, temp, windU, windV;
  humidity = getValue(lat, lon, humidityArray);
  temp = getValue(lat, lon, tempArray);
  windU = getValue(lat, lon, windUArray);
  windV = getValue(lat, long, windVArray);
  var angle = 0;
  // get slopes

  var slopes = [];

  for(var i = 0; i < 8; ++i) {
    // get slopes

    // get rates

    // get point as lat, lon
  }
}
exports.test = function () {
  var sf = getSlopeFactor(5);
  var rate = getRate(sf, 303, 50, 10);
  console.log("sf: " + sf + ", rate: " + rate);
};
