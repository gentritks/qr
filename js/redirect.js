(async function() {
  const params = new URLSearchParams(window.location.search);
  const loc = params.get('loc');
  const output = document.getElementById('output');
  if (!loc) {
    output.textContent = 'No menu specified.';
    return;
  }
  try {
    const res = await fetch('menu-map.json');
    const map = await res.json();
    if (!map[loc]) {
      output.textContent = 'Menu not found.';
      return;
    }
    output.innerHTML = `<a href="${map[loc]}" target="_blank">Open Menu</a>`;
  } catch (e) {
    output.textContent = 'Could not load menu map.';
  }
})();
