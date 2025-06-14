(async function main() {
  const params = new URLSearchParams(window.location.search);
  const loc = params.get('loc');
  const fallbackEl = document.getElementById('fallback');
  const containerEl = document.getElementById('container');
  const pdfjsContainer = document.getElementById('pdfjs-container');

  if (!loc) {
    fallbackEl.textContent = 'No location specified. Please scan the correct QR code.';
    fallbackEl.style.display = 'block';
    return;
  }

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
    // Hide ad, timer, fallback
    document.getElementById('ad-container').style.display = 'none';
    document.getElementById('skip-section').style.display = 'none';
    fallbackEl.style.display = 'none';
    // Show PDF.js viewer in iframe, toolbar hidden
    // We'll use PDF.js's viewer.html with toolbar disabled via hash parameters
    const pdfjsViewerUrl = [
      'pdfjs/web/viewer.html',
      '?file=',
      encodeURIComponent(pdfUrl),
      '#toolbar=0&navpanes=0&view=FitH'
    ].join('');
    pdfjsContainer.style.display = 'block';
    pdfjsContainer.innerHTML = `
      <iframe
        src="${pdfjsViewerUrl}"
        allowfullscreen
        title="Menu PDF"
      ></iframe>
    `;
  }
})();
