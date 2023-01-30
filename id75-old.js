/**
 *
 * @author Henryk Krasuski 
 * @date 2023-01-29
 *
 */


// ===================================================
// Animate interrupt
// ===================================================

var tick = 0;
var statemachine = 0;

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function letter(array, str, yoff) {
    dc.fillStyle = "black";
    dc.fillRect(0, 0, 400, 400);
    dc.strokeStyle = "white";
    dc.fillStyle = "#010101";
    dc.lineWidth = 1.0;
    dc.font = "20px arial";
    var w = dc.measureText(str).width;
    dc.fillText(str, (width-w)/2, 130);
    //    dc.fillText(str, 0,99);
    for (y = 0; y < 150; y++) {
        for (x = 0; x < width; x++) {
            if (dc.getImageData(x, y, 1, 1).data[0]) {
                array.push(new PVector(2*(x-width/2), 2*(y-75) + yoff));
            }
        }
    }

//    shuffle(array);
    //    alert(JSON.stringify(arr));
}

function squiggle(arr) {
    var t = 40 * Math.sin(tick / 60);
    var u = 20 * Math.sin(tick / 120);
    var z = 200;
    for (var ang = 0; ang < 6.26; ang += 6.28 / 600) {
        var x = z * Math.cos(ang) + 40 * Math.cos(ang * 6) + 40 * Math.cos(ang * 20);
        var y = -z * Math.sin(ang) - 40 * Math.sin(ang * 6) + 40 * Math.sin(ang * 20);
        arr.push(new PVector(x, y));
    }
}

var array_aa = [];
var array_ab = [];
var array_ba = [];
var array_bb = [];
var array_ca = [];
var array_cb = [];
var array_da = [];
var array_db = [];

function aline(arr, x1, y1, x2, y2, s) {
    for (i = 0; i < s; i++) {
        var b = i / s;
        var x = x1 * (1 - b) + x2 * b;
        var y = y1 * (1 - b) + y2 * b;
        arr.push(new PVector(x, y));
    }
}

var comet_arr = [];
var comet_angle = 0;
var heart_shape = [];
var star_shape = [];

function init_comet(){
    for(var a=0; a<500;a++){
        var p = new PVector(width*Math.random() - width/2, height*Math.random()-height/2);
        var ang = 6.26 * Math.random();
        var v = Math.random();
        var vv = new PVector(v*Math.cos(ang), v*Math.sin(ang));
        comet_arr.push({
            'p': p,
            'v': vv,
            'count': 150*Math.random()
        });
    }

    var scale = 7;
    for(var a=-3;a<3;a+=0.001){
        var sinmyt = Math.sin(a);
        var xpos = scale * 18 * sinmyt *sinmyt *sinmyt;
        var ypos = -scale * (14 * Math.cos(a) - 5 * Math.cos(2 * a) - 3 * Math.cos(3 * a) - Math.cos(4 * a));
        heart_shape.push(new PVector(xpos,ypos));
    }

    for(var a=0; a<13;){
        var x1 = width*0.3*Math.cos(6.28*a/14);
        var y1 = width*0.3*Math.sin(6.28*a/14);
        a++;
        var x2 = width*0.2*Math.cos(6.28*a/14);
        var y2 = width*0.2*Math.sin(6.28*a/14);
        aline(star_shape,x1,y1,x2,y2,1110);
        x1 = x2;
        y1 = y2;
        a++
        x2 = width*0.3*Math.cos(6.28*a/14);
        y2 = width*0.3*Math.sin(6.28*a/14);
        aline(star_shape,x1,y1,x2,y2,1110);
    }
}


function animate_comet_two(color, vel0, d) {
    dc.fillStyle = color;

    dc.save();
    dc.translate(width / 2, height / 2);
    dc.beginPath();
    comet_arr.forEach(p=>{
        p.p.x += p.v.x;
        p.p.y += p.v.y;
        p.count--;
        if ((p.p.x < -width/2)||(p.p.y < -height/2)||(p.p.x > width/2)||(p.p.y > height/2)||(p.count<0)){
            p.p = new PVector(p.p0.x, p.p0.y);
            p.count = 5*Math.random();
            var ang = 6.28 * Math.random();
            var v = vel0*Math.random();
            p.v = new PVector(v*Math.cos(ang), v*Math.sin(ang));
        }
        dc.moveTo(p.p.x, p.p.y);
        dc.arc(p.p.x, p.p.y, 1, 0, 6.28);
    });
    dc.closePath();
    dc.fill();
    dc.restore();
}

function animate_comet(from_array, color, d) {
    dc.fillStyle = color;

    dc.save();
    dc.translate(width / 2, height / 2);
    dc.beginPath();
    comet_arr.forEach(p=>{
        p.p.x += p.v.x;
        p.p.y += p.v.y;
        p.count--;
        if ((p.p.x < -width/2)||(p.p.y < -height/2)||(p.p.x > width/2)||(p.p.y > height/2)||(p.count<0)){
            p.p.x = width*0.3*Math.cos(6.28*(d+comet_angle)/300);
            p.p.y = width*0.3*Math.sin(6.28*(d+comet_angle)/300);
            p.count = 50*Math.random();
            var ang = 0.5 * Math.random() + 6.28*comet_angle/100;
            comet_angle += 6;
            var v = Math.random();
            p.v = new PVector(v*Math.cos(ang), v*Math.sin(ang));
        }
        dc.moveTo(p.p.x, p.p.y);
        dc.arc(p.p.x, p.p.y, 1, 0, 6.28);
    });
    dc.closePath();
    dc.fill();
    dc.restore();
}

function animate_heart(from_array, color, d) {
    dc.fillStyle = color;

    dc.save();
    dc.translate(width / 2, height / 2);
    dc.beginPath();
    comet_arr.forEach(p=>{
        p.p.x += p.v.x;
        p.p.y += p.v.y;
        p.count--;
        if ((p.p.x < -width/2)||(p.p.y < -height/2)||(p.p.x > width/2)||(p.p.y > height/2)||(p.count<0)){
            n = comet_angle % heart_shape.length;
            p.p.x = heart_shape[n].x;
            p.p.y = heart_shape[n].y;
            p.count = 50*Math.random();
            var ang = 0.5 * Math.random() + 6.28*comet_angle/100;
            comet_angle += 6;
            var v = 2*Math.random();
            p.v = new PVector(v*Math.cos(ang), v*Math.sin(ang));
        }
        dc.moveTo(p.p.x, p.p.y);
        dc.arc(p.p.x, p.p.y, 1, 0, 6.28);
    });
    dc.closePath();
    dc.fill();
    dc.restore();
}

function animate_star(from_array, color, d) {
    dc.fillStyle = color;

    dc.save();
    dc.translate(width / 2, height / 2);
    dc.beginPath();
    comet_arr.forEach(p=>{
        p.p.x += p.v.x;
        p.p.y += p.v.y;
        p.count--;
        if ((p.p.x < -width/2)||(p.p.y < -height/2)||(p.p.x > width/2)||(p.p.y > height/2)||(p.count<0)){
            n = comet_angle % star_shape.length;
            p.p.x = star_shape[n].x;
            p.p.y = star_shape[n].y;

            p.count = 50*Math.random();
//            var ang = 0.5 * Math.random() + 6.28*comet_angle/100;
            var ang = 0.1 * Math.random() + 6.28*comet_angle/100;
            comet_angle += 6;
            var v = 2*Math.random();
            p.v = new PVector(v*Math.cos(ang), v*Math.sin(ang));
        }
        dc.moveTo(p.p.x, p.p.y);
        dc.arc(p.p.x, p.p.y, 1, 0, 6.28);
    });
    dc.closePath();
    dc.fill();
    dc.restore();
}

function animate_array(from_array, to_array, color, d) {
    dc.fillStyle = color;

    dc.save();
    dc.translate(width / 2, height / 2);
    dc.beginPath();
    if (from_array.length > to_array.length) {
        for (var i = 0; i < from_array.length; i++) {
            var bi = Math.floor(to_array.length * i / from_array.length);
            dc.moveTo(from_array[i].x * (1 - d) + to_array[bi].x * d, from_array[i].y * (1 - d) + to_array[bi].y * d);
            dc.arc(from_array[i].x * (1 - d) + to_array[bi].x * d, from_array[i].y * (1 - d) + to_array[bi].y * d, 1, 0, 6.28);
        }
    }
    else {
        for (var i = 0; i < to_array.length; i++) {
            var ai = Math.floor(from_array.length * i / to_array.length);
            dc.moveTo(from_array[ai].x * (1 - d) + to_array[i].x * d, from_array[ai].y * (1 - d) + to_array[i].y * d);
            dc.arc(from_array[ai].x * (1 - d) + to_array[i].x * d, from_array[ai].y * (1 - d) + to_array[i].y * d, 1, 0, 6.28);
        }
    }
    dc.closePath();
    dc.fill();
    dc.restore();
}

function render_array(array, color) {
    dc.fillStyle = color;

    dc.save();
    dc.translate(width / 2, height / 2);
    dc.beginPath();
    for (var i = 0; i < array.length; i++) {
        dc.moveTo(array[i].x, array[i].y);
        dc.arc(array[i].x, array[i].y, 1, 0, 6.28);
    }
    dc.closePath();
    dc.fill();
    dc.restore();
}

function tracelog(str) {
    dc.fillStyle = "black";
    dc.strokeStyle = "black";
    dc.lineWidth = 1.0;
    dc.font = "12px arial";
    //    var xpos=width - (tick%(width*1.4));
    var xpos = 10;//(width - 400) / 2 + width * Math.sin(tick / 60) / 2;
    dc.fillText(str, xpos, 18);
//    dc.strokeText(str, xpos, 48);
}

const ppp = 200;
var comet_tick = 0;

function animateloop() {
    switch (statemachine) {
        case 0:
            array_aa = [];
            var xxx = 0.4 * width;
            var yyy = 0.4 * height;
            var ss = 150;
            aline(array_aa,xxx,yyy,xxx,-yyy,ss);
            aline(array_aa,xxx,-yyy,-xxx,-yyy,ss);
            aline(array_aa,-xxx,-yyy,-xxx,yyy,ss);
            aline(array_aa,-xxx,yyy,xxx,yyy,ss);

            array_ab = [];
            letter(array_ab, "Text", 0);
            shuffle(array_ab);
            letter(array_ca,"Sometext",100);
            shuffle(array_ca);
//            for(var ang=0;ang<6.28;ang+=6.28/600){
//                array_ab.push(new PVector(xxx*Math.cos(ang-3.14/4),-yyy*Math.sin(ang-3.14/4)));
//            }

            array_ba = [];
            var xxx = 0.4 * width;
            var yyy = 0.4 * height;
            var ss = 150;
            aline(array_ba,xxx,yyy,xxx,-yyy,ss);
            aline(array_ba,xxx,-yyy,-xxx,-yyy,ss);
            aline(array_ba,-xxx,-yyy,-xxx,yyy,ss);
            aline(array_ba,-xxx,yyy,xxx,yyy,ss);
            shuffle(array_ba);

            init_comet();

            tick=0;
            statemachine = 4;
            break;
        case 1:
            dc.clearRect(0, 0, width, height);
            animate_array(array_aa, array_ab, "red", 0.5 + 0.5 * Math.cos(3.14 * tick / ppp));
            if (tick>ppp){
                 statemachine++;
                 tick=0;
            }
            break;
        case 2:
            dc.clearRect(0, 0, width, height);
            animate_array(array_ca, array_aa, "red", 0.5 + 0.5 * Math.cos(3.14 * tick / ppp));
            if (tick>ppp){
                statemachine++;
                tick=0;
            }
           break;
        case 3:
            dc.clearRect(0, 0, width, height);
            animate_array(array_ab, array_ca, "red", 0.5 + 0.5 * Math.cos(3.14 * tick / ppp));
            if (tick>ppp){
                statemachine++;
                tick=0;
            }
           break;
        case 4:
            dc.clearRect(0, 0, width, height);
            animate_comet(array_ab, "red", comet_tick);
            if (tick>ppp){
                statemachine++;
                tick=0;
            }
           break;
        case 5:
            dc.clearRect(0, 0, width, height);
            animate_heart(array_ab, "red", comet_tick);
            if (tick>ppp){
                statemachine++;
                tick=0;
                array_da = [];
                array_db = [];
                comet_arr.forEach(p=>{
                    array_da.push(new PVector(p.p.x,p.p.y));
                });
                letter(array_db,"Linear interpolation", -150);
                letter(array_db,"DEMO 2023", -100);
            }
           break;
        case 6:
            dc.clearRect(0, 0, width, height);
            animate_array(array_db, array_da, "red", 0.5 + 0.5 * Math.cos(3.14 * tick / ppp));
            if (tick>ppp){
                statemachine++;
                tick=0;
                comet_arr = [];
                array_db.forEach(c=>{
                    var vel = 0.05*Math.random();
                    var ang = 6.28*Math.random();
                    comet_arr.push({
                       'p': new PVector(c.x, c.y),
                       'p0': new PVector(c.x, c.y),
                       'v': new PVector(vel*Math.cos(ang),vel*Math.sin(ang)),
                       'count' : Math.floor(5*Math.random())
                    });
                });
            }
           break;
        case 7:
            dc.clearRect(0, 0, width, height);
//            animate_array(array_db, array_da, "red", 0);
            animate_comet_two("red", 1, comet_tick);
            if (tick>ppp){
                statemachine++;
                tick=0;
                var a=0;
                comet_arr = [];
                array_db.forEach(c=>{
                    comet_arr.push({
                       'p': c,
                       'v': new PVector(0,0),
                       'count' : Math.floor(190*Math.random())
                    });
                });
            }
            break;
        case 8:
            dc.clearRect(0, 0, width, height);
            animate_star(array_ab, "red", comet_tick);
            if (tick>ppp){
                statemachine++;
                tick=0;
            }
           break;
        case 9:
            dc.clearRect(0, 0, width, height);
            animate_star(array_ab, "red", comet_tick);
            if (tick>ppp){
                statemachine++;
                tick=0;
                array_aa = [];
                array_ab = [];
                comet_arr.forEach(c=>{
                    array_aa.push(c.p);
                    var ang = 6.28*Math.random();
                    array_ab.push(new PVector(width * Math.cos(ang),width * Math.sin(ang)));
                });
            }
           break;
        case 10:
            dc.clearRect(0, 0, width, height);
            animate_array(array_ab, array_aa, "red", 0.5 + 0.5 * Math.cos(3.14 * tick / ppp));
            if (tick>ppp){
                statemachine++;
                tick=0;
                array_db=[];
                letter(array_db,"Chillout", -200);
                letter(array_db,"February 2023", -150);
                letter(array_db,"Henryk Krasuski", -100);
            }
           break;
        case 11:
            dc.clearRect(0, 0, width, height);
            animate_array(array_db, array_ab, "red", 0.5 + 0.5 * Math.cos(3.14 * tick / ppp));
            if (tick>ppp){
                statemachine++;
                tick=0;
                comet_arr = [];
                array_db.forEach(c=>{
                    var vel = 0.05*Math.random();
                    var ang = 6.28*Math.random();
                    comet_arr.push({
                       'p': c,
                       'p0': c,
                       'v': new PVector(vel*Math.cos(ang),vel*Math.sin(ang)),
                       'count' : Math.floor(5*Math.random())
                    });
                });
            }
           break;
        case 12:
            dc.clearRect(0, 0, width, height);
            animate_comet_two("red", 1, comet_tick);
            if (tick>ppp){
                statemachine++;
                tick=0;
            }
           break;
        case 13:
            dc.clearRect(0, 0, width, height);
            animate_comet_two("red", 2, comet_tick);
            if (tick>ppp){
                statemachine++;
                tick=0;
                array_ba = [];
                var xxx = 0.4 * width;
                var yyy = 0.4 * height;
                var ss = 150;
                aline(array_ba,xxx,yyy,xxx,-yyy,ss);
                aline(array_ba,xxx,-yyy,-xxx,-yyy,ss);
                aline(array_ba,-xxx,-yyy,-xxx,yyy,ss);
                aline(array_ba,-xxx,yyy,xxx,yyy,ss);
                shuffle(array_ba);
            }
            break;
        case 14:
            dc.clearRect(0, 0, width, height);
            animate_array(array_ba, array_db, "red",  0.5 + 0.5 * Math.cos(3.14 * tick / ppp));
            if (tick>ppp){
                statemachine++;
                tick=0;
                comet_arr = [];
                array_ba.forEach(c=>{
                    var vel = 0.1*Math.random();
                    var ang = 6.28*Math.random();
                    comet_arr.push({
                        'p': c,
                        'p0': c,
                        'v': new PVector(vel*Math.cos(ang),vel*Math.sin(ang)),
                        'count' : Math.floor(5*Math.random())
                    });
                });
            }
            break;
        case 15:
            dc.clearRect(0, 0, width, height);
            animate_comet_two("red", 3,comet_tick);
            if (tick>ppp){
                statemachine++;
                tick=0;
                var a=0;
            }
            break;
        default:
            statemachine = 4;
    }
    tracelog("statemachine:" + statemachine + "  tick:" + tick);
    tick++;
    comet_tick++;
}

function canvas_keyup(ev) {
    switch (ev.keyCode) {
        case 87: // w
            // goodboi.move_key = false;
            break;
    }
}

function canvas_click(ev) {
}

function canvas_mouseup(ev) {
}

function canvas_mousedown(ev) {
}

function canvas_mousemove(ev) {
}

/**
 * PVector class
 */
class PVector {
    //x = 0;
    //    y = 0;

    constructor(x_, y_) {
        this.x = x_;
        this.y = y_;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    mult(f) {
        this.x *= f;
        this.y *= f;
    }

    set(x_, y_) {
        this.x = x_;
        this.y = y_;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    div(n) {
        this.x /= n;
        this.y /= n;
    }

    normalize() {
        var m = this.mag();
        if (m != 0) {
            this.div(m);
        }
    }

    angle() {
        var ang = (Math.asin(this.y) < 0) ? Math.PI / 2 - Math.acos(this.x) + Math.PI : Math.PI / 2 + Math.acos(this.x) + Math.PI;
        return ang;
    }

    static random2D() {
        var angle = 2 * Math.PI * Math.random();
        return (new PVector(Math.cos(angle), Math.sin(angle)));
    }

    dist(p) {
        var dx = this.x - p.x;
        var dy = this.y - p.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    limit(max) {
        if (this.mag() > max) {
            this.normalize();
            this.mult(max);
        }
    }
}

 // ===================================================
// Main - Program starts here
// ===================================================

const size=800;
const canvas = document.getElementById("id75-canvas");
const width = canvas.width = size;
const height = canvas.height = size;
const dc = canvas.getContext("2d");
//var mouse = new PVector(0, 0);

canvas.oncontextmenu = function (e) {
    e.preventDefault();
};
//document.addEventListener("keydown", canvas_keydown, false);
//document.addEventListener("keyup", canvas_keyup, false);
window.setInterval(animateloop, 1000 / 60);

