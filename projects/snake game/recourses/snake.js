if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  document.getElementById("start-button").addEventListener("click", startGame);
  document.getElementById("game-size").addEventListener("change", checkSize);
  document.getElementById("game-speed").addEventListener("change", checkSpeed);
  document
    .getElementById("game-snake-size")
    .addEventListener("change", checkSnakeSize);
}

gameBoard = document.getElementById("game-board");
function startGame() {
  document.getElementById("game-start").classList.add("hide");
  var size = document.getElementById("game-size").value;
  var speed = document.getElementById("game-speed").value;
  var snakeSize = document.getElementById("game-snake-size").value;
  var game = new Game(speed);
  game.initialize(size, snakeSize);
}

class Game {
  constructor(speed) {
    this.move = true;
    this.speed = speed;
  }

  initialize(size, snakeSize) {
    this.populate(gameBoard, size);
    var snake = new Snake(this.speed);
    snake.addSegment(snakeSize - 1);
    var score = new Score(size, size);

    document.getElementById("game").addEventListener(
      "keydown",
      function (e) {
        snake.updateDirection(e, score);
      },
      false
    );
    snake.move(0, snake, score);
  }

  populate(board, size) {
    var html = "";
    for (var i = 0; i < size; i++) {
      html += `<div class="game-row" style="height: ${100 / size}%;">`;
      for (var j = 0; j < size; j++) {
        html += `<div class="game-tile" style="height: 92%; width: ${
          92 / size
        }%;"></div>`;
      }
      html += `</div>`;
    }
    html +=
      '<div id="current-points"><span>Current Score : <span id="point-tracker">0</span</span></div>';
    board.innerHTML = html;
  }
}

class SnakeSegment {
  constructor(r, c) {
    this.r = r;
    this.c = c;
    this.next = null;
    this.prev = null;
  }
}
class Snake {
  constructor(speed) {
    this.head = new SnakeSegment(1, 1);
    this.tail = this.head;
    this.currDir = [0, 1];
    this.prevDir = [0, 1];
    this.moves = 0;
    this.length = 1;
    this.running = true;
    this.speed = speed;
    tileFill(1, 1);
  }

  addSegment(amountToAdd) {
    for (var i = 0; i < amountToAdd; i++) {
      var newTail = new SnakeSegment(this.tail.r, this.tail.c);
      this.tail.next = newTail;
      newTail.prev = this.tail;
      this.tail = newTail;
      this.length++;
    }
  }

  move(i, snake, score) {
    setTimeout(function () {
      if (snake.moves == i && snake.running) {
        snake.updatePosition(score);
        if (snake.running) {
          snake.move(i, snake, score);
        }
      }
    }, this.speed);
  }

  updatePosition(score) {
    if (this.failCheck()) {
      this.running = false;
      this.gameOver();
    } else {
      var curr = this.tail;
      tileWipe(curr.r, curr.c);
      while (curr.prev != null) {
        curr.r = curr.prev.r;
        curr.c = curr.prev.c;
        tileFill(curr.r, curr.c);
        curr = curr.prev;
      }

      this.prevDir = this.currDir;

      curr.r += this.currDir[0];
      curr.c += this.currDir[1];
      tileFill(curr.r, curr.c);
      this.scoreCheck(score);
    }
  }
  directionCheck(keyPressed) {
    if (
      (keyPressed == "w" || keyPressed == "arrowup") &&
      this.prevDir[0] == 0
    ) {
      return [-1, 0];
    }
    if (
      (keyPressed == "s" || keyPressed == "arrowdown") &&
      this.prevDir[0] == 0
    ) {
      return [1, 0];
    }
    if (
      (keyPressed == "d" || keyPressed == "arrowright") &&
      this.prevDir[1] == 0
    ) {
      return [0, 1];
    }
    if (
      (keyPressed == "a" || keyPressed == "arrowleft") &&
      this.prevDir[1] == 0
    ) {
      return [0, -1];
    }
    return this.prevDir;
  }
  updateDirection(key, score) {
    if (!this.running) {
      return;
    }
    key.preventDefault();
    var key = key.key.toLowerCase();
    var newDir = this.directionCheck(key);
    if (newDir != this.currDir && newDir != this.prevDir) {
      this.moves++;
      this.currDir = newDir;
      this.updatePosition(score);
      this.move(this.moves, this, score);
    }
  }

  scoreCheck(apple) {
    var headPos = [this.head.r, this.head.c];
    var applePos = [apple.r, apple.c];
    if (headPos[0] == applePos[0] && headPos[1] == applePos[1]) {
      this.addSegment(1);
      var currentPoints = parseInt(
        document.getElementById("point-tracker").innerHTML
      );
      document.getElementById("point-tracker").innerHTML = `${
        currentPoints + 1
      }`;
      gameBoard.children[this.head.r].children[this.head.c].classList.remove(
        "apple"
      );
      if (this.length < apple.rows * apple.columns) {
        apple.spawn();
      }
    }
  }

  failCheck() {
    var r = this.head.r + this.currDir[0];
    var c = this.head.c + this.currDir[1];
    var rBound = gameBoard.children.length - 1;
    var cBound = gameBoard.children[0].children.length;
    if (
      0 <= r &&
      r < rBound &&
      0 <= c &&
      c < cBound &&
      !gameBoard.children[r].children[c].classList.contains("snake-body")
    ) {
      return false;
    }
    return true;
  }

  gameOver() {
    var self = this;

    this.deleteTail = function () {
      if (!this.tail) {
        return false;
      }
      var curr = this.tail;
      this.tail = curr.prev;
      gameBoard.children[curr.r].children[curr.c].classList.remove(
        "snake-body"
      );
      return true;
    };
    var redCount = 0;
    const flashRed = setInterval(function () {
      if (redCount < 5) {
        if (redCount & 1) {
          document.getElementById("game-board").classList.remove("red-snake");
        } else {
          document.getElementById("game-board").classList.add("red-snake");
        }
        redCount++;
      } else {
        clearInterval(flashRed);
        const deleteInterval = setInterval(function () {
          if (!self.deleteTail()) {
            clearInterval(deleteInterval);
            var currentPoints = parseInt(
              document.getElementById("point-tracker").innerHTML
            );
            document.getElementById("last-score").innerHTML = currentPoints;
            document.getElementById("high-score").innerHTML = Math.max(
              currentPoints,
              parseInt(document.getElementById("high-score").innerHTML)
            );
            document.getElementById("game-board").classList.remove("red-snake");
            document.getElementById("game-start").classList.remove("hide");
          }
        }, Math.max(2000 / self.length, 4));
      }
    }, 200);
  }
}

function tileFill(r, c) {
  gameBoard.children[r].children[c].classList.add("snake-body");
}
function tileWipe(r, c) {
  gameBoard.children[r].children[c].classList.remove("snake-body");
}

class Score {
  constructor(w, h) {
    this.rows = h;
    this.columns = w;
    this.r = null;
    this.c = null;
    this.spawn();
  }
  spawn() {
    var emptyTile = this.findEmpty();
    this.r = emptyTile[0];
    this.c = emptyTile[1];
    gameBoard.children[this.r].children[this.c].classList.add("apple");
  }

  findEmpty() {
    var r = randomInteger(0, this.rows);
    var c = randomInteger(0, this.columns);
    while (gameBoard.children[r].children[c].classList.contains("snake-body")) {
      r = randomInteger(0, this.rows);
      c = randomInteger(0, this.columns);
    }
    return [r, c];
  }
}

function checkSpeed() {
  var currSpeed = parseInt(document.getElementById("game-speed").value);
  currSpeed = Math.floor(currSpeed);
  if (currSpeed > 1000) {
    currSpeed = 1000;
  } else if (currSpeed < 20) {
    currSpeed = 20;
  }
  document.getElementById("game-speed").value = currSpeed;
}
function checkSize() {
  var currSize = parseInt(document.getElementById("game-size").value);
  if (currSize > 80) {
    currSize = 80;
  } else if (currSize < 5) {
    currSize = 5;
  }
  document.getElementById("game-size").value = currSize;
}
function checkSnakeSize() {
  var maxLength = Math.pow(
    parseInt(document.getElementById("game-size").value),
    2
  );
  var currSnakeSize = parseInt(
    document.getElementById("game-snake-size").value
  );
  if (currSnakeSize > maxLength) {
    currSnakeSize = maxLength;
  } else if (currSnakeSize < 1) {
    currSnakeSize = 1;
  }
  document.getElementById("game-snake-size").value = currSnakeSize;
}
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
