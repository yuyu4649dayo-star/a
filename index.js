<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>星キャッチゲーム</title>
  <style>
    body {
      background-color: #1a1a2e;
      color: #fff;
      font-family: sans-serif;
      text-align: center;
      margin: 0;
      padding: 20px;
    }
    /* ゲーム画面の枠線と背景 */
    canvas {
      background-color: #16213e;
      border: 3px solid #e94560;
      border-radius: 10px;
      display: block;
      margin: 20px auto;
      touch-action: none;
    }
    /* スマホ・iPad用操作ボタン */
    .controls {
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    button {
      font-size: 20px;
      padding: 12px 35px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
    }
    button:active {
      background: #0f3460;
    }
  </style>
</head>
<body>

  <h1>⭐ 星キャッチゲーム</h1>
  <p>スコア: <span id="score">0</span></p>

  <!-- 描画用のキャンバス -->
  <canvas id="gameCanvas" width="360" height="480"></canvas>

  <!-- タッチ操作用のボタン -->
  <div class="controls">
    <button id="leftBtn">◀ 左</button>
    <button id="rightBtn">右 ▶</button>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');

    let score = 0;

    // 1. プレイヤー（受ける板）のデータ
    const player = {
      x: canvas.width / 2 - 30,
      y: canvas.height - 30,
      width: 60,
      height: 15,
      speed: 7,
      dx: 0
    };

    // 2. 落ちてくる星のデータ
    const star = {
      x: Math.random() * (canvas.width - 30),
      y: 0,
      size: 24,
      speed: 3
    };

    // --- キーボード操作（PC向け） ---
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') player.dx = -player.speed;
      if (e.key === 'ArrowRight' || e.key === 'd') player.dx = player.speed;
    });

    document.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) player.dx = 0;
    });

    // --- ボタン操作（タッチ/クリック向け） ---
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    const startLeft = (e) => { e.preventDefault(); player.dx = -player.speed; };
    const startRight = (e) => { e.preventDefault(); player.dx = player.speed; };
    const stop = () => player.dx = 0;

    leftBtn.addEventListener('touchstart', startLeft);
    leftBtn.addEventListener('touchend', stop);
    leftBtn.addEventListener('mousedown', startLeft);
    leftBtn.addEventListener('mouseup', stop);

    rightBtn.addEventListener('touchstart', startRight);
    rightBtn.addEventListener('touchend', stop);
    rightBtn.addEventListener('mousedown', startRight);
    rightBtn.addEventListener('mouseup', stop);

    // 3. ゲームループ（毎秒約60回実行される処理）
    function update() {
      // プレイヤーの移動処理
      player.x += player.dx;
      // 画面外に出ないように制限
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

      // 星の落下処理
      star.y += star.speed;

      // 当たり判定（プレイヤーと星がぶつかったか）
      if (
        star.y + star.size >= player.y &&
        star.x + star.size >= player.x &&
        star.x <= player.x + player.width
      ) {
        score += 10;
        scoreEl.textContent = score;
        resetStar();
      }

      // 星が一番下まで落ちてしまった場合
      if (star.y > canvas.height) {
        resetStar();
      }

      // 画面の再描画
      draw();

      // 次のフレームを呼び出す
      requestAnimationFrame(update);
    }

    // 星の位置とスピードを再設定
    function resetStar() {
      star.y = 0;
      star.x = Math.random() * (canvas.width - star.size);
      // スコアが上がるほど少しずつ速くする
      star.speed = 3 + Math.floor(score / 50);
    }

    // 画面に図形を描く関数
    function draw() {
      // 画面をリセット
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // プレイヤーを描画
      ctx.fillStyle = '#4ecca3';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // 星（絵文字）を描画
      ctx.font = `${star.size}px sans-serif`;
      ctx.fillText('⭐', star.x, star.y + star.size);
    }

    // ゲーム開始！
    update();
  </script>
</body>
</html>
