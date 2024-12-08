// Kullanıcı verilerini saklamak için LocalStorage kullanıyoruz
let users = JSON.parse(localStorage.getItem('users')) || {};

// Mesajları göstermek için fonksiyon
function showAuthMessage(message) {
  const authMessage = document.getElementById('auth-message');
  authMessage.textContent = message;
  setTimeout(() => (authMessage.textContent = ''), 3000);
}

// Kullanıcı girişine tıklandığında giriş formunu göster
document.getElementById('login-link').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
});

// Kullanıcı kayıta tıklandığında kayıt formunu göster
document.getElementById('register-link').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
});

// Register işlemi
document.getElementById('register-btn').addEventListener('click', () => {
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value;

  if (!username || !password) {
    showAuthMessage('Please fill all fields.');
    return;
  }

  if (users[username]) {
    showAuthMessage('Username already exists.');
    return;
  }

  users[username] = { password, balance: 1 };
  localStorage.setItem('users', JSON.stringify(users));
  showAuthMessage('Registration successful! Please log in.');
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
});

// Login işlemi
document.getElementById('login-btn').addEventListener('click', () => {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (!users[username] || users[username].password !== password) {
    showAuthMessage('Invalid username or password.');
    return;
  }

  localStorage.setItem('currentUser', username);
  document.getElementById('auth-container').style.display = 'none';
  balance = users[username].balance;
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
  showMessage(`Welcome back, ${username}!`, 'success');
});

// Oyuna ait değişkenler
let balance = 1;
let multiplier = 1.0;
let gameRunning = false;
let interval;
let gameHistory = [];
const maxHistory = 5;

// DOM elemanları
const balanceDisplay = document.getElementById('balance');
const multiplierDisplay = document.getElementById('multiplier');
const startButton = document.getElementById('start-btn');
const cashoutButton = document.getElementById('cashout-btn');
const resultDisplay = document.getElementById('result');
const betInput = document.getElementById('bet-input');
const historyTable = document.getElementById('history-table');
const messageDisplay = document.getElementById('message');
const planeElement = document.querySelector('.plane');

// Bakiye yükleme
function loadBalance() {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser && users[currentUser]) {
    balance = users[currentUser].balance;
    balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
  }
}

// Bakiye güncelleme
function updateBalance(amount) {
  balance += amount;
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser && users[currentUser]) {
    users[currentUser].balance = balance;
    localStorage.setItem('users', JSON.stringify(users));
  }
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
}

// Mesaj göstermek için fonksiyon
function showMessage(message, type) {
  messageDisplay.textContent = message;
  messageDisplay.className = type;
  messageDisplay.style.display = 'block';
  setTimeout(() => {
    messageDisplay.style.display = 'none';
  }, 3000);
}

// Geçmişi güncelleme
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

// Oyun başlatma
startButton.addEventListener('click', () => {
  const betAmount = parseFloat(betInput.value);
  if (isNaN(betAmount) || betAmount < 0.2 || betAmount > balance) {
    showMessage('Invalid bet amount.', 'error');
    return;
  }
  if (gameRunning) return;

  updateBalance(-betAmount);
  multiplier = 1.0;
  multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
  resultDisplay.textContent = '';
  gameRunning = true;
  startButton.disabled = true;
  cashoutButton.disabled = false;

  let planePosition = 0;

  interval = setInterval(() => {
    multiplier += 0.01;
    planePosition += 2 * multiplier;

    planeElement.style.transform = `translateY(-${planePosition}px)`;
    multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;

    if (Math.random() < 0.01 * multiplier) {
      endGame(false, betAmount);
    }

    if (planePosition > 2000) {
      endGame(false, betAmount);
    }
  }, 100);
});

// Cash Out
cashoutButton.addEventListener('click', () => {
  if (!gameRunning) return;

  const betAmount = parseFloat(betInput.value);
  const winnings = betAmount * multiplier;
  endGame(true, winnings);
});

// Oyunu bitirme
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

// Sayfa yüklendiğinde bakiye yüklenmesi
window.onload = loadBalance;
