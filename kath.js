/* ------- WORLD VARIABLE ------- */
var game_width = 1280;
var game_height = 720;
var one_million = 1000000;
var inhabitant_block_value = 10*one_million;
var inhabitant_blocks = () =>{return Math.ceil(inhabitants/inhabitant_block_value);};
var c = document.getElementById("game");
var ctx = c.getContext("2d");
var t;
var background_img = new Image();
background_img.src = "img/background.png";
var human_img = new Image();
human_img.src = "img/human.png";
var attack_available = new Image();
attack_available.src = "img/attack.png"
var attack_unavailable = new Image();
attack_unavailable.src = "img/freeze.png"
/* --------------------------- */
/* ------- GAME VARIABLE ------- */
var inhabitants;
var earth_resources;
var ib_displayed;
var blocks_position;
var inhabitant_killed;
var attack_launched;
var tic;
var th;
var lightning_obj;
var eruption_obj;
var tornado_obj;
var earthquake_obj;
var typhoon_obj;
var beg_rect;
var wait_for_procreation;
/* --------------------------- */

display_startscreen();

/* ------- GAME LOGIC ------- */
function runGame() {
    redraw_game();
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
    if (wait_for_procreation < tic)
        inhabitants = inhabitants > 10*one_million ? Math.ceil(inhabitants * 1.1) : Math.ceil(inhabitants * 1.9);
}

function resources_consumption() {
    earth_resources -= inhabitant_blocks.call() * 10;
    earth_resources += 100;
    if (earth_resources < 0) earth_resources = 0;
}

function launch_game() {
    init_world();
    document.getElementById("game").addEventListener("click", function(event) {
        var rect = c.getBoundingClientRect();
        var X = Math.floor((event.clientX-rect.left)/(rect.right-rect.left) * game_width);
        var Y = Math.floor((event.clientY-rect.top)/(rect.bottom-rect.top) * game_height);
        if (X > 770 && X < 812 && Y > 80 && Y < 120) lightning();
        if (X > 770 && X < 812 && Y > 135 && Y < 185) eruption();
        if (X > 770 && X < 812 && Y > 190 && Y < 340) tornado();
        if (X > 770 && X < 812 && Y > 245 && Y < 395) earthquake();
        if (X > 770 && X < 812 && Y > 300 && Y < 450) typhoon();
    }, false);
    display_background();
    t = setInterval(runGame,100);
}

function init_world() {
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
    wait_for_procreation = 0;
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
            init_world();
            launch_game();
        }
    }
    c.addEventListener("click", restart_event);
}

function display_startscreen() {
    var start_screen = new Image();
    start_screen.src = "img/start_screen.png";
    start_screen.onload = function() {
        ctx.drawImage(start_screen, 0, 0);

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
    ctx.drawImage(background_img, 0, 0);

    display_action();
    display_statistics();
}

function display_action() {
    lightning_button();
    eruption_button();
    tornado_button();
    earthquake_button();
    typhoon_button();
}

function display_statistics() {
    ctx.beginPath();
    ctx.font = "25px serif";
    ctx.fillStyle = "white";
    ctx.fillText("people: " + how_many(inhabitants), 170, 133, 240);
    ctx.fillText("resources: " + how_many(earth_resources), 170, 180, 240);
    ctx.fillText("killed: " + how_many(inhabitant_killed), 170, 225, 240);
    ctx.fillText("Attacks: " + how_many(attack_launched), 170, 270, 240);
    ctx.fillText("Years: " + how_many(tic), 170, 320, 240);
    ctx.closePath();
}

function lightning_button() {
    ctx.beginPath();
    ctx.drawImage((lightning_obj.last_use + lightning_obj.load_time > tic ? attack_unavailable : attack_available),
                740,50,100,100);
    ctx.closePath();
}

function eruption_button() {
    ctx.beginPath();
    ctx.drawImage((eruption_obj.last_use + eruption_obj.load_time > tic ? attack_unavailable : attack_available),
                740,105,100,100);
    ctx.closePath();
}

function tornado_button() {
    ctx.beginPath();
    ctx.drawImage((tornado_obj.last_use + tornado_obj.load_time > tic ? attack_unavailable : attack_available),
                740,160,100,100);
    ctx.closePath();
}

function earthquake_button() {
    ctx.drawImage((earthquake_obj.last_use + earthquake_obj.load_time > tic ? attack_unavailable : attack_available),
                740,215,100,100);
    ctx.closePath();
}

function typhoon_button() {
    ctx.beginPath();
    ctx.drawImage((typhoon_obj.last_use + typhoon_obj.load_time > tic ? attack_unavailable : attack_available),
                740,270,100,100);
    ctx.closePath();
}

function display_inhabitants_block() {
    while (ib_displayed < inhabitant_blocks.call() || blocks_position.length == 0) {
        ib_displayed++;
        if (blocks_position.length < 500) {
            ctx.beginPath();
            var x = Math.floor(Math.random() * 1270);
            var y = Math.floor(y_on_earth(x));
            ctx.drawImage(human_img, x, y, 50, 50);
            blocks_position.push({x,y});
            blocks_position.sort(function(a,b){return a.x>b.x;});
        }
    }
}

function redraw_blocks() {
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
    var pos1 = Math.floor(Math.random() * game_width);
    var pos2 = Math.floor(Math.random() * game_width);
    var pos3 = Math.floor(Math.random() * game_width);
    base_attack(pos1, 8);
    base_attack(pos2, 8);
    base_attack(pos3, 8);
    eruption_obj.last_use = tic;
}

function tornado() {
    if (tornado_obj.last_use + tornado_obj.load_time > tic) return;
    var pos = Math.floor(Math.random() * game_width);
    base_attack(pos, 50);
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
            inhabitant_killed += (inhabitants > inhabitant_block_value ? inhabitant_block_value : inhabitants -100);
            inhabitants = (inhabitants - inhabitant_block_value > 0) ? inhabitants - inhabitant_block_value : 100;
            earth_resources += 10000;
            blocks_position.splice(current,1);
            wait_for_procreation = tic + 5;
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
    var vl = value + "";
    if (value < one_million) {
        return vl.substring(0,vl.length-3) + "," + vl.substring(vl.length-3);
    }
    if (value < 1000*one_million) {
        return vl.substring(0,vl.length-6) + "," + vl.substring(vl.length-6, vl.length-4) + " M";
    }
    return vl.substring(0,vl.length-9) + "," + vl.substring(vl.length-9, vl.length-7) + " B";
}
/* --------------------------- */
