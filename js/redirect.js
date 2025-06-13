(async function main() {
  // Parse ?loc parameter
  const params = new URLSearchParams(window.location.search);
  const loc = params.get('loc');
  const fallbackEl = document.getElementById('fallback');

  if (!loc) {
    fallbackEl.textContent = 'No location specified. Please scan the correct QR code.';
    fallbackEl.style.display = 'block';
    return;
  }

  // Analytics: fire pageview event
  if (window.gtag) gtag('event', 'ad_page_view', { loc });

  // Fetch menu mapping JSON
  let menuMap;
  try {
    const res = await fetch('menu-map.json?ts=' + Date.now());
    menuMap = await res.json();
  } catch (e) {
    fallbackEl.textContent = 'Failed to load menu mapping. Try again later.';
    fallbackEl.style.display = 'block';
    return;
  }

  const pdfUrl = menuMap[loc];
  if (!pdfUrl) {
    fallbackEl.textContent = 'Menu not found for this location.';
    fallbackEl.style.display = 'block';
    return;
  }

  // Countdown and Skip logic
  let seconds = 5;
  const countdownEl = document.getElementById('countdown');
  const skipBtn = document.getElementById('skip-btn');
  skipBtn.onclick = () => {
    if (window.gtag) gtag('event', 'ad_skipped', { loc });
    window.location.href = pdfUrl;
  };

  const timer = setInterval(() => {
    seconds--;
    countdownEl.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(timer);
      skipBtn.disabled = false;
      skipBtn.textContent = 'Continue to Menu';
    }
  }, 1000);

  setTimeout(() => {
    window.location.href = pdfUrl;
  }, 5000);
})();
