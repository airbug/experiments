var ssh2        = require('ssh2');
var bugcore     = require('bugcore');
var bugflow     = require('bugflow');

var $forEachParallel    = bugflow.$forEachParallel;

var servers = [
    {
        host: 'ec2-54-242-89-124.compute-1.amazonaws.com',
        port: 22,
        username: 'ec2-user',
        privateKey: require('fs').readFileSync('/Users/brianneisler/.ssh/airbug-worker-us-east-1a.pem')
    },
    {
        host: 'ec2-54-237-58-17.compute-1.amazonaws.com',
        port: 22,
        username: 'ec2-user',
        privateKey: require('fs').readFileSync('/Users/brianneisler/.ssh/airbug-application-us-east-1a.pem')
    },
    {
        host: 'ec2-54-224-205-45.compute-1.amazonaws.com',
        port: 22,
        username: 'ec2-user',
        privateKey: require('fs').readFileSync('/Users/brianneisler/.ssh/splash-database.pem')
    },
    {
        host: 'ec2-54-221-129-227.compute-1.amazonaws.com',
        port: 22,
        username: 'ec2-user',
        privateKey: require('fs').readFileSync('/Users/brianneisler/.ssh/splash-application.pem')
    },
    {
        host: 'ec2-54-225-239-36.compute-1.amazonaws.com',
        port: 22,
        username: 'ec2-user',
        privateKey: require('fs').readFileSync('/Users/brianneisler/.ssh/airbug-balancer-us-east-1a.pem')
    }
];


console.log("Good morning...");

console.log("Preparing to update servers");

$forEachParallel(servers, function(flow, server) {
    var conn = new ssh2();
    conn.on('ready', function() {
        console.log('Connection :: ready');
        conn.exec('sudo yum update -y', {pty: true}, function(err, stream) {
            if (err) {
                return flow.error(err);
            }
            stream.on('exit', function(code, signal) {
                console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
            }).on('close', function() {
                console.log('Stream :: close');
                conn.end();
                flow.complete();
            }).on('data', function(data) {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', function(data) {
                console.log('STDERR: ' + data);
            });
        });
    }).connect(server);
}).execute(function(throwable) {
    if (throwable) {
        console.log("Error occurred during update");
        console.log(throwable.message);
        console.log(throwable.stack);
        process.exit(1);
    }
});

