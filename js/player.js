
// This type is a subctype of Character. It represents the player
// on the screen and is a Sprite
var Player = function(sprite, x, y, width, height, collisionBB) {
    // Get Character's properties and set up
    Character.call(this, sprite, x, y, width, height, collisionBB);
    
    // Initialise score
    this.score = 0;

    // If not enough information is set, move the character to the 
    // starting position - I do this for convenience
    if(!x || !y) {
        this.moveToTile(2, 5);
    }

    // Keep a reference to the this reference so it can
    // be used within the timer's callback below
    var context = this;

    // See timer.js for how this works in full.
    // Runs the callback four times
    this.winAnimationTimer = new Timer(function() {

            var curFrame = context.winAnimationTimer.currentFrame;

            // Every other frame, move the character up
            if(curFrame == 1 || curFrame == 3) {
                context.y += 10;
            // Move it down for the other frames    
            } else {
                context.y -= 10;
            }

    // Each frame lasts 250 millisecons,
    // there are four frames, and I set it
    // not to repeat
    }, 250, 4, false, function() {  
        // At the end of the animation, move back to start
        // and increment score by ten
        context.moveToTile(2, 5);
        context.score += 10;
    });

};

// Rest of inheritance stuff
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.getScore = function() {
    return this.score;
};

Player.prototype.update = function() {
    var collisionFound = false;

    // Use regular for loop so we can break out early if apt
    for(var i = 0; i < allEnemies.length; i++) {
        if(this.isCollidingWith(allEnemies[i])) {
            collisionFound = true;
            break;
        }
    }

    // If there was a collision, send player back to starting position
    if(collisionFound == true) {
        this.moveToTile(2, 5);
    }
   
    // If we've got to the water, start the player
    // jumping
    if(this.lastYTileSet == 0) {
        this.winAnimationTimer.start();

    }
};

// Deal with key presses by passing them to the move
// function so it can react
Player.prototype.handleInput = function(keypressed) {
    
    // Keypressed is a string and describes direction
    this.move(keypressed);
};

// Move character appropriately based on key press
Player.prototype.move = function(direction) {

    switch(direction) {
        case 'right':
            this.moveToTile(this.lastXTileSet + 1, this.lastYTileSet);
            break;
        case 'left':
            this.moveToTile(this.lastXTileSet - 1, this.lastYTileSet);
            break;
        case 'up':
            this.moveToTile(this.lastXTileSet, this.lastYTileSet - 1);
            break;
        case 'down':
            this.moveToTile(this.lastXTileSet, this.lastYTileSet + 1);
            break;
        default:
            break;
    }
};