class HipotesisScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HipotesisScene' });
        this.buttonClicked = false; // Add a flag to check if a button has been clicked
    }

    preload() {
        // Load necessary assets for the menu here
        this.load.image('popup1', 'assets/board.png');
        this.load.image('popup2', 'assets/board.png');
        this.load.image('popup3', 'assets/board.png');
    }

    create() {
        // Center X position
        const centerX = this.cameras.main.width / 2;

        // Y positions with proportional spacing
        const totalHeight = this.cameras.main.height;
        const popupHeight = 50; // Assuming each popup sprite is 50px in height after scaling
        const spacing = (totalHeight - (popupHeight * 3)) / 3.5; // Increase the spacing

        const y1 = spacing;
        const y2 = y1 + popupHeight + spacing; // Adjust second and third popup positions
        const y3 = y2 + popupHeight + spacing;

        // Create the popups with different scales for x and y
        const popup1 = this.add.sprite(centerX, y1, 'popup1').setScale(1.1, 0.5).setInteractive();
        const popup2 = this.add.sprite(centerX, y2, 'popup2').setScale(1.1, 0.5).setInteractive();
        const popup3 = this.add.sprite(centerX, y3, 'popup3').setScale(1.1, 0.5).setInteractive();

        // Apply nearest neighbor filtering
        this.textures.get('popup1').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('popup2').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('popup3').setFilter(Phaser.Textures.FilterMode.NEAREST);

        // Hypotheses text
        const hypotheses = [
            "The guard had access to all cells and could have committed the murder without being seen.",
            "A rival prisoner had personal motives to eliminate the victim.",
            "The victim might have committed suicide and the apparent murder is a cover-up."
        ];

        // Endings text
        const endings = [
            "The guard is found guilty. However, during the investigation, the guard was wrongly accused and executed. The real murderer remains at large.",
            "The rival prisoner confesses to the murder. As a result, a brutal fight breaks out in the prison, leading to further violence and chaos. The prison remains a dangerous place.",
            "The investigation confirms that the victim committed suicide. This revelation brings peace and closure to the prison community. Order is restored, and preventive measures are put in place to avoid such incidents in the future."
        ];

        // Define the style for the text
        const textStyle = {
            fontSize: '24px',
            fill: '#fff',
            align: 'left',
            wordWrap: { width: popup1.displayWidth * 0.9, useAdvancedWrap: true }
        };

        // Add text to each popup
        const text1 = this.add.text(centerX, y1, hypotheses[0], textStyle).setOrigin(0.5, 0.65);
        const text2 = this.add.text(centerX, y2, hypotheses[1], textStyle).setOrigin(0.5, 0.65);
        const text3 = this.add.text(centerX, y3, hypotheses[2], textStyle).setOrigin(0.5, 0.65);

        // Adjust text position and alignment within popups
        text1.setWordWrapWidth(popup1.displayWidth * 0.9, true);
        text2.setWordWrapWidth(popup2.displayWidth * 0.9, true);
        text3.setWordWrapWidth(popup3.displayWidth * 0.9, true);

        // Event listeners for popups
        popup1.on('pointerdown', () => this.handlePopupClick(0, popup1, popup2, popup3, endings));
        popup2.on('pointerdown', () => this.handlePopupClick(1, popup1, popup2, popup3, endings));
        popup3.on('pointerdown', () => this.handlePopupClick(2, popup1, popup2, popup3, endings));

        // Add hover effect
        popup1.on('pointerover', () => popup1.setTint(0x888888));
        popup1.on('pointerout', () => popup1.clearTint());

        popup2.on('pointerover', () => popup2.setTint(0x888888));
        popup2.on('pointerout', () => popup2.clearTint());

        popup3.on('pointerover', () => popup3.setTint(0x888888));
        popup3.on('pointerout', () => popup3.clearTint());
    }

    handlePopupClick(index, popup1, popup2, popup3, endings) {
        if (!this.buttonClicked) {
            this.buttonClicked = true;
            this.showEnding(endings[index]);
            popup1.disableInteractive();
            popup2.disableInteractive();
            popup3.disableInteractive();

            // Add "Return to Menu" button after showing the ending
            const menuButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 50, 'Return to Menu', {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5).setInteractive();

            menuButton.on('pointerdown', () => {
                this.scene.start('MenuScene');
            });

            menuButton.on('pointerover', () => menuButton.setTint(0x888888));
            menuButton.on('pointerout', () => menuButton.clearTint());
        }
    }

    showEnding(endingText) {
        // Clear previous content
        this.children.removeAll();

        // Display ending text
        const endingStyle = {
            fontSize: '30px',
            fill: '#fff',
            align: 'center',
            wordWrap: { width: this.cameras.main.width * 0.9, useAdvancedWrap: true }
        };
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, endingText, endingStyle).setOrigin(0.5);
    }
}

