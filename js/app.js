
// Create a bounding box for collision detection
var enemyCollisionBB = new Rect(0, 77, 100, 65);

// Create three bug enemies
var bug1 = new Enemy('images/enemy-bug.png', 50, 50, 101, 171, 1, 100, enemyCollisionBB);
var bug2 = new Enemy('images/enemy-bug.png', 50, 50, 101, 171, 2, 200, enemyCollisionBB);
var bug3 = new Enemy('images/enemy-bug.png', 50, 50, 101, 171, 3, 300, enemyCollisionBB);

// For reference from engine.js for rendering and updating
var allEnemies = [bug1, bug2, bug3];

// Create a bounding box for collision detection
var playerBoundingBox = new Rect(35, 120, 30, 20);

// Create one player
var player = new Player('images/char-boy.png', 0, 0, 101, 171, playerBoundingBox);

// Respond to keyboard events, informing the Player instance of the event
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
