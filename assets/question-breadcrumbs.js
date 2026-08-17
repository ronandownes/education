(() => {
  if (window.__rdQuestionFocusSetup) return;
  window.__rdQuestionFocusSetup = true;

  if (!Array.from(document.scripts).some(script => /\/assets\/answer-focus\.js(?:\?|$)/.test(script.src || ''))) {
    const focusScript = document.createElement('script');
    focusScript.src = new URL('answer-focus.js?v=20260817-1115', document.currentScript?.src || location.href).href;
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

  const generalAnswerFallbacks = {
    '/professional-practice.html': 'My general approach to professional responsibility is to be reliable, prepared and accountable, act with integrity and professional judgement, follow policy and safeguarding procedures, collaborate well with colleagues and families, contribute to the wider life of the school, and keep improving through reflection and professional learning.'
  };

  const currentDomainPath = Object.keys(generalAnswerHeadings).find(path => location.pathname.endsWith(path));
  const wallStorageKey = `rd-personal-word-wall::${currentDomainPath || location.pathname}`;

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

  const sectionNodesAfter = heading => {
    const sectionContent = heading?.closest('.answer-section')?.querySelector('.section-content');
    if (sectionContent) return Array.from(sectionContent.children);
    const nodes = [];
    let node = heading?.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      if (!node.closest?.('.personal-word-wall')) nodes.push(node);
      node = node.nextElementSibling;
    }
    return nodes;
  };

  const sectionTextAfter = heading => sectionNodesAfter(heading)
    .map(node => node.textContent || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const isAnswerHeading = heading => {
    if (!heading || heading.tagName !== 'H2') return false;
    const value = normaliseHeading(heading.textContent);
    if (!value || removableHeading(value) || heading.closest('.personal-word-wall')) return false;
    return Boolean(sectionTextAfter(heading));
  };

  const isInterviewHeading = heading => isAnswerHeading(heading);

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
      sectionNodesAfter(heading).forEach(node => {
        node.querySelectorAll?.('strong,b').forEach(unwrap);
        if (node.matches?.('strong,b')) unwrap(node);
      });
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

      if (/PR\s+Concepts/i.test(label)) {
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
    const nodes = sectionNodesAfter(heading);
    const node = nodes.find(item => item.matches?.('p, ul, ol, blockquote') && item.textContent.trim());
    return node ? node.textContent.replace(/\s+/g, ' ').trim() : '';
  };

  const putGeneralAnswerInIntroduction = () => {
    if (!currentDomainPath) return;
    const wanted = generalAnswerHeadings[currentDomainPath].toLowerCase();
    const heading = Array.from(body.querySelectorAll(':scope > h2')).find(item => {
      const text = normaliseHeading(item.textContent).toLowerCase();
      return text === wanted || text.startsWith(`${wanted} —`) || text.startsWith(`${wanted} -`);
    });
    const answer = answerAfter(heading) || generalAnswerFallbacks[currentDomainPath] || '';
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

  const setupFloatingPageTools = () => {
    const topEdit = document.querySelector('.doc-toolbar .edit-link[href]');
    const oldFloating = document.getElementById('floating-section-edit');
    const cmsBase = topEdit?.href?.split('#')[0] || oldFloating?.dataset.cmsBase || document.getElementById('floating-section-edit')?.dataset.cmsBase;
    if (!cmsBase) return;

    if (!document.getElementById('floating-page-tools-style')) {
      const style = document.createElement('style');
      style.id = 'floating-page-tools-style';
      style.textContent = `
#floating-page-tools{position:fixed;right:18px;top:50%;transform:translateY(-50%);z-index:1200;display:grid;gap:8px}
#floating-page-tools a,#floating-page-tools button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 13px;border:1px solid #b9c9dc;border-radius:9px;background:rgba(255,255,255,.96);box-shadow:0 5px 18px rgba(23,43,77,.16);color:#204f83;font:600 15px/1.1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-decoration:none;backdrop-filter:blur(6px);cursor:pointer}
#floating-page-tools a:hover,#floating-page-tools a:focus-visible,#floating-page-tools button:hover,#floating-page-tools button:focus-visible{background:#f4f8fc;border-color:#8eabc9;outline:none}
@media(max-width:760px){#floating-page-tools{top:auto;right:12px;bottom:12px;transform:none;display:flex}#floating-page-tools a,#floating-page-tools button{min-height:40px;padding:8px 11px;font-size:14px}}
@media print{#floating-page-tools{display:none!important}}
`;
      document.head.appendChild(style);
    }

    let rail = document.getElementById('floating-page-tools');
    if (!rail) {
      rail = document.createElement('div');
      rail.id = 'floating-page-tools';
      rail.setAttribute('aria-label', 'Page tools');
      document.body.appendChild(rail);
    }

    let floating = document.getElementById('floating-section-edit');
    if (!floating) {
      floating = document.createElement('a');
      floating.id = 'floating-section-edit';
      floating.textContent = 'Edit here';
      floating.target = '_blank';
      floating.rel = 'noopener';
      floating.setAttribute('aria-label', 'Edit the section currently in view');
    }
    if (floating.parentElement !== rail) rail.prepend(floating);
    floating.dataset.cmsBase = cmsBase;

    let print = document.getElementById('floating-page-print');
    if (!print) {
      print = document.createElement('button');
      print.id = 'floating-page-print';
      print.type = 'button';
      print.textContent = 'Print';
      print.setAttribute('aria-label', 'Print this page');
      print.addEventListener('click', () => window.print());
      rail.appendChild(print);
    }

    if (topEdit) {
      topEdit.hidden = true;
      topEdit.dataset.floatingSource = 'true';
    }
    const topPrint = document.querySelector('.doc-toolbar [data-action="print"]');
    if (topPrint) {
      topPrint.hidden = true;
      topPrint.dataset.floatingSource = 'true';
    }

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

  const questionForHeading = heading => {
    const value = normaliseHeading(heading.textContent);
    const parts = value.split(/\s+—\s+/);
    return parts.length > 1 ? parts.slice(1).join(' — ').trim() : value;
  };

  const tagAnswerHeadings = () => {
    body.querySelectorAll(':scope > h2').forEach(heading => {
      if (!isAnswerHeading(heading)) return;
      if (!heading.dataset.interviewQuestion) heading.dataset.interviewQuestion = questionForHeading(heading);
      const value = normaliseHeading(heading.textContent);
      const parts = value.split(/\s+—\s+/);
      if (parts.length > 1 && !heading.dataset.interviewConcept) heading.dataset.interviewConcept = parts[0].trim();
    });
  };

  let quickButton = null;
  let quickUtterance = null;
  const resetQuickAudio = () => {
    quickButton?.classList.remove('is-active', 'is-paused');
    quickButton = null;
    quickUtterance = null;
  };

  const ensureInlinePlayButtons = () => {
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;

    body.querySelectorAll(':scope > h2').forEach(heading => {
      if (!isAnswerHeading(heading) || heading.querySelector(':scope > .cm-question-play')) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cm-question-play';
      const question = questionForHeading(heading);
      button.setAttribute('aria-label', `Play question and answer: ${question}`);
      button.title = 'Play question and answer';

      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        if (quickButton === button && synth.speaking) {
          if (synth.paused) {
            synth.resume();
            button.classList.remove('is-paused');
          } else {
            synth.pause();
            button.classList.add('is-paused');
          }
          return;
        }

        synth.cancel();
        resetQuickAudio();
        const answer = sectionTextAfter(heading);
        if (!answer) return;
        quickButton = button;
        button.classList.add('is-active');
        quickUtterance = new SpeechSynthesisUtterance(`${question}. ${answer}`);
        quickUtterance.lang = 'en-IE';
        quickUtterance.rate = 0.92;
        quickUtterance.onend = resetQuickAudio;
        quickUtterance.onerror = resetQuickAudio;
        synth.speak(quickUtterance);
      });

      heading.prepend(button);
    });
  };

  const loadWallWords = () => {
    try {
      const value = JSON.parse(localStorage.getItem(wallStorageKey) || '[]');
      return Array.isArray(value) ? value.filter(item => typeof item === 'string' && item.trim()) : [];
    } catch (_) {
      return [];
    }
  };

  const saveWallWords = words => localStorage.setItem(wallStorageKey, JSON.stringify(words));

  const cleanWallWord = value => (value || '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,.;:!?“”"'‘’()\[\]{}]+|[\s,.;:!?“”"'‘’()\[\]{}]+$/g, '')
    .trim();

  const speakWallWord = word => {
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-IE';
    utterance.rate = 0.8;
    synth.speak(utterance);
  };

  const renderPersonalWordWall = () => {
    const words = loadWallWords();
    let wall = document.getElementById('personal-word-wall');

    if (!words.length) {
      wall?.remove();
      return;
    }

    if (!document.getElementById('personal-word-wall-style')) {
      const style = document.createElement('style');
      style.id = 'personal-word-wall-style';
      style.textContent = `
.personal-word-wall{margin:34px 0 8px;padding:18px 18px 16px;border:1px solid #d7dce2;border-radius:14px;background:#fafbfc}
.personal-word-wall-title{margin:0 0 12px;color:#344054;font-size:1rem;font-weight:750}
.personal-word-wall-pile{display:flex;flex-wrap:wrap;gap:8px}
.personal-word-chip{display:inline-flex;align-items:center;gap:5px;padding:6px 8px 6px 10px;border:1px solid #cfd6df;border-radius:999px;background:#fff;color:#27364a;font:650 .86rem/1.1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.personal-word-chip-say{border:0;background:transparent;color:inherit;font:inherit;padding:0;cursor:pointer}
.personal-word-chip-remove{border:0;background:transparent;color:#8a94a3;font:700 1rem/1 system-ui;padding:0 1px;cursor:pointer}
.personal-word-chip-remove:hover{color:#b3261e}
@media print{.personal-word-wall{break-inside:avoid}.personal-word-chip-remove{display:none}}
`;
      document.head.appendChild(style);
    }

    if (!wall) {
      wall = document.createElement('section');
      wall.id = 'personal-word-wall';
      wall.className = 'personal-word-wall';
      wall.innerHTML = '<div class="personal-word-wall-title">Word Wall</div><div class="personal-word-wall-pile"></div>';
      body.appendChild(wall);
    }

    const signature = JSON.stringify(words);
    if (wall.dataset.signature === signature) return;
    wall.dataset.signature = signature;
    const pile = wall.querySelector('.personal-word-wall-pile');
    pile.replaceChildren();

    words.forEach(word => {
      const chip = document.createElement('span');
      chip.className = 'personal-word-chip';
      const say = document.createElement('button');
      say.type = 'button';
      say.className = 'personal-word-chip-say';
      say.textContent = word;
      say.title = `Say “${word}”`;
      say.addEventListener('click', () => speakWallWord(word));
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'personal-word-chip-remove';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Remove ${word} from Word Wall`);
      remove.addEventListener('click', () => {
        const next = loadWallWords().filter(item => item.toLowerCase() !== word.toLowerCase());
        saveWallWords(next);
        renderPersonalWordWall();
      });
      chip.append(say, remove);
      pile.appendChild(chip);
    });
  };

  const addPersonalWord = value => {
    const word = cleanWallWord(value);
    if (!word) return false;
    const words = loadWallWords();
    if (!words.some(item => item.toLowerCase() === word.toLowerCase())) {
      words.push(word);
      saveWallWords(words);
    }
    renderPersonalWordWall();
    return true;
  };

  const addWordWallButtonToFocusPopup = () => {
    document.querySelectorAll('.answer-focus-tools').forEach(tools => {
      if (tools.querySelector('[data-add-word-wall]')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.addWordWall = 'true';
      button.textContent = '+ Word Wall';
      button.title = 'Select a word or short phrase in the answer, then add it to your Word Wall';
      button.addEventListener('mousedown', event => event.preventDefault());
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const selection = cleanWallWord(window.getSelection()?.toString() || '');
        let value = selection;
        if (!value || value.length > 60 || value.split(/\s+/).length > 6) {
          value = window.prompt('Word or short phrase for the Word Wall:', value && value.length <= 60 ? value : '') || '';
        }
        if (!addPersonalWord(value)) return;
        const original = button.textContent;
        button.textContent = 'Added ✓';
        window.setTimeout(() => { button.textContent = original; }, 900);
      });
      tools.appendChild(button);
    });
  };

  const setupDynamicWordWallLauncher = () => {
    const group = document.querySelector('.cm-audio-launchers');
    if (!group) return;
    let button = Array.from(group.querySelectorAll('button')).find(item => {
      const label = [item.textContent, item.title, item.getAttribute('aria-label')].filter(Boolean).join(' ');
      return /word wall/i.test(label);
    });

    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'cm-audio-launch';
      group.appendChild(button);
    } else if (button.dataset.personalWordWall !== 'true') {
      const replacement = button.cloneNode(true);
      button.replaceWith(replacement);
      button = replacement;
    }

    if (button.dataset.personalWordWall === 'true') return;
    button.dataset.personalWordWall = 'true';
    button.textContent = 'Word Wall';
    button.disabled = false;
    button.title = 'Play the words you have saved from focus pop-ups';
    button.setAttribute('aria-label', 'Play my Word Wall');

    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const words = loadWallWords();
      if (!words.length) {
        const original = button.textContent;
        button.textContent = 'Select words in pop-up';
        window.setTimeout(() => { button.textContent = original; }, 1400);
        return;
      }
      const synth = window.speechSynthesis;
      if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(words.join('. '));
      utterance.lang = 'en-IE';
      utterance.rate = 0.78;
      button.classList.add('is-active');
      utterance.onend = () => button.classList.remove('is-active');
      utterance.onerror = () => button.classList.remove('is-active');
      synth.speak(utterance);
    });
  };

  const clean = () => {
    removeSections();
    removeCountedWordWalls();
    tagAnswerHeadings();
    stripManualAnswerBolding();
    pruneNavigation();
    removeRetrievalControls();
    simplifyProfessionalResponsibilityAudio();
    putGeneralAnswerInIntroduction();
    removeLegacySectionEditLinks();
    setupFloatingPageTools();
    ensureInlinePlayButtons();
    renderPersonalWordWall();
    addWordWallButtonToFocusPopup();
    setupDynamicWordWallLauncher();
  };

  clean();
  requestAnimationFrame(clean);
  window.setTimeout(clean, 180);
  window.setTimeout(clean, 700);

  const observer = new MutationObserver(clean);
  observer.observe(document.body, { childList: true, subtree: true });
})();