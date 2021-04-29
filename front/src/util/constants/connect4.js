export const PLAYERS = {
    X: 'X',
    O: 'O'
};

export const NAME = 'Connect Four';

export const INSTRUCTIONS = {
    RULES: 'Before starting, players decide randomly which of them will be the beginner; moves are made alternatively, one by turn. Moves entails in placing new pieces on the board; pieces slide downwards from upper holes, falling down to the last row or piling up on the last piece introduced in the same column. So, in every turn the introduced piece may be placed at most on seven different squares.The winner is the first player who gets a straight line made with four own pieces and no gaps between them.',
    STEP: 'Choose a column between 1 and 7.',
    ERROR_INVALID: 'Please introduce a number between 1 and 7.',
    ERROR_FULL: 'This column is already full. Choose another one, please.'
}

export const RESULT = {
    TIE: 'It\'s a tie!',
    WIN: 'You win!',
    LOSE: 'You lose!'
}