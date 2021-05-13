// init empty matrix, curr_player, depth, score, poss_moves, chosen_state (null)
const { possible_moves } = require('./game');

const opposite_player = (curr_player, jmin, jmax) => {
    if (curr_player === jmin) {
        return jmax;
    }

    return jmin;
}

const moves = (matrix, curr_player, jmin, jmax, depth) => {
    var next_moves = [];

    var poss_moves = possible_moves(matrix, curr_player);
    var opponent = opposite_player(curr_player, jmin, jmax);

    for (move in poss_moves) {
        next_moves.push({move: poss_moves[move], player: opponent, depth: depth - 1});
    }

    return next_moves;
}

module.exports = {
    opposite_player,
    moves
}