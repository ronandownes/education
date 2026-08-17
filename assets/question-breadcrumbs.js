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

  const interviewPaths = [
    '/teaching-learning.html',
    '/classroom-management.html',
    '/sen-inclusion.html',
    '/differentiation-accessibility.html',
    '/assessment-reporting.html',
    '/planning-curriculum.html',
    '/relationships-wellbeing.html',
    '/professional-practice.html'
  ];
  const isInterviewPage = interviewPaths.some(path => location.pathname.endsWith(path));

  const removableHeading = text => {
    const value = (text || '').replace(/\s+/g, ' ').trim();
    return /word wall/i.test(value)
      || /question wall/i.test(value)
      || /concepts?\s+(?:&|and)\s+questions/i.test(value)
      || /question bank/i.test(value)
      || /retrieval\s+(?:draft|chains?|map|table)/i.test(value);
  };

  const isInterviewHeading = heading => {
    const value = (heading?.textContent || '').replace(/\s+/g, ' ').trim();
    return heading?.tagName === 'H2'
      && /\s+—\s+/.test(value)
      && !removableHeading(value);
  };

  const removeSections = () => {
    Array.from(body.querySelectorAll(':scope > h2')).forEach(heading => {
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

  const removeTables = () => {
    if (!isInterviewPage) return;
    body.querySelectorAll(':scope > table, :scope > .retrieval-wall, :scope > .retrieval-chain-table').forEach(node => node.remove());
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

  const removeEditHereLinks = () => {
    document.querySelectorAll('.section-edit-nearby').forEach(link => link.remove());
    body.querySelectorAll('a').forEach(link => {
      if (/^edit\s+here$/i.test((link.textContent || '').trim())) link.remove();
    });
  };

  const pruneNavigation = () => {
    document.querySelectorAll('.dropmenu a').forEach(link => {
      if (removableHeading(link.textContent)) link.remove();
    });
  };

  const cleanAudioLaunchers = () => {
    document.querySelectorAll('.cm-audio-launchers').forEach(group => group.remove());
  };

  const ensureTitleToolbarStyle = () => {
    if (document.getElementById('simple-title-toolbar-style')) return;
    const style = document.createElement('style');
    style.id = 'simple-title-toolbar-style';
    style.textContent = `
      .doc-title-row{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin:0 0 12px}
      .doc-title-row>h1{margin:0!important;flex:1 1 420px}
      .doc-title-row>.doc-toolbar{flex:0 0 auto;margin:0!important;padding:0!important;border:0!important;gap:7px}
      .doc-title-row+.doc-intro{margin-top:0}
      @media(max-width:600px){.doc-title-row{align-items:flex-start}.doc-title-row>h1{flex-basis:100%}.doc-title-row>.doc-toolbar{width:100%}}
      @media print{.doc-title-row>.doc-toolbar{display:none!important}}
    `;
    document.head.appendChild(style);
  };

  const getSpeakableSections = () => Array.from(body.querySelectorAll(':scope > h2'))
    .filter(isInterviewHeading)
    .map(heading => {
      const parts = (heading.textContent || '').replace(/\s+/g, ' ').trim().split(/\s+—\s+/);
      const question = (parts.length > 1 ? parts.slice(1).join(' — ') : parts[0]).trim();
      const answerParts = [];
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'H2') {
        if (!node.matches('.section-edit-nearby, table, .retrieval-wall, .retrieval-chain-table')) {
          const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
          if (text) answerParts.push(text);
        }
        node = node.nextElementSibling;
      }
      return `${question}. ${answerParts.join(' ')}`.trim();
    })
    .filter(Boolean);

  const prepareSimpleToolbar = () => {
    const paper = document.querySelector('.doc-paper');
    const heading = paper?.querySelector(':scope > h1');
    const toolbar = paper?.querySelector(':scope > .doc-toolbar');
    if (!paper || !heading || !toolbar) return;

    ensureTitleToolbarStyle();

    let row = paper.querySelector(':scope > .doc-title-row');
    if (!row) {
      row = document.createElement('div');
      row.className = 'doc-title-row';
      paper.insertBefore(row, heading);
      row.append(heading, toolbar);
    }

    const edit = toolbar.querySelector('.edit-link');
    if (edit) edit.textContent = 'Edit';

    let listen = toolbar.querySelector('[data-action="listen"]');
    if (!listen) {
      listen = document.createElement('button');
      listen.type = 'button';
      listen.dataset.action = 'listen';
      listen.textContent = 'Listen';
      toolbar.prepend(listen);
    } else {
      listen.textContent = 'Listen';
    }

    if (listen.dataset.bound === 'true') return;
    listen.dataset.bound = 'true';

    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
      listen.disabled = true;
      return;
    }

    let runId = 0;
    const stop = () => {
      runId += 1;
      synth.cancel();
      listen.setAttribute('aria-pressed', 'false');
    };

    const play = () => {
      stop();
      const segments = getSpeakableSections();
      if (!segments.length) return;
      const session = runId;
      let index = 0;
      listen.setAttribute('aria-pressed', 'true');

      const speakNext = () => {
        if (session !== runId || index >= segments.length) {
          listen.setAttribute('aria-pressed', 'false');
          return;
        }
        const utterance = new SpeechSynthesisUtterance(segments[index++]);
        utterance.lang = 'en-IE';
        utterance.rate = 0.95;
        utterance.onend = speakNext;
        utterance.onerror = event => {
          if (!['canceled', 'interrupted'].includes(event.error)) speakNext();
        };
        synth.speak(utterance);
      };
      speakNext();
    };

    listen.addEventListener('click', () => {
      if (synth.speaking || synth.pending || synth.paused) stop();
      else play();
    });
    window.addEventListener('beforeunload', stop, { once: true });
  };

  const clean = () => {
    removeSections();
    removeTables();
    stripManualAnswerBolding();
    removeEditHereLinks();
    pruneNavigation();
    cleanAudioLaunchers();
    prepareSimpleToolbar();
  };

  clean();

  let cleaning = false;
  const observer = new MutationObserver(() => {
    if (cleaning) return;
    cleaning = true;
    clean();
    cleaning = false;
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
