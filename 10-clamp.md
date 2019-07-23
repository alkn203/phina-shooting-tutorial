[f:id:alkn203:20190709000955g:plain]
[:contents]

### はじめに
[前回](https://keeponcoding.hatenablog.com/entry/2019/07/07/014433)は、ゲームサウンドを実装しました。現在のままだとプレイヤーが外に出てしまうので、今回は、プレイヤーが画面外に出ないように移動に制限をかけます。

### clamp関数の作成

プレイヤーの移動制限処理を**clamp**という別の関数に書いて、プレイヤークラスの**update**から呼び出します。

```javascript
// 毎フレーム更新処理
  update: function(app) {
    // 移動する向きを求める
    var direction = app.keyboard.getKeyDirection();
    // 機体の移動
    this.move(direction);
    // 移動制限
    this.clamp();
  },
  // プレイヤーの移動を画面内に制限する
  clamp: function() {
    var rect = SCREEN_RECT;
    // 画面の矩形に収まるようにする
    if (this.left < rect.left) this.left = rect.left;
    if (this.right > rect.right) this.right = rect.right;
    if (this.top < rect.top) this.top = rect.top;
    if (this.bottom > rect.bottom) this.bottom = rect.bottom;
  },
```

### 実行サンプル

[http://runstant.com/alkn203/projects/a19f7323:title]


