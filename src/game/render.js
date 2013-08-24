(function(g){

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
      var playerTile = player.getSprite();

      var redOverlay = new PIXI.Graphics();
      redOverlay.alpha = 0;
      redOverlay.beginFill(0xff0000, 1);
      redOverlay.drawRect(0, 0, levelwidth, levelheight);
      redOverlay.endFill();
      
      var levelBackground = new PIXI.Graphics();
      levelBackground.beginFill(0xcccccc, 1);
      levelBackground.drawRect(0, 0, levelwidth, levelheight);
      levelBackground.endFill();

      levelContainer.addChild(levelBackground);
      levelContainer.addChild(tilesContainer);
      levelContainer.addChild(playerTile);
      levelContainer.addChild(redOverlay);

      this.redOverlay = redOverlay;
      this.display = levelContainer;
    },
    render: function () {
      var remainPercent = this.model.get("remainPercent") || 1;
      this.redOverlay.alpha = 0.3*g.smoothstep(1, 0, remainPercent);
    },
    setY: function (y) {
      this.display.position.y = y;
    }
  });

  g.GameRender = Backbone.View.extend({
    initialize: function (opts) {
      this.el.innerHTML = "";
      this.width = opts.width;
      this.height = opts.height;
      this.levelTransitionDuration = opts.levelTransitionDuration || 500;
      this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
      this.el.appendChild(this.renderer.view);
      this.listenTo(this.model, "change:level", this.onLevelChange);
      //this.initialStage();
      this.gameStage();
    },
    initialStage: function () {
      this.stage = new PIXI.Stage(0xFF00FF);
    },
    gameStage: function () {
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
    render: function () {
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
        }
      }
      
      this.level.render();
      this.renderer.render(this.stage);
    }
  });

}(window._game));
