(function() {
  function getAuctionData() {
      const idMatch = location.search.match(/id=(\d+)/) || location.pathname.match(/\/(\d+)\.html/);
      const id = idMatch ? idMatch[1] : null;
      const title = document.querySelector('h1')?.innerText || document.title;
      const endTime = document.querySelector('.auctionEnd')?.textContent;
      const currentPrice = document.querySelector('.currentBid')?.textContent;
      const minStep = document.querySelector('.bidStep')?.textContent;
      return {id, title, endTime, currentPrice, minStep, offset:5, maxBid: currentPrice, strategy:'jednorazowa'};
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === 'collect-auction') {
          sendResponse(getAuctionData());
      }
  });

  const btn = document.createElement('button');
  btn.textContent = 'Dodaj do snajpera';
  btn.style.position = 'relative';
  btn.style.zIndex = '9999';
  btn.addEventListener('click', () => {
     const data = getAuctionData();
     chrome.runtime.sendMessage({type:'add-auction', auction:data});
  });
  document.body.appendChild(btn);
})();
