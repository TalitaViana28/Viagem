const transationsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form-gastos');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions'),
);
let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

const removeTransaction = (ID) => {
  transactions = transactions.filter((transation) => transation.id !== ID);
  updateLocalStorage();
  init();
};

const addTransactionInToDOM = (transaction) => {
  const operator = transaction.amount < 0 ? '-' : '+';
  const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement('li');

  li.classList.add(CSSClass);
  li.innerHTML = `
  ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}</span>
  <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
  x
  </button>
  `;
  transationsUl.prepend(li);
};

const getExpensives = (transationsAmounts) =>
  Math.abs(
    transationsAmounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0),
  ).toFixed(2);

const getIncome = (transationsAmounts) =>
  transationsAmounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

const getTotal = (transationsAmounts) =>
  transationsAmounts
    .reduce((accumalator, transaction) => accumalator + transaction, 0)
    .toFixed(2);

const updateBalanceValues = () => {
  const transationsAmounts = transactions.map(({ amount }) => amount);
  const total = getTotal(transationsAmounts);
  const income = getIncome(transationsAmounts);
  const expense = getExpensives(transationsAmounts);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
};

const init = () => {
  transationsUl.innerHTML = '';
  transactions.forEach(addTransactionInToDOM);
  updateBalanceValues();
};

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  });
};

const generateID = () => Math.round(Math.random() * 1000);

const cleanInputs = () => {
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
};
const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

  if (isSomeInputEmpty) {
    alert('Por favor, preencha tanto o nome quanto o valor da transação!');
    return;
  }

  addToTransactionsArray(transactionName, transactionAmount);
  init();
  updateLocalStorage();
  cleanInputs();
};

form.addEventListener('submit', handleFormSubmit);
