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

  const normalise = value => (value || '')
    .replace(/^\s*\d+[.)]?\s+/, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const isRetrievalHeading = heading =>
    /retrieval\s+(chains?|draft|map|table)/i.test(heading?.textContent || '');

  const rememberQuestion = heading => {
    if (heading.dataset.interviewConcept && heading.dataset.interviewQuestion) {
      return { concept: heading.dataset.interviewConcept, question: heading.dataset.interviewQuestion };
    }
    const text = (heading.textContent || '').trim();
    const parts = text.split(/\s+—\s+/);
    if (parts.length < 2) return null;
    const concept = parts.shift().trim();
    const question = parts.join(' — ').trim();
    if (!concept || !question) return null;
    heading.dataset.interviewConcept = concept;
    heading.dataset.interviewQuestion = question;
    return { concept, question };
  };

  const hideConceptPrefix = (heading, concept) => {
    if (!heading || !concept || heading.dataset.conceptHidden === 'true') return;
    const escaped = concept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefix = new RegExp(`^\\s*${escaped}\\s+—\\s+`);
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('button')) continue;
      if (!prefix.test(node.nodeValue || '')) continue;
      node.nodeValue = (node.nodeValue || '').replace(prefix, '');
      heading.dataset.conceptHidden = 'true';
      break;
    }
  };

  const compactMenuLinks = () => {
    document.querySelectorAll('.topnav .dropmenu a[href*="#"]').forEach(link => {
      if (link.dataset.menuPage !== undefined) return;
      const raw = (link.textContent || '').trim();
      if (!raw) return;
      const parts = raw.split(/\s+—\s+/);
      if (parts.length > 1) link.textContent = parts[0].trim();
    });
  };

  const addNearbyEditLinks = () => {
    const pageEdit = document.querySelector('.doc-toolbar .edit-link[href]');
    if (!pageEdit?.href) return;
    body.querySelectorAll(':scope > h2').forEach(heading => {
      if (heading.dataset.sectionEditPrepared === 'true') return;
      if (isRetrievalHeading(heading)) return;
      const remembered = rememberQuestion(heading);
      const sourceHeading = remembered
        ? `${remembered.concept} — ${remembered.question}`
        : (heading.textContent || '').trim();
      if (!sourceHeading) return;
      const cmsBase = pageEdit.href.split('#')[0];
      const link = document.createElement('a');
      link.className = 'section-edit-nearby';
      link.href = `${cmsBase}#:~:text=${encodeURIComponent(sourceHeading)}`;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Edit here';
      link.title = `Open this section in Pages CMS near “${sourceHeading}”`;
      heading.insertAdjacentElement('afterend', link);
      heading.dataset.sectionEditPrepared = 'true';
    });
  };

  const ensureStyle = () => {
    let style = document.getElementById('question-breadcrumb-style');
    if (style) style.remove();
    style = document.createElement('style');
    style.id = 'question-breadcrumb-style';
    style.textContent = `
      .question-breadcrumb-line,
      .retrieval-appendix-break,
      .retrieval-appendix-table,
      .retrieval-chain-table,
      .retrieval-wall,
      [class*="breadcrumb"],
      [data-breadcrumb]{display:none!important}
      .interview-appendix-source{display:none!important}
      .section-edit-nearby{display:block;width:max-content;margin:-2px 0 7px auto;padding:4px 8px;border:1px solid #dadce0;border-radius:4px;background:#fff;color:#3c4043;text-decoration:none;font-size:.74rem;line-height:1.15;font-weight:500}
      .section-edit-nearby:hover,.section-edit-nearby:focus-visible{background:#f8f9fa;border-color:#bdc1c6;outline:none}
      @media(max-width:700px){.section-edit-nearby{margin:1px 0 7px auto;font-size:.72rem}}
      @media print{.section-edit-nearby{display:none!important}}
    `;
    document.head.appendChild(style);
  };

  const hideOldRetrievalSections = () => {
    Array.from(body.querySelectorAll('h2')).forEach(heading => {
      const label = (heading.textContent || '').trim();
      if (/word wall$/i.test(label) || /concepts and questions$/i.test(label)) {
        const section = heading.closest('.answer-section');
        if (section) section.classList.add('interview-appendix-source');
      }
      if (!isRetrievalHeading(heading)) return;
      const section = heading.closest('.answer-section');
      if (section) {
        section.classList.add('retrieval-appendix-break');
        return;
      }
      heading.classList.add('retrieval-appendix-break');
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'H2') {
        node.classList.add('retrieval-appendix-break');
        node = node.nextElementSibling;
      }
    });
  };

  const prepareQuestions = () => {
    Array.from(body.querySelectorAll('h2')).forEach(heading => {
      if (isRetrievalHeading(heading)) return;
      const remembered = rememberQuestion(heading);
      if (remembered) hideConceptPrefix(heading, remembered.concept);
    });
  };

  const unwrap = element => element.replaceWith(...element.childNodes);

  const stripManualAnswerBolding = () => {
    Array.from(body.querySelectorAll(':scope > h2')).forEach(heading => {
      if (!rememberQuestion(heading) || isRetrievalHeading(heading)) return;
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'H2') {
        if (!node.matches?.('.section-edit-nearby')) {
          node.querySelectorAll?.('strong,b').forEach(unwrap);
          if (node.matches?.('strong,b')) unwrap(node);
        }
        node = heading.nextElementSibling;
        while (node && node.matches?.('.section-edit-nearby')) node = node.nextElementSibling;
        if (node && node.tagName !== 'H2') {
          let cursor = node.nextElementSibling;
          while (cursor && cursor.matches?.('.section-edit-nearby')) cursor = cursor.nextElementSibling;
          node = cursor;
        }
      }
    });
  };

  const removeRetrievalControls = () => {
    document.querySelectorAll('.cm-audio-launchers button').forEach(button => {
      const label = [button.textContent, button.title, button.getAttribute('aria-label')].filter(Boolean).join(' ');
      if (/breadcrumb|retrieval\s+(chain|map|draft|table)/i.test(label)) button.remove();
    });
    document.querySelectorAll('.cm-audio-launchers').forEach(group => {
      if (group.querySelectorAll('button').length < 4) group.classList.remove('is-four-up');
    });
  };

  const run = () => {
    ensureStyle();
    hideOldRetrievalSections();
    prepareQuestions();
    stripManualAnswerBolding();
    addNearbyEditLinks();
    compactMenuLinks();
    removeRetrievalControls();
  };

  run();
  requestAnimationFrame(run);
  window.setTimeout(run, 250);
  window.setTimeout(run, 900);
  window.addEventListener('load', run, { once: true });

  const observer = new MutationObserver(() => {
    removeRetrievalControls();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
