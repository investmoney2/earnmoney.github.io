let balance = 0.00; // Başlangıç bakiyesi
let username = '';

// Kayıt işlemi
document.getElementById("registerButton").addEventListener("click", function() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");

    errorMessage.textContent = "";
    successMessage.textContent = "";

    if (!name || !email || !password) {
        errorMessage.textContent = "Lütfen tüm alanları doldurun!";
    } else {
        username = name;
        balance = 80.00; // Başlangıç bakiyesi
        successMessage.textContent = "Hesabınız başarıyla oluşturuldu!";
        document.getElementById("navbarRight").innerHTML = `
            <div class="user-info">
                <span id="usernameDisplay">${username}</span>
                <span id="balanceDisplay" class="balance">$${balance.toFixed(2)}</span>
                <button id="depositBtn" class="btn-service">Deposit Money</button>
                <button id="withdrawBtn" class="btn-service">Withdraw Money</button>
                <button id="logoutBtn" class="btn-logout">Çıkış Yap</button>
            </div>
        `;

        // Yeni butonlara işlev ekleniyor
        addDepositWithdrawListeners();

        setTimeout(() => {
            document.getElementById("registerModal").style.display = "none";
        }, 2000);
    }
});

// Çıkış yap butonuna tıklama
document.getElementById("navbarRight").addEventListener("click", function(event) {
    if (event.target.id === "logoutBtn") {
        document.getElementById("navbarRight").innerHTML = `
            <a href="#" id="loginBtn" class="btn-register">Giriş Yap</a>
            <a href="#" id="registerBtn" class="btn-register">Kayıt Ol</a>
        `;
        balance = 0.00; // Çıkış yapınca bakiyeyi sıfırla
    }
});

// Yatırım yapma fonksiyonu
function invest(amount) {
    if (balance >= amount) {
        balance -= amount;
        document.getElementById("balanceDisplay").textContent = `$${balance.toFixed(2)}`;
        alert(`Yatırım başarılı! ${amount} dolarlık yatırım yapıldı.`);
    } else {
        alert("Yetersiz bakiye.");
    }
}

// "Kayıt Ol" butonuna tıklayınca kayıt modalını göster
document.getElementById("registerBtn").addEventListener("click", function() {
    document.getElementById("registerModal").style.display = "flex";
});

// Modalı kapatma
document.getElementById("closeModalBtn").addEventListener("click", function() {
    document.getElementById("registerModal").style.display = "none";
});

// Deposit ve Withdraw işlemleri için işlevsellik
function addDepositWithdrawListeners() {
    // Deposit Money butonuna tıklandığında
    document.getElementById("depositBtn").addEventListener("click", function() {
        // Deposit modal penceresini oluştur
        const depositModal = document.createElement("div");
        depositModal.classList.add("modal");
        depositModal.innerHTML = `
            <div class="modal-content">
                <h3>Deposit USDT (TRC20)</h3>
                <p><strong style="color: black;">USDT (TRC20) Adresi: TEU21vUmQ27fmALcyFLwPJLZgjods3zgkw</strong></p>
                <button id="closeDepositModal" class="btn-service">Kapat</button>
            </div>
        `;
        document.body.appendChild(depositModal);

        // Modal stilini ekle
        depositModal.style.position = "fixed";
        depositModal.style.top = "50%";
        depositModal.style.left = "50%";
        depositModal.style.transform = "translate(-50%, -50%)";
        depositModal.style.backgroundColor = "white";
        depositModal.style.padding = "20px";
        depositModal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
        depositModal.style.zIndex = "1000";

        // Modalı kapatma
        document.getElementById("closeDepositModal").addEventListener("click", function() {
            depositModal.remove();
        });
    });

    // Withdraw Money işlemleri için buton
    document.getElementById("withdrawBtn").addEventListener("click", function() {
        const withdrawModal = document.createElement("div");
        withdrawModal.classList.add("modal");
        withdrawModal.innerHTML = `
            <div class="modal-content">
                <h3>Withdraw USDT (TRC20)</h3>
                <p>Çekmek istediğiniz USDT (TRC20) adresini giriniz:</p>
                <input type="text" id="withdrawAddress" placeholder="USDT Adresi" />
                <p><strong>Çekmek istediğiniz miktarı giriniz (minimum 100$):</strong></p>
                <input type="number" id="withdrawAmount" placeholder="Miktar" />
                <button id="confirmWithdraw" class="btn-service">Çekmeyi Onayla</button>
                <button id="closeWithdrawModal" class="btn-service" style="background-color: #ff0000;">Kapat</button>
            </div>
        `;
        document.body.appendChild(withdrawModal);

        // Modal stilini ekle
        withdrawModal.style.position = "fixed";
        withdrawModal.style.top = "50%";
        withdrawModal.style.left = "50%";
        withdrawModal.style.transform = "translate(-50%, -50%)";
        withdrawModal.style.backgroundColor = "white";
        withdrawModal.style.padding = "20px";
        withdrawModal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
        withdrawModal.style.zIndex = "1000";

        // Withdraw işlemi onayla
        document.getElementById("confirmWithdraw").addEventListener("click", function() {
            const withdrawAmount = parseFloat(document.getElementById("withdrawAmount").value);

            if (isNaN(withdrawAmount) || withdrawAmount < 100) {
                alert("Çekim miktarı minimum 100$ olmalıdır.");
            } else if (withdrawAmount > balance) {
                alert("Yetersiz bakiye!");
            } else {
                balance -= withdrawAmount;
                document.getElementById("balanceDisplay").textContent = `$${balance.toFixed(2)}`;
                alert(`${withdrawAmount} USDT başarıyla çekildi!`);
                withdrawModal.remove();
            }
        });

        // Modalı kapatma
        document.getElementById("closeWithdrawModal").addEventListener("click", function() {
            withdrawModal.remove();
        });
    });
}
