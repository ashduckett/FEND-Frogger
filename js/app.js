var Sprite = function(spriteURL, x, y, width, height, collisionBB) {
    this.sprite = spriteURL;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // If there is a collision box passed in, use it, otherwise make one based on sprite dimensions
    if(collisionBB != null && collisionBB instanceof Rect) {
        this.collisionBB = collisionBB;
    } else {
        this.collisionBB = new Rect(0, 0, width, height);
    }
};

Sprite.prototype.getScreenPosCollisionRect = function() {
    var top = this.y + this.collisionBB.y;
    var bottom = this.y + this.collisionBB.y + this.collisionBB.height;
    var left = this.x + this.collisionBB.x;
    var right = this.x + this.collisionBB.x + this.collisionBB.width;

    return new Rect(left, top, right - left, bottom - top);
};


Sprite.prototype.isCollidingWith = function(anotherSprite) {
    var rect1 = this.getScreenPosCollisionRect();
    var rect2 = anotherSprite.getScreenPosCollisionRect();

    // This method of collision detection looks for gaps. It's much faster than some ways of doing it. Found it on mozilla's game dev site
    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y) {
        return true;
    }
    return false;

};

// Collision box is specified relative to current image
var Character = function(spriteURL, x, y, width, height, collisionBB) {
    Sprite.call(this, spriteURL, x, y, width, height, collisionBB);

    // A place to store the last place a character was positioned specifically on a tile
    this.lastXTileSet = null;
    this.lastYTileSet = null;
};

Character.prototype = Object.create(Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.moveToTile = function(tileX, tileY, extraXOffset, extraYOffset) {
    var characterYOffset = 83;
    var characterXOffset = 101;

    // If this is the Player then 0 should be the minimum x tile
    var minXTile = this instanceof Player ? 0 : -1;

    if(tileX >= minXTile && tileX <= 4 && tileY >= 0 && tileY <= 5) {
            // Y gets 30 taken away for cosmetic reasons
            this.y = (characterYOffset * tileY) - 30;
            this.x = characterXOffset * tileX;

            this.lastYTileSet = tileY;
            this.lastXTileSet = tileX;
    }
};


Character.prototype.render = function() {

// Put this somewhere better!///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //ctx.font = "20px Georgia";
    //    ctx.fillText("Score: ", 10, 10);// + score, 0, 0);

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};




// Enemies our player must avoid
var Enemy = function(sprite, x, y, width, height, startingRow, speed, collisionBoundingBox) {
    Character.call(this, sprite, x, y, width, height, collisionBoundingBox);
    this.moveToTile(-1, startingRow);
    this.startingRow = startingRow;
    
    var speed = MathsUtils.getRandomInt(1, 3);

    this.speed = speed * 100;

    // Add an emitter to each enemy
    this.emitter = new Emitter(x - 10, y + 100, 2);

    // If the enemy is moving at its fastest, emit the smoke
    if(this.speed == 300) {
        this.emitter.start();
    }
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    if(this.hasFinishedRun()) {

        var speed = MathsUtils.getRandomInt(1, 3);
        this.speed = speed * 100;

        this.moveToTile(-1, this.startingRow);

        if(this.speed == 300) {
            this.emitter.start();
        } else {
            this.emitter.stop();
        }
    }

    this.emitter.setPos(this.x - 10, this.y + 100);
};

Enemy.prototype.hasFinishedRun = function() {
    return this.x > ctx.canvas.width;
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(sprite, x, y, width, height, collisionBB) {
    Character.call(this, sprite, x, y, width, height, collisionBB);
    this.score = 0;
    // If not enough information is set, move the character to the 
    // starting position
    if(!x || !y) {
        this.moveToTile(2, 5);
    }

    var context = this;

    this.winAnimationTimer = new Timer(function() {

            var curFrame = context.winAnimationTimer.currentFrame;

            if(curFrame == 1 || curFrame == 3) {
                context.y += 10;
            } else {
                context.y -= 10;
            }
    }, 250, 4, false, function() {
        context.moveToTile(2, 5);
        context.score += 10;
    });

};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;




Player.prototype.getScore = function() {
    return this.score;
};

Player.prototype.update = function() {
    var collisionFound = false;
    var winFound = false;

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

    // Check for win
    var context = this; // do this with bind later
    

    if(this.lastYTileSet == 0) {
        this.winAnimationTimer.start();

    }
};

// Object Type to:
    // Store frame limit, when should it stop? Logic for each interval. currentFrame.
    // How can i include the isJumpingForWin and hasStarted booleans?


Player.prototype.handleInput = function(keypressed) {
    // Keypressed is a string and describes direction
    this.move(keypressed);
};

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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemyCollisionBB = new Rect(0, 77, 100, 65);
var bug1 = new Enemy('images/enemy-bug.png', 50, 50, 101, 171, 1, 100, enemyCollisionBB);
var bug2 = new Enemy('images/enemy-bug.png', 50, 50, 101, 171, 2, 200, enemyCollisionBB);
var bug3 = new Enemy('images/enemy-bug.png', 50, 50, 101, 171, 3, 300, enemyCollisionBB);

var allEnemies = [bug1, bug2, bug3];

// If we specify a bounding box relative to the image itself we should be able
// to pass it in


var playerBoundingBox = new Rect(35, 120, 30, 20);
var player = new Player('images/char-boy.png', 0, 0, 101, 171, playerBoundingBox);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
