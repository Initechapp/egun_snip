importScripts('storage.js', 'sniperEngine.js', 'utils.js');

console.log('eGun Sniper background loaded');

async function init() {
    const auctions = await Storage.getAuctions();
    auctions.forEach(scheduleAuction);
}
init();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'add-auction') {
        Storage.addAuction(msg.auction).then(() => {
            scheduleAuction(msg.auction);
            sendResponse({ok: true});
        });
        return true;
    }
    if (msg.type === 'remove-auction') {
        Storage.removeAuction(msg.id).then(() => sendResponse({ok:true}));
        return true;
    }
    if (msg.type === 'login') {
        Storage.saveCredentials(msg.login, msg.password).then(() => sendResponse({ok:true}));
        return true;
    }
    if (msg.type === 'logout') {
        Storage.clearCredentials().then(() => sendResponse({ok:true}));
        return true;
    }
    if (msg.type === 'get-auctions') {
        Storage.getAuctions().then(a => sendResponse(a));
        return true;
    }
    return false;
});

function scheduleAuction(auction) {
    SniperEngine.schedule(auction, (status, message) => {
        console.log('Auction', auction.id, status, message);
        chrome.runtime.sendMessage({type: 'auction-status', id: auction.id, status, message});
        if (status === 'finished' || status === 'error') {
            Storage.updateAuctionStatus(auction.id, status, message);
        }
    });
}
