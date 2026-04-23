// Megapolis — ulubione mieszkania (localStorage)
// API globalne: window.MegapolisFavs
//   .toggle(id)       - dodaj/usun z ulubionych, zwraca nowy stan (true/false)
//   .isFav(id)        - czy mieszkanie jest w ulubionych
//   .getAll()         - tablica ID wszystkich ulubionych
//   .count()          - ile ulubionych
//   .on(cb)           - subskrybuj zmiany (cb dostaje nowa liste)
//   .clear()          - wyczysc wszystko

(function () {
  var STORAGE_KEY = 'megapolis_favs_v1';
  var listeners = [];

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter(function(x){ return typeof x === 'string'; }) : [];
    } catch (e) { return []; }
  }

  function write(arr) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (e) { /* cicho */ }
    // Powiadom slucharzy
    listeners.forEach(function(cb) { try { cb(arr); } catch (e) {} });
    // Powiadom inne karty
    try {
      window.dispatchEvent(new CustomEvent('megapolis-favs-change', { detail: arr }));
    } catch (e) {}
  }

  var api = {
    toggle: function (id) {
      if (!id) return false;
      id = String(id).toUpperCase();
      var list = read();
      var idx = list.indexOf(id);
      if (idx >= 0) {
        list.splice(idx, 1);
        write(list);
        return false;
      }
      list.unshift(id);
      write(list);
      return true;
    },
    isFav: function (id) {
      if (!id) return false;
      return read().indexOf(String(id).toUpperCase()) !== -1;
    },
    getAll: function () {
      return read();
    },
    count: function () {
      return read().length;
    },
    on: function (cb) {
      if (typeof cb === 'function') listeners.push(cb);
    },
    clear: function () {
      write([]);
    }
  };

  // Sync miedzy kartami - localStorage event z innych kart
  window.addEventListener('storage', function (e) {
    if (e.key !== STORAGE_KEY) return;
    var list = read();
    listeners.forEach(function(cb) { try { cb(list); } catch (err) {} });
  });

  window.MegapolisFavs = api;
})();
