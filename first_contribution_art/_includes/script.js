/*
 ** fun jekyll/github pages workaround:
 ** getPictures uses Liquid to grab file paths from items in the YOUR_PHOTOS_HERE directory
 ** then returns array of filepaths to be used by p5js (below)
 ** Photo object & its display/animation can be found in Photo.js
 */

const getPictures = () => {
  {% assign image_files = site.static_files | where: "image", true %}
  let photoArray = [];
  {% for file in image_files %}
  photoArray.push('{{ site.url }}{{ site.baseurl }}{{ file.path }}');
  {% endfor %}
  return photoArray;
}

// p5js variables
let unformattedPhotos = getPictures();
let photos = [];
let imgX;
let imgY;
let direction;
let contribs = [];
let displaceColorsSrc = `
precision highp float;

uniform sampler2D tex0;
varying vec2 vTexCoord;

vec2 zoom(vec2 coord, float amount) {
  vec2 relativeToCenter = coord - 0.5;
  relativeToCenter /= amount; // Zoom in
  return relativeToCenter + 0.5; // Put back into absolute coordinates
}

void main() {
  // Get each color channel using coordinates with different amounts
  // of zooms to displace the colors slightly
  gl_FragColor = vec4(
    texture2D(tex0, vTexCoord).r,
    texture2D(tex0, zoom(vTexCoord, 1.1)).g,
    texture2D(tex0, zoom(vTexCoord, 1.15)).b,
    texture2D(tex0, vTexCoord).a
  );
}
`;

//p5js event functions
function preload() {
  unformattedPhotos.forEach((x) => {
    let img = loadImage(x);
    photos.push(img);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  displaceColors = createFilterShader(displaceColorsSrc);
  photos.forEach((x) => {
    imgX = random(1, width-1);
    imgY = random(1, height-1);
    direction = Math.floor(Math.random() * 10);
    contribs.push(new Photo(x, imgX, imgY, direction));
  });
}

function draw() {
  background(255);
  push();
  for (let i = 0; i < contribs.length; i++) {
    contribs[i].drawImg();
    contribs[i].moveImg();
    contribs[i].checkBoundary();
  }
  //filter(displaceColors);
  pop();
  push();
  textSize(width/15);
  text('First Contributions', 50, width/10);
  pop();
  frameRate(40);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
