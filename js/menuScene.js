class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Cargar cualquier recurso necesario para el menú aquí
    }

    create() {
        // Título del juego
        this.add.text(400, 200, 'Unmasked Crime', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        // Botón de "Play"
        const playButton = this.add.text(400, 400, 'Play', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();

        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
