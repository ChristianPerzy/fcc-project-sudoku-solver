const Math = require('mathjs');

class SudokuSolver {
  
  validate(puzzleString) {
    let charsValid = /^[1-9\.]+$/.test(puzzleString);
    let correctLength = puzzleString.length === 81;
    return { charsValid, correctLength };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowNums = puzzleString.slice(row * 9, (row+1) * 9).split('');
    rowNums[column] = '.';
    return !(rowNums.includes(value.toString()));
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colNums = puzzleString.split('').filter((val, i) => (i-column) % 9 == 0);
    colNums[row] = '.';
    return !(colNums.includes(value.toString()));
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rindex = (Math.floor(row / 3) * (9 * 3)) + (Math.floor(column / 3) * 3);
    
    let field = [];
    while(field.length < 9) {
      for(let i = 0; i < 3; i++) field.push(puzzleString[rindex+i]);
      rindex += 9;
    }
    field[(3 * (row % 3)) + (column % 3)] = '.';
    
    return !(field.includes(value.toString()));
  }

  checkFieldPlacement(puzzleString, row, column, value) {
    let vrow = this.checkRowPlacement(puzzleString,row,column,value);
    let vcol = this.checkColPlacement(puzzleString,row,column,value);
    let vreg = this.checkRegionPlacement(puzzleString,row,column,value);
    return vrow && vcol && vreg;
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) return 'error';

    let sudoku = puzzleString.split('');

    let solvable = true;
    for(let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] !== '.') {
        let row = Math.floor(i/9);
        let col = i % 9;
        if (!this.checkFieldPlacement(puzzleString,row,col,puzzleString[i])) {
          solvable = false;
          break;
        }
      }
    }
    if (!solvable) return 'error';
    
    const bruteForce = (sudoku, i = 0) => {
      if (i >= 81) return true;

      let row = Math.floor(i/9);
      let col = i % 9;

      if(sudoku[i] === '.') {
        for(let n = 1; n <= 9; n++) {
          let ok = this.checkFieldPlacement(sudoku.join(''),row,col,n)
  
          if (ok) {
            sudoku[i] = n.toString();
            if(bruteForce(sudoku,i+1)) return true;
            sudoku[i] = '.';
          }
        }
        return false;

      } else {
        return bruteForce(sudoku,i+1);
      }
    }

    let solved = bruteForce(sudoku);
    let solvedPuzzle = sudoku.join('');

    if (solved) {
      return solvedPuzzle;
    } else {
      return 'error';
    }
  }
}

module.exports = SudokuSolver;

