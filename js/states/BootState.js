
let BootState = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },
    preload: function () {
        this.load.image('logo', 'assets/logo.png');
        this.load.image('home_bg', 'assets/home-bg.png');
        this.load.image('loader-bg', 'assets/loader bar/loader-bg.png');
        this.load.image('loader-bar', 'assets/loader bar/loader-bar.png');
        this.load.audio('intro', ['assets/sounds/intro.ogg', 'assets/sounds/intro.mp3']);
        this.load.image('button', 'assets/button.png');

    },
    create: function () {
        this.game.stage.backgroundColor = '#1F3140';
        this.state.start('PreloadState');
    }
};