【phina.js】2Dシューティングチュートリアル =敵を作成する=

[f:id:alkn203:20190613002751g:plain]
[:contents]

### はじめに
[前回](https://keeponcoding.hatenablog.com/entry/2019/06/08/164735)は、プレイヤーから弾が発射できるようにしました。今回は、敵を作成します。

### 共通部分のクラス化
前回作ったプレイヤークラスと今回作成する敵クラスでは、共通化できる部分があります。その部分を**SpaceShip**クラスとして別クラスで作成し、使い回しが出来るようにします。

### SpaceShipクラス

```javascript
/*
 * スペースシップクラス
 */
phina.define("SpaceShip", {
  // 継承
  superClass: 'Sprite',
  // 初期化
  init: function(param) {
    // 親クラス初期化
    this.superInit('spaceship', 64, 64);
    // フレームアニメーションをアタッチ
    this.anim = FrameAnimation('spaceship').attachTo(this);
    // 移動スピード
    this.speed = param.speed;
  },
  // 機体の移動
  move: function(direction) {
    this.moveBy(direction.x * this.speed, direction.y * this.speed);
  },
});
```

* プレイヤークラスと敵クラスがこのクラスを継承できるようにします。
* スプライトとフレームアニメーションは、同じファイルを使っていますので共通化できます。
* 移動スピードは、外から指定出来るようにしています。
* 移動処理も関数に方向を代入することで処理ができるようにしています。

### プレイヤークラスから継承する
設計変更で、プレイヤークラスのコンストラクは以下のようになります。

```javascript
/*
 * プレイヤークラス
 */
phina.define("Player", {
  // 継承
  superClass: 'SpaceShip',
  // 初期化
  init: function() {
    // 親クラス初期化
    this.superInit({ speed: 5 });
    // フレームアニメーション指定
    this.anim.gotoAndPlay('player');
    // 弾の発射間隔
    var shotDelay = 1000;
    // 一定間隔で弾を発射
    this.tweener.clear()
                .call(function() {
                  this.shot();
                }, this)
                .wait(shotDelay)
                .setLoop(true); 
  },
```

### ここまでの実行サンプル
これまでどおりの動きになるか確認してみて下さい。

[http://runstant.com/alkn203/projects/98cae238:embed:cite]

### 敵を追加する
敵クラスは、**SpaceShip**クラスを継承して以下のように作成します。

```javascript
/*
 * 敵クラス
 */
phina.define("Enemy", {
  // 継承
  superClass: 'SpaceShip',
  // 初期化
  init: function() {
    // 親クラス初期化
    this.superInit({ speed: 0.5 });
    // フレームアニメーション指定
    this.anim.gotoAndPlay('enemy');
    //
    var shotDelay = 6000;
    //
    this.tweener.clear()
                .call(function() {
                  this.shot();
                }, this)
                .wait(shotDelay)
                .setLoop(true);
  },
  // 弾発射
  shot: function() {
    EnemyBullet(this.rotation).addChildTo(enemyBulletGroup).setPosition(this.x, this.y);
  },
  // 毎フレーム更新処理
  update: function() {
    // 機体の移動
    this.move(Vector2.DOWN);
  },
});
```

### 敵の移動
敵は一定速度で画面下に移動させます。

```javascript
// 毎フレーム更新処理
  update: function() {
    // 機体の移動
    this.move(Vector2.DOWN);
  },
});
```

* **Enemy**クラスに**move**関数は定義されていないので、この場合、親クラスである**SpaceShip**クラスの**move**が呼ばれます。
* 下方向に移動ですので、下向きの方向ベクトル定数である**Vector2.DOWN**を代入しています。

### 敵の弾の発射
弾の発射はプレイヤーとは少し異なる実装にします。今回は、下向き3方向に弾が発射されるようにします。敵の弾のクラスは以下のとおりです。

```javascript
/*
 * 敵の弾クラス
 */
phina.define("EnemyBullet", {
  // 継承
  superClass: 'DisplayElement',
  // 初期化
  init: function(rotation) {
    // 親クラス初期化
    this.superInit();
    // スピード
    var speed = 10;
    var self = this;
    // 弾
    [-20, 0, 20].each(function(degree) {
      // 弾作成
      var bullet = Sprite('bullet', 64, 64).addChildTo(self).setFrameIndex(1);
      // 発射方向を決める
      var deg = rotation + degree + 90;
      // 角度と大きさからベクトル作成
      var vec = Vector2().fromDegree(deg, speed);
      // ベクトルを代入
      bullet.physical.velocity = vec;
    });
  },
});
```

### 弾の生成
```javascript
    // 弾
    [-20, 0, 20].each(function(degree) {
      // 弾作成
      var bullet = Sprite('bullet', 64, 64).addChildTo(self).setFrameIndex(1);
```

* 弾は20度ずつ角度をずらして、3つ作成します。
* 敵の弾の画像は、スプライトの２番めですのでフレームインデックスを指定しています。

### 弾の方向
```javascript
      // 発射方向を決める
      var deg = rotation + degree + 90;
      // 角度と大きさからベクトル作成
      var vec = Vector2().fromDegree(deg, speed);
      // ベクトルを代入
      bullet.physical.velocity = vec;
```

*  **rotation**は自身の向いている角度で、**degree**に20度ずつずらした角度が入ってきます。最後に90を足しているのは、**html5 canvas**の仕様で、0度が時計の3時方向となっているので、その分を補正する必要があるからです。
* **fromDegree**は、引数で与えられた角度と大きさから方向ベクトルを返す関数です。
* 最後に方向ベクトルを自身のベクトルに代入して速度を設定しています。

### ここまでの実行サンプル
敵が下に移動して、一定間隔で３方向に弾を発射します。

[https://runstant.com/alkn203/projects/c91f1564/:embed:cite]

### 弾を撃たない敵を作る
敵のバリエーションを増やすために、弾を撃たない敵を作ります。
敵クラスのコンストラクにパラメータを渡し判断する形にします。

```javascript
/*
 * 敵クラス
 */
phina.define("Enemy", {
  // 継承
  superClass: 'SpaceShip',
  // 初期化
  init: function(param) {
    // 親クラス初期化
    this.superInit({ speed: 0.5 });
    // フレームアニメーション指定
    this.anim.gotoAndPlay('enemy');
    // 弾を発射できるか
    var canShot = (param && param.canShot !== undefined) ? param.canShot : true;
    if (!canShot) return;
```

* **canShot**というフラグが**false**であれば、関数を抜けてその後の処理が行われないようにしています。
* 敵はデフォルトでは弾を撃ち、フラグが明示的に指定された場合ば弾を撃たないようにします。

```javascript
    // 敵
    Enemy().addChildTo(this).setPosition(this.gridX.center(-3), this.gridY.center(-2));
    // 弾を発射できない敵
    Enemy({
      canShot: false,
    }).addChildTo(this).setPosition(this.gridX.center(3), this.gridY.center(-2));
```

### 実行サンプル
[https://runstant.com/alkn203/projects/68f172b3:embed:cite]
