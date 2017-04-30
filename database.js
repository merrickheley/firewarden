/*
 * database.js
 *
 * This is a simple database module that provides an interface to the
 * logged fires.
 *
 */

/* Init
 *
 * Create the database object and its tables. Should be called after require,
 *   e.g.
 *
 *      var db = require('./database.js').init()
 */
exports.init = function () {
    // Grab the sqlite database and connect
    var sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database('firewarden.db');

    // Create the db table if it doesn't exist
    this.db.exec("CREATE TABLE IF NOT EXISTS FireLog (\
                        id INTEGER PRIMARY KEY AUTOINCREMENT, \
                        time INTEGER NOT NULL, \
                        latitude DOUBLE NOT NULL, \
                        longitude DOUBLE NOT NULL\
                );");

    return this;
}

/* teardown
 *
 * Close the database connection before shutdown. Should be called after final
 * database access call.
 */
exports.teardown = function () {
    this.db.close();
}

/* logFire
 *
 * Log a fire to the database.
 */
exports.logFire = function (timestamp, latitude, longitude) {
    this.db.run("INSERT INTO FireLog (time, latitude, longitude) VALUES (" + timestamp + ", " +
        latitude + ", " + longitude + ");");
}

/* getAllFires
 *
 * Get all the fires from the database. This will be formatted as a dictionary
 *   of named [column=value] pairs.
 */
exports.getFiresForTimePeriod = function (func, startTime, endTime) {
    this.db.all("SELECT * FROM FireLog WHERE time BETWEEN " + startTime +
        " AND " + endTime + ";", func);
}

exports.getAllFires = function (func) {
    this.db.all("SELECT * FROM FireLog", func);
}
