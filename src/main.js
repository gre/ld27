(function(g){

var stop;

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
  map: [
    "wwwwwwax#w",
    "w     b= w",
    "wppppppplw",
    "w       lw",
    "w       lw",
    "w       lw",
    "w       lw",
    "w       lw",
    "w   o   lw",
    "wwwwwwwwww"
  ]
}),
new g.Level({
  levelNumber: 2,
  map: [
    "wwwwwwax#w",
    "w     b| w",
    "wppppppplw",
    "w       lw",
    "w       lw",
    "w       lw",
    "w       lw",
    "w       lw",
    "w      olw",
    "wwwwwww-ww"
  ]
}),
new g.Level({
  levelNumber: 3,
  map: [
    "#xawwwwwww",
    "wtb      w",
    "wt       w",
    "wt       w",
    "wt       w",
    "wtpppppplw",
    "wt  p   lw",
    "wt  p   lw",
    "wt  p  olw",
    "wwwwwww-ww"
  ]
}),
new g.Level({
  levelNumber: 4,
  map: [
    "wwwwwwwax#",
    "w      blw",
    "w       lw",
    "w       lw",
    "w       lw",
    "wtpp    pw",
    "wt       w",
    "wt       w",
    "wto PPPP w",
    "ww-wwwwwww"
  ]
}),
new g.Level({
  levelNumber: 5,
  gravity: 0.002,
  map: [
    "#xawwwwwww",
    "wtb     lw",
    "wt   ppplw",
    "wt      lw",
    "wt      lw",
    "wt    pplw",
    "wt      lw",
    "wt      lw",
    "wtpp    ow",
    "wwwwwwww-w"
  ]
}),
new g.Level({
  levelNumber: 6,
  gravity: 0.0001,
  map: [
    "wwwwwwwax#",
    "w      b w",
    "w        w",
    "w        w",
    "w        w",
    "w        w",
    "w        w",
    "w        w",
    "wo       w",
    "w-wwwwwwww"
  ]
}),
new g.Level({
  levelNumber: 7,
  gravity: function (time) {
    return 0.0005+0.0008*g.smoothstep(-1, 1, Math.cos(0.001*time));
  },
  map: [
    "#xawwwwwww",
    "wtb      w",
    "wt       w",
    "wt       w",
    "wt       w",
    "wtp   pplw",
    "w       lw",
    "w       lw",
    "w  PPP  ow",
    "wwwwwwww-w"
  ]
}),
new g.Level({
  levelNumber: 8,
  gravity: function (time) {
    return 0.001*Math.cos(0.005*time);
  },
  map: [
    "wwwwwwwax#",
    "w     pb w",
    "w lp  p  w",
    "w lp     w",
    "w lppppppw",
    "w        w",
    "wppppppp w",
    "w        w",
    "wo       w",
    "w-wwwwwwww"
  ]
}),
new g.Level({
  levelNumber: 9,
  gravity: function (time) {
    return 0.0008+0.001*Math.cos(0.002*time);
  },
  map: [
    "#xawwwwwww",
    "wtb      w",
    "wt       w",
    "wt       w",
    "wt       w",
    "wpp  ppplw",
    "w       lw",
    "w       lw",
    "w  PP   ow",
    "wwwwwwww-w"
  ]
}), 
new g.Level({
  levelNumber: 10,
  playerSlide: 0.96,
  map: [
    "wwwwwwwax#",
    "w      b=w",
    "w        w",
    "w        w",
    "wtp  pp  w",
    "wt       w",
    "wt       w",
    "wt       w",
    "wtoPPPPPPw",
    "ww-wwwwwww"
  ]
}),
new g.Level({
  levelNumber: 11,
  map: [
    "#xawwwwwww",
    "w b      w",
    "w        w",
    "w        w",
    "wG       w",
    "wppppppplw",
    "w       lw",
    "w       lw",
    "w       ow",
    "wwwwwwww-w"
  ]
}),
new g.Level({
  levelNumber: 12,
  playerSlide: 0.96,
  map: [
    "wwwwwwwax#",
    "w    Gpb w",
    "w   p    w",
    "w   p    w",
    "w        w",
    "w  G     w",
    "wtppp    w",
    "wt    P  w",
    "wto   PPGw",
    "ww-wwwwwww"
  ]
}),
new g.Level({
  levelNumber: 13,
  map: [
    "#xawwwwwww",
    "w pG     w",
    "w b  ppppw",
    "wppp     w",
    "wpp      w",
    "wp       w",
    "w        w",
    "w p  ppplw",
    "wGp     ow",
    "wwwwwwww-w"
  ]
}),

new g.Level({
  levelNumber: 14,
  map: [
    "wwwwwwwax#",
    "w  Gp  b w",
    "w   p    w",
    "w   p    w",
    "w   p    w",
    "w   p    w",
    "w   p    w",
    "w   pppp w",
    "w oG     w",
    "ww-wwwwwww"
  ]
}),
]);

var keyboard = new g.Keyboard({});
 
var game = new g.Game({});
window.GAME = game;

var player = new g.Player({});

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

var gameScene = new g.GameScene({
  model: game,
  width: render.width,
  height: render.height
});

function startGame () {
  var startTime = +new Date();
  var lastTime = 0;
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

  game.set("player", player);
  game.set("level", levels.at(currentLevel));
  loop();
}

render.setScene(gameScene);

game.on("change:game-over", function (model, text) {
  stop = true;
  alert("Game Over: "+text);
  window.location.reload();
});

startGame();

}(window._game));
