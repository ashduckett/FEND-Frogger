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

Timer.prototype.start = function() {
    var context = this;

    if(this.isRunningCallback == false) {
        context.isRunningCallback = true;
        var interval = setInterval(function() {
            context.callback();

            if(context.currentFrame == context.noOfFrames) {
                clearInterval(interval);
                context.isRunningCallback = false;
                context.finished();
                context.currentFrame = 0;
            } else {
                context.currentFrame++;
            }
        }, context.interval);
    }

    this.started = true;
};