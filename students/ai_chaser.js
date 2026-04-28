GhostRegistry["チェイサー"] = {
    color: "red", // 敵の色を指定する
    count: 1, // このアルゴリズムで動く敵の数
    // 移動方向を決める関数
    logic: function (myX, myY, playerX, playerY, dirs) {
        // myX, myY は自分のマップ上のマスの位置の変数で整数値で表現される
        // playerX, playerY はプレイヤーのマップ上のマスの位置の変数

        // dirs は行ける方向の文字のリスト（'UP', 'DOWN', 'LEFT', 'RIGHT'）
        // includesという関数を持ち、動ける方向を判定することができる

        // プレイヤーが自分より上にいたら、上に行きたい
        // > は大小を判定し、playerYがmyYより大きいか判定している
        // y軸は値が小さいほど上にいることになる。これはマップの構造が左上が(0,0)で右下が(20,20)だから
        if (playerY < myY) {
            /*
            dirs.includes("UP")は、今行ける方向の配列に"UP"が含まれているか判定している。
            カッコ内の条件が正しければ、{}の中身が実行される
            */
            if (dirs.includes("UP")) {
                // return は　この関数から抜けるという意味で、ここで処理が終わる
                // "UP" は　この関数が返す値で、この関数を呼び出したプログラムが受け取ることができる値となる
                return "UP"
            }
        }

        // プレイヤーが自分より下にいたら、下に行きたい
        // y軸は値が大きいほど下にいることになる。
        if (playerY > myY) {
            if (dirs.includes("DOWN")) {
                return "DOWN"
            }
        }

        // プレイヤーが自分より右にいたら、右に行きたい　 X軸は右に行けば行くほど値が大きくなる
        if (playerX > myX) {
            if (dirs.includes("RIGHT")) {
                return "RIGHT"
            }
        }

        // プレイヤーが自分より左にいたら、左に行きたい
        /* ここにコードを書いてみよう！ */


        return dirs[0]; // どの方向もダメなら、とりあえず今行ける最初の方向へ
    }
};
