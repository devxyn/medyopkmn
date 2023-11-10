class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = {
      max: 1,
      hold: 10,
    },
    sprites,
    animate = false,
  }) {
    this.position = position;
    this.image = new Image();
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src = image.src;

    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
  }

  draw() {
    canvasContext.save();
    canvasContext.globalAlpha = this.opacity;
    canvasContext.drawImage(
      this.image,
      this.frames.val * this.width, // cropping x-axis starting point
      0, // cropping y-axis starting point
      this.image.width / this.frames.max, // cropping width
      this.image.height, // cropping height
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max, // image width
      this.image.height, // image height
    );
    canvasContext.restore();

    if (!this.animate) return;
    if (this.frames.max > 1) {
      this.frames.elapsed += 1;
    }

    if (this.frames.elapsed % this.frames.hold === 0)
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
  }
}

class Monster extends Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = {
      max: 1,
      hold: 10,
    },
    sprites,
    animate = false,
    isEnemy = false,
    name,
    attacks,
  }) {
    super({
      position,
      velocity,
      image,
      frames,
      sprites,
      animate,
    });
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.attacks = attacks;
  }

  faint() {
    document.getElementById("quotes").innerHTML = `${this.name} fainted!`;
    battleMusic.pause();
    battleMusic.currentTime = 0;

    gsap.to(this, {
      opacity: 0,
    });
  }

  attack({ attack, recipient }) {
    document.getElementById("quotes").style.display = "block";
    document.getElementById("quotes").innerHTML = `${this.name} used ${attack.name}`;

    recipient.health -= attack.damage;
    let movementDistance = 20;
    if (this.isEnemy) movementDistance = -20;

    let healthBar = "#enemy";
    if (this.isEnemy) healthBar = "#player";

    switch (attack.name) {
      case "Tackle":
        const tackleTL = gsap.timeline();

        tackleTL
          .to(this.position, {
            x: this.position.x - movementDistance,
          })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.05,
            onComplete: () => {
              //* enemy gets hit
              tackleHit.play();
              gsap.to(healthBar, {
                width: recipient.health + "%",
              });
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 1,
                duration: 0.08,
              }),
                gsap.to(recipient, {
                  opacity: 0,
                  yoyo: true,
                  repeat: 1,
                  duration: 0.05,
                });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;

      case "Scratch":
        const scratchTL = gsap.timeline();

        if (this.isEnemy) movementDistance = -20;

        if (this.isEnemy) healthBar = "#player";

        scratchTL
          .to(this.position, {
            x: this.position.x - movementDistance,
          })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.05,
            onComplete: () => {
              //* enemy gets hit
              scratchHit.play();
              gsap.to(healthBar, {
                width: recipient.health + "%",
              });
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 1,
                duration: 0.08,
              }),
                gsap.to(recipient, {
                  opacity: 0,
                  yoyo: true,
                  repeat: 1,
                  duration: 0.05,
                });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;

      default:
        break;
    }
  }
}

class Boundary {
  static width = 32;
  static height = 32;
  constructor({ position }) {
    this.position = position;
    this.width = 32;
    this.height = 32;
  }

  draw() {
    canvasContext.fillStyle = "rgba(255,0,0,0)";
    canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
