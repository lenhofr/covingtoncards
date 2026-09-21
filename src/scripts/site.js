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
  function initDeal() {
    var button = document.querySelector('[data-deal]');
    var grid = document.querySelector('.card-grid');
    if (!button || !grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.game-card'));
    var label = button.querySelector('[data-deal-label]');
    var status = document.querySelector('[data-deal-status]');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dealt = null;

    button.hidden = false;

    button.addEventListener('click', function () {
      var choices = cards.filter(function (card) { return card !== dealt; });
      var next = choices[Math.floor(Math.random() * choices.length)];

      if (dealt) dealt.classList.remove('is-dealt');
      next.classList.add('is-dealt');
      grid.classList.add('has-dealt');
      dealt = next;

      label.textContent = 'Deal again';
      status.textContent = 'The deck says ' + next.getAttribute('data-name') + '.';
      next.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initBackButton();
    initDeal();
  });
})();
