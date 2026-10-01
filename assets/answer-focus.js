(() => {
  const body = document.getElementById('docBody');
  if (!body || document.querySelector('.answer-focus-overlay')) return;

  const synth = window.speechSynthesis;
  const hasSpeech = Boolean(synth && typeof SpeechSynthesisUtterance !== 'undefined');
  const pageEdit = document.querySelector('.doc-toolbar .cms-edit-link[href]') || document.querySelector('.doc-toolbar .edit-link[href]');
  const BANK_KEY = 'education-language-bank:v1';
  const EDIT_PREFIX = 'education-answer-edit:v1:';

  const DOMAIN_MAP = [
    ['teaching-learning', 'Teaching & Learning'],
    ['classroom-management', 'Classroom Management'],
    ['sen-inclusion', 'AEN & Inclusion'],
    ['differentiation-accessibility', 'Differentiation & Accessibility'],
    ['assessment-reporting', 'Assessment, Feedback & Reporting'],
    ['planning-curriculum', 'Planning & Curriculum'],
    ['relationships-wellbeing', 'Relationships & Wellbeing'],
    ['professional-practice', 'Professional Responsibility & School Community']
  ];

  const style = document.createElement('style');
  style.id = 'answer-focus-style';
  style.textContent = `
    .answer-focus-trigger{cursor:zoom-in;border-radius:6px;transition:background .12s ease,color .12s ease}
    .answer-focus-trigger:hover,.answer-focus-trigger:focus-visible{background:#f3f6fb;color:#174ea6;outline:none}
    body.answer-focus-open{overflow:hidden}
    .answer-focus-overlay[hidden]{display:none!important}
    .answer-focus-overlay{position:fixed;inset:0;z-index:6000;display:flex;align-items:center;justify-content:center;padding:clamp(10px,3vw,34px);background:rgba(17,24,39,.68);backdrop-filter:blur(2px)}
    .answer-focus-card{position:relative;width:min(980px,100%);max-height:min(90vh,920px);overflow:auto;background:#fff;border:1px solid rgba(255,255,255,.72);border-radius:18px;box-shadow:0 24px 80px rgba(0,0,0,.34);padding:clamp(24px,4vw,48px);color:#4b5563;font-size:clamp(1.04rem,.72vw + .84rem,1.22rem);line-height:1.74}
    .answer-focus-card h2{margin:0 48px 14px 0;color:#202124;font-size:clamp(1.4rem,1.2vw + 1rem,1.95rem);line-height:1.28;cursor:zoom-out}
    .answer-focus-card h3{color:#30343b}
    .answer-focus-card p,.answer-focus-card li{font-size:1em;line-height:1.74}
    .answer-focus-close{position:sticky;float:right;top:0;z-index:3;width:38px;height:38px;margin:-8px -8px 0 12px;border:1px solid #d7dce2;border-radius:50%;background:#fff;color:#3c4043;font:700 1.35rem/1 Arial,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(60,64,67,.14)}
    .answer-focus-close:hover,.answer-focus-close:focus-visible{background:#f1f3f4;outline:2px solid #aecbfa;outline-offset:2px}
    .answer-focus-tools{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 18px;padding:0 0 14px;border-bottom:1px solid #e7eaee}
    .answer-focus-tools button,.answer-focus-tools a{border:1px solid #cfd5dc;border-radius:999px;background:#fff;color:#30343b;padding:7px 12px;font:inherit;font-size:.78em;font-weight:650;line-height:1.2;cursor:pointer;text-decoration:none}
    .answer-focus-tools button:hover,.answer-focus-tools button:focus-visible,.answer-focus-tools a:hover,.answer-focus-tools a:focus-visible{background:#f3f6fb;border-color:#aecbfa;outline:none}
    .answer-focus-record{background:#fff!important;color:#30343b!important;border-color:#cfd5dc!important}
    .answer-focus-record::before{content:"●";color:#c62828;font-size:.8em;margin-right:6px}
    .answer-focus-record.is-recording{background:#f5f6f7!important;border-color:#9aa8b8!important;color:#1f2937!important}
    .answer-focus-record.is-recording::before{content:"■";color:#5f6368}
    .answer-focus-recordings{display:grid;gap:7px;margin:0 0 14px}
    .answer-focus-recordings[hidden]{display:none!important}
    .answer-focus-take{display:flex;align-items:center;gap:8px;padding:6px 8px;border:1px solid #e1e5ea;border-radius:9px;background:#fafbfc}
    .answer-focus-take-label{min-width:46px;color:#5f6368;font-size:.72em;font-weight:700}
    .answer-focus-take audio{width:min(330px,100%);height:30px;flex:1 1 auto}
    .answer-focus-take-save{border:1px solid #cfd5dc!important;border-radius:999px!important;background:#fff!important;color:#30343b!important;padding:5px 9px!important;font-size:.7em!important;text-decoration:none!important;white-space:nowrap}
    .answer-focus-copy strong,.answer-focus-copy b{font-weight:800;color:#202124}
    .answer-focus-copy[contenteditable="true"]{min-height:8rem;padding:14px 16px;border:2px solid #aecbfa;border-radius:10px;background:#fbfdff;outline:none;caret-color:#202124}
    .answer-focus-copy[contenteditable="true"]:focus{box-shadow:0 0 0 3px rgba(66,133,244,.12)}
    .answer-focus-copy[contenteditable="true"] strong,.answer-focus-copy[contenteditable="true"] b{color:#d93025;font-weight:800}
    .answer-focus-copy button,.answer-focus-copy .cm-question-play,.answer-focus-copy .section-controls,.answer-focus-copy .section-edit-nearby,.answer-focus-copy .section-edit-link{display:none!important}
    .answer-focus-hint{margin:-7px 0 14px;color:#6b7280;font-size:.78em;line-height:1.4}
    .answer-focus-chain{margin:18px 0 0;padding:12px 14px;border-left:4px solid #d93025;background:#f8f9fa;border-radius:0 9px 9px 0;color:#3c4043;font-size:.84em;line-height:1.5}
    .answer-focus-chain strong{color:#d93025}
    .answer-focus-bank[hidden]{display:none!important}
    .answer-focus-bank{margin-top:18px;padding:16px;border:1px solid #dadce0;border-radius:12px;background:#f8f9fa}
    .answer-focus-bank h3{margin:0 0 12px;font-size:1rem;color:#202124}
    .answer-focus-bank-domain{margin:12px 0 5px;font-weight:750;color:#3c4043}
    .answer-focus-bank-list{display:flex;flex-wrap:wrap;gap:7px;margin:0;padding:0;list-style:none}
    .answer-focus-bank-list li{margin:0;padding:5px 9px;border:1px solid #dadce0;border-radius:999px;background:#fff;color:#d93025;font-size:.78em;font-weight:750;line-height:1.25}
    .answer-focus-empty{color:#6b7280;font-size:.82em}
    @media(max-width:600px){.answer-focus-overlay{padding:7px}.answer-focus-card{width:100%;max-height:95vh;border-radius:13px;padding:21px 18px;font-size:1rem}.answer-focus-card h2{margin-right:36px;font-size:1.4rem}.answer-focus-tools{margin-bottom:14px;padding-bottom:12px}.answer-focus-tools button,.answer-focus-tools a{font-size:.75em;padding:7px 10px}}
    @media print{.answer-focus-overlay{display:none!important}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'answer-focus-overlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Focused interview answer');
  overlay.innerHTML = `
    <article class="answer-focus-card" tabindex="-1">
      <button class="answer-focus-close" type="button" data-focus-close aria-label="Close focused answer">×</button>
      <div class="answer-focus-content" data-focus-content></div>
    </article>
  `;
  document.body.appendChild(overlay);

  const card = overlay.querySelector('.answer-focus-card');
  const focusContent = overlay.querySelector('[data-focus-content]');
  let lastTrigger = null;
  let utterance = null;
  let audioButton = null;
  let mediaRecorder = null;
  let mediaStream = null;
  let recordedChunks = [];
  let recordedTakes = [];

  const cleanText = value => (value || '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,.;:!?–—-]+|[\s,.;:!?–—-]+$/g, '')
    .trim();

  const questionText = heading => {
    if (heading.dataset.interviewQuestion) return heading.dataset.interviewQuestion.trim();
    if (heading.dataset.questionText) return heading.dataset.questionText.trim();
    const raw = cleanText(heading.textContent);
    const parts = raw.split(/\s+—\s+/);
    return parts.length > 1 ? parts.slice(1).join(' — ').trim() : raw;
  };

  const sourceHeadingText = heading => {
    const concept = cleanText(heading.dataset.interviewConcept || heading.dataset.menuLabel);
    const question = cleanText(heading.dataset.interviewQuestion || heading.dataset.questionText);
    if (concept && question) return `${concept} — ${question}`;
    return cleanText(heading.textContent);
  };

  const isInterviewHeading = heading => {
    if (!heading || heading.tagName !== 'H2') return false;
    const text = cleanText(heading.textContent);
    if (/retrieval\s+(table|chain|map|draft)|word wall|concepts and questions/i.test(text)) return false;
    return Boolean(
      heading.dataset.interviewQuestion ||
      heading.dataset.questionText ||
      heading.classList.contains('interview-question-heading') ||
      /\s+—\s+/.test(text)
    );
  };

  const sourceNodesFor = heading => {
    const section = heading.closest('.answer-section');
    const sectionContent = section?.querySelector('.section-content');
    if (sectionContent) return Array.from(sectionContent.children);

    const nodes = [];
    let node = heading.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      nodes.push(node);
      node = node.nextElementSibling;
    }
    return nodes;
  };

  const editableKeyFor = heading => {
    const id = cleanText(sourceHeadingText(heading)).toLowerCase();
    return `${EDIT_PREFIX}${location.pathname}:${id}`;
  };

  const domainForPage = () => {
    const path = location.pathname.toLowerCase();
    const match = DOMAIN_MAP.find(([needle]) => path.includes(needle));
    if (match) return match[1];
    const title = cleanText(document.querySelector('.doc-paper > h1')?.textContent);
    return title || 'Other';
  };

  const cloneAnswer = heading => {
    const wrapper = document.createElement('div');
    wrapper.className = 'answer-focus-copy';
    const saved = localStorage.getItem(editableKeyFor(heading));
    if (saved) {
      wrapper.innerHTML = saved;
      return wrapper;
    }

    sourceNodesFor(heading).forEach(node => {
      if (node.matches?.('.section-edit-nearby,.question-breadcrumb-line,.retrieval-chain-table,.retrieval-wall,.retrieval-appendix-table,.retrieval-appendix-break,[data-breadcrumb]')) return;
      if (node.matches?.('[class*="breadcrumb"]')) return;
      const clone = node.cloneNode(true);
      clone.querySelectorAll?.('script,style,button,.section-controls,.section-edit-nearby,.section-edit-link,.question-breadcrumb-line,.retrieval-chain-table,.retrieval-wall,[data-breadcrumb],[class*="breadcrumb"],a[href*="pagescms.org"]').forEach(el => el.remove());
      clone.querySelectorAll?.('strong,b').forEach(el => el.replaceWith(...el.childNodes));
      if (cleanText(clone.textContent) || clone.matches?.('img,table,ul,ol,blockquote')) wrapper.appendChild(clone);
    });
    return wrapper;
  };

  const boldPhrases = content => {
    const seen = new Set();
    return Array.from(content.querySelectorAll('strong,b'))
      .map(el => cleanText(el.textContent))
      .filter(Boolean)
      .filter(text => {
        const key = text.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  };

  const readBank = () => {
    try {
      const value = JSON.parse(localStorage.getItem(BANK_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  };

  const writeBankForAnswer = (heading, phrases) => {
    const domain = domainForPage();
    const question = questionText(heading);
    const answerKey = editableKeyFor(heading);
    const retained = readBank().filter(item => item.answerKey !== answerKey);
    const added = phrases.map(phrase => ({
      domain,
      phrase,
      question,
      path: location.pathname,
      answerKey,
      savedAt: new Date().toISOString()
    }));
    localStorage.setItem(BANK_KEY, JSON.stringify([...retained, ...added]));
  };

  const applySavedToSource = (heading, html) => {
    const section = heading.closest('.answer-section');
    const sectionContent = section?.querySelector('.section-content');
    if (sectionContent) {
      sectionContent.innerHTML = html;
      return;
    }

    const current = sourceNodesFor(heading);
    const template = document.createElement('template');
    template.innerHTML = html;
    const replacement = Array.from(template.content.childNodes);
    if (current.length) {
      const anchor = current[0];
      replacement.forEach(node => anchor.parentNode.insertBefore(node, anchor));
      current.forEach(node => node.remove());
    } else {
      replacement.forEach(node => heading.parentNode.insertBefore(node, heading.nextSibling));
    }
  };

  const restoreSavedAnswers = () => {
    body.querySelectorAll(':scope > h2, .answer-section h2').forEach(heading => {
      if (!isInterviewHeading(heading)) return;
      const saved = localStorage.getItem(editableKeyFor(heading));
      if (saved) applySavedToSource(heading, saved);
    });
  };

  const resetAudio = () => {
    if (synth) synth.cancel();
    utterance = null;
    if (audioButton) audioButton.textContent = '▶ Play';
  };

  const resetRecorder = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try { mediaRecorder.stop(); } catch (_) {}
    }
    mediaRecorder = null;
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    recordedChunks = [];
    recordedTakes.forEach(take => take.url && URL.revokeObjectURL(take.url));
    recordedTakes = [];
  };


  const selectContent = content => {
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(content);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const sourceEditUrlFor = heading => {
    if (!pageEdit?.href) return null;
    const cmsBase = pageEdit.href.split('#')[0];
    const sourceHeading = sourceHeadingText(heading);
    return sourceHeading ? `${cmsBase}#:~:text=${encodeURIComponent(sourceHeading)}` : cmsBase;
  };

  const makeChain = (content, host) => {
    host?.remove();
    const phrases = boldPhrases(content);
    if (!phrases.length) return null;
    const chain = document.createElement('div');
    chain.className = 'answer-focus-chain';
    chain.innerHTML = `<strong>Your retrieval chain:</strong> ${phrases.map(phrase => phrase.replace(/[<>&]/g, char => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[char]))).join(' → ')}`;
    content.insertAdjacentElement('afterend', chain);
    return chain;
  };

  const renderBank = panel => {
    panel.replaceChildren();
    const title = document.createElement('h3');
    title.textContent = 'Language bank';
    panel.appendChild(title);

    const items = readBank();
    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'answer-focus-empty';
      empty.textContent = 'Bold language in an answer and press Save. It will appear here under its domain.';
      panel.appendChild(empty);
      return;
    }

    const groups = new Map();
    items.forEach(item => {
      if (!groups.has(item.domain)) groups.set(item.domain, []);
      groups.get(item.domain).push(item);
    });

    groups.forEach((domainItems, domain) => {
      const domainHeading = document.createElement('div');
      domainHeading.className = 'answer-focus-bank-domain';
      domainHeading.textContent = domain;
      const list = document.createElement('ul');
      list.className = 'answer-focus-bank-list';
      const seen = new Set();
      domainItems.forEach(item => {
        const key = item.phrase.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        const li = document.createElement('li');
        li.textContent = item.phrase;
        li.title = item.question || '';
        list.appendChild(li);
      });
      panel.append(domainHeading, list);
    });
  };

  const toolsFor = (heading, content) => {
    const controls = document.createElement('div');
    controls.className = 'answer-focus-tools';

    if (hasSpeech) {
      const play = document.createElement('button');
      play.type = 'button';
      play.textContent = '▶ Play';
      play.setAttribute('aria-label', 'Play or pause focused answer');

      const stop = document.createElement('button');
      stop.type = 'button';
      stop.textContent = '■ Stop';

      controls.append(play, stop);
      audioButton = play;

      play.addEventListener('click', event => {
        event.stopPropagation();
        if (synth.paused) {
          synth.resume();
          play.textContent = '⏸ Pause';
          return;
        }
        if (synth.speaking) {
          synth.pause();
          play.textContent = '▶ Resume';
          return;
        }
        resetAudio();
        audioButton = play;
        const text = `${questionText(heading)}. ${cleanText(content.innerText)}`;
        utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IE';
        utterance.rate = 0.92;
        utterance.onend = resetAudio;
        utterance.onerror = resetAudio;
        play.textContent = '⏸ Pause';
        synth.speak(utterance);
      });

      stop.addEventListener('click', event => {
        event.stopPropagation();
        resetAudio();
      });
    }

    const recordings = document.createElement('div');
    recordings.className = 'answer-focus-recordings';
    recordings.hidden = true;

    const renderTakes = () => {
      recordings.replaceChildren();
      recordedTakes.forEach((take, index) => {
        const row = document.createElement('div');
        row.className = 'answer-focus-take';

        const label = document.createElement('span');
        label.className = 'answer-focus-take-label';
        label.textContent = `Take ${index + 1}`;

        const player = document.createElement('audio');
        player.controls = true;
        player.src = take.url;

        const save = document.createElement('a');
        save.className = 'answer-focus-take-save';
        save.href = take.url;
        save.download = `interview-take-${index + 1}.webm`;
        save.textContent = 'Save';

        row.append(label, player, save);
        recordings.appendChild(row);
      });
      recordings.hidden = recordedTakes.length === 0;
    };

    const visibility = document.createElement('button');
    visibility.type = 'button';
    visibility.textContent = 'Hide';
    visibility.setAttribute('aria-pressed', 'false');
    visibility.title = 'Hide or show the answer while you practise';

    visibility.addEventListener('click', event => {
      event.stopPropagation();
      const hidden = content.hidden;
      content.hidden = !hidden;
      visibility.textContent = hidden ? 'Hide' : 'Show';
      visibility.setAttribute('aria-pressed', hidden ? 'false' : 'true');
    });

    controls.appendChild(visibility);

    const edit = document.createElement('button');
    edit.type = 'button';
    edit.textContent = 'Edit';
    edit.title = 'Edit the written answer in this popup';

    const saveWriting = document.createElement('button');
    saveWriting.type = 'button';
    saveWriting.textContent = 'Save';
    saveWriting.title = 'Save the written answer in this browser';
    saveWriting.disabled = true;

    edit.addEventListener('click', event => {
      event.stopPropagation();
      if (content.hidden) {
        content.hidden = false;
        visibility.textContent = 'Hide';
        visibility.setAttribute('aria-pressed', 'false');
      }
      content.contentEditable = 'true';
      content.setAttribute('aria-label', 'Editable interview answer');
      content.focus({ preventScroll: true });
      edit.textContent = 'Editing';
      edit.disabled = true;
      saveWriting.disabled = false;
    });

    saveWriting.addEventListener('click', event => {
      event.stopPropagation();
      const html = content.innerHTML;
      localStorage.setItem(editableKeyFor(heading), html);
      applySavedToSource(heading, html);
      content.contentEditable = 'false';
      content.removeAttribute('aria-label');
      edit.textContent = 'Edit';
      edit.disabled = false;
      saveWriting.disabled = true;
      saveWriting.textContent = 'Saved';
      window.setTimeout(() => { saveWriting.textContent = 'Save'; }, 900);
    });

    controls.append(edit, saveWriting);

    if (navigator.mediaDevices?.getUserMedia && window.MediaRecorder) {
      const record = document.createElement('button');
      record.type = 'button';
      record.className = 'answer-focus-record';
      record.textContent = 'Record';
      record.title = 'Record up to three private practice takes using your microphone';
      controls.appendChild(record);

      record.addEventListener('click', async event => {
        event.stopPropagation();

        if (mediaRecorder && mediaRecorder.state === 'recording') {
          record.textContent = 'Record';
          record.classList.remove('is-recording');
          mediaRecorder.stop();
          return;
        }

        if (recordedTakes.length >= 3) return;

        try {
          recordedChunks = [];
          mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(mediaStream);

          mediaRecorder.addEventListener('dataavailable', e => {
            if (e.data?.size) recordedChunks.push(e.data);
          });

          mediaRecorder.addEventListener('stop', () => {
            if (mediaStream) {
              mediaStream.getTracks().forEach(track => track.stop());
              mediaStream = null;
            }
            if (!recordedChunks.length) return;

            const blob = new Blob(recordedChunks, { type: mediaRecorder?.mimeType || 'audio/webm' });
            recordedTakes.push({ url: URL.createObjectURL(blob) });
            renderTakes();

            if (recordedTakes.length >= 3) {
              record.disabled = true;
              record.textContent = '3 takes';
              record.classList.remove('is-recording');
            }
          }, { once: true });

          mediaRecorder.start();
          record.textContent = 'Stop';
          record.classList.add('is-recording');
        } catch (_) {
          record.textContent = 'Mic unavailable';
          window.setTimeout(() => { record.textContent = 'Record'; }, 1400);
        }
      });
    }

    return { controls, recordings };
  };

  const closeFocus = () => {
    if (overlay.hidden) return;
    resetAudio();
    resetRecorder();
    overlay.hidden = true;
    focusContent.replaceChildren();
    document.body.classList.remove('answer-focus-open');
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    lastTrigger = null;
    audioButton = null;
  };

  const openFocus = heading => {
    const copy = cloneAnswer(heading);
    if (!cleanText(copy.textContent)) return;

    const title = document.createElement('h2');
    title.textContent = questionText(heading);
    title.setAttribute('data-focus-close', '');
    title.title = 'Click the question to close';

    const { controls, recordings } = toolsFor(heading, copy);
    focusContent.replaceChildren(title, controls, copy, recordings);
    lastTrigger = heading;
    overlay.hidden = false;
    document.body.classList.add('answer-focus-open');
    card.scrollTop = 0;
    card.focus({ preventScroll: true });
  };

  const prepare = () => {
    body.querySelectorAll(':scope > h2, .answer-section h2').forEach(heading => {
      if (!isInterviewHeading(heading) || heading.dataset.answerFocusPrepared === 'true') return;
      heading.dataset.answerFocusPrepared = 'true';
      heading.classList.add('answer-focus-trigger');
      heading.tabIndex = heading.tabIndex >= 0 ? heading.tabIndex : 0;
      heading.setAttribute('role', 'button');
      heading.setAttribute('aria-haspopup', 'dialog');
      heading.title = 'Click the question to open focus view';
      heading.addEventListener('click', event => {
        if (event.target.closest('button,a,input,textarea,select,summary')) return;
        openFocus(heading);
      });
      heading.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        if (event.target.closest('button,a,input,textarea,select,summary')) return;
        event.preventDefault();
        openFocus(heading);
      });
    });
  };

  restoreSavedAnswers();
  overlay.addEventListener('click', event => {
    if (event.target === overlay || event.target.closest('[data-focus-close]')) closeFocus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !overlay.hidden) closeFocus();
  });
  window.addEventListener('pagehide', () => { resetAudio(); resetRecorder(); });
  window.addEventListener('beforeunload', () => { resetAudio(); resetRecorder(); });

  const observer = new MutationObserver(prepare);
  observer.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-interview-question', 'data-question-text'] });
  prepare();
  requestAnimationFrame(prepare);
  window.setTimeout(prepare, 250);
  window.setTimeout(prepare, 900);
})();