import Phaser from "phaser";
import TestScene from "./scenes/TestScene";

let game;
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, //レンダリング形式（WEBGL, CANVAS, AUTO）
  width: 800, //レンダリングサイズ
  height: 600, //レンダリングサイズ
  parent: 'app', //任意の要素にレンダリングする場合の要素指定
  physics: { //物理演算
    default: 'arcade', //使用する物理エンジンの指定
    arcade: { //詳細設定
      gravity: { x: 0, y: 200 },
      debug: false
    },
  },
  input: {
    keyboard: true,
  },
  scene: [ //シーンの設定、1つの場合は[]でなくてよい
    TestScene,
  ]
}

game = new Phaser.Game(config);