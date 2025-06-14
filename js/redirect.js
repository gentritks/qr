(async function() {
  const params = new URLSearchParams(window.location.search);
  const loc = params.get('loc');
  const pdfjsContainer = document.getElementById('pdfjs-container');
  if (!loc) {
    pdfjsContainer.textContent = 'No menu specified.';
    return;
  }
  try {
    const res = await fetch('menu-map.json');
    const map = await res.json();
    const pdfUrl = map[loc];
    if (!pdfUrl) {
      pdfjsContainer.textContent = 'Menu not found.';
      return;
    }
    // Load PDF.js viewer in an iframe
    const viewerUrl = [
      'web/viewer.html',
      '?file=',
      encodeURIComponent(pdfUrl),
      '#toolbar=0&navpanes=0&view=FitH'
    ].join('');
    pdfjsContainer.innerHTML = `<iframe src="${viewerUrl}" width="100%" height="650" style="border:none;border-radius:12px;"></iframe>`;
  } catch (e) {
    pdfjsContainer.textContent = 'Could not load menu map.';
  }
})();
