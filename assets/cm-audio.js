(() => {
  // Site-wide interview rehearsal audio generated from each live page.
  const domains = [
    { path: '/teaching-learning.html', name: 'Teaching & Learning', short: 'TL', wall: 'Teaching & Learning Word Wall', concepts: 'Teaching & Learning Retrieval Chains' },
    { path: '/classroom-management.html', name: 'Classroom Management', short: 'CM', wall: 'Classroom Management Word Wall', concepts: 'Classroom Management Concepts and Questions' },
    { path: '/sen-inclusion.html', name: 'AEN & Inclusion', short: 'AEN', wall: 'AEN & Inclusion Word Wall', concepts: 'AEN & Inclusion Concepts and Questions' },
    { path: '/differentiation-accessibility.html', name: 'Differentiation & Accessibility', short: 'DA', wall: 'Differentiation & Accessibility Word Wall', concepts: 'Differentiation & Accessibility Retrieval Draft' },
    { path: '/assessment-reporting.html', name: 'Assessment, Feedback & Reporting', short: 'AFR', wall: 'Assessment, Feedback & Reporting Word Wall', concepts: 'Assessment, Feedback & Reporting Concepts and Questions' },
    { path: '/planning-curriculum.html', name: 'Planning & Curriculum', short: 'PC', wall: 'Planning & Curriculum Word Wall', concepts: 'Planning & Curriculum Concepts and Questions' },
    { path: '/relationships-wellbeing.html', name: 'Relationships & Wellbeing', short: 'RW', wall: 'Relationships & Wellbeing Word Wall', concepts: 'Relationships & Wellbeing Concepts and Questions' },
    { path: '/professional-practice.html', name: 'Professional Responsibility', short: 'PR', wall: 'Professional Responsibility Word Wall', concepts: 'Professional Responsibility Concepts and Questions' },
    { path: '/school-research.html', name: "St Patrick's Comprehensive", short: 'SPC', wall: "St Patrick's Word Wall", concepts: "St Patrick's Retrieval Map", pageAudio: true }
  ];

  const domain = domains.find(item => location.pathname.endsWith(item.path));
  if (!domain) return;

  const body = document.getElementById('docBody');
  if (!body) return;

  const cleanNumber = value => (value || '').replace(/^\s*\d+[.)]?\s+/, '').trim();
  const removeVisibleNumber = element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node && !node.nodeValue.trim()) node = walker.nextNode();
    if (node) node.nodeValue = node.nodeValue.replace(/^\s*\d+[.)]?\s+/, '');
  };
  body.querySelectorAll(':scope > h2, table tbody td:first-child').forEach(removeVisibleNumber);

  const toolbar = document.querySelector('.doc-toolbar');
  const synth = window.speechSynthesis;
  if (!toolbar || !synth || typeof SpeechSynthesisUtterance === 'undefined') return;

  const headings = Array.from(body.querySelectorAll(':scope > h2'));
  const findHeading = text => headings.find(heading => cleanNumber(heading.textContent) === text);

  const tableAfter = heading => {
    let node = heading?.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      if (node.tagName === 'TABLE') return node;
      const nestedTable = node.querySelector?.('table');
      if (nestedTable) return nestedTable;
      node = node.nextElementSibling;
    }
    return null;
  };

  const wall = tableAfter(findHeading(domain.wall));
  const conceptsTable = tableAfter(findHeading(domain.concepts));

  const forSpeech = value => cleanNumber(value)
    .replace(/\s*\(\d+\)\s*$/g, '')
    .replace(/\bAEN\b/g, 'A. E. N.')
    .replace(/\bSEN\b/g, 'S. E. N.')
    .replace(/\bUDL\b/g, 'U. D. L.')
    .replace(/\bCPD\b/g, 'C. P. D.')
    .replace(/\bSSE\b/g, 'S. S. E.')
    .replace(/\bLCA\b/g, 'L. C. A.')
    .replace(/\bICT\b/g, 'I. C. T.')
    .replace(/&/g, ' and ')
    .replace(/\s+\/\s+/g, ' or ')
    .replace(/\s+/g, ' ')
    .trim();

  const answerAfter = heading => {
    let node = heading.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      if (node.matches('p, ul, ol, blockquote')) {
        const text = forSpeech(node.textContent);
        if (text) return text;
      }
      node = node.nextElementSibling;
    }
    return '';
  };

  const wordWallSegments = [];
  if (wall?.tagName === 'TABLE') {
    const headers = Array.from(wall.querySelectorAll('thead th'));
    const rows = Array.from(wall.querySelectorAll('tbody tr'));
    headers.forEach((header, column) => {
      const category = forSpeech(header.textContent);
      const terms = rows.map(row => forSpeech(row.children[column]?.textContent)).filter(Boolean);
      if (!category || !terms.length) return;
      wordWallSegments.push(
        { text: `${domain.name}. ${category}.`, rate: 0.84, delayAfter: 550, status: category },
        { text: terms.join('. '), rate: 0.92, delayAfter: 850, status: category }
      );
    });
  }

  const sourceConceptRows = conceptsTable?.tagName === 'TABLE'
    ? Array.from(conceptsTable.querySelectorAll('tbody tr')).map(row => ({
        concept: forSpeech(row.children[0]?.textContent),
        question: forSpeech(row.children[1]?.textContent)
      })).filter(row => row.concept || row.question)
    : [];

  const candidateItems = headings.map(heading => {
    const fullHeading = cleanNumber(heading.textContent);
    if (!fullHeading.includes('—')) return null;
    const parts = fullHeading.split(/\s+—\s+/);
    const question = forSpeech(parts.pop());
    const concept = forSpeech(parts.join(' — '));
    const answer = answerAfter(heading);
    if (!concept || !question || !answer) return null;
    return { heading, concept, question, answer };
  }).filter(Boolean);

  const conceptRows = sourceConceptRows.map(row => {
    const matchingItem = candidateItems.find(item => item.concept === row.concept);
    return {
      concept: row.concept,
      question: matchingItem?.question || row.question
    };
  });

  const conceptSegments = conceptRows.map(row => ({
    text: row.question ? `${row.concept}. ${row.question}` : row.concept,
    rate: 0.92,
    delayAfter: 500,
    status: row.concept
  }));

  const interviewItems = candidateItems.filter(item =>
    !conceptRows.length || conceptRows.some(row => row.concept === item.concept)
  );

  const interviewSegments = (item, showConcept) => [
    { text: item.question, rate: 0.89, delayAfter: 500, heading: item.heading, status: showConcept ? `Question · ${item.concept}` : 'Question' },
    { text: item.answer, rate: 0.92, delayAfter: 800, heading: item.heading, status: showConcept ? `Answer · ${item.concept}` : 'Answer' }
  ];

  const modes = domain.pageAudio ? {
    all: {
      label: 'Play all',
      title: `${domain.name} — whole page`,
      segments: [
        ...wordWallSegments,
        ...interviewItems.flatMap(item => interviewSegments(item, true))
      ]
    },
    wall: { label: `${domain.short} Word Wall`, title: `${domain.short} Word Wall`, segments: wordWallSegments },
    concepts: { label: `${domain.short} Retrieval Map`, title: `${domain.short} Retrieval Map`, segments: conceptSegments }
  } : {
    wall: { label: `${domain.short} Word Wall`, title: `${domain.short} Word Wall`, segments: wordWallSegments },
    concepts: { label: `${domain.short} Concepts`, title: `${domain.short} Concepts and Questions`, segments: conceptSegments },
    interview: { label: `${domain.short} Interview Questions`, title: `${domain.short} Interview Questions and Answers`, segments: interviewItems.flatMap(item => interviewSegments(item, true)) }
  };

  const launchers = document.createElement('div');
  launchers.className = 'cm-audio-launchers';
  launchers.setAttribute('aria-label', `${domain.name} audio`);

  const player = document.createElement('div');
  player.className = 'cm-audio-player';
  player.hidden = true;
  player.setAttribute('role', 'region');
  player.setAttribute('aria-label', 'Audio controls');

  const status = document.createElement('div');
  status.className = 'cm-audio-status';
  status.setAttribute('aria-live', 'polite');

  const playerControls = document.createElement('div');
  playerControls.className = 'cm-audio-player-controls';

  const pauseButton = document.createElement('button');
  pauseButton.type = 'button';
  pauseButton.className = 'cm-audio-control cm-audio-pause';
  pauseButton.innerHTML = '<span aria-hidden="true">❚❚</span><span class="visually-hidden">Pause</span>';
  pauseButton.setAttribute('aria-label', 'Pause audio');
  pauseButton.title = 'Pause';

  const stopButton = document.createElement('button');
  stopButton.type = 'button';
  stopButton.className = 'cm-audio-control cm-audio-stop';
  stopButton.innerHTML = '<span aria-hidden="true">■</span><span class="visually-hidden">Stop</span>';
  stopButton.setAttribute('aria-label', 'Stop audio');
  stopButton.title = 'Stop';

  playerControls.append(pauseButton, stopButton);
  player.append(status, playerControls);
  toolbar.prepend(launchers);
  toolbar.insertAdjacentElement('afterend', player);

  let preferredVoice = null;
  const selectVoice = () => {
    const voices = synth.getVoices();
    preferredVoice = voices.find(voice => /^en-IE$/i.test(voice.lang)) ||
      voices.find(voice => /^en-GB$/i.test(voice.lang)) ||
      voices.find(voice => /^en/i.test(voice.lang)) || null;
  };
  selectVoice();
  synth.addEventListener?.('voiceschanged', selectVoice);

  const launcherButtons = {};
  let runId = 0;
  let queue = [];
  let queueIndex = 0;
  let activeKey = null;
  let activeSource = null;
  let activeHeading = null;
  let paused = false;
  let delayTimer = null;
  let currentTitle = '';

  const clearActiveHeading = () => {
    activeHeading?.classList.remove('cm-audio-active-question');
    activeHeading = null;
  };

  const setActiveHeading = heading => {
    if (activeHeading === heading) return;
    clearActiveHeading();
    activeHeading = heading || null;
    activeHeading?.classList.add('cm-audio-active-question');
  };

  const updatePauseButton = () => {
    pauseButton.innerHTML = paused
      ? '<span aria-hidden="true">▶</span><span class="visually-hidden">Resume</span>'
      : '<span aria-hidden="true">❚❚</span><span class="visually-hidden">Pause</span>';
    pauseButton.setAttribute('aria-label', paused ? 'Resume audio' : 'Pause audio');
    pauseButton.title = paused ? 'Resume' : 'Pause';
    player.classList.toggle('is-paused', paused);
  };

  const resetSources = () => {
    Object.values(launcherButtons).forEach(button => button.classList.remove('is-active'));
    body.querySelectorAll('.cm-question-play').forEach(button => button.classList.remove('is-active'));
  };

  const finish = () => {
    window.clearTimeout(delayTimer);
    delayTimer = null;
    queue = [];
    queueIndex = 0;
    activeKey = null;
    activeSource = null;
    paused = false;
    currentTitle = '';
    resetSources();
    clearActiveHeading();
    updatePauseButton();
    player.hidden = true;
  };

  const stop = () => {
    runId += 1;
    window.clearTimeout(delayTimer);
    delayTimer = null;
    synth.cancel();
    finish();
  };

  const speakNext = sessionId => {
    if (sessionId !== runId || paused || !activeKey) return;
    if (queueIndex >= queue.length) {
      finish();
      return;
    }

    const segment = queue[queueIndex];
    queueIndex += 1;
    setActiveHeading(segment.heading);
    status.textContent = segment.status ? `${currentTitle} · ${segment.status}` : currentTitle;

    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.lang = 'en-IE';
    utterance.rate = segment.rate || 0.92;
    utterance.pitch = 1;
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.onend = () => {
      if (sessionId !== runId || !activeKey) return;
      delayTimer = window.setTimeout(() => speakNext(sessionId), segment.delayAfter || 350);
    };
    utterance.onerror = event => {
      if (sessionId !== runId || event.error === 'canceled' || event.error === 'interrupted') return;
      delayTimer = window.setTimeout(() => speakNext(sessionId), 100);
    };
    synth.speak(utterance);
  };

  const start = (key, title, segments, source) => {
    if (!segments.length) return;
    stop();
    runId += 1;
    const sessionId = runId;
    activeKey = key;
    activeSource = source;
    currentTitle = title;
    queue = segments;
    queueIndex = 0;
    paused = false;
    resetSources();
    activeSource?.classList.add('is-active');
    status.textContent = title;
    updatePauseButton();
    player.hidden = false;
    delayTimer = window.setTimeout(() => speakNext(sessionId), 60);
  };

  const pause = () => {
    if (!activeKey || paused) return;
    paused = true;
    window.clearTimeout(delayTimer);
    delayTimer = null;
    if (synth.speaking && !synth.paused) synth.pause();
    updatePauseButton();
  };

  const resume = () => {
    if (!activeKey || !paused) return;
    paused = false;
    updatePauseButton();
    if (synth.paused) synth.resume();
    else speakNext(runId);
  };

  const toggleSource = (key, title, segments, source) => {
    if (activeKey === key && activeSource === source) {
      if (paused) resume();
      else pause();
      return;
    }
    start(key, title, segments, source);
  };

  Object.entries(modes).forEach(([key, mode]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cm-audio-launch';
    button.textContent = mode.label;
    button.setAttribute('aria-label', `Play ${mode.title}`);
    button.title = `Play ${mode.title}`;
    button.disabled = !mode.segments.length;
    button.addEventListener('click', () => toggleSource(key, mode.title, mode.segments, button));
    launcherButtons[key] = button;
    launchers.appendChild(button);
  });

  interviewItems.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cm-question-play';
    button.setAttribute('aria-label', `Play question and answer: ${item.question}`);
    button.title = 'Play question and answer';
    const key = `question-${index}`;
    button.addEventListener('click', event => {
      event.stopPropagation();
      toggleSource(key, item.concept, interviewSegments(item, false), button);
    });
    item.heading.prepend(button);
  });

  pauseButton.addEventListener('click', () => paused ? resume() : pause());
  stopButton.addEventListener('click', stop);
  window.addEventListener('pagehide', stop);
  window.addEventListener('beforeunload', stop);
})();
