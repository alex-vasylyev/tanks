
let PreloadState = {
    preload: function () {
        this.setLogo();
        this.setLoaderBar();
        this.load.image('eagle', 'assets/board/eagle.png');
        this.load.image('leaves', 'assets/board/leaves.png');
        this.load.image('small_wall_1', 'assets/board/small_wall_1.png');
        this.load.image('small_wall_2', 'assets/board/small_wall_2.png');
        this.load.image('small_wall_3', 'assets/board/small_wall_3.png');
        this.load.image('small_wall_4', 'assets/board/small_wall_4.png');
        this.load.image('wall', 'assets/board/wall.png');
        this.load.image('water', 'assets/board/water.png');
        this.load.image('bonus_immortal', 'assets/bonus/bonus_immortal.png');
        this.load.image('bonus_live', 'assets/bonus/bonus_live.png');
        this.load.image('bonus_slow', 'assets/bonus/bonus_slow.png');
        this.load.image('bonus_speed', 'assets/bonus/bonus_speed.png');
        this.load.image('scores', 'assets/scores.png');
        this.load.image('enemy_blue', 'assets/tanks/enemy_blue.png');
        this.load.image('enemy_red', 'assets/tanks/enemy_red.png');
        this.load.image('enemy_white', 'assets/tanks/enemy_white.png');
        this.load.image('tank', 'assets/tanks/tank.png');
        this.load.image('tank_left', 'assets/tanks/tank_left.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('enemy_bullet', 'assets/enemy_bullet.png');
        this.load.spritesheet('explode', 'assets/explode.png', 28, 30, 16);
        this.load.spritesheet('explode_small', 'assets/explode_small.png',18, 20, 16);
        this.load.spritesheet('appear', 'assets/appear.png');
        this.load.spritesheet('tank_sprites', 'assets/tank_sprites.png');
        this.load.audio('bonus', ['assets/sounds/bonus.ogg', 'assets/sounds/bonus.mp3']);
        this.load.audio('explode', ['assets/sounds/explode.ogg', 'assets/sounds/explode.mp3']);
        this.load.audio('hit', ['assets/sounds/hit.ogg', 'assets/sounds/hit.mp3']);
        this.load.audio('lose', ['assets/sounds/lose.ogg', 'assets/sounds/lose.mp3']);
        this.load.audio('shot', ['assets/sounds/shot.ogg', 'assets/sounds/shot.mp3']);
        this.load.audio('win', ['assets/sounds/win.ogg', 'assets/sounds/win.mp3']);
        this.load.text('level', 'assets/data/level.json');
    },
    create: function () {
        this.game.time.events.add(1500,this.changeState, this);
    },

    setLogo: function () {
        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY-100, 'logo');
        this.logo.anchor.setTo(0.5);
    },

    setLoaderBar: function () {
        this.loaderBg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY+100, 'loader-bg');
        this.loaderBg.anchor.setTo(0.5);
        this.loaderBar = this.game.add.sprite(this.game.world.centerX, this.loaderBg.y, 'loader-bar');
        this.loaderBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.loaderBar);
    },
    changeState: function () {
        this.state.start('HomeState');
    }
};