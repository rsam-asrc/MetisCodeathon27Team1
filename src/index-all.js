const getLastPathPart = (path) => {
    path = path.replace(/\/+$/, '');
    const lastSlashIndex = path.lastIndexOf('/');
    return lastSlashIndex !== -1 ? path.substring(lastSlashIndex + 1) : path;
  }
  //test
  
  const init = (event) => {
    console.log("event!!", event);
    const defaultResponse = {
        "apiversion": "1",
        "author": "team1",
        "color": "#21A793",
        "head": "chicken",
        "tail": "chicken",
        "version": "1.0.0"
    };
    return defaultResponse;
  };
  
  const start = (event) => {
    // TODO implement
    console.log("event!", event);
    const response = {
        statusCode: 200,
        body: JSON.stringify('game started team 1'),
    };
    return response;
  };
  
  const end = (event) => {
    // TODO implement
    console.log("event!", event);
    const response = {
        statusCode: 200,
        body: JSON.stringify('end game team 1'),
    };
    return response;
  };
  
  const moveOLD = (event) => {
    // TODO implement
    console.log("event!", event);
  
    // hello dan test
  
  
    /*super simple to see it in action. This will last until it runs out of life
    it will go up if it can until it can no longer then it will go left 
    if it cant go up or left then it will go down
    if it cant go down then it will go right
    this will repeat until no more life
    this is not good at all since is not taking in consideration enemies posible movement or life or food.
    this is just to see it working
    
    fill out map with location of snakes 
    then use logic above to determine move
    
  
    */
    let jsonBody = JSON.parse(event.body);
    let width = jsonBody.board.width;
    let height = jsonBody.board.height;
    let map = {};
    // add board with fals.... btw this can be done a lot better but im just testing :)
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            map[x + '-' + y] = false;
        }
    }
    //iterate over every body/head in the board (you included already in this)
    for (let snake of jsonBody.board.snakes) {
        for (let parts of snake.body) {
            let key = parts.x + "-" + parts.y;
            map[key] = true;
        }
    }
    console.log("mapsnakes", map);
    let response = {};
  
    let headX = jsonBody.you.head.x;
    let headY = jsonBody.you.head.y;
    //try up
  
    let keyCheck = headX + '-' + (headY + 1);
    if (map[keyCheck] !== undefined && map[keyCheck] !== true) {
        console.log("go up");
        response.move = 'up';
    } else if (map[(headX - 1) + '-' + headY] !== undefined && map[(headX - 1) + '-' + headY] !== true) {
        console.log("go left");
        response.move = 'left';
    } else if (map[headX + '-' + (headY - 1)] !== undefined && map[headX + '-' + (headY - 1)] !== true) {
        console.log("go down");
        response.move = 'down';
    } else if (map[(headX + 1) + '-' + headY] !== undefined && map[(headX + 1) + '-' + headY] !== true) {
        console.log("go right");
        response.move = 'right';
    } else {
        console.log("nadaa", keyCheck);
    }
  
    return response;
  };
  
  
  
  class Board {
    constructor(data) {
        this.data = data;
        this.width = this.data.board.width;
        this.height = this.data.board.height;
        this.grid = this.createGrid();
        this.populateFood();
        this.populateHazards();
        this.populateSnakes();
    }
  
    createGrid() {
        const grid = [];
        for (let x = 0; x < this.width; x++) {
            grid[x] = [];
            for (let y = 0; y < this.height; y++) {
                grid[x][y] = { type: "empty", x: x, y: y };
            }
        }
        return grid;
    }
  
    isInGrid(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
  
    populateFood() {
        this.data.board.food.forEach(food => {
            if (this.isInGrid(food.x, food.y)) {
                this.grid[food.x][food.y] = { type: "food", x: food.x, y: food.y };
            }
        });
    }
  
    populateHazards() {
        this.data.board.hazards.forEach(hazard => {
            if (this.isInGrid(hazard.x, hazard.y)) {
                this.grid[hazard.x][hazard.y] = { type: "hazard", x: hazard.x, y: hazard.y };
            }
        });
    }
  
    populateSnakes() {
        this.data.board.snakes.forEach(snake => {
            snake.body.forEach((segment, index) => {
                if (this.isInGrid(segment.x, segment.y)) {
                    if (snake.id === this.data.you.id) {
                        const cell = { type: "self" }
                        this.grid[segment.x][segment.y] = { type: "self", isHead: index === 0, x: segment.x, y: segment.y };
                    } else {
                        this.grid[segment.x][segment.y] = { type: "other", isHead: index === 0, x: segment.x, y: segment.y };
                    }
                }
            });
        });
    }
  
    getCell(x, y)
    {
        if (this.isInGrid(x, y)) {
            return this.grid[x][y];
        }
        
        return { type: "wall", x, y };
    }
  
    scan(x, y, axis = "x", dir = 1, maxDist = 100) {
        // dir is 1 or -1
        dir = Math.sign(dir);
        // clamp maxDist between 1 and width
        maxDist = Math.min(Math.max(1, maxDist), this.width);
  
        for (let dist = 1; dist <= maxDist; dist++) {
            const cell = axis === "x" ?
                this.getCell(x + (dist * dir), y) :
                this.getCell(x, y + (dist * dir));
  
            if (cell.type !== "empty") {
                return {
                    ...cell,
                    dist
                };
            }
        }
  
        return {
            type: "unknown/unexpected",
            dist
        };
    }
  
    scanLeft(x, y) {
        return this.scan(x, y, "x", -1);
    }
  
    scanRight(x, y) {
        return this.scan(x, y, "x", 1);
    }
  
    scanUp(x, y) {
        return this.scan(x, y, "y", 1);
    }
  
    scanDown(x, y) {
        return this.scan(x, y, "y", -1);
    }
  
    scanAll(x, y) {
        return [
            { move: "left", cell: this.scanLeft(x, y) },
            { move: "right", cell: this.scanRight(x, y) },
            { move: "up", cell: this.scanUp(x, y) },
            { move: "down", cell: this.scanDown(x, y) }
        ];
    }
  }
  
  class Snake {
    constructor(data, board) {
        this.data = data;
        this.id = this.data.id;
        this.name = this.data.name;
        this.latency = this.data.latency;
        this.health = this.data.health;
        this.body = this.data.body;
        this.head = this.data.head;
        this.length = this.data.length;
        this.shout = this.data.shout;
        this.squad = this.data.squad;
  
        this.board = board;
    }
  
    getNextMove() {
        // scan the board looking for food
        const { x, y } = this.head;
        const scans = this.board.scanAll(x, y);
  
        let closestFood = null;
        let firstFoundEmpty = null;
  
        for (let scan of scans) {
            if (scan.cell.type === "food") {
                if (closestFood === null || scan.cell.dist < closestFood.dist) {
                    closestFood = scan;
                }
            } else if (firstFoundEmpty === null && scan.cell.type !== "empty" && scan.cell.dist > 1) {
                firstFoundEmpty = scan;
            }
        }
  
        if (closestFood) {
            console.log("head position", x, y);
            console.log("closest food", closestFood.move, closestFood.cell.dist, closestFood.cell.x, closestFood.cell.y);
            console.log("move", closestFood.move);
            return closestFood.move;
        }
  
        if (firstFoundEmpty) {
            console.log("head position", x, y);
            console.log("first empty", firstFoundEmpty.move, firstFoundEmpty.cell.dist, firstFoundEmpty.cell.x, firstFoundEmpty.cell.y);
            console.log("move", firstFoundEmpty.move);
            return firstFoundEmpty.move;
        }
  
        // no good move
        return undefined;
    }
  }
  
  class Game {
    constructor(jsonString) {
        this.data = JSON.parse(jsonString);
        this.board = new Board(this.data);
        this.snake = new Snake(this.data.you, this.board);
    }
  }
  
  const move = (event) => {
    const game = new Game(event.body);
    const move = game.snake.getNextMove();
    console.log("move: ", move)
    return { move };
  }
  
  
  
  
  export const handler = async (event) => {
    const method = event.requestContext.http.method;
    if (method === "GET") {
        return init();
    }
  
    if (method === "POST") {
        const action = getLastPathPart(event.rawPath);
        switch (action) {
            case "start":
                return start(event);
  
            case "end":
                return end(event);
  
            case "move":
                return move(event);
  
            default:
                return {
                    body: `POST Action "${action}" is not supported`,
                    statusCode: 500
                }
        }
    }
  
    return {
        body: `Method "${method}" is not supported`,
        statusCode: 500
    }
  };
  