GhostRegistry["チェイサー"] = {
    color: "red",
    count: 1, // このアルゴリズムで動く敵の数
    // 移動方向を決める関数
    logic: function (myX, myY, playerX, playerY, dirs) {
        // myX, myY は自分のマップ上のマスの位置変数
        // playerX, playerY はプレイヤーのマップ上のマスの位置変数
        // dirs は今行ける方向の文字の配列（'UP', 'DOWN', 'LEFT', 'RIGHT'）

        // プレイヤーが自分より右にいたら、右に行きたい
        if (playerX > myX) {
            /*
            dirs.includes("RIGHT")は、今行ける方向の配列に"RIGHT"が含まれているか判定している。
            if は　「もし～なら」という意味
            カッコ内の条件が正しければ、{}の中身が実行される
            */
            if (dirs.includes("RIGHT")) {
                // return は　この関数から抜けるという意味で、ここで処理が終わる
                // "RIGHT" は　この関数が返す値で、この関数を呼び出したプログラムが受け取ることができる値となる
                return "RIGHT"
            }
        }

        // プレイヤーが自分より左にいたら、左に行きたい

        // 上にいたら...

        // 下にいたら...

        // どの方向もダメなら、とりあえず今行ける最初の方向へ
        return dirs[0];
    }
};
