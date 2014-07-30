/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Require('usermedia.UserMediaServerApplication')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context(module);


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var UserMediaServerApplication = bugpack.require('usermedia.UserMediaServerApplication');


//-------------------------------------------------------------------------------
// Bootstrap
//-------------------------------------------------------------------------------

var userMediaServerApplication = new UserMediaServerApplication();
userMediaServerApplication.start(function(error){
    console.log("Starting UserMedia server...");
    if (!error){
        console.log("UserMedia successfully started");
    } else {
        console.error(error);
        console.error(error.stack);
        process.exit(1);
    }
});
