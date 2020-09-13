let GameState = {
    init: function () {
        this.levelData = JSON.parse(this.game.cache.getText('level'));
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    },
    create: function () {
        this.createGameEnvironment();
        this.initSounds();
        this.createTank();
        this.createEnemies();
    },
    update: function () {
        this.setPhysics();
        this.setTankMovement(this.tank.speed);
        this.setEnemiesMovement();
        this.checkAliveEnemies();
    },
    createUnbreakableWall: function () {
        this.walls = this.add.group();
        this.walls.enableBody = true;
        this.createTopWall();
        this.createBottomWall();
        this.createLeftWall();
        this.createRightWall();
        this.walls.setAll('body.immovable', true);
        this.walls.setAll('body.allowGravity', false);
    },
    createTopWall: function () {
        //top wall
        let wall;
        let xPos = 36;
        for (let i = 0; i <= 26; i++) {
            wall = this.walls.create(xPos, 0, 'wall');
            xPos += 36;
        }
    },
    createBottomWall: function () {
        //bottom wall
        let wall;
        let xPos = 36;
        let yPos = 740;
        for (let i = 0; i <= 26; i++) {
            wall = this.walls.create(xPos, yPos, 'wall');
            xPos += 36;
        }
    },
    createLeftWall: function () {
        //left wall
        let wall;
        let yPos = 0;
        for (let i = 0; i <= 21; i++) {
            wall = this.walls.create(0, yPos, 'wall');
            yPos += 36;
        }
    },
    createRightWall: function () {
        //right wall
        let wall;
        let yPos = 0;
        let xPos = 990;
        for (let i = 0; i <= 21; i++) {
            wall = this.walls.create(xPos, yPos, 'wall');
            yPos += 36;
        }
    },
    createGameEnvironment: function () {
        this.createUnbreakableWall();
        //eagle
        this.eagle = this.game.add.sprite(515, 725, 'eagle');
        this.eagle.anchor.setTo(0.5);
        this.eagle.scale.setTo(0.75);
        this.game.physics.arcade.enable(this.eagle);
        this.eagle.body.allowGravity = false;
        this.eagle.body.immovable = true;

        //water
        this.waterGroup = this.add.group();
        this.waterGroup.enableBody = true;
        let water;
        this.levelData.waterData.forEach(function (element) {
            water = this.waterGroup.create(element.x, element.y, 'water');
        }, this);

        this.waterGroup.setAll('body.immovable', true);
        this.waterGroup.setAll('body.allowGravity', false);

        //leaves
        this.leavesGroup = this.add.group();
        this.leavesGroup.enableBody = true;
        let leaves;
        this.levelData.leavesData.forEach(function (element) {
            leaves = this.leavesGroup.create(element.x, element.y, 'leaves');
        }, this);

        this.leavesGroup.setAll('body.immovable', true);
        this.leavesGroup.setAll('body.allowGravity', false);

        //bricks
        this.bricksGroup = this.add.group();
        this.bricksGroup.enableBody = true;
        let brick;
        this.levelData.bricksData.forEach(function (element) {
            brick = this.bricksGroup.create(element.x, element.y, 'small_wall_1');
        }, this);
        this.bricksGroup.setAll('body.immovable', true);
        this.bricksGroup.setAll('body.allowGravity', false);

        //bonuses
        this.bonuses = this.add.group();
        this.bonuses.enableBody = true;
        let bonus;
        this.levelData.bonusesData.forEach(function (element) {
            bonus = this.bonuses.create(element.x, element.y, element.key);
            bonus.picked = false;
            bonus.scale.setTo(0.5);
        }, this);
    },
    createTank: function () {
        //tank
        this.tank = this.game.add.sprite(this.levelData.playerData.x, this.levelData.playerData.y, this.levelData.playerData.key);
        this.tank.health = this.levelData.playerData.hitPoints;
        this.tank.armor = this.levelData.playerData.armor;
        this.tank.speed = this.levelData.playerData.speed;
        this.tank.animations.add('explode');
        this.tank.immortality = false;
        this.tank.direction = 1;
        this.tank.bulletSpeed = this.levelData.playerData.bulletSpeed;
        this.tank.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.tank);
        this.initTankBullets();
    },
    setPhysics: function () {
        //tank
        this.game.physics.arcade.overlap(this.tank, this.bonuses, this.pickBonus, null, this);
        this.game.physics.arcade.overlap(this.tank, this.leavesGroup);
        this.game.physics.arcade.collide(this.tank, this.enemyGroup);
        this.game.physics.arcade.collide(this.tank, this.walls);
        this.game.physics.arcade.collide(this.tank, this.waterGroup);
        this.game.physics.arcade.collide(this.tank, this.bricksGroup);

        //Eagle
        this.game.physics.arcade.overlap(this.tank, this.eagle);
        this.game.physics.arcade.overlap(this.tankBullets, this.eagle, this.damageEagle, null, this);
        this.game.physics.arcade.overlap(this.enemyWhiteBullets, this.eagle, this.damageEagle, null, this);
        this.game.physics.arcade.overlap(this.enemyRedBullets, this.eagle, this.damageEagle, null, this);
        this.game.physics.arcade.overlap(this.enemyBlueBullets, this.eagle, this.damageEagle, null, this);

        //Unbreakable walls
        this.game.physics.arcade.overlap(this.tankBullets, this.walls, this.hitWall, null, this);
        this.game.physics.arcade.overlap(this.enemyWhiteBullets, this.walls, this.hitWall, null, this);
        this.game.physics.arcade.overlap(this.enemyRedBullets, this.walls, this.hitWall, null, this);
        this.game.physics.arcade.overlap(this.enemyBlueBullets, this.walls, this.hitWall, null, this);

        //Brick walls
        this.game.physics.arcade.overlap(this.tankBullets, this.bricksGroup, this.damageBrick, null, this);
        this.game.physics.arcade.overlap(this.enemyWhiteBullets, this.bricksGroup, this.damageBrick, null, this);
        this.game.physics.arcade.overlap(this.enemyRedBullets, this.bricksGroup, this.damageBrick, null, this);
        this.game.physics.arcade.overlap(this.enemyBlueBullets, this.bricksGroup, this.damageBrick, null, this);

        //for enemy
        //TODO
        this.game.physics.arcade.overlap(this.enemyWhiteBullets, this.tank, this.killPlayer, null, this);
        this.game.physics.arcade.overlap(this.enemyRedBullets, this.tank, this.killPlayer, null, this);
        this.game.physics.arcade.overlap(this.enemyBlueBullets, this.tank, this.killPlayer, null, this);
        this.game.physics.arcade.collide(this.enemyGroup, this.tank);
        this.game.physics.arcade.collide(this.enemyGroup, this.walls);
        this.game.physics.arcade.collide(this.enemyGroup, this.waterGroup);
        this.game.physics.arcade.collide(this.enemyGroup, this.bricksGroup);
        //for tankBullets
        // this.game.physics.arcade.collide(this.tankBullets, this.walls);
        // this.game.physics.arcade.collide(this.tankBullets, this.eagle);
        // this.game.physics.arcade.collide(this.tankBullets, this.bricksGroup);
        this.game.physics.arcade.overlap(this.tankBullets, this.enemyGroup, this.damageEnemy, null, this);
    },
    setTankMovement: function (movingSpeed) {
        //keys
        this.tank.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            this.tank.body.velocity.x = -movingSpeed;
            this.tank.angle = -90;
            this.tank.direction = 0;
        } else if (this.cursors.right.isDown) {
            this.tank.body.velocity.x = movingSpeed;
            this.tank.angle = 90;
            this.tank.direction = 2;
        } else if (this.cursors.up.isDown) {
            this.tank.angle = 360;
            this.tank.direction = 1;
            this.tank.body.velocity.y = -movingSpeed;
        } else if (this.cursors.down.isDown) {
            this.tank.angle = -180;
            this.tank.body.velocity.y = movingSpeed;
            this.tank.direction = 3;
        } else if (this.cursors.down.isUp) {
            this.tank.body.velocity.y = 0;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.fireTankBullet();
        }
    },
    initTankBullets: function () {
        this.tankBullets = this.add.group();
        this.tankBullets.enableBody = true;
        let tankBullet;
        tankBullet = this.tankBullets.create(this.tank.x, this.tank.y, 'bullet');
        tankBullet.name = 'bullet';
        tankBullet.exists = false;
        tankBullet.visible = false;
        tankBullet.checkWorldBounds = true;
        tankBullet.events.onOutOfBounds.add(this.resetBullet, this);
        this.game.physics.arcade.enable(tankBullet);
    },
    fireTankBullet: function () {
        this.bullet = this.tankBullets.getFirstExists(false);

        if (this.bullet) {
            if (this.tank.direction == 0) {
                this.bullet.reset(this.tank.x - 20, this.tank.y - 4);
                this.bullet.body.velocity.x = -300;
                this.playShotSound();
            } else if (this.tank.direction == 1) {
                this.bullet.reset(this.tank.x - 4, this.tank.y - 22);
                this.bullet.body.velocity.y = -300;
                this.playShotSound();
            } else if (this.tank.direction == 2) {
                this.bullet.reset(this.tank.x + 12, this.tank.y - 5);
                this.bullet.body.velocity.x = 300;
                this.playShotSound();
            } else {
                this.bullet.reset(this.tank.x - 4, this.tank.y + 15);
                this.bullet.body.velocity.y = 300;
                this.playShotSound();
            }
        }
    },

    //Create enemies
    createEnemies: function () {
        this.enemyGroup = this.add.group();
        this.enemyGroup.enableBody = true;
        let enemy;
        this.levelData.enemyData.forEach(function (element) {
            enemy = this.enemyGroup.create(element.x, element.y, element.key);
            enemy.animations.add('explode');
            enemy.health = element.hitPoints;
            enemy.speed = element.speed;
            enemy.isAlive = true;
            enemy.direction = 1;
            enemy.anchor.setTo(0.5);
            this.game.physics.arcade.enable(enemy);
        }, this);

        this.enemyGroup.setAll('body.immovable', true);
        this.enemyGroup.setAll('body.allowGravity', false);

        this.enemyGroup.forEach(function (enemy) {
            this.initEnemyBullets(enemy);
        }, this);
    },
    setEnemiesMovement: function () {
        this.setWhiteEnemyMovements();
        this.setRedEnemyMovements();
        this.setBlueEnemyMovements();
    },
    setWhiteEnemyMovements: function () {
        let whiteEnemy = this.enemyGroup.getChildAt(this.enemyGroup.length - 1);
        if (whiteEnemy.direction == 1) {
            whiteEnemy.angle = 90;
            whiteEnemy.body.velocity.y = -whiteEnemy.speed;
            if (whiteEnemy.position.y <= (this.game.world.height - (0.85 * this.game.world.height))) {
                whiteEnemy.body.velocity.y = 0;
                whiteEnemy.direction = 2;
            }
        } else if (whiteEnemy.direction == 0) {
            whiteEnemy.angle = -90;
            whiteEnemy.body.velocity.x = -whiteEnemy.speed;
            if (whiteEnemy.position.x <= (this.game.world.width - (0.85 * this.game.world.width))) {
                whiteEnemy.body.velocity.x = 0;
                whiteEnemy.direction = 2;
            }
        } else if (whiteEnemy.direction == 2) {
            whiteEnemy.angle = 90;
            whiteEnemy.body.velocity.x = whiteEnemy.speed;
            if (whiteEnemy.position.x == 230 ||
                whiteEnemy.position.x == 355 ||
                whiteEnemy.position.x == 500 ||
                whiteEnemy.position.x == 620 ||
                whiteEnemy.position.x == 850) {
                whiteEnemy.direction = 3;
            }
            if (whiteEnemy.position.x >= (0.85 * this.game.world.width)) {
                whiteEnemy.body.velocity.y = 0;
                whiteEnemy.direction = 0;
            }
            ;
        } else if (whiteEnemy.direction == 3) {
            whiteEnemy.body.velocity.x = 0;
            whiteEnemy.angle = -180;
            setTimeout(() => {
                whiteEnemy.direction = 2;
            }, 2000);
        }
        this.fireEnemyBullet(whiteEnemy);
    },
    setRedEnemyMovements: function () {
        let redEnemy = this.enemyGroup.getChildAt(this.enemyGroup.length - 2);
        if (redEnemy.direction == 1) {
            redEnemy.angle = 360;
            redEnemy.body.velocity.y = -redEnemy.speed;
            if (redEnemy.position.y <= (this.game.world.height - (0.60 * this.game.world.height))) {
                redEnemy.body.velocity.y = 0;
                redEnemy.direction = 0;
            }
        } else if (redEnemy.direction == 0) {
            redEnemy.angle = -90;
            redEnemy.body.velocity.x = -redEnemy.speed;
            if (redEnemy.position.x <= (this.game.world.width - (0.85 * this.game.world.width))) {
                redEnemy.body.velocity.x = 0;
                redEnemy.direction = 2;
            }
        } else if (redEnemy.direction == 2) {
            redEnemy.body.velocity.y = 0;
            redEnemy.angle = 90;
            setTimeout(() => {
                redEnemy.direction = 3;
            }, 2000);
        } else if (redEnemy.direction == 3) {
            redEnemy.angle = -180;
            redEnemy.body.velocity.y = redEnemy.speed;

            if (redEnemy.position.y == 360 ||
                redEnemy.position.y == 400 ||
                redEnemy.position.y == 500 ||
                redEnemy.position.y == 600) {
                redEnemy.direction = 2;
            }
            if (redEnemy.position.y >= (0.90 * this.game.world.height)) {
                redEnemy.body.velocity.y = 0;
                redEnemy.direction = 1;
            }
            ;
        }
        this.fireEnemyBullet(redEnemy);
    },
    setBlueEnemyMovements: function () {
        let blueEnemy = this.enemyGroup.getChildAt(0);
        if (blueEnemy.direction == 1) {
            blueEnemy.angle = 360;
            blueEnemy.body.velocity.y = -blueEnemy.speed;
            if (blueEnemy.position.y == 450 ||
                blueEnemy.position.y == 500 ||
                blueEnemy.position.y == 600) {
                blueEnemy.direction = 0;
            }

            if (blueEnemy.position.y <= (this.game.world.height - (0.60 * this.game.world.height))) {
                blueEnemy.body.velocity.y = 0;
                blueEnemy.direction = 3;
            }
        } else if (blueEnemy.direction == 0) {
            blueEnemy.angle = -90;
            blueEnemy.body.velocity.y = 0;
            setTimeout(() => {
                blueEnemy.direction = 1;
            }, 2000);
        } else if (blueEnemy.direction == 2) {
            blueEnemy.angle = 90;
            blueEnemy.body.velocity.x = blueEnemy.speed;
            if (blueEnemy.position.x >= (0.85 * this.game.world.width)) {
                blueEnemy.body.velocity.y = 0;
                blueEnemy.direction = 3;
            }
            ;
        } else if (blueEnemy.direction == 3) {
            blueEnemy.angle = -180;
            blueEnemy.body.velocity.y = blueEnemy.speed;

            if (blueEnemy.position.y >= (0.95 * this.game.world.height)) {
                blueEnemy.body.velocity.y = 0;
                blueEnemy.direction = 1;
            }
            ;
        }
        this.fireEnemyBullet(blueEnemy);
    },
    initEnemyBullets: function (enemy) {
        let enemyBullet;
        if (enemy.key == 'enemy_white') {
            this.enemyWhiteBullets = this.add.group();
            this.enemyWhiteBullets.enableBody = true;
            enemyBullet = this.enemyWhiteBullets.create(enemy.x, enemy.y, 'enemy_bullet');
            enemyBullet.name = 'enemy_white_bullet';
        } else if (enemy.key == 'enemy_red') {
            this.enemyRedBullets = this.add.group();
            this.enemyRedBullets.enableBody = true;
            enemyBullet = this.enemyRedBullets.create(enemy.x, enemy.y, 'enemy_bullet');
            enemyBullet.name = 'enemy_red_bullet';
        } else {
            this.enemyBlueBullets = this.add.group();
            this.enemyBlueBullets.enableBody = true;
            enemyBullet = this.enemyBlueBullets.create(enemy.x, enemy.y, 'enemy_bullet');
            enemyBullet.name = 'enemy_blue_bullet';
        }
        enemyBullet.exists = false;
        enemyBullet.visible = false;
        enemyBullet.checkWorldBounds = true;
        enemyBullet.events.onOutOfBounds.add(this.resetBullet, this);
        this.game.physics.arcade.enable(enemyBullet);
    },
    fireEnemyBullet: function (enemy) {
        if (enemy.key == 'enemy_white') {
            this.enemy_bullet = this.enemyWhiteBullets.getFirstExists(false);
        } else if (enemy.key == 'enemy_red') {
            this.enemy_bullet = this.enemyRedBullets.getFirstExists(false);
        } else {
            this.enemy_bullet = this.enemyBlueBullets.getFirstExists(false);
        }
        if (enemy.health > 0) {
            if (this.enemy_bullet) {
                if (enemy.direction == 0) {
                    this.enemy_bullet.reset(enemy.x - 20, enemy.y - 4);
                    this.enemy_bullet.body.velocity.x = -500;
                    this.playShotSound();
                } else if (enemy.direction == 1) {
                    this.enemy_bullet.reset(enemy.x - 4, enemy.y - 22);
                    this.enemy_bullet.body.velocity.y = -500;
                    this.playShotSound();
                } else if (enemy.direction == 2) {
                    this.enemy_bullet.reset(enemy.x + 12, enemy.y - 5);
                    this.enemy_bullet.body.velocity.x = 500;
                    this.playShotSound();
                } else {
                    this.enemy_bullet.reset(enemy.x - 4, enemy.y + 15);
                    this.enemy_bullet.body.velocity.y = 500;
                    this.playShotSound();
                }
            }
        }
    },
    resetBullet: function (bullet) {
        bullet.kill();
    },
    slowEnemies: function () {
        this.enemyGroup.forEach(function (enemy) {
            enemy.speed = 40;
        }, this);
    },

    //SOUNDS
    initSounds: function () {
        this.shot = this.game.add.audio('shot');
        this.lose = this.game.add.audio('lose');
        this.win = this.game.add.audio('win');
        this.hit = this.game.add.audio('hit');
        this.explode = this.game.add.audio('explode');
        this.bonus = this.game.add.audio('bonus');
    },
    playShotSound: function () {
        this.shot.play();
    },
    playLoseSound: function () {
        this.lose.play();
    },
    playWinSound: function () {
        this.win.play();
    },
    playHitSound: function () {
        this.hit.play();
    },
    playExplodeSound: function () {
        this.explode.play();
    },
    playBonusSound: function () {
        this.bonus.play();
    },

    //Pick bonuses
    pickBonus: function (player, bonus) {
        switch (bonus.key) {
            case "bonus_immortal":
                this.playBonusSound();
                bonus.picked = true;
                bonus.visible = false;
                player.immortality = true;
                break;
            case "bonus_live":
                this.playBonusSound();
                bonus.picked = true;
                bonus.visible = false;
                player.health = 300;
                break;
            case "bonus_slow":
                this.playBonusSound();
                this.slowEnemies();
                bonus.picked = true;
                bonus.visible = false;
                break;
            case "bonus_speed":
                this.playBonusSound();
                bonus.picked = true;
                bonus.visible = false;
                player.speed = 75;
                break;
        }
    },

    //Damage
    damageEnemy: function (bullet, enemy) {
        enemy.damage(100);
        this.playHitSound();
        bullet.kill();
        if (enemy.health <= 0) {
            enemy.animations.play('explode');
            this.playExplodeSound();
            enemy.isAlive = false;
        }
    },
    killPlayer: function (player, bullet) {
        if (player.immortality) {
            player.immortality = false;
        } else {
            player.damage(100);
        }
        this.playHitSound();
        bullet.kill();
        if (player.health <= 0) {
            player.loadTexture('explode', 0, true);
            player.animations.play('explode');
            this.playExplodeSound();
            player.kill();
            this.playExplodeSound();
            this.gameOver(false);
        }
    },
    damageEagle: function (bullet, eagle) {
        eagle.damage(100);
        this.playHitSound();
        bullet.kill();
        if (eagle.health <= 0) {
            eagle.play('explode');
            eagle.kill();
            eagle.visible = false;
            this.playExplodeSound();
            this.gameOver(false);
        }
    },
    damageBrick: function (bullet, brick) {
        brick.damage(100);
        this.playHitSound();
        bullet.kill();
        if (brick.health <= 0) {
            brick.play('explode');
            brick.kill();
            brick.visible = false;
            this.playExplodeSound();
        }
    },
    hitWall: function (bullet, wall) {
        this.playHitSound();
        bullet.kill();
        bullet.visible = false;
    },

    checkAliveEnemies: function () {
        let counter = 0;
        this.enemyGroup.forEach(function (element) {
            if (!element.isAlive) {
                counter += 1;
            }
            if (counter == 3) {
                this.gameOver(true);
            }
        }, this);
    },
    gameOver: function (result) {
        let style = {font: '75px Arial', fill: '#fff'};
        if (result) {
            this.playWinSound();
            this.game.add.text(this.game.world.centerX / 2, this.game.world.centerY / 2, 'YOU WON', style);
        } else {
            this.playLoseSound();
            this.game.add.text(this.game.world.centerX / 2, this.game.world.centerY / 2, 'GAME OVER', style);
        }
        setTimeout(() => {
            this.state.start('HomeState', true, false);
        }, 3000);
    },
};



