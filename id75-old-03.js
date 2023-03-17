window.addEventListener('load', function() {
    // canvas setup
      const canvas = document.getElementById('id75-canvas');
      const dc = canvas.getContext('2d', {
        willReadFrequently: true
      });
      console.log(dc)
      canvas.width = window.innerWidth-10;
      canvas.height = window.innerHeight-10;

      class Particle {
        constructor(effect, x, y, color){
            this.effect = effect;
            //this.x = Math.random() * this.effect.canvasWidth;
            //this.y = Math.random() * this.effect.canvasHeight;
            this.x = 0;
            this.y = Math.random() * this.effect.canvasHeight;
            this.originX = x;
            this.originY = y;
            this.size = this.effect.gap;
            this.color = color;
            this.dx = 0;
            this.dy = 0;
            this.vx = 0;
            this.vy = 0;
            this.force = 0;
            this.angle = 0;
            this.distance = 0;
            this.friction = Math.random() * 0.2 + 0.15;
            this.ease = Math.random() * 0.5 + 0.005;
        }
        update(){
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = -this.effect.mouse.radius / this.distance;
            if(this.distance < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }
            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        }
        updateMus(){
          this.dx = this.effect.mus.x - this.x;
          this.dy = this.effect.mus.y - this.y;
          this.distance = this.dx * this.dx + this.dy * this.dy;
          this.force = -this.effect.mus.radius / this.distance;
          this.angle = Math.atan2(this.dy, this.dx);
          this.vx += this.force * Math.cos(this.angle) * 0.005;
          this.vy += this.force * Math.sin(this.angle) * 0.005;
          this.x += this.vx;
          this.y += this.vy;
        }
        updateBoom(){
          this.dx = this.effect.mus.x - this.x;
          this.dy = this.effect.mus.y - this.y;
          this.distance = this.dx * this.dx + this.dy * this.dy;
          this.force = -2-Math.random()*4;
          this.angle = Math.atan2(this.dy, this.dx);
          this.vx += this.force * Math.cos(this.angle);
          this.vy += this.force * Math.sin(this.angle);
          this.x += this.vx;
          this.y += this.vy;
        }
        updateBoom2(){
            this.x += this.vx;
            this.y += this.vy;
        }
        draw(){
          // only change colours when this colour is different than previous
          this.effect.context.fillStyle = this.color;
          this.effect.context.fillRect(this.x, this.y, this.size, this.size);
        }
      }

      
      class SpiralParticle {
        static tick = 0.1;
        constructor(effect, x, y, color){
            this.effect = effect;
            //this.x = Math.random() * this.effect.canvasWidth;
            //this.y = Math.random() * this.effect.canvasHeight;
            this.x = this.effect.canvasWidth / 2;
            this.y = this.effect.canvasHeight / 2;
            this.size = 2 + Math.random()*8;
            this.color = color;
            this.angle = 6.28 * Math.random();
            this.velocity = 2 + Math.random()*8;
            this.vx = this.velocity * Math.cos(this.angle);
            this.vy = this.velocity * Math.sin(this.angle);
        }
        update(){
          this.x += this.vx;
          this.y += this.vy;
          if ((this.x < 0)||(this.y < 0)||(this.x > this.effect.canvasWidth)||(this.y > this.effect.canvasHeight)){
            this.x = this.effect.canvasWidth / 2;
            this.y = this.effect.canvasHeight / 2;
            this.size = 2 + Math.random()*8;
            this.angle = 0.1 * Math.random() + SpiralParticle.tick;
            SpiralParticle.tick += 0.05;// * Math.random();
            this.velocity = 8 + Math.random()*2;
            this.vx = this.velocity * Math.cos(this.angle);
            this.vy = this.velocity * Math.sin(this.angle);
          }
        }
        updateAndClear(){
          if ((this.x < -20)||(this.y < -20)||(this.x > 20+this.effect.canvasWidth)||(this.y > 20+this.effect.canvasHeight)){
            this.vx = this.velocity * Math.cos(this.angle);
            this.vy = this.velocity * Math.sin(this.angle);
          }
          else {
            this.x += this.vx;
            this.y += this.vy;
          }
        }
        draw(){
          // only change colours when this colour is different than previous
          this.effect.context.fillStyle = this.color;
          this.effect.context.beginPath();
          this.effect.context.arc(this.x, this.y, this.size, 0, 6.28);
          this.effect.context.fill();
        }
      }
  
      class Effect {
        static tick = 0;
        static state = 0;
        constructor(context, canvasWidth, canvasHeight){
          this.context = context;
          this.canvasWidth = canvasWidth;
          this.canvasHeight = canvasHeight;
          this.maxTextWidth = this.canvasWidth * 0.8;
          this.fontSize = 100;
          this.textVerticalOffset = 0;
          this.lineHeight = this.fontSize * 1.2;
          this.textX = this.canvasWidth / 2;
          this.textY = this.canvasHeight / 2 - this.lineHeight / 2;
          
          this.spiral = [];
          for(let i=0;i<250;i++){
            const r = 127 + Math.floor(128 * Math.random());
            const g = 127 + Math.floor(128 * Math.random());
            const b = 127 + Math.floor(128 * Math.random());
            this.spiral.push(new SpiralParticle(this,0,0,"rgb(" + r + "," + g + "," + b + ")"));
          }

          this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
          this.letter("Hello world|From all of us|To all of you");
          this.particles = [];
          this.gap = 5;
          this.convertToParticles();
          this.HelloWorldTextArray = this.particles;

          this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
          this.letter("Made by|henryk.dk|March 2023");
          this.particles = [];
          this.gap = 5;
          this.convertToParticles();
          this.MadeByTextArray = this.particles;

          this.mouse = {
            radius: 20000,
            x: 0,
            y: 0
          }
          this.mus = {
            radius: 200000,
            x: this.canvasWidth/2,
            y: this.canvasHeight/2
          }
          window.addEventListener("mousemove", e => {
              this.mouse.x = e.x;
              this.mouse.y = e.y;
          });
        }
        letter(str) {
          var lstr = str.split("|");
          this.context.strokeStyle = "black";
          this.context.fillStyle = "black";
          this.context.lineWidth = 1.0;
          this.context.font = "148px Russo One";
          var dy = 150;
          var ysize = dy*lstr.length;
          var y = (this.canvasHeight-ysize)/2 + dy;
          lstr.forEach(element => {
              var w = this.context.measureText(element).width;
              this.context.fillText(element, (this.canvasWidth-w)/2, y);
              y+=dy;
          });
        }
        convertToParticles(){
          this.particles = [];
          const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
          for(let y = 0; y < this.canvasHeight; y += this.gap) {
              for(let x = 0; x < this.canvasWidth; x += this.gap) {
                  const index = (y * this.canvasWidth + x) * 4;
                  const alpha = pixels[index + 3];
                  if(alpha > 0) {
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];
                    const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                    this.particles.push(new Particle(this, x, y, color));
                  }
              }
          }
          this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
        render(){
          switch(Effect.state){
            case 0:
              this.MadeByTextArray.forEach(particle => {
                particle.update();
                particle.draw();
              });
              break;
            case 0:
              this.spiral.forEach(particle => {
                particle.update();
                particle.draw();
              })
              this.HelloWorldTextArray.forEach(particle => {
                particle.update();
                particle.draw();
              })
              if (Effect.tick > 250){
                Effect.state = 1;
                Effect.tick = 0;
              }              
              break;
            case 1:
              this.spiral.forEach(particle => {
                particle.update();
                particle.draw();
              })
              this.HelloWorldTextArray.forEach(particle => {
                particle.updateMus();
                particle.draw();
              })
              if (Effect.tick > 750){
                Effect.state = 2;
                Effect.tick = 0;
              }              
              break;
            case 2:
              this.spiral.forEach(particle => {
                particle.update();
                particle.draw();
              })
              this.HelloWorldTextArray.forEach(particle => {
                particle.update();
                particle.draw();
              })
              if (Effect.tick > 250){
                Effect.state = 3;
                Effect.tick = 0;
              }              
              break;
            case 3:
              this.spiral.forEach(particle => {
                particle.update();
                particle.draw();
              })
              this.HelloWorldTextArray.forEach(particle => {
                particle.updateBoom();
                particle.draw();
              })
              Effect.state = 4;
              Effect.tick = 0;
              break;
            case 4:
              this.spiral.forEach(particle => {
                particle.updateAndClear();
                particle.draw();
              })
              this.HelloWorldTextArray.forEach(particle => {
                particle.updateBoom2();
                particle.draw();
              })
              if (Effect.tick>250){
                Effect.state = 5;
                Effect.tick = 0;
              }
              break;
            case 5:
              break;
            }

          Effect.tick++;
        }
      }
      
      let effect = new Effect(dc, canvas.width, canvas.height);
      function animate() {
        dc.clearRect(0, 0, canvas.width, canvas.height);
        effect.render();
        requestAnimationFrame(animate);
      }
      animate();
  
      window.addEventListener('resize', function(){
        canvas.width = window.innerWidth-10;
        canvas.height = window.innerHeight-10;
          effect = new Effect(dc, canvas.width, canvas.height);
      });
  });