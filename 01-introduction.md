### プログラミングの準備
**phina.js**の公式オンラインエディタの位置付けであるRunstantを使います。


[http://runstant.com/:embed:cite]

![IMG_20190531_160033.jpg](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/67114/ec4f941b-b20a-63d3-0144-10803a9fa61a.jpeg)

### ひな形
私が普段使っている以下のひな形から作成していきます。

[https://qiita.com/alkn203/items/09274a38a0f31ee0c1d5:embed:cite]

```javascript
// グローバルに展開
phina.globalize();
/*
 * メインシーン
 */
phina.define("MainScene", {
  // 継承
  superClass: 'DisplayScene',
  // 初期化
  init: function() {
    // 親クラス初期化
    this.superInit();
    // 背景色
    this.backgroundColor = 'black';
    // 以下にコードを書いていく
  },
  // 毎フレーム更新処理
  update: function() {
    // 以下にコードを書いていく  
  },
});
/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    // MainScene から開始
    startLabel: 'main',
  });
  // fps表示
  //app.enableStats();
  // 実行
  app.run();
});
```
