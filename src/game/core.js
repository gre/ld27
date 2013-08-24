(function(g){

  var SW = 32, SH = 32;
  g.SW = SW;
  g.SH = SH;

  // x, y
  g.Entity = Backbone.Model.extend({
    update: function () {
    },
    blockPlayer: function () {
      return true;
    },
    avoidGravity: function () {
      return false;
    }
  });

  g.Entities = Backbone.Collection.extend({
    model: g.Entity
  });


  g.Player = g.Entity.extend({
    initialize: function () {
      this.sprite = PIXI.Sprite.fromImage("images/player.png");
      this.syncPosition();

      this.set("w", 0.5);
      this.set("h", 1);
      this.set("speedx", 0.007);
      this.set("speedy", 0.005);
      this.set("accx", 0);
      this.set("accy", 0);
      this.set("dx", 0);
      this.set("dy", 0);
      this.set("flyRatio", 0.5);
      this.on("change:x change:y", this.syncPosition, this);
    },
    blockPlayer: function () {
      return false;
    },
    syncPosition: function () {
      this.sprite.position.x = SW*this.get("x");
      this.sprite.position.y = SH*this.get("y");
    },
    getSprite: function () {
      return this.sprite;
    },
    canJump: function () {
      return this.get("floor") && !this.get("ladder");
    },
    update: function (time, delta, game) {
      var flyRatio = this.get("flyRatio");
      var speedx = this.get("speedx");
      var speedy = this.get("speedy");
      var onFloor = this.get("floor");
      var slide = this.get("slide");
      var onLadder = game.playerIsOnLadder(this);
      
      var gravity = onLadder ? 0 : game.get("gravity");
      var accx = this.get("accx");
      var accy = this.get("accy") + gravity*delta;
      
      var dx = 0, dy = 0;

      dx += accx;
      if (onFloor||onLadder) {
        dx += this.get("dx")*speedx*delta;
      }
      else {
        dx += this.get("dx")*speedx*delta*flyRatio;
      }

      dy += accy;
      if (onLadder) {
        dy += this.get("dy")*speedy*delta;
      }
      else if (!onFloor) {
        dy += Math.max(0, this.get("dy")*speedy*delta*flyRatio);
      }

      var constraints = game.movePlayer(this, dx, dy);
      onFloor = constraints.ycollide && constraints.yinside > 0;
      this.set("floor", onFloor);
      this.set("ladder", onLadder);

      if (onLadder || constraints.xcollide) {
        this.set("accx", 0);
      }
      else if (constraints.ycollide) {
        this.set("accx", slide*accx);
      }
      else {
        this.set("accx", accx);
      }

      if (onLadder || constraints.ycollide) {
        this.set("accy", 0);
      }
      else if (constraints.xcollide) {
        this.set("accy", 0.9*accy);
      }
      else {
        this.set("accy", accy);
      }
    }
  });

  g.ExitLadder = g.Entity.extend({
    blockPlayer: function () {
      return false;
    },
    avoidGravity: function () {
      return true;
    },
    getSprite: function () {
      var sprite = PIXI.Sprite.fromImage("images/exit-ladder.png");
      sprite.position.x = SW*this.get("x");
      sprite.position.y = SH*this.get("y");
      return sprite;
    }
  });  
  
  g.ExitDoor = g.Entity.extend({
    blockPlayer: function () {
      return false;
    },
    avoidGravity: function () {
      return true;
    },
    initialize: function () {
      var container = new PIXI.DisplayObjectContainer();
      container.position.x = SW*this.get("x");
      container.position.y = SH*this.get("y");
      var img = PIXI.Sprite.fromImage("images/exit-door.png");
      var door = new PIXI.Graphics();
      container.addChild(img);
      container.addChild(door);
      this.door = door;
      this.sprite = container;
    },
    update: function (time, delta, game) {
      var remainPercent = this.get("level").get("remainPercent") || 1;
      var closing1 = g.smoothstep(1.0, 0.0, remainPercent);
      var closing2 = Math.pow(g.smoothstep(1.0, 0.0, remainPercent), 4);
      var door = this.door;
      var doorEnvSize = 2;
      door.clear();
      door.beginFill(0x323738, 0.5);
      door.drawRect(0, 0, closing1*SW, doorEnvSize);
      door.drawRect(0, SH-doorEnvSize, closing1*SW, doorEnvSize);
      door.endFill();
      door.beginFill(0x323738, 1);
      door.drawRect(0, 0, closing2*SW, SH);
      door.endFill();
    },
    getSprite: function () {
      return this.sprite;
    }
  });
  
  // TODO: close effect
  g.ClosingDoor = g.Entity.extend({
    getSprite: function () {
      var sprite = PIXI.Sprite.fromImage("images/closingdoor.png");
      sprite.position.x = SW*this.get("x");
      sprite.position.y = SH*this.get("y");
      return sprite;
    }
  });

  g.BrokenPlatform = g.Entity.extend({
    getSprite: function () {
      var sprite = PIXI.Sprite.fromImage("images/broken-platform.png");
      sprite.position.x = SW*this.get("x");
      sprite.position.y = SH*this.get("y");
      return sprite;
    }
  });
  
  g.Platform = g.Entity.extend({
    getSprite: function () {
      var sprite = PIXI.Sprite.fromImage("images/platform.png");
      sprite.position.x = SW*this.get("x");
      sprite.position.y = SH*this.get("y");
      return sprite;
    }
  });
  
  g.SwitchButton = g.Entity.extend({
    initialize: function () {
      var container = new PIXI.DisplayObjectContainer();
      container.position.x = SW*this.get("x");
      container.position.y = SH*this.get("y");
      this.s_on = PIXI.Sprite.fromImage("images/switch-on.png");
      this.s_off = PIXI.Sprite.fromImage("images/switch-off.png");
      container.addChild(this.s_off);
      this.sprite = container;
    },
    getSprite: function () {
      return this.sprite;
    },
    blockPlayer: function () {
      return false;
    },
    activate: function () {
      var v = !this.get("switch");
      this.set("switch", v);
      this.sprite.removeChild(!v ? this.s_on : this.s_off);
      this.sprite.addChild(v ? this.s_on : this.s_off);
    }
  });
  
  g.MovingPlatform = g.Entity.extend({
    initialize: function () {
      var sprite = PIXI.Sprite.fromImage("images/moving-platform.png");
      sprite.position.x = SW*this.get("x");
      sprite.position.y = SH*this.get("y");
      this.sprite = sprite;
      this.on("change:y", function (model, y) {
        sprite.position.y = SW*y;
      });      
      this.on("change:x", function (model, x) {
        sprite.position.x = SW*x;
      });
      this.set("v", this.get("speed"));
    },
    getSprite: function () {
      return this.sprite;
    },
    update: function (time, delta, game) {
      if (this.get("horizontal")) {
        var x = this.get("x");
        var from = this.get("from");
        var to = this.get("to");
        var speed = this.get("speed");
        if (x < from) {
          x = from;
          this.set("v", speed);
        }
        else if (x > to) {
          x = to;
          this.set("v", -speed);
        }
        this.set("x", x + this.get("v")*delta);
      }
    }
  });

  g.Ladder = g.Entity.extend({
    getSprite: function () {
      var sprite = PIXI.Sprite.fromImage("images/ladder.png");
      sprite.position.x = SW*this.get("x");
      sprite.position.y = SH*this.get("y");
      if (this.get("reverse")) {
        sprite.pivot.x = SW;
        sprite.scale.x = -1;
      }
      return sprite;
    },
    blockPlayer: function () {
      return false;
    },
    avoidGravity: function () {
      return true;
    }
  });
  
  g.WallButton = g.Entity.extend({
    getSprite: function () {
      var sprite = PIXI.Sprite.fromImage("images/wall-button.png");
      sprite.position.x = SW*this.get("x");
      sprite.position.y = SH*this.get("y");
      return sprite;
    },
    blockPlayer: function () {
      return false;
    },
    activate: function () {
      this.set("activated", true);
    }
  });

  g.WallLevelNumber = g.Entity.extend({
    getSprite: function () {
      var container = new PIXI.DisplayObjectContainer();
      container.position.x = SW*this.get("x");
      container.position.y = SH*this.get("y");
      var img = PIXI.Sprite.fromImage("images/wall.png");
      var textValue = ""+this.get("number");
      var text = new PIXI.Text(textValue, {
        font: "normal 12px monospace",
        fill: "#fff"
      });
      text.position.x = (SW-textValue.length*6)/2;
      text.position.y = 8;
      container.addChild(img);
      container.addChild(text);
      return container;
    }
  });

  g.Wall = g.Entity.extend({
    getSprite: function () {
      var sprite = PIXI.Sprite.fromImage("images/wall.png");
      sprite.position.x = SW*this.get("x");
      sprite.position.y = SH*this.get("y");
      return sprite;
    }
  });

  g.WallWithAlarm = g.Entity.extend({
    initialize: function () {
      var container = new PIXI.DisplayObjectContainer();
      container.position.x = SW*this.get("x");
      container.position.y = SH*this.get("y");
      var wall = PIXI.Sprite.fromImage("images/wall.png");
      var alarm = PIXI.Sprite.fromImage("images/alarm.png");
      alarm.alpha = 0;
      alarm.rotation = 0;
      alarm.position.x = SW/2;
      alarm.position.y = SH/2;
      alarm.pivot.x = SW/2;
      alarm.pivot.y = SH/2;
      container.addChild(wall);
      container.addChild(alarm);
      this.alarm = alarm;
      this.sprite = container;

      this.get("level").on("change:activated", function (m, activated) {
        alarm.alpha = activated ? 1 : 0;
      });
    },
    update: function (time, delta, game) {
      this.alarm.rotation = (time*0.006) % (2*Math.PI);
    },
    getSprite: function () {
      return this.sprite;
    }
  });

  g.Level = Backbone.Model.extend({
    initialize: function (opts) {
      this.entities = new g.Entities();
      var maxX = -1;
      var maxY = -1;
      this.entities.add(_.filter(_.flatten(_.map(opts.map, function (line, y) {
        maxY = Math.max(maxY, y);
        return _.map(line, function (t, x) {
          maxX = Math.max(maxX, x);
          switch (t) {
            case "p": return new g.Platform({ x: x, y: y });
            case "P": return new g.BrokenPlatform({ x: x, y: y });
            case "l": return new g.Ladder({ x: x, y: y });
            case "t": return new g.Ladder({ x: x, y: y, reverse: true });
            case "a": return new g.WallWithAlarm({ x: x, y: y, level: this });
            case "b": return new g.WallButton({ x: x, y: y });
            case "w": return new g.Wall({ x: x, y: y });
            case "#": return new g.WallLevelNumber({ x: x, y: y, number: this.get("levelNumber") });
            case "-": return new g.ClosingDoor({ x: x, y: y });
            case "_":
              var from = _.indexOf(line, ">");
              var to = _.indexOf(line, "<");
              return new g.MovingPlatform({ x: x, y: y, horizontal: true, from: from, to: to, speed: 0.002 });
            case "x": return new g.ExitDoor({ x: x, y: y, level: this });
            case "=": return new g.ExitLadder({ x: x, y: y });
            case "G": return new g.SwitchButton({ x: x, y: y, typ: "gravity" });
            case "o": 
              this.set("playerPosition", { x: x, y: y });
              return undefined;
          }
        }, this);
      }, this)), function (o) { return o }));
      this.set("width", maxX+1);
      this.set("height", maxY+1);
      this.set("exit-door-closeTime", 10000);

      this.entities.on("change:activated", this.onActivated, this);
      this.on("enter", this.onEnter, this);
      this.on("leave", this.onLeave, this);
    },
    onEnter: function (game) {
      this._current = true;
    },
    onLeave: function (game) {
      this._current = false;
    },
    update: function (time, delta, game) {
      var activated = this.get("exit-door-activated");
      this.set("activated", activated);
      if (activated) {
        var closeTime = this.get("exit-door-closeTime");
        var remain = closeTime - (+new Date() - activated);
        this.set("remainPercent", remain/closeTime);
        this.set("remainSeconds", Math.floor(remain/1000));
        if (remain < 0 && this._current)
          game.set("game-over", "Capsule collapsed.");
      }
      this.entities.each(function (e) {
        e.update(time, delta, game);
      });
    },
    onActivated: function (entity) {
      if (entity instanceof g.WallButton) {
        this.set("exit-door-activated", +new Date());
      }
    },
    // TODO: getEntitiesByPosition
    getEntityByPosition: function (x, y) {
      return this.entities.find(function (entity) {
        return Math.floor(x)==entity.get("x") &&
               Math.floor(y)==entity.get("y");
      });
    }
  });

  g.Levels = Backbone.Collection.extend({
    model: g.Level
  });

  g.Game = Backbone.Model.extend({
    initialize: function () {
      this.updates = new Backbone.Collection();
      this.on("change:level", function () {
        var level = this.get("level");
        level.trigger("enter", this);
        this.updates.add(level);
        var prev = this.previous("level");
        if (prev) {
          prev.trigger("leave", this);
          this.updates.remove(prev);
        }
      }, this);
      this.on("change:player", function () {
        var player = this.get("player");
        this.updates.add(player);
        var prev = this.previous("player");
        prev && this.updates.remove(prev);
      }, this);
    },
    update: function (time, delta, game) {
      var args = arguments;
      this.updates.each(function (u) {
        u.update.apply(u, args);
      });
      var player = this.get("player");
      if (this.playerIsOutside(player)) {
        this.trigger("player-exit");
      }
      this.trigger("update", time, delta, game);
    },
    playerIsOnLadder: function (player) {
      var x = player.get("x");
      var y = player.get("y");
      var w = player.get("w");
      var h = player.get("h");
      var level = this.get("level");
      if (!level) return 0;
      var upper = level.getEntityByPosition(x+w/2, y);
      var under = level.getEntityByPosition(x+w/2, y+h);
      if (upper && upper.avoidGravity(this)) return upper;
      if (under && under.avoidGravity(this)) return under;
    },
    playerIsOutside: function (player) {
      var w = player.get("w");
      var h = player.get("h");
      var x = player.get("x");
      var y = player.get("y");
      var level = this.get("level");
      return x < -w ||
             x > SW*level.get("width")+w ||
             y < -h ||
             y > SH*level.get("height")+h;
    },
    movePlayer: function (player, dx, dy) {
      var w = player.get("w");
      var h = player.get("h");
      var px = player.get("x");
      var py = player.get("y");
      var level = this.get("level");

      var ox = px;
      var oy = py;

      var xcollide = false;
      var ycollide = false;
      var x = ox;
      var y = oy;

      var canGoOut = level.get("activated");

      function findBlock (x, y) {
        var e = level.getEntityByPosition(x, y);
        if (e && e.blockPlayer(player))
          return e;
      }

      y += dy;

      var blocky;
      if (dy > 0) {
        blocky = findBlock(x, y+h) || findBlock(x+w, y+h);
      }
      else if (dy < 0) {
        blocky = findBlock(x, y) || findBlock(x+w, y);
      }
      if (blocky) {
        var bx = blocky.get("x");
        var by = blocky.get("y");
        ycollide = x+w>bx && x<bx+1;
        if (ycollide) {
          y = dy > 0 ? by-h : by+1;
        }
      }

      x += dx;

      var blockx;
      if (dx > 0) {
        blockx = findBlock(x+w, y) || findBlock(x+w, y+h);
      }
      else if (dx < 0) {
        blockx = findBlock(x, y) || findBlock(x, y+h);
      }

      if (blockx) {
        var bx = blockx.get("x");
        var by = blockx.get("y");
        var xcollide = y+h>by && y<by+1;
        if (xcollide) {
          x = dx > 0 ? bx-w : bx+1;
        }
      }

      if (!canGoOut) {
        x = Math.max(0, Math.min(x, level.get("width")));
        y = Math.max(0, Math.min(y, level.get("width")));
      }

      player.set({ x: x, y: y });
      return {
        xcollide: xcollide,
        ycollide: ycollide,
        xinside: blockx ? blockx.get("x")-x : 0,
        yinside: blocky ? blocky.get("y")-y : 0,
        xblock: blockx,
        yblock: blocky
      };
    }
  });


  g.Keyboard = Backbone.Model.extend({
    initialize: function () {
      document.addEventListener("keypress", _.bind(function (e) {
        e.preventDefault();
      }));
      document.addEventListener("keydown", _.bind(function (e) {
        var prevent = true;
        switch (e.which) {
          case 13: case 69: // action
            this.trigger("action");
            break;
          case 37: case 81:  case 65: // left
            this.set("left", true);
            break;
          case 39: case 68: // right
            this.set("right", true);
            break;
          case 38: case 90: case 87: // up
            this.set("up", true);
            break;
          case 40: case 83: // down
            this.set("down", true);
            break;
          default:
            prevent = false;
        }
        prevent && e.preventDefault();
      }, this));
      document.addEventListener("keyup", _.bind(function (e) {
        switch (e.which) {
          case 37: case 81:  case 65: // left
            this.set("left", false);
            break;
          case 39: case 68: // right
            this.set("right", false);
            break;
          case 38: case 90: case 87: // up
            this.set("up", false);
            break;
          case 40: case 83: // down
            this.set("down", false);
            break;
          default:
            prevent = false;
        }
      }, this));
    }
  });

}(window._game));
