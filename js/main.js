
  (() => {
  const {
    BOARD_SIZE,
    SHIPS,
    getShipCells,
    canPlaceShip,
    generateRandomShips,
    findHitShip,
    isShipSunk,
    allShipsSunk
  } = BattleshipRules;
  const {
    createBoard,
    getCell,
    renderShips,
    clearPreview,
    renderPreview,
    renderSunkShip
  } = BattleshipBoard;

  let playerShips = [];
  let computerShips = [];
  let currentShipIndex = 0;
  let horizontal = true;
  let placementFinished = false;

  let gameStarted = false;
  let gameOver = false;
  let currentTurn = "player";

  let playerShots = [];
  let computerShots = [];
  const computerPlayer = BattleshipComputer.createComputerPlayer(BOARD_SIZE);

  const status = document.getElementById("status");
  const shipInfo = document.getElementById("ship-info");
  const playerBoard = document.getElementById("player-board");
  const computerBoard = document.getElementById("computer-board");

  // Päivitetään sijoitusohje

  function updateShipInfo() {
    if (currentShipIndex >= SHIPS.length) {
      placementFinished = true;

      shipInfo.textContent = "Kaikki laivat sijoitettu!";
      document.getElementById("placement-controls").style.display = "none";

      startGame();
      return;
    }

    const ship = SHIPS[currentShipIndex];

    shipInfo.textContent =
      `Sijoita ${ship.name} (${ship.size} ruutua) – ` +
      (horizontal ? "vaakasuoraan" : "pystysuoraan");
  }


  // Sijoitetaan pelaajan laiva
  function placePlayerShip(row, col) {
    if (placementFinished) return;

    const ship = SHIPS[currentShipIndex];

    const cells = getShipCells(
      row,
      col,
      ship.size,
      horizontal
    );

    if (!canPlaceShip(cells, playerShips)) {
      status.textContent = "Laiva ei mahdu tähän!";
      return;
    }

    playerShips.push({
      name: ship.name,
      cells: cells
    });

    currentShipIndex++;

    renderShips(playerBoard, playerShips);
    updateShipInfo();
  }

  // Pelaaja klikkaa ruutua
  playerBoard.addEventListener("click", event => {
    const cell = event.target.closest(".cell");

    if (!cell) return;

    placePlayerShip(
      Number(cell.dataset.row),
      Number(cell.dataset.col)
    );
  });

  // Laivan kääntäminen
  document.getElementById("rotate-button")
    .addEventListener("click", () => {
      horizontal = !horizontal;
      updateShipInfo();
    });

  // Pelaajan laivojen satunnainen sijoittelu
  document.getElementById("random-button")
    .addEventListener("click", () => {
      playerShips = generateRandomShips();

      currentShipIndex = SHIPS.length;
      renderShips(playerBoard, playerShips);
      updateShipInfo();
    });

  // Käynnistys
  createBoard(playerBoard, BOARD_SIZE);
  createBoard(computerBoard, BOARD_SIZE);

  computerShips = generateRandomShips();

  updateShipInfo();


  playerBoard.addEventListener("mouseover", event => {
    const cell = event.target.closest(".cell");

    if (!cell || placementFinished) return;

    const ship = SHIPS[currentShipIndex];

    const cells = getShipCells(
      Number(cell.dataset.row),
      Number(cell.dataset.col),
      ship.size,
      horizontal
    );

    const valid = canPlaceShip(cells, playerShips);

    renderPreview(playerBoard, cells, valid);
  });

  playerBoard.addEventListener("mouseleave", () => {
    clearPreview(playerBoard);
  });

  function startGame() {
    gameStarted = true;
    gameOver = false;
    currentTurn = "player";

    status.textContent =
      "Peli alkoi! Ammu klikkaamalla tietokoneen pelilautaa.";
  }


  computerBoard.addEventListener("click", event => {
    if (!gameStarted || gameOver || currentTurn !== "player") {
      return;
    }

    const cell = event.target.closest(".cell");
    if (!cell) return;

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    // Ei saa ampua samaan ruutuun uudelleen
    if (playerShots.some(shot =>
      shot.row === row && shot.col === col
    )) {
      return;
    }

    playerShots.push({ row, col });

    const hitShip = findHitShip(row, col, computerShips);

    if (hitShip) {
      cell.classList.add("hit");
      status.textContent = "Osuma!";

      if (isShipSunk(hitShip, playerShots)) {
        renderSunkShip(computerBoard, hitShip);

        status.textContent =
          `Upotit laivan: ${hitShip.name}!`;
      }
    } else {
      cell.classList.add("miss");
      status.textContent = "Huti!";
    }

    // Tarkistetaan voitto
    if (allShipsSunk(computerShips, playerShots)) {
      endGame("player");
      return;
    }

    currentTurn = "computer";

    setTimeout(computerTurn, 800);
  });


  function computerTurn() {
    if (gameOver) return;

    const target = computerPlayer.nextShot(computerShots);
    if (!target) return;

    const { row, col } = target;

    computerShots.push({ row, col });

    const cell = getCell(playerBoard, { row, col });

    const hitShip = findHitShip(row, col, playerShips);
    const sunk = hitShip && isShipSunk(hitShip, computerShots);

    computerPlayer.recordResult(target, Boolean(hitShip), sunk ? hitShip.cells : []);

    if (hitShip) {
      cell.classList.add("hit");
      status.textContent = "Tietokone osui laivaasi!";

      if (sunk) {
        renderSunkShip(playerBoard, hitShip);

        status.textContent =
          `Tietokone upotti laivasi: ${hitShip.name}!`;
      }
    } else {
      cell.classList.add("miss");
      status.textContent = "Tietokone ampui ohi!";
    }

    if (allShipsSunk(playerShips, computerShots)) {
      endGame("computer");
      return;
    }

    currentTurn = "player";
  }


  function endGame(winner) {
    gameOver = true;
    gameStarted = false;

    if (winner === "player") {
      status.textContent = "🎉 Voitit pelin! Kaikki vihollisen laivat on upotettu!";
    } else {
      status.textContent = "💥 Hävisit pelin! Tietokone upotti kaikki laivasi.";
    }

    document.getElementById("computer-board")
      .classList.add("disabled");
  }


  document.getElementById("new-game-button")
    .addEventListener("click", () => {
      window.location.reload();
    });
})();
