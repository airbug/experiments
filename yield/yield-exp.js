var test = {
    wrappedYieldMethod: function() {
        var gen = test.yieldMethod();
        setTimeout(function() {
            console.log("async method");
            gen.next();
        }, 0);
    },
    yieldMethod: function() {
        yield 0;
    },
    asyncMethod: function() {
        test.wrappedYieldMethod();
    },
    syncMethod: function() {
        console.log("sync method");
    }
};

test.syncMethod();
test.asyncMethod();
test.syncMethod();

