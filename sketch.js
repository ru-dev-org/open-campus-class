const TILE_SIZE = 30;

// 1: 壁, 0: 通路
const mapData = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const ROWS = mapData.length;
const COLS = mapData[0].length;

let player;
let ghosts = [];
let dots = [];

let gameScale = 1;
let offsetX = 0;
let offsetY = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    updateLayout();
    
    player = new Entity(5, 9, color(255, 255, 0));

    // GhostRegistryに登録された全員のAIを読み込んでゴーストを生成
    for (let studentName in GhostRegistry) {
        let config = GhostRegistry[studentName];
        ghosts.push(new Ghost(
            studentName,
            config.logic,
            color(config.color || 'red')
        ));
    }

    initLevel();
}

function updateLayout() {
    let gameW = COLS * TILE_SIZE;
    let gameH = ROWS * TILE_SIZE;
    gameScale = min(windowWidth / gameW, windowHeight / gameH);
    offsetX = (windowWidth - gameW * gameScale) / 2;
    offsetY = (windowHeight - gameH * gameScale) / 2;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    updateLayout();
}

function initLevel() {
    dots = [];
    dots.push({ px: 1 * TILE_SIZE + TILE_SIZE / 2, py: 1 * TILE_SIZE + TILE_SIZE / 2 });
    dots.push({ px: 9 * TILE_SIZE + TILE_SIZE / 2, py: 1 * TILE_SIZE + TILE_SIZE / 2 });
    dots.push({ px: 1 * TILE_SIZE + TILE_SIZE / 2, py: 11 * TILE_SIZE + TILE_SIZE / 2 });
    dots.push({ px: 9 * TILE_SIZE + TILE_SIZE / 2, py: 11 * TILE_SIZE + TILE_SIZE / 2 });

    player.px = 5 * TILE_SIZE + TILE_SIZE / 2;
    player.py = 9 * TILE_SIZE + TILE_SIZE / 2;
    player.pathQueue = [];
    player.dir = '';

    for (let g of ghosts) {
        g.px = 5 * TILE_SIZE + TILE_SIZE / 2;
        g.py = 5 * TILE_SIZE + TILE_SIZE / 2;
        g.dir = '';
    }
}

function draw() {
    background(0);
    
    push();
    translate(offsetX, offsetY);
    scale(gameScale);

    drawMap();

    fill(255, 180, 180);
    noStroke();
    for (let i = dots.length - 1; i >= 0; i--) {
        let d = dots[i];
        circle(d.px, d.py, 10);
        if (dist(player.px, player.py, d.px, d.py) < TILE_SIZE / 2) {
            dots.splice(i, 1);
        }
    }

    player.update(null);
    player.draw();

    for (let g of ghosts) {
        g.update(player);
        g.draw();
        if (dist(player.px, player.py, g.px, g.py) < TILE_SIZE * 0.7) {
            fill(255, 0, 0);
            textSize(32);
            textAlign(CENTER, CENTER);
            text("GAME OVER", (COLS * TILE_SIZE) / 2, (ROWS * TILE_SIZE) / 2);
            noLoop();
        }
    }

    if (dots.length === 0) {
        fill(0, 255, 0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("GAME CLEAR!", (COLS * TILE_SIZE) / 2, (ROWS * TILE_SIZE) / 2);
        noLoop();
    }
    
    pop();
}

function drawMap() {
    fill(0, 0, 200);
    noStroke();
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (mapData[y][x] === 1) {
                rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

function mousePressed() { handleInput(mouseX, mouseY); }
function touchStarted() { handleInput(mouseX, mouseY); return false; }

function handleInput(mx, my) {
    let scaledX = (mx - offsetX) / gameScale;
    let scaledY = (my - offsetY) / gameScale;
    setTarget(scaledX, scaledY);
}

function setTarget(tx, ty) {
    let targetX = floor(tx / TILE_SIZE);
    let targetY = floor(ty / TILE_SIZE);
    if (targetX < 0 || targetX >= COLS || targetY < 0 || targetY >= ROWS) return;
    if (mapData[targetY][targetX] === 1) return;
    let newPath = findShortestPath(player.gx, player.gy, targetX, targetY);
    if (newPath.length > 0) player.pathQueue = newPath;
}

function findShortestPath(startX, startY, targetX, targetY) {
    let queue = [{ x: startX, y: startY, path: [] }];
    let visited = Array(ROWS).fill().map(() => Array(COLS).fill(false));
    visited[startY][startX] = true;

    const moves = [
        { dx: 0, dy: -1, dir: 'UP' },
        { dx: 0, dy: 1, dir: 'DOWN' },
        { dx: -1, dy: 0, dir: 'LEFT' },
        { dx: 1, dy: 0, dir: 'RIGHT' }
    ];

    while (queue.length > 0) {
        let curr = queue.shift();
        if (curr.x === targetX && curr.y === targetY) return curr.path;

        for (let move of moves) {
            let nx = curr.x + move.dx;
            let ny = curr.y + move.dy;
            if (nx < 0) nx = COLS - 1;
            if (nx >= COLS) nx = 0;
            if (ny >= 0 && ny < ROWS && mapData[ny][nx] === 0 && !visited[ny][nx]) {
                visited[ny][nx] = true;
                queue.push({ x: nx, y: ny, path: [...curr.path, move.dir] });
            }
        }
    }
    return [];
}

class Entity {
    constructor(gx, gy, col) {
        this.gx = gx;
        this.gy = gy;
        this.px = gx * TILE_SIZE + TILE_SIZE / 2;
        this.py = gy * TILE_SIZE + TILE_SIZE / 2;
        this.col = col;
        this.speed = 1;
        this.dir = '';
        this.pathQueue = [];
    }

    getValidDirections(x, y) {
        let valid = [];
        if (y > 0 && mapData[y - 1][x] === 0) valid.push('UP');
        if (y < ROWS - 1 && mapData[y + 1][x] === 0) valid.push('DOWN');
        if (mapData[y][(x - 1 + COLS) % COLS] === 0) valid.push('LEFT');
        if (mapData[y][(x + 1) % COLS] === 0) valid.push('RIGHT');
        return valid;
    }

    update(playerRef) {
        let isAtNode = (this.px % TILE_SIZE === TILE_SIZE / 2 && this.py % TILE_SIZE === TILE_SIZE / 2);

        if (isAtNode) {
            this.gx = floor(this.px / TILE_SIZE);
            this.gy = floor(this.py / TILE_SIZE);
            let validDirs = this.getValidDirections(this.gx, this.gy);

            if (this instanceof Ghost) {
                let chosenDir = this.aiFunc(this.gx, this.gy, playerRef.gx, playerRef.gy, validDirs);
                if (validDirs.includes(chosenDir)) {
                    this.dir = chosenDir;
                } else {
                    this.dir = validDirs[0] || '';
                }
            } else {
                if (this.pathQueue.length > 0) {
                    let nextMove = this.pathQueue.shift();
                    this.dir = validDirs.includes(nextMove) ? nextMove : '';
                } else {
                    this.dir = '';
                }
            }
        }

        if (this.dir === 'UP') this.py -= this.speed;
        if (this.dir === 'DOWN') this.py += this.speed;
        if (this.dir === 'LEFT') this.px -= this.speed;
        if (this.dir === 'RIGHT') this.px += this.speed;

        if (this.px < 0) this.px += (COLS * TILE_SIZE);
        if (this.px >= (COLS * TILE_SIZE)) this.px -= (COLS * TILE_SIZE);
    }

    draw() {
        fill(this.col);
        noStroke();
        circle(this.px, this.py, TILE_SIZE * 0.8);
    }
}

class Ghost extends Entity {
    constructor(name, aiFunc, col) {
        super(5, 5, col);
        this.name = name;
        this.aiFunc = aiFunc;
    }
}
