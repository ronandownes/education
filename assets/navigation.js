(() => {
  const topbar = document.querySelector('.topbar');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  if (!topbar || !mobileNavToggle) return;

  const brand = document.querySelector('.brand');
  const siteRoot = brand?.href || `${location.origin}/`;
  const siteHref = path => new URL(path.replace(/^\/+/, ''), siteRoot).href;

  // Interview dropdowns are reading/rehearsal tools. On a desktop, use nearly the
  // full available screen height so long 24-question banks remain visible without
  // an unnecessary small internal scroll box.
  const interviewMenuStyle = document.createElement('style');
  interviewMenuStyle.textContent = '@media (min-width:1501px){.topnav .dropmenu{max-height:calc(100vh - 92px)!important;overflow-y:auto!important;}}';
  document.head.appendChild(interviewMenuStyle);

  // Keep the information architecture compact: Profiles contains class and school
  // profiles; Glossary and Timeline are no longer permanent top-level items.
  const profilesItem = document.querySelector('.nav-classes');
  if (profilesItem) {
    profilesItem.classList.add('nav-profiles');
    const label = profilesItem.querySelector(':scope > .navlabel');
    const toggle = profilesItem.querySelector(':scope > [data-nav-toggle]');
    const menu = profilesItem.querySelector(':scope > .dropmenu');

    if (label) {
      label.href = siteHref('content/profiles.html');
      const text = label.querySelector('span');
      if (text) text.textContent = 'Profiles';
    }
    if (toggle) toggle.setAttribute('aria-label', 'Open Profiles menu');

    if (menu) {
      const addProfileLink = (href, text) => {
        if (Array.from(menu.querySelectorAll('a')).some(link => link.href === href)) return;
        const link = document.createElement('a');
        link.href = href;
        link.textContent = text;
        link.dataset.menuPage = '';
        menu.insertBefore(link, menu.firstChild);
      };

      addProfileLink(siteHref('content/schools/st-patricks.html'), "School Profiles — St Patrick's Comprehensive");
      addProfileLink(siteHref('teaching/class-profiles.html'), 'Class Profiles — overview');
    }
  }

  // Professional Responsibility is an interview-question bank, not a shelf of
  // separate pages. Keep useful material as H2 sections on the page itself.
  const professionalMenu = document.querySelector('.nav-professional > .dropmenu');
  professionalMenu?.querySelectorAll('a').forEach(link => {
    const url = new URL(link.href, location.href);
    if (
      url.pathname.endsWith('/timeline.html') ||
      url.pathname.endsWith('/school-research.html') ||
      url.pathname.endsWith('/content/schools/st-patricks.html')
    ) {
      link.remove();
    }
  });

  document.querySelector('.nav-glossary')?.remove();
  document.querySelector('.nav-timeline')?.remove();

  // Keep the old /timeline.html URL working, but stop presenting the page as a
  // "Timeline" now that its useful role is an evidence bank for experience.
  if (location.pathname.endsWith('/timeline.html')) {
    document.title = document.title.replace(/^Timeline(?=\s*\|)/, 'Teaching Experience');
    const pageHeading = document.querySelector('main h1');
    if (pageHeading && pageHeading.textContent.trim() === 'Timeline') {
      pageHeading.textContent = 'Teaching Experience';
    }
    const kicker = document.querySelector('.doc-kicker');
    if (kicker && kicker.textContent.trim().toUpperCase() === 'TIMELINE') {
      kicker.textContent = 'PROFESSIONAL EVIDENCE';
    }
  }

  // Teaching & Learning uses "chunk" three times in the current interview answers.
  // Surface that settled language in the live Word Wall and visually reinforce the
  // same term in the answers.
  if (location.pathname.endsWith('/teaching-learning.html')) {
    const body = document.getElementById('docBody');
    if (body) {
      const wallHeading = Array.from(body.querySelectorAll('h2')).find(
        heading => heading.textContent.trim() === 'Teaching & Learning Word Wall'
      );
      const wall = wallHeading?.nextElementSibling;
      if (wall?.tagName === 'TABLE') {
        const headers = Array.from(wall.querySelectorAll('thead th'));
        const teachIndex = headers.findIndex(header => header.textContent.trim() === 'Teach');
        if (teachIndex >= 0) {
          const rows = Array.from(wall.querySelectorAll('tbody tr'));
          const alreadyPresent = rows.some(row =>
            row.children[teachIndex]?.textContent.trim().toLowerCase().startsWith('chunk')
          );
          if (!alreadyPresent) {
            let targetCell = rows
              .map(row => row.children[teachIndex])
              .find(cell => cell && !cell.textContent.trim());

            if (!targetCell) {
              const row = document.createElement('tr');
              headers.forEach(() => row.appendChild(document.createElement('td')));
              wall.querySelector('tbody')?.appendChild(row);
              targetCell = row.children[teachIndex];
            }
            if (targetCell) targetCell.textContent = 'Chunk (3)';
          }
        }
      }

      const textNodes = [];
      const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!/\bchunk\b/i.test(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent || parent.closest('strong, a, code, table')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      while (walker.nextNode()) textNodes.push(walker.currentNode);

      textNodes.forEach(node => {
        const parts = node.nodeValue.split(/(\bchunk\b)/gi);
        if (parts.length < 2) return;
        const fragment = document.createDocumentFragment();
        parts.forEach(part => {
          if (/^chunk$/i.test(part)) {
            const strong = document.createElement('strong');
            strong.textContent = part;
            fragment.appendChild(strong);
          } else {
            fragment.appendChild(document.createTextNode(part));
          }
        });
        node.replaceWith(fragment);
      });
    }
  }

  // The document layout rebuilds question menus from the current rendered headings.
  // Before that async rebuild finishes, make every old hard-coded hash a safe page
  // fallback rather than leaving a stale/dead anchor clickable.
  document.querySelectorAll('.topnav .dropmenu a[href*="#"]').forEach(link => {
    const url = new URL(link.href, location.href);
    link.href = `${url.pathname}${url.search}`;
  });

  const closeSubmenus = (except = null) => {
    document.querySelectorAll('.navitem.is-open').forEach(item => {
      if (item === except) return;
      item.classList.remove('is-open');
      item.querySelectorAll('[data-nav-toggle]').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
      });
    });
  };

  const closeMobileNav = () => {
    topbar.classList.remove('nav-open');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNavToggle.setAttribute('aria-label', 'Open main navigation');
    closeSubmenus();
  };

  mobileNavToggle.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    const willOpen = !topbar.classList.contains('nav-open');
    topbar.classList.toggle('nav-open', willOpen);
    mobileNavToggle.setAttribute('aria-expanded', String(willOpen));
    mobileNavToggle.setAttribute('aria-label', willOpen ? 'Close main navigation' : 'Open main navigation');
    if (!willOpen) closeSubmenus();
  });

  document.querySelectorAll('.navitem > .navlabel').forEach(label => {
    label.addEventListener('click', event => {
      if (window.innerWidth > 1500) return;
      const item = label.closest('.navitem');
      const menu = item?.querySelector(':scope > .dropmenu');
      if (!item || !menu || item.classList.contains('is-open')) return;
      event.preventDefault();
      event.stopPropagation();
      closeSubmenus(item);
      item.classList.add('is-open');
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.topbar')) closeMobileNav();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMobileNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1500) closeMobileNav();
  });
})();
