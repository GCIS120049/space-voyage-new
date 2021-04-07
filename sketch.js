var bg , bgImg , logo , logoImg ,start,startImg,rules,rulesImg,ruletext,ruletextImg,x,xImg;
var gameState="start",oGroup,over,overImg,reset,resetImg,win;
var plr,plrImg,obstacle,o1,o2,o3,o4,o5,o6,o7,o8,o9,o10,o11,o12,h1,heart,a=0;
var score=80000,space,spaceImg,spaceGroup,fuel=100,lose,fuelSound;

function preload(){
  bgImg = loadImage("images/bg .jpg");
  logoImg = loadImage("images/logo.png");
  startImg = loadImage("images/start.png");
  rulesImg = loadImage("images/rules.png");
  ruletextImg = loadImage("images/ruletext.png");
  xImg = loadImage("images/x.png");
  plrImg = loadImage("images/shuttle.png");
  o1 = loadImage("images/mercury.png");
  o2 =  loadImage("images/venus.png");
  o3 = loadImage("images/earth.png");
  o4 = loadImage("images/mars.png");
  o5 = loadImage("images/jupiter.png");
  o6 = loadImage("images/saturn.png");
  o7 = loadImage("images/uranus.png");
  o8 = loadImage("images/neptune.png");
  o9 = loadImage("images/asteroid.png");
  o10 = loadImage("images/meteor.gif");
  o11 = loadImage("images/rocket.png");
  o12 = loadImage("images/satellite.png");
  heart = loadImage("images/heart.png");
  spaceImg = loadImage("images/station.png");
  overImg=loadImage("images/gameover.png");
  resetImg=loadImage("images/reset.png");
  win=loadImage("images/win.png");
  lose=loadSound("die.mp3");
  fuelSound=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(1250,600);

  //background
  bg=createSprite(width/2,height/2,1000,500);
  bg.addImage(bgImg);
  bg.scale=0.8;

  //logo
  logo = createSprite(width/2,120);
  logo.addImage(logoImg);
  logo.scale=1.3;

  //start
  start=createSprite(width/2,350);
  start.addImage(startImg);
  start.scale=0.25;

  //rules logo
  rules = createSprite(width/2,500);
  rules.addImage(rulesImg);
  rules.scale=0.3;

  //rules text
  ruletext = createSprite(width/2,height/2);
  ruletext.addImage(ruletextImg);
  ruletext.scale=1.3;

  //cross for rules
  x=createSprite(970,50);
  x.addImage(xImg);
  x.scale=0.3;

  //player shuttle
  plr = createSprite(250,height/2);
  plr.addImage(plrImg);
  plr.scale=0.3;

  //player lives
  h1=createSprite(1200,40);
  h1.addImage(heart);
  h1.scale=0.2;

  //gameover
  over=createSprite(width/2,200);
  over.addImage(overImg);
  over.scale=0.3;

  //reset
  reset=createSprite(width/2,450);
  reset.addImage(resetImg);
  reset.scale=0.2;

  oGroup=createGroup();
  spaceGroup=createGroup();

  score=80000;
  a=0;
  fuel=100;
}

function draw() {
  background(0); 

  var edges=createEdgeSprites();

  //making background infinite
  bg.velocityX=-(3+10-(score/8000));
  if(bg.x<500){
    bg.x=width/2;
  }

  if(gameState=="start"){

    logo.visible=true;
    start.visible=true;
    bg.scale=1.1;
    rules.visible=true;
    ruletext.visible=false;
    x.visible=false;
    plr.visible=false;
    h1.visible=false;
    over.visible=false;
    reset.visible=false;

    if(mousePressedOver(start)){
      gameState="play";
    }

    if(mousePressedOver(rules)){
      gameState="rules";
    }
    score=80000;
    a=0;
    fuel=100;

  }else if(gameState=="rules"){

    logo.visible=false;
    start.visible=false;
    bg.scale=1.1;
    rules.visible=false;
    ruletext.visible=true;
    x.visible=true;
    plr.visible=false;
    h1.visible=false;
    over.visible=false;
    reset.visible=false;

    if(mousePressedOver(x)){
      gameState="start";
    }

  }else if(gameState=="play"){

    reset.visible=false;
    over.visible=false;
    h1.visible=true;
    logo.visible=false;
    start.visible=false;
    bg.scale=0.8;
    rules.visible=false;
    ruletext.visible=false;
    x.visible=false;
    plr.visible=true;

    plr.y=World.mouseY;
    plr.collide(edges);
    plr.setCollider("rectangle",0,0,450,300);

    score=score - 0.4;
    fuel-=0.01;
    textSize(40);
    fill(204,255,255);
    textFont("tisa");
    text("Distance remaining:"+score + " miles",200,40);
    text("Fuel remaining: " + fuel + " %",300,585);

    spawnObstacles();
    spaceStations();

    console.log(bg.velocityX);

    if(plr.isTouching(spaceGroup)){
      spaceGroup.destroyEach();
      fuelSound.play();
      fuel=100;
    }
    if(a==0 && plr.isTouching(oGroup)){
      oGroup.destroyEach();
      a=1;
      h1.destroy();
      lose.play();
    }
    if(a==0 && fuel<1 && fuel>0){
      //oGroup.destroyEach();
      a=1;
      h1.destroy();
      lose.play();
      fuel=100;
    }
    if(a==1 && plr.isTouching(oGroup) ){
      oGroup.destroyEach();
      gameState="end";
      lose.play();
    }
    if(a==1 && fuel<1 && fuel >0 ){
      oGroup.destroyEach();
      gameState="end";
      lose.play();
    }
    if(a==1 && score==0){
      gameState="end";
      a=5;
    }
    if(a==0 && score==0){
      gameState="end";
      a=5;
    }

  }else if(gameState=="end"){

    over.visible=true;
    logo.visible=false;
    start.visible=false;
    bg.scale=1.1;
    rules.visible=false;
    ruletext.visible=false;
    x.visible=false;
    plr.visible=false;
    h1.visible=false;
    reset.visible=true;
    //reset.debug=true;

    if(a==5){
      over.addImage(win);
    }else{
      over.addImage(overImg);
    }

    if(mousePressedOver(reset)){
      gameState="start";
    }

  };
  drawSprites();
}
function spawnObstacles(){
  if(frameCount%130===0){
    obstacle=createSprite(1250,100);
    obstacle.setCollider("circle",0,0,150);
    //obstacle.debug=true;
    var r=Math.round(random(1,12));
    obstacle.lifetime=400;
    switch(r){
      case 1:obstacle.addImage(o1);
             obstacle.scale=0.04;
             obstacle.setCollider("circle",0,0,1200);
             obstacle.y=random(100,500);
             obstacle.velocityX=-(3+10-(score/8000));
             obstacle.velocityY=0;
             break;
      case 2:obstacle.addImage(o2);
             obstacle.scale=0.4;
             obstacle.y=random(100,500);
             obstacle.velocityX=-(3+10-(score/8000));
             obstacle.velocityY=0;
             break;
      case 3:obstacle.addImage(o3);
             obstacle.scale=0.4;
             obstacle.y=random(100,500);
             obstacle.velocityX=-(3+10-(score/8000));
             obstacle.velocityY=0;
             break;
      case 4:obstacle.addImage(o4);
             obstacle.scale=0.2;
             obstacle.setCollider("circle");
             obstacle.y=random(100,500);
             obstacle.velocityX=-(3+10-(score/8000));
             obstacle.velocityY=0;
             break;
      case 5:obstacle.addImage(o5);
             obstacle.scale=0.15;
             obstacle.setCollider("circle");
             obstacle.y=random(100,500);
             obstacle.velocityX=-(3+10-(score/8000));
             obstacle.velocityY=0;
             break;
      case 6:obstacle.addImage(o6);
             obstacle.setCollider("rectangle",0,0,600,300,130);
             obstacle.y=random(100,500);
             obstacle.scale=0.2;
             obstacle.velocityX=-(3+10-(score/8000));
             obstacle.velocityY=0;
             break;
      case 7:obstacle.addImage(o7);
             obstacle.y=random(100,500);
             obstacle.setCollider("circle");
             obstacle.scale=0.2;
             obstacle.velocityX=-(3+10-(score/8000));
             obstacle.velocityY=0;
             break;
      case 8:obstacle.addImage(o8);
             obstacle.y=random(100,500);
             obstacle.scale=0.4;
             obstacle.velocityX=-(3+10-(score/8000));
             obstacle.velocityY=0;
             break;
      case 9:obstacle.addImage(o9);
             obstacle.scale=0.3;
             obstacle.y=random(100,500);
             obstacle.velocityX=-(3+10-(score/8000));
             obstacle.velocityY=0;
             break;
      case 10:obstacle.addImage(o10);
              obstacle.setCollider("rectangle",-40,20,135,30,160)
              obstacle.velocityX=-10;
              obstacle.velocityY=2;
             break;
      case 11:obstacle.addImage(o11);
              obstacle.scale=0.15;
              obstacle.setCollider("rectangle",0,0,1000,500,45);
              obstacle.y=500;
              obstacle.velocityX=-10;
              obstacle.velocityY=-3;
             break;
      case 12:obstacle.addImage(o12);
              obstacle.scale=0.075;
              obstacle.setCollider("rectangle",0,0,2000,1000,45);
              obstacle.y=Math.round(random(100,500)); 
              obstacle.velocityX=-(3+10-(score/8000));
              obstacle.velocityY=0;
              break;
      default:break;
    }
    oGroup.add(obstacle);
  }
}
function spaceStations(){
  if(frameCount%4500===0 && score!==80000){
    space=createSprite(1250,random(100,500));
    space.addImage(spaceImg);
    space.scale=0.5;
    space.velocityX=-3;
    space.lifetime=400;
    spaceGroup.add(space);
  }
}


