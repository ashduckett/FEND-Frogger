function Particle(startX, startY) {

    // Set a starting position
    this.x = startX;
    this.y = startY;
    
    // Give a random velocity in the right general direction
    this.vx = MathsUtils.getRandomFloat(-3, -1);
    this.vy = MathsUtils.getRandomFloat(-1, 0);

    // Any angle will do to start with
    this.angle = MathsUtils.getRandomInt(0, 360);
    this.width = 32;
    this.height = 32;

    // No gravity as we're modelling smoke
    this.gravity = 0;

    // Start the life from zero. It will increase by one each frame
    this.life = 0;

    // Give a random maximum life
    this.maxLife = Math.random() * 30 + 50;
  
    // Create the image object used for each particle
    this.image = new Image();
    this.image.src = "images/smoke.png";
    
    // Start out with full visibility
    this.opacity = 1;

    // Start out small
    this.scalePercent = 0.1;
}

Particle.prototype.draw = function() {

    // Store the current setup whilst we fiddle around with the
    // origin to perform rotation and scaling on the sprite
    ctx.save();

    // Move the origin to the center of the current image
    ctx.translate(this.x, this.y);
    ctx.translate(this.width / 2, this.height / 2);

    // Scale by a given factor
    ctx.scale(this.scalePercent, this.scalePercent);
    
    // Do the rotation
    ctx.rotate(this.angle * Math.PI / 180);

    // Give the appropriate opacity
    ctx.globalAlpha = this.opacity;

    // Render the image
    ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
    ctx.restore();
};

Particle.prototype.update = function() {
    this.vy += this.gravity;

    this.life++;

    this.x += this.vx;
    this.y += this.vy;

    this.angle += 4;
    this.scalePercent += 0.05;

    // Fade out the particle with each frame. This would be done in
    // update
    if(this.opacity > 0) {
        this.opacity -= 0.02;
    }

    // Ensure we don't get into the minuses because that would
    // mean the particle is visible again
    if(this.opacity < 0) {
        this.opacity = 0;
    }
};

// What should this control? 
    // Start position   DONE
    // general position DONE
    // A way to start the system

var Emitter = function(startX, startY, noOfParticlesSpawnEachFrame) {

    // Starting position from where particles will be emitted
    this.startX = startX;
    this.startY = startY;

    // Initially nothing will be emitted
    this.running = false;

    // The number of particles to spawn on each frame
    this.noOfParticlesSpawnEachFrame = noOfParticlesSpawnEachFrame;

    // Somewhere to store the emitter's particles
    this.particles = {};
};

// Each particle will be given an index which will serve as an id
Emitter.particleIndex = 0;

// Allows the repositioning of the emitter
Emitter.prototype.setPos = function(xPos, yPos) {
    this.startX = xPos;
    this.startY = yPos;
};

Emitter.prototype.start = function() {
    this.running = true;
}

Emitter.prototype.stop = function() {
    this.running = false;
}

Emitter.prototype.render = function() {
    if(this.running == true) {
        for(var i = 0; i < this.noOfParticlesSpawnEachFrame; i++) {
            var particleIndex = Emitter.particleIndex++;
            this.particles[particleIndex] = new Particle(this.startX, this.startY);
            this.particles[particleIndex].id = particleIndex;
        }
    }

    // outside of here?
    this.updateParticles();
    this.renderParticles();


    for(var i in this.particles) {

        // If this particle has hit the end of the line, delete it
        if(this.particles[i].life > this.particles[i].maxLife) {
            delete this.particles[i];   
        }
    }
};

Emitter.prototype.updateParticles = function() {
    for(var i in this.particles) {
        this.particles[i].update();
    }
};

Emitter.prototype.renderParticles = function() {

    for(var i in this.particles) {
        this.particles[i].draw();
    }
};
