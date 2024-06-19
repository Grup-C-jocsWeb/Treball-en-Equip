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
        const playButton = this.add.text(400, 350, 'Play', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();

        playButton.on('pointerdown', () => {
            this.showPlayOptions();
        });

        // Crear botones de "Nueva Partida" y "Cargar Partida" pero ocultarlos inicialmente
        this.newGameButton = this.add.text(400, 400, 'Nueva Partida', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        this.loadGameButton = this.add.text(400, 450, 'Cargar Partida', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        // Añadir funcionalidad a los botones
        this.newGameButton.on('pointerdown', () => {
            // Limpiar cualquier estado guardado
            localStorage.removeItem('unmaskedCrimeSave');
            this.scene.start('GameScene');
        });

        this.loadGameButton.on('pointerdown', () => {
            this.scene.start('GameScene', { loadGame: true });
        });
    }

    showPlayOptions() {
        this.newGameButton.setVisible(true);
        this.loadGameButton.setVisible(true);
    }
}