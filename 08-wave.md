[f:id:alkn203:20190701235706g:plain]
[:contents]

【phina.js】2Dシューティングチュートリアル =敵の波状攻撃=

### はじめに
[前回](https://keeponcoding.hatenablog.com/entry/2019/06/23/165522)は、背景を追加しました。今回は、敵の波状攻撃を実装します。

### WaveとEmitter
**Unity**のチュートリアルにある**Wave**型と**Emitter**という仕組み自体は、**phina.js**にはありませんので、似せた処理を作ります。

### Wave機能の実現
**Unity**の**Wave**型を参考にして、以下の仕様にします。

1. 敵をフォーメーションで出現させる。
1. 敵が全て倒されるか、画面外に出たら1に戻る。

クラスにしても良いのですが、親子関係の複雑化を避けるために、今回は関数を作ります。

#### createWave関数

```javascript
// Wave作成
  createWave: function() {
    // 敵3機フォーメーション
    [[0, -2], [-2, -4], [2, -4]].each(function(arr) {
      var enemy = Enemy().addChildTo(this.waveGroup);
      enemy.setPosition(this.gridX.center(arr[0]), this.gridY.span(arr[1]));
    }, this);
  },
```

* これまで敵は**enemyGroup**に追加してきましたが、新たに**waveGroup**に追加します。
*  敵のフォーメーション情報を配列に入れて、ループでアクセスして敵を配置しています。

#### checkWave関数

```javascript
// Waveの状態チェック
  checkWave: function() {
    // 敵がいなくなったら出現させる
    if (this.waveGroup.children.length === 0) {
      this.createWave();
    }
  },
```

* **update**でこの関数を呼び出し、敵の状態をチェックします。
* 全ての敵が画面外に出るか、プレイヤーに倒されたら**createWave**を呼び出して敵を出現させます。

### 敵が画面外で弾を撃たないようにする
敵の波状攻撃は実装できましたが、このままだと画面外にいる時から弾を発射できてしまいますので、画面に現れてから弾の発射を開始するように調整します。

```javascript
// 一定間隔で弾を発射
    this.tweener.clear()
                .call(function() {
                  this.shot();
                }, this)
                .wait(shotDelay)
                .setLoop(true);
    // tweenerを一旦ポーズ　            
    this.tweener.pause();
```

* **pause**関数で、**tweener**の再生を一時停止します。

```javascript
// 毎フレーム更新処理
  update: function() {
    // 画面に現れてから弾を発射するようにする
    if (this.top > SCREEN_RECT.top && !this.tweener.playing) {
      this.tweener.play();
    }
```

* 画面に現れて、かつ**tweener**が再生中でなければ再生します。

### 実行サンプル

[https://runstant.com/alkn203/projects/96f63f64:title
