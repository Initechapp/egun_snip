document.addEventListener('DOMContentLoaded', async () => {
  const loginInput = document.getElementById('login');
  const passInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const addBtn = document.getElementById('addCurrent');
  const list = document.getElementById('auctionList');

  const creds = await Storage.getCredentials();
  if (creds) {
     loginInput.value = creds.login;
  }

  loginBtn.addEventListener('click', () => {
     chrome.runtime.sendMessage({type:'login', login: loginInput.value, password: passInput.value});
  });
  logoutBtn.addEventListener('click', () => {
     chrome.runtime.sendMessage({type:'logout'}, () => {
        loginInput.value='';
        passInput.value='';
     });
  });

  addBtn.addEventListener('click', () => {
     chrome.tabs.query({active:true, currentWindow:true}, tabs => {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, {type:'collect-auction'}, data => {
           if (data && data.id) {
              chrome.runtime.sendMessage({type:'add-auction', auction:data}, () => render());
           }
        });
     });
  });

  function render() {
     Storage.getAuctions().then(auctions => {
        list.innerHTML = '';
        auctions.forEach(a => {
           const li = document.createElement('li');
           li.textContent = `${a.title || a.id} – max ${a.maxBid}€ – ${a.status || 'czekam'}`;
           const del = document.createElement('button');
           del.textContent = 'Usuń';
           del.addEventListener('click', () => {
              chrome.runtime.sendMessage({type:'remove-auction', id:a.id}, render);
           });
           li.appendChild(del);
           list.appendChild(li);
        });
     });
  }
  render();

  chrome.runtime.onMessage.addListener(msg => {
     if (msg.type === 'auction-status') {
        render();
     }
  });
});
