(() => {
  const body = document.getElementById('docBody');
  if (!body || document.querySelector('.answer-focus-overlay')) return;

  const synth = window.speechSynthesis;
  const hasSpeech = Boolean(synth && typeof SpeechSynthesisUtterance !== 'undefined');

  const stopWords = new Set(`
    a an and are as at be because been being but by can could did do does doing
    for from had has have having he her hers herself him himself his how i if in
    into is it its itself just may me might more most my myself no nor not of off
    on once only or other our ours ourselves out over own rather really she should
    so some such than that the their theirs them themselves then there these they
    this those through to too under until up very was we were what when where which
    while who why will with would you your yours yourself yourselves also generally
    typically particularly simply basically actually perhaps quite about according
  `.trim().split(/\s+/));

  const style = document.createElement('style');
  style.id = 'answer-focus-style';
  style.textContent = `
    .answer-focus-trigger{cursor:zoom-in;border-radius:6px;transition:background .12s ease,color .12s ease}
    .answer-focus-trigger:hover,.answer-focus-trigger:focus-visible{background:#f3f6fb;color:#174ea6;outline:none}
    body.answer-focus-open{overflow:hidden}
    .answer-focus-overlay[hidden]{display:none!important}
    .answer-focus-overlay{position:fixed;inset:0;z-index:6000;display:flex;align-items:center;justify-content:center;padding:clamp(10px,3vw,34px);background:rgba(17,24,39,.68);backdrop-filter:blur(2px)}
    .answer-focus-card{position:relative;width:min(980px,100%);max-height:min(90vh,920px);overflow:auto;background:#fff;border:1px solid rgba(255,255,255,.72);border-radius:18px;box-shadow:0 24px 80px rgba(0,0,0,.34);padding:clamp(24px,4vw,48px);color:#4b5563;font-size:clamp(1.04rem,.72vw + .84rem,1.22rem);line-height:1.74}
    .answer-focus-card h2{margin:0 48px 16px 0;color:#202124;font-size:clamp(1.4rem,1.2vw + 1rem,1.95rem);line-height:1.28;cursor:zoom-out}
    .answer-focus-card h3{color:#30343b}
    .answer-focus-card p,.answer-focus-card li{font-size:1em;line-height:1.74}
    .answer-focus-close{position:sticky;float:right;top:0;z-index:3;width:38px;height:38px;margin:-8px -8px 0 12px;border:1px solid #d7dce2;border-radius:50%;background:#fff;color:#3c4043;font:700 1.35rem/1 Arial,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(60,64,67,.14)}
    .answer-focus-close:hover,.answer-focus-close:focus-visible{background:#f1f3f4;outline:2px solid #aecbfa;outline-offset:2px}
    .answer-focus-breadcrumbs{display:flex;flex-wrap:wrap;align-items:center;gap:7px 10px;margin:0 0 16px;padding:0 0 14px;border-bottom:1px solid #e7eaee}
    .answer-focus-crumb{display:inline-flex;align-items:center;gap:10px;color:#111827;font-size:.78em;font-weight:800;line-height:1.25;letter-spacing:.01em}
    .answer-focus-crumb:not(:first-child)::before{content:"→";color:#9aa0a6;font-weight:800}
    .answer-focus-audio{display:flex;align-items:center;gap:8px;margin:0 0 18px}
    .answer-focus-audio button{border:1px solid #cfd5dc;border-radius:999px;background:#fff;color:#30343b;padding:7px 12px;font:inherit;font-size:.78em;font-weight:700;cursor:pointer}
    .answer-focus-audio button:hover,.answer-focus-audio button:focus-visible{background:#f3f6fb;border-color:#aecbfa;outline:none}
    .answer-focus-key{color:#111827;font-weight:850}
    .answer-focus-copy button,.answer-focus-copy .cm-question-play,.answer-focus-copy .section-controls,.answer-focus-copy .section-edit-nearby,.answer-focus-copy .section-edit-link{display:none!important}
    @media(max-width:600px){.answer-focus-overlay{padding:7px}.answer-focus-card{width:100%;max-height:95vh;border-radius:13px;padding:21px 18px;font-size:1rem}.answer-focus-card h2{margin-right:36px;font-size:1.4rem}.answer-focus-breadcrumbs{gap:6px 8px;margin-bottom:13px;padding-bottom:12px}.answer-focus-crumb{font-size:.75em}.answer-focus-audio{margin-bottom:14px}}
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

  const cleanText = value => (value || '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,.;:!?–—-]+|[\s,.;:!?–—-]+$/g, '')
    .trim();

  const questionText = heading => {
    if (heading.dataset.interviewQuestion) return heading.dataset.interviewQuestion.trim();
    const raw = cleanText(heading.textContent);
    const parts = raw.split(/\s+—\s+/);
    return parts.length > 1 ? parts.slice(1).join(' — ').trim() : raw;
  };

  const isInterviewHeading = heading => {
    if (!heading || heading.tagName !== 'H2') return false;
    const text = cleanText(heading.textContent);
    if (/retrieval\s+(table|chain|map|draft)|word wall|concepts and questions/i.test(text)) return false;
    return Boolean(heading.dataset.interviewQuestion || /\s+—\s+/.test(text));
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

  const cloneAnswer = heading => {
    const wrapper = document.createElement('div');
    wrapper.className = 'answer-focus-copy';
    sourceNodesFor(heading).forEach(node => {
      if (node.matches?.('.section-edit-nearby,.question-breadcrumb-line,.retrieval-chain-table,.retrieval-wall,.retrieval-appendix-table,.retrieval-appendix-break,[data-breadcrumb]')) return;
      if (node.matches?.('[class*="breadcrumb"]')) return;
      const clone = node.cloneNode(true);
      clone.querySelectorAll?.('script,style,button,.section-controls,.section-edit-nearby,.section-edit-link,.question-breadcrumb-line,.retrieval-chain-table,.retrieval-wall,[data-breadcrumb],[class*="breadcrumb"],a[href*="pagescms.org"]').forEach(el => el.remove());
      if (cleanText(clone.textContent) || clone.matches?.('img,table,ul,ol,blockquote')) wrapper.appendChild(clone);
    });
    return wrapper;
  };

  const cueFromSentence = sentence => {
    const words = sentence.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9][A-Za-zÀ-ÖØ-öø-ÿ0-9'’\-]*/g) || [];
    const runs = [];
    let run = [];
    const flush = () => {
      if (run.length) runs.push(run);
      run = [];
    };
    words.forEach(word => {
      const normal = word.toLowerCase().replace(/’/g, "'");
      const tiny = word.length <= 2 && !/^[A-Z0-9]{2,}$/.test(word);
      if (stopWords.has(normal) || tiny) {
        flush();
        return;
      }
      run.push(word);
      if (run.length === 4) flush();
    });
    flush();
    if (!runs.length) return '';
    runs.sort((a, b) => b.length - a.length || b.join(' ').length - a.join(' ').length);
    return cleanText(runs[0].slice(0, 4).join(' '));
  };

  const buildCues = content => {
    const candidates = [];
    const seen = new Set();
    const blocks = Array.from(content.querySelectorAll('p,li,h3,blockquote'));
    blocks.forEach(block => {
      const bold = Array.from(block.querySelectorAll('strong,b'))
        .map(el => cleanText(el.textContent))
        .find(text => text.length >= 5 && text.length <= 52 && text.split(/\s+/).length <= 7);
      if (bold) candidates.push(bold);

      const text = cleanText(block.textContent);
      text.split(/[.!?;]+\s*/).filter(Boolean).forEach(sentence => {
        const cue = cueFromSentence(sentence);
        if (cue) candidates.push(cue);
      });
    });

    const unique = candidates.filter(cue => {
      const key = cue.toLowerCase();
      if (!cue || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const max = 7;
    if (unique.length <= max) return unique;
    return Array.from({ length: max }, (_, index) => {
      const sourceIndex = Math.round(index * (unique.length - 1) / (max - 1));
      return unique[sourceIndex];
    }).filter((cue, index, all) => all.indexOf(cue) === index);
  };

  const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const emphasiseCue = (content, cue) => {
    const matcher = new RegExp(escapeRegex(cue), 'i');
    const nodes = [];
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!matcher.test(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
        if (node.parentElement?.closest('strong,b,button,a,script,style')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      const text = node.nodeValue || '';
      const local = new RegExp(escapeRegex(cue), 'ig');
      if (!local.test(text)) return;
      local.lastIndex = 0;
      const fragment = document.createDocumentFragment();
      let last = 0;
      text.replace(local, (match, offset) => {
        fragment.appendChild(document.createTextNode(text.slice(last, offset)));
        const strong = document.createElement('strong');
        strong.className = 'answer-focus-key';
        strong.textContent = match;
        fragment.appendChild(strong);
        last = offset + match.length;
        return match;
      });
      fragment.appendChild(document.createTextNode(text.slice(last)));
      node.replaceWith(fragment);
    });
  };

  const breadcrumbsFor = cues => {
    if (!cues.length) return null;
    const nav = document.createElement('nav');
    nav.className = 'answer-focus-breadcrumbs';
    nav.setAttribute('aria-label', 'Key phrase breadcrumbs');
    cues.forEach(cue => {
      const crumb = document.createElement('span');
      crumb.className = 'answer-focus-crumb';
      crumb.textContent = cue;
      nav.appendChild(crumb);
    });
    return nav;
  };

  const resetAudio = () => {
    if (synth) synth.cancel();
    utterance = null;
    if (audioButton) audioButton.textContent = '▶ Play';
  };

  const audioControlsFor = (heading, content) => {
    if (!hasSpeech) return null;
    const controls = document.createElement('div');
    controls.className = 'answer-focus-audio';
    const play = document.createElement('button');
    play.type = 'button';
    play.textContent = '▶ Play';
    play.setAttribute('aria-label', 'Play or pause focused answer');
    const stop = document.createElement('button');
    stop.type = 'button';
    stop.textContent = '■ Stop';
    stop.setAttribute('aria-label', 'Stop focused answer');
    controls.append(play, stop);
    audioButton = play;

    const text = `${questionText(heading)}. ${cleanText(content.innerText)}`;
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
    return controls;
  };

  const closeFocus = () => {
    if (overlay.hidden) return;
    resetAudio();
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

    const cues = buildCues(copy);
    cues.forEach(cue => emphasiseCue(copy, cue));
    const breadcrumbs = breadcrumbsFor(cues);
    const audio = audioControlsFor(heading, copy);

    focusContent.replaceChildren(...[title, breadcrumbs, audio, copy].filter(Boolean));
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

  overlay.addEventListener('click', event => {
    if (event.target === overlay || event.target.closest('[data-focus-close]')) closeFocus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !overlay.hidden) closeFocus();
  });
  window.addEventListener('pagehide', resetAudio);
  window.addEventListener('beforeunload', resetAudio);

  const observer = new MutationObserver(prepare);
  observer.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-interview-question'] });
  prepare();
  requestAnimationFrame(prepare);
  window.setTimeout(prepare, 250);
  window.setTimeout(prepare, 900);
})();
