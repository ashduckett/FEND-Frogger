

// You need to
    // Sort out the character going off screen
    // Sort out the bug starting position
    // Sort out collisions. Could be a method on Character


// Collisions need to use a bounding box. That way I can select which parts should be colliding with which.

// Let's start with a rectangle class.
// Remember that this needs to be updated as the sprite moves.
// Start by setting it up when the sprite first appears


// Constructed relative to an image's position
var Rect = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}; 

// Collision box is specified relative to current image
var Character = function(spriteURL, x, y, width, height, collisionBB) {
    this.sprite = spriteURL;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // A place to store the last place a character was positioned specifically on a tile
    this.lastXTileSet = null;
    this.lastYTileSet = null;

    // By default have MIGHT HAVE a collision rect around the whole sprite


    // If we have a bounding box, make it relative to the sprite
    
    
    if(collisionBB != null && collisionBB instanceof Rect) {
        this.collisionBB = collisionBB;
    }

};

/* Thinking about it, this isn't exactly what you wanted. Doing it this way,
it will pick up before the enemy's even started moving, so you need to rethink this */
Character.prototype.isOffCanvas = function() {

    var tooFarRight = this.x > ctx.canvas.width;
    var tooFarLeft = (this.x + this.width) < 0;
    var tooLow = this.y > ctx.canvas.height;
    var tooHigh = (this.y + this.height) > 0;

  //  console.log(tooFarRight || tooFarLeft || tooHigh || tooLow);
    return tooFarRight;// || tooFarLeft || tooHigh || tooLow;
};


// Note that this is kind of specialised for the player and 
// not the enemy at the moment since an offset is added to move
// the sprite up and variables need to be renamed

// This method may be less important if we change from moving from
// tile to tile, which I think might be good...
Character.prototype.moveToTile = function(tileX, tileY, extraXOffset, extraYOffset) {
    var canvasHeight = 606;
    var canvasWidth = 505;
 
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

var Point = function(x, y) {
    this.x = x;
    this.y = y;
};


// Make this all nice and neat. Also for rendering the boundingboxes figure out
// Maybe a Point class?
Character.prototype.isCollidingWith = function(anotherSprite) {
    // this is Player

    var topLeftIn = false;
    var bottomLeftIn = false;
    var topRightIn = false;
    var bottomRightIn = false;

// start new code - build up the screen coordinates of the collision box of the Player object. The this object.
    var topLeftCollisionPoint = new Point(this.x + this.collisionBB.x, this.y + this.collisionBB.y);
    var topRightCollisionPoint = new Point(this.x + this.collisionBB.x + this.collisionBB.width, this.y + this.collisionBB.y);
    var bottomLeftCollisionPoint = new Point(this.x + this.collisionBB.x, this.y + this.collisionBB.y + this.collisionBB.height);
    var bottomRightCollisionPoint = new Point(this.x + this.collisionBB.x + this.collisionBB.width, this.y + this.collisionBB.y + this.collisionBB.height);
// end new code

    // If the top left y coordinate is greater than
    var bbTop = anotherSprite.y + anotherSprite.collisionBB.y;
    var bbBottom = anotherSprite.y + anotherSprite.collisionBB.y + anotherSprite.collisionBB.height;
    var bbLeft = anotherSprite.x + anotherSprite.collisionBB.x;
    var bbRight = anotherSprite.x + anotherSprite.collisionBB.x + anotherSprite.collisionBB.width;

    if(topLeftCollisionPoint.y >= bbTop && topLeftCollisionPoint.y <= bbBottom && topLeftCollisionPoint.x >= bbLeft && topLeftCollisionPoint.x <= bbRight) {
        topLeftIn = true;
        console.log('collision! top left.');
    }

    // Should be working?
    if((bottomLeftCollisionPoint.y >= bbTop) && (bottomLeftCollisionPoint.y <= bbBottom) && (bottomLeftCollisionPoint.x >= bbLeft) && (bottomLeftCollisionPoint.x <= bbRight)) {
        bottomLeftIn = true;
        console.log('collision! bottom left.');
    }

   //  // Should be working
     if(topRightCollisionPoint.y >= bbTop && topRightCollisionPoint.y <= bbBottom && topRightCollisionPoint.x >= bbLeft && topRightCollisionPoint.x <= bbRight) {
         console.log('collision! top right.');
         topRightIn = true;
     }

     if(bottomRightCollisionPoint.y >= bbTop && bottomRightCollisionPoint.y <= bbBottom && bottomRightCollisionPoint.x >= bbLeft && bottomRightCollisionPoint.x <= bbRight) {
         console.log('collision! bottom right.');
         bottomRightIn = true;
     }
       
    
    return topLeftIn || bottomLeftIn || topRightIn || bottomRightIn;
};


var oldRect = null;

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
   
    if(this.collisionBB != null && this.collisionBB instanceof Rect) {

        // Without calling beginPath() each bounding box is rendered without removing the last
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.rect(this.x + this.collisionBB.x, this.y + this.collisionBB.y, this.collisionBB.width, this.collisionBB.height);
        
        ctx.stroke();

    }
};



// Enemies our player must avoid
var Enemy = function(sprite, x, y, width, height, startingRow, speed, collisionBoundingBox) {
    Character.call(this, sprite, x, y, width, height, collisionBoundingBox);
    this.moveToTile(-1, startingRow);
    this.startingRow = startingRow;
    this.speed = speed;
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
 
    if(this.isOffCanvas()) {
        this.moveToTile(-1, this.startingRow);
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// var Character = function(spriteURL, x, y, width, height, collisionBoundingBox) {
var Player = function(sprite, x, y, width, height, collisionBB) {
    Character.call(this, sprite, x, y, width, height, collisionBB);

   // console.log(x);

 //   var playerCollisionBB = new Rect(this.x + 35, this.y + 120, this.width - 70, this.height - 150);
   // this.collisionBB = playerCollisionBB;
    // If not enough information is set, move the character to the 
    // starting position
    if(!x || !y) {
        this.moveToTile(2, 5);
    }
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;



Player.prototype.update = function() {
    allEnemies.forEach(function(enemy) {
        if(this.isCollidingWith(enemy)) {
            console.log('collision!');
        }
    }, this);
};

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

var allEnemies = [bug1];//, bug2, bug3];

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
