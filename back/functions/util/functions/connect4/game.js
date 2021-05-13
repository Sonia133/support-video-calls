const { GAME } = require('../../constants/connect4/game');

// init empty matrix, jmin, jmax

const identical_elems = (list) => {
    var set = new Set(list);
    var winner = false;
    if (set.size === 1) {
        winner = set.values().next().value;
        if (winner !== GAME.EMPTY) {
            return winner;
        }
    }

    return false;
}

const is_in_matrix = (matrix, chr) => {
    for (let i = 0; i < GAME.ROWS; i++) {
        for (let j = 0; j < GAME.COLUMNS; j++) {
            if (chr === matrix[i * GAME.COLUMNS + j]) {
                return true;
            }
        }
    }

    return false;
}

const intermediate = (matrix) => {
    var rez = false;

    // orizontal
    for (let i = 0; i < GAME.ROWS; i++) {
        for (let j = 0; j <= (GAME.COLUMNS - GAME.NR_CONNECT + 1); j++) {
            if (!rez) {
                rez = identical_elems(matrix.slice(i * GAME.COLUMNS + j, i * GAME.COLUMNS + j + GAME.NR_CONNECT - 1))
                if (matrix[i * GAME.COLUMNS + j + GAME.NR_CONNECT - 1] !== GAME.TIE) {
                    rez = false;
                }
            }
        }
    }

    // verticala
    if (!rez) {
        for (let i = 0; i < GAME.COLUMNS; i++) {
            for (let j = 0; j <= (GAME.ROWS - GAME.NR_CONNECT + 1); j++) {
                if (!rez) {
                    let items = [];
                    for (let k = j * GAME.COLUMNS + i; k < j * GAME.COLUMNS + i + (GAME.NR_CONNECT - 1) * GAME.COLUMNS; k += GAME.COLUMNS) {
                        items.push(matrix[k]);
                    }

                    rez = identical_elems(items);
                    if (matrix[j * GAME.COLUMNS + i + (GAME.NR_CONNECT - 1) * GAME.COLUMNS] !== GAME.TIE) {
                        rez = false;
                    }
                }
            }
        }
    }

    // diagonal st-dr
    if (!rez) {
        for (let i = 0; i <= (GAME.COLUMNS - GAME.NR_CONNECT + 1); i++) {
            for (let j = 0; j <= (GAME.ROWS - GAME.NR_CONNECT + 1); j++) {
                if (!rez) {
                    let items = [];
                    for (let k = j * GAME.COLUMNS + i; k < j * GAME.COLUMNS + i + GAME.NR_CONNECT * GAME.COLUMNS; k += (GAME.COLUMNS + 1)) {
                        items.push(matrix[k]);
                    }

                    rez = identical_elems(items);
                    if (matrix[j * GAME.COLUMNS + i + GAME.NR_CONNECT * GAME.COLUMNS] !== GAME.TIE) {
                        rez = false;
                    }
                }
            }
        }
    }

    // diagonal dr-st
    if (!rez) {
        for (let i = GAME.COLUMNS - 1; i >= (GAME.COLUMNS - GAME.NR_CONNECT); i--) {
            for (let j = 0; j <= (GAME.ROWS - GAME.NR_CONNECT + 1); j++) {
                if (!rez) {
                    let items = [];
                    for (let k = j * GAME.COLUMNS + i; k < j * GAME.COLUMNS + i + (GAME.NR_CONNECT - 1) * (GAME.COLUMNS - 1); k += (GAME.COLUMNS - 1)) {
                        items.push(matrix[k]);
                    }

                    rez = identical_elems(items);
                    if (matrix[j * GAME.COLUMNS + i + (GAME.NR_CONNECT - 1) * (GAME.COLUMNS - 1)] !== GAME.TIE) {
                        rez = false;
                    }
                }
            }
        }
    }
    console.log(rez)
    return rez;
}

const final = (matrix) => {
    var rez = false;

    // orizontala
    for (let i = 0; i < GAME.ROWS; i++) {
        for (let j = 0; j < (GAME.COLUMNS - GAME.NR_CONNECT + 1); j++) {
            if (!rez) {
                rez = identical_elems(matrix.slice(i * GAME.COLUMNS + j, i * GAME.COLUMNS + j + GAME.NR_CONNECT))
            }
        }
    }

    // verticala
    if (rez) {
        for (let i = 0; i < GAME.COLUMNS; i++) {
            for (let j = 0; j < (GAME.ROWS - GAME.NR_CONNECT + 1); j++) {
                if (!rez) {
                    let items = [];
                    for (let k = j * GAME.COLUMNS + i; k < j * GAME.COLUMNS + i + GAME.NR_CONNECT * GAME.COLUMNS; k += GAME.COLUMNS) {
                        items.push(matrix[k]);
                    }
    
                    rez = identical_elems(items);
                }
            }
        }
    }

    // diagonala st-dr
    if (rez) {
        for (let i = 0; i < (GAME.COLUMNS - GAME.NR_CONNECT + 1); i++) {
            for (let j = 0; j < (GAME.ROWS - GAME.NR_CONNECT + 1); j++) {
                if (!rez) {
                    let items = [];
                    for (let k = j * GAME.COLUMNS + i; k < j * GAME.COLUMNS + i + GAME.NR_CONNECT * GAME.COLUMNS; k += (GAME.COLUMNS + 1)) {
                        items.push(matrix[k]);
                    }

                    rez = identical_elems(items);
                }
            }
        }
    }

    // diagonala dr-st
    if (rez) {
        for (let i = GAME.COLUMNS - 1; i > (GAME.COLUMNS - GAME.NR_CONNECT); i--) {
            for (let j = 0; j < (GAME.ROWS - GAME.NR_CONNECT + 1); j++) {
                if (!rez) {
                    let items = [];
                    for (let k = j * GAME.COLUMNS + i; k < j * GAME.COLUMNS + i + GAME.NR_CONNECT * (GAME.COLUMNS - 1); k += (GAME.COLUMNS - 1)) {
                        items.push(matrix[k]);
                    }

                    rez = identical_elems(items);
                }
            }
        }
    }
    

    if (rez === false && !is_in_matrix(matrix, GAME.EMPTY)) {
        return GAME.TIE;
    }

    return false;
}

const possible_moves = (matrix, player) => {
    var moves = [];

    for (let i = 0; i < GAME.COLUMNS; i++) {
        for (let j = GAME.ROWS - 1; j > -1; j--) {
            if (matrix[j * GAME.COLUMNS + i] === GAME.EMPTY) {
                let matrix_copy = matrix.slice();
                matrix_copy[j * GAME.COLUMNS + i] = player;

                moves.push(matrix_copy);
                break;
            }
        }
    }
    return moves;
}

const open_intervals = (matrix, player) => {
    let rez = 0;
    let opponent = player === GAME.SYMBOLS[0] ? GAME.SYMBOLS[1] : GAME.SYMBOLS[0];

    // orizontala
    for (let i = 0; i < GAME.ROWS; i++) {
        for (let j = 0; j < (GAME.COLUMNS - GAME.NR_CONNECT + 1); j++) {
            let verify = new Set(matrix.slice(i * GAME.COLUMNS + j, i * GAME.COLUMNS + j + GAME.NR_CONNECT));
            if (verify.size <= 2) {
                if (!verify.has(opponent)) { 
                    rez += 1;      
                }
            } 
        }
    }
            
    // verticala
    for (let i = 0; i < GAME.COLUMNS; i++) {
        for (let j = 0; j < (GAME.ROWS - GAME.NR_CONNECT + 1); j++) {
            let items = [];
            for (let k = j * GAME.COLUMNS + i; k < j * GAME.COLUMNS + i + GAME.NR_CONNECT * GAME.COLUMNS; k += GAME.COLUMNS) {
                items.push(matrix[k]);
            }
            let verify = new Set(items);
            if (verify.size <= 2) {
                if (!verify.has(opponent)) { 
                    rez += 1;      
                }
            }
        }
    }

    // diagonala st-dr
    for (let i = 0; i < (GAME.COLUMNS - GAME.NR_CONNECT + 1); i++) {
        for (let j = 0; j < (GAME.ROWS - GAME.NR_CONNECT + 1); j++) {
            let items = [];
            for (let k = j * GAME.COLUMNS + i; k < j * GAME.COLUMNS + i + GAME.NR_CONNECT * GAME.COLUMNS; k += (GAME.COLUMNS + 1)) {
                items.push(matrix[k]);
            }
            let verify = new Set(items);
            if (verify.size <= 2) {
                if (!verify.has(opponent)) { 
                    rez += 1;      
                }
            }
        }
    }

    // diagonala dr-st
    for (let i = GAME.COLUMNS - 1; i > (GAME.COLUMNS - GAME.NR_CONNECT); i--) {
        for (let j = 0; j < (GAME.ROWS - GAME.NR_CONNECT + 1); j++) {
            let items = [];
            for (let k = j * GAME.COLUMNS + i; k < j * GAME.COLUMNS + i + GAME.NR_CONNECT * (GAME.COLUMNS - 1); k += (GAME.COLUMNS - 1)) {
                items.push(matrix[k]);
            }
            let verify = new Set(items);
            if (verify.size <= 2) {
                if (!verify.has(opponent)) { 
                    rez += 1;      
                }
            }
        }
    }

    return rez;
}

const heuristic = (matrix, jmin, jmax) => {
    var player = open_intervals(matrix, jmax);
    var opponent = open_intervals(matrix, jmin);

    if (player === opponent) {
        if (jmin === GAME.SYMBOLS[0]) {
            return -1;
        } else {
            return 0.3;
        }
    } else {
        // console.log("interv", player - opponent);
        return player - opponent;
    }
}

const estimate_score = (matrix, jmin, jmax, depth) => {
    var t_final = final(matrix);
    // console.log("final", t_final);
    if (t_final === jmax) {
        return (999 + depth);
    } else if (t_final === jmin) {
        return (-999 - depth);
    } else if (t_final === GAME.TIE) {
        return 0;
    } else {
        var t_intermediar = intermediate(matrix);
        // console.log("interm", t_intermediar);
        if (t_intermediar === jmax) {
            return (799 + depth);
        } else if (t_intermediar === jmin) {
            return (-799 - depth);
        } else {
            return heuristic(matrix, jmin, jmax);
        }
    }
}

module.exports = {
    is_in_matrix,
    identical_elems,
    intermediate,
    final,
    possible_moves,
    estimate_score
}