//Get Screen Size
var w = window.innerWidth;
var h = window.innerHeight - 20;

//Building Blocks
var game = new Phaser.Game(w, h, Phaser.CANVAS, 'midDiv', { preload: preload, create: create, update: update });
var targets;
var nonTargets;
var platforms;
var ground;
var gameOver;
var player;
var disp;
var req;
var topBar;
var ua= navigator.userAgent;


//Variables
var currentScore = 1;
var numRounds = 5;
var numLives = 3;
var currentSpeed = 100;
var numTargets = 40;
var currentIteration = 0;
var fontSize = 30;
var differential = 1;

var tags = ["<HTML>", "</HTML>", "<HEAD>", "</HEAD>", "<BODY>", "</BODY>", "<P>", "</P>"];

/**Loads all of the parts of the game**/
function preload()
{
	//Build differential
	differential = 1 / (800/w);
	
	//Load the World
	game.load.image('sky', 'img/sky_stars.png');
	game.load.image('ground', 'img/platform.png');
	
	//Load the targets
	game.load.image('img0', 'img/html.c.png');
	game.load.image('img1', 'img/html.png');
	game.load.image('img2', 'img/head.c.png');
	game.load.image('img3', 'img/head.png');
	game.load.image('img4', 'img/body.c.png');
	game.load.image('img5', 'img/body.png');
	game.load.image('img6', 'img/p.c.png');
	game.load.image('img7', 'img/p.png');
	
	//Load the "game Over" screen
	game.load.image('gameOver', 'img/GameOver.png');
	
	//Load the character
	game.load.spritesheet('dude', 'img/dude.png', 32, 48);
	
	//Set the displays to avoid errors
	disp = game.add.text(game.world.centerX, fontSize,"");
	req = game.add.text(game.world.centerX, game.world.height - fontSize,"");
}


/**Create the game**/
function create()
{
	//Load Phaser
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//Add the background
	var sky = game.add.sprite( 0, 0, 'sky');
	sky.scale.x = (w/sky.width);
	sky.scale.y = (h/sky.height);
	
	//Add a platform group and a ground. Useful for event handling
	platforms = game.add.group();
	platforms.enableBody = true;
	ground = platforms.create(0, game.world.height - (h/10), 'ground');
	ground.scale.x = w/ground.width;
	ground.scale.y = (h/10)/ground.height;
	ground.body.immovable = true;
	
	topBar = platforms.create(0,0,'ground');
	topBar.scale.x = w/topBar.width;
	topBar.scale.y = (h/10)/topBar.height;
	topBar.body.immovable = true;
	
	//Add the player
	player = game.add.sprite((game.world.width/2) - 16, game.world.height - (h/5), 'dude');
	game.physics.arcade.enable(player);
	
	//Give a little gravity
	player.body.gravity.y = 0;
	
	//Keep player on the screen
	player.body.collideWorldBounds = true;
	
	//Add some animations
	player.animations.add('left', [0], 10, true);
	player.animations.add('right', [7], 10, true);
	player.animations.add('hit', [2,7, 2,7, 2,7, 2,7, 2,7, 2,7, 4], 2, true);
	
	//add groups for targets
	targets = game.add.group();
	nonTargets = game.add.group();
	targets.enableBody = true;
	nonTargets.enableBody = true;
	
	//Create the targets
	makeTargets(getNum());
	
	//Make the GameOver screen
	gameOver = game.add.sprite((w/2) - 237, -1000, 'gameOver');
	gameOver.scale.x = differential;
	gameOver.scale.y = differential;
	gameOver.x = (w/2) - (gameOver/2);
	gameOver.y = -10 - gameOver.height;
	
	//Listen for keypresses
	cursors = game.input.keyboard.createCursorKeys();
}



/**This runs at each frame of the game**/
function update()
{
	game.physics.arcade.collide(platforms, player);
	
	
	
	
	if(numLives > 0)
	{	//Move!
		//Touch:
		 if (game.input.pointer1.isDown || game.input.mousePointer.isDown)
		 {
			 //  400 is the speed it will move towards the mouse
			game.physics.arcade.moveToPointer(player, currentSpeed * 2);
			
			var rect = new Phaser.Rectangle(player.body.x - (player.body.width/2), player.body.y - (player.body.height/2), player.body.width * 1, player.body.width * 1);
			
			//  if it's overlapping the mouse, don't move any more
			if (Phaser.Rectangle.contains(rect, game.input.x, game.input.y))
			{
				player.body.velocity.setTo(0, 0);
			}
		 }
		 else
		 {
			//set velocity to 0
			player.body.velocity.x = 0;
			player.body.velocity.y = 0;
		 }
		
		
		//Arrows:
		if(cursors.left.isDown)
		{
			player.body.velocity.x = currentSpeed * -2;
			player.animations.play('left');
		}
		else if(cursors.right.isDown)
		{
			player.body.velocity.x = currentSpeed * 2;
			player.animations.play('right');
		}
		else
		{
			//If the player isn't moving, point him forward
			if(!player.animations.getAnimation('hit').isPlaying)
			{
				player.frame = 4;
			}
		}
		if(cursors.up.isDown)
		{
			player.body.velocity.y = currentSpeed * -2;
		} 
		else if(cursors.down.isDown)
		{
			player.body.velocity.y = currentSpeed * 2;
		}
		
		
		
		//Top display
		if(currentScore <= numRounds && numLives > 0)
		{
			display("Level: " + currentScore + " | Lives Remaining: " + numLives);
		}
		
		game.world.bringToTop(platforms);
		game.world.bringToTop(req);
		game.world.bringToTop(disp);
	
	}
	

	
	//Control various events.
	game.physics.arcade.overlap(player, targets, collectTarget, null, this);
	game.physics.arcade.overlap(ground, targets, missedTarget, null, this);
	game.physics.arcade.overlap(ground, nonTargets, missedNonTarget, null, this);
	game.physics.arcade.overlap(player, nonTargets, dieNow, null, this);
	
}

/**Function for when player gets point**/
function collectTarget (player, target)
{
	//Remove the target from game (otherwise it will continue counting)
	target.kill();
	
	//Add one to the score
	currentScore++;
	
	//Remove all of the non-targets
	nonTargets.forEachAlive(killEmAll, this);
	
	//If there are more levels, keep going
	if(currentScore <= numRounds)
	{
		//Increase speed
		currentSpeed += 50;
		
		//Make the targets
		makeTargets(getNum());
		
		//Add a life
		numLives++;
	}
	else
	{
		//Hey, you won!
		display("You Win!!!");
	}
	
}

/**Gets a whole number between 0 and 8**/
function getNum()
{
	return Math.round(Math.random() * 8);
}

function missedTarget(ground, target)
{
	target.kill();
	makeTargets(currentIteration);
}

function missedNonTarget(ground, target)
{
	target.kill();
}

/**Makes the target and a specific number of non-targets**/
function makeTargets(tag)
{
	currentIteration = tag;
	
	//Make target in random location above screen
	var goodTarget = targets.create((Math.random() * (w-100)) + 50, Math.random() * (-10 * h), 'img' + tag);
	goodTarget.scale.x = differential;
	goodTarget.scale.y = differential;
	//Set velocity to make target fall
	goodTarget.body.velocity.y = currentSpeed;
	
	//Print the request to catch the target
	request(tags[tag]);
	
	//Make all the non-targets
	for (var i = 0; i < numTargets; i++)
	{
		//Get a random number and verify that it is not the target
		var arrNum = 9;
		while (arrNum <=0 || arrNum >= 8 || arrNum == tag)
		{
			arrNum = getNum();
		}
		
		//Get a random number for the vertical off-screen location
		var loc = Math.random() * (-10 * h);
		//Make sure that they all show up at the same place
		if(loc > -100)
		{
			loc = loc / Math.random();
		}
		
		//Create the non-targets
		var target = nonTargets.create((Math.random() * (w-100)) + 50, loc, 'img' + arrNum);
		target.scale.x = differential;
		target.scale.y = differential;
		
		//Set their velocity
		target.body.velocity.y = currentSpeed;
	}
}

/**Remove from game everything in a specific group**/
function killEmAll(target)
{
	target.kill();
}

/**Player hits a non-target**/
function dieNow (player, target)
{
	target.kill();
	
	numLives--;
	
	if(numLives <= 0)
	{
		//Kill everything
		nonTargets.forEachAlive(killEmAll, this);
		targets.forEachAlive(killEmAll, this);
		//Stop player movement
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		player.body.gravity.x = 0;
		player.body.gravity.y = 0;
		
		//Play dead animation
		player.animations.stop();
		player.animations.play('hit', 5, false, true);
		//Play game over
		display("Game Over!");
		
		//Create the gameOver screen
		//Get x and y
		var gOX = game.world.centerX - (gameOver.width / 2);
		var gOY = game.world.centerY - (gameOver.height / 2);
		var gOver = game.add.tween(gameOver).to({x:gOX,y:gOY},3000);
		gOver.start();
	}
	
}

/**Change text of top bar**/
function display(text)
{
	disp.destroy();
	disp = game.add.text(game.world.centerX, fontSize * differential, text);
    disp.anchor.set(0.5);
    disp.align = 'center';

    //	Font style
    disp.font = 'Arial';
    disp.fontSize = fontSize * differential;
    disp.fill = '#ff00ff';
}

/**Change text of lower bar**/
function request(tag)
{
	//Build the string using the tag
	var newString = "";
	if(tag.charAt(1) == '/')
	{
		newString = "Catch the opening tag for " + tag;
	}
	else
	{
		newString = "Catch the closing tag for " + tag;
	}
	
	req.destroy();
	req = game.add.text(game.world.centerX, game.world.height - fontSize * differential, newString);
	req.anchor.set(0.5);
    req.align = 'center';

    //	Font style
    req.font = 'Arial';
    req.fontSize = fontSize * differential;
    req.fill = '#ff00ff';
}
