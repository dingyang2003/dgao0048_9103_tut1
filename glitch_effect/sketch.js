/*
 * Dynamic Mondrian Glitch v2
 * by ChatGPT (2025)
 * Interactive generative art inspired by Piet Mondrian.
 */

let rects = [];
let palette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(RGB);
  palette = [
    color(237, 28, 36),  // red
    color(255, 242, 0),  // yellow
    color(0, 56, 168),   // blue
    color(255),          // white
    color(0)             // black
  ];
  generateMondrian();
}

function draw() {
  background(0, 30);

  for (let r of rects) {
    r.update();
    r.show();
  }

  // glitch line overlay
  if (random() < 0.015) {
    push();
    stroke(255, 60);
    strokeWeight(random(1, 3));
    line(random(width), random(height), random(width), random(height));
    pop();
  }
}

// --- Generate random Mondrian composition
function generateMondrian() {
  rects = [];
  let divX = int(random(5, 9));
  let divY = int(random(5, 8));
  let xCuts = [0];
  let yCuts = [0];

  for (let i = 1; i < divX; i++) xCuts.push(random(width));
  for (let j = 1; j < divY; j++) yCuts.push(random(height));
  xCuts.push(width);
  yCuts.push(height);
  xCuts.sort((a, b) => a - b);
  yCuts.sort((a, b) => a - b);

  for (let i = 0; i < xCuts.length - 1; i++) {
    for (let j = 0; j < yCuts.length - 1; j++) {
      if (random() < 0.9) {
        let x = xCuts[i];
        let y = yCuts[j];
        let w = xCuts[i + 1] - xCuts[i];
        let h = yCuts[j + 1] - yCuts[j];
        let c = random(palette);
        rects.push(new GlitchRect(x, y, w, h, c));
      }
    }
  }
}

class GlitchRect {
  constructor(x, y, w, h, col) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.baseColor = col;
    this.currentColor = col;
    this.offset = random(TWO_PI);
    this.glitchStrength = random(0.5, 2);
  }

  update() {
    // 微妙漂浮
    this.y += sin(frameCount * 0.01 + this.offset) * 0.2;
    if (this.y > height) this.y = -this.h;

    // 鼠标交互
    let d = dist(mouseX, mouseY, this.x + this.w / 2, this.y + this.h / 2);
    if (d < 120) {
      this.currentColor = color(
        red(this.baseColor) + random(-40, 40),
        green(this.baseColor) + random(-40, 40),
        blue(this.baseColor) + random(-40, 40)
      );
      this.x += random(-1, 1) * this.glitchStrength;
      this.y += random(-1, 1) * this.glitchStrength;
    } else {
      this.currentColor = lerpColor(this.currentColor, this.baseColor, 0.05);
    }

    // glitch 随机颜色跳变
    if (random() < 0.001) {
      this.baseColor = random(palette);
    }
  }

  show() {
    fill(this.currentColor);
    rect(this.x, this.y, this.w, this.h);
  }
}

function mousePressed() {
  generateMondrian();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateMondrian();
}

