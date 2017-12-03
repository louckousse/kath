/* ------- WORLD VARIABLE ------- */
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
var inhabitant_killed = 0;
var attack_launched = 0;

var tic = 0;
var th = 0;
/* --------------------------- */

 display_background();

var t = setInterval(runGame,1000);

/* ------- GAME LOGIC ------- */
function runGame() {
    reproduction();
    resources_consumption();
    display_statistics();
    display_inhabitants_block()
    if (earth_resources <= 0) clearInterval(t);
    if (inhabitant_blocks.call() > 10 && th == 0) th = tic;
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
/* --------------------------- */

/* ------- DISPLAY ------- */
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
    ctx.rect(game_width-255,5,250,260);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    var beg_rect = game_width - 245;

    // earthquake
    ctx.beginPath();
    ctx.fillStyle = "white"
    ctx.rect(beg_rect,15,230,40);
    ctx.stroke();
    ctx.fill();
    ctx.font = "25px serif";
    ctx.fillStyle = "black";
    ctx.fillText("earthquake", beg_rect+5, 40, 220);
    ctx.closePath();

    // tornado
    ctx.beginPath();
    ctx.fillStyle = "white"
    ctx.rect(beg_rect,65,230,40);
    ctx.stroke();
    ctx.fill();
    ctx.font = "25px serif";
    ctx.fillStyle = "black";
    ctx.fillText("tornado", beg_rect+5, 90, 220);
    ctx.closePath();

    // eruption
    ctx.beginPath();
    ctx.fillStyle = "white"
    ctx.rect(beg_rect,115,230,40);
    ctx.stroke();
    ctx.fill();
    ctx.font = "25px serif";
    ctx.fillStyle = "black";
    ctx.fillText("eruption", beg_rect+5, 140, 220);
    ctx.closePath();

    // lightning
    ctx.beginPath();
    ctx.fillStyle = "white"
    ctx.rect(beg_rect,165,230,40);
    ctx.stroke();
    ctx.fill();
    ctx.font = "25px serif";
    ctx.fillStyle = "black";
    ctx.fillText("lightning", beg_rect+5, 190, 220);
    ctx.closePath();

    // typhoon
    ctx.beginPath();
    ctx.fillStyle = "white"
    ctx.rect(beg_rect,215,230,40);
    ctx.stroke();
    ctx.fill();
    ctx.font = "25px serif";
    ctx.fillStyle = "black";
    ctx.fillText("typhoon", beg_rect+5, 240, 220);
    ctx.closePath();

}

function display_statistics() {
    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.clearRect(5,5,250,260);
    ctx.rect(5,5,250,260);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "25px serif";
    ctx.fillStyle = "white";
    ctx.fillText("people: " + how_many(inhabitants), 10, 35, 240);
    ctx.fillText("resources: " + how_many(earth_resources), 10, 80, 240);
    ctx.fillText("killed: " + how_many(inhabitant_killed), 10, 125, 240);
    ctx.fillText("Attacks: " + how_many(attack_launched), 10, 170, 240);
    ctx.closePath();
}

function display_inhabitants_block() {
    while (ib_displayed < inhabitant_blocks.call()) {
        ctx.beginPath();
        var x = Math.floor(Math.random() * 1270);
        var y = Math.floor(y_on_earth(x));
        ctx.rect(x,y,20,20)
        ctx.fillStyle = "red";
        ctx.fill();
        // ctx.stroke();
        ctx.closePath();
        ib_displayed++;
        blocks_position.push({x,y});
        blocks_position.sort(function(a,b){return a.x>b.x;});
    }
}
/* --------------------------- */

/* ------- ATTACKS ------- */
function earthquake() {
    var pos = Math.floor(Math.random() * game_width);
    base_attack(pos-100, pos+100);
}

function tornado() {
    var start,end;
    var pos = Math.floor(Math.random() * game_width);
    var pos2 = (Math.random() > 0.5 ? pos + 100 : pos - 100);
    if (pos > pos2) {
        start = pos2; end = pos;
    } else {
        start = pos; end = pos2;
    }
    base_attack(start, end)
}

function eruption() {
    var pos = Math.floor(Math.random() * game_width);
    base_attack(pos-25, pos+25);
}

function lightning() {
    var pos = Math.floor(Math.random() * game_width);
    base_attack(pos,pos+2);
}

function typhoon() {
    var pos = Math.floor(Math.random() * game_width);
    base_attack(pos-150,pos+150);
}

function base_attack(from, to) {
    attack_launched++;
    if (blocks_position.some(x => x.x > from && x.x < to)) {
        var current = blocks_position.findIndex(x => x.x > from);
        while (current < blocks_position.length && blocks_position[current].x < to) {
            ctx.beginPath();
            ctx.rect(blocks_position[current].x, blocks_position[current].y, 20, 20);
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.closePath();
            inhabitants = (inhabitants - inhabitant_block_value > 0) ? inhabitants - inhabitant_block_value : 100;
            inhabitant_killed += inhabitant_block_value;
            blocks_position.splice(current,1);
            display_statistics();
            // var wait = 50 + new Date().getTime();
            // while (new Date().getTime() < wait) {}
        }
    }
}
/* --------------------------- */

/* ------- UTILS ------- */
function y_on_earth(x) {
    var z = x - 640;
    if (x < game_width/2) {
        return (game_height-20) - 150/(game_width/1.5) * (Math.sqrt(Math.abs(z*z - Math.pow(game_width/1.5,2))));
    } else {
        return (game_height-20) - 150/(game_width/1.5) * (Math.sqrt(Math.abs(z*z - Math.pow(game_width/1.5,2))));
    }
}

function how_many(value) {
    if (value <= 1000) return value;
    if (value < one_million) return Math.floor(value/1000) + "," + (value%1000 > 0 ?
        (value%1000 > 10 ? (value%1000 > 100 ? value%1000 : "0"+value%1000) : "00"+value%1000) : "000");
    if (value < 1000*one_million) {
        return Math.floor(value/one_million) + " M";
    }
    return Math.floor(value/(1000*one_million)) + " B";
}
/* --------------------------- */

document.getElementById("game").addEventListener("click", function(event) {
    var rect = c.getBoundingClientRect();
    var X = Math.floor((event.clientX-rect.left)/(rect.right-rect.left) * game_width);
    var Y = Math.floor((event.clientY-rect.top)/(rect.bottom-rect.top) * game_height);
    if (X > game_width-245 && X < game_width-10 && Y > 15 && Y < 55) earthquake();
    if (X > game_width-245 && X < game_width-10 && Y > 65 && Y < 105) tornado();
    if (X > game_width-245 && X < game_width-10 && Y > 115 && Y < 155) eruption();
    if (X > game_width-245 && X < game_width-10 && Y > 165 && Y < 205) lightning();
    if (X > game_width-245 && X < game_width-10 && Y > 215 && Y < 255) typhoon();
}, false);
