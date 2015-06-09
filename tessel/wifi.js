/* the wifi-cc3000 library is bundled in with Tessel's firmware,
 * so there's no need for an npm install. It's similar
 * to how require('tessel') works.
 */ 
var wifi = require('wifi-cc3000');
var http = require('http');

var bugcore = require('bugcore');
var bugflow = require('bugflow');

var Class = bugcore.Class;
var Obj = bugcore.Obj;

var $series = bugflow.$series;
var $task = bugflow.$task;

var WifiManager = Class.extend(Obj, {

    _name: "WifiManager",


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function(wifi) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Wifi}
         */
        this.wifi = wifi;
    },



    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    connect: function(network, pass, security, callback) {
        var timeouts = 0;
        var _this = this;
        if (!this.wifi.isConnected()) {
            // try to reconnect
            this.doConnect(network, pass, security);
            this.wifi.on('connect', function(data) {
                console.log("connect emitted", data);
                callback();
            });

            this.wifi.on('disconnect', function(data) {
                // wifi dropped, probably want to call connect() again
                console.log("disconnect emitted", data);
            });

            this.wifi.on('timeout', function(error) {
                console.log("timeout emitted");
                timeouts++;
                if (timeouts > 2) {
                    // reset the wifi chip if we've timed out too many times
                    _this.doReset(function() {
                        callback(error);
                    });
                } else {
                    // try to reconnect
                    _this.doConnect(network, pass, security);
                }
            });

            this.wifi.on('error', function(error) {
                // one of the following happened
                // 1. tried to disconnect while not connected
                // 2. tried to disconnect while in the middle of trying to connect
                // 3. tried to initialize a connection without first waiting for a timeout or a disconnect
                console.log("error emitted", error);
                callback(error);
            });
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} network
     * @param {string} pass
     * @param {string} security
     */
    doConnect: function(network, pass, security) {
        this.wifi.connect({
            security: security,
            ssid: network,
            password: pass,
            timeout: 30 // in seconds
        });
    },

    /**
     * @private
     * @param {function(Error)} callback
     */
    doReset: function(callback) {
        // when the wifi chip resets, it will automatically try to reconnect
        // to the last saved network
        this.wifi.reset(function(error) {
            console.log("done power cycling");
            callback(error);
        })
    }
});


var wifiManager = new WifiManager(wifi);
var network = 'MOTOROLA-F15FF'; // put in your network name here
var pass = '37134dbf9c'; // put in your password here, or leave blank for unsecured
var security = 'wpa2'; // other options are 'wep', 'wpa', or 'unsecured'


var doStuff = function(callback) {

    var statusCode = 200;
    var count = 1;

    console.log('http request #' + (count++))
    http.get("http://httpstat.us/" + statusCode, function (res) {
        console.log('# statusCode', res.statusCode)

        var bufs = [];
        res.on('data', function (data) {
            bufs.push(new Buffer(data));
            console.log('# received', new Buffer(data).toString());
        })
        res.on('end', function () {
            console.log('done.');
            callback();
        })
    }).on('error', function (error) {
        console.log('not ok -', error.message, 'error event');
        callback(error);
    });
};

$series([
    $task(function(flow) {
        wifiManager.connect(network, pass, security, function(error) {
            flow.complete(error);
        })
    }),
    $task(function(flow) {
        doStuff(function(error) {
            flow.complete(error);
        })
    })
]).execute(function(throwable){
    if (!throwable) {
        console.log("COMPLETE!");
    } else {
        throw throwable;
    }
});
