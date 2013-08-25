(function(g){

  // TODO AssetLoadet

var DEFAULT_GRAVITY = 0.001;
var DEFAULT_SLIDE = 0.5;

var render = new g.Render({
  el: document.getElementById("game"),
  width: 320,
  height: 320
});

var currentLevel = 0;

var levels = new g.Levels([
new g.Level({
  noBadGuy: true,
  levelNumber: 1,
  image: "images/level-1.png",
  map: [
    "Wwwwwwax#w",
    "W     b= w",
    "Wppppppplw",
    "W       lw",
    "W       lw",
    "W       lw",
    "W       lw",
    "W       lw",
    "o       lw",
    "wwwwwwwwww"
  ]
}),
new g.Level({
  levelNumber: 2,
  image: "images/level-generic.png",
  map: [
    "Wwwwwwax#w",
    "W     b| w",
    "Wppppppplw",
    "W       lw",
    "W       lw",
    "W       lw",
    "W       lw",
    "W       lw",
    "W      olw",
    "Wwwwwww-ww"
  ]
}),
new g.Level({
  levelNumber: 3,
  image: "images/level-generic.png",
  map: [
    "Wxa#wwwwww",
    "Wtb      w",
    "Wt       w",
    "Wt       w",
    "Wt       w",
    "Wtpppppplw",
    "Wt  p   lw",
    "Wt  p   lw",
    "Wt  p  olw",
    "Wwwwwww-ww"
  ]
}),
new g.Level({
  levelNumber: 4,
  image: "images/level-generic.png",
  map: [
    "Wwwwwwwax#",
    "W      blw",
    "W       lw",
    "W       lw",
    "W       lw",
    "Wtpp    pw",
    "Wt       w",
    "Wt       w",
    "Wto PPPP w",
    "Ww-wwwwwww"
  ]
}),
new g.Level({
  levelNumber: 5,
  image: "images/level-generic.png",
  gravity: 0.002,
  map: [
    "Wxa#wwwwww",
    "Wtb     lw",
    "Wt   ppplw",
    "Wt      lw",
    "Wt      lw",
    "Wt    pplw",
    "Wt      lw",
    "Wt      lw",
    "Wtpp    ow",
    "Wwwwwwww-w"
  ]
}),
new g.Level({
  levelNumber: 6,
  image: "images/level-generic.png",
  gravity: 0.0001,
  map: [
    "Wwwwwwwax#",
    "W      b w",
    "W        w",
    "W        w",
    "W        w",
    "W        w",
    "W        w",
    "W        w",
    "Wo       w",
    "W-wwwwwwww"
  ]
}),
new g.Level({
  levelNumber: 7,
  image: "images/level-generic.png",
  gravity: function (time) {
    return 0.0005+0.0008*g.smoothstep(-1, 1, Math.cos(0.001*time));
  },
  map: [
    "Wxa#wwwwww",
    "Wtb      w",
    "Wt       w",
    "Wt       w",
    "Wt       w",
    "Wtp   pplw",
    "W       lw",
    "W       lw",
    "W  PPP  ow",
    "Wwwwwwww-w"
  ]
}),
new g.Level({
  levelNumber: 8,
  image: "images/level-generic.png",
  gravity: function (time) {
    return 0.001*Math.cos(0.005*time);
  },
  map: [
    "Wwwwwwwax#",
    "W     pb w",
    "W lp  p  w",
    "W lp     w",
    "W lppppppw",
    "W        w",
    "Wppppppp w",
    "W        w",
    "Wo       w",
    "W-wwwwwwww"
  ]
}),
new g.Level({
  levelNumber: 9,
  image: "images/level-generic.png",
  gravity: function (time) {
    return 0.0008+0.001*Math.cos(0.002*time);
  },
  map: [
    "Wxa#wwwwww",
    "Wtb      w",
    "Wt       w",
    "Wt       w",
    "Wt       w",
    "Wpp  ppplw",
    "W       lw",
    "W       lw",
    "W  PP   ow",
    "Wwwwwwww-w"
  ]
}), 
new g.Level({
  levelNumber: 10,
  image: "images/level-generic.png",
  playerSlide: 0.96,
  map: [
    "Wwwwwwwax#",
    "W      b=w",
    "W        w",
    "W        w",
    "Wtp  pp  w",
    "Wt       w",
    "Wt       w",
    "Wt       w",
    "WtoPPPPPPw",
    "Ww-wwwwwww"
  ]
}),
new g.Level({
  levelNumber: 11,
  image: "images/level-generic.png",
  map: [
    "Wxa#wwwwww",
    "W b      w",
    "W        w",
    "W        w",
    "WG       w",
    "Wppppppplw",
    "W       lw",
    "W       lw",
    "W       ow",
    "Wwwwwwww-w"
  ]
}),
new g.Level({
  levelNumber: 12,
  image: "images/level-generic.png",
  playerSlide: 0.96,
  map: [
    "Wwwwwwwax#",
    "W    Gpb w",
    "W   p    w",
    "W   p    w",
    "W        w",
    "W  G     w",
    "Wtppp    w",
    "Wt    P  w",
    "Wto   PPGw",
    "Ww-wwwwwww"
  ]
}),
new g.Level({
  levelNumber: 13,
  image: "images/level-generic.png",
  map: [
    "Wxa#wwwwww",
    "W pG     w",
    "W b  ppppw",
    "Wppp     w",
    "Wpp      w",
    "Wp       w",
    "W        w",
    "W p  ppplw",
    "WGp     ow",
    "Wwwwwwww-w"
  ]
}),

new g.Level({
  levelNumber: 14,
  image: "images/level-generic.png",
  map: [
    "Wwwwwwwax#",
    "W  Gp  b w",
    "W   p    w",
    "W   p    w",
    "W   p    w",
    "W   p    w",
    "W   p    w",
    "W   pppp w",
    "W oG     w",
    "Ww-wwwwwww"
  ]
}),
]);

var keyboard = new g.Keyboard({});
 
var game = new g.Game({});
window.GAME = game;

var player = new g.Player({});

var gameScene = new g.GameScene({
  model: game,
  width: render.width,
  height: render.height
});

var fallingScene = new g.LevelsFalling({
  player: player,
  levels: levels,
  width: render.width,
  height: render.height
});

function startFalling () {
  render.setScene(fallingScene);
  var startTime = +new Date();
  var lastTime = 0;
  function loop () {
    if (fallingScene.stopped) return;
    var now = +new Date();
    var time = now-startTime;
    var delta = time-lastTime;
    lastTime = time;
    requestAnimFrame(loop);
    player.set({
      x: 0,
      y: 7+Math.cos(time*0.0015)
    });
    fallingScene.update(time);
    render.render();
  }
  loop();
}

function startGame () {
  keyboard.on("change:left change:right", function () {
    var left = this.get("left");
    var right = this.get("right");
    var dx = (function(){
      if (left && !right) return -1;
      if (right && !left) return 1;
      return 0;
    }());
    player.set("dx", dx);
  });
  keyboard.on("change:up", function () {
    // jump
    var up = this.get("up");
    if (up && player.canJump()) {
      var left = this.get("left");
      var right = this.get("right");
      var dx = (function(){
        if (left && !right) return -1;
        if (right && !left) return 1;
        return 0;
      }());
      player.set("accy", -0.25);
      player.set("accx", dx*0.1);
    }
  });
  keyboard.on("change:up change:down", function () {
    var up = this.get("up");
    var down = this.get("down");
    var dy = (function(){
      if (up && !down) return -1;
      if (down && !up) return 1;
      return 0;
    }());
    player.set("dy", dy);
  });
  keyboard.on("action", function () {
    var level = game.get("level");
    if (!level) return;
    var tile = level.getEntityByPosition(
      player.get("x")+player.get("w")/2,
      player.get("y")+player.get("h")/2);
    if (tile && "activate" in tile) {
      tile.activate();
    }
  });

  game.on("change:level", function (model, level) {
    if (!level.get("noBadGuy")) {
      // TODO animate of the bad guy
      _.each(level.entities.filter(function(e){ return e instanceof g.WallButton }), function (e) {
        e.activate();
      });
    }
    var gravity = level.get("gravity");
    var gravityIsFunction = typeof gravity === "function";
    var initialGravity = gravityIsFunction ? DEFAULT_GRAVITY : level.get("gravity") || DEFAULT_GRAVITY;
    player.set("slide", level.get("playerSlide") || DEFAULT_SLIDE);
    game.set("gravity", initialGravity);
    if (gravityIsFunction) {
      var update = function (time, delta, game) {
        game.set("gravity", gravity.apply(level, arguments));
      };
      game.on("update", update);
      level.on("leave", function () {
        game.off("update", update);
      })
    }
    function onSwitchChange (model, v) {
      switch (model.get("typ")) {
        case "gravity":
          var enabledNb = level.entities.filter(function (e) {
            return e.get("typ") === "gravity" && e.get("switch");
          }).length;
          var g = initialGravity / (1+Math.floor(enabledNb));
          game.set("gravity", enabledNb%2 ? -g : g);
          break;
      }
    }
    level.entities.on("change:switch", onSwitchChange);
    level.on("leave", function () {
      level.entities.off("change:switch", onSwitchChange);
    });
    var pos = game.get("level").get("playerPosition");
    player.set({ "x": pos.x, "y": pos.y });
  });

  game.on("player-exit", function () {
    game.set("level", levels.at(++currentLevel));
  });

  render.setScene(gameScene);
  var startTime = +new Date();
  var lastTime = 0;
  var stop;
  function loop () {
    if (stop) return;
    var now = +new Date();
    var time = now-startTime;
    var delta = time-lastTime;
    lastTime = time;
    requestAnimFrame(loop);
    game.update(time, Math.min(delta, 1000/30), game);
    render.render();
  }

  game.on("change:game-over", function (model, text) {
    stop = true;
    alert("Game Over: "+text);
    window.location.reload();
  });

  game.set("player", player);
  game.set("level", levels.at(currentLevel));
  loop();
}

function main () {
  startFalling();
  fallingScene.onFinished = function () {
    startGame();
  };
}

var loader = new PIXI.AssetLoader(["assets.json"]);
loader.onComplete = main;
loader.load();

}(window._game));
