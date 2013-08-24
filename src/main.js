(function(g){

  var stop;

var levels = [
new g.Level({
  levelNumber: 1,
  map: [
    "wwwwwwax#w",
    "w     b: w",
    "wppppppplw",
    "w       lw",
    "w       lw",
    "w       lw",
    "w       lw",
    "w       lw",
    "w   o   lw",
    "wwwwwwwwww",
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
    "wwwwwww-ww",
  ]
})
];

var currentLevel = 0;

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
  var up = this.get("up");
  if (up && player.canJump()) {
    var left = this.get("left");
    var right = this.get("right");
    var dx = 0.1*(function(){
      if (left && !right) return -1;
      if (right && !left) return 1;
      return 0;
    }());  
    player.set("accy", -0.15);
    player.set("accx", dx);
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

game.on("change:level", function () {
  var pos = game.get("level").get("playerPosition");
  player.set({ "x": pos.x, "y": pos.y });
});

game.on("player-exit", function () {
  game.set("level", levels[++currentLevel]);
});

game.on("change:game-over", function (model, text) {
  stop = true;
  alert("Game Over: "+text);
});

var render = new g.GameRender({
  model: game,
  el: document.getElementById("game"),
  width: 400,
  height: 320
});

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

game.set("gravity", 0.001);
game.set("player", player);
game.set("level", levels[currentLevel]);
loop();

}(window._game));
