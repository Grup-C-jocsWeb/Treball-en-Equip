class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Cargar los recursos del juego aquí
        this.load.spritesheet('player', 'JocWeb_equip\assets\artem.png', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        // Inicializar los objetos del juego aquí
        this.player = this.physics.add.sprite(400, 300, 'player');
    }

    update() {
        // Actualizar la lógica del juego aquí
    }
}