//NOTE BRN: This works for context bug comes at the cost of losing all file path references in stack traces 

var myContext = {
    someMethod: function() {
        console.log("Made it!");
    }
};
module.exports = {
    context: function(contextualMethod) {
        with (myContext) {
            
            //This works (but we lose file names and lines in stack traces)
            //eval("(" + contextualMethod.toString() + ")();");

            //
            var myFunction = new Function("someMethod", "(" + contextualMethod.toString() + ")();");
            myFunction(myContext.someMethod);
        }
    }
};
