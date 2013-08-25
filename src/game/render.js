(function(g){

  var DEFAULT_FONT = "'Press Start 2P'";

  g.smoothstep = function (min, max, value) { return Math.max(0, Math.min(1, (value-min)/(max-min))); };

  g.LevelRender = Backbone.View.extend({
    initialize: function (opts) {
      var level = this.model;
      var levelwidth = g.SW*level.get('width');
      var levelheight = g.SH*level.get('height');
      var levelContainer = new PIXI.DisplayObjectContainer();
      levelContainer.position.x = (opts.width-levelwidth)/2;

      var tilesContainer = new PIXI.DisplayObjectContainer();
      var tiles = level.entities.map(function (entity) {
        return entity.getSprite();
      }, this);
      _.each(tiles, tilesContainer.addChild, tilesContainer);

      var player = opts.player;
      var playerTile = player && player.getSprite();

      var redOverlay = new PIXI.Graphics();
      redOverlay.alpha = 0;
      redOverlay.beginFill(0xff0000, 1);
      redOverlay.drawRect(0, 0, levelwidth, levelheight);
      redOverlay.endFill();
      
      var levelBackground = new PIXI.Graphics();
      levelBackground.beginFill(0xcccccc, 1);
      levelBackground.drawRect(0, 0, levelwidth, levelheight);
      levelBackground.endFill();

      var imgsrc = level.get("image");
      var levelImage;
      if (imgsrc) {
        levelImage = PIXI.Sprite.fromImage(imgsrc);
      }

      levelContainer.addChild(levelBackground);
      levelImage && levelContainer.addChild(levelImage);
      levelContainer.addChild(tilesContainer);
      playerTile && levelContainer.addChild(playerTile);
      levelContainer.addChild(redOverlay);

      this.redOverlay = redOverlay;
      this.display = levelContainer;
    },
    badGuyEntered: function () {
      return !!this.badGuy;
    },
    badGuyEnter: function () {
      this.badGuy = this.model.getSpriteForBadGuy();
      this.display.addChild(this.badGuy);
    },
    badGuyLeave: function () {
      this.display.removeChild(this.badGuy);
      this.badGuy = null;
    },
    render: function () {
      var remainPercent = this.model.get("remainPercent") || 1;
      this.redOverlay.alpha = 0.7*Math.pow(g.smoothstep(1, 0, remainPercent), 3);
    },
    setY: function (y) {
      this.display.position.y = y;
    }
  });

  g.LevelsFalling = Backbone.View.extend({
    initialize: function (opts) {
      this.width = opts.width;
      this.height = opts.height;
      this.player = opts.player;
      this.levels = opts.levels;
      this.levelTransitionDuration = opts.levelTransitionDuration || 200;
      this.onFinished = opts.onFinished;
      this.stage = new PIXI.Stage(0x000000);
    },
    setLevel: function (i) {
      this.currentI = i;
      var level = this.levels.at(i);
      var oldLevel = this.level;
      if (oldLevel) {
        this.oldLevelTime = +new Date();
        this.oldLevel = oldLevel;
      }
      this.level = new g.LevelRender({
        model: level,
        width: this.width,
        height: this.height
      });
      this.stage.addChild(this.level.display);
      var playerTile = this.player.getSprite();
      this.stage.addChild(playerTile);
    },
    update: function (time) {
      var i = this.levels.size() - 1 - Math.floor(time/this.levelTransitionDuration);
      if (i !== this.currentI) {
        if (i < 0) {
          this.stopped = true;
          this.onFinished && this.onFinished();
        }
        else {
          this.setLevel(i);
        }
      }
    },
    render: function (renderer) {
      var levelTransitionDuration = this.levelTransitionDuration;
      
      if (this.oldLevel) {
        var t = g.smoothstep(0, levelTransitionDuration, +new Date()-this.oldLevelTime);
        this.oldLevel.render();
        this.oldLevel.setY(-this.height*t);
        this.level.setY(this.height*(1-t));
        if (t == 1) {
          this.stage.removeChild(this.oldLevel.display);
          this.oldLevel.remove();
          this.oldLevel = null;
        }
      }
      this.level && this.level.render();
      renderer.render(this.stage);
    }
  });  

  g.GameScene = Backbone.View.extend({
    initialize: function (opts) {
      this.width = opts.width;
      this.height = opts.height;
      this.levelTransitionDuration = opts.levelTransitionDuration || 500;
      this.listenTo(this.model, "change:level", this.onLevelChange);
      this.stage = new PIXI.Stage(0x000000);
    },
    onLevelChange: function () {
      var oldLevel = this.level;
      if (oldLevel) {
        this.oldLevelTime = +new Date();
        this.oldLevel = oldLevel;
      }
      this.level = new g.LevelRender({
        model: this.model.get("level"),
        player: this.model.get("player"),
        width: this.width,
        height: this.height
      });
      this.stage.addChild(this.level.display);
    },
    render: function (renderer) {
      var levelTransitionDuration = this.levelTransitionDuration;
      
      if (this.oldLevel) {
        var t = g.smoothstep(0, levelTransitionDuration, +new Date()-this.oldLevelTime);
        this.oldLevel.render();
        this.oldLevel.setY(this.height*t);
        this.level.setY(-this.height*(1-t));
        if (t == 1) {
          this.stage.removeChild(this.oldLevel.display);
          this.oldLevel.remove();
          this.oldLevel = null;
          this.level.badGuyEnter();
        }
      }

      if (this.level.badGuyEntered() && this.model.get("level").get("activated")) {
        this.level.badGuyLeave();
      }
      
      this.level.render();
      renderer.render(this.stage);
    }
  });

  g.IntroDialogsScene = Backbone.View.extend({
    initialize: function (opts) {
      this.width=opts.width;
      this.height=opts.height;
      this.stage = new PIXI.Stage(0x000000);
      this.cockpit = PIXI.Sprite.fromImage("images/cockpit.png");
      this.cockpit.visible = false;
      this.stage.addChild(this.cockpit);
    },
    showCockpit: function () {
      this.cockpit.visible = true;
    },
    render: function (renderer) {
      renderer.render(this.stage);
    }
  });

  g.IntroScene = Backbone.View.extend({
    initialize: function (opts) {
      this.width=opts.width;
      this.height=opts.height;
      this.stage = new PIXI.Stage(0x000000);

      var date = new PIXI.Text(this.model.get("date"), {
        font: "normal 12px "+DEFAULT_FONT,
        fill: "#fff",
        align: "center"
      });
      date.position.x = 0;
      date.position.y = this.height-40;

      var sec = new PIXI.Text(this.model.get("text"), {
        font: "normal 64px "+DEFAULT_FONT,
        fill: "#fff",
        align: "center"
      });
      sec.position.x = this.width/2-60;
      sec.position.y = this.height/2-30;

      this.stage.addChild(sec);
      this.stage.addChild(date);

      this.model.on("change:text", function (m, text) {
        sec.setText(text);
      });
      this.model.on("change:date", function (m, text) {
        date.setText(text);
      });
    },
    render: function (renderer) {
      renderer.render(this.stage);
    }
  });

  g.Render = Backbone.View.extend({
    initialize: function (opts) {
      this.el.innerHTML = "";
      this.width = opts.width;
      this.height = opts.height;
      this.levelTransitionDuration = opts.levelTransitionDuration || 500;
      this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
      this.el.appendChild(this.renderer.view);
    },
    setScene: function (scene) {
      this.scene = scene;
    },
    render: function () {
      this.scene && this.scene.render(this.renderer);
    }
  });



}(window._game));
