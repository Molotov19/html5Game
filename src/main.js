loadGame = function() {


    var mobile = false;
    
    if( (navigator.userAgent.match(/iPad/i) != null) ||
        (navigator.userAgent.match(/iPhone/i)) || 
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/Android/i))
        )
    {
         var INIT_GAME_WIDTH = 1366;
         var INIT_GAME_HEIGHT = 768;
         var BOUND_X = 1366;
         var BOUND_Y = 768;
         var maxParticles = 5, emissionRate = 1;
         mobile = true;
         var INI_LIVE = 500; var MAX_LIVE = 300;
    }else{
         var INIT_GAME_WIDTH = 1920;
         var INIT_GAME_HEIGHT = 1080;
         var BOUND_X = 1920;
         var BOUND_Y = 1080;
         var maxParticles = 10, emissionRate = 1;
         mobile = false;
         var INI_LIVE = 2000; var MAX_LIVE = 300;
    } 
    
    //var INI_LIVE = 1000; 
    //var MAX_LIVE = 300;
    /*var INIT_GAME_WIDTH = $(window).width();
    var INIT_GAME_HEIGHT = $(window).height();
    var BOUND_X = $(window).width();
    var BOUND_Y = $(window).height();*/
    var PADDING = 0;
    var T_SPEED = 2;
    var INIT_ASPECT_RATIO = INIT_GAME_WIDTH / INIT_GAME_HEIGHT;
    var FPS = 30;
    var keyManager = null;
    var totalPuntos = 0;

    var bolas = [];
    var lineas = [];
    var shots = [];
    var explosiones = [];
    var listPoints = [];
    var listBoostParticles = [];

    var ships = [];


    var shooting = false;
    var towerLeft = false;
    var towerRight = false;

    var time = 0;

    var dimensiones;
    var degree=0;
    var radians = 0;
    var mapBitmap, stationBitmap, objetivo;
    var distObjetivo = 0;
    var conjuntoBarraVida = new createjs.Container();
    var shotPad = new createjs.Shape();
    var controlPadLeft = new createjs.Shape();
    var controlPadRight = new createjs.Shape();
    var shotPadColor = createjs.Graphics.getRGB(0,0,0,0.80);
    var canvas = document.getElementById('gameCanvas');
    var stage = new createjs.Stage(canvas);
    stage.canvas.width = INIT_GAME_WIDTH;
    stage.canvas.height = INIT_GAME_HEIGHT;
    // enable touch interactions if supported on the current device:
    createjs.Touch.enable(stage);

    // enabled mouse over / out events
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    keyManager = new KeyboardManager();

    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(FPS);

    var fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#FFF");
    var puntosLabel = new createjs.Text("Puntos " + totalPuntos, "bold 18px Arial", "#FFF");
    var loadingLabel = new createjs.Text("Cargando --%", "bold 18px Arial", "#FFF"); 

    var backImg = new Image();
    var canionImg = new Image();
    var stationImg = new Image();
    var controlImg = new Image();
    var control;
    
    var queue = new createjs.LoadQueue();
    queue.loadManifest(["images/control.png","images/fondo.png","images/tower.png","images/canion.png","images/ship.png","images/shipB.png","images/circle.png"]);
    queue.load();
    queue.addEventListener("complete", showManifest);
    queue.addEventListener("progress", showProgress);
    function showProgress(evt) {
      $('#gameArea').css('margin-top', (-$(window).height() / 2) + 'px');
      $('#gameArea').css('margin-left', (-$(window).width() / 2) + 'px');
      var perc = evt.loaded / evt.total;
      var percFinal = Math.ceil(perc*100).toString();
      console.log(percFinal);
      stage.addChild(loadingLabel);
      loadingLabel.x = (BOUND_X / 2);
      loadingLabel.y = (BOUND_Y / 2);
      loadingLabel.text = "cargando " + percFinal + "%";
      stage.update(evt);
    }
    function showManifest() {
      console.log("Files are loaded");
      stage.removeChild(loadingLabel);
      
      backImg.src = "images/fondo.png";
      back = new createjs.Shape();
      back.x = 0;back.y = 0;
      var matrix = new createjs.Matrix2D;
      matrix.scale(INIT_GAME_WIDTH/stage.canvas.width, INIT_GAME_HEIGHT/stage.canvas.height); // 200%
      back.graphics.beginBitmapFill(backImg,'no-repeat',matrix).drawRect(0,0,stage.canvas.width,stage.canvas.height);
      stage.addChild(back);

      loadImageStation("images/tower.png");

      loadImageCanion("images/canion.png");
      control = new createjs.Bitmap("images/control.png");
      objetivo = new crearObjetivo(createjs.Graphics.getRGB(0,255,0,0.85),10);
      
      if(!mobile){
          createjs.Ticker.addEventListener("tick", onTick);    
      }else{
          createjs.Ticker.addEventListener("tick", onTickMobile);
      }
      

       stage.addChild(fpsLabel, puntosLabel);
       fpsLabel.x = 10;
       fpsLabel.y = 20;
       puntosLabel.x = (BOUND_X / 2) / stage.scaleX;
       puntosLabel.y = 20; 
    }
    
    /*controlImg.src = "images/control.png";

    backImg.src = "images/fondo.png";
    backImg.onload = function(){
       back = new createjs.Shape();
       back.x = 0;back.y = 0;
       var matrix = new createjs.Matrix2D
       matrix.scale(INIT_GAME_WIDTH/stage.canvas.width, INIT_GAME_HEIGHT/stage.canvas.height); // 200%
       back.graphics.beginBitmapFill(backImg,'no-repeat',matrix).drawRect(0,0,stage.canvas.width,stage.canvas.height);
       stage.addChild(back);

        stationImg.src = "images/tower.png";
        stationImg.onload = function(){
            loadImageStation(stationImg);
        };

        canionImg.src = "images/canion.png";
        canionImg.onload = function(){
            loadImageCanion(canionImg);
            control = new createjs.Bitmap(controlImg);
            objetivo = new crearObjetivo(createjs.Graphics.getRGB(0,255,0,0.85),10);
            createjs.Ticker.addEventListener("tick", onTick);
        };
       
       // add a text object to output the current FPS:
       stage.addChild(fpsLabel);
       fpsLabel.x = 10;
       fpsLabel.y = 20;
    };*/
   

    /*stage.addEventListener('stagemouseup',function(evt){
        //console.log('X:'+evt.stageX+',Y:'+evt.stageY);
        var color=createjs.Graphics.getRGB(0,0,0);
        var color2=createjs.Graphics.getRGB(0,0,0);
        lineas.push( new crearLinea(mapBitmap.x,mapBitmap.y,evt.stageX,evt.stageY,10,4,color,color2) );
    });*/

    window.addEventListener('resize', resizeGame, false);
    window.addEventListener('orientationchange', resizeGame, false);

    function classShip(im,vid,dan,bR,pt,minV,maxV,rdEx){
       this.img = im;
       this.vida = vid;
       this.dano = dan;
       this.boostR = bR;
       this.puntos = pt;
       this.velocidadMax = minV
       this.velocidadMin = maxV;
       this.rdEx = rdEx;
    }
    ships.push(new classShip("images/ship.png",5,10,2,100,3,4,30));
    ships.push(new classShip("images/shipB.png",20,30,4,350,2,2,60)); 

    //console.log("->"+ships[0].vida);

    function onTick(event) {
        var now=Date.now();
        var deltaTime=now-time;
        if(deltaTime>1000)deltaTime=0;
        time=now;

        resizeGame();
        updateTorre();
        updateScene(deltaTime);
        stage.update(event);

    }

    function onTickMobile(event) {
        var now=Date.now();
        var deltaTime=now-time;
        if(deltaTime>1000)deltaTime=0;
           time=now;

        resizeGame();
        updateTorre();
        updateSceneMobile(deltaTime);
        stage.update(event);

    }

    function updateScene(deltaTime){
        controlTower();
        mapBitmap.rotation = degree;
        stationBitmap.rotation += .1;
        objetivo.move();
        addNewBolas();
        plotBolas(deltaTime);
        plotExplosiones(deltaTime);
        //plotBoostParticles(deltaTime);
        plotPuntos(deltaTime);
        //plotLineas();
        addShot();
        plotShots();
        fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
        puntosLabel.text = "Puntos " + totalPuntos;
        loadBarraVida();
        modLiveStation(deltaTime);
    }

    function updateSceneMobile(deltaTime){
        mapBitmap.rotation = degree;
        stationBitmap.rotation += .1;
        objetivo.move();
        addNewBolas();
        plotBolas();
        plotPuntos(deltaTime);
        addShot();
        plotShots();
        drawControls();
        fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
        puntosLabel.text = "Puntos " + totalPuntos;
        loadBarraVida();
        modLiveStation(deltaTime);
    }
    
    function drawControls(){
        loadShotPad(stage.canvas.width,stage.canvas.height,shotPadColor,50);
        loadControlPad(10,stage.canvas.height,createjs.Graphics.getRGB(0,0,0,0.90),86,"images/control.png");
    }

    function loadImageCanion(img){
      mapBitmap = new createjs.Bitmap(img);
      mapBitmap.x = (stage.canvas.width/2) / stage.scaleX;
      mapBitmap.y = (stage.canvas.height/2) / stage.scaleY;
      mapBitmap.angle = 0;
      
      //console.log(mapBitmap.image.width/2);

      mapBitmap.regX = (mapBitmap.image.width/2);
      mapBitmap.regY = (mapBitmap.image.height/2);

      mapBitmap.addEventListener('mousedown', onMapR);

      stage.addChild(mapBitmap);
    }

    function loadImageStation(img){
      stationBitmap = new createjs.Bitmap(img);
      stationBitmap.x = (stage.canvas.width/2) / stage.scaleX ;
      stationBitmap.y = (stage.canvas.height/2) / stage.scaleY;
      stationBitmap.angle = 0;
      stationBitmap.live = INI_LIVE;
      stationBitmap.intervalo = 2000;
      //console.log(mapBitmap.image.width/2);

      stationBitmap.regX = (stationBitmap.image.width/2);
      stationBitmap.regY = (stationBitmap.image.height/2);

      //mapBitmap.addEventListener('mousedown', onMapR);

      stage.addChild(stationBitmap);

    }

    function modLiveStation(delta){
          stationBitmap.intervalo -= delta;
          if(stationBitmap.intervalo < 0){
            //console.log(delta);
              if(stationBitmap.live + 10 <= INI_LIVE) {stationBitmap.live += 10;}
              else{stationBitmap.live = INI_LIVE;}
              stationBitmap.intervalo = 2000;
          }
    }

    function loadBarraVida(){
      var barra;
      var texto;
      var dimensiones;
      
      stage.removeChild(conjuntoBarraVida);

      conjuntoBarraVida = new createjs.Container();
     
      conjuntoBarraVida.x = 200;
      conjuntoBarraVida.y = 30;
      
      texto = new createjs.Text('vida', "20px Arial", "#0b92a6");
      texto.textBaseline = "top";
      dimensiones = texto.getBounds();

      barra = new createjs.Shape();
      barra.graphics
             .setStrokeStyle(2)
             .beginStroke('#03cae8')
             .beginFill('#0b92a6')
             .drawRect(0,0, (stationBitmap.live * MAX_LIVE) / INI_LIVE ,4) ;
      //barra.x = 100;
      //barra.y = 20;
      //barra.regX = 150;
      //barra.regY = 2;
      //barra.rotation = 180;
      

      texto.x = barra.x - (dimensiones.width + 10);
      texto.y = -dimensiones.height/2;
     

      conjuntoBarraVida.addChild(texto,barra);
      stage.addChild(conjuntoBarraVida);

    }

    function controlTower(){

        if (keyManager.isKeyPressed(KeyboardManager.LEFT_KEY))
        {
            mapBitmap.angle -= .1;
            degree = mapBitmap.angle*180/Math.PI;
            radians = (mapBitmap.angle*180/Math.PI) * (Math.PI/180);
        }

        if (keyManager.isKeyPressed(KeyboardManager.RIGHT_KEY))
        {
            mapBitmap.angle += .1;
            degree = mapBitmap.angle*180/Math.PI;
            radians = (mapBitmap.angle*180/Math.PI) * (Math.PI/180);
        }

        if (keyManager.isKeyPressed(KeyboardManager.UP_KEY))
        {
            if(distObjetivo>0){
              distObjetivo-=5;
            }
            /*mapBitmap.angle += .1;
            degree = mapBitmap.angle*180/Math.PI;
            radians = (mapBitmap.angle*180/Math.PI) * (Math.PI/180);*/
        }

        if (keyManager.isKeyPressed(KeyboardManager.DOWN_KEY))
        {
           if(distObjetivo<(BOUND_X / 2) / stage.scaleX){
              distObjetivo+=5;
            }
           /*mapBitmap.angle += .1;
            degree = mapBitmap.angle*180/Math.PI;
            radians = (mapBitmap.angle*180/Math.PI) * (Math.PI/180);*/
        }

    }

    function updateTorre(){

        mapBitmap.x = (stage.canvas.width/2) / stage.scaleX;
        mapBitmap.y = (stage.canvas.height/2) / stage.scaleY;
        
        //console.log(mapBitmap.image.width/2);

        mapBitmap.regX = (mapBitmap.image.width/2);
        mapBitmap.regY = (mapBitmap.image.height/2); 

        stationBitmap.x = (stage.canvas.width/2) / stage.scaleX;
        stationBitmap.y = (stage.canvas.height/2) / stage.scaleY;

        stationBitmap.regX = (stationBitmap.image.width/2);
        stationBitmap.regY = (stationBitmap.image.height/2);

        

        //mapBitmap.cache(0, 0,256 ,256 );
        mapBitmap.snapToPixel = true;
        stationBitmap.snapToPixel = true;
    }

    function onMapR(evt){
       var clickAngle = Math.atan2((evt.stageY /stage.scaleY)  - mapBitmap.y, (evt.stageX /stage.scaleX) - mapBitmap.x) - radians;
       mapBitmap.addEventListener('pressmove',function(evt){
            radians = Math.atan2((evt.stageY /stage.scaleY)  - mapBitmap.y, (evt.stageX /stage.scaleX) - mapBitmap.x) - clickAngle;
            mapBitmap.angle = radians;
            //radians = Math.atan2((evt.stageY / stage.scaleY)  - mapBitmap.y, (evt.stageX / stage.scaleX) - mapBitmap.x);
            //degree = (radians * (180 / Math.PI) * -1) + 90;
            degree = radians * (180/Math.PI);
       });
        
    }

    function crearPuntos(px,py,points,life){

       this.puntos = new createjs.Text("+" + points, "bold 18px Arial", "#FFF");
       this.puntos.x = px;
       this.puntos.y = py;
       this.life = life;
       
       this.move = function(deltaTime){
            this.life-=deltaTime;
            this.puntos.y -= 1;
            this.puntos.alpha -= 1*deltaTime/1000;
            stage.addChild( this.puntos );
       };

       this.puntos.snapToPixel = true;
       //stage.addChild( this.puntos );
    }

    function plotPuntos(deltaTime){
      var currentPoints = [];

      for (var i = 0; i < listPoints.length; i++) {
         var points = listPoints[i];

         if( points.puntos.x < 0 || points.puntos.x > (BOUND_X / stage.scaleX) || points.puntos.y < 0 || points.puntos.y > (BOUND_Y / stage.scaleY) || points.life<0 ){
                  stage.removeChild(points.puntos);
                  points.puntos.removeAllEventListeners();
                  continue;  
          }

        // Move our particles
        points.move(deltaTime);
         // Add this particle to the list of current particles
        currentPoints.push(points);
      }

      // Update our global particles reference
      listPoints = currentPoints;
    }

    function crearBoostParticle(px,py,r){
      this.boostParticle = new createjs.Shape();
      this.boostParticle.graphics.beginFill('#03cae8').drawCircle(0, 0, r);
      this.boostParticle.x = px;
      this.boostParticle.y = py;
      this.life = 400;
      var blurFilter = new createjs.BlurFilter(5, 5, 1);
      this.boostParticle.filters = [blurFilter];

      this.move = function(deltaTime){
            this.life -= deltaTime;
            this.boostParticle.alpha -= 1*deltaTime/400;
            stage.addChild( this.boostParticle );
      };
      
      this.boostParticle.cache(-r, -r, r * 2, r * 2);
      this.boostParticle.snapToPixel = true;
      //stage.addChild( this.boostParticle );
    }

    function addBoostParticle(element){
        var h = (element.bola.image.height/2);
        var ang = element.angle *180/Math.PI;// * (Math.PI/180);
        var rdShot = Math.atan2( (h - element.bola.regY -0),(5 - element.bola.regX -0))* 180/Math.PI;
        var new_x = Math.cos(parseInt(ang+rdShot)* Math.PI/180)*Math.sqrt(Math.pow(5 - element.bola.regX,2)+Math.pow(h - element.bola.regY,2));
        var new_y = Math.sin(parseInt(ang+rdShot)* Math.PI/180)*Math.sqrt(Math.pow(5 - element.bola.regX,2)+Math.pow(h - element.bola.regY,2));
        //listBoostParticles.push( new crearBoostParticle(element.bola.x +  new_x,element.bola.y + new_y,ships[element.tipo].boostR) );
        element.boostP.push( new crearBoostParticle(element.bola.x +  new_x,element.bola.y + new_y,ships[element.tipo].boostR) );
    }
    
    /*function plotBoostParticles(deltaTime){
      var currentBoostParticle = [];

      for (var i = 0; i < listBoostParticles.length; i++) {
         var boost = listBoostParticles[i];

         if( boost.life<0 ){
                  stage.removeChild(boost.boostParticle);
                  boost.boostParticle.removeAllEventListeners();
                  continue;  
          }

        // Move our particles
        boost.move(deltaTime);
         // Add this particle to the list of current particles
        currentBoostParticle.push(boost);
      }

      // Update our global particles reference
      listBoostParticles = currentBoostParticle;
    }*/

    function plotBoostParticles(deltaTime, element){
      var currentBoostParticle = [];

      for (var i = 0; i < element.boostP.length; i++) {
         var boost = element.boostP[i];

         if( boost.life<0 ){
                  stage.removeChild(boost.boostParticle);
                  boost.boostParticle.removeAllEventListeners();
                  continue;  
          }

        // Move our particles
        boost.move(deltaTime);
         // Add this particle to the list of current particles
        currentBoostParticle.push(boost);
      }

      // Update our global particles reference
      element.boostP = currentBoostParticle;
    }

    function borrarBoostParticles(element){

      for (var i = 0; i < element.boostP.length; i++) {
         var boost = element.boostP[i];
         stage.removeChild(boost.boostParticle);
         boost.boostParticle.removeAllEventListeners();
      }

      element.boostP = [];

    }

    /*-----EXPLOSIONES--------------*/
    function crearExplosion(px,py,r,cl){
      this.explosion = new createjs.Shape();
      this.explosion.graphics.beginFill(cl).drawCircle(0, 0, r);
      this.explosion.x = px;
      this.explosion.y = py;
      this.life = 800;
      this.rd = r;
      this.color = cl;
      var blurFilter = new createjs.BlurFilter(5, 5, 1);
      this.explosion.filters = [blurFilter];

      this.move = function(deltaTime){
            this.explosion.graphics.clear();
            this.rd += 10*deltaTime/800;
            this.explosion.graphics.beginFill(this.color).drawCircle(0, 0, this.rd);
            this.explosion.cache(-this.rd, -this.rd, this.rd * 2, this.rd * 2);
            this.life -= deltaTime;
            this.explosion.alpha -= 1*deltaTime/800;
            stage.addChild( this.explosion );
      };
      
      //this.explosion.cache(-this.rd, -this.rd, this.rd * 2, this.rd * 2);
      this.explosion.snapToPixel = true;
    }

    function addExplosion(element, color){
        explosiones.push( new crearExplosion(element.bola.x,element.bola.y,ships[element.tipo].rdEx, color) );
    }

    function plotExplosiones(deltaTime){
      var currentExplosion = [];

      for (var i = 0; i < explosiones.length; i++) {
         var explosion = explosiones[i];

         if( explosion.life<0 ){
                  stage.removeChild(explosion.explosion);
                  explosion.explosion.removeAllEventListeners();
                  continue;  
          }

        // Move our particles
        explosion.move(deltaTime);
         // Add this particle to the list of current particles
        currentExplosion.push(explosion);
      }

      // Update our global particles reference
      explosiones = currentExplosion;
    }
    /*------------------------------*/

    function crearObjetivo(color,r){
       this.objetivo = new createjs.Shape();
       this.objetivo.graphics.beginFill(color).drawCircle(0, 0, r);
       this.objetivo.x = mapBitmap.x + (BOUND_X/2/stage.scaleX);
       this.objetivo.y = mapBitmap.y;

       this.move = function () {
           var ang = mapBitmap.angle *180/Math.PI;// * (Math.PI/180);
           var rdShot = Math.atan2( (0),( (BOUND_X/2)+200 - 0))* 180/Math.PI;
           var new_x = Math.cos(parseInt(ang+rdShot)* Math.PI/180)*Math.sqrt(Math.pow((BOUND_X/2/stage.scaleX)-distObjetivo,2)+Math.pow(0,2));
           var new_y = Math.sin(parseInt(ang+rdShot)* Math.PI/180)*Math.sqrt(Math.pow((BOUND_X/2/stage.scaleX)-distObjetivo,2)+Math.pow(0,2));
           this.objetivo.x = mapBitmap.x + new_x;
           this.objetivo.y = mapBitmap.y + new_y;
        };

        this.objetivo.cache(-r, -r, r * 2, r * 2);
        this.objetivo.snapToPixel = true;
        stage.addChild( this.objetivo );
    }

    function loadShotPad(x,y,color,r){
        shotPad.graphics.clear();
        shotPad.graphics.beginFill(color).drawCircle(0, 0, r);
        shotPad.x = (x / stage.scaleX) - r - 10;
        shotPad.y = (y / stage.scaleY) - r - 10;
        shotPad.cache(-r, -r, r*2, r*2);
        shotPad.snapToPixel = true;
        shotPad.on("mousedown", shotTower);
        //shotPad.on("pressup", endShotTower);
        stage.addChild( shotPad );
    }

    function shotTower(event){
      handleInteraction(event);
      //console.log(shots.length);
      shooting = true;
      event.addEventListener("mouseup",endShotTower);
    }

    function endShotTower(event){
      handleInteraction(event);
      //console.log(shots.length);
      shooting = false;
    }
      

    function handleInteraction(event) {
        var c1 = createjs.Graphics.getRGB(0,0,0,0.90);
        var c2 = createjs.Graphics.getRGB(0,0,0,0.80);
        shotPadColor = (event.type == "mousedown") ? c1 : c2; 
    }

    function loadControlPad(x1,y1,color,r,img){
        controlPadLeft.graphics.clear();
        controlPadLeft.graphics.beginFill(color).drawCircle(0,0, r);
        controlPadLeft.x = x1 / stage.scaleX + r + 10;
        controlPadLeft.y = y1 / stage.scaleY - r - 10;
        controlPadLeft.angle = 0;
        controlPadLeft.cache(-r, -r, r*2, r*2);
        controlPadLeft.snapToPixel = true;
        controlPadLeft.on('mousedown', moveTower);
        //controlPadLeft.on("pressup", endTowerToLeft);
        stage.addChild(controlPadLeft);

        /*controlPadRight.graphics.clear();
        controlPadRight.graphics.beginFill(color).drawCircle(0,0, r);
        controlPadRight.x = x1 / stage.scaleX + r;
        controlPadRight.y = (y1 / stage.scaleY) - r - 10;
        controlPadRight.cache(-r, -r, r*2, r*2);
        controlPadRight.snapToPixel = true;
        controlPadRight.on("mousedown", towerToRight);
        controlPadRight.on("pressup", endTowerToRight);
       
        stage.addChild(controlPadLeft,controlPadRight);
        
        /*stage.removeChild(control);
        control = new createjs.Bitmap(img);
        control.x = x1 / stage.scaleX + control.image.width/2;
        control.y = y1 / stage.scaleY - control.image.height/2;
        //control.angle = 0;
        control.rotation = degree;
        
        //console.log(mapBitmap.image.width/2);

        control.regX = control.image.width/2;
        control.regY = control.image.height/2;

        //mapBitmap.cache(0, 0,256 ,256 );
        control.snapToPixel = true;

        stage.addChild(control);

        control.on('mousedown', moveTower);*/
        
    }

    function moveTower(evt){
       var clickAngle = Math.atan2((evt.stageY /stage.scaleY)  - controlPadLeft.y, (evt.stageX /stage.scaleX) - controlPadLeft.x) - radians;
       evt.addEventListener("mousemove",function(evt){
            radians = Math.atan2((evt.stageY /stage.scaleY)  - controlPadLeft.y, (evt.stageX /stage.scaleX) - controlPadLeft.x) - clickAngle;
            mapBitmap.angle = radians;
            controlPadLeft.angle = radians;
            //radians = Math.atan2((evt.stageY / stage.scaleY)  - mapBitmap.y, (evt.stageX / stage.scaleX) - mapBitmap.x);
            //degree = (radians * (180 / Math.PI) * -1) + 90;
            degree = radians * (180/Math.PI);
       });
        
    }

    function towerToLeft(event){
       towerLeft = true;
    }
    function endTowerToLeft(event){
       towerLeft = false;
    }

    function towerToRight(event){
       towerRight = true;
    }
    function endTowerToRight(event){
       towerRight = false;
    }

    /*function crearLinea(ix,iy,fx,fy,speed,bold,color,color2){
       
         this.linea = new createjs.Shape();
         this.ix = ix;
         this.iy = iy;
         this.x = ix;
         this.y = iy;
         this.bold = bold;
         this.color = color;
         this.color2 = color2;
         this.linea.graphics.setStrokeStyle(this.bold);
         this.linea.graphics.beginLinearGradientStroke([this.color,this.color2], [0, 1], 0, 50, 50, 100);
         //this.linea.graphics.beginFill(this.color2);
         this.linea.graphics.moveTo(this.ix,this.iy);
         this.angle = Math.atan2((fy) - (iy), (fx) - (ix));
         this.speed=speed;
         this.linea.graphics.lineTo(this.x,this.y);
         this.linea.graphics.endStroke();
         //this.linea.rotation = (this.angle * (180 / Math.PI) * -1) + 90;

         this.move = function () {
             this.linea.graphics.clear();
             this.linea.graphics.setStrokeStyle(this.bold);
             this.linea.graphics.beginLinearGradientStroke([this.color,this.color2], [0, 1], 0, 50, 50, 100);
             //this.linea.graphics.beginFill(this.color2);
             this.linea.graphics.moveTo(this.ix,this.iy);
             this.x += this.speed * Math.cos(this.angle);
             this.y += this.speed * Math.sin(this.angle);
             this.linea.graphics.lineTo(this.x,this.y);
             this.linea.graphics.endStroke();
             //stage.addChild(this.linea);
         }


         stage.addChild(this.linea);


    }*/

    /*Bola.prototype.move = function () {
       this.angle = Math.atan2((mapBitmap.y / stage.scaleY) - (this.bola.y), (mapBitmap.x) - (this.bola.x));
       this.bola.rotation = (this.angle * (180 / Math.PI) * -1) + 90;
       this.bola.x += this.speed * Math.cos(this.angle);
       this.bola.y += this.speed * Math.sin(this.angle);
    };*/

    function vector(){

        this.x = 0;
        this.y = 0;

        var VXY = random(4);
        //console.log(VXY);
        switch(VXY){
           case 0:{
                  this.x = random((BOUND_X / stage.scaleX));
                  this.y = -100 / stage.scaleY;
                  break;
                }
           case 1:{
                  this.x = (BOUND_X / stage.scaleX) + 100;
                  this.y = random((BOUND_Y / stage.scaleY));
                  break;
                }
           case 2:{
                  this.x = random((BOUND_X / stage.scaleX));
                  this.y = (BOUND_Y / stage.scaleY) + 100;
                  break;
                }
           case 3:{
                  this.x = -100 / stage.scaleX;
                  this.y = random((BOUND_Y / stage.scaleY));
                  break;
                }
        }

    }

    function Bola(vec, tipo)
    {

        /*var bolaImg = new Image();
        bolaImg.src = "images/ship.png";*/

        //this.bola = new createjs.Bitmap("images/ship.png");
        this.tipo = tipo;
        this.bola = new createjs.Bitmap(ships[tipo].img);

        //mapBitmap.regX = mapBitmap.image.width/2;
        //mapBitmap.regY = mapBitmap.image.height/2;

        //this.bola = new createjs.Shape();
        //this.bola.graphics.beginFill(color).drawCircle(0, 0, r);
        this.bola.x = vec.x;
        this.bola.y = vec.y;
        this.bola.regX = this.bola.image.width/2;
        this.bola.regY = this.bola.image.height/2;
        this.angle = 0;
        this.speed = randomBetween(ships[tipo].velocidadMin, ships[tipo].velocidadMax);
        this.live = ships[tipo].vida;
        this.damage = ships[tipo].dano;
        this.puntos = ships[tipo].puntos;
        this.boostP = [];

        this.move = function (deltaTime) {
           this.angle = Math.atan2((mapBitmap.y) - (this.bola.y), (mapBitmap.x) - (this.bola.x));
           //this.angle = 0;
           this.bola.rotation = this.angle * (180 / Math.PI);
           this.bola.x += this.speed * Math.cos(this.angle);
           this.bola.y += this.speed * Math.sin(this.angle);
           stage.addChild( this.bola );
        };

         // turn snapToPixel on for all shapes - it's set to false by default on Shape.
                // it won't do anything until stage.snapToPixelEnabled is set to true.
        //this.bola.uncache();
        //this.bola.cache(-r, -r, r * 2, r * 2);
        //this.bola.cache(0, 0, 12, 13//);
        this.bola.snapToPixel = true;
        //stage.addChild( this.bola );
    }

    function addNewBolas() {
      var tpb = 0;
      // if we're at our max, stop emitting.
      if (bolas.length > maxParticles) return;

      
        // emit [emissionRate] particles and store them in our particles array
        for (var j = 0; j < emissionRate; j++) {
          //bolas.push( new Bola(-100,random(BOUND_Y),2,'red',randomBetween(2, 4)) );
          //bolas.push( new Bola(new vector(),2,'red',randomBetween(2, 4),0));
          var n = random(101);
          //console.log(n);
          if(n == 100)
             tpb = 1;
          else
             tpb = 0;
          bolas.push( new Bola(new vector(),tpb));
        }

    }

    function plotBolas(deltaTime) {
      // a new array to hold particles within our bounds
      var currentBolas = [];

      for (var i = 0; i < bolas.length; i++) {
        var bola = bolas[i];
        var color = '#03cae8';

        // If we're out of bounds, drop this particle and move on to the next
        /*if (bola.bola.x / stage.scaleX == mapBitmap.x / stage.scaleX && bola.bola.y / stage.scaleY == mapBitmap.y / stage.scaleY){
           stage.removeChild(bola);
           console.log(mapBitmap.x);
          //bola.removeAllEventListeners();
          continue;  
        }*/
         
         //Solo entre bitmaps
        var intersection = ndgmr.checkPixelCollision(bola.bola,stationBitmap,0.75);
        //if(intersection || bola.bola.x > BOUND_X || bola.live <= 0){
        if(intersection || bola.live <= 0){
            //mapBitmap.x += 1;
           if(bola.live <= 0){
              listPoints.push( new crearPuntos(bola.bola.x,bola.bola.y,bola.puntos,1000) );
              totalPuntos += bola.puntos;
              color = '#03cae8';
           }else{
              color = '#FF0000';
              if(stationBitmap.live - bola.damage >= 0){
                  stationBitmap.live -=bola.damage;
              }else{
                  stationBitmap.live = 0;
              }
           }
           
           addExplosion(bola, color);
           borrarBoostParticles(bola);
           stage.removeChild(bola.bola);
           bola.bola.removeAllEventListeners();
          continue;  
        }
        //var pt = bola.bola.globalToLocal(mapBitmap.x / stage.scaleX, mapBitmap.y / stage.scaleY);
        /*var pt = bola.bola.globalToLocal(mapBitmap.x, mapBitmap.y);
        if (bola.bola.hitTest(pt.x, pt.y)){
           //console.log(bola.bola.x);
           stage.removeChild(bola.bola);
           bola.bola.removeAllEventListeners();
          continue;  
        }*/

        if(!mobile)
            addBoostParticle(bola);

        // Move our particles
        bola.move(deltaTime);
        plotBoostParticles(deltaTime,bola);

        // Add this particle to the list of current particles
        currentBolas.push(bola);
      }

      // Update our global particles reference
      bolas = currentBolas;
    }


    function creaShot(px, py,speed, rd){
        /*var shotImg = new Image();
        shotImg.src = "images/circle.png";*/

        this.shot = new createjs.Bitmap("images/circle.png");
        this.shot.x = px;
        this.shot.y = py;
        this.x = px;
        this.y = py;
        this.shot.regX = this.shot.image.width/2;
        this.shot.regY = this.shot.image.height/2;
        this.distancia = Math.sqrt(Math.pow(objetivo.objetivo.x-px,2)+Math.pow(objetivo.objetivo.y-py,2));
        this.angle = Math.atan2((objetivo.objetivo.y) - (this.shot.y), (objetivo.objetivo.x) - (this.shot.x));
        this.speed = speed;
        this.damage = 5;

        this.move = function () {
           //this.angle = Math.atan2((objetivo.objetivo.y) - (this.shot.y), (objetivo.objetivo.x) - (this.shot.x));
           this.shot.rotation = this.angle * (180 / Math.PI);
           this.shot.x += this.speed * Math.cos(this.angle);
           this.shot.y += this.speed * Math.sin(this.angle);
           stage.addChild( this.shot );
        };

         // turn snapToPixel on for all shapes - it's set to false by default on Shape.
                // it won't do anything until stage.snapToPixelEnabled is set to true.
        //this.shot.cache(0, 0, 13, 12);
        this.shot.snapToPixel = true;
        //stage.addChild( this.shot );
    }

    var timeA=new Date().getTime(),acumDtA=401,intervalA=400;
    function addShot(){  

      if(shooting == false && !keyManager.isKeyPressed(KeyboardManager.A_KEY)) return;
      //if(shots.length > 0) return;
      if(acumDtA>intervalA){
         //[137,37] [,137,87]
         //acumDtA-=intervalA;
         acumDtA=0;
         timeA=new Date().getTime();
         var ang = mapBitmap.angle *180/Math.PI;// * (Math.PI/180);
         var rdShot = Math.atan2( (37- mapBitmap.regY -0),(137 - mapBitmap.regX -0))* 180/Math.PI;
         var new_x = Math.cos(parseInt(ang+rdShot)* Math.PI/180)*Math.sqrt(Math.pow(137 - mapBitmap.regX,2)+Math.pow(37- mapBitmap.regY,2));
         var new_y = Math.sin(parseInt(ang+rdShot)* Math.PI/180)*Math.sqrt(Math.pow(137 - mapBitmap.regX,2)+Math.pow(37- mapBitmap.regY,2));
         shots.push( new creaShot(mapBitmap.x + new_x,mapBitmap.y + new_y,10, rdShot) );

         rdShot = Math.atan2( (87- mapBitmap.regY -0),(137 - mapBitmap.regX -0))* 180/Math.PI;
         new_x = Math.cos(parseInt(ang+rdShot)* Math.PI/180)*Math.sqrt(Math.pow(137 - mapBitmap.regX,2)+Math.pow(87- mapBitmap.regY,2));
         new_y = Math.sin(parseInt(ang+rdShot)* Math.PI/180)*Math.sqrt(Math.pow(137 - mapBitmap.regX,2)+Math.pow(87- mapBitmap.regY,2));
         shots.push( new creaShot(mapBitmap.x + new_x,mapBitmap.y + new_y,10, rdShot) );

         
      }

      var now=new Date().getTime();
      //var dt=now-(timeA || now);
      var dt=now-timeA;
      //timeA=now;
      //acumDtA+=dt;
      acumDtA=dt;

    }

    function plotShots() {
      // a new array to hold particles within our bounds
      var currentShots = [];
      var sw = 0;
      var dis = 0;

      for (var i = 0; i < shots.length; i++) {
        var shot = shots[i];
          
         sw=0;

         for (var j = 0; j < bolas.length; j++) {
             var bola = bolas[j];
             
              //Solo entre bitmaps
              var intersection = ndgmr.checkPixelCollision(shot.shot,bola.bola,0);
              if(intersection){
                  //mapBitmap.x += 1;
                  bola.live -=  shot.damage;
                  //stage.removeChild(shot.shot);
                  //shot.shot.removeAllEventListeners();
                  sw = 1;
                  break;  
              }

         }

         //if(sw) continue;
         dis = Math.sqrt(Math.pow(shot.shot.x-shot.x,2)+Math.pow(shot.shot.y-shot.y,2));

         if( sw || (shot.shot.x < 0 || shot.shot.x > (BOUND_X / stage.scaleX) || shot.shot.y < 0 || shot.shot.y > (BOUND_Y / stage.scaleY) || dis>shot.distancia) ){
                  stage.removeChild(shot.shot);
                  shot.shot.removeAllEventListeners();
                  continue; 
          }

        // Move our particles
        shot.move();

        // Add this particle to the list of current particles
        currentShots.push(shot);
      }

      // Update our global particles reference
      shots = currentShots;
    }

    /*function plotLineas() {
      // a new array to hold particles within our bounds
      var currentLineas = [];

      for (var i = 0; i < lineas.length; i++) {

        var linea = lineas[i];

        // Move our particles
        linea.move();

        // Add this particle to the list of current particles
        currentLineas.push(linea);
      }

      // Update our global particles reference
      lineas = currentLineas;
    }*/

    function random(max){
        return ~~(Math.random()*max);
    }

    function randomBetween(min, max) {
        if (min < 0) {
            return min + Math.random() * (Math.abs(min)+max);
        }else {
            return min + Math.random() * max;
        }
    }

    function resizeGame()
    {
        var gameArea;
        var newWidth;
        var newHeight;
        var newAspectRatio;

        gameArea = document.getElementById('gameArea');

        newWidth = $(window).width();
        newHeight = $(window).height();
        newAspectRatio = newWidth / newHeight;

        if (newAspectRatio > INIT_ASPECT_RATIO)
        {
            newWidth = newHeight * INIT_ASPECT_RATIO;
            $(gameArea).height( newHeight );
            $(gameArea).width( newWidth );
        }
        else
        {
            newHeight = newWidth / INIT_ASPECT_RATIO;
            $(gameArea).width( newWidth );
            $(gameArea).height( newHeight );
        }

        $(gameArea).css('margin-top', (-newHeight / 2) + 'px');
        $(gameArea).css('margin-left', (-newWidth / 2) + 'px');

        stage.canvas.width = newWidth;
        stage.canvas.height = newHeight;
        BOUND_X = stage.canvas.width;
        BOUND_Y = stage.canvas.height;
        stage.scaleX = newWidth / INIT_GAME_WIDTH;
        stage.scaleY = newHeight / INIT_GAME_HEIGHT;

        //updateTorre();
        stage.update();
        //onTick();
    }

    function resize(){
        $('#gameArea').height( $(window).height() );
        $('#gameArea').width( $(window).width() );
        /*$(gameArea).css('left', '0px');
        $(gameArea).css('top', '0px');
        $(gameArea).css('margin-top', '0px');
        $(gameArea).css('margin-left', '0px');*/
        BOUND_X = $(window).width();
        BOUND_Y = $(window).height();
        stage.canvas.width = $(window).width();
        stage.canvas.height = $(window).height();
        updateTorre();
        stage.update();
    }

};