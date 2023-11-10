const canvas = document.querySelector("canvas");
const body = document.querySelector("body");
const main = document.querySelector("main");

//* sets the canvas' width and height
canvas.width = 1024;
canvas.height = 600;

//*  requests the 2D rendering context
const canvasContext = canvas.getContext("2d");

const collisionMap = [];
for (let i = 0; i < collisions.length; i += 136) {
  collisionMap.push(collisions.slice(i, 136 + i));
}

const battlezoneMap = [];
for (let i = 0; i < battleZonesData.length; i += 136) {
  battlezoneMap.push(battleZonesData.slice(i, 136 + i));
}

const boundaries = [];
const offSet = {
  x: -735,
  y: -520,
};

collisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 16065)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offSet.x,
            y: i * Boundary.height + offSet.y,
          },
        }),
      );
  });
});

const battleZones = [];

battlezoneMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 16065)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offSet.x,
            y: i * Boundary.height + offSet.y,
          },
        }),
      );
  });
});

//* creates an image element for map
const bgImage = new Image();
bgImage.src = "./img/map.png";

//* creates an image element for foreground objects
const foregroundImage = new Image();
foregroundImage.src = "./img/foreground.png";

//* creates an image element for player
const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
  },
});

const background = new Sprite({
  position: {
    x: offSet.x,
    y: offSet.y,
  },
  image: bgImage,
});

const foreground = new Sprite({
  position: {
    x: offSet.x,
    y: offSet.y,
  },
  image: foregroundImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries, foreground, ...battleZones];

const boxCollision = ({ box1, box2 }) => {
  return (
    box1.position.x + box1.width >= box2.position.x &&
    box1.position.x <= box2.position.x + box2.width &&
    box1.position.y + box1.height >= box2.position.y &&
    box1.position.y <= box2.position.y
  );
};

const battle = {
  initiated: false,
};

const animate = () => {
  titleMusic.pause();
  inGameMusic.play();
  document.querySelector(".user-interface").style.display = "none";
  body.style.backgroundImage = "url('')";
  main.style.marginTop = "2em";

  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;

  if (battle.initiated) return;

  // activate battle
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];

      if (
        boxCollision({
          box1: player,
          box2: battleZone,
        }) &&
        Math.random() < 0.003
      ) {
        //deactivate current animation
        window.cancelAnimationFrame(animationId);
        inGameMusic.pause();
        startBattle.play();
        battle.initiated = true;
        gsap.to(".block", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to(".block", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                initBattle();
                animateBattle();
                gsap.to(".block", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boxCollision({
          box1: player,
          box2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movables) => {
        movables.position.y += 3;
      });
  }
  if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boxCollision({
          box1: player,
          box2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movables) => {
        movables.position.x += 3;
      });
  }
  if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boxCollision({
          box1: player,
          box2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movables) => {
        movables.position.y -= 3;
      });
  }
  if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boxCollision({
          box1: player,
          box2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movables) => {
        movables.position.x -= 3;
      });
  }
};

let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;

    default:
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;

    default:
      break;
  }
});

const startBtn = document.getElementById("start-btn");
const homeBtn = document.getElementById("home-btn");
const instructionBtn = document.getElementById("instructions-btn");
const closeBtn = document.getElementById("close-btn");
const container = document.querySelector(".container");
const titleContainer = document.querySelector(".title-container");
const instructionContainer = document.querySelector(".instructions-container");
const quitBox = document.querySelector(".quit-box");
const quitYes = document.getElementById("quit-yes");
const quitNo = document.getElementById("quit-no");

startBtn.addEventListener("click", () => {
  animate();
  loaded = true;
  titleContainer.style.display = "none";
  homeBtn.style.display = "block";
  container.style.display = "inline-block";
  clickOpen.play();
});

instructionBtn.addEventListener("click", () => {
  titleContainer.style.display = "none";
  instructionContainer.style.display = "flex";
  clickOpen.play();
});

closeBtn.addEventListener("click", () => {
  clickClose.play();
  instructionContainer.style.display = "none";
  titleContainer.style.display = "flex";
});

homeBtn.addEventListener("click", () => {
  homeBtn.style.display = "none";
  quitBox.style.display = "flex";
  clickClose.play();
});

quitYes.addEventListener("click", () => {
  window.location.reload();
});

quitNo.addEventListener("click", () => {
  quitBox.style.display = "none";
  homeBtn.style.display = "block";
  clickClose.play();
});

let loaded = false;

const windowLoad = () => {
  if (!loaded) {
    titleMusic.play();
    titleMusic.loop = true;
  }
};

window.addEventListener("click", () => {
  windowLoad();
});
