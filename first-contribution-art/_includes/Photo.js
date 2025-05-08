class Photo {
  constructor(img, x, y, direction){
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.dx = 2;
    this.dy = 3;
    this.img = img;
  }
  
  drawImg() {
    this.img.resize(width/4, 0);
    tint(255, 200);
    image(this.img, this.x, this.y);
  }
  
  moveImg() {
    if (this.direction % 2 == 0) {
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;
    } else {
      this.x = this.x - this.dx;
      this.y = this.y - this.dy;
    }
  }
  
  checkBoundary() {
    if (this.x > width || this.x < 0){
      this.dx = this.dx * -1;
    }
    if (this.y > height || this.y < 0){
      this.dy = this.dy * -1;
    }
  }
}