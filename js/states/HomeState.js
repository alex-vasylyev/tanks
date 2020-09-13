let HomeState = {
    create: function () {
        this.background = this.game.add.sprite(0, 0, 'home_bg');
        this.setLogo();
        this.setButton();

    },
    setLogo: function () {
        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY - 100, 'logo');
        this.logo.anchor.setTo(0.5);
    },
    playIntroSound: function () {
        this.intro = this.game.add.audio('intro');
        this.intro.play();
    },
    setButton: function () {
        this.button = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, 'button');
        this.button.anchor.setTo(0.5);
        this.button.inputEnabled = true;
        this.button.events.onInputDown.add(function () {
            this.playIntroSound();
            this.state.start('GameState');
        }, this);
    }
};