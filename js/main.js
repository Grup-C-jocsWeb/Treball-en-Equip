const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MenuScene, GameScene]  // Orden de las escenas, la primera es la que se muestra primero
};

const game = new Phaser.Game(config);