[f:id:alkn203:20190531212055j:plain]
[:contents]

### はじめに
今回のエントリーは、**Unityの公式ページにある2Dシューティングのチュートリアル**を参考にして、**phina.js**バージョンを作ってみるという勝手な企画です。
それぞれのアプローチの違いなども、自分なりに理解したいと思ったのがきっかけです。

[https://unity3d.com/jp/learn/tutorials/projects/2d-shooting-game-jp:embed:cite]

### 内容について
以下の方であれば、より理解しやすいかと思います。

* **javascript**に慣れ親しんでいある。
* オブジェクト指向プログラミングがある程度理解できている。
* **phina.js**の基礎を知っている（**phina.js Tips集**が参考になれば幸いです）

[https://qiita.com/alkn203/items/bca3222f6b409382fe20:embed:cite]

### プログラミングの準備
一番手っ取り早いのは、**phina.js**の公式オンラインエディタとして位置付けられている
**Runstant**を使う方法です。実行結果も即座に確認できるので便利です。

[http://runstant.com/:embed:cite]
[f:id:alkn203:20190531160550j:plain]

#### phina.jsを利用できるようにする
* **runstant**の**html**タブのソースで、以下のように読み込みます。
* 自分の好きなエディタを使いたい方は、参照先の**phina.js**をダウンロードしてローカルで読み込みます。

```html
<!doctype html>
 
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    
    <title>${title}</title>
    <meta name="description" content="${description}" />
    
    <style>${style}</style>
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/gh/phi-jp/phina.js@v0.2.3/build/phina.js"></script>
    <script>${script}</script>
  </body>
</html>
```

#### コーディングする
* **javascript**のコードは、**runstant**の**script**タブに書いていきます。
* 今回は、私がいつも使っている**ひな形**から作成していきます。

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
