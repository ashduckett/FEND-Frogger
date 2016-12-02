function Particle(startX, startY, spriteURL, spriteWidth, spriteHeight) {

    // Set a starting position
    this.x = startX;
    this.y = startY;
    
    // Give a random velocity in the right general direction
    this.vx = MathsUtils.getRandomFloat(-3, -1);
    this.vy = MathsUtils.getRandomFloat(-1, 0);

    // Any angle will do to start with
    this.angle = MathsUtils.getRandomInt(0, 360);
    
    // The width and height of the sprite
    this.width = spriteWidth;
    this.height = spriteHeight;

    // No gravity as we're modelling smoke
    this.gravity = 0;

    // Start the life from zero. It will increase by one each frame
    this.life = 0;

    // Give a random maximum life
    this.maxLife = Math.random() * 30 + 50;
  
    // Create the image object used for each particle
    this.image = new Image();
    this.image.src = spriteURL
    
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

    // If there is any gravity, it should be applied
    this.vy += this.gravity;

    // Age this particle
    this.life++;

    // Apply velocity for this tick
    this.x += this.vx;
    this.y += this.vy;

    // Rotate the particle
    this.angle += 4;

    // Grow the particle
    this.scalePercent += 0.05;

    // Fade out the particle with each frame
    if(this.opacity > 0) {
        this.opacity -= 0.02;
    }

    // Ensure we don't get into the minuses because that would
    // mean the particle is visible again
    if(this.opacity < 0) {
        this.opacity = 0;
    }
};

var Emitter = function(startX, startY, noOfParticlesSpawnEachFrame, spriteURL, spriteWidth, spriteHeight) {

    // Starting position from where particles will be emitted
    this.startX = startX;
    this.startY = startY;

    this.spriteURL = spriteURL;

    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;

    // Initially nothing will be emitted
    this.running = false;

    // The number of particles to spawn on each frame
    this.noOfParticlesSpawnEachFrame = noOfParticlesSpawnEachFrame;

    // A particle pool
    this.particles = [];
};

// Allows the repositioning of the emitter
Emitter.prototype.setPos = function(xPos, yPos) {
    this.startX = xPos;
    this.startY = yPos;
};

// Start the emitter
Emitter.prototype.start = function() {
    this.running = true;
}

// Stop the emitter
Emitter.prototype.stop = function() {
    this.running = false;
}

Emitter.prototype.render = function() {
    
    // Draw each particle this tick
    this.particles.forEach(function(particle) {
        particle.draw();
    });
};

Emitter.prototype.update = function() {

    // If the emitter is running...
    if(this.running == true) {

        // Create a number of particles for this tick
        // and store them so they can be manipulated later
        for(var i = 0; i < this.noOfParticlesSpawnEachFrame; i++) {
            this.particles.push(new Particle(this.startX, this.startY, this.spriteURL, this.spriteWidth, this.spriteHeight));
        }
    }
    var context = this;
    // Update each particle for this tick
    this.particles.forEach(function(particle, index) {
        particle.update();

        // If the particle has been around too long,
        // remove it        
        if(particle.life > particle.maxLife) {

            // Calling delete on particle would have no effect
            // and caused game to slow
            delete context.particles[index];   
        }
    });
};
