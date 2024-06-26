class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
    }

    create() {
        // Título del juego
        this.add.text(480, 250, 'UNMASKED CRIME', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        // Botón de "Play"
        this.playButton = this.add.text(480, 350, 'PLAY', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(true);

        this.playButton.on('pointerdown', () => {
            this.showPlayOptions();
        });

        // Botones de "Nueva Partida" y "Cargar Partida"
        this.newGameButton = this.add.text(480, 400, 'NEW GAME', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        this.loadGameButton = this.add.text(480, 450, 'LOAD GAME', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        // Funcionalidad de los botones
        this.newGameButton.on('pointerdown', () => {
            // Limpiar cualquier estado guardado
            localStorage.removeItem('unmaskedCrimeSave');
            this.scene.start('GameScene', { loadGame: false });
        });

        this.loadGameButton.on('pointerdown', () => {
            this.scene.start('GameScene', { loadGame: true });
        });
    }

    showPlayOptions() {
        // Ocultar el botón de "Play" y mostrar los botones de "Nueva Partida" y "Cargar Partida"
        this.playButton.setVisible(false);
        this.newGameButton.setVisible(true);
        this.loadGameButton.setVisible(true);
    }
}
