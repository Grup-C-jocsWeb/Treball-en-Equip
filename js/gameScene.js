class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.spritesheet('player', 'assets/artem.png', { frameWidth: 48, frameHeight: 64 });
        this.load.image('key', 'assets/key.png');
        this.load.image('keyblue', 'assets/keyblue.png');
        this.load.image('cop', 'assets/cop2idle.png');
        this.load.image('prisoner', 'assets/playeridle.png');
        this.load.image('keygreen', 'assets/keygreen.png');
        this.load.image('keyred', 'assets/keyred.png');
        this.load.tilemapTiledJSON('map',"assets/map.json");
        this.load.image("Tileset", "assets/dungeonex.png")
    }

    create(data) {
        const map = this.make.tilemap({key: "map",tileWidth:32, tileHeight: 32});
        const tileset = map.addTilesetImage("Tileset");
        const layer = map.createLayer("Ground", tileset, 0, 0);
        this.player = this.physics.add.sprite(480, 300, 'player');
        const layer1 = map.createLayer("Chairs", tileset, 0, 0);
        const layer2 = map.createLayer("Props", tileset, 0, 0);
        const layer3 = map.createLayer("Walls", tileset, 0, 0);
        const layer4 = map.createLayer("Doors", tileset, 0, 0);
        this.cop = this.physics.add.sprite(200, 300, 'cop');
        this.prisoner = this.physics.add.sprite(600, 600, 'prisoner');

        this.player.body.setSize(24, 32); // Set the width and height to 24 and 32 pixels
        this.player.body.setOffset(12, 16); // Set the offset if needed (e.g., centering the smaller hitbox)
        this.cop.setScale(0.05);
        this.prisoner.setScale(0.05);

        this.physics.add.collider(this.player, layer1);
        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.player, layer3);
        layer1.setCollisionBetween(0, 100);
        layer2.setCollisionBetween(0, 100);
        layer3.setCollisionBetween(0, 100);

        this.keyCollected = false;
        this.keyblueCollected = false;
        this.keygreenCollected = false;
        this.keyredCollected = false;

        this.createKeys();

        this.physics.add.overlap(this.player, this.key, () => this.collectKey('key', this.key), null, this);
        this.physics.add.overlap(this.player, this.keyblue, () => this.collectKey('keyblue', this.keyblue), null, this);
        this.physics.add.overlap(this.player, this.keygreen, () => this.collectKey('keygreen', this.keygreen), null, this);
        this.physics.add.overlap(this.player, this.keyred, () => this.collectKey('keyred', this.keyred), null, this);

        this.inventory = [];
        this.maxInventorySize = 4;

        this.menuButton = this.add.text(480, 450, 'Ir al Menú', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);
        
        this.menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        this.inventorySlots = [];
        for (let i = 0; i < this.maxInventorySize; i++) {
            let slot = this.add.rectangle(382 + i * 50, 580, 44, 44, 0x666666).setOrigin(0);
            slot.setDepth(1);
            slot.setAlpha(0.5); // Set the alpha to lower the opacity
            this.inventorySlots.push(slot);
        }

        this.player.setScale(1);
        this.player.setOrigin(0.5, 0.5);
        this.player.setTexture('player');
        this.textures.get('player').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('cop').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('prisoner').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('key').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('keyblue').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('keygreen').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('keyred').setFilter(Phaser.Textures.FilterMode.NEAREST);

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

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,S,A,D');

        this.input.keyboard.on('keydown-ESC', this.pauseGame, this);

        this.resumeButton = this.add.text(480, 200, 'Reanudar', { fontSize: '32px', fill: '#fff' })
            .setDepth(1)
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        this.saveButton = this.add.text(480, 300, 'Guardar', { fontSize: '32px', fill: '#fff' })
            .setDepth(1)
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        this.menuButton = this.add.text(480, 400, 'Volver al menú', { fontSize: '32px', fill: '#fff' })
            .setDepth(1)
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        this.resumeButton.on('pointerdown', this.resumeGame, this);
        this.menuButton.on('pointerdown', this.returnToMenu, this);
        this.saveButton.on('pointerdown', this.saveGame, this);

        this.isPaused = false;

        if (data.loadGame) {
            this.loadGame();
        }
        // Create a black background
        this.blackBackground = this.add.graphics();
        this.blackBackground.fillStyle(0x000000, 1);
        this.blackBackground.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Create the mask
        this.lightCircle = this.make.graphics();
        this.lightCircle.fillStyle(0x000000, 1);
        this.lightCircle.fillCircle(0, 0, 100);

        this.mask = this.lightCircle.createGeometryMask();
        this.mask.invertAlpha = true;

        this.blackBackground.setMask(this.mask);
        
        // Add overlap for cop and prisoner
        this.physics.add.overlap(this.player, this.cop, this.showCopText, null, this);
        this.physics.add.overlap(this.player, this.prisoner, this.showPrisonerText, null, this);
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
            // Update mask position to follow the player
            this.lightCircle.setPosition(this.player.x, this.player.y);
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
            inventory: this.inventory,
            keyCollected: this.keyCollected,
            keyblueCollected: this.keyblueCollected,
            keygreenCollected: this.keygreenCollected,
            keyredCollected: this.keyredCollected
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
            this.inventory = gameState.inventory || [];
            this.updateInventory();
            this.keyCollected = gameState.keyCollected || false;
            this.keyblueCollected = gameState.keyblueCollected || false;
            this.keygreenCollected = gameState.keygreenCollected || false;
            this.keyredCollected = gameState.keyredCollected || false;

            // Si la llave está recolectada en el estado guardado, destrúyela del mapa
            if (this.keyCollected && this.key) {
                this.key.destroy();
            }
    
            if (this.keyblueCollected && this.keyblue) {
                this.keyblue.destroy();
            }
    
            if (this.keygreenCollected && this.keygreen) {
                this.keygreen.destroy();
            }
    
            if (this.keyredCollected && this.keyred) {
                this.keyred.destroy();
            }
        }
    }
    
    createKeys() {
        if (!this.keyCollected && (!this.inventory || !this.inventory.includes('key'))) {
            this.key = this.physics.add.sprite(680, 100, 'key');
            this.key.setScale(0.05);
            this.physics.add.overlap(this.player, this.key, () => this.collectKey('key', this.key), null, this);
        }
    
        if (!this.keyblueCollected && (!this.inventory || !this.inventory.includes('keyblue'))) {
            this.keyblue = this.physics.add.sprite(900, 550, 'keyblue');
            this.keyblue.setScale(0.05);
            this.physics.add.overlap(this.player, this.keyblue, () => this.collectKey('keyblue', this.keyblue), null, this);
        }
    
        if (!this.keygreenCollected && (!this.inventory || !this.inventory.includes('keygreen'))) {
            this.keygreen = this.physics.add.sprite(300, 100, 'keygreen');
            this.keygreen.setScale(0.05);
            this.physics.add.overlap(this.player, this.keygreen, () => this.collectKey('keygreen', this.keygreen), null, this);
        }
    
        if (!this.keyredCollected && (!this.inventory || !this.inventory.includes('keyred'))) {
            this.keyred = this.physics.add.sprite(130, 600, 'keyred');
            this.keyred.setScale(0.05);
            this.physics.add.overlap(this.player, this.keyred, () => this.collectKey('keyred', this.keyred), null, this);
        }
    }
    


    collectKey(keyName, keySprite) {
        if (!this.inventory.includes(keyName)) {
            if (this.inventory.length < this.maxInventorySize) {
                this.inventory.push(keyName);
                keySprite.destroy(); // Destruir la instancia de la llave en el mapa
                this.updateInventory();
                
                // Marcar la llave como recolectada según su nombre
                switch (keyName) {
                    case 'key':
                        this.keyCollected = true;
                        break;
                    case 'keyblue':
                        this.keyblueCollected = true;
                        break;
                    case 'keygreen':
                        this.keygreenCollected = true;
                        break;
                    case 'keyred':
                        this.keyredCollected = true;
                        break;
                }
                // Mostrar el botón del menú si se llena el inventario
                if (this.inventory.length === this.maxInventorySize) {
                    this.menuButton.setVisible(true);  // Mostrar el botón del menú
                    menuButton.setDepth(1);
                }
            } else {
                alert("¡Inventario lleno!");
            }
        }
    }

        

    updateInventory() {

        for (let i = 0; i < this.inventory.length; i++) {
            if (i < this.inventory.length) {
                const keyType = this.inventory[i];
                const textureKey = keyType === 'key' ? 'key' :
                   keyType === 'keyblue' ? 'keyblue' :
                   keyType === 'keygreen' ? 'keygreen' :
                   keyType === 'keyred' ? 'keyred' : null;
                const inventoryKey = this.add.image(405 + i * 50, 600, textureKey);
                inventoryKey.setScale(0.05);
                inventoryKey.setDepth(1);
                this.inventorySlots.push(inventoryKey);
            }
        }
    }
    showCopText() {
        const text = this.add.text(480, 100, 'I heard there is something in the cells at the top...', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.time.delayedCall(3000, () => text.destroy(), [], this);
    }

    showPrisonerText() {
        const text = this.add.text(480, 100, 'You should look the cell on the right...', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.time.delayedCall(3000, () => text.destroy(), [], this);
    }
}
