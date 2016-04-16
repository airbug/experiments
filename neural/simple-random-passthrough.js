var bugcortex               = require('bugcortex');
var bugcore                 = require('bugcore');

var Flows                   = bugcore.Flows;
var RandomUtil              = bugcore.RandomUtil;

var HighLowConstantLayer    = bugcortex.HighLowConstantLayer;
var NeuralNetwork           = bugcortex.NeuralNetwork;
var IntegerInputLayer       = bugcortex.IntegerInputLayer;
var IntegerOutputLayer      = bugcortex.IntegerOutputLayer;

var neuralNetwork           = new NeuralNetwork();
var integerInputLayer       = new IntegerInputLayer();
var integerOutputLayer      = new IntegerOutputLayer();
var highLowConstantLayer    = new HighLowConstantLayer();


var $series                 = Flows.$series;
var $whileParallel          = Flows.$whileParallel;
var $whileSeries            = Flows.$whileSeries;


neuralNetwork.addConstantLayer(highLowConstantLayer);
neuralNetwork.addInputLayer("input", integerInputLayer);
neuralNetwork.addOutputLayer("output", integerOutputLayer);
integerOutputLayer.addSubLayer(integerInputLayer);
integerOutputLayer.addSubLayer(highLowConstantLayer);


var numberSolved = 0;
var recordedData = [];
neuralNetwork.addEventListener(NeuralNetwork.EventTypes.OUTPUT_VALUE, function(event) {
    var name    = event.getData().name;
    var value   = event.getData().value;
    var tick    = event.getData().tick;
    var expectedValue = recordedData[tick].outputs.output;
    console.log("Output value - name:", name, " tick:", tick, " value:", value, " expectedValue:", expectedValue);

    if (expectedValue === value) {
        numberSolved++;
    } else {
        numberSolved = 0;
    }
});

var tick = 0;
$whileParallel(function(flow) {
    //NOTE BRN: This makes sure that the program runs async
    setTimeout(function() {
        flow.assert(numberSolved < 10);
    }, 0);
}, function(callback) {
    var randomNumber = RandomUtil.randomBetween(0, 15);
    var trainingData =  {
        inputs: {
            input: randomNumber
        },
        outputs: {
            output: randomNumber
        }
    };
    recordedData.push(trainingData);
    console.log("Train network - tick:", tick, " trainingData:", trainingData);
    tick++;
    neuralNetwork.trainNetwork(trainingData, function(throwable) {
        callback(throwable);
    });
}).execute(function(throwable) {
    if (throwable) {
        console.log("Error occurred:", throwable);
        process.exit(1);
    }
});