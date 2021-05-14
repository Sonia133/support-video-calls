const { db, socket } = require("../util/functions/admin");
const { COLLECTION } = require("../util/constants/constant");
const { initiate, play } = require("../util/functions/connect4/main");
const { GAME } = require("../util/constants/connect4/game");

exports.createGame = (req, res) => {
    const roomId = req.params.roomId;
    const player = req.body.jmin;

    let initialState = initiate(player);
    initialState.end = 0;
    initialState.jmin = player;
    initialState.jmax = player === GAME.SYMBOLS[0] ? GAME.SYMBOLS[1] : GAME.SYMBOLS[0];

    socket.ref(`/${COLLECTION.GAME}/${roomId}`)
        .set(initialState)
        .then(() => {
            res.status(200).json({ game: initialState });
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({ error: err.code });
        });
}

exports.playGame = (req, res) => {
    let roomId = req.params.roomId;
    let column = req.body.column;
    let row = req.body.row;

    let response;

    socket.ref(`/${COLLECTION.GAME}/${roomId}`)
        .once('value')
        .then((snapshot) => {
            if (!snapshot.exists) {
                return res.status(404).json({ error: 'Game not found!'} );
            }
    
            let [final, state] = play(row, column, snapshot.val(), snapshot.val().jmin, snapshot.val().jmax);
            state.end = final;

            if (state.chosen_state) {
                state.chosen_state.possible_moves = {};
                state.chosen_state.chosen_state = {};
            }
            state.possible_moves = {};

            response = state;
            socket.ref(`/${COLLECTION.GAME}/${roomId}`).update(state);
        })
        .then(() => {
            res.status(200).json({ game: response });
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({ error: err.code });
        });
}