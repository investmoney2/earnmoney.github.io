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
const depositModal = document.getElementById('deposit-modal');
const withdrawModal = document.getElementById('withdraw-modal');
const closeDepositModalButton = document.getElementById('close-deposit-modal');
const closeWithdrawModalButton = document.getElementById('close-withdraw-modal');
const confirmWithdrawButton = document.getElementById('confirm-withdraw-btn');

// Start button click event
startButton.addEventListener('click', () => {
  if (gameRunning) return;
  const betAmount = parseFloat(betInput.value);
  if (betAmount <= 0.2 || betAmount > balance) {
    messageDisplay.textContent = 'Invalid bet amount!';
    messageDisplay.className = 'error';
    messageDisplay.style.display = 'block';
    return;
  }
  gameRunning = true;
  cashoutButton.disabled = false;
  multiplier = 1.00;
  interval = setInterval(() => {
    multiplier += 0.01;
    multiplierDisplay.textContent = multiplier.toFixed(2) + 'x';
  }, 100);
  resultDisplay.textContent = '';
  messageDisplay.style.display = 'none';
});

// Cashout button click event
cashoutButton.addEventListener('click', () => {
  if (!gameRunning) return;
  gameRunning = false;
  clearInterval(interval);
  const betAmount = parseFloat(betInput.value);
  const winAmount = betAmount * multiplier;
  balance += winAmount - betAmount;
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
  gameHistory.unshift({
    bet: betAmount.toFixed(2),
    multiplier: multiplier.toFixed(2),
    result: winAmount.toFixed(2)
  });
  if (gameHistory.length > maxHistory) gameHistory.pop();
  updateHistory();
  cashoutButton.disabled = true;
  resultDisplay.textContent = `You cashed out at ${multiplier.toFixed(2)}x!`;
  messageDisplay.style.display = 'none';
});

// Update game history display
function updateHistory() {
  historyTable.innerHTML = '';
  gameHistory.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${index + 1}</td><td>$${entry.bet}</td><td>${entry.multiplier}x</td><td>$${entry.result}</td>`;
    historyTable.appendChild(row);
  });
}

// Deposit functionality
depositButton.addEventListener('click', () => {
  const depositAmount = parseFloat(depositInput.value);
  if (depositAmount <= 0) {
    bankingResultDisplay.textContent = 'Invalid deposit amount!';
    return;
  }
  balance += depositAmount;
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
  bankingResultDisplay.textContent = `Deposited: $${depositAmount.toFixed(2)}`;
});

// Withdraw functionality
withdrawButton.addEventListener('click', () => {
  const withdrawAmount = parseFloat(withdrawInput.value);
  if (withdrawAmount <= 0 || withdrawAmount > balance) {
    bankingResultDisplay.textContent = 'Invalid withdrawal amount!';
    return;
  }
  balance -= withdrawAmount;
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
  bankingResultDisplay.textContent = `Withdrawn: $${withdrawAmount.toFixed(2)}`;
});

// Show deposit address modal
depositModal.style.display = 'block';

// Close deposit modal
closeDepositModalButton.addEventListener('click', () => {
  depositModal.style.display = 'none';
});

// Show withdraw modal
withdrawModal.style.display = 'block';

// Close withdraw modal
closeWithdrawModalButton.addEventListener('click', () => {
  withdrawModal.style.display = 'none';
});

// Confirm withdraw
confirmWithdrawButton.addEventListener('click', () => {
  const withdrawAddress = document.getElementById('withdraw-address').value;
  const withdrawAmount = parseFloat(document.getElementById('withdraw-amount').value);
  if (!withdrawAddress || withdrawAmount <= 0 || withdrawAmount > balance) {
    alert('Please check your withdrawal details!');
    return;
  }
  balance -= withdrawAmount;
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
  alert(`Withdrawn $${withdrawAmount} to ${withdrawAddress}`);
});
