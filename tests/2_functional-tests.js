const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve a puzzle with valid puzzle string', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'solution');
                done();
            });
    });

    test('Solve a puzzle with missing puzzle string', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: ''
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
    });

    test('Solve a puzzle with invalid characters', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...b9.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });

    test('Solve a puzzle with incorrect length', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: '..9..5.1.85.4....2432.....1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });

    test('Solve a puzzle that cannot be solved', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: '1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            });
    });

    test('Check a puzzle placement with all fields', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '7'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'valid');
                assert.isBoolean(res.body.valid);
                done();
            });
    });

    test('Check a puzzle placement with single placement conflict', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '2'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'valid');
                assert.isBoolean(res.body.valid);
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'conflict');
                assert.isArray(res.body.conflict);
                assert.equal(res.body.conflict.length, 1);
                assert.equal(res.body.conflict[0], 'region');
                done();
            });
    });

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '1'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'valid');
                assert.isBoolean(res.body.valid);
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'conflict');
                assert.isArray(res.body.conflict);
                assert.equal(res.body.conflict.length, 2);
                assert.equal(res.body.conflict[0], 'row');
                assert.equal(res.body.conflict[1], 'column');
                done();
            });
    });

    test('Check a puzzle placement with all placement conflicts', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '5'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'valid');
                assert.isBoolean(res.body.valid);
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'conflict');
                assert.isArray(res.body.conflict);
                assert.equal(res.body.conflict.length, 3);
                assert.equal(res.body.conflict[0], 'row');
                assert.equal(res.body.conflict[1], 'column');
                assert.equal(res.body.conflict[2], 'region');
                done();
            });
    });

    test('Check a puzzle placement with missing required fields', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: '',
                value: '5'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Check a puzzle placement with invalid characters', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......l...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '5'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });

    test('Check a puzzle placement with incorrect length', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432.......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '5'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });

    test('Check a puzzle placement with invalid placement coordinate', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'K0',
                value: '5'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid coordinate');
                done();
            });
    });

    test('Check a puzzle placement with invalid placement value', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'B5',
                value: '10'
            })
            .end((err,res) => {
                assert.equal(res.status,200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid value');
                done();
            });
    });

});

