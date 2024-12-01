let balance = 0;
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

function updateBalance(amount) {
  balance += amount;
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
}

function showMessage(message, type) {
  messageDisplay.textContent = message;
  messageDisplay.className = type;
  messageDisplay.style.display = 'block';
  setTimeout(() => {
    messageDisplay.style.display = 'none';
  }, 3000);
}

function addToHistory(bet, multiplier, result) {
  if (gameHistory.length >= maxHistory) {
    gameHistory.shift();
  }
  gameHistory.push({ bet, multiplier, result });
  updateHistoryTable();
}

function updateHistoryTable() {
  historyTable.innerHTML = '';
  gameHistory.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${index + 1}</td><td>$${entry.bet.toFixed(2)}</td><td>${entry.multiplier.toFixed(2)}x</td><td>${entry.result}</td>`;
    historyTable.appendChild(row);
  });
}

startButton.addEventListener('click', () => {
  const betAmount = parseFloat(betInput.value);
  if (isNaN(betAmount) || betAmount < 5 || betAmount > balance) {
    showMessage("Invalid bet amount.", 'error');
    return;
  }
  if (gameRunning) return;

  updateBalance(-betAmount);
  multiplier = 1.00;
  multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
  resultDisplay.textContent = '';
  gameRunning = true;
  startButton.disabled = true;
  cashoutButton.disabled = false;

  let planePosition = 0; // Initial position
  planeElement.style.transform = `translateY(${planePosition}px)`; // Set plane initial position

  interval = setInterval(() => {
    multiplier += 0.01;  // Increase multiplier
    planePosition += 2 * multiplier;  // Plane moves faster as multiplier increases

    // Update plane position
    planeElement.style.transform = `translateY(-${planePosition}px)`;  

    // Update multiplier display
    multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;

    // 1% chance for the plane to crash based on the multiplier
    if (Math.random() < 0.01 * multiplier) {
      endGame(false, betAmount);
    }

    // If plane reaches high altitude (2000px), crash it
    if (planePosition > 2000) {
      endGame(false, betAmount);
    }
  }, 100);
});

cashoutButton.addEventListener('click', () => {
  if (!gameRunning) return;

  const betAmount = parseFloat(betInput.value);
  const winnings = betAmount * multiplier;
  endGame(true, winnings);
});

function endGame(cashedOut, amount) {
  gameRunning = false;
  clearInterval(interval);
  startButton.disabled = false;
  cashoutButton.disabled = true;

  if (cashedOut) {
    updateBalance(amount);
    addToHistory(amount / multiplier, multiplier, `Won $${amount.toFixed(2)}`);
    showMessage(`Cashed out at ${multiplier.toFixed(2)}x! Won $${amount.toFixed(2)}!`, 'success');
  } else {
    addToHistory(amount, multiplier, 'Lost');
    showMessage(`Plane crashed at ${multiplier.toFixed(2)}x! You lost.`, 'error');
  }
}

depositButton.addEventListener('click', () => {
  const depositAmount = parseFloat(depositInput.value);
  if (isNaN(depositAmount) || depositAmount <= 0) {
    showMessage('Invalid deposit amount.', 'error');
    return;
  }
  updateBalance(depositAmount);
  depositModal.style.display = 'none';
  showMessage(`Deposited $${depositAmount.toFixed(2)}`, 'success');
});

withdrawButton.addEventListener('click', () => {
  withdrawModal.style.display = 'block';
});

confirmWithdrawButton.addEventListener('click', () => {
  const withdrawAmount = parseFloat(withdrawInput.value);
  if (withdrawAmount > balance || isNaN(withdrawAmount) || withdrawAmount <= 0) {
    showMessage('Invalid withdrawal amount.', 'error');
    return;
  }
  updateBalance(-withdrawAmount);
  withdrawModal.style.display = 'none';
  showMessage(`Withdrew $${withdrawAmount.toFixed(2)}`, 'success');
});

closeDepositModalButton.addEventListener('click', () => {
  depositModal.style.display = 'none';
});

closeWithdrawModalButton.addEventListener('click', () => {
  withdrawModal.style.display = 'none';
});
