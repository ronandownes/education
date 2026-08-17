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

  const generalAnswerHeadings = {
    '/teaching-learning.html': 'General approach',
    '/classroom-management.html': 'Good classroom management',
    '/sen-inclusion.html': 'General approach',
    '/differentiation-accessibility.html': 'General approach',
    '/assessment-reporting.html': 'Assess learning',
    '/planning-curriculum.html': 'General approach',
    '/relationships-wellbeing.html': 'Relationships & learning',
    '/professional-practice.html': 'Professional responsibility'
  };

  const currentDomainPath = Object.keys(generalAnswerHeadings).find(path => location.pathname.endsWith(path));

  const removableHeading = text => {
    const value = (text || '').replace(/\s+/g, ' ').trim();
    return /word wall/i.test(value)
      || /concepts?\s+(?:&|and)\s+questions/i.test(value)
      || /retrieval\s+(?:draft|chains?|map|table)/i.test(value);
  };

  const normaliseHeading = value => (value || '')
    .replace(/^\s*\d+[.)]?\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();

  const isInterviewHeading = heading => {
    const value = normaliseHeading(heading?.textContent);
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

  const simplifyProfessionalResponsibilityAudio = () => {
    if (!location.pathname.endsWith('/professional-practice.html')) return;

    document.querySelectorAll('.cm-audio-launchers button').forEach(button => {
      const label = [button.textContent, button.title, button.getAttribute('aria-label')]
        .filter(Boolean)
        .join(' ');

      if (/PR\s+Word\s+Wall|PR\s+Concepts/i.test(label)) {
        button.remove();
        return;
      }

      if (/PR\s+Interview\s+Questions/i.test(label) && button.textContent !== 'Listen') {
        button.textContent = 'Listen';
        button.title = 'Listen to Professional Responsibility interview questions and answers';
        button.setAttribute('aria-label', 'Listen to Professional Responsibility interview questions and answers');
      }
    });
  };

  const answerAfter = heading => {
    let node = heading?.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      if (node.matches?.('p, ul, ol, blockquote') && node.textContent.trim()) return node.textContent.replace(/\s+/g, ' ').trim();
      node = node.nextElementSibling;
    }
    return '';
  };

  const putGeneralAnswerInIntroduction = () => {
    if (!currentDomainPath) return;
    const wanted = generalAnswerHeadings[currentDomainPath].toLowerCase();
    const heading = Array.from(body.querySelectorAll(':scope > h2')).find(item => {
      const text = normaliseHeading(item.textContent).toLowerCase();
      return text === wanted || text.startsWith(`${wanted} —`) || text.startsWith(`${wanted} -`);
    });
    const answer = answerAfter(heading);
    if (!answer) return;

    const paper = document.querySelector('.doc-paper');
    const toolbar = paper?.querySelector('.doc-toolbar');
    if (!paper || !toolbar) return;

    let intro = paper.querySelector(':scope > .doc-intro');
    if (!intro) {
      intro = document.createElement('p');
      intro.className = 'doc-intro';
      paper.insertBefore(intro, toolbar);
    }

    if (intro.textContent.trim() !== answer) intro.textContent = answer;
  };

  const setupFloatingEdit = () => {
    let floating = document.getElementById('floating-section-edit');
    const topEdit = document.querySelector('.doc-toolbar .edit-link');
    const cmsBase = topEdit?.href?.split('#')[0] || floating?.dataset.cmsBase;
    if (!cmsBase) return;

    if (!document.getElementById('floating-section-edit-style')) {
      const style = document.createElement('style');
      style.id = 'floating-section-edit-style';
      style.textContent = `
#floating-section-edit{
  position:fixed;
  right:18px;
  top:50%;
  transform:translateY(-50%);
  z-index:1200;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:42px;
  padding:9px 13px;
  border:1px solid #b9c9dc;
  border-radius:9px;
  background:rgba(255,255,255,.96);
  box-shadow:0 5px 18px rgba(23,43,77,.16);
  color:#204f83;
  font:600 15px/1.1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  text-decoration:none;
  backdrop-filter:blur(6px);
}
#floating-section-edit:hover,#floating-section-edit:focus-visible{background:#f4f8fc;border-color:#8eabc9;outline:none}
@media(max-width:760px){
  #floating-section-edit{top:auto;right:12px;bottom:12px;transform:none;min-height:40px;padding:8px 11px;font-size:14px}
}
@media print{#floating-section-edit{display:none!important}}
`;
      document.head.appendChild(style);
    }

    if (!floating) {
      floating = document.createElement('a');
      floating.id = 'floating-section-edit';
      floating.textContent = 'Edit here';
      floating.target = '_blank';
      floating.rel = 'noopener';
      floating.setAttribute('aria-label', 'Edit the section currently in view');
      document.body.appendChild(floating);
    }

    floating.dataset.cmsBase = cmsBase;
    topEdit?.remove();

    if (floating.dataset.scrollTracking === 'true') return;
    floating.dataset.scrollTracking = 'true';

    let ticking = false;
    const updateTarget = () => {
      ticking = false;
      const headings = Array.from(body.querySelectorAll(':scope > h2'))
        .filter(heading => !removableHeading(heading.textContent));
      const marker = Math.min(window.innerHeight * 0.38, 300);
      let active = headings[0] || null;
      headings.forEach(heading => {
        if (heading.getBoundingClientRect().top <= marker) active = heading;
      });

      const label = normaliseHeading(active?.textContent);
      const base = floating.dataset.cmsBase;
      floating.href = label ? `${base}#:~:text=${encodeURIComponent(label)}` : base;
      floating.title = label ? `Edit near “${label}”` : 'Edit this page';
    };

    const queueUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateTarget);
    };

    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    updateTarget();
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
    simplifyProfessionalResponsibilityAudio();
    putGeneralAnswerInIntroduction();
    removeLegacySectionEditLinks();
    setupFloatingEdit();
  };

  clean();

  const observer = new MutationObserver(clean);
  observer.observe(document.body, { childList: true, subtree: true });
})();