(() => {
  const area = document.querySelector('[data-local-edit]');
  const toggle = document.querySelector('[data-edit-toggle]');
  const reset = document.querySelector('[data-edit-reset]');
  if (!area || !toggle) return;

  const key = `education-local-edit:${location.pathname}`;
  const saved = localStorage.getItem(key);
  if (saved) area.innerHTML = saved;

  let editing = false;
  function setEditing(on) {
    editing = on;
    area.contentEditable = on ? 'true' : 'false';
    area.classList.toggle('is-editing', on);
    toggle.textContent = on ? 'Done editing' : 'Edit words';
    if (on) area.focus();
  }

  toggle.addEventListener('click', () => {
    if (editing) localStorage.setItem(key, area.innerHTML);
    setEditing(!editing);
  });

  area.addEventListener('input', () => {
    if (editing) localStorage.setItem(key, area.innerHTML);
  });

  if (reset) {
    reset.addEventListener('click', () => {
      localStorage.removeItem(key);
      location.reload();
    });
  }
})();
