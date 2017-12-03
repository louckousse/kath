// World variable
var game_width = 1280;
var game_height = 720;
var one_million = 1000000;
var inhabitants = one_million;
var inhabitant_block_value = 10*one_million;
var inhabitant_blocks = () =>{return Math.ceil(inhabitants/inhabitant_block_value);};
var earth_resources = one_million;
var c = document.getElementById("game");
var ctx = c.getContext("2d");
var ib_displayed = 0;
var blocks_position = new Array();

var tic = 0;
var th = 0;

display_background();

var t = setInterval(runGame,1000);
function runGame() {
    reproduction();
    resources_consumption();
    display_statistics();
    display_inhabitants_block()
    if (earth_resources <= 0) clearInterval(t);
    if (inhabitant_blocks.call() > 10 && th == 0) th = tic;
    if (tic%10 == 0) console.log("tic " + tic + ", inhabitant " + inhabitants + " " + inhabitant_blocks.call());
    tic++;
}

function reproduction() {
    inhabitants = Math.ceil(inhabitants * 1.3);
}

function resources_consumption() {
    earth_resources -= inhabitant_blocks.call() * 100;
    earth_resources += 1000;
    if (earth_resources < 0) earth_resources = 0;
}

function display_background() {
    // console.log("display background: " + tic);
    // background
    // var ctx = c.getContext("2d");
    var grd = ctx.createLinearGradient(game_width/2,game_height/3,game_width/2,0);
    grd.addColorStop(0,"blue");
    grd.addColorStop(1,"white");
    ctx.beginPath();
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,game_width,game_height);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.ellipse(game_width/2, game_height, game_width/1.5, 150, 0, Math.PI, 3 * Math.PI);
    ctx.closePath();
    ctx.fill();

    display_action();
    display_statistics();
}

function display_action() {
    // var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = "grey";
    // ctx.rect(5,5,200,300);
    ctx.rect(game_width-255,5,250,300);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function display_statistics() {
    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.clearRect(5,5,250,300);
    ctx.rect(5,5,250,300);
    ctx.stroke();
    ctx.fill();
}
