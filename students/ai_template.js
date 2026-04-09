GhostRegistry["テンプレート"] = {
    color: "red",
    logic: function (myNodeX, myNodeY, playerNodeX, playerNodeY, availableDirs) {
        // 正しいコード（availableDirsの中からランダムに選ぶ）
        return availableDirs[Math.floor(Math.random() * availableDirs.length)];
    }
};
