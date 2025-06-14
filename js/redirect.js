(async function main() {
  // Parse ?loc parameter
  const params = new URLSearchParams(window.location.search);
  const loc = params.get('loc');
  const fallbackEl = document.getElementById('fallback');
  const containerEl = document.getElementById('container');

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
  skipBtn.onclick = showMenu;
  const timer = setInterval(() => {
    seconds--;
    countdownEl.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(timer);
      skipBtn.disabled = false;
      skipBtn.textContent = 'Continue to Menu';
    }
  }, 1000);

  setTimeout(showMenu, 5000);

  function showMenu() {
    if (window.gtag) gtag('event', 'ad_skipped', { loc });
    // Replace the container content with the embedded PDF
    containerEl.innerHTML = `
      <iframe
        src="${pdfUrl}"
        width="100%"
        height="600"
        allow="autoplay"
        title="Menu PDF"
      ></iframe>
      <div style="margin-top:1rem;">
        <a href="${pdfUrl}" target="_blank" rel="noopener" style="font-size:0.95rem;color:#0562e8;">
          Open menu in a new tab
        </a>
      </div>
    `;
  }
})();
