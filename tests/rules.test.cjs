const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");

const source = readFileSync(require.resolve("../js/rules.js"), "utf8");

function loadRules(random = Math.random) {
  const math = Object.create(Math);
  math.random = random;

  return runInNewContext(`${source}\nBattleshipRules;`, { Math: math });
}

const rules = loadRules();

function createShip(row = 2, col = 3, size = 3, horizontal = true) {
  return {
    name: "Test ship",
    cells: rules.getShipCells(row, col, size, horizontal)
  };
}

test("getShipCells returns horizontal cells from the starting position", () => {
  assert.deepEqual(structuredClone(rules.getShipCells(2, 3, 3, true)), [
    { row: 2, col: 3 },
    { row: 2, col: 4 },
    { row: 2, col: 5 }
  ]);
});

test("getShipCells returns vertical cells from the starting position", () => {
  assert.deepEqual(structuredClone(rules.getShipCells(2, 3, 3, false)), [
    { row: 2, col: 3 },
    { row: 3, col: 3 },
    { row: 4, col: 3 }
  ]);
});

test("canPlaceShip accepts ships ending at either board edge", () => {
  const edge = rules.BOARD_SIZE - 1;

  assert.equal(rules.canPlaceShip(rules.getShipCells(edge, edge - 1, 2, true), []), true);
  assert.equal(rules.canPlaceShip(rules.getShipCells(edge - 1, edge, 2, false), []), true);
  assert.equal(rules.canPlaceShip(rules.getShipCells(0, 0, 2, true), []), true);
  assert.equal(rules.canPlaceShip(rules.getShipCells(0, 0, 2, false), []), true);
});

test("canPlaceShip rejects positions outside every board boundary", () => {
  const edge = rules.BOARD_SIZE - 1;
  const invalidShips = [
    rules.getShipCells(-1, 0, 2, true),
    rules.getShipCells(0, -1, 2, false),
    rules.getShipCells(edge, 0, 2, false),
    rules.getShipCells(0, edge, 2, true)
  ];

  invalidShips.forEach(cells => {
    assert.equal(rules.canPlaceShip(cells, []), false);
  });
});

test("canPlaceShip rejects overlapping and crossing ships", () => {
  const ship = createShip();

  assert.equal(rules.canPlaceShip(ship.cells, [ship]), false);
  assert.equal(rules.canPlaceShip(rules.getShipCells(1, 4, 3, false), [ship]), false);
});

test("canPlaceShip allows ships to touch without overlapping", () => {
  const ship = createShip();

  assert.equal(rules.canPlaceShip(rules.getShipCells(3, 3, 3, true), [ship]), true);
  assert.equal(rules.canPlaceShip(rules.getShipCells(2, 6, 2, true), [ship]), true);
});

test("findHitShip returns the ship occupying the target cell", () => {
  const first = createShip();
  const second = createShip(5, 5, 2, false);

  assert.equal(rules.findHitShip(2, 3, [first, second]), first);
  assert.equal(rules.findHitShip(2, 5, [first, second]), first);
  assert.equal(rules.findHitShip(6, 5, [first, second]), second);
});

test("findHitShip returns undefined for water or an empty fleet", () => {
  assert.equal(rules.findHitShip(0, 0, [createShip()]), undefined);
  assert.equal(rules.findHitShip(2, 3, []), undefined);
});

test("isShipSunk is false for unhit and partially hit ships", () => {
  const ship = createShip();

  assert.equal(rules.isShipSunk(ship, []), false);
  assert.equal(rules.isShipSunk(ship, ship.cells.slice(0, 2)), false);
});

test("isShipSunk requires a hit on every distinct ship cell", () => {
  const ship = createShip();
  const repeatedShots = Array.from({ length: 3 }, () => ({ ...ship.cells[0] }));

  assert.equal(rules.isShipSunk(ship, repeatedShots), false);
});

test("isShipSunk accepts all hits in any order with additional misses", () => {
  const ship = createShip();
  const shots = [{ row: 0, col: 0 }, ...ship.cells].reverse();

  assert.equal(rules.isShipSunk(ship, shots), true);
});

test("allShipsSunk is false while any ship remains afloat", () => {
  const first = createShip();
  const second = createShip(5, 5, 2, false);

  assert.equal(rules.allShipsSunk([first, second], []), false);
  assert.equal(rules.allShipsSunk([first, second], first.cells), false);
});

test("allShipsSunk is true when every ship has been sunk", () => {
  const first = createShip();
  const second = createShip(5, 5, 2, false);

  assert.equal(rules.allShipsSunk([first, second], [...first.cells, ...second.cells]), true);
});

test("placement and hit checks do not modify their inputs", () => {
  const ship = createShip();
  const ships = [ship];
  const cells = rules.getShipCells(7, 7, 2, true);
  const shots = [{ ...ship.cells[0] }];
  const before = structuredClone({ ships, cells, shots });

  rules.canPlaceShip(cells, ships);
  rules.findHitShip(2, 3, ships);
  rules.isShipSunk(ship, shots);
  rules.allShipsSunk(ships, shots);

  assert.deepEqual(structuredClone({ ships, cells, shots }), before);
});

test("generateRandomShips creates valid fleets for 100 reproducible seeds", () => {
  for (let seed = 1; seed <= 100; seed++) {
    let state = seed;
    let randomCalls = 0;
    const seededRules = loadRules(() => {
      randomCalls++;
      assert.ok(randomCalls < 100000, `Placement did not finish for seed ${seed}`);
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    });
    const fleet = seededRules.generateRandomShips();
    const occupied = new Set();

    assert.equal(fleet.length, rules.SHIPS.length);

    fleet.forEach((ship, index) => {
      assert.equal(ship.name, rules.SHIPS[index].name);
      assert.equal(ship.cells.length, rules.SHIPS[index].size);

      const horizontal = ship.cells.every(cell => cell.row === ship.cells[0].row);
      const vertical = ship.cells.every(cell => cell.col === ship.cells[0].col);
      assert.ok(horizontal || vertical);

      ship.cells.forEach((cell, cellIndex) => {
        assert.ok(Number.isInteger(cell.row) && cell.row >= 0 && cell.row < rules.BOARD_SIZE);
        assert.ok(Number.isInteger(cell.col) && cell.col >= 0 && cell.col < rules.BOARD_SIZE);
        assert.equal(cell.row, ship.cells[0].row + (horizontal ? 0 : cellIndex));
        assert.equal(cell.col, ship.cells[0].col + (horizontal ? cellIndex : 0));

        const key = `${cell.row},${cell.col}`;
        assert.equal(occupied.has(key), false, `Overlapping ships for seed ${seed}`);
        occupied.add(key);
      });
    });

    assert.equal(occupied.size, rules.SHIPS.reduce((total, ship) => total + ship.size, 0));
    assert.notEqual(seededRules.generateRandomShips(), fleet);
  }
});