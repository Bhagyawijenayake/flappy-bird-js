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
let pipes = null;

let pipeHorizontalDistance = 0;
const pipeHorizontalDistanceRange = [500, 550];

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

  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200);
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
  const rightMostX = getRightmostPipe();
  const pipeVerticalDistance = Phaser.Math.Between(
    ...pipeVerticalDistanceRange
  );
  const pipeVerticalPosition = Phaser.Math.Between(
    0 + 20,
    config.height - 20 - pipeVerticalDistance
  );
  const pipeHorizontalDistance = Phaser.Math.Between(
    ...pipeHorizontalDistanceRange
  );

  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;
}

function getRightmostPipe() {
  let rightMostX = 0;

  pipes.getChildren().forEach(function (pipe) {
    
    rightMostX = Math.max(pipe.x, rightMostX);
  });

  return rightMostX;
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
