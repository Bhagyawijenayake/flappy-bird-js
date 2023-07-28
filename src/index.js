import Phaser from "phaser";

const config = {
  //webGL
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //ARCADE is the simplest physics engine in Phaser
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const VELOCITY = 200;
const PIPES_TO_RENDER = 4;

let bird = null;

let pipeHorizontalDistance = 0;

let pipeVerticalDistanceRange = [150, 250];

const flapVelocity = 250;
const initialBirdPosition = { x: config.width / 10, y: config.height / 2 };

//load assets
function preload() {
  //'this' context - refers to the scene object
  //contains all the methods and properties of the scene
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

//create game objects
function create() {

  this.add.image(0, 0, "sky").setOrigin(0, 0);

  bird = this.physics.add
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0);
  bird.body.gravity.y = 400;

  for (let i = 0; i < PIPES_TO_RENDER; i++) {

    const upperPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  this.input.on("pointerdown", flap);

  this.input.keyboard.on("keydown-SPACE", flap);
}

//update game objects 60 times per second
function update(time, delta) {
  if (bird.y > config.height || bird.y < 0 - bird.height) {
    restartBirdPosition();
  }
}

function placePipe(uPipe, lPipe) {
  pipeHorizontalDistance += 400;
  let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  let pipeVerticalPosition = Phaser.Math.Between(
    0 + 20,
    config.height - 20 - pipeVerticalDistance
  );

  uPipe.x = pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;

  lPipe.body.velocity.x = -200;
  uPipe.body.velocity.x = -200;
}

function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

new Phaser.Game(config);
