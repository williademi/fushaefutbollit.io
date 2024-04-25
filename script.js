
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
  balanceList.innerHTML = ''; // Clear the balance per date list

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

  // Load balance per date from local storage
  loadBalancePerDate();
}

// Event listeners
form.addEventListener('submit', addTransaction);

init();

// Select the save button
const saveButton = document.querySelector('.btnSave');

// Add event listener to the save button
saveButton.addEventListener('click', saveLocally);

// Select the delete button
const deleteButton = document.querySelector('.btnDelete');

// Add event listener to the delete button
deleteButton.addEventListener('click', function(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Clear the transactions array
  transactions = [];

  // Clear the list by setting innerHTML to an empty string
  listEl.innerHTML = '';

  // Update the balance, income, and expense
  updateValues();

  // Update local storage
  updateLocalStorage();
});

// Function to save balance per date
function saveBalancePerDate() {
  // Get the current date
  const currentDate = new Date().toLocaleDateString();

  // Get the total balance
  const totalBalance = parseFloat(balanceEl.textContent.replace('$', ''));

  // Create an object with date and balance
  const balanceData = {
    date: currentDate,
    balance: totalBalance
  };

  // Get existing balance per date data from local storage
  let balanceDataList = JSON.parse(localStorage.getItem('balanceData')) || [];

  // Append the new balance data to the existing list
  balanceDataList.push(balanceData);

  // Save the updated balance per date data to local storage
  localStorage.setItem('balanceData', JSON.stringify(balanceDataList));

  // Append the balance data to the list on the page
  const listItem = document.createElement('li');
  listItem.textContent = `Date: ${balanceData.date}, Balance: $${balanceData.balance.toFixed(2)}`;
  balanceList.appendChild(listItem);
}

// Add event listener to the button for saving balance per date
const saveBalanceButton = document.querySelector('.btnSaveBalance');
saveBalanceButton.addEventListener('click', function(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Save balance per date
  saveBalancePerDate();
});

// Function to load balance per date from local storage
function loadBalancePerDate() {
  // Get balance data from local storage
  const balanceDataJSON = localStorage.getItem('balanceData');

  // If there's balance data in local storage, parse and display it
  if (balanceDataJSON) {
    const balanceDataList = JSON.parse(balanceDataJSON);
    balanceDataList.forEach(data => {
      const listItem = document.createElement('li');
      listItem.textContent = `Date: ${data.date}, Balance: $${data.balance.toFixed(2)}`;
      balanceList.appendChild(listItem);
    });
  }
}
// Select the delete last balance date button
const deleteLastBalanceButton = document.querySelector('.btnDeleteBalance');

// Add event listener to the delete last balance date button
deleteLastBalanceButton.addEventListener('click', function(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the balance per date list
  const balanceList = document.getElementById('balanceList');

  // Get the balance data from local storage
  let balanceDataList = JSON.parse(localStorage.getItem('balanceData')) || [];

  // Check if there are items in the balance per date list
  if (balanceDataList.length > 0) {
    // Remove the last item from the balance per date list
    balanceDataList.pop();

    // Remove the last item from the balance per date list in the DOM
    balanceList.removeChild(balanceList.lastElementChild);

    // Update the balance per date data in local storage
    localStorage.setItem('balanceData', JSON.stringify(balanceDataList));
  } else {
    // If the balance per date list is empty, show an alert
    alert('There are no balance dates to delete.');
  }
});


// Function to export expense data to CSV
function exportToCSV() {
  let csvContent = "Date,Category,Amount\n";
  transactions.forEach(transaction => {
      csvContent += `${transaction.date},${transaction.text},${transaction.amount}\n`;
  });
  let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", "expenses.csv");
  document.body.appendChild(link);
  link.click();
}

// Attach event listener to export button
document.getElementById("exportButton").addEventListener("click", exportToCSV);

// Function to import expense data from CSV
function importFromCSV() {
  let file = document.getElementById("importInput").files[0];
  if (file) {
      let reader = new FileReader();
      reader.onload = function(event) {
          let csvData = event.target.result;
          let lines = csvData.split("\n");
          lines.forEach(line => {
              let [date, text, amount] = line.split(",");
              transactions.push({ date, text, amount: parseFloat(amount) });
          });
          updateUI();
      };
      reader.readAsText(file);
  }
}

// Attach event listener to import button
document.getElementById("importButton").addEventListener("click", importFromCSV);
