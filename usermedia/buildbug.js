/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject = buildbug.buildProject;
var buildProperties = buildbug.buildProperties;
var buildTarget = buildbug.buildTarget;
var enableModule = buildbug.enableModule;
var parallel = buildbug.parallel;
var series = buildbug.series;
var targetTask = buildbug.targetTask;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var aws = enableModule("aws");
var bugpack = enableModule('bugpack');
var bugunit = enableModule('bugunit');
var clientjs = enableModule('clientjs');
var core = enableModule('core');
var nodejs = enableModule('nodejs');


//-------------------------------------------------------------------------------
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    server: {
        packageJson: {
            name: "usermedia",
            version: "0.0.1",
            dependencies: {
                bugpack: "0.2.0",
                express: "3.2.x",
                binaryjs: "0.2.x"
            },
            scripts: {
                start: "node ./scripts/usermedia-application-start.js"
            }
        },
        sourcePaths: [
            "./js/src",
            "../../bugapp/libraries/bugapp/js/src",
            '../../bugcore/libraries/bugcore/js/src',
            '../../bugfs/libraries/bugfs/js/src',
            '../../bugioc/libraries/bugioc/js/src',
            '../../bugjs/projects/express/js/src',
            '../../bugmeta/libraries/bugmeta/js/src'
        ],
        scriptPaths: [
            "./js/scripts"
        ],
        staticPaths: [
            "./static"
        ],
        unitTest: {
            sourcePaths: [
                "../../buganno/projects/buganno/js/src",
                "../../bugunit/projects/bugdouble/js/src",
                "../../bugunit/projects/bugunit/js/src",
                "../../bugyarn/libraries/bugyarn/js/src"
            ],
            scriptPaths: [
                "../../buganno/projects/buganno/js/scripts",
                "../../bugunit/projects/bugunit/js/scripts"
            ],
            testPaths: [
                "../../bugcore/libraries/bugcore/js/test"
            ]
        }
    }
});


//-------------------------------------------------------------------------------
// Declare Tasks
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Declare Flows
//-------------------------------------------------------------------------------

// Clean Flow
//-------------------------------------------------------------------------------

buildTarget('clean').buildFlow(
    targetTask('clean')
);


// Local Flow
//-------------------------------------------------------------------------------

//TODO BRN: Local development of node js and client side projects should "create" the packages and package them up but
// the sources should be symlinked to instead

buildTarget('local').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        parallel([
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("server.packageJson"),
                        packagePaths: {
                            "./lib": buildProject.getProperty("server.sourcePaths").concat(
                                buildProject.getProperty("server.unitTest.sourcePaths")
                            ),
                            "./scripts": buildProject.getProperty("server.scriptPaths").concat(
                                buildProject.getProperty("server.unitTest.scriptPaths")
                            ),
                            "./test": buildProject.getProperty("server.unitTest.testPaths"),

                            //TODO BRN: This is temporary until we get client js packages working.

                            "./static": buildProject.getProperty("server.staticPaths")
                        }
                    }
                }),
                parallel([
                    targetTask('generateBugPackRegistry', {
                        init: function(task, buildProject, properties) {
                            var nodePackage = nodejs.findNodePackage(
                                buildProject.getProperty("server.packageJson.name"),
                                buildProject.getProperty("server.packageJson.version")
                            );
                            task.updateProperties({
                                sourceRoot: nodePackage.getBuildPath(),
                                ignore: ["static"]
                            });
                        }
                    })
                ]),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("server.packageJson.name"),
                        packageVersion: buildProject.getProperty("server.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("server.packageJson.name"),
                            buildProject.getProperty("server.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath()
                        });
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("server.packageJson.name"),
                            buildProject.getProperty("server.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {
                                acl: 'public-read'
                            }
                        });
                    },
                    properties: {
                        bucket: buildProject.getProperty("local-bucket")
                    }
                })
            ])
        ])
    ])
).makeDefault();

