// グローバルに展開
phina.globalize();
// アセット
var ASSETS = {
  // 画像
  image: {
    'spaceship': 'https://cdn.jsdelivr.net/gh/alkn203/phina-shooting-tutorial@master/work/assets/ships.png',
    'bullet': 'https://cdn.jsdelivr.net/gh/alkn203/phina-shooting-tutorial@master/work/assets/shot.png',
    'explosion': 'https://cdn.jsdelivr.net/gh/alkn203/phina-shooting-tutorial@master/work/assets/explosion.png',
    'bg': 'https://cdn.jsdelivr.net/gh/alkn203/phina-shooting-tutorial@master/work/assets/bg.png',
    'bg2': 'https://cdn.jsdelivr.net/gh/alkn203/phina-shooting-tutorial@master/work/assets/bg2.png',
  },
  // スプライトシート
  spritesheet: {
    'spaceship': 'https://cdn.jsdelivr.net/gh/alkn203/phina-shooting-tutorial@master/work/assets/ships.ss',
    'explosion': 'https://cdn.jsdelivr.net/gh/alkn203/phina-shooting-tutorial@master/work/assets/explosion.ss',
  },
  // サウンド
  sound: {
    'bgm': 'https://cdn.jsdelivr.net/gh/alkn203/phina-shooting-tutorial@master/work/assets/game_maoudamashii_4_vehicle03.mp3',
    'shot': 'https://cdn.jsdelivr.net/gh/alkn203/phina-shooting-tutorial@master/work/assets/se_maoudamashii_battle_gun05.mp3',
    'explosion': 'https://cdn.jsdelivr.net/gh/alkn203/phina-shooting-tutorial@master/work/assets/se_maoudamashii_explosion06.mp3',
  },
};
// 定数
var SCREEN_RECT = Rect(0, 0, 640, 960); // 画面の矩形
// グローバル変数
var playerBulletGroup = null;
var enemyBulletGroup = null;
// 画像マスク用の関数を定義
function maskImage(imageKey, color, distKey) {
  var original = AssetManager.get('image', imageKey).domElement;
  
  // 画像生成用にダミーのシーン生成
  var dummy = DisplayScene({
    // 元画像と同じサイズにする
    width: original.width,
    height: original.height,
    // 背景色を変更したい色にする
    backgroundColor: color,
  });
  
  var originalSprite = Sprite(imageKey).addChildTo(dummy);
  
  // 描画の位置を変更
  originalSprite.setOrigin(0, 0);
  // 描画方法をマスクするように変更
  originalSprite.blendMode = 'destination-in';
  
  // シーンの内容を描画
  dummy._render();
  
  // シーンの描画内容から テクスチャを作成
  var texture = Texture();
  texture.domElement = dummy.canvas.domElement;
  if (distKey) {
    AssetManager.set('image', distKey, texture);
  }
  return texture;
}
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
    // シップの画像に赤い半透明マスク処理をした新たな画像をアセットに追加
    maskImage('spaceship', 'rgba(255, 0, 0, 0.3)', 'redship');
    // BGM停止
    SoundManager.stopMusic('bgm');
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
    // グループ
    this.bgGroup = DisplayElement().addChildTo(this);
    this.bg2Group = DisplayElement().addChildTo(this);
    playerBulletGroup = DisplayElement().addChildTo(this);
    enemyBulletGroup = DisplayElement().addChildTo(this);
    this.waveGroup = DisplayElement().addChildTo(this);
    this.playerGroup = DisplayElement().addChildTo(this);
    // グリッド
    var gx = this.gridX;
    var gy = this.gridY;
    // 背景
    this.createBackground();
    // プレイヤー
    Player().addChildTo(this.playerGroup).setPosition(gx.center(1), gy.center(3));
    // 敵
    this.createWave();
    // BGM再生
    SoundManager.playMusic('bgm');
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
  // Wave作成
  createWave: function() {
    // 敵3機フォーメーション
    [[0, -2], [-2, -4], [2, -4]].each(function(arr) {
      var enemy = Enemy({hp: 10}).addChildTo(this.waveGroup);
      enemy.setPosition(this.gridX.center(arr[0]), this.gridY.span(arr[1]));
    }, this);
  },
  // Waveの状態チェック
  checkWave: function() {
    // 敵がいなくなったら出現させる
    if (this.waveGroup.children.length === 0) {
      this.createWave();
    }
  },
  // 敵の弾とプレイヤーの当たり判定
  hitTestBulletToPlayer: function() {
    var self = this;
    
    if (this.playerGroup.children.length > 0) {
      var tween = this.playerGroup.children.first.blinkTween;
      // プレイヤーが無敵状態なら判定しない
      if (tween && tween.playing) return;
    }
    
    enemyBulletGroup.children.each(function(bullet) {
      self.playerGroup.children.each(function(player) {
      // 当たり判定用の矩形
      var r1 = bullet.collider.getAbsoluteRect();
      var r2 = player.collider.getAbsoluteRect();
      // ヒットなら
      if (Collision.testRectRect(r1, r2)) {
        // 弾削除
        bullet.remove();
        // 爆発表示
        Explosion().addChildTo(self).setPosition(player.x, player.y);
        // プレイヤー削除
        player.remove();
      }
      });
    });
  },
  // 敵とプレイヤーの当たり判定
  hitTestEnemyToPlayer: function() {
    var self = this;

    this.waveGroup.children.each(function(enemy) {
      self.playerGroup.children.each(function(player) {
        // 当たり判定用の矩形
        var r1 = enemy.collider.getAbsoluteRect();
        var r2 = player.collider.getAbsoluteRect();
        // ヒットなら
        if (Collision.testRectRect(r1, r2)) {
          // 爆発表示
          Explosion().addChildTo(self).setPosition(player.x, player.y);
          // プレイヤー削除
          player.remove();
        }
      });
    });
  },
  // プレイヤーの弾と敵の当たり判定
  hitTestBulletToEnemy: function() {
    var self = this;

    playerBulletGroup.children.each(function(bullet) {
      self.waveGroup.children.each(function(enemy) {
        // 当たり判定用の矩形
        var r1 = bullet.collider.getAbsoluteRect();
        var r2 = enemy.collider.getAbsoluteRect();
        // ヒットなら
        if (Collision.testRectRect(r1, r2)) {
          // 敵のHPを減らす
          enemy.hp -= bullet.power;
          // 赤色表示
          var damage = DamagedEnemy().addChildTo(enemy);
          damage.tweener.clear()
                        .wait(100)
                        .call(function() {
                          damage.remove();
                        });         
          // 弾削除
          bullet.remove();
          // HPチェック
          if (enemy.hp <= 0) {
            // 爆発表示
            Explosion().addChildTo(self).setPosition(enemy.x, enemy.y);
            // 敵削除
            enemy.remove();
          }
        }
      });
    });
  },
});
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
    // 当たり判定用矩形
    this.collider = Collider({
      width: 20,
      height: 20,
    }).addChildTo(this);
    // 弾の発射間隔
    var shotDelay = 500;
    // 一定間隔で弾を発射
    var shotTween = Tweener().clear()
                             .call(function() {
                               this.shot();
                             }, this)
                             .wait(shotDelay)
                             .setLoop(true);
    // 点滅
    this.blinkTween = Tweener().clear().fadeOut(100).fadeIn(100).setLoop(true);
    // 点滅時間管理用
    var timerTween = Tweener().clear()
                              .wait(5000)
                              .call(function() {
                                this.alpha = 1.0;
                                this.blinkTween.stop();
                              }, this);
    // Tweener並列適用
    this.blinkTween.attachTo(this);
    shotTween.attachTo(this);
    timerTween.attachTo(this);
  },
    // 弾発射
  shot: function() {
    var self = this;
    // 左右の弾
    [-10, 10].each(function(dx) {
      var bullet = PlayerBullet().addChildTo(playerBulletGroup);
      bullet.setPosition(self.x + dx, self.y);
    });
  },
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
});
/*
 * 敵クラス
 */
phina.define("Enemy", {
  // 継承
  superClass: 'SpaceShip',
  // 初期化
  init: function(param) {
    // 親クラス初期化
    this.superInit({ speed: 3 });
    // フレームアニメーション指定
    this.anim.gotoAndPlay('enemy');
    // 当たり判定用矩形
    this.collider = Collider({
      width: 40,
      height: 40,
    }).addChildTo(this);
    // ヒットポイント
    this.hp = (param && param.hp !== undefined) ? param.hp : 1;
    // 弾を発射できるか
    var canShot = (param && param.canShot !== undefined) ? param.canShot : true;
    if (!canShot) return;
    // 弾の発射間隔
    var shotDelay = 6000;
    // 一定間隔で弾を発射
    this.tweener.clear()
                .call(function() {
                  this.shot();
                }, this)
                .wait(shotDelay)
                .setLoop(true);
    // tweenerを一旦ポーズ　            
    this.tweener.pause();
  },
  // 毎フレーム更新処理
  update: function() {
    // 画面に現れてから弾を発射するようにする
    if (this.top > SCREEN_RECT.top && !this.tweener.playing) {
      this.tweener.play();
    }
    // 機体の移動
    this.move(Vector2.DOWN);
    // 画面下に出たら削除
    if (this.top > SCREEN_RECT.bottom) {
      this.remove();
    }
  },
  // 弾発射
  shot: function() {
    var self = this;
    // 弾
    [-20, 0, 20].each(function(degree) {
      // 弾作成
      var bullet = EnemyBullet(4).addChildTo(enemyBulletGroup);
      bullet.setPosition(self.x, self.y);
      // 発射方向を決める
      var deg = self.rotation + degree + 90;
      // 角度と大きさからベクトル作成
      var vec = Vector2().fromDegree(deg, bullet.speed);
      // ベクトルを代入
      bullet.physical.velocity = vec;
    });
  },
});
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
/*
 * ダメージ敵クラス
 */
phina.define("DamagedEnemy", {
  // 継承
  superClass: 'Sprite',
  // 初期化
  init: function() {
    // 親クラス初期化
    this.superInit('redship', 64, 64);
    // 敵のフレームインデックス
    this.frameIndex = 4;
  },
}); 
/*
 * プレイヤーの弾クラス
 */
phina.define("PlayerBullet", {
  // 継
  superClass: 'Sprite',
  // 初期化
  init: function() {
    // 親クラス初期化
    this.superInit('bullet', 64, 64);
    // スピード
    var speed = 10;
    // 攻撃力
    this.power = 1;
    // 当たり判定用のコライダー
    this.collider = Collider({
      width: 10,
      height: 30,
    }).addChildTo(this);
    // 上向き速度を与える
    this.physical.velocity.y = -speed;
    // ショット音再生
    SoundManager.play('shot');
  },
    // 毎フレーム更新処理
  update: function() {
    // 画面下に出たら削除
    if (this.top > SCREEN_RECT.bottom) {
      this.remove();
    }
  },
});
/*
 * 敵の弾クラス
 */
phina.define("EnemyBullet", {
  // 継承
  superClass: 'Sprite',
  // 初期化
  init: function() {
    // 親クラス初期化
    this.superInit('bullet', 64, 64);
    this.setFrameIndex(1);
    // スピード
    this.speed = 10;
    // 当たり判定用のコライダー
    this.collider = Collider({
      width: 10,
      height: 10,
    }).addChildTo(this);
  },
  // 毎フレーム更新処理
  update: function() {
    // 画面下に出たら削除
    if (this.top > SCREEN_RECT.bottom) {
      this.remove();
    }
  },
});
/*
 * 爆発クラス
 */
phina.define("Explosion", {
  // 継承
  superClass: 'Sprite',
  // 初期化
  init: function(param) {
    // 親クラス初期化
    this.superInit('explosion', 64, 64);
    // フレームアニメーションをアタッチ
    this.anim = FrameAnimation('explosion').attachTo(this).gotoAndPlay('explosion');
    // 爆発音再生
    SoundManager.play('explosion');
  },
  // 更新処理
  update: function() {
    // フレームアニメーションが終了したら自身を削除
    if (this.anim.finished) {
      this.remove();
    }
  },
});
/*
 * コライダークラス
 */
phina.define("Collider", {
  // 継承
  superClass: 'RectangleShape',
  // 初期化
  init: function(param) {
    // 親クラス初期化
    this.superInit({
      width: param.width,
      height: param.height,
      fill: null,
      stroke: 'red',
    });
    // 非表示
    this.hide();
  },
  // コライダーの絶対座標の矩形
  getAbsoluteRect: function() {
    var x = this.left + this.parent.x;
    var y = this.top + this.parent.y;
    return Rect(x, y, this.width, this.height);
  },
});
/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    // MainSceneから開始
    //startLabel: 'main',
    // アセット指定
    assets: ASSETS,
  });
  // 実行
  app.run();
  // 無理やり canvas にフォーカス
  ;(function() {
    var canvas = app.domElement;
    canvas.setAttribute('tabindex', '0');
    canvas.focus();
  })(); 
});