

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Cargar los recursos del juego aquí
        this.load.spritesheet('player', 'assets/artem.png', { frameWidth: 48, frameHeight: 64 });
    }

    create(data) {
        // Inicializar los objetos del juego aquí
        this.player = this.physics.add.sprite(400, 300, 'player');

        // Ajustar el escalado para arte de píxeles
        this.player.setScale(1); // Aumentar o ajustar el tamaño si es necesario
        this.player.setOrigin(0.5, 0.5);
        this.player.setTexture('player');

        // Deshabilitar interpolación de imágenes para arte de píxeles
        this.textures.get('player').setFilter(Phaser.Textures.FilterMode.NEAREST);

        // Verificar si las animaciones ya existen antes de crearlas
        if (!this.anims.exists('walk_up')) {
            this.anims.create({
                key: 'walk_up',
                frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('walk_right')) {
            this.anims.create({
                key: 'walk_right',
                frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('walk_down')) {
            this.anims.create({
                key: 'walk_down',
                frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('walk_left')) {
            this.anims.create({
                key: 'walk_left',
                frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
                frameRate: 10,
                repeat: -1
            });
        }

        // Configurar las teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,S,A,D');

        // Detectar la tecla "Escape"
        this.input.keyboard.on('keydown-ESC', this.pauseGame, this);

        // Crear botones de pausa pero ocultarlos inicialmente
        this.resumeButton = this.add.text(400, 150, 'Reanudar', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        this.menuButton = this.add.text(400, 250, 'Volver al menú', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        this.saveButton = this.add.text(400, 350, 'Guardar', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        // Añadir funcionalidad a los botones
        this.resumeButton.on('pointerdown', this.resumeGame, this);
        this.menuButton.on('pointerdown', this.returnToMenu, this);
        this.saveButton.on('pointerdown', this.saveGame, this);

        // Inicializar estado de pausa
        this.isPaused = false;

        // Si se ha solicitado cargar un juego, cargar el estado
        if (data.loadGame) {
            this.loadGame();
        }
    }

    update() {
        if (!this.isPaused) {
            const speed = 100;

            if (this.cursors.down.isDown || this.keys.S.isDown) {
                this.player.setVelocity(0, speed);
                this.player.play('walk_down', true);
            } else if (this.cursors.up.isDown || this.keys.W.isDown) {
                this.player.setVelocity(0, -speed);
                this.player.play('walk_up', true);
            } else if (this.cursors.left.isDown || this.keys.A.isDown) {
                this.player.setVelocity(-speed, 0);
                this.player.play('walk_left', true);
            } else if (this.cursors.right.isDown || this.keys.D.isDown) {
                this.player.setVelocity(speed, 0);
                this.player.play('walk_right', true);
            } else {
                this.player.setVelocity(0, 0);
                this.player.anims.stop();
            }
        }
    }

    pauseGame() {
        this.isPaused = true;
        this.physics.pause();
        this.resumeButton.setVisible(true);
        this.menuButton.setVisible(true);
        this.saveButton.setVisible(true);
    }

    resumeGame() {
        this.isPaused = false;
        this.physics.resume();
        this.resumeButton.setVisible(false);
        this.menuButton.setVisible(false);
        this.saveButton.setVisible(false);
    }

    returnToMenu() {
        this.scene.start('MenuScene');
    }

    saveGame() {
        const gameState = {
            player: {
                x: this.player.x,
                y: this.player.y
            }
            // Guardar otros estados del juego si es necesario
        };
        localStorage.setItem('unmaskedCrimeSave', JSON.stringify(gameState));
        alert('Juego guardado!');
    }

    loadGame() {
        const savedState = localStorage.getItem('unmaskedCrimeSave');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            this.player.setX(gameState.player.x);
            this.player.setY(gameState.player.y);
            // Cargar otros estados del juego si es necesario
        }
    }
}