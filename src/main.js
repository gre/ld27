(function(g){

var DEFAULT_GRAVITY = 0.001;
var DEFAULT_SLIDE = 0.5;

var $loading = $('#loading');

var SOUNDS = {
  intro: $('#s_intro')[0],
  panic: $('#s_panic')[0]
};

var windowReady = (function(){
  var d = Q.defer();
  $(window).on('load', d.resolve);
  return d.promise;
}());

var soundsReady = Q.all(_.map(SOUNDS, function (node, name) {
  var d = Q.defer();
  $(node).on("canplaythrough", d.resolve);
  $(node).on("error", d.reject);
  node.load();
  return d.promise;
}));

var resourceReady = (function() {
  var d = Q.defer();
  $.get("assets.json", function (assets) {
    var loader = new PIXI.AssetLoader(assets);
    loader.on("onComplete", d.resolve);
    loader.load();
  });
  return d.promise;
}());


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
  image: "images/levels/1.png",
  map: [
    "Wwwwgwax#w",
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
  image: "images/levels/generic.png",
  map: [
    "Wwwwgwax#w",
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
  image: "images/levels/generic.png",
  map: [
    "Wxa#gwwwww",
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
  image: "images/levels/generic.png",
  map: [
    "Wwwwgwwax#",
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
  image: "images/levels/generic.png",
  gravity: 0.002,
  map: [
    "Wxa#gwwwww",
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
  image: "images/levels/generic.png",
  gravity: 0.0001,
  map: [
    "Wwwwgwwax#",
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
  image: "images/levels/generic.png",
  gravity: function (time) {
    return 0.001*Math.sin(0.002*time);
  },
  map: [
    "Wwwwgwwax#",
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
  levelNumber: 8,
  image: "images/levels/generic.png",
  gravity: function (time) {
    return 0.0005+0.0008*g.smoothstep(-1, 1, Math.cos(0.001*time));
  },
  map: [
    "Wxa#wgwwww",
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
  levelNumber: 9,
  image: "images/levels/generic.png",
  gravity: function (time) {
    return 0.001*Math.cos(0.005*time);
  },
  map: [
    "Wwwwgwwax#",
    "W      b w",
    "W        w",
    "W  ppppppw",
    "W        w",
    "W        w",
    "Wppppppp w",
    "W        w",
    "Wo       w",
    "W-wwwwwwww"
  ]
}),
new g.Level({
  levelNumber: 10,
  image: "images/levels/generic.png",
  gravity: function (time) {
    return 0.0008+0.001*Math.cos(0.002*time);
  },
  map: [
    "Wxa#wgwwww",
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
  levelNumber: 11,
  image: "images/levels/generic.png",
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
  levelNumber: 12,
  image: "images/levels/11.png",
  map: [
    "Wxa#wgwwww",
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
  levelNumber: 13,
  image: "images/levels/generic.png",
  playerSlide: 0.96,
  map: [
    "Wwwwgwwax#",
    "W    Gpb w",
    "W   p    w",
    "W   p    w",
    "W        w",
    "W  G     w",
    "Wtppp    w",
    "Wt       w",
    "Wto  PPPGw",
    "Ww-wwwwwww"
  ]
}),
new g.Level({
  levelNumber: 14,
  image: "images/levels/generic.png",
  map: [
    "Wxa#wgwwww",
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
  levelNumber: 15,
  image: "images/levels/generic.png",
  map: [
    "Wwwwgwwax#",
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

var bossLevel = new g.Level({
  image: "images/levels/generic.png",
  map: [
    "wwwwwwwwww",
    "w        w",
    "w        w",
    "w        w",
    "w        w",
    "w        w",
    "w        w",
    "w        w",
    "w o      w",
    "ww-wwwwwww"
  ]
});

var keyboard = new g.Keyboard({});
 
var game = new g.Game({});
var bossGame = new g.BossGame({});
window.GAME = game;

var player = new g.Player({});

var introData = new Backbone.Model({
  text: "",
  date: ""
});

var introScene = new g.IntroScene({
  model: introData,
  width: render.width,
  height: render.height
});

var introDialogsScene = new g.IntroDialogsScene({
  width: render.width,
  height: render.height
});

var gameScene = new g.GameScene({
  model: game,
  width: render.width,
  height: render.height
});

var bossScene = new g.BossScene({
  model: bossGame,
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

  var d = Q.defer();
  fallingScene.onFinished = d.resolve;
  return d.promise;
}

function startGame () {
  var end = Q.defer();

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

  var badGuyHasTalked = false;

  game.on("change:level", function (model, level) {
    if (!level.get("noBadGuy")) {
      var button = level.entities.find(function(e){ return e instanceof g.WallButton });
      function badGuyAction (dontBlock) {
        !dontBlock && player.set("playerIsBlocked", true);
        return Q.delay(1000).then(function () {
          !dontBlock && player.set("playerIsBlocked", false);
          if (game.get("level") === level) {
            button.activate();
          }
        });
      }
      if (badGuyHasTalked) {
        badGuyAction(true);
      }
      else {
        player.set("playerIsBlocked", true);
        conversation("badguy1").then(function () {
          $("#dialogs, #badguy1").hide();
          badGuyAction();
          badGuyHasTalked = true;
        });
      }
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

  levels.on("change:activated", function (model, activated) {
    if (activated && model === game.get("level")) {
      SOUNDS.panic.volume = 1;
      SOUNDS.panic.load(); // work around to reset the time to 0
      SOUNDS.panic.play();
    }
  });
  levels.on("leave", function (model) {
    SOUNDS.panic.pause();
    SOUNDS.panic.volume = 0;
  });

  game.on("player-exit", function () {
    var level = levels.at(++currentLevel);
    if (!level) end.resolve();
    else game.set("level", level);
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
    end.reject(text);
  });

  game.set("player", player);
  game.set("level", levels.at(currentLevel));
  loop();

  end.promise.fin(function () {
    stop = true;
  });

  return end.promise;
}

function conversation (id, onNext) {
  $('#dialogs').show();
  var group = $("#"+id).show();
  group.siblings().hide();
  var convs = group.children();
  
  var d = Q.defer();
  var i = 0;

  function next() {
    var conv = convs.eq(i);
    var message;
    if (conv.size() == 0) {
      group.hide();
      d.resolve();
    }
    else {
      var messages = conv.find("ul.message li");
      if (!conv.is(".visible")) {
        conv.addClass("visible").siblings().removeClass("visible");
        messages.removeClass("visible");
      }
      var visibles = messages.filter(".visible");
      if (visibles.size() === messages.size()) {
        ++ i;
        next();
      }
      else {
        message = messages.eq(visibles.size()).addClass("visible");
        if (message.is(".auto")) {
          setTimeout(next, 800);
        }
      }
    }
    onNext && onNext(conv, message);
  }


  function end() {
    keyboard.off("action", next);
  }
  keyboard.on("action", next);

  next();

  return d.promise.then(end);
}

function introDialogs () {
  render.setScene(introDialogsScene);

  return conversation("cockpit", function (conv, message) {
    if (conv.is(".show-cockpit")) {
      introDialogsScene.showCockpit();
    }
    render.render();
  });
}

function intro () {
  var delay = Q.delay(14000);
  var d = Q.defer();
  delay.then(d.resolve);
  render.setScene(introScene);
  var startTime = +new Date();
  var lastTime = 0;
  var stop;
  function loop () {
    if (stop) return;
    var now = +new Date();
    var time = now-startTime;
    var delta = time-lastTime;

    var cd = Math.floor(11-time/1000);
    if (cd < 0) {
      cd = time % 1000 > 500 ? "0" : "";
    }
    introData.set("text", ""+cd);
    introData.set("date", "08/26/2047 9:20:"+Math.floor(23+time/1000)+" AM");

    lastTime = time;
    requestAnimFrame(loop);
    render.render();
  }
  loop();
  SOUNDS.intro.play();

  function end() {
    SOUNDS.intro.load();
    stop = true;
    keyboard.off("action", d.reject);
  }
  keyboard.on("action", d.reject);
  return d.promise.then(end, end);
}

function bossintro () {
  return conversation("badguy2");
}

function boss () {
  var end = Q.defer();

  var badGuy = new g.BadGuy({
    x: 4.5,
    y: 1
  });

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
  keyboard.on("action", function () {
  });

  render.setScene(bossScene);
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
    bossGame.update(time, Math.min(delta, 1000/30), bossGame);
    render.render();
  }

  var speed = 0.05;
  var triggerEvery = 2000;
  function triggerLoop () {
    if (stop) return;
    setTimeout(triggerLoop, triggerEvery);
    bossGame.triggerBall(0.25+Math.PI*(0.5*Math.random()), speed);
    speed = Math.min(0.2, speed*1.01);
    triggerEvery = Math.max(100, triggerEvery*0.99);
  }

  player.on("change:life", function (m, life) {
    if (life==0)
      bossGame.set("game-over", "You're dead.");
  });

  badGuy.on("change:life", function (m, life) {
    if (life==0)
      end.resolve();
    else {
      triggerEvery = life*100;
    }
  });

  var pos = bossLevel.get("playerPosition");
  player.set({ "x": pos.x, "y": pos.y });

  badGuy.set("life", 10);
  player.set("life", 3);

  bossLevel.entities.add(badGuy);

  bossGame.set("gravity", DEFAULT_GRAVITY);
  bossGame.set("player", player);
  bossGame.set("badGuy", badGuy);
  bossGame.set("level", bossLevel);

  bossGame.balls.on("hit-badguy", function (ball, dx, dy) {
    badGuy.set("life", badGuy.get("life")-1);
    bossGame.balls.remove(ball);
  });

  bossGame.balls.on("hit-player", function (ball, dx, dy) {
    if (player.get("protection")) {
      var vx = ball.get("vx");
      var vy = ball.get("vy");
      if (vy>0) {
        ball.set({
          "vy": -vy,
          "vx": ball.get("vx") + 0.1*dx
        });
      }
    }
    else {
      bossGame.balls.remove(ball);
      player.set("life", player.get("life")-1);
    }
  });

  bossScene.initLevel();

  setInterval(function () {
    player.set("protection", !player.get("protection"));
  }, 5000);

  triggerLoop();

  bossGame.on("change:game-over", function (model, text) {
    end.reject(text);
  });

  loop();

  end.promise.fin(function () {
    stop = true;
  });

  return end.promise;
}

function end () {
  $('#game').hide();
  $('#gameend').show();
}

function gameover (text) {
  if (text.stack) {
    console.log(text.stack);
  }
  $('#game').hide();
  $('#gameover-reason').text(text);
  $('#gameover').show();
}

function main () {
  $loading.remove();

  return Q()
    .then(intro)
    .then(introDialogs)
    .then(startFalling)
    .then(startGame)
    .then(bossintro)
    .then(boss)
    .then(end, gameover);
}

function error (e) {
  $loading.addClass("error").html("Failed to load. Try again later.");
}

Q.all([ windowReady, soundsReady, resourceReady ])
  .then(main, error)
  .done(function (e) {
    console.log("game end.");
  });


}(window._game));
