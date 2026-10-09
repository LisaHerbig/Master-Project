// Shared helpers for the demo pages (index.html and embed.html).
(function () {
  var DEMO_KEYS = ['demoUnlockedBooks', 'demoGuest', 'demoHasSeenOnboarding'];

  // Scale the phone so it fits the space of its container
  function fitPhone(slot, maxScale) {
    var container = slot.parentElement;
    function update() {
      var styles = getComputedStyle(container);
      var w = container.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      var h = container.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
      var scale = Math.min(maxScale || 1, w / 414, h / 868);
      slot.style.setProperty('--phone-scale', Math.max(0.4, scale).toFixed(3));
    }
    update();
    window.addEventListener('resize', update);
  }

  // The app lives on the same origin, so its demo state can be cleared from here
  function resetDemo(frame, reload) {
    DEMO_KEYS.forEach(function (key) {
      try { localStorage.removeItem(key); } catch (e) {}
    });
    if (reload !== false) frame.src = frame.dataset.src;
  }

  function updateClock(el) {
    function tick() {
      var now = new Date();
      el.textContent = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    }
    tick();
    setInterval(tick, 30000);
  }

  window.DemoPhone = { fitPhone: fitPhone, resetDemo: resetDemo, updateClock: updateClock };
})();
