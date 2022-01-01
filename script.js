'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterBegin', html)
    
  });

}


const calcDisplayBalance = function(account) {
  const balance = account.movements.reduce((acc,mov) => acc + mov, 0);
  account.balance = balance;
  labelBalance.textContent = `${account.balance}€`;
};


// const user = 'Steven Thomas Williams'; //stw

const calcDisplaySummary = function(acc) {
  const incoming = acc.movements.filter(mov => mov>0).reduce((acc,mov) => acc+mov,0);
  labelSumIn.textContent = `${incoming}€`;

  const outgoing = acc.movements.filter(mov => mov<0).reduce((acc,mov) => acc+Math.abs(mov),0);
  labelSumOut.textContent = `${Math.abs(outgoing)}€`;

  const interest = acc.movements
  .filter(mov => mov>0)
  .map(mov => mov* acc.interestRate / 100)
  .filter((mov,i,arr) =>
  {
    // console.log(arr);
     return mov>=1})
  .reduce((acc, mov)=> acc+mov,0);
  labelSumInterest.textContent = `${interest}`;
}



const createUsername = function(accs) {
  
  accs.forEach(function(acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map( name => name[0]).join('');
  })
  
}

createUsername(accounts);

let currentAccount;

const updateUI = function(acc) {
  //DISPLAY MOVEMENTS
  displayMovements(acc.movements);
      
  //DISPLAY BALANCE
  calcDisplayBalance(acc);

  //DISPLAY SUMMARY
  calcDisplaySummary(acc);
}


//EVENT HANDLERS
btnLogin.addEventListener('click', function(e) {
  //prevent form from submitting
  e.preventDefault();
  // console.log(`LOGIN`);
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);
  
  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    
    
    //DISPLAY UI AND MESSAGE
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`;
    

    //CLEAR INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
})


btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('key pressed');
  console.log(e);

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(acc => acc.username ===  inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc?.username !== currentAccount.username) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
    
  }

  

})


btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  
  const amount = Number(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov >= (amount * 0.1)) ) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  // console.log('Delete');
  
  if(Number(inputClosePin.value) === currentAccount.pin && inputCloseUsername.value === currentAccount.username) {
    
    const index = accounts.findIndex( acc => acc.username === currentAccount.username)
    
    //delete account
    accounts.splice(index, 1);
    
    
    console.log('account deleted');
    
    //hide UI 
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
  labelWelcome.textContent = 'Log in to get started';
})

let sorted = false;

btnSort.addEventListener('click', function(e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;

})

// console.log(containerMovements.innerHTML);


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// arrays are objects themselves and hence have methods on them which are called tools

// let arr = ['a', 'b', 'c', 'd', 'e'];

// slice method
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4)); //4 is not included so elements are just 2,3.
// console.log(arr.slice(-2)); //to get the last element of an array.
// console.log(arr.slice(1, -1));
// console.log(arr.slice());
// console.log([...arr]);

// splice method (it mutates the original array).
// console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2); //second parameter is the number of elements to be deleted after the given index.
// console.log(arr);

//reverse
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse()); //this does mutates the original array.
// console.log(arr2);

//concat
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

//join
// console.log(letters.join(' - '));

////////////////////////////////////////////////////////

//at
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

//getting the last element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('sahil'.at(0));

//forEach method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log(`---------forEach------------`); //continue and break donot work on forEach loop.
// movements.forEach(function (mov, i, arr) {  //forEach method passes the element, index and the entire array , also the 
//   //first element is the element itself and the second is the index unlike a for of loop.
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });

// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsJulia = [9, 16, 6, 8, 3];
// const dogsKate = [10, 5, 6, 1, 4];

// const checkDogs = function(dogsJulia, dogsKate) {
//   const shallowCopyJulia = dogsJulia.slice(1,-2);
//   const dogs = [...shallowCopyJulia,...dogsKate]; // OR shallowCopyJulia.concat(dogsKate);

//   dogs.forEach(function(dog, i) {
//     const type = dog > 4 ? 'an adult' : 'still a puppy 🐶';
    
//     return dog > 4 ? console.log(`Dog number ${i+1} is ${type}, and is ${dog} years old`) : console.log(`Dog number ${i+1} is ${type}`);

//   });

// }

// checkDogs(dogsJulia,dogsKate);
///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/



// const ages = [5, 2, 4, 1, 15, 8, 3];
// const calcAverageHumanAge = ages.map(age => age <= 2 ? age*2 : 16 + age*4).filter(age=> age >= 18).reduce((acc,age,i,arr)=>{return acc + age/arr.length},0);
// console.log(calcAverageHumanAge);



// const eurToUSD = 1.1;

// const movementsUSD = movements. (function(mov) {
//   return mov * eurToUSD;
// });

// OR 

// const movementsUSD = movements.map(mov => mov * eurToUSD);
 

// //     ---------------------    --------------------
// console.log(movements);
// console.log(movementsUSD);


// const movementUSDfor = [];
// for (const movement of movements) movementUSDfor.push(movement * eurToUSD);
// console.log(movementUSDfor);

// const movementsDescriptions = movements.map((mov,i)=> {

//   return `Movement ${i+1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`;

//   // if(mov>0) {
//   //   return `Movement ${i+1}: You deposited ${mov}`;

//   // } else {
//   //   return `Movement ${i+1}: You withdrew ${Math.abs(mov)}`;
//   // }
// })

// console.log(movementsDescriptions);

// // ---------------- filter ------------------

// const deposits = movements.filter(function(mov) {
//   return mov > 0;
// })
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter(mov => mov<0)
// console.log(withdrawals);

// // ------------------- reduce --------------------

// const balance = movements.reduce((acc, cur) =>//acc is like a snowball 
//  acc + cur

// , 100);

// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// // maximum value 
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov )
//   return acc;
//   else
//   return mov;
// }, movements[0]);
// console.log(max);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and 
calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things
 in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * 
dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 
  18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate 
  averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const ages = [16, 6, 10, 5, 6, 1, 4];

// let humanAge;

// const dogsAbove18 = dogAgeHumanYears.forEach(dog => {
//   if(dog<18) dogsAbove18.
// });

// const calcAverageHumanAge = function(ages) {
  
//   const dogAgeHumanYears = ages.map((age => (age <=2 ? 2 * age : 16+ (age*4))));
  
//   const dogsAbove18 = dogAgeHumanYears.filter(age=> age>=18);
//   // console.log(dogsAbove18);
  
//   // const avgAge = dogsAbove18.reduce((acc,cur) => (acc+cur),0)/dogsAbove18.length;

//   const avgAge = dogsAbove18.reduce((acc,cur, i, arr) => (acc+cur/arr.length),0);

//   return avgAge;
// };
// const avg1 = calcAverageHumanAge(ages);

// console.log(avg1);


// const eurToUsd = 1.1;
// const usdtoEur = 0.9;

// PIPELINE

// const totalDepositsUSD = movements.filter(mov => mov>0).map(mov => mov* eurToUSD).reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// const totalDepositsEUR = movements.filter(mov => mov>0).map(mov=> mov * usdtoEur).reduce((acc, mov) => acc+mov,0);
// console.log(totalDepositsEUR);
 
// ------------------find method-------------------
//this method returns an object and not an array like filter method.

// const firstWithdrawal = movements.find(mov => mov<0); 
// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// ---------------------- some -----------------------

// console.log(movements);
// //EQUALITY 

// console.log(movements.includes(-130));

// // SOME: CONDITION
// const someDeposits = movements.some(mov => mov > 0)
// console.log(someDeposits);

// // EVERY: CONDITION 
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// //seperate callback
// const deposit = mov => mov>0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// ---------------- flat -----------------

const arr = [[1,2,3],[4,5,6],7,8];
console.log(arr.flat());
console.log(arr);

const arrDeep = [[[1,2],3],[4,[5,6]],7,8];
console.log(arrDeep.flat()); //default argument is 1.
console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(mov => mov.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat()
// console.log(allMovements);

// const total = allMovements.reduce((acc, mov) => acc+mov,0);
// console.log(total);

//this is the same as above just chained.
const overallBalance = accounts.map(mov => mov.movements).flat().reduce((acc, mov) => acc+mov,0);

console.log(overallBalance);

// ------------------ flat map -----------------
// this method just goes one level deep 
const overallBalance2 = accounts.flatMap(mov => mov.movements).reduce((acc, mov) => acc+mov,0);
console.log(overallBalance2);



// -------------------- sort ----------------------

//strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners);
console.log(owners.sort());

//numbers
console.log(movements);
// console.log(movements.sort()); this doesnot works because javascript sorts only strings with this method...

//ascending
// const sortAsc = movements.sort((a,b) => {
//   if(a>b) return 1;
//   else return -1;

// });

//descending
// const sortDesc = movements.sort((a,b) => {
//   if(a<b) return 1;
//   else return -1;
// });

// ----------------------- OR ----------------------

const sortAsc = movements.sort((a,b) => a-b);
console.log(sortAsc);

const sortDesc = movements.sort((a,b) => b-a);
console.log(sortDesc);
