GhostRegistry["最短経路"] = {
    color: "red",
    count: 2,
    logic: function (myNodeX, myNodeY, playerNodeX, playerNodeY, availableDirs) {
        // sketch.js に定義されている最短経路探索関数を利用
        // 第1引数、第2引数が開始点（自分）、第3引数、第4引数が目標（プレイヤー）
        let path = findShortestPath(myNodeX, myNodeY, playerNodeX, playerNodeY);

        if (path && path.length > 0) {
            // 最短経路の最初の1歩を返す
            let nextDir = path[0];
            // availableDirsに含まれているか一応確認（安全のため）
            if (availableDirs.includes(nextDir)) {
                return nextDir;
            }
        }

        // 経路が見つからない、または到達済みの場合はランダムに動く
        return availableDirs[Math.floor(Math.random() * availableDirs.length)];
    }
};
