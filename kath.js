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

function display_background() {
    var c = document.getElementById("game");

    // background
    // var ctx = c.getContext("2d");
    var grd = ctx.createLinearGradient(game_width/2,game_height/3,game_width/2,0);
    grd.addColorStop(0,"blue");
    grd.addColorStop(1,"white");
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,game_width,game_height);

    // statistics block
    var ctx = c.getContext("2d");
    ctx.fillStyle = "grey";
    ctx.rect(5,5,200,300);
    ctx.rect(game_width-205,5,200,300);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.ellipse(game_width/2, game_height, game_width/1.5, 150, 0, Math.PI, 3 * Math.PI);
    ctx.fill();
}
