class Game {
  constructor() {
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")
    this.leaderboardtitle = createElement("h2");
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width/2-50,height-100);
    car1.addImage("car1",car1_img)
    car1.scale = 0.1;

    car2 = createSprite(width/2+100,height-100)
    car2.addImage("car2",car2_img);
    car2.scale = 0.1;

    cars = [car1,car2];
    fuels = new Group();
    coins = new Group();

    this.showFuel();
    

    this.addSprites(fuels,4,fuel,0.02)
    this.addSprites(coins,18,coin,0.09)


    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    obstacles = new Group()
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.08,obstaclesPositions);

  }

  

  addSprites(spriteGroup,nos,sprImg,scale,positions=[]){
    for(var i =0;i<nos; i++){
      var x,y
      if(positions.length > 0){
        x = positions[i].x;
        y = positions[i].y;
        sprImg = positions[i].image;
      } else {
       
        x = random(width/2+150,width/2-150);
        y = random(-height*4.5,height-400);
        
      }
      var sprite = createSprite(x,y)
        sprite.addImage("sprite",sprImg);
        sprite.scale = scale;
        spriteGroup.add(sprite);

    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reset Game")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width/2+200,40);
    this.resetButton.class("resetButton");
    this.resetButton.position(width/2+230,100)
    
    this.leaderboardtitle.html("Leaderboard")
    this.leaderboardtitle.class("resetText")
    this.leaderboardtitle.position(width/3-60,40);

    this.leader1.class("leadersText")
    this.leader1.position(width/3-50,80)
    
    this.leader2.class("leadersText")
    this.leader2.position(width/3-50,130)
  }

  update(state){
    var gameStateRef = database.ref("/").update({
      gameState: state
    })
  }

  play() {
    this.handleElements();
    this.handleResetButton();
    Player.getPlayerInfo()
    player.getCarsAtEnd();
    if(allPlayers !== undefined){
      image(track,0,-height*5,width,height*6);
      this.showFuel();
      this.showlife()
      
      this.showLeaderboard()
      var index = 0;
      for(var plr in allPlayers){
        index = index + 1;
        var x = allPlayers[plr].positionX;
        var y = height-allPlayers[plr].positionY;
        cars[index-1].position.x=x;
        cars[index-1].position.y=y;
        if(index==player.index){
          stroke(10)
          fill('red');
          ellipse(x,y,100,100);
          this.handleFuel(index);
          this.handleCoins(index)
          camera.position.y=cars[index-1].position.y;
        }
         
      }

      this.handlePlayerControls()
      const finishLine = height * 6 - 100;
      if(player.positionY > finishLine){
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }
      drawSprites()
    }

  }

  handlePlayerControls(){
    if (keyIsDown(UP_ARROW)) {
      player.positionY+=10;
      player.update();
    }
    if(keyIsDown(LEFT_ARROW) && player.positionX > width/3-50){
      player.positionX -= 5;
      player.update();
    }
    if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2+300){
      player.positionX += 5;
      player.update();
    }
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    console.log(players);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  handleResetButton(){
    this.resetButton.mousePressed(() =>{
      database.ref("/").set({
        playercount: 0,
        gameState: 0,
        players: {},
        getCarsAtEnd: 0
      })
      window.location.reload();
    })
  }

  handleFuel(index){
    cars[index-1].overlap(fuels,function(collecter,collected){
      player.fuel = 185;
      collected.remove();
    })
  }

  handleCoins(index){
    //xconsole.log("called")
    cars[index-1].overlap(coins,function(collector,collected){
      player.score+=21;
      player.update();
      collected.remove();
      
    })
  }

  showRank(){
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "OK"
    })
  }

  showlife(){
    push()
    image(life,width/2-130,height-player.positionY-750,20,20);
    fill("white");
    rect(width/2-100,height-player.positionY-750,185,20);
    fill("#F50057")
    rect(width/2-100,height-player.positionY-750,player.life,20);
    noStroke();
    pop()
  }

  showFuel(){
    push()
    image(fuel,width/2-130,height-player.positionY-700,20,20);
    fill("white");
    rect(width/2-100,height-player.positionY-700,20,20);
    fill("#ffc400");
    rect(width/2-100,height-player.positionY-700,player.fuel,20)
    noStroke();
    pop()
  }

}
