# Frogger

## How to play
Playing the game is very simple. You move the character from tile to tile using the arrow keys on your keyboard. The goal is to get your character, initially positioned to the center and at the bottom of the screen, from their starting position, and to the water. You must avoid the ladybirds or you'll be taken back to the starting point! Watch out particularly for the fastest variant of ladybird; they'll leave a trail of smoke behind!

## How to run
To run the game, you simply need to open the index.html file found in this repository. You need to make sure that this file has all of the correct directories so it can run properly and these include a css folder, an images folder and js folder containing the JavaScript.

## Files
### index.html
This file contains regular HTML template code with the inclusion of all the JavaScript files added to it to get things going.

### timer.js
This is something I've written to allow me to run code at regular intervals. It makes use of the setInterval function, but allows me to do various things on top of that such as ensuring the callback run by the timer isn't run when it's already running.

### maths.js
Probably an overly grand name for two functions and a simple type, this file contains two functions for generating random numbers and a `Rect` type specifically for things like creating bounding boxes for collision detection.

### resources.js
This is a file provided by Udacity. It makes loading image files much easier and includes optimisations such as making sure you don't load the same image twice.

### sprite.js
This is a JavaScript type that represents all sprites. Since it is a generic sprite type, it includes such things as the sprite's URL, its position, width and height and also takes care of things like collision detection. It's also here that the main rendering method lives for each derivative sprite.

### character.js
I question whether or not this file needs to exist. Only character sprites actually need the `moveToTile()` method so that's why it's here really, but it could have just as easily gone into the `Sprite` type's definition. Note the check for `Player` type in this method's implementation. _Very_ bad practice.

### enemy.js
This is the type that represents the ladybirds that you see on the screen. Note that it's a direct derivative of Character, and so is a sprite. Worth noting that each enemy has its own `Emitter` instance which is used to create the smoke effects when the enemy is moving at top speed.

### player.js
This is the type that represents the character on the screen that you move with the arrow keys. It's a very simple type that responds to input via its `move()` method. On each tick, it checks for collisions with enemies and checks to see if the player has won.

### particles.js
This was an experiment that I think worked well. You'll see smoke on the fastest ladybirds in the game and that's thanks to the `particles.js` file. There are two types in this file: `Emitter` and `Particle`. `Emitter` looks after creating particles, starting and stopping them, telling them when to draw and killing them when they're too old. The `Particle` type, however, represents a single particle and keeps track of such things as its position, current life in ticks, velocity and gravity should it be applied.

### app.js
This is where instantiation happens for all on screen sprites and their bounding boxes. Keyboard input is also set up to tell the `Player` type when a key is hit.

### engine.js
This is what makes everything happen! It iterates over all on-screen entities and updates their positions. It then does it again, this time rendering them. These things are done by calling each sprite's `update()` and `render()` methods. It also keeps track of time so that you get a smooth experience regardless of the cost of your computer.