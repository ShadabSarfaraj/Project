"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2026-05-18T21:31:17.178Z",
    "2026-05-23T07:42:02.383Z",
    "2026-05-28T09:15:04.904Z",
    "2026-06-01T10:17:24.185Z",
    "2026-06-05T14:11:59.604Z",
    "2026-06-07T17:01:17.194Z",
    "2026-06-08T23:36:17.929Z",
    "2026-06-09T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2026-06-09T13:15:33.035Z",
    "2026-05-30T09:48:16.867Z",
    "2026-05-25T06:04:23.907Z",
    "2026-05-20T14:18:46.235Z",
    "2026-05-15T16:33:06.386Z",
    "2026-05-10T14:43:26.374Z",
    "2026-05-05T18:49:59.371Z",
    "2026-05-01T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const dateGen = new Date(date);

  const calcDaysPassed = (date1, date2) =>
    Math.abs(date2 - date1) / (24 * 60 * 60 * 1000);

  const daysPassed = Math.round(calcDaysPassed(new Date(), dateGen));

  if (daysPassed === 0) return `today`;
  if (daysPassed === 1) return `yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${dateGen.getDate()}`.padStart(2, "0");
  // const month = `${dateGen.getMonth() + 1}`.padStart(2, "0");
  // const year = dateGen.getFullYear();

  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const combinedMovements = acc.movements.map((mov, i) => ({
    movement: mov,
    movementsDate: acc.movementsDates.at(i),
  }));

  if (sort) {
    combinedMovements.sort((a, b) => a.movement - b.movement);
  }

  // const movs = sort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;

  combinedMovements.forEach(function (obj, i) {
    const { movement, movementsDate } = obj;
    const type = movement > 0 ? "deposit" : "withdrawal";
    const date = new Date(movementsDate);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(movement, acc.locale, acc.currency);
    // console.log(formattedMov);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
          i + 1
        } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${formatCur(acc.balance, acc.locale, acc.currency)}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    //In each call, print the remaining time to UI
    const minutes = String(Math.trunc(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, 0);
    const time = `${minutes}:${seconds}`;
    labelTimer.textContent = time;

    //Decrease time
    totalSeconds--;
    // When 0 stop timer and log out user
    if (time === "00:00") {
      clearInterval(timer);
      containerApp.style.opacity = 0;
    }
  };
  // Set time to 5 minute
  let totalSeconds = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  console.log(timer);
  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value,
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // We want to show the date into - day/month/year format.
    const options = {
      // weekday: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      month: "long",
      year: "numeric",
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options,
    ).format();

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);

    // Logout timer
    if (timer) {
      console.log("login", timer);
      clearInterval(timer);
    }
    timer = startLogOutTimer();
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value,
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  console.log(amount);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);

      // Add movement date
      const currentDate = new Date().toISOString();
      currentAccount.movementsDates.push(currentDate);

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username,
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// Number Conversion
// console.log(10 === 10.0);
// console.log(0.2 + 0.1);

// console.log(Number("23"));
// console.log(+"23");
// console.log(typeof +"23");

// console.log(23 / 0);

// console.log(Number.parseInt("23.5"));
// console.log(Number.parseInt("20px"));
// console.log(Number.parseInt("px20"));
// console.log(Number.parseInt("40.7px"));

// console.log(Number.parseFloat("20.7px"));
// console.log(Number.parseFloat("20.9"));
// console.log(Number.parseFloat("rem20.9"));

// console.log(isNaN("23px"));
// console.log(isNaN("Hi"));
// console.log(Number.isNaN(undefined));
// console.log(Number.isNaN(null));

// console.log(isNaN("Hello"));
// console.log(Number.isNaN("Hello"));

// console.log(Number.isFinite("Hello"));
// console.log(Number.isFinite("23"));
// console.log(Number.isFinite(23));
// console.log(Number.isFinite(+"20"));
// console.log(Number.isFinite(+"20X"));
// console.log(Number.isFinite(20 / 0));

// Math and Rounding
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(27 ** (1 / 3));

// console.log(Math.max(10, 20, 100, -450, 11));
// console.log(Math.max(10, 20, "23", 11));

// console.log(Math.min(11, 23, 9, 25, "1"));

// const arr = [1, 2, 3, 40, 50, 60, -1];
// console.log(Math.min(...arr));

// Remainder Operator
// const rem = 20 % 3;
// console.log(rem);

// // Numeric Seprator
// const num = 4_000_000;
// console.log(num);

// const numWithDecimal = 4.95_985_283;
// console.log(numWithDecimal);

// BigInt
// console.log(2 ** 53 - 1);
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(2 ** 53 + 4);
// console.log(2 ** 53 + 5);

// console.log(12345678901234567890123456789n);
// console.log(BigInt(12345678901234567890123456789));
// console.log(123456789123456789n);
// console.log(BigInt(123456789123456789));
// console.log(100n + BigInt(10));

// Creating Dates
// const now = new Date();
// console.log(now);

// const dateString = "2026-06-06";
// const date = new Date(dateString);
// console.log(date);

// console.log(new Date("June 06 2026"));

// console.log(new Date(2026, 5, 6));

// const date1 = new Date(2026, 5, 6, 20, 30, 45, 500);
// console.log(date1);

// console.log(new Date(2037, 10, 30));

// console.log(new Date(0));

// console.log(new Date(1000));

// console.log(new Date(4 * 24 * 60 * 60 * 1000));

// const now1 = new Date();

// console.log(now1.toISOString());

// const date = new Date();
// console.log(date.getFullYear());
// console.log(date.getDate());
// console.log(date.getMonth() + 1);
// console.log(date.getDay());
// console.log(date.getHours());
// console.log(date.getMinutes());
// console.log(date.getSeconds());
// console.log(date.getTime());
// console.log(date.toISOString());
// console.log(Date.now());
// const timestamp = Date.now();
// const today = new Date(timestamp);
// console.log(today);

// date to timestamp
// const future = new Date(2037, 4, 14);
// console.log(future);
// console.log(Number(future));
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (24 * 60 * 60 * 1000);

// console.log(calcDaysPassed(new Date(2037, 4, 4), new Date(2037, 4, 14)));

// Internationalizing Dates
// const num = 3884764.23;
// const options = {
//   style: "unit",
//   currency: "Eur",
//   unit: "celsius",
//   useGrouping: true,
// };
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options).format(num),
// );

// console.log("en-US", new Intl.NumberFormat("en-US", options).format(num));

// console.log("de-DE", new Intl.NumberFormat("de-DE", options).format(num));

// console.log("ar-SY", new Intl.NumberFormat("ar-SY", options).format(num));

// function greet() {
//   console.log("Hello");
// }
// setTimeout(greet, 10000);
// const ingredient = ["olives", "Garlic"];

// const pizzaTimer = setTimeout(
//   (ing1, ing2) =>
//     console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}.`),
//   5000,
//   ...ingredient,
// );

// if (ingredient.includes("spinach")) clearTimeout(pizzaTimer);

// const interval = setInterval(() => {
//   const date = new Date();
//   console.log(date);
// }, 1000);

// clearInterval(interval);

// const getTime = function () {
//   const nw = new Date();
//   const hour = nw.getHours();
//   const minute = nw.getMinutes();
//   const second = nw.getSeconds();
//   console.log(`${hour}:${minute}:${second}`);
// };
// setInterval(getTime, 1000);
