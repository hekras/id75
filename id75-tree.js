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

class PScrap{
    constructor(x,y,color){
        this.p = [x,y];
        this.angle = Math.random() * 6.28;
        this.velocity = 1 + Math.random() * 10;
        this.dt = [
            this.velocity * Math.cos(this.angle),
            this.velocity * Math.sin(this.angle)
        ];
        this.size = 5;
        const green = Math.floor(10+240*Math.random());
        this.color = color;
    }

    update(){
        this.p[0] += this.dt[0];
        this.p[1] += this.dt[1];
    }

    render(dc){
        dc.fillStyle = this.color;
        dc.fillRect(...this.p, this.size, this.size);
    }

    outside(){
        return ((this.p[0]<0)|(this.p[1]<0)|(this.p[0]>canvas.width)|(this.p[1]>canvas.height));
    }
}

class PLeaf{
    constructor(x,y){
        this.p = [x,y];
        this.angle = Math.random() * 6.28;
        this.velocity = Math.random() * 2;
        this.counter = Math.floor(1 + Math.random() * 3);
        this.dt = [
            this.velocity * Math.cos(this.angle),
            this.velocity * Math.sin(this.angle)
        ];
        this.size = 5;
        const green = Math.floor(10+240*Math.random());
        this.color = "rgba(0," + green + ",0,30)";
    }

    update(){
        this.p[0] += this.dt[0];
        this.p[1] += this.dt[1];
        this.counter--;
    }

    render(dc){
        dc.fillStyle = this.color;
        dc.fillRect(...this.p, this.size, this.size);
    }

    outside(){
        return ((this.counter<0)|(this.p[0]<0)|(this.p[1]<0)|(this.p[0]>canvas.width)|(this.p[1]>canvas.height));
    }
}

class PParticle{
    constructor(x,y,angle,color){
        this.p = [x,y];
        this.angle = angle + ( Math.random() * 0.2 - 0.1);
        this.velocity = Math.random() * 2;
        this.counter = Math.floor(20 + Math.random() * 30);
        this.dt = [
            this.velocity * Math.cos(this.angle),
            this.velocity * Math.sin(this.angle)
        ];
        this.size = 3;
        this.color = color;
    }

    update(){
        this.p[0] += this.dt[0];
        this.p[1] += this.dt[1];
        this.counter--;
    }

    render(dc){
        dc.fillStyle = this.color;
        dc.fillRect(...this.p, this.size, this.size);
    }

    outside(){
        return ((this.counter<0)|(this.p[0]<0)|(this.p[1]<0)|(this.p[0]>canvas.width)|(this.p[1]>canvas.height));
    }
}

var tickmax=255;
var title_arr = [];
var flower_arr = [];

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

function scanner(arr){
    var pixels = dc.getImageData(0,0,canvas.width, canvas.height).data;
    for(let y=0;y<canvas.height;y++){
        for(let x=0;x<canvas.width;x++){
            const i = (y*canvas.width + x) * 4;
            const alpha = pixels[i+3];
            if ((alpha>0)&&(Math.random()<0.2)){
                const r = pixels[i];
                const g = pixels[i+1];
                const b = pixels[i+2];
                arr.push({p:new PVector(x,y), color:"rgb(" + r + "," + g + "," + b + ")"});
            }
        }
    }
}

function letter(str) {
    var lstr = str.split("|");
    dc.fillStyle = "green";
    dc.strokeStyle = "green";
    dc.lineWidth = 1.0;
    dc.font = "100px Russo One";
    var dy = 102;
    var ysize = dy*lstr.length;
    var y = (canvas.height-ysize)/2+dy;
    lstr.forEach(element => {
        var w = dc.measureText(element).width;
        dc.fillText(element, (width-w)/2, y);
        y+=dy;
    });
}

function animate_array(to_array, from_array, d) {
    if (from_array.length > to_array.length) {
        for (var i = 0; i < from_array.length; i++) {
            var bi = Math.floor(to_array.length * i / from_array.length);
            var c = [from_array[i].p.x + (to_array[bi].p.x - from_array[i].p.x) * d, from_array[i].p.y + (to_array[bi].p.y - from_array[i].p.y) * d];
            dc.fillStyle = from_array[i].color;
            dc.fillRect(...c, 2, 2);
        }
    }
    else {
        for (var i = 0; i < to_array.length; i++) {
            var ai = Math.floor(from_array.length * i / to_array.length);
            var c = [from_array[ai].p.x * (1 - d) + to_array[i].p.x * d, from_array[ai].p.y * (1 - d) + to_array[i].p.y * d];
            dc.fillStyle = from_array[ai].color;
            dc.fillRect(...c, 2, 2);
        }
    }
}



var statemachine = 0;
var particles = [];
var tick=0;
var iterationer = 0;
var colorarr = ["#00000030", "#30000030", "#60000030", "#a0f00030", "#ffff0030", "#ff000030", "#80800030", "#ff000030", "#ffff0030", "#a0f0ff30"];
function animateloop() {
    switch(statemachine){
        case 0:
            dc.clearRect(0,0,canvas.width,canvas.height);
            letter("HELLO WORLD|2023|PARTICLES|NEXT LEVEL|BY HENRYK.DK");
            title_arr = [];
            scanner(title_arr);
            dc.clearRect(0,0,canvas.width,canvas.height);
            tick = 0;
            iterationer = 1;
            for(let i=0;i<10;i++){
                particles.push( new PParticle(canvas.width/2, canvas.height/2,6.28*i/10, colorarr[iterationer]));
            }
            statemachine++;
            break;
        case 1:
            var pp = [];
            particles.forEach((p, index) =>{
                p.render(dc);
                p.update();
                if (p.outside()){
                    if (pp.length<50000){
                        pp.push( new PParticle(p.p[0],p.p[1],p.angle + 0.2, colorarr[iterationer]));
                        pp.push( new PParticle(p.p[0],p.p[1],p.angle - 0.2, colorarr[iterationer]));
                    }   
                }
                else {
                    pp.push(p);
                }
            });
            particles = pp;
            tick++;
            if (tick > Math.min(canvas.width, canvas.height)/3){
                particles=[];
                for(let i=0;i<10;i++){
                    particles.push( new PParticle(canvas.width/2, canvas.height/2,6.28*i/10));
                }
                iterationer--;
                if (iterationer > 0){
                    tick = 0
                }else{
                    statemachine++;
                    tick=tickmax;
                    flower_arr = [];
                    scanner(flower_arr);
                    shuffle(flower_arr);
                }
            }
            break;
        case 22:
            dc.clearRect(0, 0, width, height);
            animate_array(title_arr, flower_arr, 0.5 + 0.5 * Math.cos(3.14 * tick / tickmax));
            tick--;
            if (tick==0){
                statemachine++;
                tick=0;
            }
           break;
            break;
        case 2: // old 2
            var pp = [];
            var pixels = dc.getImageData(0,0,canvas.width, canvas.height).data;
            for(let y=0;y<canvas.height;y++){
                for(let x=0;x<canvas.width;x++){
                    const i = (y*canvas.width + x) * 4;
                    const alpha = pixels[i+3];
                    if ((alpha>0)&&(Math.random()<0.5)){
                        pp.push(new PLeaf(x,y));
                    }
                }
            }
            particles = pp;
            statemachine++;
            break;
        case 3:
            var pp=[];
            particles.forEach((p, index) =>{
                p.render(dc);
                p.update();
                if (!p.outside()){
                    pp.push(p);
                }
            });
            particles = pp;
            if (particles.length == 0){
                statemachine++;
                tick = 0;
            }
            break;
        case 4:
            tick++;
            if (tick>200){
                statemachine++;
            }
            break;
        case 5:
            var pp = [];
            var pixels = dc.getImageData(0,0,canvas.width, canvas.height).data;
            for(let y=0;y<canvas.height;y++){
                for(let x=0;x<canvas.width;x++){
                    const i = (y*canvas.width + x) * 4;
                    const alpha = pixels[i+3];
                    if ((alpha>0)&&(Math.random()<0.1)){
                        const r = pixels[i];
                        const g = pixels[i+1];
                        const b = pixels[i+2];
                        pp.push(new PScrap(x,y,"rgb(" + r + "," + g + "," + b + ")"));
                    }
                }
            }
            particles = pp;
            statemachine++;
            break;
        case 6:
            dc.clearRect(0,0,canvas.width,canvas.height);
            var pp=[];
            particles.forEach((p, index) =>{
                p.render(dc);
                p.update();
                if (!p.outside()){
                    pp.push(p);
                }
            });
            particles = pp;
            if (particles.length < 10){
                statemachine++;
                tick = 0;
            }
            break;
        case 7:
            tick++;
            if (tick>50){
                particles=[];
                statemachine=0;
            }
            break;
    }
}



// ===================================================
// Main - Program starts here
// ===================================================

const canvas = document.getElementById("id75-canvas");
var width;
var height;
const dc = canvas.getContext("2d");
//var mouse = new PVector(0, 0);

canvas.oncontextmenu = function (e) {
    e.preventDefault();
};

window.addEventListener('load', function(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

window.addEventListener('resize', function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});
//document.addEventListener("keydown", canvas_keydown, false);
//document.addEventListener("keyup", canvas_keyup, false);
window.setInterval(animateloop, 1000 / 60);
statemachine = 0;
