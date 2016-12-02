
// Simple type used for rectangle information
var Rect = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};


(function() {

    // Obtains a random float between min and max
    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Obtains a random int between min and max
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }



    /* This object defines the publicly accessible functions available to
     * developers by creating a global MathsUtils object.
     */
    window.MathsUtils = {
        getRandomInt: getRandomInt,
        getRandomFloat: getRandomFloat
    };
})();
