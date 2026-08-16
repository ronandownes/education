(() => {
  const root = document.querySelector('[data-interview-master]');
  if (!root) return;

  const mode = root.dataset.interviewMaster;
  const targetPattern = mode === 'word-walls' ? /word wall/i : /concepts and questions/i;
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

  const buildSection = (name, href) => {
    const section = document.createElement('section');
    section.className = 'interview-master-section';
    section.innerHTML = `
      <div class="interview-master-heading">
        <h2>${name}</h2>
        <a href="${href}">Open domain →</a>
      </div>
      <p class="interview-master-loading">Loading…</p>`;
    return section;
  };

  const loadDomain = async (name, href) => {
    const section = buildSection(name, href);
    root.appendChild(section);
    try {
      const response = await fetch(href, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const headings = Array.from(parsed.querySelectorAll('#docBody > h2, #docBody > h3'));
      const targetHeading = headings.find(heading => targetPattern.test(heading.textContent.trim()));
      const table = nextTable(targetHeading);
      if (!table) throw new Error('Table not found');
      section.querySelector('.interview-master-loading')?.remove();
      section.appendChild(document.importNode(table, true));
    } catch (error) {
      const loading = section.querySelector('.interview-master-loading');
      if (loading) {
        loading.textContent = 'This section is not available yet. Open the domain page to check the source.';
        loading.classList.add('interview-master-error');
      }
    }
  };

  Promise.all(domains.map(([name, href]) => loadDomain(name, href))).then(() => {
    root.classList.add('is-loaded');
  });
})();
