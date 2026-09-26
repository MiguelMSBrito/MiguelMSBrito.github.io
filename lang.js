// Picks the page language: explicit choice (?lang= or saved) first, then the browser language.
(function () {
  var current = document.documentElement.lang.slice(0, 2);
  var params = new URLSearchParams(location.search);
  var chosen = params.get('lang');
  if (chosen !== 'pt' && chosen !== 'en') chosen = null;
  try {
    if (chosen) localStorage.setItem('lang', chosen);
    else chosen = localStorage.getItem('lang');
  } catch (e) {}
  if (!chosen) {
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    chosen = String(langs[0]).toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en';
  }
  if (chosen !== current) location.replace(chosen === 'pt' ? '/pt/' : '/');
  else if (params.has('lang')) history.replaceState(null, '', location.pathname + location.hash);
})();
