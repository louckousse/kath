/* ------- WORLD VARIABLE ------- */
var game_width = 1280;
var game_height = 720;
var one_million = 1000000;
var inhabitant_block_value = 10*one_million;
var inhabitant_blocks = () =>{return Math.ceil(inhabitants/inhabitant_block_value);};
var c = document.getElementById("game");
var ctx = c.getContext("2d");
var t;
/* --------------------------- */
/* ------- GAME VARIABLE ------- */
var inhabitants = one_million;
var earth_resources = one_million;
var ib_displayed = 0;
var blocks_position = new Array();
var inhabitant_killed = 0;
var attack_launched = 0;
var tic = 0;
var th = 0;
var lightning_obj = {last_use : 1, load_time : 5};
var eruption_obj = {last_use : 1, load_time : 10};
var tornado_obj = {last_use : 1, load_time : 15};
var earthquake_obj = {last_use : 1, load_time : 20};
var typhoon_obj = {last_use : 1, load_time : 30};
var beg_rect = game_width - 245;
/* --------------------------- */

display_startscreen();

/* ------- GAME LOGIC ------- */
function runGame() {
    resources_consumption();
    display_statistics();
    display_inhabitants_block();
    if (earth_resources <= 0) {
        clearInterval(t);
        display_endscreen();
        return;
    }
    lightning_button();
    eruption_button();
    tornado_button();
    earthquake_button();
    typhoon_button();
    th++;
    if (th%10==0) {tic++;reproduction();}
}

function reproduction() {
    inhabitants = Math.ceil(inhabitants * 1.1);
}

function resources_consumption() {
    earth_resources -= inhabitant_blocks.call() * 10;
    earth_resources += 100;
    if (earth_resources < 0) earth_resources = 0;
}

function launch_game() {
    document.getElementById("game").addEventListener("click", function(event) {
        var rect = c.getBoundingClientRect();
        var X = Math.floor((event.clientX-rect.left)/(rect.right-rect.left) * game_width);
        var Y = Math.floor((event.clientY-rect.top)/(rect.bottom-rect.top) * game_height);
        if (X > game_width-245 && X < game_width-10 && Y > 15 && Y < 55) lightning();
        if (X > game_width-245 && X < game_width-10 && Y > 65 && Y < 105) eruption();
        if (X > game_width-245 && X < game_width-10 && Y > 115 && Y < 155) tornado();
        if (X > game_width-245 && X < game_width-10 && Y > 165 && Y < 205) earthquake();
        if (X > game_width-245 && X < game_width-10 && Y > 215 && Y < 255) typhoon();
    }, false);
    display_background();
    t = setInterval(runGame,100);
}
/* --------------------------- */

/* ------- DISPLAY ------- */
function display_endscreen() {
    ctx.beginPath();
    ctx.rect(0,0,1280,720);
    ctx.fillStyle = 'rgba(225,225,225,0.8)';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "95px serif";
    ctx.fillStyle = "RED";
    ctx.fillText("HUMANS KILLED THE EARTH", 10, 250, 1260);
    ctx.fillText("SHAME ON THEM", 200, 350);
    ctx.font = "55px serif";
    ctx.fillStyle = "black";
    ctx.fillText("By the way, you survived for " + tic + " years...", 110, 450);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(515,500,300,100);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "65px serif";
    ctx.fillStyle = "white";
    ctx.fillText("Again?..", 535, 575);
    ctx.closePath();

    function restart_event(event) {
        var rect = c.getBoundingClientRect();
        var X = Math.floor((event.clientX-rect.left)/(rect.right-rect.left) * game_width);
        var Y = Math.floor((event.clientY-rect.top)/(rect.bottom-rect.top) * game_height);
        if (X > 515 && X < 815 && Y > 500 && Y < 600) {
            this.removeEventListener("click", restart_event);
            inhabitants = one_million;
            earth_resources = one_million;
            ib_displayed = 0;
            blocks_position = new Array();
            inhabitant_killed = 0;
            attack_launched = 0;
            tic = 0;
            th = 0;
            earthquake_obj = {last_use : 1, load_time : 20};
            tornado_obj = {last_use : 1, load_time : 15};
            eruption_obj = {last_use : 1, load_time : 10};
            lightning_obj = {last_use : 1, load_time : 5};
            typhoon_obj = {last_use : 1, load_time : 30};
            beg_rect = game_width - 245;
            launch_game();
        }
    }
    c.addEventListener("click", restart_event);
}

function display_startscreen() {
    var background_img = new Image();
    background_img.src = "img/start_screen.png";
    background_img.onload = function() {
        ctx.drawImage(background_img, 0, 0);

        function start_event(event) {
            var rect = c.getBoundingClientRect();
            var X = Math.floor((event.clientX-rect.left)/(rect.right-rect.left) * game_width);
            var Y = Math.floor((event.clientY-rect.top)/(rect.bottom-rect.top) * game_height);
            if (X > 1000 && X < 1200 && Y > 525 && Y < 630) {
                this.removeEventListener("click", start_event);
                launch_game();
            }
        }
        c.addEventListener("click", start_event);
    }
}

function display_background() {
    ctx.clearRect(0,0,1280,720);
    var background_img = new Image();
    background_img.src = "img/background.png";
    ctx.drawImage(background_img, 0, 0);

    display_action();
    display_statistics();
}

function display_action() {
    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.rect(game_width-255,5,250,260);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    lightning_button();
    eruption_button();
    tornado_button();
    earthquake_button();
    typhoon_button();
}

function lightning_button() {
    ctx.beginPath();
    ctx.clearRect(beg_rect,15,230,40)
    ctx.fillStyle = (lightning_obj.last_use + lightning_obj.load_time > tic ? "#b8b8b8" : "white");
    ctx.rect(beg_rect,15,230,40);
    ctx.stroke();
    ctx.fill();
    ctx.font = "25px serif";
    ctx.fillStyle = "black";
    ctx.fillText("lightning", beg_rect+5, 40, 220);
    ctx.closePath();
}

function eruption_button() {
    ctx.beginPath();
    ctx.clearRect(beg_rect,65,230,40)
    ctx.fillStyle = (eruption_obj.last_use + eruption_obj.load_time > tic ? "#b8b8b8" : "white");
    ctx.rect(beg_rect,65,230,40);
    ctx.stroke();
    ctx.fill();
    ctx.font = "25px serif";
    ctx.fillStyle = "black";
    ctx.fillText("eruption", beg_rect+5, 90, 220);
    ctx.closePath();
}

function tornado_button() {
    ctx.beginPath();
    ctx.clearRect(beg_rect,115,230,40)
    ctx.fillStyle = (tornado_obj.last_use + tornado_obj.load_time > tic ? "#b8b8b8" : "white");
    ctx.rect(beg_rect,115,230,40);
    ctx.stroke();
    ctx.fill();
    ctx.font = "25px serif";
    ctx.fillStyle = "black";
    ctx.fillText("tornado", beg_rect+5, 140, 220);
    ctx.closePath();
}

function earthquake_button() {
    ctx.beginPath();
    ctx.clearRect(beg_rect,165,230,40)
    ctx.fillStyle = (earthquake_obj.last_use + earthquake_obj.load_time > tic ? "#b8b8b8" : "white");
    ctx.rect(beg_rect,165,230,40);
    ctx.stroke();
    ctx.fill();
    ctx.font = "25px serif";
    ctx.fillStyle = "black";
    ctx.fillText("earthquake", beg_rect+5, 190, 220);
    ctx.closePath();
}

function typhoon_button() {
    ctx.beginPath();
    ctx.clearRect(beg_rect,215,230,40)
    ctx.fillStyle = (typhoon_obj.last_use + typhoon_obj.load_time > tic ? "#b8b8b8" : "white");
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
    ctx.fillText("Years: " + how_many(tic), 10, 215, 240);
    ctx.closePath();
}

function display_inhabitants_block() {
    while (ib_displayed < inhabitant_blocks.call()) {
        ctx.beginPath();
        var x = Math.floor(Math.random() * 1270);
        var y = Math.floor(y_on_earth(x));
        var human_img = new Image();
        human_img.src = "img/human.png";
        ctx.drawImage(human_img, x, y, 50, 50);
        ib_displayed++;
        blocks_position.push({x,y});
        blocks_position.sort(function(a,b){return a.x>b.x;});
    }
}

function redraw_blocks() {
    var human_img = new Image();
    human_img.src = "img/human.png";
    for (var i = 0; i < blocks_position.length; i++) {
        var x = blocks_position[i].x;
        var y = blocks_position[i].y;
        ctx.drawImage(human_img, x, y, 50, 50);
    }
}

function redraw_game() {
    ctx.clearRect(0,0,game_width,game_height);
    display_background();
    redraw_blocks();
}
/* --------------------------- */

/* ------- ATTACKS ------- */
function lightning() {
    if (lightning_obj.last_use + lightning_obj.load_time > tic) return;
    var pos = Math.floor(Math.random() * game_width);
    base_attack(pos, 1);
    lightning_obj.last_use = tic;
}

function eruption() {
    if (eruption_obj.last_use + eruption_obj.load_time > tic) return;
    var pos = Math.floor(Math.random() * game_width);
    base_attack(pos, 25);
    eruption_obj.last_use = tic;
}

function tornado() {
    if (tornado_obj.last_use + tornado_obj.load_time > tic) return;
    var pos = Math.floor(Math.random() * game_width);
    base_attack(pos, 50)
    tornado_obj.last_use = tic;
}

function earthquake() {
    if (earthquake_obj.last_use + earthquake_obj.load_time > tic) return;
    var pos = Math.floor(Math.random() * game_width);
    base_attack(pos, 100);
    earthquake_obj.last_use = tic;
}

function typhoon() {
    if (typhoon_obj.last_use + typhoon_obj.load_time > tic) return;
    var pos = Math.floor(Math.random() * game_width);
    base_attack(pos, 150);
    typhoon_obj.last_use = tic;
}

function base_attack(from, distance) {
    var to = from + distance;
    from -= distance;
    attack_launched++;
    if (blocks_position.some(x => x.x > from && x.x < to)) {
        var current = blocks_position.findIndex(x => x.x > from);
        while (current < blocks_position.length && blocks_position[current].x < to) {
            var img = ctx.createImageData(blocks_position[current].x, blocks_position[current].y);
            for (var i = img.data.length; --i >= 0;) img.data[i] = 0;
            inhabitants = (inhabitants - inhabitant_block_value > 0) ? inhabitants - inhabitant_block_value : 100;
            inhabitant_killed += inhabitant_block_value;
            blocks_position.splice(current,1);
            display_statistics();
        }
        redraw_game();
    }
}
/* --------------------------- */

/* ------- UTILS ------- */
function y_on_earth(x) {
    var z = x - 640;
    return (game_height-45) - 150/(game_width/1.5) * (Math.sqrt(Math.abs(z*z - Math.pow(game_width/1.5,2))));
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
