const BattleshipBoard = (() => {
  function createBoard(board, size) {
    board.innerHTML = "";

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = document.createElement("div");

        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;

        board.appendChild(cell);
      }
    }
  }

  function getCell(board, position) {
    return board.querySelector(
      `[data-row="${position.row}"][data-col="${position.col}"]`
    );
  }

  function renderShips(board, ships) {
    board.querySelectorAll(".cell").forEach(cell => {
      cell.classList.remove("ship");
    });

    ships.forEach(ship => {
      ship.cells.forEach(position => {
        getCell(board, position).classList.add("ship");
      });
    });
  }

  function clearPreview(board) {
    board.querySelectorAll(".cell").forEach(cell => {
      cell.classList.remove("preview", "invalid");
    });
  }

  function renderPreview(board, cells, valid) {
    clearPreview(board);

    cells.forEach(position => {
      const cell = getCell(board, position);

      if (cell) {
        cell.classList.add(valid ? "preview" : "invalid");
      }
    });
  }

  function renderSunkShip(board, ship) {
    ship.cells.forEach(position => {
      getCell(board, position).classList.add("sunk");
    });
  }

  return {
    createBoard,
    getCell,
    renderShips,
    clearPreview,
    renderPreview,
    renderSunkShip
  };
})();