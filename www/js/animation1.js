/* global Phaser */
var game;
var player;
var cursors;
var slideUp;
var slideDown;
var slideLeft;
var slideRight;
var armUp;
var armDown;
var presentLeft;
var presentRight;
var currentKey;
var armsForward;
var armsOut;

var currentScale = 1;
var centerFrame = 26;
var isPressed = false;

if (isSafari)
{
	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'midDiv', { preload: preload, create: create, update: update });
}
else
{
	game = new Phaser.Game(800, 600, Phaser.AUTO, 'midDiv', { preload: preload, create: create, update: update });
}

function preload()
{
	//Load character
	game.load.spritesheet('saraEx', 'img/sara.png', 64, 64, 260);
}

function create()
{
	//Add player
	player = game.add.sprite(64, 64, 'saraEx', centerFrame);
	game.physics.arcade.enable(player);
	
	//Add specific character animations
	player.animations.add('left', [118,119,120,121,122,123,124,125], 10, false);
	player.animations.add('right', [144,145,146,147,148,149,150,151], 10, false);
	
	
	//Listen for keypresses
	cursors = game.input.keyboard.createCursorKeys();
	slideUp = 104;
	slideDown = 98;
	slideRight = 102;
	slideLeft = 100;
	armUp = 51;
	armDown = 32;
	presentLeft = 49;
	presentRight = 50;
	armsForward = 52;
	armsOut = 53;
	
	this.game.input.keyboard.addCallbacks(this, keyDown, keyUp);
}

function keyDown(key)
{
	currentKey = key.keyCode;
	isPressed = true;
	document.getElementById("display").innerHTML = key.keyCode;
}
function keyUp(key)
{
	isPressed = false;
	document.getElementById("display").innerHTML = "Display";
}

function update()
{
	//player.animations.currentAnim = null;
	if(isPressed)
	{
		if(cursors.left.isDown)
		{
			player.animations.play('left');
			player.body.velocity.x = -200;
		}
		else if(cursors.right.isDown)
		{
			player.animations.play('right');
			player.body.velocity.x = 200;
		}
		
		if(currentKey == slideUp)
		{
			player.body.velocity.y = -200;
		}
		else if(currentKey == slideDown)
		{
			player.body.velocity.y = 200;
		}
		else if(currentKey == slideLeft)
		{
			player.body.velocity.x = -200;
		}
		else if(currentKey == slideRight)
		{
			player.body.velocity.x = 200;
		}
		else if(currentKey == armUp)
		{
			centerFrame = 31;
			player.frame = centerFrame;
		}
		else if(currentKey == armDown)
		{
			centerFrame = 26;
			player.frame = centerFrame;
		}
		else if(currentKey == presentLeft)
		{
			centerFrame = 173;
			player.frame = centerFrame;
		}
		else if(currentKey == presentRight)
		{
			centerFrame = 199;
			player.frame = centerFrame;
		}
		else if(currentKey == armsForward)
		{
			centerFrame = 29;
			player.frame = centerFrame;
		}
		else if(currentKey == armsOut)
		{
			centerFrame = 30;
			player.frame = centerFrame;
		}
		
		
		if(player.animations.currentAnim == null || !player.animations.currentAnim.isPlaying)
		{		
			
			player.frame = centerFrame;
			if(cursors.up.isDown)
			{
				currentScale *= 1.1;
				player.scale.x = currentScale;
				player.scale.y = currentScale;
			} 
			else if(cursors.down.isDown)
			{
				currentScale *= 0.9;
				player.scale.x = currentScale;
				player.scale.y = currentScale;
			}		
		}
	}
	else
	{
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		player.frame = centerFrame;
	}
	
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
	
