window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        width: 960,
        height: 640,
        scene: [MenuScene, GameScene, HipotesisScene],
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }
            }
        }
    };

    const game = new Phaser.Game(config);
};
