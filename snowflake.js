var textures = [];
var spritesheet;
var font;
//Preloads snowflake spritesheet and font used
function preload() {
    spritesheet = loadImage('images/Flakes1.png');
    font = loadFont('font/Freeride.otf');
}

var wham;
function loadSounds() {
    wham = new Audio('sounds/Wham.mp3');
    wham.volume = .7;
    wham.loop = true;
    wham.play();
}

var snow = [];
var gravity;
var zOff = 0;

function setup(){
    createCanvas(windowWidth, windowHeight);
    gravity = createVector(0, 0.03);

	//Separates each individual snowflake from the spritesheet into an array of images
	//saved in textures
    for(var x = 0; x < spritesheet.width; x += 32){
        for(var y = 0; y < spritesheet.height; y += 32){
            var hold = spritesheet.get(x, y, 32, 32);
            textures.push(hold);
        }
    }

	//Creates a new Snowflake object, pushed into the array snow
    for( var i = 0; i < 700; i++){
        var design = random(textures);
        snow.push(new Snowflake(design));
    }

    loadSounds();
}

function draw(){
    background('#607D8B');
    zOff += 0.01;
    for(var i = 0; i < snow.length; i++){
        var xOff = snow[i].pos.x / width;
        var yOff = snow[i].pos.y / height;
        var wAngle = noise(zOff) * TWO_PI;
        var wind = p5.Vector.fromAngle(wAngle);
        wind.mult(0.2);

        snow[i].applyForce(gravity);
        snow[i].update();
        snow[i].render();
    }

    fill('#BBDEFB');
    stroke('#0D47A1');
    strokeWeight(5);
    textFont(font);
    textSize(125);
    text('Happy Christmas', windowWidth/4, windowHeight/2);
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

//A random size for the snowflake object is returned
function getRandomSize(){
    var r = pow(random(0.01, 1), 2);
    return constrain(r * 36, 5, 36);
}

//Snowflake object is given a random position on the screen, a velocity, acceleration,
//size, design, angle, and direction of rotation
class Snowflake {

    constructor(design) {
        var x = random(width);
        var y = random(height);
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector();
        this.r = getRandomSize();
        this.design = design;
        this.angle = random(TWO_PI);
        this.dir = (random(1) < 0.5) ? 1 : -1;
    }

	//Renews the position of snowflake once it has been sent offscreen
    renew() {
        var x = random(width);
        var y = random(-100, -10);
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector();
        this.r = getRandomSize();
        this.angle = random(TWO_PI);
        this.dir = (random(1) < 0.5) ? 1 : -1;

        this.xOff = 0;
    }

    applyForce(force){
        var f = force.copy();
        f.mult(this.r);
        this.acc.add(force);
    }

    update() {
        this.xOff = sin(this.angle) * this.r;

        this.vel.add(this.acc);
        this.vel.limit(this.r * 0.25);
        
        if(this.vel.mag() < 1){
            this.vel.normalize();
        }
        
        this.pos.add(this.vel);
        this.acc.mult(0);

		//If snowflake has dropped offscreen below, reset
        if(this.pos.y > height + this.r){
            this.renew();
        }

		//Wraps snowflake around the sides of the screen
        if(this.pos.x < -this.r){
            this.pos.x = width + this.r;
        }
        if(this.pos.x > width + this.r){
            this.pos.x = -this.r;
        }

		//Rotates the snowflake
        this.angle += this.dir * this.vel.mag() / 150;

    }

	//Displays snowflake, called in draw() after update
    render() {
        push();
        translate(this.pos.x + this.xOff, this.pos.y);
        rotate(this.angle);
        imageMode(CENTER);
        image(this.design, 0, 0, this.r, this.r);
        pop();
    }
}