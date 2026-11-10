const BattleshipComputer = (() => {
  function createComputerPlayer(boardSize, random = Math.random) {
    let hits = [];

    function contains(cells, position) {
      return cells.some(cell => cell.row === position.row && cell.col === position.col);
    }

    function nextShot(shots) {
      const available = [];

      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          if (!contains(shots, { row, col })) {
            available.push({ row, col });
          }
        }
      }

      const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 }
      ];
      const extensions = [];
      const neighbors = [];

      hits.forEach(hit => {
        directions.forEach(direction => {
          const neighbor = {
            row: hit.row + direction.row,
            col: hit.col + direction.col
          };

          neighbors.push(neighbor);

          if (contains(hits, neighbor)) {
            extensions.push({
              row: hit.row - direction.row,
              col: hit.col - direction.col
            });
          }
        });
      });

      const aligned = available.filter(cell => contains(extensions, cell));
      const adjacent = available.filter(cell => contains(neighbors, cell));
      const candidates = aligned.length ? aligned : adjacent.length ? adjacent : available;

      return candidates[Math.floor(random() * candidates.length)];
    }

    function recordResult(shot, hit, sunkCells = []) {
      if (hit && !contains(hits, shot)) {
        hits.push({ row: shot.row, col: shot.col });
      }

      hits = hits.filter(position => !contains(sunkCells, position));
    }

    return { nextShot, recordResult };
  }

  return { createComputerPlayer };
})();