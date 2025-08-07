const SniperEngine = (() => {

  async function schedule(auction, cb) {
    const end = new Date(auction.endTime).getTime();
    const offset = (auction.offset || 5) * 1000;
    const delay = end - offset - Date.now();
    if (delay <= 0) {
      cb('error', 'Auction already ended');
      return;
    }
    cb('waiting', `Scheduled in ${Math.round(delay/1000)}s`);
    setTimeout(() => placeBid(auction, cb), delay);
  }

  async function ensureLogin() {
    const creds = await Storage.getCredentials();
    if (!creds) throw new Error('Brak danych logowania');
    await fetch('https://www.egun.de/market/login.php', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `name=${encodeURIComponent(creds.login)}&password=${encodeURIComponent(creds.password)}`,
      credentials: 'include'
    });
  }

  async function placeBid(auction, cb) {
    try {
      await ensureLogin();
      const bidUrl = `https://www.egun.de/market/auction_offer.php`;
      const params = new URLSearchParams();
      params.set('auction', auction.id);
      params.set('bid', auction.maxBid);
      const res = await fetch(bidUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      cb('bid-sent');
    } catch (e) {
      cb('error', e.message);
    }
  }

  return {schedule};
})();
