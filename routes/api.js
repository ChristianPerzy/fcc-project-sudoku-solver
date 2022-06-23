'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let coordinate = req.body.coordinate;
      let value = req.body.value;
      let puzzle = req.body.puzzle;

      if (coordinate === undefined || coordinate === '' ||
          value === undefined || value === '' ||
          puzzle === undefined || value === '') {
        res.json({ "error": "Required field(s) missing" });
      }

      let validP = solver.validate(puzzle);
      if(!validP.charsValid) {
        res.json({ "error": "Invalid characters in puzzle" });
        return;
      }
      if(!validP.correctLength) {
        res.json({ "error": "Expected puzzle to be 81 characters long" });
        return;
      }

      let row = coordinate.charCodeAt(0) - 'A'.charCodeAt(0);
      let col = Number(coordinate[1]) - 1;
      if (row < 0 || row > 8 || col < 0 || col > 8 || coordinate.length !== 2) {
        res.json({ "error": "Invalid coordinate" });
        return
      }

      if (!/^[1-9]$/.test(value)) {
        res.json({ "error": "Invalid value" });
        return;
      }

      let conflict = [];
      if (!solver.checkRowPlacement(puzzle,row,col,value)) conflict.push('row');
      if (!solver.checkColPlacement(puzzle,row,col,value)) conflict.push('column');
      if (!solver.checkRegionPlacement(puzzle,row,col,value)) conflict.push('region');

      let valid = conflict.length === 0;

      if (valid) {
        res.json({ valid });
      } else {
        res.json({ valid, conflict });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;

      if (puzzle === undefined || puzzle === '') {
        res.json({ "error": "Required field missing" });
        return;
      }

      let valid = solver.validate(puzzle);
      if(!valid.charsValid) {
        res.json({ "error": "Invalid characters in puzzle" });
        return;
      }
      if(!valid.correctLength) {
        res.json({ "error": "Expected puzzle to be 81 characters long" });
        return;
      }

      let solution = solver.solve(puzzle);
      if (solution === 'error') {
        res.json({ "error": "Puzzle cannot be solved" });
      } else {
        res.json({ solution });
      }

    });
};
