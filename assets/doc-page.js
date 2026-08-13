(() => {
  const closeNavMenus = (except = null) => {
    document.querySelectorAll('.navitem.is-open').forEach(item => {
      if (item === except) return;
      item.classList.remove('is-open');
      item.querySelectorAll('[data-nav-toggle]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    });
  };

  document.querySelectorAll('[data-nav-toggle]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const item = button.closest('.navitem');
      if (!item) return;
      const willOpen = !item.classList.contains('is-open');
      closeNavMenus(item);
      item.classList.toggle('is-open', willOpen);
      item.querySelectorAll('[data-nav-toggle]').forEach(toggle => toggle.setAttribute('aria-expanded', String(willOpen)));
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.navitem')) closeNavMenus();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeNavMenus();
  });

  const body = document.getElementById('docBody');
  if (!body) return;

  const all = Array.from(body.children);
  const starts = all.filter(el => el.tagName === 'H2');
  starts.forEach(heading => {
    const section = document.createElement('section');
    section.className = 'answer-section';
    const key = location.pathname + '::' + heading.textContent.trim();
    section.dataset.starKey = key;

    const row = document.createElement('div');
    row.className = 'answer-heading-row';
    heading.parentNode.insertBefore(section, heading);
    section.appendChild(row);
    row.appendChild(heading);

    const controls = document.createElement('div');
    controls.className = 'section-controls';
    const star = document.createElement('button');
    star.type = 'button'; star.className = 'star-button'; star.textContent = '☆'; star.title = 'Star this answer';
    const toggle = document.createElement('button');
    toggle.type = 'button'; toggle.textContent = 'Hide';
    controls.append(star, toggle); row.appendChild(controls);

    const content = document.createElement('div');
    content.className = 'section-content'; section.appendChild(content);
    let node = section.nextSibling;
    while (node && node.tagName !== 'H2') {
      const next = node.nextSibling;
      content.appendChild(node);
      node = next;
    }

    const stars = JSON.parse(localStorage.getItem('rd-education-stars') || '{}');
    if (stars[key]) { star.classList.add('is-starred'); star.textContent = '★'; }
    star.addEventListener('click', () => {
      const current = JSON.parse(localStorage.getItem('rd-education-stars') || '{}');
      current[key] = !current[key];
      if (!current[key]) delete current[key];
      localStorage.setItem('rd-education-stars', JSON.stringify(current));
      star.classList.toggle('is-starred', !!current[key]);
      star.textContent = current[key] ? '★' : '☆';
    });
    toggle.addEventListener('click', () => {
      content.hidden = !content.hidden;
      toggle.textContent = content.hidden ? 'Show' : 'Hide';
    });
  });

  document.querySelector('[data-action="show-all"]')?.addEventListener('click', () => {
    document.querySelectorAll('.section-content').forEach(x => x.hidden = false);
    document.querySelectorAll('.section-controls button:last-child').forEach(x => x.textContent = 'Hide');
  });
  document.querySelector('[data-action="hide-all"]')?.addEventListener('click', () => {
    document.querySelectorAll('.section-content').forEach(x => x.hidden = true);
    document.querySelectorAll('.section-controls button:last-child').forEach(x => x.textContent = 'Show');
  });
  let starredOnly = false;
  document.querySelector('[data-action="starred"]')?.addEventListener('click', e => {
    starredOnly = !starredOnly;
    e.currentTarget.textContent = starredOnly ? 'Show all answers' : '★ Starred only';
    document.querySelectorAll('.answer-section').forEach(section => {
      section.classList.toggle('star-filter-hidden', starredOnly && !section.querySelector('.star-button.is-starred'));
    });
  });
  document.querySelector('[data-action="print"]')?.addEventListener('click', () => window.print());
})();
