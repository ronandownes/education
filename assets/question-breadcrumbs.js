(() => {
  if (window.__rdQuestionFocusSetup) return;
  window.__rdQuestionFocusSetup = true;

  if (!Array.from(document.scripts).some(script => /\/assets\/answer-focus\.js(?:\?|$)/.test(script.src || ''))) {
    const focusScript = document.createElement('script');
    focusScript.src = new URL('answer-focus.js?v=20260817-1049', document.currentScript?.src || location.href).href;
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

  const removeLegacySectionEditLinks = () => {
    body.querySelectorAll('.section-edit-nearby').forEach(link => link.remove());
    document.getElementById('section-edit-position-style')?.remove();
    body.querySelectorAll('[data-section-edit-prepared]').forEach(heading => {
      delete heading.dataset.sectionEditPrepared;
    });
  };

  const clean = () => {
    removeSections();
    removeCountedWordWalls();
    stripManualAnswerBolding();
    pruneNavigation();
    removeRetrievalControls();
    removeLegacySectionEditLinks();
  };

  clean();

  const observer = new MutationObserver(clean);
  observer.observe(document.body, { childList: true, subtree: true });
})();
