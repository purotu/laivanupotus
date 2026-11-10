const BattleshipRules = (() => {
  const BOARD_SIZE = 10;

  const SHIPS = [
    { name: "Lentotukialus", size: 5 },
    { name: "Taistelulaiva", size: 4 },
    { name: "Risteilijä", size: 3 },
    { name: "Sukellusvene", size: 3 },
    { name: "Hävittäjä", size: 2 }
  ];

  function getShipCells(row, col, size, isHorizontal) {
    const cells = [];

    for (let index = 0; index < size; index++) {
      cells.push({
        row: row + (isHorizontal ? 0 : index),
        col: col + (isHorizontal ? index : 0)
      });
    }

    return cells;
  }

  function canPlaceShip(cells, ships) {
    return cells.every(cell => {
      const insideBoard =
        cell.row >= 0 &&
        cell.row < BOARD_SIZE &&
        cell.col >= 0 &&
        cell.col < BOARD_SIZE;

      const occupied = ships.some(ship =>
        ship.cells.some(existing =>
          existing.row === cell.row &&
          existing.col === cell.col
        )
      );

      return insideBoard && !occupied;
    });
  }

  function generateRandomShips() {
    const ships = [];

    for (const ship of SHIPS) {
      let placed = false;

      while (!placed) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        const isHorizontal = Math.random() < 0.5;
        const cells = getShipCells(row, col, ship.size, isHorizontal);

        if (canPlaceShip(cells, ships)) {
          ships.push({ name: ship.name, cells: cells });
          placed = true;
        }
      }
    }

    return ships;
  }

  function findHitShip(row, col, ships) {
    return ships.find(ship =>
      ship.cells.some(cell =>
        cell.row === row && cell.col === col
      )
    );
  }

  function isShipSunk(ship, shots) {
    return ship.cells.every(cell =>
      shots.some(shot =>
        shot.row === cell.row &&
        shot.col === cell.col
      )
    );
  }

  function allShipsSunk(ships, shots) {
    return ships.every(ship => isShipSunk(ship, shots));
  }

  return {
    BOARD_SIZE,
    SHIPS,
    getShipCells,
    canPlaceShip,
    generateRandomShips,
    findHitShip,
    isShipSunk,
    allShipsSunk
  };
})();