import Phaser from "phaser";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'dude');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBounce(0.2);
    this.setCollideWorldBounds(true);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(300);

    this.createAnimations(scene);
  }

  private createAnimations(scene: Phaser.Scene) {
    scene.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    scene.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  }
}

export default Player;