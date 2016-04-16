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

neuralNetwork.addEventListener(NeuralNetwork.EventTypes.OUTPUT_VALUE, function(event) {
    var name    = event.getData().name;
    var value   = event.getData().value;
    var tick    = event.getData().tick;
    console.log("Output value - name:", name, " tick:", tick, " value:", value);
});

var trainData = [
    {
        inputs: {
            input: 0
        },
        outputs: {
            output: 0
        }
    },
    {
        inputs: {
            input: 1
        },
        outputs: {
            output: 1
        }
    },
    {
        inputs: {
            input: 2
        },
        outputs: {
            output: 2
        }
    },
    {
        inputs: {
            input: 3
        },
        outputs: {
            output: 3
        }
    },
    {
        inputs: {
            input: 4
        },
        outputs: {
            output: 4
        }
    },
    {
        inputs: {
            input: 5
        },
        outputs: {
            output: 5
        }
    },
    {
        inputs: {
            input: 6
        },
        outputs: {
            output: 6
        }
    },
    {
        inputs: {
            input: 7
        },
        outputs: {
            output: 7
        }
    },
    {
        inputs: {
            input: 0
        },
        outputs: {
            output: 0
        }
    },
    {
        inputs: {
            input: 1
        },
        outputs: {
            output: 1
        }
    },
    {
        inputs: {
            input: 2
        },
        outputs: {
            output: 2
        }
    },
    {
        inputs: {
            input: 3
        },
        outputs: {
            output: 3
        }
    },
    {
        inputs: {
            input: 4
        },
        outputs: {
            output: 4
        }
    },
    {
        inputs: {
            input: 5
        },
        outputs: {
            output: 5
        }
    },
    {
        inputs: {
            input: 6
        },
        outputs: {
            output: 6
        }
    },
    {
        inputs: {
            input: 7
        },
        outputs: {
            output: 7
        }
    },
    {
        inputs: {
            input: 0
        },
        outputs: {
            output: 0
        }
    },
    {
        inputs: {
            input: 1
        },
        outputs: {
            output: 1
        }
    },
    {
        inputs: {
            input: 2
        },
        outputs: {
            output: 2
        }
    },
    {
        inputs: {
            input: 3
        },
        outputs: {
            output: 3
        }
    },
    {
        inputs: {
            input: 4
        },
        outputs: {
            output: 4
        }
    },
    {
        inputs: {
            input: 5
        },
        outputs: {
            output: 5
        }
    },
    {
        inputs: {
            input: 6
        },
        outputs: {
            output: 6
        }
    },
    {
        inputs: {
            input: 7
        },
        outputs: {
            output: 7
        }
    },
    {
        inputs: {
            input: 0
        },
        outputs: {
            output: 0
        }
    },
    {
        inputs: {
            input: 1
        },
        outputs: {
            output: 1
        }
    },
    {
        inputs: {
            input: 2
        },
        outputs: {
            output: 2
        }
    },
    {
        inputs: {
            input: 3
        },
        outputs: {
            output: 3
        }
    },
    {
        inputs: {
            input: 4
        },
        outputs: {
            output: 4
        }
    },
    {
        inputs: {
            input: 5
        },
        outputs: {
            output: 5
        }
    },
    {
        inputs: {
            input: 6
        },
        outputs: {
            output: 6
        }
    },
    {
        inputs: {
            input: 7
        },
        outputs: {
            output: 7
        }
    }
];

var inputData = [
    {
        inputs: {
            input: 0
        }
    },
    {
        inputs: {
            input: 1
        }
    },
    {
        inputs: {
            input: 2
        }
    },
    {
        inputs: {
            input: 3
        }
    },
    {
        inputs: {
            input: 4
        }
    },
    {
        inputs: {
            input: 5
        }
    },
    {
        inputs: {
            input: 6
        }
    },
    {
        inputs: {
            input: 7
        }
    }
];


//TODO BRN: Test this in parallel (is designed to work that way)
var size    = trainData.length;
var i       = 0;
var trainDataEntry = trainData[i];
var trainNetwork = function(trainDataEntry) {
    console.log("Train network with ", trainDataEntry);
    neuralNetwork.trainNetwork(trainDataEntry, function(throwable) {
        if (!throwable) {
            i++;
            if (i < size) {
                trainNetwork(trainData[i]);
            } else {
                for (var j = 0, sizej = inputData.length; j < sizej; j++) {
                    var inputDataEntry = inputData[j];
                    console.log("Input network with ", inputDataEntry);
                    neuralNetwork.inputNetwork(inputDataEntry);
                }
            }
        } else {
            console.log("Error occurred:", throwable);
            process.exit(1);
        }
    });
};
trainNetwork(trainDataEntry);

var numberSolved = 0;
$whileParallel(function() {
    return numberSolved < 10;
}, function(callback) {
    var randomNumber = RandomUtil.randomBetween(0, 15);
    var data =  {
        inputs: {
            input: randomNumber
        },
        outputs: {
            output: randomNumber
        }
    };
    neuralNetwork.trainNetwork(trainDataEntry, function(throwable) {
        if (!throwable) {
            i++;
            if (i < size) {
                trainNetwork(trainData[i]);
            } else {
                for (var j = 0, sizej = inputData.length; j < sizej; j++) {
                    var inputDataEntry = inputData[j];
                    console.log("Input network with ", inputDataEntry);
                    neuralNetwork.inputNetwork(inputDataEntry);
                }
            }
        } else {

        }
    });
}).execute(function(throwable) {
    if (throwable) {
        console.log("Error occurred:", throwable);
        process.exit(1);
    }
});