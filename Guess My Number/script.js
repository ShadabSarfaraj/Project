'use strict';
/*
let msgEle = document.querySelector('.message');
console.log(msgEle);
// console.log(msgEle.textContent);
msgEle.textContent = 'Hello';
console.log(msgEle.innerHTML);

document.querySelector('.number').textContent = 10;
document.querySelector('.score').textContent = 13;

console.log(document.querySelector('.guess').value);

document.querySelector('.guess').value = 31;*/
let score = 20;
let highscore = 0;
function getSecretNumber(num) {
  return Math.trunc(Math.random() * num) + 1;
}
let secretNumber = getSecretNumber(20);
// document.querySelector('.number').textContent = secretNumber;

function displayMessage(message) {
  document.querySelector('.message').textContent = message;
}

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess);
  // checking if the input is empty
  if (!guess) {
    // document.querySelector('.message').textContent = '❌ No number';
    displayMessage('❌ No number');
    // when the guess is correct
  } else if (guess === secretNumber) {
    // document.querySelector('.message').textContent = '🎉 Correct Number!';
    displayMessage('🎉 Correct Number!');

    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').textContent = secretNumber;

    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }
  } //when the guess is not equal to secret number and guess is greater than secret number
  else if (guess !== secretNumber) {
    if (score > 1) {
      //   document.querySelector('.message').textContent =
      //     guess > secretNumber ? '📈 Too High!' : '📉 Too Low!';
      displayMessage(guess > secretNumber ? '📈 Too High!' : '📉 Too Low!');

      score--;
      document.querySelector('.score').textContent = score;
    } else {
      //   document.querySelector('.message').textContent = '💥 You lost the game!';
      displayMessage('💥 You lost the game!');
      document.querySelector('.score').textContent = 0;
    }
  }
});

document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  secretNumber = getSecretNumber(20);
  document.querySelector('.guess').value = '';
  document.querySelector('body').style.backgroundColor = '#222';
  //   document.querySelector('.message').textContent = 'Start guessing...';
  displayMessage('Start guessing...');
  document.querySelector('.score').textContent = score;
  console.log(secretNumber);
  document.querySelector('.number').textContent = '?';
});
