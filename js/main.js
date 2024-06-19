window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: [MenuScene, GameScene],
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
