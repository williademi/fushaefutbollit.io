// Select DOM elements
const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const listEl = document.getElementById('list');
const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');

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
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balanceEl.innerHTML = `$${total}`;
    moneyPlusEl.innerHTML = `+$${income}`;
    moneyMinusEl.innerHTML = `-$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    init();
}

// Update the local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to save data locally
function saveLocally() {
    // Convert transactions array to JSON string
    const transactionsJSON = JSON.stringify(transactions);

    // Save the JSON string to local storage
    localStorage.setItem('transactions', transactionsJSON);

    // Optionally, provide feedback to the user that data is saved
    alert('Data saved locally!');
}

// Init app
function init() {
    // Clear the list
    listEl.innerHTML = '';

    // Get transactions from local storage
    const transactionsJSON = localStorage.getItem('transactions');

    // If there are transactions in local storage, parse and assign them to the transactions array
    if (transactionsJSON) {
        transactions = JSON.parse(transactionsJSON);
    }

    // Add transactions to the DOM
    transactions.forEach(addTransactionDOM);

    // Update balance, income, and expense
    updateValues();
}

// Event listeners
form.addEventListener('submit', addTransaction);

init();

// Select the save button
const saveButton = document.querySelector('.btnSave');

// Add event listener to the save button
saveButton.addEventListener('click', saveLocally);

