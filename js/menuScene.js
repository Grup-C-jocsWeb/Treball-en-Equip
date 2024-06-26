class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {

    }

    create() {
        // Título del juego
        this.add.text(480, 200, 'Unmasked Crime', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        // Botón de "Play"
        this.playButton = this.add.text(480, 350, 'Play', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(true);

        this.playButton.on('pointerdown', () => {
            this.showPlayOptions();
        });

        // Botones de "Nueva Partida" y "Cargar Partida"
        this.newGameButton = this.add.text(480, 400, 'Nueva Partida', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        this.loadGameButton = this.add.text(480, 450, 'Cargar Partida', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        // Funcionalidad de los botones
        this.newGameButton.on('pointerdown', () => {
            // Limpiar cualquier estado guardado
            localStorage.removeItem('unmaskedCrimeSave');
            // Reiniciar el juego iniciando la escena GameScene
            this.scene.start('GameScene', { loadGame: false });
        });

        this.loadGameButton.on('pointerdown', () => {
            // Cargar la partida guardada
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
