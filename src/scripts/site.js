(function () {
  'use strict';

  function initBackButton() {
    var link = document.querySelector('[data-back]');
    if (!link) return;

    link.addEventListener('click', function (event) {
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

  // "Shuffle up & deal": pick a random game and spotlight its card.
  // Tapping the felt, pressing Esc, "Show all", or coming back from a game
  // page clears the pick.
  function initDeal() {
    var button = document.querySelector('[data-deal]');
    var grid = document.querySelector('.card-grid');
    if (!button || !grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.game-card'));
    var label = button.querySelector('[data-deal-label]');
    var status = document.querySelector('[data-deal-status]');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dealt = null;

    var clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'deal-clear';
    clearButton.textContent = 'Show all';
    clearButton.hidden = true;
    button.insertAdjacentElement('afterend', clearButton);

    button.hidden = false;

    function clear() {
      if (!dealt) return;
      dealt.classList.remove('is-dealt');
      grid.classList.remove('has-dealt');
      dealt = null;
      label.textContent = 'Shuffle up & deal';
      clearButton.hidden = true;
      status.textContent = '';
    }

    button.addEventListener('click', function () {
      var choices = cards.filter(function (card) { return card !== dealt; });
      var next = choices[Math.floor(Math.random() * choices.length)];

      if (dealt) dealt.classList.remove('is-dealt');
      next.classList.add('is-dealt');
      grid.classList.add('has-dealt');
      dealt = next;

      label.textContent = 'Deal again';
      clearButton.hidden = false;
      status.textContent = 'The deck says ' + next.getAttribute('data-name') + '.';
      next.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    clearButton.addEventListener('click', function () {
      clear();
      button.focus();
    });

    // Any tap that isn't on a card or the deal button counts as "put it back".
    document.addEventListener('click', function (event) {
      if (!dealt) return;
      if (event.target.closest('.game-card, [data-deal], .deal-clear')) return;
      clear();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') clear();
    });

    // Back from a game page restores this page from the back/forward cache
    // with the pick still showing; start fresh instead.
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) clear();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initBackButton();
    initDeal();
  });
})();
