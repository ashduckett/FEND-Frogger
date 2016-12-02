// A type to time things at specific intervals
// Arguments: callback - The method to run at set intervals
//            interval - The interval at which to run callback
//            noOfFrames - Number of times to run callback
//            startNow - Should the timer start now?
//            finished - A callback to run at the end of a frame.
var Timer = function(callback, interval, noOfFrames, startNow, finished) {
    this.started = false;
    this.isRunningCallback = false;
    this.callback = callback;
    this.noOfFrames = noOfFrames;
    this.currentFrame = 0;
    this.interval = interval;
    this.finished = finished;

    if(startNow) {
        this.start();
    }
};

// Start the timer
Timer.prototype.start = function() {
    var context = this;

    // If the timer isn't currently running
    if(this.isRunningCallback == false) {

        // Store the fact that it is, so we don't overlap runs
        context.isRunningCallback = true;
        // Start the run
        var interval = setInterval(function() {
            // Call the passed in function
            context.callback();

            // If we've reached the end of the line...
            if(context.currentFrame == context.noOfFrames) {

                // Stop the timer
                clearInterval(interval);

                // Store that we're no longer running
                context.isRunningCallback = false;

                // Call the finished callback
                context.finished();

                // Reset the current frame
                context.currentFrame = 0;
            } else {

                // Otherwise, increment current frame
                context.currentFrame++;
            }
        }, context.interval);
    }

    // Store that it's started
    this.started = true;
};