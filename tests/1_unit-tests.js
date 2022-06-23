const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let validate = solver.validate(puzzle);
        assert.isTrue(validate.charsValid);
        assert.isTrue(validate.correctLength);
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        let puzzle = '..9..5.1.85.4....2432..x...1.0.69.83.9...d.6.62.71...9......1945....4.37.4.3..6..';
        let validate = solver.validate(puzzle);
        assert.isFalse(validate.charsValid);
        assert.isTrue(validate.correctLength);
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9....6.62.71...9......1945....4.37.4.3..6..';
        let validate = solver.validate(puzzle);
        assert.isTrue(validate.charsValid);
        assert.isFalse(validate.correctLength);
    });

    test('Logic handles a valid row placement', () => {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let valid = solver.checkRowPlacement(puzzle,0,0,'2');
        assert.isTrue(valid);
    });

    test('Logic handles a invalid row placement', () => {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let valid = solver.checkRowPlacement(puzzle,5,7,'1');
        assert.isFalse(valid);
    });

    test('Logic handles a valid column placement', () => {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let valid = solver.checkColPlacement(puzzle,0,0,'2');
        assert.isTrue(valid);
    });

    test('Logic handles a invalid column placement', () => {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let valid = solver.checkColPlacement(puzzle,5,7,'1');
        assert.isFalse(valid);
    });

    test('Logic handles a valid region (3x3 grid) placement', () => {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let valid = solver.checkRegionPlacement(puzzle,5,7,'1');
        assert.isTrue(valid);
    });

    test('Logic handles a invalid region (3x3 grid) placement', () => {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let valid = solver.checkRegionPlacement(puzzle,0,0,'2');
        assert.isFalse(valid);
    });

    test('Valid puzzle strings pass the solver', () => {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let solution = solver.solve(puzzle);
        assert.notEqual(solution,'');
    });

    test('Invalid puzzle strings fail the solver', () => {
        let puzzle = '1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let solution = solver.solve(puzzle);
        assert.equal(solution,'error');
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
        let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let expSol = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
        let solution = solver.solve(puzzle);
        assert.equal(solution,expSol);
    });
});
