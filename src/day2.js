const fs = require('fs');

const stream = fs.createReadStream('./input/day2.txt');

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;
const LOSE = 0;
const DRAW = 3;
const WIN = 6;

const enums = new Map([
  ['A', ROCK],
  ['B', PAPER],
  ['C', SCISSORS],
  ['X', LOSE],
  ['Y', DRAW],
  ['Z', WIN],
]);

function determineWinner(opponent, player) {
  if (opponent === player) {
    return DRAW;
  }

  if (player === ROCK) {
    if (opponent === PAPER) {
      return LOSE;
    }
    if (opponent === SCISSORS) {
      return WIN;
    }
  }
  if (player === PAPER) {
    if (opponent === SCISSORS) {
      return LOSE;
    }
    if (opponent === ROCK) {
      return WIN;
    }
  }
  if (player === SCISSORS) {
    if (opponent === ROCK) {
      return LOSE;
    }
    if (opponent === PAPER) {
      return WIN;
    }
  }
}

function determineSelection(opponent, player) {
  if (player === LOSE) {
    if (opponent === PAPER) {
      return ROCK;
    }
    if (opponent === SCISSORS) {
      return PAPER;
    }
    if (opponent === ROCK) {
      return SCISSORS;
    }
  }
  if (player === DRAW) {
    return opponent;
  }
  if (player === WIN) {
    if (opponent === PAPER) {
      return SCISSORS;
    }
    if (opponent === SCISSORS) {
      return ROCK;
    }
    if (opponent === ROCK) {
      return PAPER;
    }
  }
}

function main() {
  stream.on('data', data => {
    const chunk = data.toString();
    const split = chunk.split('\n');
    let points = 0;
    for (const e of split) {
      const [theirMove, ourMove] = e.split(' ');

      const opponent = enums.get(theirMove);
      const player = determineSelection(opponent, enums.get(ourMove));
      points = points + player + determineWinner(opponent, player);
    }

    console.log('points', points);

    return;
  });
  return 0;
}

main();
