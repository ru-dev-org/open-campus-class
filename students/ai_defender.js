GhostRegistry["守護者"] = {
    color: "orange",
    count: 2,
    logic: function (myX, myY, pX, pY, dirs) {
        // 1. 守るべき場所（一番最初に決めた餌の位置）を固定する
        if (this.targetX === undefined) {
            if (dots.length > 0) {
                let idx = Math.floor(Math.random() * dots.length);
                let targetDot = dots[idx];
                this.targetX = Math.floor(targetDot.px / TILE_SIZE);
                this.targetY = Math.floor(targetDot.py / TILE_SIZE);
                this.isReturning = false;
            } else {
                // 最初から餌がない場合は普通に追う
                let path = findShortestPath(myX, myY, pX, pY);
                return path.length > 0 && dirs.includes(path[0]) ? path[0] : dirs[0];
            }
        }

        // 2. 担当の餌がまだ残っているか確認する
        let isFoodStillThere = false;
        for (let d of dots) {
            let dgx = Math.floor(d.px / TILE_SIZE);
            let dgy = Math.floor(d.py / TILE_SIZE);
            if (dgx === this.targetX && dgy === this.targetY) {
                isFoodStillThere = true;
                break;
            }
        }

        // 3. 餌が食べられていたら、普通にプレイヤーを追いかける
        if (!isFoodStillThere) {
            let path = findShortestPath(myX, myY, pX, pY);
            if (path.length > 0 && dirs.includes(path[0])) {
                return path[0];
            }
            return dirs[Math.floor(Math.random() * dirs.length)];
        }

        // 4. 餌が残っているなら、従来の守備ロジックを実行
        let distToTarget = dist(myX, myY, this.targetX, this.targetY);

        // モード切り替え（守備拠点から離れすぎたら帰還）
        if (this.isReturning === undefined) this.isReturning = false;
        if (distToTarget > 8) this.isReturning = true;
        if (distToTarget <= 3) this.isReturning = false;

        // 帰還中
        if (this.isReturning) {
            let path = findShortestPath(myX, myY, this.targetX, this.targetY);
            if (path.length > 0 && dirs.includes(path[0])) return path[0];
        }

        // 索敵（近くにプレイヤーがいれば追う）
        let dPlayer = dist(myX, myY, pX, pY);
        if (dPlayer < 5) {
            let path = findShortestPath(myX, myY, pX, pY);
            if (path.length > 0 && dirs.includes(path[0])) return path[0];
        }

        // 理想的な距離（3マス以内）をキープ
        if (distToTarget > 3) {
            let path = findShortestPath(myX, myY, this.targetX, this.targetY);
            if (path.length > 0 && dirs.includes(path[0])) return path[0];
        }

        return dirs[Math.floor(Math.random() * dirs.length)];
    }
};
