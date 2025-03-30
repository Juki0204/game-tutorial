import Phaser from "phaser";
import Player from "../charactors/Player";

class TestScene extends Phaser.Scene {
  private player!: Player;

  constructor() {
    super({ key: 'TestScene' });
  }

  preload() {
    //素材データを読み込むベースURLを指定、ローカルディレクトリなら指定不要
    this.load.setBaseURL('https://labs.phaser.io');

    this.load.image('sky', 'assets/skies/sky3.png');
    this.load.image('ground', 'assets/sprites/platform.png');
    this.load.image('star', 'assets/demoscene/star.png');
    this.load.image('bomb', 'assets/sprites/bullet.png');

    this.load.spritesheet('dude', // キー
      'assets/sprites/dude.png', // 画像を指定
      { frameWidth: 32, frameHeight: 48 } // フレームの幅と高さを指定
    );
  }

  create() {
    this.add.image(400, 300, 'sky'); //コードを書いた順でレイヤーが重なっていく。つまり最初に書いたものが背景

    //足場フィールドの生成
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground').setScale(1, .5).refreshBody();
    platforms.create(50, 250, 'ground').setScale(1, .5).refreshBody();
    platforms.create(750, 220, 'ground').setScale(1, .5).refreshBody();

    //スコア表示
    let score = 0;
    const scoreText = this.add.text(16, 16, 'SCORE:0', { fontSize: '32px', color: '#000' });

    //プレイヤーの生成
    this.player = new Player(this, 100, 450);

    //フィールドとの衝突判定を追加
    this.physics.add.collider(this.player, platforms);

    //星の生成
    let stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    //星にバウンス値を追加（跳ねる動きの反復処理）
    stars.children.iterate(child => {
      const spriteChild = child as Phaser.Physics.Arcade.Sprite;
      spriteChild.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      return null;
    });

    //フィールドとの衝突判定を追加
    this.physics.add.collider(stars, platforms);

    //プレイヤーとの衝突判定を追加
    this.physics.add.overlap(this.player, stars, collectStar, undefined, this);

    //プレイヤーと星が衝突した時の処理
    function collectStar(player: any, star: any) {
      star.disableBody(true, true);

      score += 10;
      scoreText.setText('SCORE:' + score);

      if (stars.countActive(true) === 0) {
        stars.children.iterate(child => {
          const spriteChild = child as Phaser.Physics.Arcade.Sprite;
          spriteChild.enableBody(true, spriteChild.x, 0, true, true);
          return null;
        });
        createBomb();
      }
    }

    //敵の生成（爆弾）
    const bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(this.player, bombs, hitbomb, undefined, this);

    function createBomb() {
      const bomb = bombs.create(Phaser.Math.Between(400, 800), 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

    createBomb();

    let gameOver = false;

    //爆弾に衝突した時の処理
    function hitbomb(this: Phaser.Scene, player: any, bomb: any) {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play('turn');
      gameOver = true;

      this.add.text(400, 300, 'GAME OVER', { fontSize: '64px', color: '#D00', fontStyle: 'bold' }).setOrigin(0.5);
    }
  }

  update() {
    //プレイヤーの操作アニメーションの追加
    const cursors = this.input.keyboard?.createCursorKeys();

    if (cursors?.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    }
    else if (cursors?.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    }
    else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (cursors?.up.isDown && (this.player.body as Phaser.Physics.Arcade.Body).touching.down) {
      this.player.setVelocityY(-400);
    }
  }
}

export default TestScene;