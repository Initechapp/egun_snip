const Storage = (() => {
   const CREDS_KEY = 'credentials';
   const AUCTIONS_KEY = 'auctions';

   async function saveCredentials(login, password){
      const data = Utils.encode(JSON.stringify({login, password}));
      await chrome.storage.local.set({[CREDS_KEY]: data});
   }
   async function getCredentials(){
      const res = await chrome.storage.local.get(CREDS_KEY);
      if(res[CREDS_KEY]){
         try{
            return JSON.parse(Utils.decode(res[CREDS_KEY]));
         }catch(e){return null;}
      }
      return null;
   }
   async function clearCredentials(){
      await chrome.storage.local.remove(CREDS_KEY);
   }
   async function getAuctions(){
      const res = await chrome.storage.local.get(AUCTIONS_KEY);
      return res[AUCTIONS_KEY] || [];
   }
   async function saveAuctions(list){
      await chrome.storage.local.set({[AUCTIONS_KEY]: list});
   }
   async function addAuction(auction){
      const list = await getAuctions();
      list.push(auction);
      await saveAuctions(list);
   }
   async function removeAuction(id){
      let list = await getAuctions();
      list = list.filter(a => a.id !== id);
      await saveAuctions(list);
   }
   async function updateAuctionStatus(id, status, message){
      let list = await getAuctions();
      list = list.map(a => a.id === id ? {...a, status, message} : a);
      await saveAuctions(list);
   }
   return {
       saveCredentials, getCredentials, clearCredentials,
       getAuctions, saveAuctions, addAuction, removeAuction,
       updateAuctionStatus
   };
})();
