require('./context.js').context(function() {
    someMethod();
    throw new Error("Crap!");
});

