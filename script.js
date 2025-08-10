/* --- Basit localStorage tabanlı kullanıcı & simülasyon sistemi ---
       UYARI: Bu demo gerçek para ödemez. Gerçek platform için backend, ödeme sağlayıcı, KYC, SSL, denetim gerekir. */

    // Yardımcı fonksiyonlar
    const $ = sel => document.querySelector(sel);
    const fmt = n => Number(n).toFixed(2);
    const now = () => new Date().toLocaleString();

    // Örnek varlık verileri (basit değişen fiyatlar)
    const assetsSeed = [
      {id:'BTC', name:'Bitcoin', price: 42000},
      {id:'ETH', name:'Ethereum', price: 2800},
      {id:'S&P', name:'S&P 500', price: 4800},
      {id:'GOLD', name:'Altın (oz)', price: 1980}
    ];

    // Kullanıcı yönetimi (localStorage)
    const DB_KEY = 'simyatirim_users_v1';
    const loadDB = ()=> JSON.parse(localStorage.getItem(DB_KEY)||'{}');
    const saveDB = db => localStorage.setItem(DB_KEY, JSON.stringify(db));

    // Oturum
    let currentUser = null;

    function ensureSeed(){
      if(!localStorage.getItem('sim_assets')){
        localStorage.setItem('sim_assets', JSON.stringify(assetsSeed));
      }
    }
    ensureSeed();

    function getAssets(){return JSON.parse(localStorage.getItem('sim_assets'))}
    function saveAssets(a){localStorage.setItem('sim_assets', JSON.stringify(a))}

    // Basit fiyat simülasyonu: her 5 saniyede bir rastgele küçük değişim uygula
    setInterval(()=>{
      const a = getAssets();
      for(let it of a){
        const change = (Math.random()*2-1) * (it.price*0.003); // ~0.3% oynama
        it.price = Math.max(0.01, it.price + change);
      }
      saveAssets(a);
      renderMarket();
      refreshDashboard();
    },5000);

    // UI render
    function renderMarket(){
      const wrap = $('#marketList'); wrap.innerHTML='';
      const a = getAssets();
      for(let it of a){
        const el = document.createElement('div'); el.className='asset';
        const left = document.createElement('div'); left.className='left';
        const title = document.createElement('div'); title.textContent = it.name + ' ('+it.id+')';
        const price = document.createElement('div'); price.innerHTML = '<strong>'+fmt(it.price)+'</strong> <span class="small">USD</span>';
        left.appendChild(title); left.appendChild(price);
        const right = document.createElement('div');
        const btn = document.createElement('button'); btn.textContent='Yatır'; btn.onclick = ()=>openInvestModal(it.id);
        right.appendChild(btn);
        el.appendChild(left); el.appendChild(right);
        wrap.appendChild(el);
      }
    }

    // Basit chart (canvas) - çizimi elle yapacağız (minimal)
    function drawPortfolioChart(){
      const cvs = document.getElementById('portfolioChart');
      const ctx = cvs.getContext('2d');
      const w = cvs.width = cvs.clientWidth * devicePixelRatio;
      const h = cvs.height = 220 * devicePixelRatio;
      ctx.clearRect(0,0,w,h);
      // örnek: portföy varyasyonunu kullanıcı geçmişinden çıkar
      const hist = currentUser ? (currentUser.history || []) : [];
      const values = hist.filter(x=>x.type==='deposit' || x.type==='trade').map((x,i)=>100 + i*2 + (Math.random()-0.5)*10);
      ctx.strokeStyle = '#6ee7b7'; ctx.lineWidth = 3*devicePixelRatio; ctx.beginPath();
      for(let i=0;i<values.length;i++){
        const vx = (i/(Math.max(1,values.length-1))) * (w-40) + 20;
        const vy = h - (values[i]/Math.max(100,Math.max(...values))) * (h-40) - 20;
        if(i===0) ctx.moveTo(vx,vy); else ctx.lineTo(vx,vy);
      }
      ctx.stroke();
    }

    function refreshDashboard(){
      const db = loadDB();
      if(!currentUser){
        $('#leftName').textContent = 'Giriş yapılmadı';
        $('#leftBalance').textContent = fmt(0);
        $('#leftPortfolio').textContent = fmt(0);
        $('#leftOpen').textContent = 0; $('#leftPnl').textContent = fmt(0);
        $('#userShort').style.display='none'; $('#btnLogout').style.display='none';
      } else {
        $('#leftName').textContent = currentUser.name;
        $('#leftAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
        $('#leftBalance').textContent = fmt(currentUser.balance || 0);
        const portfolioVal = (currentUser.positions||[]).reduce((s,p)=>s + p.amount * getAssets().find(a=>a.id===p.asset).price,0);
        $('#leftPortfolio').textContent = fmt(portfolioVal);
        $('#leftOpen').textContent = (currentUser.positions||[]).length;
        $('#leftPnl').textContent = fmt((portfolioVal + (currentUser.balance||0)) - (currentUser._deposited||0));
        $('#userShort').style.display='flex'; $('#userShort').textContent = currentUser.name + ' — $' + fmt(currentUser.balance||0);
        $('#btnLogout').style.display = 'inline-block';
      }
      renderTxTable();
      drawPortfolioChart();
    }

    function renderTxTable(){
      const tbody = $('#txTable tbody'); tbody.innerHTML='';
      if(!currentUser) return;
      const rows = (currentUser.history||[]).slice().reverse();
      for(let r of rows){
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.t}</td><td>${r.type}</td><td>${r.asset||'-'}</td><td>${fmt(r.amount)}</td><td>${r.price?fmt(r.price):'-'}</td>`;
        tbody.appendChild(tr);
      }
    }

    // Auth modal
    function openAuthModal(){
      const modal = $('#modalContent');
      modal.innerHTML = `
        <h3>Giriş / Kayıt</h3>
        <div style="display:flex;gap:12px;margin-top:12px">
          <div style="flex:1">
            <label>İsim</label>
            <input id="regName" placeholder="Tam adınız" />
          </div>
          <div style="width:140px">
            <label>Hesap ID</label>
            <input id="regId" placeholder="kullanici1" />
          </div>
        </div>
        <div style="margin-top:10px;display:flex;gap:10px">
          <button id="btnCreate">Hesap Oluştur (Demo)</button>
          <button id="btnLogin">Giriş Yap</button>
          <button id="btnClose">Kapat</button>
        </div>
      `;
      $('#overlay').style.display='flex';
      $('#btnClose').onclick = ()=> $('#overlay').style.display='none';
      $('#btnCreate').onclick = ()=>{
        const name = $('#regName').value.trim(); const id = $('#regId').value.trim();
        if(!name||!id) return alert('İsim ve ID gerekli');
        const db = loadDB();
        if(db[id]) return alert('Bu ID alınmış');
        db[id] = { id, name, balance: 1000.0, positions: [], history: [], _deposited:1000.0 };
        saveDB(db); currentUser = db[id]; $('#overlay').style.display='none'; refreshDashboard();
      };
      $('#btnLogin').onclick = ()=>{
        const id = $('#regId').value.trim(); const db = loadDB();
        if(!db[id]) return alert('Kayıt bulunamadı');
        currentUser = db[id]; $('#overlay').style.display='none'; refreshDashboard();
      };
    }

    // Invest modal
    function openInvestModal(assetId){
      if(!currentUser) return alert('Önce giriş yapın');
      const asset = getAssets().find(a=>a.id===assetId);
      const modal = $('#modalContent');
      modal.innerHTML = `
        <h3>Yatırım — ${asset.name} (${asset.id})</h3>
        <div style="display:flex;gap:10px;margin-top:12px">
          <div style="flex:1">
            <label>Miktar (USD)</label>
            <input id="investAmt" type="number" value="100" />
          </div>
          <div style="width:160px">
            <label>İşlem</label>
            <select id="investType"><option value="buy">Al</option><option value="sell">Sat</option></select>
          </div>
        </div>
        <div style="margin-top:10px;display:flex;gap:10px">
          <button id="btnConfirmInvest" class="primary">Onayla</button>
          <button id="btnClose2">Kapat</button>
        </div>
      `;
      $('#overlay').style.display='flex';
      $('#btnClose2').onclick = ()=> $('#overlay').style.display='none';
      $('#btnConfirmInvest').onclick = ()=>{
        const amt = Number($('#investAmt').value);
        const type = $('#investType').value;
        if(type==='buy'){
          if(currentUser.balance < amt) return alert('Yeterli bakiye yok');
          // alım: pozisyon oluştur
          const posAmount = amt / asset.price;
          currentUser.balance -= amt;
          currentUser.positions.push({asset:asset.id, amount: posAmount, entry: asset.price});
          currentUser.history.push({t:now(), type:'trade', asset:asset.id, amount:amt, price:asset.price});
        } else {
          // sat: mevcut pozisyonlardan satmaya çalış
          const pos = currentUser.positions.find(p=>p.asset===asset.id);
          if(!pos) return alert('Bu varlıkta pozisyonunuz yok');
          const sellUsd = Math.min(amt, pos.amount * asset.price);
          const sellUnits = sellUsd / asset.price;
          pos.amount -= sellUnits;
          currentUser.balance += sellUsd;
          currentUser.history.push({t:now(), type:'trade', asset:asset.id, amount:-sellUsd, price:asset.price});
          if(pos.amount <= 0.0000001) currentUser.positions = currentUser.positions.filter(p=>p.amount>0.0000001);
        }
        // kaydet
        const db = loadDB(); db[currentUser.id] = currentUser; saveDB(db);
        $('#overlay').style.display='none'; refreshDashboard();
      };
    }

    // Deposit / Withdraw (simülasyon)
    function openDeposit(withdraw=false){
      if(!currentUser) return alert('Önce giriş yapın');
      const modal = $('#modalContent');
      modal.innerHTML = `
        <h3>${withdraw? 'Para Çek' : 'Para Yatır'}</h3>
        <div style="margin-top:10px">
          <label>Miktar (USD)</label>
          <input id="depAmt" type="number" value="100" />
        </div>
        <div style="margin-top:10px;display:flex;gap:10px">
          <button id="btnDoDep" class="primary">Onayla</button>
          <button id="btnClose3">Kapat</button>
        </div>
      `;
      $('#overlay').style.display='flex';
      $('#btnClose3').onclick = ()=> $('#overlay').style.display='none';
      $('#btnDoDep').onclick = ()=>{
        const amt = Number($('#depAmt').value);
        if(!withdraw){ currentUser.balance += amt; currentUser._deposited = (currentUser._deposited||0) + amt; currentUser.history.push({t:now(), type:'deposit', amount:amt}); }
        else { if(currentUser.balance < amt) return alert('Yeterli bakiye yok'); currentUser.balance -= amt; currentUser.history.push({t:now(), type:'withdraw', amount:amt}); }
        const db = loadDB(); db[currentUser.id] = currentUser; saveDB(db);
        $('#overlay').style.display='none'; refreshDashboard();
      };
    }

    // Events
    $('#btnOpenAuth').onclick = openAuthModal;
    $('#btnOpenInvest').onclick = ()=>{
      const aset = getAssets()[0]; openInvestModal(aset.id);
    }
    $('#btnDeposit').onclick = ()=>openDeposit(false);
    $('#btnWithdraw').onclick = ()=>openDeposit(true);
    $('#btnLogout').onclick = ()=>{currentUser=null;refreshDashboard();};
    $('#btnClearHistory').onclick = ()=>{
      if(!currentUser) return; currentUser.history=[]; const db = loadDB(); db[currentUser.id] = currentUser; saveDB(db); refreshDashboard();
    }

    // Başlangıç
    renderMarket(); refreshDashboard();

    // Küçük yardımcı: sayfa kapandığında veritabanını localStorage'da tut
    window.addEventListener('beforeunload', ()=>{
      const db = loadDB(); if(currentUser) db[currentUser.id]=currentUser; saveDB(db);
    });