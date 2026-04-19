'use strict';

// Selecting Elements
let score0El = document.getElementById('score--0');
let score1El = document.querySelector('#score--1');
let diceEl = document.querySelector('.dice');
let btnNew = document.querySelector('.btn--new');
let btnRoll = document.querySelector('.btn--roll');
let btnHold = document.querySelector('.btn--hold');
let current0El = document.getElementById('current--0');
let current1El = document.getElementById('current--1');
let activeP = document.querySelector('.player--active');
let player0El = document.querySelector('.player--0');
let player1El = document.querySelector('.player--1');

// Starting Conditions
let playing, activePlayer, currentScore, scores;
let init = function () {
  playing = true;
  activePlayer = 0;
  currentScore = 0;
  scores = [0, 0];
  current0El.textContent = 0;
  current1El.textContent = 0;
  score0El.textContent = 0;
  score1El.textContent = 0;
  diceEl.classList.add('hidden');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
};
init();

let switchPlayer = function () {
  // If the dice === 1
  // 1. Make the active player currentscore zero
  currentScore = 0;
  document.querySelector(`#current--${activePlayer}`).textContent =
    currentScore;
  //2. Switch Player and set active player to 0 and 1 respectively
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};
document.querySelector('.btn--roll').addEventListener('click', function () {
  // init();

  if (playing) {
    // Generate the dice
    const dice = Math.trunc(Math.random() * 6) + 1;
    // Unhide the dice and show dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    if (dice !== 1) {
      // Add the dice to the current score of the player
      currentScore += dice;
      document.querySelector(`#current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer();
    }
  }
});

// Adding hold functionality
btnHold.addEventListener('click', function () {
  if (playing) {
    // 1. add current score to the scores array: scores array stored the total score of player. [0,0]
    document.querySelector(`#score--${activePlayer}`).textContent =
      +document.querySelector(`#score--${activePlayer}`).textContent +
      currentScore;
    scores[activePlayer] += currentScore;
    console.log(scores);
    // 2. Check if the player score is greater than 100.
    if (scores[activePlayer] >= 100) {
      playing = false;
      diceEl.classList.add('hidden');

      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
      // Instead of disabling the btn and roll button we can use state variable if the variable is true then we will roll the dice and can hold otherwise not.
      // btnHold.disabled = true;
      // btnRoll.disabled = true;
    } else {
      // 3. Switch Player
      switchPlayer();
    }
  }
});

btnNew.addEventListener('click', init);
