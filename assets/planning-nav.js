(() => {
  if (!/\/planning-curriculum\.html$/.test(location.pathname)) return;

  const body = document.getElementById('docBody');
  const item = document.querySelector('.nav-planning');
  const label = item?.querySelector('.navlabel');
  const toggle = item?.querySelector('.navtoggle');
  const menu = item?.querySelector('.dropmenu');
  if (!body || !item || !label || !menu) return;

  const slugify = text => text
    .trim()
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const headings = Array.from(body.querySelectorAll('h2'));
  if (!headings.length) return;

  menu.replaceChildren();
  headings.forEach(heading => {
    if (!heading.id) heading.id = slugify(heading.textContent);
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    link.addEventListener('click', () => {
      item.classList.remove('is-open');
      label.setAttribute('aria-expanded', 'false');
    });
    menu.appendChild(link);
  });

  // Planning uses the heading itself as the dropdown control; no separate arrow.
  if (toggle) toggle.hidden = true;
  item.style.gridTemplateColumns = '1fr';
  label.setAttribute('aria-haspopup', 'true');
  label.setAttribute('aria-expanded', 'false');

  label.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    const willOpen = !item.classList.contains('is-open');
    document.querySelectorAll('.navitem.is-open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('is-open');
        openItem.querySelectorAll('[data-nav-toggle]').forEach(button => button.setAttribute('aria-expanded', 'false'));
      }
    });

    item.classList.toggle('is-open', willOpen);
    label.setAttribute('aria-expanded', String(willOpen));
  });

  item.addEventListener('mouseleave', () => {
    item.classList.remove('is-open');
    label.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-planning')) {
      item.classList.remove('is-open');
      label.setAttribute('aria-expanded', 'false');
    }
  });
})();
