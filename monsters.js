const monsters = {
  Flamby: {
    position: { x: 300, y: 325 },
    image: {
      src: "./img/flamby.png",
    },
    frames: { max: 4, hold: 15 },
    animate: true,
    name: "Flamby",
    attacks: [attacks.Tackle, attacks.Scratch],
  },

  Axolot: {
    position: { x: 800, y: 100 },
    image: {
      src: "./img/axl.png",
    },
    frames: { max: 4, hold: 20 },
    animate: true,
    isEnemy: true,
    name: "Axolot",
    attacks: [attacks.Tackle, attacks.Scratch],
  },
};
