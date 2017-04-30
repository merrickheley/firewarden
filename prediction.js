var humidityArray;
var tempArray;
var windUArray;
var windVArray;

var fs = require('fs');

exports.initialise = function() {
  //console.log(__filename);
  //console.log(__dirname);
  humidityArray = readCSV("Relativehumiditylevel97500Pa.csv");
  tempArray = readCSV("Temperaturelevel97500Pa.csv");
  windUArray = readCSV("Ucomponentofwindlevel97500Pa.csv");
  windVArray = readCSV("Vcomponentofwindlevel97500Pa.csv");
}


function calcDistance(lat1, lat2, lon1, lon2) {
  var R = 6371000; // m
  var dLat = (lat2 - lat1) * Math.PI/180;
  var dLon = (lon2 - lon1) * Math.PI/180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}


//φ is latitude, λ is longitude, θ is the bearing (clockwise from north), δ is the angular distance d/R; d being the distance travelled, R the earth’s radius

function calcNewPosition(lat1, lon1, bearing, distance) {
  var R = 6371000; // m
  var lat2 = Math.asin( Math.sin(lat1)*Math.cos(distance/R) + Math.cos(lat1)*Math.sin(distance/R)*Math.cos(bearing) );
  var lon2 = lon1 + Math.atan2(Math.sin(bearing)*Math.sin(distance/R)*Math.cos(lat1), Math.cos(distance/R)-Math.sin(lat1)*Math.sin(lat2));
  return {lat2, lon2};

}
//This function uses 4 spaces
function readCSV(path) {
    //path = __dirname + "/" + path;
    var data;
    var csv = []
    try {
        data = fs.readFileSync(path, 'utf8');
        lines = data.split("\n");
        for(var i=0; i<lines.length;i++) {
            csv.push(lines[i].split(","));
        }
    } catch(e) {
        console.log('Error:', e.stack);
        return;
    }
    console.log("Loaded: " + path);
    return csv;
}

function getValue(lat, lon, array) {
  return array[Math.floor(lat)][Math.floor(lon)];
}

function rate(slope, temp, humidity, windSpeed) {
  return 0;
}

function getElevation() {
  // go to google and get elevation in m

  return 0;
}

function drawShape() {

}

function getSlope(lat1, lat2, lon1, lon2) {
  var slope;


  return slope;
}

function predict(lat, lon, timeDifference) {
  // get VALUES
  var humidity, temp, windU, windV;
  humidity = getValue(lat, lon, humidityArray);
  temp = getValue(lat, lon, tempArray);
  windU = getValue(lat, lon, windUArray);
  windV = getValue(lat, long, windVArray);

  // get slopes

  // get rates

  // draw shape
}
