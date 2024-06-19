

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Cargar los recursos del juego aquí
        this.load.spritesheet('player', 'assets/artem.png', { frameWidth: 48, frameHeight: 64 });
        this.load.image('key', 'assets/key.png'); // Cargar la imagen de la llave
    }

    create(data) {
        // Inicializar los objetos del juego aquí
        this.player = this.physics.add.sprite(400, 300, 'player');
    
        // Crear la llave y añadirla al mundo
        if (!this.keyCollected){
            this.key = this.physics.add.sprite(500, 500, 'key');
            this.key.setScale(0.1);
        }

        if (!this.keyCollected){
            this.key = this.physics.add.sprite(400, 500, 'key');
            this.key.setScale(0.1);
        }

        if (!this.keyCollected){
            this.key = this.physics.add.sprite(300, 500, 'key');
            this.key.setScale(0.1);
        }

        if (!this.keyCollected){
            this.key = this.physics.add.sprite(200, 500, 'key');
            this.key.setScale(0.1);
        }

        if (!this.keyCollected){
            this.key = this.physics.add.sprite(100, 500, 'key');
            this.key.setScale(0.1);
        }
        
        // Habilitar colisiones entre el jugador y la llave
        this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);
    
        // Inicializar el inventario
        this.inventory = [];
        this.maxInventorySize = 5;
    
        // Crear visualización del inventario
        this.inventorySlots = [];
        for (let i = 0; i < this.maxInventorySize; i++) {
            let slot = this.add.rectangle(270 + i * 50, 540, 44, 44, 0x666666).setOrigin(0);
            this.inventorySlots.push(slot);
        }
    
        // Ajustar el escalado para arte de píxeles
        this.player.setScale(1);
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
            },
            inventory: this.inventory, // Guardar el estado del inventario
            keyCollected: this.keyCollected // Guardar si la llave ha sido recogida
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
            // Restaurar el estado del inventario
            this.inventory = gameState.inventory || [];
            this.updateInventory();
            // Restaurar el estado de la llave
            this.keyCollected = gameState.keyCollected || false;
            if (!this.keyCollected) {
                this.key = this.physics.add.sprite(500, 500, 'key');
                this.key.setScale(0.1);
                this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);
            }
        }
    }

    collectKey(player, key) {
        if (this.inventory.length < this.maxInventorySize) {
            this.inventory.push('key');
            key.destroy(); // Eliminar la llave del juego
            this.keyCollected = true; // Marcar la llave como recogida
            this.updateInventory();
        }
    }
    
    updateInventory() {
        // Limpiar visualización del inventario
        this.inventorySlots.forEach(slot => slot.setFillStyle(0x666666));
    
        // Actualizar visualización del inventario con los objetos recogidos
        this.inventory.forEach((item, index) => {
            if (item === 'key') {
                let keySprite = this.add.image(270 + index * 50 + 22, 540 + 22, 'key').setOrigin(0.5, 0.5);
                keySprite.setScale(44 / keySprite.width, 22 / keySprite.height); // Ajustar la escala para que encaje en el cuadrado de 44x44
            }
        });
    }
}