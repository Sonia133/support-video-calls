const { final, estimate_score, identical_elems, is_in_matrix } = require("./game");
const { opposite_player, moves } = require("./state");
const { GAME } = require("../../constants/connect4/game"); 

const alpha_beta = (alpha, beta, state, jmin, jmax) => {
    if (state.depth === 0 || final(state.move)) {
        state.score = estimate_score(state.move, jmin, jmax, state.depth);
        // console.log("depth", state.score);
        return state;
    }

    if (alpha >= beta) {
        return state;
    }

    state.possible_moves = moves(state.move, state.player, jmin, jmax, state.depth);

    if (state.player === jmax) {
        var curr_score = -Infinity;

        for (move in state.possible_moves) {
            var new_state = alpha_beta(alpha, beta, state.possible_moves[move], jmin, jmax)

            if (curr_score < new_state.score) {
                state.chosen_state = new_state;
                curr_score = new_state.score;
            }
            if (alpha < new_state.score) {
                alpha = new_state.score;
                if (alpha >= beta) {
                    break;
                }
            }
        }

    } else if (state.player === jmin) {
        var curr_score = Infinity;

        for (move in state.possible_moves) {
            var new_state = alpha_beta(alpha, beta, state.possible_moves[move], jmin, jmax)

            if (curr_score > new_state.score) {
                state.chosen_state = new_state;
                curr_score = new_state.score;
            }

            if (beta > new_state.score) {
                beta = new_state.score;
                if (alpha >= beta) {
                    break;
                }
            }
        }
    }

    state.score = state.chosen_state.score;

    return state;
}

const check_if_final = (state, position) => {
    new_table = state;

    row = Math.floor(position / GAME.COLUMNS); 
    column = position - (row * GAME.COLUMNS);
    console.log(position)
    console.log(row)
    console.log(column)

    // sus
    if (row - (GAME.NR_CONNECT - 1) >= 0) {
        let items = [];
        for (let i = position - (GAME.COLUMNS * (GAME.NR_CONNECT - 1)); i < position + 1; i += GAME.COLUMNS) {
            items.push(new_table[i]);
        }

        rez = identical_elems(items);
        if (rez) {
            console.log("A castigat " + rez);
            return true;
        }
    }

    // sus dreapta
    if ((row - (GAME.NR_CONNECT - 1) >= 0) && (column + (GAME.NR_CONNECT - 1) < GAME.COLUMN)) {
        let items = [];
        for (let i = position - ((GAME.COLUMNS - 1) * (GAME.NR_CONNECT - 1)); i < position + 1; i += (GAME.COLUMNS - 1)) {
            items.push(new_table[i]);
        }

        rez = identical_elems(items);
        
        if (rez) {
            console.log("A castigat " + rez);
            return true;
        }
    }

    // dreapta
    if (column + (GAME.NR_CONNECT - 1) < GAME.COLUMNS) {
        let rez = identical_elems(new_table.slice(position, position + 4));
        if (rez) {
            console.log("A castigat " + rez);
            return true;
        }
    }

    // dreapta jos
    if ((column + (GAME.NR_CONNECT - 1) < GAME.COLUMNS) && (row + (GAME.NR_CONNECT - 1) < GAME.ROWS)) {
        let items = [];
        for (let i = position; i < position + ((GAME.COLUMNS + 1) * (GAME.NR_CONNECT - 1)) + 1; i += (GAME.COLUMNS + 1)) {
            items.push(new_table[i]);
        }

        rez = identical_elems(items);
        if (rez) {
            console.log("A castigat " + rez);
            return true;
        }
    }

    // jos
    if (row + (GAME.NR_CONNECT - 1) < GAME.ROWS) {
        let items = [];
        for (let i = position; i < position + (GAME.COLUMNS * (GAME.NR_CONNECT - 1)) + 1; i += GAME.COLUMNS) {
            items.push(new_table[i]);
        }

        rez = identical_elems(items);
        if (rez) {
            console.log("A castigat " + rez);
            return true;
        }
    }

    // jos stanga
    if ((row + (GAME.NR_CONNECT - 1) < GAME.ROWS) && (column >= (GAME.NR_CONNECT - 1))) {
        let items = [];
        for (let i = position; i < position + ((GAME.COLUMNS - 1) * (GAME.NR_CONNECT - 1)) + 1; i += (GAME.COLUMNS - 1)) {
            items.push(new_table[i]);
        }

        rez = identical_elems(items);
        if (rez) {
            console.log("A castigat " + rez);
            return true;
        }
    }

    // stanga
    if (column >= (GAME.NR_CONNECT - 1)) {
        console.log('q')
        let rez = identical_elems(new_table.slice(position - 3, position + 1));
        console.log(rez)
        if (rez) {
            console.log("A castigat " + rez);
            return true;
        }
    }

    // stanga sus
    if ((column - (GAME.COLUMNS - 1) >= 0) && (row - (GAME.NR_CONNECT - 1) >= 0)) {
        let items = [];
        for (let i = position - ((GAME.COLUMN + 1) * (GAME.NR_CONNECT - 1)); i < position + 1; i += (GAME.COLUMNS + 1)) {
            items.push(new_table[i]);
        }

        rez = identical_elems(items);
        if (rez) {
            console.log("A castigat " + rez);
            return true;
        }
    }

    if (!is_in_matrix(new_table, GAME.EMPTY)) {
        console.log("Remiza")
        return true;
    }

    return false; 
}

// create game
const initiate = (jmin) => {
    // initiate jmin, jmax and matrix
    // jmin is player
    jmax = jmin === GAME.SYMBOLS[0] ? GAME.SYMBOLS[1] : GAME.SYMBOLS[0];

    // initiate table
    var curr_table = []
    for (let i = 0; i < GAME.COLUMNS * GAME.ROWS; i++) {
        curr_table.push(GAME.EMPTY);
    }

    console.log("Tabla initiala");
    console.log(curr_table);

    // initiate state
    var curr_state = {move: curr_table, player: GAME.SYMBOLS[0], depth: GAME.DEPTH}

    return curr_state;
}

// update game
const play = (row, column, curr_state, jmin, jmax) => {
    var final = 0;

    if (curr_state.player === jmin) {
        var position = row * GAME.COLUMNS + column;
        curr_state.move[position] = jmin;

        // console.log("\nTabla dupa mutarea jucatorului");
        // console.log(curr_state.move);

        if (check_if_final(curr_state.move, position)) {
            console.log('here1')
            final = 1;
        }

        curr_state.player = opposite_player(curr_state.player, jmin, jmax);
    } else {  // calculatorul e JMAX 
        var updated_state = alpha_beta(-5000, 5000, curr_state, jmin, jmax);
        for (let i = 0; i < (GAME.ROWS * GAME.COLUMNS); i++) {
            if (curr_state.move[i] != updated_state.chosen_state.move[i]) {
                position = i;
                break;
            }
        }

        curr_state.move = updated_state.chosen_state.move;
        // console.log("Tabla dupa mutarea calculatorului");
        // console.log(curr_state.move);

        if (check_if_final(curr_state.move, position)) {
            console.log('here2')
            final = 1;
        }

        curr_state.player = opposite_player(curr_state.player, jmin, jmax);
    }

    return [final, curr_state];
}

module.exports = {
    initiate,
    play
}