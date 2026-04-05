GhostRegistry["守護者"] = {
    color: "orange",
    targetIndex: -1,
    isReturning: false,
    logic: function (myX, myY, pX, pY, dirs) {
        // 1. 餌（ドット）を選び、距離を測る
        if (this.targetIndex === -1 || !dots[this.targetIndex]) {
            if (dots.length > 0) {
                this.targetIndex = Math.floor(Math.random() * dots.length);
                this.isReturning = false;
            } else {
                // 餌がない場合はひたすらプレイヤーを追う
                let path = findShortestPath(myX, myY, pX, pY);
                return path.length > 0 && dirs.includes(path[0]) ? path[0] : dirs[0];
            }
        }

        let targetDot = dots[this.targetIndex];
        let dgx = Math.floor(targetDot.px / TILE_SIZE);
        let dgy = Math.floor(targetDot.py / TILE_SIZE);
        let distToDot = dist(myX, myY, dgx, dgy);

        // 2. モードの切り替え（飛距離の制限：nマス以上離れたら強制帰還、5マスで帰還終了）
        if (distToDot > 8) {
            this.isReturning = true;
        }
        if (distToDot <= 3) {
            this.isReturning = false;
        }

        // 3. 帰還モード中は餌に向かって最短で進む
        if (this.isReturning) {
            let path = findShortestPath(myX, myY, dgx, dgy);
            if (path.length > 0 && dirs.includes(path[0])) {
                return path[0];
            }
        }

        // 4. 通常モードの時はプレイヤーを追いかける（距離制限なし）
        // ただし追いかけている途中でnマス離れたら、次のフレームで帰還モードに切り替わる
        let dPlayer = dist(myX, myY, pX, pY);
        if (dPlayer < 5) { // 少し遠くからでも見つけられるように10マスに設定
            let path = findShortestPath(myX, myY, pX, pY);
            if (path.length > 0 && dirs.includes(path[0])) {
                return path[0];
            }
        }

        // 5. プレイヤーが近くにいない時は、餌の近く（5マス以内）をキープ
        if (distToDot > 5) {
            let path = findShortestPath(myX, myY, dgx, dgy);
            if (path.length > 0 && dirs.includes(path[0])) {
                return path[0];
            }
        }

        // それ以外はランダム
        return dirs[Math.floor(Math.random() * dirs.length)];
    }
};
