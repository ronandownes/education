(() => {
  const root = document.querySelector('[data-interview-master]');
  if (!root) return;

  const mode = root.dataset.interviewMaster;
  const domains = [
    ['Teaching & Learning', 'teaching-learning.html'],
    ['Classroom Management', 'classroom-management.html'],
    ['AEN & Inclusion', 'sen-inclusion.html'],
    ['Differentiation & Accessibility', 'differentiation-accessibility.html'],
    ['Assessment, Feedback & Reporting', 'assessment-reporting.html'],
    ['Planning & Curriculum', 'planning-curriculum.html'],
    ['Relationships & Wellbeing', 'relationships-wellbeing.html'],
    ['Professional Responsibility', 'professional-practice.html']
  ];

  const nextTable = heading => {
    let node = heading?.nextElementSibling;
    while (node && !/^H[1-6]$/.test(node.tagName)) {
      if (node.tagName === 'TABLE') return node;
      node = node.nextElementSibling;
    }
    return null;
  };

  const tableByShape = parsed => {
    const tables = Array.from(parsed.querySelectorAll('#docBody table'));
    if (mode === 'word-walls') {
      return tables.find(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        return headers.length >= 4 && !headers.some(text => /interview question/i.test(text));
      });
    }
    return tables.find(table => /interview question/i.test(table.querySelector('thead')?.textContent || ''));
  };

  const tableFromPage = parsed => {
    const headings = Array.from(parsed.querySelectorAll('#docBody > h2, #docBody > h3'));
    const headingPattern = mode === 'word-walls'
      ? /word\s*wall/i
      : /(concepts?\s*(?:and|&)\s*questions?|question\s*bank)/i;
    const heading = headings.find(item => headingPattern.test(item.textContent.trim()));
    return nextTable(heading) || tableByShape(parsed);
  };

  const buildSection = (name, href) => {
    const section = document.createElement('section');
    section.className = 'interview-master-section';
    section.dataset.domain = name;
    section.innerHTML = `
      <div class="interview-master-heading">
        <h2>${name}</h2>
        <a href="${href}">Open domain →</a>
      </div>
      <p class="interview-master-loading">Loading ${mode === 'word-walls' ? 'word wall' : 'question bank'}…</p>`;
    return section;
  };

  const fetchPage = async href => {
    const url = new URL(href, window.location.href);
    url.searchParams.set('_master', Date.now().toString());
    const response = await fetch(url.href, {
      cache: 'no-store',
      credentials: 'same-origin',
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  };

  const loadDomain = async (name, href) => {
    const section = buildSection(name, href);
    root.appendChild(section);

    let lastError = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const html = await fetchPage(href);
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const table = tableFromPage(parsed);
        if (!table) throw new Error('Required table not found');

        section.querySelector('.interview-master-loading')?.remove();
        const copy = document.importNode(table, true);
        copy.removeAttribute('id');
        section.appendChild(copy);
        section.dataset.loaded = 'true';
        return;
      } catch (error) {
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, 180));
      }
    }

    const loading = section.querySelector('.interview-master-loading');
    if (loading) {
      loading.textContent = `Could not load this domain automatically (${lastError?.message || 'unknown error'}). Open the domain page above.`;
      loading.classList.add('interview-master-error');
    }
  };

  Promise.all(domains.map(([name, href]) => loadDomain(name, href))).then(() => {
    root.classList.add('is-loaded');
    const loaded = root.querySelectorAll('.interview-master-section[data-loaded="true"]').length;
    root.dataset.loadedDomains = String(loaded);
  });
})();
