[f:id:alkn203:20190714004746g:plain]
[:contents] 

### はじめに
[前回](https://keeponcoding.hatenablog.com/entry/2019/07/09/001203)は、プレイヤーが画面外に出ないように移動に制限をかけました。今回は、タイトル画面を追加します。

### 独自のタイトル画面の作成

**Unity**のチュートリアルでは、タイトル文字を非表示にすることでタイトル画面とゲーム画面の区別を行っています。これも一つの手法ですが、今回は、**phina.js**で元々用意されているタイトル画面を上書きする方法にします。

### TitleSceneの上書き
- **MainScene**を流用して、**TitleScene**と同じ名前で新たにクラスを作ることで、元々のシーンが上書きされます。
- コード的にはダブりもありますが、シーン毎に切り離して管理できるのがメリットです。

```javascript
/*
 * タイトルシーン
 */
phina.define("TitleScene", {
  // 継承
  superClass: 'DisplayScene',
  // 初期化
  init: function() {
    // 親クラス初期化
    this.superInit();
    // グループ
    this.bgGroup = DisplayElement().addChildTo(this);
    this.bg2Group = DisplayElement().addChildTo(this);
    // グリッド
    var gx = this.gridX;
    var gy = this.gridY;
    // 背景
    this.createBackground();
    // タイトルラベル
    var title = Label({
      text: 'Shooting Game',
      fill: 'white',
      stroke: 'yellow',
      fontSize: 72,
    }).addChildTo(this).setPosition(gx.center(), gy.center(-2));
    // スタートキーラベル
    var startKey = Label({
      text: 'Press X',
      fill: 'white',
      stroke: 'yellow',
      fontSize: 64,
    }).addChildTo(this).setPosition(gx.center(), gy.center(1));
  },
  // 背景作成
  createBackground: function() {
    var bgGroup = this.bgGroup;
    var bg2Group = this.bg2Group;
    
    (2).times(function(i) {
      // 一番下の背景
      var bg = Sprite('bg').addChildTo(bgGroup);
      bg.setPosition(this.gridX.center(), this.gridY.center());
      // 上の背景
      var bg2 = Sprite('bg2').addChildTo(bg2Group);
      bg2.setPosition(this.gridX.center(), this.gridY.center());
      // スクロールスピード
      bg.physical.velocity.y = 2;
      bg2.physical.velocity.y = 4;
    }, this);
    // それぞれ2つの背景を縦に繋げる
    bgGroup.children.last.bottom = bgGroup.children.first.top;
    bg2Group.children.last.bottom = bg2Group.children.first.top;
  },
  // 毎フレーム処理
  update: function(app) {
    var key = app.keyboard;
    // xキーでゲームスタート
    if (key.getKeyDown('x')) {
      this.exit();
    }
    // 背景の移動管理
    this.scrollBackgrounds();
  },
  // 背景の移動管理
  scrollBackgrounds: function() {
    var bgGroup = this.bgGroup;
    var bg2Group = this.bg2Group;
    // 一番下の背景位置入れ替え
    if (bgGroup.children.last.y > this.gridY.center()) {
      bgGroup.children.first.addChildTo(bgGroup);
      bgGroup.children.last.bottom = bgGroup.children.first.top;
    }
    // 上の背景位置入れ替え
    if (bg2Group.children.last.y > this.gridY.center()) {
      bg2Group.children.first.addChildTo(bg2Group);
      bg2Group.children.last.bottom = bg2Group.children.first.top;
    }
  },
});
```

 - 背景処理のコードは、**MainScene**からそのまま流用します。
 - **Label**を使ってタイトルなどの文字を追加します。

### メイン画面への移行処理
**Unity**のチュートリアルと同じように、**x**キーが押されたらゲームが開始されるようにします。

```javascript
  // 毎フレーム処理
  update: function(app) {
    var key = app.keyboard;
    // xキーでゲームスタート
    if (key.getKeyDown('x')) {
      this.exit();
    }
    // 背景の移動管理
    this.scrollBackgrounds();
  },
```

 - キー入力情報は、**update**の引数**app**経由で得ることができます。
 - **getKeyDown**で**x**キーが押されているかを判定し、**exit**で現在のシーンを抜けてメインにシーンに移行します。

### プレイヤーがやられたらタイトルシーンに切り替える

プレイヤーが敵や敵の弾に当たったら、タイトル画面に戻るようにします。

```javascript
  // 毎フレーム処理
  update: function() {
    // 背景の移動管理
    this.scrollBackgrounds();
    // 敵管理
    this.checkWave();
    // 当たり判定
    this.hitTestBulletToPlayer();
    this.hitTestEnemyToPlayer();
    this.hitTestBulletToEnemy();
    // プレイヤーが削除されたらタイトル画面へ
    if (this.playerGroup.children.length === 0) {
      this.tweener.wait(1000)
      .call(function() {
        this.exit('title');
      }, this);
    }
  },
```

 - **update**で、プレイヤーが削除されているかで判定します。
 - **exit**でシーンを抜ける時、引数にシーンのラベル名を指定すると、そのシーンに遷移できます。
 - 敵の弾が当たると同時だと素っ気ないので、**tweener**の**wait**で少し待ってから遷移するようにしています。

### 実行サンプル

[https://runstant.com/alkn203/projects/181891d2:title]
