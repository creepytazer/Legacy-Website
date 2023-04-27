if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  initializeBoard(15);
}

function initializeBoard(size) {
  let gameBoard = document.getElementById("game2");
  var html = "";
  for (var i = 0; i < size; i++) {
    html += `<div class="game-row" style="height: ${100 / size}%;">`;
    for (var j = 0; j < size; j++) {
      html += `<div class="game-tile" style="height: 100%; width: ${
        100 / size
      }%;"></div>`;
    }
    html += `</div>`;
  }
  gameBoard.innerHTML = html;
}
