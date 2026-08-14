(() => {
  if (!/\/planning-curriculum\.html$/.test(location.pathname)) return;

  const body = document.getElementById('docBody');
  const menu = document.querySelector('.nav-planning .dropmenu');
  if (!body || !menu) return;

  const slugify = text => text
    .trim()
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const headings = Array.from(body.querySelectorAll(':scope > h2'));
  if (!headings.length) return;

  menu.replaceChildren();
  headings.forEach(heading => {
    if (!heading.id) heading.id = slugify(heading.textContent);
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    menu.appendChild(link);
  });
})();
