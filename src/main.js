
// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFF00FF);

// create a renderer instance
var renderer = PIXI.autoDetectRenderer(400, 300);

// add the renderer view element to the DOM
document.getElementById("game").appendChild(renderer.view);

requestAnimFrame(render);

function render () {
  requestAnimFrame(render);
  renderer.render(stage);
}

