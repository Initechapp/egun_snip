const Utils = (() => {
  function encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  function decode(str) {
    return decodeURIComponent(escape(atob(str)));
  }
  function parseEuro(value) {
    return parseFloat(value.replace(/[^0-9.,]/g, '').replace(',', '.'));
  }
  return {encode, decode, parseEuro};
})();
