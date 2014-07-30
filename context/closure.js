var context = {};
(function() {
    var aTest = "aTest";
    context.build = function() {
        console.log(bTest);
    };
})();

(function() {
    var bTest = "bTest";
    context.build();
})();
