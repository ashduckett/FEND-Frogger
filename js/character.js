
// A type to represent characters on the screen
var Character = function(spriteURL, x, y, width, height, collisionBB) {
    Sprite.call(this, spriteURL, x, y, width, height, collisionBB);

    // A place to store the last place a character was positioned specifically on a tile
    this.lastXTileSet = null;
    this.lastYTileSet = null;
};

// Generic inheritance stuff
Character.prototype = Object.create(Sprite.prototype);
Character.prototype.constructor = Character;

// A function specific to characters, although it could have gone into sprite, but 
// I wanted to keep sprite less specific to the grid
Character.prototype.moveToTile = function(tileX, tileY, extraXOffset, extraYOffset) {
    var characterYOffset = 83;
    var characterXOffset = 101;

    // Foolish code. Never check the type of a subclass in a super class!
    // Allows enemies to be placed off screen
    var minXTile = this instanceof Player ? 0 : -1;

    if(tileX >= minXTile && tileX <= 4 && tileY >= 0 && tileY <= 5) {
            // Y gets 30 taken away for cosmetic reasons
            this.y = (characterYOffset * tileY) - 30;
            this.x = characterXOffset * tileX;

            this.lastYTileSet = tileY;
            this.lastXTileSet = tileX;
    }
};