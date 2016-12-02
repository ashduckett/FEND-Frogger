// Enemies our player must avoid
var Enemy = function(sprite, x, y, width, height, startingRow, speed, collisionBoundingBox) {

    // A subtype of the Character type, so also a sprite
    Character.call(this, sprite, x, y, width, height, collisionBoundingBox);

    // Initially, enemies should be off the screen to the left
    this.moveToTile(-1, startingRow);

    // Store the row of the grid that they will be on
    this.startingRow = startingRow;
    
    // One of three speeds set
    var speed = MathsUtils.getRandomInt(1, 3);
    this.speed = speed * 100;

    // Add an emitter to each enemy
    // The emitter will be positioned relative to the enemy,
    // x and y specified first, below, then a sprite given for each particle,
    // and the sprite's dimensions
    this.emitter = new Emitter(x - 10, y + 100, 2, 'images/smoke.png', 32, 32);

    // If the enemy is moving at its fastest, emit the smoke
    if(this.speed == 300) {
        this.emitter.start();
    }
};

// Generic inheritance stuff
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // If the enemy has reached the end of its run
    if(this.hasFinishedRun()) {

        // Set the speed to something random again
        var speed = MathsUtils.getRandomInt(1, 3);
        this.speed = speed * 100;

        // Move back to the start
        this.moveToTile(-1, this.startingRow);

        // If we're running at full speed, start emitting smoke
        if(this.speed == 300) {
            this.emitter.start();
        } else {
            this.emitter.stop();
        }
    }

    // Position the emitter relative to the image start position
    this.emitter.setPos(this.x - 10, this.y + 100);
};

// Indicates that the enemy has hit the end
Enemy.prototype.hasFinishedRun = function() {
    return this.x > ctx.canvas.width;
};

// Overriding render method
Enemy.prototype.render = function() {

    // Render the enemy's smoke (specialised behaviour)
    this.emitter.render();

    // Render the enemy (universal behaviour from Sprite)
    Sprite.prototype.render.call(this);
};