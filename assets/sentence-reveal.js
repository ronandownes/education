(() => {
  const body = document.getElementById('docBody');
  if (!body) return;

  const style = document.createElement('style');
  style.textContent = `
    .reveal-step.is-reveal-hidden{display:none!important}
    .answer-section.is-reveal-active{box-shadow:inset 3px 0 0 var(--blue);padding-left:14px}
    .section-controls .reveal-button.is-active{background:#e8f0fe;border-color:#aecbfa;color:#174ea6;font-weight:700}
    @media print{.reveal-step.is-reveal-hidden{display:revert!important}.answer-section.is-reveal-active{box-shadow:none;padding-left:0}}
  `;
  document.head.appendChild(style);

  const sentenceSegmenter = typeof Intl !== 'undefined' && Intl.Segmenter
    ? new Intl.Segmenter('en', { granularity: 'sentence' })
    : null;

  const splitPlainParagraph = paragraph => {
    if (paragraph.children.length || paragraph.dataset.revealPrepared === 'true') return;
    const text = paragraph.textContent.trim();
    if (!text) return;

    let sentences = [];
    if (sentenceSegmenter) {
      sentences = Array.from(sentenceSegmenter.segment(text), item => item.segment.trim()).filter(Boolean);
    } else {
      sentences = text.match(/[^.!?]+[.!?]+(?:[”’"']+)?|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) || [text];
    }

    if (sentences.length < 2) return;
    paragraph.textContent = '';
    sentences.forEach((sentence, index) => {
      const span = document.createElement('span');
      span.className = 'reveal-step reveal-sentence';
      span.textContent = sentence;
      paragraph.appendChild(span);
      if (index < sentences.length - 1) paragraph.appendChild(document.createTextNode(' '));
    });
    paragraph.dataset.revealPrepared = 'true';
  };

  const getSteps = section => {
    const content = section.querySelector('.section-content');
    if (!content) return [];

    content.querySelectorAll('p').forEach(splitPlainParagraph);

    const steps = [];
    content.querySelectorAll('h3, p, li, blockquote').forEach(element => {
      if (element.closest('details:not([open])')) return;
      const sentenceSpans = Array.from(element.querySelectorAll(':scope > .reveal-sentence'));
      if (sentenceSpans.length) {
        steps.push(...sentenceSpans);
      } else if (element.tagName === 'LI' || !element.closest('li')) {
        element.classList.add('reveal-step');
        steps.push(element);
      }
    });
    return steps;
  };

  let activeSection = null;

  const exitReveal = section => {
    if (!section) return;
    const state = section._sentenceReveal;
    if (!state) return;
    state.steps.forEach(step => step.classList.remove('is-reveal-hidden'));
    state.index = state.steps.length;
    state.active = false;
    section.classList.remove('is-reveal-active');
    state.button.classList.remove('is-active');
    state.button.textContent = 'Reveal';
    if (activeSection === section) activeSection = null;
  };

  const startReveal = section => {
    const state = section._sentenceReveal;
    if (!state || !state.steps.length) return;
    if (activeSection && activeSection !== section) exitReveal(activeSection);

    const content = section.querySelector('.section-content');
    if (content) content.hidden = false;
    const hideButton = section.querySelector('.section-controls button:last-child');
    if (hideButton && hideButton !== state.button) hideButton.textContent = 'Hide';

    state.steps.forEach(step => step.classList.add('is-reveal-hidden'));
    state.index = 0;
    state.active = true;
    section.classList.add('is-reveal-active');
    state.button.classList.add('is-active');
    activeSection = section;
    showNext(section);
  };

  const showNext = section => {
    const state = section._sentenceReveal;
    if (!state || !state.active) return;
    if (state.index >= state.steps.length) {
      startReveal(section);
      return;
    }
    state.steps[state.index].classList.remove('is-reveal-hidden');
    state.index += 1;
    state.button.textContent = state.index >= state.steps.length ? 'Again' : 'Next';
  };

  const showPrevious = section => {
    const state = section?._sentenceReveal;
    if (!state || !state.active || state.index <= 1) return;
    state.index -= 1;
    state.steps[state.index].classList.add('is-reveal-hidden');
    state.button.textContent = 'Next';
  };

  const prepareSections = () => {
    document.querySelectorAll('.answer-section').forEach(section => {
      if (section._sentenceReveal) return;
      const controls = section.querySelector('.section-controls');
      if (!controls) return;
      const steps = getSteps(section);
      if (!steps.length) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'reveal-button';
      button.textContent = 'Reveal';
      button.title = 'Reveal this answer one sentence at a time';
      controls.insertBefore(button, controls.lastElementChild);

      section._sentenceReveal = { steps, index: steps.length, active: false, button };
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        if (!section._sentenceReveal.active) startReveal(section);
        else showNext(section);
      });

      section.querySelector('.section-content')?.addEventListener('click', event => {
        if (!section._sentenceReveal.active || event.target.closest('a,button,summary,input,textarea,select')) return;
        showNext(section);
      });
    });
  };

  const observer = new MutationObserver(() => prepareSections());
  observer.observe(body, { childList: true, subtree: true });
  prepareSections();

  document.addEventListener('keydown', event => {
    if (!activeSection || !activeSection._sentenceReveal?.active) return;
    if (event.target.matches('input,textarea,select,[contenteditable="true"]')) return;
    if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      showNext(activeSection);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious(activeSection);
    } else if (event.key === 'Escape') {
      exitReveal(activeSection);
    }
  });

  document.querySelector('[data-action="show-all"]')?.addEventListener('click', () => {
    document.querySelectorAll('.answer-section').forEach(exitReveal);
  });

  document.querySelector('[data-action="hide-all"]')?.addEventListener('click', () => {
    if (activeSection) exitReveal(activeSection);
  });
})();

(() => {
  const toolbar = document.querySelector('.doc-toolbar');
  const body = document.getElementById('docBody');
  if (!toolbar || !body) return;

  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;

  const readButton = document.createElement('button');
  readButton.type = 'button';
  readButton.className = 'read-aloud-button';
  readButton.textContent = '🔊 Read aloud';
  readButton.title = 'Read the visible document aloud';

  const stopButton = document.createElement('button');
  stopButton.type = 'button';
  stopButton.className = 'read-aloud-stop';
  stopButton.textContent = '■ Stop';
  stopButton.title = 'Stop reading aloud';
  stopButton.hidden = true;

  const editLink = toolbar.querySelector('.edit-link');
  if (editLink) {
    toolbar.insertBefore(readButton, editLink);
    toolbar.insertBefore(stopButton, editLink);
  } else {
    toolbar.append(readButton, stopButton);
  }

  let utterance = null;

  const resetControls = () => {
    readButton.textContent = '🔊 Read aloud';
    stopButton.hidden = true;
    utterance = null;
  };

  const getVisibleText = () => {
    const clone = body.cloneNode(true);
    clone.querySelectorAll('button, script, style, .section-controls, [hidden], .star-filter-hidden, .is-reveal-hidden').forEach(el => el.remove());
    return clone.innerText.replace(/\s+/g, ' ').trim();
  };

  readButton.addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      readButton.textContent = '▶ Resume';
      return;
    }

    if (synth.paused) {
      synth.resume();
      readButton.textContent = '⏸ Pause';
      return;
    }

    const text = getVisibleText();
    if (!text) return;

    synth.cancel();
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IE';
    utterance.rate = 0.95;
    utterance.onend = resetControls;
    utterance.onerror = resetControls;
    stopButton.hidden = false;
    readButton.textContent = '⏸ Pause';
    synth.speak(utterance);
  });

  stopButton.addEventListener('click', () => {
    synth.cancel();
    resetControls();
  });

  window.addEventListener('beforeunload', () => synth.cancel());
})();
