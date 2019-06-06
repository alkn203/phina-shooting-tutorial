### はじめに
[前回]()は、プレイヤーをキーボードで移動させるところまで出来ました。 今回は、プレイヤーが自動で弾を連射するようにします。

### 親子関係
* **Unity**では、オブジェクトの「親子関係」という言葉を使いますが、**phina.js**でも同じような関係を持たせることができます。
* 親子関係になると、親が移動・回転を行えば、追従して子も同じように移動・回転します。

### 子要素として追加する方法
例えば、**obj1**を**obj2**の子要素として追加したい場合、以下のように書きます。

```javascript
obj1.addChildTo(obj2);
```

### プレイヤーの弾を作成する
プレイヤーの弾を表示するだけなら、以下のようにスプライトとしてシーンに追加すればOKです。

```javascript
// プレイヤーの弾
Sprite('bullet', 64, 64).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
```

### 実行サンプル
<div class='runstant'><iframe src='https://runstant.com/alkn203/projects/98cae238/full' width='100%' height='640px' style='border:0px;box-shadow:0px 0px 2px 0px #aaa'></iframe></div>
[runstantで実行](http://runstant.com/alkn203/projects/98cae238)

### プレイヤーの弾を動かす
ゲームを実行したら勝手に上に飛んで行く弾を作成します。

### 親となるPlayerBulletの作成
**Unity**のチュートリアルでは空のゲームオブジェクトを作成していますが、**phina.js**では**DisplayElement**というクラスにその役割をさせることができます。

### PlayerBulletクラス
プレイヤーの弾として、**DisplayElement**を継承した以下のクラスを作成しました。

```javascript
 /*
 * プレイヤーの弾クラス
 */
phina.define("PlayerBullet", {
  // 継
  superClass: 'DisplayElement',
  // 初期化
  init: function() {
    // 親クラス初期化
    this.superInit();
    // スピード
    var speed = 10;
    var self = this;
    // 左右の弾
    [-10, 10].each(function(dx) {
      Sprite('bullet', 64, 64).addChildTo(self).setPosition(self.x + dx, self.y);
    });
    // 上向き速度を与える
    this.physical.velocity.y = -speed;
  },
});
```

### 弾の配置
以下が弾の作成部分です。

```javascript
   var self = this;
    // 左右の弾
    [-10, 10].each(function(dx) {
      Sprite('bullet', 64, 64).addChildTo(self).setPosition(self.x + dx, self.y);
    });
```

* **each**関数の引数**dx**に配列の各要素が入ってきますので、真ん中から左右に10ずれた位置に弾が作成されます。
* 関数の中でそのまま**this**を使うと、関数そのものを差し参照エラーになるので、**this**を**self**に代入して**PlayerBullet**の**this**として正しく参照できるようにしています。

### 弾を動かす
以下が弾を動かす処理です。

```javascript
    // 上向き速度を与える
    this.physical.velocity.y = -speed;
```

* 移動には、**Physical**クラスを使っています。一度速度を与えると、あとは内部で移動処理を行ってくれるので便利です。
* 弾をまとめて動かすためには、個別の**Sprite**ではなく、**this**で**PlayerBullet**に速度を設定する必要があります。

### 弾をシーンに追加する
シーンには、以下のように追加します。

```javascript
    // プレイヤーの弾作成
    PlayerBullet().addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
```

### ここまでの実行サンプル
弾が一回だけ上方向に発射されます。
<div class='runstant'><iframe src='https://runstant.com/alkn203/projects/53897c29/full' width='100%' height='640px' style='border:0px;box-shadow:0px 0px 2px 0px #aaa'></iframe></div>

[runstantで実行](http://runstant.com/alkn203/projects/53897c29)

### 弾を連続して発射させる
**Unity**のチュートリアルでは、コルーチンを使って実現していますが、**phina.js**では**Tweener**という機能がありますので、これを活用します。

プレイヤークラスを以下のように変更します。

```javascript
/*
 * プレイヤークラス
 */
phina.define("Player", {
  // 継承
  superClass: 'Sprite',
  // 初期化
  init: function() {
    // 親クラス初期化
    this.superInit('spaceship', 64, 64);
    // フレームアニメーションをアタッチ
    FrameAnimation('spaceship').attachTo(this).gotoAndPlay('player');
    // 移動スピード
    this.speed = 5;
    // 一定間隔で弾を発射
    this.tweener.clear()
                .call(function() {
                  this.shot();
                }, this)
                .wait(1000)
                .setLoop(true); 
  },
  // 弾を発射
  shot: function() {
    PlayerBullet().addChildTo(playerBulletGroup).setPosition(this.x, this.y);
  },
  // 毎フレーム更新処理
  update: function(app) {
    // 移動する向きを求める
    var direction = app.keyboard.getKeyDirection();
    // 移動する向きとスピードを代入する
    this.moveBy(direction.x * this.speed, direction.y * this.speed);
  },
```

### Tweenerの設定

```javascript
    //一定間隔で弾を発射
    this.tweener.clear()
                .call(function() {
                  this.shot();
                }, this)
                .wait(1000)
                .setLoop(true); 
```

* **tweener**で処理をチェインメソッドの形でつなげると、順番に実行することができます。
* **call**では任意の処理を記述できるので、**shot**という関数を呼び出しています。
* **wait**で指定時間(ミリ秒)待って、**setLoop**で再度**call**を呼び出すことを繰り返すことで、一定間隔で弾を発射する処理になります。






