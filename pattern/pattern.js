var bugcore     = require('bugcore');
var bugflow     = require('bugflow');
var bugfs       = require('bugfs');

var BugFs       = bugfs;
var Class       = bugcore.Class;
var Obj         = bugcore.Obj;


var filePath = "./etc/test-file.txt";


/**
 * @class
 * @extends {Obj}
 */
var TextProcessor = Class.extend(Obj, /** @lends {TextProcessor.prototype} */ {

    _name: "TextProcessor",


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} text
     */
    process: function(text) {
        
    }
});



BugFs.readFile(filePath, "utf8", function(throwable, data) {

});