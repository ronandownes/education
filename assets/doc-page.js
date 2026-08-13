(() => {
  const topbar = document.querySelector('.topbar');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

  const closeNavMenus = (except = null) => {
    document.querySelectorAll('.navitem.is-open').forEach(item => {
      if (item === except) return;
      item.classList.remove('is-open');
      item.querySelectorAll('[data-nav-toggle]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    });
  };

  const closeMobileNav = () => {
    if (!topbar || !mobileNavToggle) return;
    topbar.classList.remove('nav-open');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNavToggle.setAttribute('aria-label', 'Open main navigation');
    closeNavMenus();
  };

  mobileNavToggle?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    const willOpen = !topbar?.classList.contains('nav-open');
    topbar?.classList.toggle('nav-open', willOpen);
    mobileNavToggle.setAttribute('aria-expanded', String(willOpen));
    mobileNavToggle.setAttribute('aria-label', willOpen ? 'Close main navigation' : 'Open main navigation');
    if (!willOpen) closeNavMenus();
  });

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
    if (!event.target.closest('.topbar')) {
      closeNavMenus();
      closeMobileNav();
      return;
    }
    if (!event.target.closest('.navitem') && !event.target.closest('.mobile-nav-toggle')) closeNavMenus();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMobileNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1280) closeMobileNav();
  });

  const body = document.getElementById('docBody');
  if (!body) return;

  // Policies is a visual reference shelf. School-specific WSE reports are the
  // first documents because they are the highest-value pre-interview reading.
  if (/\/policies\.html$/.test(location.pathname)) {
    const library = body.querySelector('.policy-library');
    if (library && !library.querySelector('#my-school-reports')) {
      const reportStyle = document.createElement('style');
      reportStyle.textContent = `
        .policy-library .school-report-preview{width:100%;height:100%;display:block;border:0;pointer-events:none;background:#fff}
        .policy-library .school-report-cover{background:#fff}
        .policy-library .school-report-cover::after{content:'';position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 0 1px rgba(60,64,67,.04)}
        @media(max-width:600px){.policy-library .school-report-preview{min-height:0}}
      `;
      library.prepend(reportStyle);

      const reportSection = document.createElement('section');
      reportSection.className = 'library-section';
      reportSection.id = 'my-school-reports';
      reportSection.innerHTML = `
        <h2>My Schools — Whole-School Reports</h2>
        <div class="library-grid">
          <a class="shelf-item" href="https://www.gov.ie/en/department-of-education/school-inspection-reports/col%C3%A1iste-d%C3%BAn-iascaigh-8/" data-preview="https://assets.gov.ie/static/documents/09fe3ad4/colaiste-dun-iascaigh-8272c1f4-b8fa-4b96-98c6-fd68fec78e48.pdf" data-title="Coláiste Dún Iascaigh — Whole School Evaluation"><div class="shelf-cover school-report-cover"><iframe class="school-report-preview" src="https://assets.gov.ie/static/documents/09fe3ad4/colaiste-dun-iascaigh-8272c1f4-b8fa-4b96-98c6-fd68fec78e48.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0" loading="eager" title="Coláiste Dún Iascaigh WSE first page"></iframe><span class="shelf-badge">Interview</span></div><div class="shelf-title">Coláiste Dún Iascaigh — WSE</div><div class="shelf-sub">Cahir · Whole School Evaluation</div></a>

          <a class="shelf-item" href="https://www.gov.ie/en/department-of-education/school-inspection-reports/st-patricks-comprehensive-school-2/" data-preview="https://assets.gov.ie/static/documents/09fe3ad4/st-patricks-comprehensive-school-27a6cadb-a877-4b9b-9467-ac05e6c17f49.pdf" data-title="St Patrick's Comprehensive School — Whole School Evaluation"><div class="shelf-cover school-report-cover"><iframe class="school-report-preview" src="https://assets.gov.ie/static/documents/09fe3ad4/st-patricks-comprehensive-school-27a6cadb-a877-4b9b-9467-ac05e6c17f49.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0" loading="eager" title="St Patrick's Comprehensive WSE first page"></iframe><span class="shelf-badge">Interview</span></div><div class="shelf-title">St Patrick's Comprehensive — WSE</div><div class="shelf-sub">Shannon · Whole School Evaluation</div></a>

          <a class="shelf-item" href="https://www.gov.ie/en/department-of-education/school-inspection-reports/st-flannans-college-ennis-co-clare-clare-2/" data-preview="https://assets.gov.ie/static/documents/09fe3ad4/st-flannans-college-ennis-co-clare-clare-9c815280-5c1d-430c-8b9b-09a6a835c8f4.pdf" data-title="St Flannan's College — Whole School Evaluation"><div class="shelf-cover school-report-cover"><iframe class="school-report-preview" src="https://assets.gov.ie/static/documents/09fe3ad4/st-flannans-college-ennis-co-clare-clare-9c815280-5c1d-430c-8b9b-09a6a835c8f4.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0" loading="lazy" title="St Flannan's College WSE first page"></iframe><span class="shelf-badge">Interview</span></div><div class="shelf-title">St Flannan's College — WSE</div><div class="shelf-sub">Ennis · Whole School Evaluation</div></a>

          <a class="shelf-item" href="https://www.gov.ie/en/department-of-education/school-inspection-reports/thomond-community-college-moylish-park-moylish-limerick-3/" data-preview="https://assets.gov.ie/static/documents/09fe3ad4/thomond-community-college-moylish-park-moylish-limerick-0a042584-86a2-4702-9f.pdf" data-title="Thomond Community College — Whole School Evaluation"><div class="shelf-cover school-report-cover"><iframe class="school-report-preview" src="https://assets.gov.ie/static/documents/09fe3ad4/thomond-community-college-moylish-park-moylish-limerick-0a042584-86a2-4702-9f.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0" loading="lazy" title="Thomond Community College WSE first page"></iframe><span class="shelf-badge">Taught here</span></div><div class="shelf-title">Thomond Community College — WSE 2024</div><div class="shelf-sub">Moylish · Whole School Evaluation</div></a>

          <a class="shelf-item" href="https://www.gov.ie/en/department-of-education/school-inspection-reports/nenagh-college-dromin-road-nenagh-tipperary-4/" data-preview="https://assets.gov.ie/static/documents/09fe3ad4/nenagh-college-dromin-road-nenagh-tipperary-3e9b809f-4e1d-418c-9a90-697e9122d.pdf" data-title="Nenagh College — Whole School Evaluation"><div class="shelf-cover school-report-cover"><iframe class="school-report-preview" src="https://assets.gov.ie/static/documents/09fe3ad4/nenagh-college-dromin-road-nenagh-tipperary-3e9b809f-4e1d-418c-9a90-697e9122d.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0" loading="lazy" title="Nenagh College WSE first page"></iframe><span class="shelf-badge">Taught here</span></div><div class="shelf-title">Nenagh College — WSE 2025</div><div class="shelf-sub">Nenagh · Whole School Evaluation</div></a>

          <a class="shelf-item" href="https://www.gov.ie/en/department-of-education/school-inspection-reports/scoil-na-tr%C3%ADon%C3%B3ide-naofa-doon-co-limerick-limerick-4/" data-preview="https://assets.gov.ie/static/documents/09fe3ad4/scoil-na-trionoide-naofa-doon-co-limerick-limerick-cf1275bb-0986-4d72-b9aa-34.pdf" data-title="Scoil Na Tríonóide Naofa — Whole School Evaluation"><div class="shelf-cover school-report-cover"><iframe class="school-report-preview" src="https://assets.gov.ie/static/documents/09fe3ad4/scoil-na-trionoide-naofa-doon-co-limerick-limerick-cf1275bb-0986-4d72-b9aa-34.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0" loading="lazy" title="Scoil Na Tríonóide Naofa WSE first page"></iframe><span class="shelf-badge">Taught here</span></div><div class="shelf-title">Scoil Na Tríonóide Naofa — WSE</div><div class="shelf-sub">Doon · Whole School Evaluation</div></a>

          <a class="shelf-item" href="https://www.gov.ie/en/department-of-education/school-inspection-reports/villiers-secondary-school-north-circular-road-limerick-limerick-2/" data-preview="https://assets.gov.ie/static/documents/09fe3ad4/villiers-secondary-school-north-circular-road-limerick-limerick-ce5eaa0a-4fa4.pdf" data-title="Villiers Secondary School — Whole School Evaluation"><div class="shelf-cover school-report-cover"><iframe class="school-report-preview" src="https://assets.gov.ie/static/documents/09fe3ad4/villiers-secondary-school-north-circular-road-limerick-limerick-ce5eaa0a-4fa4.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0" loading="lazy" title="Villiers Secondary School WSE first page"></iframe><span class="shelf-badge">Taught here</span></div><div class="shelf-title">Villiers Secondary School — WSE</div><div class="shelf-sub">Limerick · Whole School Evaluation</div></a>
        </div>
      `;

      const note = library.querySelector('.library-note');
      if (note) {
        note.innerHTML = '<strong>Start with my schools.</strong> Current interview schools are first, followed by schools I have taught in. National frameworks and the rest of the documentation follow underneath.';
        note.insertAdjacentElement('afterend', reportSection);
      } else {
        library.prepend(reportSection);
      }

      const startHeading = library.querySelector('#start-here h2');
      if (startHeading) startHeading.textContent = 'Core National Documents';
    }
  }

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
