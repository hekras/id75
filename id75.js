window.addEventListener('load', function() {
    // canvas setup
      const canvas = document.getElementById('id75-canvas');
      const dc = canvas.getContext('2d', {
        willReadFrequently: true
      });
      const gap = 2;
 //     console.log(dc)
      canvas.width = window.innerWidth-10;
      canvas.height = window.innerHeight-10;

      class Particle{
        constructor(x,y,color){
          this.x = x;
          this.y = y;
          this.color = color;
          this.dx = canvas.width/2 - this.x;
          this.dy = canvas.height/2 - this.y;
          this.force = -2-Math.random()*4;
          this.angle = Math.atan2(this.dy, this.dx);
          this.vx = this.force * Math.cos(this.angle);
          this.vy = this.force * Math.sin(this.angle);
        }
        draw(){
          dc.fillStyle = this.color;
          dc.fillRect(this.x,this.y,gap,gap);
        }
        update(){
          this.x += this.vx;
          this.y += this.vy;
        }
        downdate(){
          this.x -= this.vx;
          this.y -= this.vy;
        }
      }
      function fillText(str) {
        var lstr = str.split("|");
        dc.strokeStyle = "black";
        dc.fillStyle = "black";
        dc.lineWidth = 1.0;
        dc.font = "148px Russo One";
        var dy = 150;
        var ysize = dy*lstr.length;
        var y = (canvas.height-ysize)/2 + dy;
        lstr.forEach(element => {
            var w = dc.measureText(element).width;
            dc.fillText(element, (canvas.width-w)/2, y);
            y+=dy;
        });
      }
      function textToArray(str) {
        dc.clearRect(0,0,canvas.width,canvas.height);
        fillText(str);
        let arr = [];
        const pixels = dc.getImageData(0, 0, canvas.width, canvas.height).data;
        for(let y = 0; y < canvas.height; y += gap) {
            for(let x = 0; x < canvas.width; x += gap) {
                const index = (y * canvas.width + x) * 4;
                const alpha = pixels[index + 3];
                if(alpha > 0) {
                  const red = pixels[index];
                  const green = pixels[index + 1];
                  const blue = pixels[index + 2];
                  const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                  arr.push(new Particle(x, y, color));
                }
            }
        }
        return arr;
      }

      const flag = new Image();
      flag.src = "./images/denmark-flag-medium.png";
      const madebytext = "Made by|henryk.dk|March 2023";
      let happybdtext = "Tillykke med|fødselsdagen";
      let madebytextarray = textToArray(madebytext);
      let happybdtextarray = textToArray(happybdtext);
      for(let i=0;i<251;i++){
        happybdtextarray.forEach(e=>{
          e.update();
        })
      }
      for(let i=0;i<251;i++){
        madebytextarray.forEach(e=>{
          e.update();
        })
      }
      let state = 0;
      let tick;
      function animate() {
        // dc.clearRect(0, 0, canvas.width, canvas.height);
        dc.clearRect(0,0,canvas.width,canvas.height);

        dc.fillStyle = "black";
        dc.font = "14px Russo One";
//        dc.fillText("State="+state+" tick:"+tick, 20, 20);

        switch(state){
          case 0:
            state++;
            tick = 250;
            break;
          case 1:
            madebytextarray.forEach(e=>{
              e.downdate();
              e.draw();
            });
            if (--tick < 0){
              tick = 200;
              state++;
            }
            break;
          case 2:
            fillText(madebytext);
            if (--tick < 0){
              tick = 149;
              state++;
            }
            break;
          case 3:
            fillText(madebytext);
            happybdtextarray.forEach(e=>{
              e.downdate();
              e.draw();
            });
            if (--tick < 0){
              tick = 100;
              state++;
            }
            break;
          case 4:
            madebytextarray.forEach(e=>{
              e.update();
              e.draw();
            });
            happybdtextarray.forEach(e=>{
              e.downdate();
              e.draw();
            });
            if (--tick < 0){
              tick = 250;
              state++;
            }
            break;
          case 5:
            madebytextarray.forEach(e=>{
              e.update();
              e.draw();
            });
            fillText(happybdtext)
            if (--tick < 0){
              star = [];
              for (var i = 0; i < 30; i++) {
                  star[i] = {
                      x: Math.random() * canvas.width,
                      y: -200-Math.random() * canvas.height,
                      dy: Math.random() * 5,
                      size: 0.2,
                      dsize: 1 - 0.01 * Math.random(),
                      maxscale: 0.1,
                      targetangle: 0.5,
                      dangle: Math.random() * 0.03,
                      mangle: Math.random() * 3.1457,
                  };
              }
              state++;
            }
            break;
          case 6:
            for (var i = 0; i < star.length; i+=2) {
              dc.save();
              dc.translate(star[i].x, star[i].y);
              var scale = star[i].size;
              dc.scale(scale, scale);
              dc.rotate(star[i].mangle);
              dc.translate(-flag.width / 2, - flag.height / 2);
              dc.drawImage(flag, 0, 0);
              dc.restore();
              star[i].y += star[i].dy;
              star[i].mangle += star[i].dangle;
              star[i].size *= star[i].dsize;
              if ((star[i].y > canvas.height + 80.0) || (star[i].size < 0.005)) {
                  star[i] = {
                      x: Math.random() * canvas.width,
                      y: -200,
                      dy: 1.5 + Math.random() * 8,
                      size: 0.2,
                      dsize: 1 - 0.01 * Math.random(),
                      maxscale: 0.1,
                      targetangle: 0.5,
                      dangle: 0.1 * (Math.random() - 0.5),
                      mangle: Math.random() * 3.1457,
                  };
              }
            }
            fillText(happybdtext)
            for (var i = 1; i < star.length; i+=2) {
              dc.save();
              dc.translate(star[i].x, star[i].y);
              var scale = star[i].size;
              dc.scale(scale, scale);
              dc.rotate(star[i].mangle);
              dc.translate(-flag.width / 2, - flag.height / 2);
              dc.drawImage(flag, 0, 0);
              dc.restore();
              star[i].y += star[i].dy;
              star[i].mangle += star[i].dangle;
              star[i].size *= star[i].dsize;
              if ((star[i].y > canvas.height + 80.0) || (star[i].size < 0.005)) {
                  star[i] = {
                      x: Math.random() * canvas.width,
                      y: -200,
                      dy: 1.5 + Math.random() * 8,
                      size: 0.2,
                      dsize: 1 - 0.01 * Math.random(),
                      maxscale: 0.1,
                      targetangle: 0.5,
                      dangle: 0.1 * (Math.random() - 0.5),
                      mangle: Math.random() * 3.1457,
                  };
              }
            }
            break;
          }
        requestAnimationFrame(animate);
      }
      animate();
  
      window.addEventListener('resize', function(){
        canvas.width = window.innerWidth-10;
        canvas.height = window.innerHeight-10;
      });
  });