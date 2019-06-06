### はじめに
このコンテンツは、[Unityの公式ページにある2Dシューティングのチュートリアル](https://unity3d.com/jp/learn/tutorials/projects/2d-shooting-game-jp)を参考にして、**phina.js**バージョンを作ってみるという内容です。それぞれのアプローチの違いなども、自分なりに理解したいと思ったのがきっかけです。

### 内容について
以下の方であれば、より理解しやすいかと思います。

* **javascript**に慣れ親しんでいある。
* オブジェクト指向プログラミングがある程度理解できている。
* [phina.js Tips
集](https://qiita.com/alkn203/items/bca3222f6b409382fe20)を一読している。

### 目次
1. [プログラミングの準備](introduction.html)



  init: function() {
    // 親クラス初期化
    this.superIni
    this.backgroundColor = 'black';
    // 以下にコードを書いていく
  },
  // 毎フレーム更新処理
  update: function() {
    // 以下にコードを書い
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
