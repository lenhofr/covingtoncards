(function () {
  'use strict';

  var FAVOURITES_KEY = 'cc.favourites';

  function readFavourites() {
    try {
      var raw = window.localStorage.getItem(FAVOURITES_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function writeFavourites(slugs) {
    try {
      window.localStorage.setItem(FAVOURITES_KEY, JSON.stringify(slugs));
    } catch (err) {
      /* localStorage unavailable (private mode, disabled) — favouriting is best-effort only */
    }
  }

  function setPressed(button, isActive) {
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  }

  function initFavourite() {
    var button = document.querySelector('.fav-button[data-slug]');
    if (!button) return;

    var slug = button.getAttribute('data-slug');
    var favourites = readFavourites();
    setPressed(button, favourites.indexOf(slug) !== -1);

    button.addEventListener('click', function () {
      var current = readFavourites();
      var index = current.indexOf(slug);
      var isActive;

      if (index === -1) {
        current.push(slug);
        isActive = true;
      } else {
        current.splice(index, 1);
        isActive = false;
      }

      writeFavourites(current);
      setPressed(button, isActive);
    });
  }

  function initBackButton() {
    var button = document.querySelector('.back-button[data-back]');
    if (!button) return;

    button.addEventListener('click', function (event) {
      var cameFromSite =
        window.history.length > 1 &&
        document.referrer &&
        document.referrer.indexOf(window.location.origin) === 0;

      if (cameFromSite) {
        event.preventDefault();
        window.history.back();
      }
      // otherwise let the anchor's href navigate to the index
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initFavourite();
    initBackButton();
  });
})();
