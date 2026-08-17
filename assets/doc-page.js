(() => {
  const topbar = document.querySelector('.topbar');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

  // --- Navigation architecture ------------------------------------------------

  // Repair Differentiation links explicitly. These are deliberately tied to
  // headings that exist in the current Markdown page.
  const differentiationItem = document.querySelector('.nav-differentiation');
  if (differentiationItem) {
    const label = differentiationItem.querySelector(':scope > .navlabel');
    if (label) label.href = '/education/differentiation-accessibility.html';
    const menu = differentiationItem.querySelector(':scope > .dropmenu');
    if (menu) {
      menu.innerHTML = `
        <a href="/education/differentiation-accessibility.html#what-does-differentiation-mean-in-your-classroom">What does differentiation mean?</a>
        <a href="/education/differentiation-accessibility.html#what-is-the-difference-between-accessibility-and-differentiation">Accessibility vs differentiation</a>
        <a href="/education/differentiation-accessibility.html#how-does-udl-fit">How does UDL fit?</a>
        <a href="/education/differentiation-accessibility.html#how-do-you-plan-for-a-mixed-ability-class">Mixed-ability planning</a>
      `;
    }
  }

  // Policies menu now follows the actual reference-shelf structure rather than
  // the old subject-based categories.
  const policyItem = document.querySelector('.nav-policies');
  if (policyItem) {
    const menu = policyItem.querySelector(':scope > .dropmenu');
    if (menu) {
      menu.innerHTML = `
        <a href="/education/policies.html#my-school-reports">My schools — WSE reports</a>
        <a href="/education/policies.html#start-here">Core national documents</a>
        <a href="/education/policies.html#inspection-sse">Inspection &amp; SSE</a>
        <a href="/education/policies.html#curriculum-reform">Curriculum &amp; reform</a>
        <a href="/education/policies.html#assessment-feedback">Assessment &amp; feedback</a>
      `;
    }
  }

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

  // First click on a top-level heading opens and pins its menu. A second click
  // follows the heading link. The menu otherwise stays open until a menu item
  // is chosen, another heading is opened, or the user clicks away.
  document.querySelectorAll('.navitem > .navlabel').forEach(label => {
    label.addEventListener('click', event => {
      const item = label.closest('.navitem');
      const menu = item?.querySelector(':scope > .dropmenu');
      if (!item || !menu || item.classList.contains('is-open')) return;
      event.preventDefault();
      event.stopPropagation();
      closeNavMenus(item);
      item.classList.add('is-open');
      item.querySelectorAll('[data-nav-toggle]').forEach(toggle => toggle.setAttribute('aria-expanded', 'true'));
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
    if (window.innerWidth > 1500) closeMobileNav();
  });

  const body = document.getElementById('docBody');
  if (!body) return;

  // --- Policies ---------------------------------------------------------------
  if (/\/policies\.html$/.test(location.pathname)) {
    const library = body.querySelector('.policy-library');
    if (library) {
      if (!library.querySelector('.policy-jumpbar')) {
        const jumpbar = document.createElement('nav');
        jumpbar.className = 'policy-jumpbar';
        jumpbar.setAttribute('aria-label', 'Policy shelf shortcuts');
        jumpbar.innerHTML = `
          <a href="#my-school-reports">My Schools</a>
          <a href="#start-here">Core Documents</a>
          <a href="#inspection-sse">Inspection / SSE</a>
          <a href="#curriculum-reform">Curriculum &amp; Reform</a>
          <a href="#assessment-feedback">Assessment &amp; Feedback</a>
        `;
        const style = document.createElement('style');
        style.textContent = `
          .policy-jumpbar{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 22px;padding:10px;border:1px solid #dfe3e8;border-radius:10px;background:#fafbfc;position:sticky;top:72px;z-index:4}
          .policy-jumpbar a{padding:7px 10px;border:1px solid #d7dce2;border-radius:999px;background:#fff;color:#315b91;text-decoration:none;font-size:.78rem;font-weight:700}
          .policy-jumpbar a:hover{background:#eef4ff}
          .policy-library .school-report-preview{width:100%;height:100%;display:block;border:0;pointer-events:none;background:#fff}
          .policy-library .school-report-cover{background:#fff}
          @media(max-width:600px){.policy-jumpbar{position:static}.policy-jumpbar a{font-size:.72rem}}
        `;
        library.prepend(style);
        library.prepend(jumpbar);
      }

      if (!library.querySelector('#my-school-reports')) {
        const reportSection = document.createElement('section');
        reportSection.className = 'library-section';
        reportSection.id = 'my-school-reports';
        reportSection.innerHTML = `
          <h2>My Schools — Whole-School Reports</h2>
          <div class="library-grid">
            <a class="shelf-item" href="https://www.gov.ie/en/department-of-education/school-inspection-reports/st-patricks-comprehensive-school-2/" data-title="St Patrick's Comprehensive School — Whole School Evaluation"><div class="shelf-cover school-report-cover"><div class="shelf-placeholder doc">ST PATRICK'S<br><br>WHOLE-SCHOOL<br>EVALUATION</div><span class="shelf-badge">Interview</span></div><div class="shelf-title">St Patrick's Comprehensive — WSE</div><div class="shelf-sub">Shannon</div></a>
            <a class="shelf-item" href="https://www.gov.ie/en/department-of-education/school-inspection-reports/thomond-community-college-moylish-park-moylish-limerick-3/" data-title="Thomond Community College — Whole School Evaluation"><div class="shelf-cover school-report-cover"><div class="shelf-placeholder doc">THOMOND<br><br>WHOLE-SCHOOL<br>EVALUATION</div><span class="shelf-badge">Taught here</span></div><div class="shelf-title">Thomond Community College — WSE</div><div class="shelf-sub">Limerick</div></a>
            <a class="shelf-item" href="https://www.gov.ie/en/department-of-education/school-inspection-reports/nenagh-college-dromin-road-nenagh-tipperary-4/" data-title="Nenagh College — Whole School Evaluation"><div class="shelf-cover school-report-cover"><div class="shelf-placeholder doc">NENAGH COLLEGE<br><br>WHOLE-SCHOOL<br>EVALUATION</div><span class="shelf-badge">Taught here</span></div><div class="shelf-title">Nenagh College — WSE</div><div class="shelf-sub">Nenagh</div></a>
          </div>
        `;
        const note = library.querySelector('.library-note');
        if (note) {
          note.innerHTML = '<strong>Use this as an interview reference shelf.</strong> Start with school-specific inspection evidence, then move to the national frameworks and topic shelves below.';
          note.insertAdjacentElement('afterend', reportSection);
        } else {
          library.append(reportSection);
        }
      }

      const startHeading = library.querySelector('#start-here h2');
      if (startHeading) startHeading.textContent = 'Core National Documents';
    }
  }

  // --- Answer sections / retrieval controls ----------------------------------
  const all = Array.from(body.children);
  const starts = all.filter(el => el.tagName === 'H2');

  // A single site-wide focus layer is reused for every interview question.
  // It deliberately clones only the question and answer, then strips retrieval
  // aids/breadcrumbs so the enlarged view stays clean for oral rehearsal.
  const focusStyle = document.createElement('style');
  focusStyle.textContent = `
    .answer-focus-trigger{cursor:zoom-in;border-radius:6px;transition:background .12s ease,color .12s ease}
    .answer-focus-trigger:hover,.answer-focus-trigger:focus-visible{background:#f3f6fb;color:#174ea6;outline:none}
    body.answer-focus-open{overflow:hidden}
    .answer-focus-overlay[hidden]{display:none!important}
    .answer-focus-overlay{position:fixed;inset:0;z-index:5000;display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,36px);background:rgba(17,24,39,.68);backdrop-filter:blur(2px)}
    .answer-focus-card{position:relative;width:min(980px,100%);max-height:min(88vh,900px);overflow:auto;background:#fff;border:1px solid rgba(255,255,255,.7);border-radius:18px;box-shadow:0 24px 80px rgba(0,0,0,.34);padding:clamp(24px,4vw,50px);font-size:clamp(1.03rem,.75vw + .82rem,1.24rem);line-height:1.72}
    .answer-focus-card h2{margin:0 42px 18px 0;font-size:clamp(1.38rem,1.25vw + 1rem,2rem);line-height:1.25;cursor:zoom-out;color:#202124}
    .answer-focus-card h3{font-size:1.08em;margin-top:1.35em}
    .answer-focus-card p,.answer-focus-card li{font-size:1em;line-height:1.72}
    .answer-focus-card table{font-size:.9em}
    .answer-focus-close{position:sticky;float:right;top:0;z-index:2;width:38px;height:38px;margin:-8px -8px 0 12px;border:1px solid #d7dce2;border-radius:50%;background:#fff;color:#3c4043;font:700 1.35rem/1 Arial,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(60,64,67,.14)}
    .answer-focus-close:hover,.answer-focus-close:focus-visible{background:#f1f3f4;outline:2px solid #aecbfa;outline-offset:2px}
    .answer-focus-content>.section-content{padding-top:0}
    @media(max-width:600px){.answer-focus-overlay{padding:8px}.answer-focus-card{width:100%;max-height:94vh;border-radius:13px;padding:22px 18px;font-size:1rem}.answer-focus-card h2{margin-right:36px;font-size:1.42rem}}
    @media print{.answer-focus-overlay{display:none!important}}
  `;
  document.head.appendChild(focusStyle);

  const focusOverlay = document.createElement('div');
  focusOverlay.className = 'answer-focus-overlay';
  focusOverlay.hidden = true;
  focusOverlay.setAttribute('role', 'dialog');
  focusOverlay.setAttribute('aria-modal', 'true');
  focusOverlay.setAttribute('aria-label', 'Focused interview answer');
  focusOverlay.innerHTML = `
    <article class="answer-focus-card" tabindex="-1">
      <button class="answer-focus-close" type="button" data-focus-close aria-label="Close focused answer">×</button>
      <div class="answer-focus-content" data-focus-content></div>
    </article>
  `;
  document.body.appendChild(focusOverlay);

  const focusCard = focusOverlay.querySelector('.answer-focus-card');
  const focusContent = focusOverlay.querySelector('[data-focus-content]');
  let lastFocusTrigger = null;

  const closeFocus = () => {
    if (focusOverlay.hidden) return;
    focusOverlay.hidden = true;
    focusContent.replaceChildren();
    document.body.classList.remove('answer-focus-open');
    if (lastFocusTrigger) lastFocusTrigger.focus({ preventScroll: true });
    lastFocusTrigger = null;
  };

  const openFocus = (section, trigger) => {
    const sourceHeading = section.querySelector('.answer-heading-row h2');
    const sourceContent = section.querySelector('.section-content');
    if (!sourceHeading || !sourceContent) return;

    const headingClone = sourceHeading.cloneNode(true);
    headingClone.removeAttribute('id');
    headingClone.removeAttribute('tabindex');
    headingClone.removeAttribute('role');
    headingClone.removeAttribute('aria-haspopup');
    headingClone.classList.remove('answer-focus-trigger');
    headingClone.setAttribute('data-focus-close', '');
    headingClone.title = 'Click the question to close';

    const contentClone = sourceContent.cloneNode(true);
    contentClone.hidden = false;
    contentClone.querySelectorAll('.retrieval-chain-table,.retrieval-wall,[class*="breadcrumb"],[data-breadcrumb],a[href*="pagescms.org"]').forEach(el => el.remove());

    focusContent.replaceChildren(headingClone, contentClone);
    lastFocusTrigger = trigger;
    focusOverlay.hidden = false;
    document.body.classList.add('answer-focus-open');
    focusCard.focus({ preventScroll: true });
  };

  focusOverlay.addEventListener('click', event => {
    if (event.target === focusOverlay || event.target.closest('[data-focus-close]')) closeFocus();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !focusOverlay.hidden) closeFocus();
  });

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
    star.type = 'button';
    star.className = 'star-button';
    star.textContent = '☆';
    star.title = 'Star this answer';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.textContent = 'Hide';
    controls.append(star, toggle);
    row.appendChild(controls);

    const content = document.createElement('div');
    content.className = 'section-content';
    section.appendChild(content);
    let node = section.nextSibling;
    while (node && node.tagName !== 'H2') {
      const next = node.nextSibling;
      content.appendChild(node);
      node = next;
    }

    heading.classList.add('answer-focus-trigger');
    heading.tabIndex = 0;
    heading.setAttribute('role', 'button');
    heading.setAttribute('aria-haspopup', 'dialog');
    heading.title = 'Click to focus this answer';
    heading.addEventListener('click', () => openFocus(section, heading));
    heading.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openFocus(section, heading);
    });

    const stars = JSON.parse(localStorage.getItem('rd-education-stars') || '{}');
    if (stars[key]) {
      star.classList.add('is-starred');
      star.textContent = '★';
    }
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
