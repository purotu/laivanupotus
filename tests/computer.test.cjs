const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");

const source = readFileSync(require.resolve("../js/computer.js"), "utf8");
const { createComputerPlayer } = runInNewContext(`${source}\nBattleshipComputer;`);

function contains(cells, position) {
  return cells.some(cell => cell.row === position.row && cell.col === position.col);
}

test("computer searches randomly among unshot cells before finding a ship", () => {
  const first = createComputerPlayer(10, () => 0);
  const last = createComputerPlayer(10, () => 0.999);

  assert.deepEqual(structuredClone(first.nextShot([])), { row: 0, col: 0 });
  assert.deepEqual(structuredClone(last.nextShot([])), { row: 9, col: 9 });
  assert.deepEqual(structuredClone(first.nextShot([{ row: 0, col: 0 }])), { row: 0, col: 1 });
});

test("computer targets orthogonal neighbors of a hit", () => {
  const hit = { row: 4, col: 4 };

  [0, 0.25, 0.5, 0.999].forEach(random => {
    const computer = createComputerPlayer(10, () => random);
    computer.recordResult(hit, true);
    const target = computer.nextShot([hit]);

    assert.equal(Math.abs(target.row - hit.row) + Math.abs(target.col - hit.col), 1);
  });
});

test("computer never targets outside the board at any corner", () => {
  const corners = [
    { row: 0, col: 0 }, { row: 0, col: 9 },
    { row: 9, col: 0 }, { row: 9, col: 9 }
  ];

  corners.forEach(hit => {
    const computer = createComputerPlayer(10, () => 0);
    computer.recordResult(hit, true);
    const shots = [hit];

    for (let index = 0; index < 2; index++) {
      const target = computer.nextShot(shots);
      assert.ok(target.row >= 0 && target.row < 10 && target.col >= 0 && target.col < 10);
      assert.equal(Math.abs(target.row - hit.row) + Math.abs(target.col - hit.col), 1);
      assert.equal(contains(shots, target), false);
      shots.push(target);
      computer.recordResult(target, false);
    }
  });
});

test("computer follows horizontal hits and tries the other end after a miss", () => {
  const computer = createComputerPlayer(10, () => 0);
  const shots = [{ row: 4, col: 4 }, { row: 4, col: 5 }];
  shots.forEach(shot => computer.recordResult(shot, true));

  const first = computer.nextShot(shots);
  assert.deepEqual(structuredClone(first), { row: 4, col: 3 });
  shots.push(first);
  computer.recordResult(first, false);

  assert.deepEqual(structuredClone(computer.nextShot(shots)), { row: 4, col: 6 });
});

test("computer follows vertical hits and tries the other end after a miss", () => {
  const computer = createComputerPlayer(10, () => 0);
  const shots = [{ row: 4, col: 4 }, { row: 5, col: 4 }];
  shots.forEach(shot => computer.recordResult(shot, true));

  const first = computer.nextShot(shots);
  assert.deepEqual(structuredClone(first), { row: 3, col: 4 });
  shots.push(first);
  computer.recordResult(first, false);

  assert.deepEqual(structuredClone(computer.nextShot(shots)), { row: 6, col: 4 });
});

test("computer keeps hunting after a miss next to a single hit", () => {
  const computer = createComputerPlayer(10, () => 0);
  const hit = { row: 4, col: 4 };
  computer.recordResult(hit, true);
  const shots = [hit];
  const miss = computer.nextShot(shots);
  shots.push(miss);
  computer.recordResult(miss, false);
  const target = computer.nextShot(shots);

  assert.equal(contains(shots, target), false);
  assert.equal(Math.abs(target.row - hit.row) + Math.abs(target.col - hit.col), 1);
});

test("sinking a ship clears its targets and resumes random search", () => {
  const computer = createComputerPlayer(10, () => 0);
  const cells = [{ row: 4, col: 4 }, { row: 4, col: 5 }];
  computer.recordResult(cells[0], true);
  computer.recordResult(cells[1], true, cells);

  assert.deepEqual(structuredClone(computer.nextShot(cells)), { row: 0, col: 0 });
});

test("sinking a touching ship preserves unresolved hits on another ship", () => {
  const computer = createComputerPlayer(10, () => 0);
  const sunk = [{ row: 4, col: 4 }, { row: 4, col: 5 }];
  const remaining = { row: 5, col: 4 };
  computer.recordResult(sunk[0], true);
  computer.recordResult(remaining, true);
  computer.recordResult(sunk[1], true, sunk);

  const target = computer.nextShot([...sunk, remaining]);
  assert.equal(Math.abs(target.row - remaining.row) + Math.abs(target.col - remaining.col), 1);
});

test("computer falls back to neighbors if touching ships suggest a blocked direction", () => {
  const computer = createComputerPlayer(10, () => 0);
  const hits = [{ row: 4, col: 4 }, { row: 4, col: 5 }];
  hits.forEach(hit => computer.recordResult(hit, true));
  const shots = [...hits, { row: 4, col: 3 }, { row: 4, col: 6 }];
  const target = computer.nextShot(shots);

  assert.equal(contains(shots, target), false);
  assert.ok(hits.some(hit => Math.abs(target.row - hit.row) + Math.abs(target.col - hit.col) === 1));
});

test("computer can exhaust the board without duplicate shots or an infinite loop", () => {
  const computer = createComputerPlayer(10, () => 0);
  const shots = [];

  for (let index = 0; index < 100; index++) {
    const target = computer.nextShot(shots);
    assert.ok(target);
    assert.equal(contains(shots, target), false);
    shots.push(target);
    computer.recordResult(target, index % 3 === 0);
  }

  assert.equal(computer.nextShot(shots), undefined);
});

test("new computer players do not share targeting memory", () => {
  const first = createComputerPlayer(10, () => 0);
  const second = createComputerPlayer(10, () => 0);
  const hit = { row: 4, col: 4 };
  first.recordResult(hit, true);

  assert.deepEqual(structuredClone(second.nextShot([hit])), { row: 0, col: 0 });
});