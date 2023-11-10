const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let axolot;
let flamby;
let battleAnimationId;
let queue = [];

const initBattle = () => {
  battleMusic.play();
  document.querySelector(".user-interface").style.display = "block";
  document.querySelector("#quotes").style.display = "none";
  document.querySelector("#enemy").style.width = "100%";
  document.querySelector("#player").style.width = "100%";
  document.querySelector(".attack-container").replaceChildren();

  axolot = new Monster(monsters.Axolot);
  flamby = new Monster(monsters.Flamby);

  flamby.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector(".attack-container").append(button);
  });

  //* event listeners for our button (attacks)
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      flamby.attack({
        attack: selectedAttack,
        recipient: axolot,
      });

      if (axolot.health <= 0) {
        queue.push(() => {
          axolot.faint();
        });

        queue.push(() => {
          gsap.to(".block", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector(".user-interface").style.display = "none";

              gsap.to(".block", {
                opacity: 0,
              });

              battle.initiated = false;
            },
          });

          return;
        });
        victory.play();

        return;
      }

      // *axolot or enemy attacks
      const randomAttack = axolot.attacks[Math.floor(Math.random() * axolot.attacks.length)];

      queue.push(() => {
        axolot.attack({
          attack: randomAttack,
          recipient: flamby,
        });

        if (flamby.health <= 0) {
          queue.push(() => {
            flamby.faint();
          });

          queue.push(() => {
            gsap.to(".block", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                animate();
                document.querySelector(".user-interface").style.display = "none";

                gsap.to(".block", {
                  opacity: 0,
                });

                battle.initiated = false;
              },
            });
          });

          return;
        }
      });
    });

    button.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.getElementById("attack-type").innerHTML = selectedAttack.type;
    });
  });
};

const animateBattle = () => {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  axolot.draw();
  flamby.draw();
};

document.getElementById("quotes").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
