(() => {
  if (window.__rdQuestionFocusSetup) return;
  window.__rdQuestionFocusSetup = true;

  if (!Array.from(document.scripts).some(script => /\/assets\/answer-focus\.js(?:\?|$)/.test(script.src || ''))) {
    const focusScript = document.createElement('script');
    focusScript.src = new URL('answer-focus.js?v=20260817-1024', document.currentScript?.src || location.href).href;
    focusScript.dataset.answerFocus = 'true';
    document.head.appendChild(focusScript);
  }

  const body = document.getElementById('docBody');
  if (!body) return;

  const removableHeading = text => {
    const value = (text || '').replace(/\s+/g, ' ').trim();
    return /word wall/i.test(value)
      || /concepts?\s+(?:&|and)\s+questions/i.test(value)
      || /retrieval\s+(?:draft|chains?|map|table)/i.test(value);
  };

  const isInterviewHeading = heading => {
    const value = (heading?.textContent || '').replace(/\s+/g, ' ').trim();
    return heading?.tagName === 'H2'
      && /\s+—\s+/.test(value)
      && !removableHeading(value);
  };

  const removeSections = () => {
    const headings = Array.from(body.querySelectorAll(':scope > h2'));
    headings.forEach(heading => {
      if (!removableHeading(heading.textContent)) return;
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'H2') {
        const next = node.nextElementSibling;
        node.remove();
        node = next;
      }
      heading.remove();
    });
  };

  const removeCountedWordWalls = () => {
    body.querySelectorAll(':scope > table').forEach(table => {
      const matches = table.textContent.match(/\(\d+\)/g) || [];
      if (matches.length >= 3) table.remove();
    });
  };

  const unwrap = element => element.replaceWith(...element.childNodes);

  const stripManualAnswerBolding = () => {
    Array.from(body.querySelectorAll(':scope > h2')).forEach(heading => {
      if (!isInterviewHeading(heading)) return;
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'H2') {
        const next = node.nextElementSibling;
        node.querySelectorAll?.('strong,b').forEach(unwrap);
        if (node.matches?.('strong,b')) unwrap(node);
        node = next;
      }
    });
  };

  const pruneNavigation = () => {
    document.querySelectorAll('.dropmenu a').forEach(link => {
      if (removableHeading(link.textContent)) link.remove();
    });
  };

  const removeRetrievalControls = () => {
    document.querySelectorAll('.cm-audio-launchers button').forEach(button => {
      const label = [
        button.textContent,
        button.title,
        button.getAttribute('aria-label')
      ].filter(Boolean).join(' ');
      if (/breadcrumb|retrieval\s+(chain|map|draft|table)/i.test(label)) button.remove();
    });

    document.querySelectorAll('.cm-audio-launchers').forEach(group => {
      if (group.querySelectorAll('button').length < 4) group.classList.remove('is-four-up');
    });
  };

  const clean = () => {
    removeSections();
    removeCountedWordWalls();
    stripManualAnswerBolding();
    pruneNavigation();
    removeRetrievalControls();
  };

  const ensureSectionEditStyle = () => {
    if (document.getElementById('section-edit-position-style')) return;
    const style = document.createElement('style');
    style.id = 'section-edit-position-style';
    style.textContent = `
      .section-edit-nearby{
        display:block;
        width:max-content;
        margin:3px 0 18px auto;
        padding:4px 8px;
        border:1px solid #dadce0;
        border-radius:4px;
        background:#fff;
        color:#3c4043;
        text-decoration:none;
        font-size:.74rem;
        line-height:1.15;
        font-weight:500;
      }
      .section-edit-nearby:hover,.section-edit-nearby:focus-visible{
        background:#f8f9fa;
        border-color:#bdc1c6;
        outline:none;
      }
      @media(max-width:700px){.section-edit-nearby{margin:4px 0 16px auto;font-size:.72rem}}
      @media print{.section-edit-nearby{display:none!important}}
    `;
    document.head.appendChild(style);
  };

  const addSectionEditLinks = () => {
    const pageEdit = document.querySelector('.doc-toolbar .edit-link[href]');
    if (!pageEdit?.href) return;
    const cmsBase = pageEdit.href.split('#')[0];

    Array.from(body.querySelectorAll(':scope > h2')).forEach(heading => {
      if (!isInterviewHeading(heading) || heading.dataset.sectionEditPrepared === 'true') return;

      const sourceHeading = (heading.textContent || '').replace(/\s+/g, ' ').trim();
      const link = document.createElement('a');
      link.className = 'section-edit-nearby';
      link.href = `${cmsBase}#:~:text=${encodeURIComponent(sourceHeading)}`;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Edit here';
      link.title = `Open this section in Pages CMS near “${sourceHeading}”`;

      let last = heading;
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'H2') {
        if (!node.matches('.section-edit-nearby')) last = node;
        node = node.nextElementSibling;
      }
      last.insertAdjacentElement('afterend', link);
      heading.dataset.sectionEditPrepared = 'true';
    });
  };

  const refresh = () => {
    clean();
    ensureSectionEditStyle();
    addSectionEditLinks();
  };

  refresh();

  const observer = new MutationObserver(refresh);
  observer.observe(document.body, { childList: true, subtree: true });
})();
