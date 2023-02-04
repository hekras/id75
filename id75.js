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

function letter(str) {
    var lstr = str.split("|");
    dc.fillStyle = "beige";
    dc.fillRect(0, 0, size, size);
    dc.strokeStyle = "black";
    dc.fillStyle = "black";
    dc.lineWidth = 1.0;
    dc.font = "48px Russo One";
    var dy = 50;
    var ysize = dy*lstr.length;
    var y = (size-ysize)/2+dy;
    lstr.forEach(element => {
        var w = dc.measureText(element).width;
        dc.fillText(element, (width-w)/2, y);
        y+=dy;
    });
}

function circle(radius) {
    dc.fillStyle = "beige";
    dc.fillRect(0, 0, size, size);
    dc.strokeStyle = "black";
    dc.fillStyle = "black";
    dc.lineWidth = 10.0;
    dc.beginPath();
    dc.arc(size/2,size/2, radius, 0, 6.28);
    dc.stroke();
}

function square() {
    dc.fillStyle = "beige";
    dc.fillRect(0, 0, size, size);
    dc.strokeStyle = "black";
    dc.fillStyle = "black";
    dc.lineWidth = 10.0;
    dc.beginPath();
    dc.rect(20,20, size-40, size-40);
    dc.stroke();
}

function heart(){
    dc.fillStyle = "beige";
    dc.fillRect(0, 0, size, size);
    dc.strokeStyle = "black";
    dc.fillStyle = "black";
    dc.lineWidth = 10.0;
    dc.beginPath();
    var scale = 10;
    var radius = 2;
    for(var a=-3;a<3;a+=0.001){
        var sinmyt = Math.sin(a);
        var xpos = size/2 + scale * 18 * sinmyt *sinmyt *sinmyt;
        var ypos = size/2 + (-scale * (14 * Math.cos(a) - 5 * Math.cos(2 * a) - 3 * Math.cos(3 * a) - Math.cos(4 * a)));
        dc.moveTo(xpos,ypos)
        dc.arc(xpos,ypos, radius, 0, 6.28);
    }
    dc.stroke();
}

function star(){
    dc.fillStyle = "beige";
    dc.fillRect(0, 0, size, size);
    dc.strokeStyle = "black";
    dc.fillStyle = "black";
    dc.lineWidth = 10.0;
    dc.beginPath();
    var a=0;
    var r1=0.45;
    var r2=0.1;
    var x1 = size/2 + size*r1*Math.cos(6.28*a/14);
    var y1 = size/2 + size*r1*Math.sin(6.28*a/14);
    a++;
    dc.moveTo(x1,y1);
    for(; a<15;){
        var x2 = size/2 + size*r2*Math.cos(6.28*a/14);
        var y2 = size/2 + size*r2*Math.sin(6.28*a/14);
        dc.lineTo(x2,y2);
        a++
        x2 = size/2 + size*r1*Math.cos(6.28*a/14);
        y2 = size/2 + size*r1*Math.sin(6.28*a/14);
        dc.lineTo(x2,y2);
        a++;
    }
    dc.stroke();
}

function image(){
    var big_image = document.getElementById("picture");
    dc.fillStyle = "beige";
    dc.fillRect(0, 0, size, size);
    dc.save();
    dc.scale(0.5,0.5);
    dc.drawImage(big_image, 0, 0);
    dc.restore();
}

var statemachine = -1;
var tick=0;
var tickmax=255;
var title_arr = [];
var circle_arr = [];
var star_arr = [];
var heart_arr = [];
var face_arr = [];
var square_arr = [];
var particles = [];

function scanner(arr){
    for (y = 0; y < size; y++) {
        for (x = 0; x < size; x++) {
            if (!dc.getImageData(x, y, 1, 1).data[0]) {
                arr.push({p:new PVector(x,y)});
            }
        }
    }
}

function animate_array(to_array, from_array, color, d) {
    dc.fillStyle = color;

    dc.beginPath();
    if (from_array.length > to_array.length) {
        for (var i = 0; i < from_array.length; i++) {
            var bi = Math.floor(to_array.length * i / from_array.length);
            dc.moveTo(from_array[i].p.x * (1 - d) + to_array[bi].p.x * d, from_array[i].p.y * (1 - d) + to_array[bi].p.y * d);
            dc.arc(from_array[i].p.x * (1 - d) + to_array[bi].p.x * d, from_array[i].p.y * (1 - d) + to_array[bi].p.y * d, 1, 0, 6.28);
        }
    }
    else {
        for (var i = 0; i < to_array.length; i++) {
            var ai = Math.floor(from_array.length * i / to_array.length);
            dc.moveTo(from_array[ai].p.x * (1 - d) + to_array[i].p.x * d, from_array[ai].p.y * (1 - d) + to_array[i].p.y * d);
            dc.arc(from_array[ai].p.x * (1 - d) + to_array[i].p.x * d, from_array[ai].p.y * (1 - d) + to_array[i].p.y * d, 1, 0, 6.28);
        }
    }
    dc.closePath();
    dc.fill();
}

function animateloop() {
    switch(statemachine){
        case 0:
            circle(180);
            scanner(circle_arr);
            star();
            scanner(star_arr);
            shuffle(star_arr);
            heart()
            scanner(heart_arr);
            shuffle(heart_arr);
            image();
            scanner(face_arr);
            shuffle(face_arr);
            square();
            scanner(square_arr);
            shuffle(square_arr);
            letter("HELLO WORLD|2023|PARTICLES|NEXT LEVEL|BY HENRYK.DK|AND SON");
            scanner(title_arr);
            for(var n=0;n<5000;n++){
                var m = Math.floor(Math.random()*title_arr.length);
                var angle = 6.28*Math.random();
                var velocity = Math.random();
                particles.push({
                    p: new PVector(title_arr[m].p.x, title_arr[m].p.y),
                    v: new PVector(velocity*Math.cos(angle),velocity*Math.sin(angle)),
                    count: Math.floor(10*Math.random()),
                });
            }
            statemachine++;
            tick=0;
//            statemachine=-1;
            break;
        case 1:
            statemachine++;
            tick=0;
            break;
        case 2:
            dc.clearRect(0, 0, size, size);
            dc.save();
            dc.beginPath();
            particles.forEach(e=>{
                e.p.add(e.v);
                e.count--;
                if ((e.p.x<0)||(e.p.y<0)||(e.p.x>size)||(e.p.y>size)||(e.count < 0)){
                    var m = Math.floor(Math.random()*title_arr.length);
                    var angle = 6.28*Math.random();
                    var velocity = 0.5*Math.random();
                    e.p = new PVector(title_arr[m].p.x, title_arr[m].p.y);
                    e.v = new PVector(velocity*Math.cos(angle),velocity*Math.sin(angle));
                    e.count = Math.floor(10*Math.random());
                }
                dc.moveTo(e.p.x, e.p.y);
                dc.arc(e.p.x, e.p.y, 1, 0, 6.28);
            })
            dc.closePath();
            dc.fill();
            dc.restore();
            if (tick > tickmax){
                statemachine++;
                tick = 0;
            }
            break;
        case 3:
            dc.clearRect(0, 0, width, height);
            animate_array(particles, circle_arr, "black", 0.5 + 0.5 * Math.cos(3.14 * tick / tickmax));
            if (tick>tickmax){
                statemachine++;
                tick=0;
            }
           break;
        case 4:
            dc.clearRect(0, 0, width, height);
            animate_array( circle_arr, star_arr, "black", 0.5 + 0.5 * Math.cos(3.14 * tick / tickmax));
            if (tick>tickmax){
                statemachine++;
                tick=0;
            }
           break;
        case 5:
            dc.clearRect(0, 0, width, height);
            animate_array( star_arr, heart_arr, "black", 0.5 + 0.5 * Math.cos(3.14 * tick / tickmax));
            if (tick>tickmax){
                statemachine++;
                tick=0;
            }
           break;
        case 6:
            dc.clearRect(0, 0, width, height);
            animate_array( heart_arr, face_arr, "black", 0.5 + 0.5 * Math.cos(3.14 * tick / tickmax));
            if (tick>tickmax){
                statemachine++;
                tick=0;
            }
           break;
        case 7:
            dc.clearRect(0, 0, width, height);
            animate_array( face_arr, square_arr, "black", 0.5 + 0.5 * Math.cos(3.14 * tick / tickmax));
            if (tick>tickmax){
                statemachine++;
                tick=0;
            }
           break;
        case 8:
            dc.clearRect(0, 0, width, height);
            animate_array( square_arr, title_arr, "black", 0.5 + 0.5 * Math.cos(3.14 * tick / tickmax));
            if (tick>tickmax){
                statemachine++;
                tick=0;
            }
           break;

    }
    tick++;
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

const size=400;
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
statemachine = 0;

