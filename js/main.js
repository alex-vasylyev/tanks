
let newGame = ()=> {
    let game = new Phaser.Game(1024, 768, Phaser.AUTO);
    game.state.add('BootState', BootState);
    game.state.add('PreloadState', PreloadState);
    game.state.add('HomeState', HomeState);
    game.state.add('GameState', GameState);
    game.state.start('BootState');
};

window.onload = newGame;
