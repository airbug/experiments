module.exports = {
    context: function(space, contextMethod) {
        space = space || global;
        space.someMethod = function() {
            console.log("made it");
        };
        contextMethod.call(space);
    }
};
