const balanceAmount = document.getElementById('balance-amount');
const incomeAmount = document.getElementById('income-amount');
const expenseAmount = document.getElementById('expense-amount');
const transactionList = document.getElementById('transaction-list');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const form = document.getElementById('transaction-form');

let transactions = [];

// Function to add a new transaction
function addTransaction(e) {
  e.preventDefault();
  
  const text = textInput.value.trim();
  const amount = +amountInput.value.trim();

  if (text === '' || isNaN(amount)) {
    alert('Please provide valid transaction details.');
    return;
  }

  const transaction = {
    id: generateID(),
    text,
    amount
  };

  transactions.push(transaction);
  updateLocalStorage();

  addTransactionToList(transaction);
  updateValues();

  textInput.value = '';
  amountInput.value = '';
}

// Generate random ID for transactions
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Add transaction to the list in the DOM
function addTransactionToList(transaction) {
  const li = document.createElement('li');
  li.classList.add(transaction.amount > 0 ? 'plus' : 'minus');
  li.innerHTML = `
    ${transaction.text} 
    <span>${transaction.amount > 0 ? '+' : '-'}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  transactionList.appendChild(li);
}

// Update the balance, income, and expense amounts
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  balanceAmount.innerText = `$${total}`;
  incomeAmount.innerText = `+$${income}`;
  expenseAmount.innerText = `-$${Math.abs(expense)}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Store transactions in localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app
function init() {
  transactionList.innerHTML = '';
  transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions.forEach(addTransactionToList);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
