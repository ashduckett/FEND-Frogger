// A super type to represent all sprite types
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

// Get an absolute screen position of the collision bounding box
Sprite.prototype.getScreenPosCollisionRect = function() {
    var top = this.y + this.collisionBB.y;
    var bottom = this.y + this.collisionBB.y + this.collisionBB.height;
    var left = this.x + this.collisionBB.x;
    var right = this.x + this.collisionBB.x + this.collisionBB.width;

    return new Rect(left, top, right - left, bottom - top);
};

// Find out if there's a collision going on
Sprite.prototype.isCollidingWith = function(anotherSprite) {
    var rect1 = this.getScreenPosCollisionRect();
    var rect2 = anotherSprite.getScreenPosCollisionRect();

    // This method of collision detection looks for gaps. It's much faster than some ways of doing it. Found it on mozilla's game dev site
    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y) {
        return true;
    }
    return false;

};

// Draw based on sprite set earlier.
Sprite.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};