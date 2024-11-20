let currentUser = null;  // Kullanıcı bilgilerini saklamak için değişken

// Kullanıcı girişini sağla
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kullanıcı bilgilerini doğrulama (bu sadece örnek bir işlem)
    if (username === "user" && password === "password") {
        currentUser = {
            username: username,
            balance: 1000,  // Başlangıç bakiyesi
        };

        // Dashboard'a geçiş
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('dashboardContainer').style.display = 'block';

        // Kullanıcı bakiyesini göster
        document.getElementById('userBalance').style.display = 'block';
        document.getElementById('balanceAmount').textContent = `$${currentUser.balance}`;
    } else {
        alert("Geçersiz giriş bilgileri.");
    }
}

// Yatırım yapma kısmı
function invest() {
    // Yatırım kısmında kripto adresini göster
    document.getElementById('cryptoAddressStatus').style.display = 'block';
}

// Kripto cüzdan adresi modalını kapatma
function closeCryptoAddressModal() {
    document.getElementById('cryptoAddressStatus').style.display = 'none';
}

// Para çekme işlemi
function withdrawFunds() {
    const amount = document.getElementById('withdrawAmount').value;
    if (amount > 0 && amount <= currentUser.balance) {
        currentUser.balance -= amount;
        alert(`$${amount} başarıyla çekildi!`);
        document.getElementById('balanceAmount').textContent = `$${currentUser.balance}`;
    } else {
        alert("Geçersiz çekim tutarı.");
    }
}

// Kullanıcı çıkışı
function logout() {
    currentUser = null;
    document.getElementById('dashboardContainer').style.display = 'none';
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('userBalance').style.display = 'none';
}
