let balance = 1;
let multiplier = 1.00;
let gameRunning = false;
let interval;
let gameHistory = [];
const maxHistory = 5;

const balanceDisplay = document.getElementById('balance');
const multiplierDisplay = document.getElementById('multiplier');
const startButton = document.getElementById('start-btn');
const cashoutButton = document.getElementById('cashout-btn');
const resultDisplay = document.getElementById('result');
const betInput = document.getElementById('bet-input');
const depositInput = document.getElementById('deposit-input');
const withdrawInput = document.getElementById('withdraw-input');
const depositButton = document.getElementById('deposit-btn');
const withdrawButton = document.getElementById('withdraw-btn');
const bankingResultDisplay = document.getElementById('banking-result');
const historyTable = document.getElementById('history-table');
const messageDisplay = document.getElementById('message');
const planeElement = document.querySelector('.plane');
const depositModal = document.getElementById('deposit-modal');
const withdrawModal = document.getElementById('withdraw-modal');
const closeDepositModalButton = document.getElementById('close-deposit-modal');
const closeWithdrawModalButton = document.getElementById('close-withdraw-modal');
const confirmWithdrawButton = document.getElementById('confirm-withdraw-btn');

// Function to update balance
function updateBalance() {
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
}

// Function to start a new game
startButton.addEventListener('click', () => {
  if (gameRunning) return;

  const betAmount = parseFloat(betInput.value);

  if (betAmount > balance) {
    showMessage('error', 'You do not have enough balance to start the game.');
    return;
  }

  balance -= betAmount;
  updateBalance();
  gameRunning = true;
  cashoutButton.disabled = false;

  interval = setInterval(() => {
    multiplier += 0.01;
    multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;

    if (multiplier >= 2) {
      endGame('win', betAmount);
    }
  }, 100);

  resultDisplay.textContent = '';
  messageDisplay.style.display = 'none';
  startButton.disabled = true;
});

// Function to cash out
cashoutButton.addEventListener('click', () => {
  if (!gameRunning) return;
  endGame('cashout', parseFloat(betInput.value));
});

// End the game and update results
function endGame(result, betAmount) {
  gameRunning = false;
  clearInterval(interval);
  startButton.disabled = false;
  cashoutButton.disabled = true;

  let winAmount = 0;
  if (result === 'win') {
    winAmount = betAmount * multiplier;
    balance += winAmount;
    showMessage('success', `You win $${winAmount.toFixed(2)}!`);
  } else if (result === 'cashout') {
    winAmount = betAmount * multiplier;
    balance += winAmount;
    showMessage('success', `You cashed out at ${multiplier.toFixed(2)}x. You win $${winAmount.toFixed(2)}!`);
  }

  updateBalance();
  addGameHistory(betAmount, multiplier, result);
}

// Function to show message
function showMessage(type, message) {
  messageDisplay.textContent = message;
  messageDisplay.className = type;
  messageDisplay.style.display = 'block';
}

// Function to update game history
function addGameHistory(betAmount, multiplier, result) {
  if (gameHistory.length >= maxHistory) {
    gameHistory.shift();
  }

  const gameResult = result === 'win' ? 'Win' : result === 'cashout' ? 'Cash Out' : 'Loss';
  gameHistory.push({ bet: betAmount, multiplier: multiplier.toFixed(2), result: gameResult });

  updateHistoryTable();
}

// Function to update the game history table
function updateHistoryTable() {
  historyTable.innerHTML = '';
  gameHistory.forEach((game, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${index + 1}</td><td>$${game.bet}</td><td>${game.multiplier}x</td><td>${game.result}</td>`;
    historyTable.appendChild(row);
  });
}

// Deposit and Withdraw Functions

depositButton.addEventListener('click', () => {
  const depositAmount = parseFloat(depositInput.value);
  if (depositAmount < 10) {
    bankingResultDisplay.textContent = 'Deposit amount must be at least $10.';
    bankingResultDisplay.style.color = 'red';
    return;
  }

  balance += depositAmount;
  updateBalance();
  bankingResultDisplay.textContent = `You deposited $${depositAmount.toFixed(2)}.`;
  bankingResultDisplay.style.color = 'green';
});

withdrawButton.addEventListener('click', () => {
  const withdrawAmount = parseFloat(withdrawInput.value);
  if (withdrawAmount < 10) {
    bankingResultDisplay.textContent = 'Withdraw amount must be at least $10.';
    bankingResultDisplay.style.color = 'red';
    return;
  }

  if (withdrawAmount > balance) {
    bankingResultDisplay.textContent = 'Insufficient balance for withdrawal.';
    bankingResultDisplay.style.color = 'red';
    return;
  }

  balance -= withdrawAmount;
  updateBalance();
  bankingResultDisplay.textContent = `You withdrew $${withdrawAmount.toFixed(2)}.`;
  bankingResultDisplay.style.color = 'green';
});

// Deposit and Withdraw Modals
function toggleModal(modal) {
  modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
}

closeDepositModalButton.addEventListener('click', () => toggleModal(depositModal));
closeWithdrawModalButton.addEventListener('click', () => toggleModal(withdrawModal));

// Add event listeners for opening modals
document.getElementById('deposit-btn').addEventListener('click', () => toggleModal(depositModal));
document.getElementById('withdraw-btn').addEventListener('click', () => toggleModal(withdrawModal));

