// Select DOM elements
const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const listEl = document.getElementById('list');
const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const balanceList = document.getElementById('balanceList');

// Empty array to store the transactions
let transactions = [];

// Add transaction from the form input
function addTransaction(e) {
  e.preventDefault();

  if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const amount = parseFloat(amountInput.value); // Parse amount as float
    if (isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    const transaction = {
      id: generateID(),
      text: textInput.value,
      amount: amount
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();

    textInput.value = '';
    amountInput.value = '';
  }
}

// Generate random ID for each transaction
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  // Create list item for the transaction
  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

  listEl.appendChild(item);
}

// Update the balance, income, and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
