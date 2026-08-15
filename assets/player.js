(function () {
  // i only have ts bc i dont have spotify premium
  var SONG_URL = "https://open.spotify.com/track/2m0LVMnYGn9AXBllkkWcDI?si=3456e4bdb34941fc";

  var PREVIEW_KEY = 'preview:' + SONG_URL;
  var TITLE_KEY = 'title:' + SONG_URL;
  var COVER_KEY = 'cover:' + SONG_URL;
  var STATE_KEY = 'songState';

  // create audio element synchronously at page load so it always exists
  var audio = new Audio();
  audio.preload = 'none';
  audio.loop = true;
  var btn = null;
  var pendingPlay = false;

  function setBtn() {
    if (!btn) return;
    if (!audio.src) { btn.textContent = 'loading'; return; }
    btn.textContent = audio.paused ? 'play' : 'pause';
  }

  function saveState() {
    if (!audio.src) return;
    try {
      sessionStorage.setItem(STATE_KEY, JSON.stringify({
        t: audio.currentTime,
        playing: !audio.paused,
        ts: Date.now()
      }));
    } catch (e) {}
  }

  function loadState() {
    try {
      var s = JSON.parse(sessionStorage.getItem(STATE_KEY) || '{}');
      if (!s.ts || Date.now() - s.ts > 5 * 60 * 1000) return {};
      return s;
    } catch (e) { return {}; }
  }

  audio.addEventListener('timeupdate', saveState);
  audio.addEventListener('play', function () { setBtn(); saveState(); });
  audio.addEventListener('pause', function () { setBtn(); saveState(); });
  audio.addEventListener('canplay', function () {
    if (wantsResumeAt !== null) {
      try { audio.currentTime = wantsResumeAt; } catch (e) {}
      wantsResumeAt = null;
    }
    setBtn();
    if (pendingPlay) {
      pendingPlay = false;
      audio.play().catch(function () {});
    }
  });
  window.addEventListener('pagehide', saveState);
  window.addEventListener('beforeunload', saveState);

  function attachAutoResume() {
    var resume = function () {
      if (audio.paused) audio.play().catch(function () {});
      document.removeEventListener('click', resume, true);
      document.removeEventListener('touchstart', resume, true);
      document.removeEventListener('keydown', resume, true);
    };
    document.addEventListener('click', resume, true);
    document.addEventListener('touchstart', resume, true);
    document.addEventListener('keydown', resume, true);
  }

  var wantsResumeAt = null;
  function setSrc(previewUrl) {
    if (audio.src) return;
    audio.src = previewUrl;
    setBtn();
    var s = loadState();
    if (s.t) wantsResumeAt = s.t;
    var hasButton = !!document.querySelector('.play-btn');

    if (s.playing) {
      // try to auto-resume on both pages. on stuff.html, fall back to wait-for-tap.
      // on index.html, fall back to waiting for user to click the play button.
      var p = audio.play();
      if (p && p.catch) {
        p.catch(function () {
          if (!hasButton) attachAutoResume();
        });
      }
    }
  }

  var clickWired = false;
  function applyUI(title, cover) {
    var link = document.querySelector('.song-link');
    var titleEl = document.querySelector('.song-title');
    var coverEl = document.querySelector('.album-cover');
    btn = document.querySelector('.play-btn');
    if (link) link.href = SONG_URL;
    if (titleEl && title) titleEl.textContent = title.toLowerCase();
    if (coverEl && cover) coverEl.src = cover;
    if (btn && !clickWired) {
      clickWired = true;
      setBtn();
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!audio.src) {
          pendingPlay = true;
          return;
        }
        if (audio.paused) {
          var p = audio.play();
          if (p && p.catch) {
            p.catch(function () { pendingPlay = true; });
          }
        } else {
          audio.pause();
        }
      });
    } else if (btn) {
      setBtn();
    }
  }

  var cachedPreview = sessionStorage.getItem(PREVIEW_KEY);
  var cachedTitle = sessionStorage.getItem(TITLE_KEY);
  var cachedCover = sessionStorage.getItem(COVER_KEY);

  if (cachedPreview) setSrc(cachedPreview);
  applyUI(cachedTitle, cachedCover);

  if (!cachedPreview || !cachedTitle || !cachedCover) {
    fetch('/api/preview?url=' + encodeURIComponent(SONG_URL))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        if (d.title) { try { sessionStorage.setItem(TITLE_KEY, d.title); } catch (e) {} }
        if (d.cover) { try { sessionStorage.setItem(COVER_KEY, d.cover); } catch (e) {} }
        if (d.preview && !cachedPreview) {
          try { sessionStorage.setItem(PREVIEW_KEY, d.preview); } catch (e) {}
          setSrc(d.preview);
        }
        applyUI(d.title || cachedTitle, d.cover || cachedCover);
      })
      .catch(function () {});
  }
})();
