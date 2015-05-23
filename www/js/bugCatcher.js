//Get Screen Size
var w = window.innerWidth;
var h = window.innerHeight - 20;

//Building Blocks
var game;
if (isSafari)
{
	game = new Phaser.Game(w, h, Phaser.CANVAS, 'midDiv', { preload: preload, create: create, update: update });
}
else
{
	game = new Phaser.Game(w, h, Phaser.AUTO, 'midDiv', { preload: preload, create: create, update: update });
}
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
var centerText;


//Variables
var currentScore = 1;
var numRounds = 5;
var numLives = 3;
var currentSpeed = 100;
var numTargets = 30;
var currentIteration = 0;
var fontSize = 30;
var differential = 1;
var started = false;
var ended = false;
var instructionPage = 0;
var iteration = 0;

var tags = [ "</HEAD>", "<P>", "</LI>", "<IMG", "</H2>", "<H2>", "<LI>", "<HTML>", "</HTML>", "<HEAD>", "<BODY>", "</BODY>", "</P>"];
var _head = "<HEAD><TITLE>My Hiding Place</TITLE>";
var _p = "Mars is too cold this time of year.</P>";
var _li = "<LI>Needs to be cloudy";
var _img = "src=\"images/lairPhoto.png\">";
var _h2 = "<H2>Lair Sweet Lair";

var tagDesc = [_head, _p, _li, _img, _h2];

/**Loads all of the parts of the game**/
function preload()
{
	//Build differential
	differential = 1 / (800/w);
	
	//Load the World
	game.load.image('sky', 'img/sky_stars.png');
	game.load.image('ground', 'img/platform.png');
	
	//Load the targets
	game.load.image('img0', 'img/head.c.png');
	game.load.image('img1', 'img/p.png');
	game.load.image('img2', 'img/li.c.png');
	game.load.image('img3', 'img/img.png');
	game.load.image('img4', 'img/h2.c.png');
	game.load.image('img5', 'img/h2.png');
	game.load.image('img6', 'img/li.png');
	game.load.image('img7', 'img/html.png');
	game.load.image('img8', 'img/html.c.png');
	game.load.image('img9', 'img/head.png');
	game.load.image('img10', 'img/body.png');
	game.load.image('img11', 'img/body.c.png');
	game.load.image('img12', 'img/p.c.png');
	
	
	//Load the character
	game.load.spritesheet('dude', 'img/dude.png', 32, 48);
	
	//Set the displays to avoid errors
	disp = game.add.text(game.world.centerX, fontSize,"");
	req = game.add.text(game.world.centerX, game.world.height - fontSize,"");
}

function showInstructions()
{
	var instructions1 = "We need your help\nto catch Bianca Bug!";
	var instructions2 = "She has left behind peices\nof an HTML page that describes\nher whereabouts, but\nthe tags are broken!"
	var instructions3 = "Can you collect and fix\nall the pieces of broken code?"
	var instructions4 = "You'll need to complete the\nHTML tags so that we\ncan read the page!"
	var instructionList = [instructions1, instructions2, instructions3, instructions4];
	
	if(instructionPage < 4)
	{
		display("");
		request("");
		writeCenter(instructionList[instructionPage], 1, null);
		instructionPage++;
		game.paused = true;
	}
	else
	{
		writeCenter("", 1, null);
		started = true;
		//Add the background
		var sky = game.add.sprite( 0, 0, 'sky');
		sky.scale.x = (w/sky.width);
		sky.scale.y = (h/sky.height);
		game.world.sendToBack(sky);
		makeTargets(iteration++);
	}
}

/**Create the game**/
function create()
{
	//Load Phaser
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//UnPause (if needed)
	game.input.onDown.add(unpause, self);
	
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
	var arrNum = tags.length;
	while (arrNum < 0 || arrNum >= tags.length)
	{
		arrNum = getNum();
	}
	
	centerText = game.add.text(game.world.centerX, game.world.centerY,"");
	
	//Listen for keypresses
	cursors = game.input.keyboard.createCursorKeys();
}



/**This runs at each frame of the game**/
function update()
{
	game.physics.arcade.collide(platforms, player);
	
	if(ended && !player.animations.getAnimation('hit').isPlaying)
	{
		game.paused = true;
	}
	
	if(!started)
	{
		showInstructions();
	}
	
	
	if(numLives > 0)
	{	
		//Move!
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
		makeTargets(iteration++);
		
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
	return Math.round(Math.random() * tags.length) - 1;
}

function missedTarget(ground, target)
{
	target.kill();
	makeTargets(iteration);
}

function missedNonTarget(ground, target)
{
	target.kill();
}

/**Makes the target and a specific number of non-targets**/
function makeTargets(tag)
{
	
	//Make target in random location above screen
	var goodTarget = targets.create((Math.random() * (w-100)) + 50, Math.random() * (-10 * h), 'img' + tag);
	goodTarget.scale.x = differential;
	goodTarget.scale.y = differential;
	//Set velocity to make target fall
	goodTarget.body.velocity.y = currentSpeed;
	
	//Print the request to catch the target
	request(tagDesc[tag]);
	
	//Make all the non-targets
	for (var i = 0; i < numTargets; i++)
	{
		//Get a random number and verify that it is not the target
		var arrNum = tags.length;
		while (arrNum <=0 || arrNum >= tags.length || arrNum == tag)
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
		display("");
		request("");

		writeCenter("GAME\nOVER", 5, returnToIndex())
		ended = true;
	}
	
}

function returnToIndex()
{
	
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
	req.destroy();
	req = game.add.text(game.world.centerX, game.world.height - fontSize * differential, tag);
	req.anchor.set(0.5);
	req.align = 'center';

	//	Font style
	req.font = 'Arial';
	req.fontSize = fontSize * differential;
	req.fill = '#ff00ff';
}

function writeCenter(text, emDiff, onComplete)
{
	centerText.destroy();
	centerText = game.add.text(game.world.centerX, game.world.centerY, text);
	centerText.anchor.set(0.5);
	centerText.align = 'center';

	//	Font style
	centerText.font = 'Arial';
	centerText.fontSize = fontSize * differential * emDiff;
	centerText.fill = '#ff00ff';
	
	onComplete;
}

function unpause(event)
{
	game.paused = false;
}

function isSafari()
{
	var browser = navigator.appVersion;
	var device = navigator.platform;
	
	if(browser.indexOf("Safari") > -1 && device == "iPad")
	{
		return true;
	}
}
