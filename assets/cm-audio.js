(() => {
  // Classroom Management audio is generated from the live page, so it always
  // follows the current Word Wall, concept table and interview answers. The
  // three top controls play complete sections; the small triangle beside an
  // interview question plays that question and its answer together.
  if (location.pathname.endsWith('/classroom-management.html')) {
    const body = document.getElementById('docBody');
    const toolbar = document.querySelector('.doc-toolbar');
    const synth = window.speechSynthesis;

    if (body && toolbar && synth && typeof SpeechSynthesisUtterance !== 'undefined') {
      const headings = Array.from(body.querySelectorAll('h2'));
      const findHeading = text => headings.find(heading => heading.textContent.trim() === text);
      const wallHeading = findHeading('Classroom Management Word Wall');
      const conceptsHeading = findHeading('Classroom Management Concepts and Questions');
      const interviewHeading = findHeading('Classroom Management Interview Questions');
      const wall = wallHeading?.nextElementSibling;
      const conceptsTable = conceptsHeading?.nextElementSibling;
      const interviewIndex = headings.indexOf(interviewHeading);
      const questionHeadings = interviewIndex >= 0 ? headings.slice(interviewIndex + 1) : [];

      const forSpeech = value => (value || '')
        .replace(/\s*\(\d+\)\s*$/g, '')
        .replace(/\bAEN\b/g, 'A. E. N.')
        .replace(/&/g, ' and ')
        .replace(/\s+\/\s+/g, ' or ')
        .replace(/\s+/g, ' ')
        .trim();

      const answerAfter = heading => {
        const parts = [];
        let node = heading.nextElementSibling;
        while (node && node.tagName !== 'H2') {
          if (node.matches('p, ul, ol, blockquote')) {
            const text = forSpeech(node.textContent);
            if (text) parts.push(text);
          }
          node = node.nextElementSibling;
        }
        return parts.join(' ');
      };

      const wordWallSegments = [];
      if (wall?.tagName === 'TABLE') {
        const categoryNames = {
          Prevent: 'Classroom management prevention strategies',
          Respond: 'Classroom management response strategies',
          Regulate: 'Classroom management regulation strategies',
          'Follow Up': 'Classroom management follow-up strategies',
          Repair: 'Classroom management repair strategies'
        };
        const headers = Array.from(wall.querySelectorAll('thead th'));
        const rows = Array.from(wall.querySelectorAll('tbody tr'));
        headers.forEach((header, column) => {
          const rawCategory = header.textContent.trim();
          const category = categoryNames[rawCategory] || `Classroom management ${rawCategory} strategies`;
          const terms = rows
            .map(row => forSpeech(row.children[column]?.textContent))
            .filter(Boolean);
          wordWallSegments.push(
            { text: category, rate: 0.84, delayAfter: 650, status: rawCategory },
            { text: terms.join('. '), rate: 0.92, delayAfter: 900, status: rawCategory }
          );
        });
      }

      const conceptSegments = conceptsTable?.tagName === 'TABLE'
        ? Array.from(conceptsTable.querySelectorAll('tbody tr')).map((row, index) => {
            const concept = forSpeech(row.children[0]?.textContent).replace(/^\d+\s*/, '');
            const question = forSpeech(row.children[1]?.textContent);
            return {
              text: `${concept}. ${question}`,
              rate: 0.92,
              delayAfter: 500,
              status: `Concept ${index + 1} of ${conceptsTable.querySelectorAll('tbody tr').length}: ${concept}`
            };
          }).filter(segment => segment.text.replace(/[.\s]/g, ''))
        : [];

      const interviewItems = questionHeadings.map((heading, index) => {
        const fullHeading = heading.textContent.trim();
        const split = fullHeading.split(/\s+—\s+/);
        const concept = forSpeech(split.shift());
        const question = forSpeech(split.join(' — ')) || concept;
        const answer = answerAfter(heading);
        return { heading, concept, question, answer, index };
      }).filter(item => item.answer);

      const segmentsForInterview = item => [
        {
          text: item.question,
          rate: 0.89,
          delayAfter: 500,
          heading: item.heading,
          status: `Question ${item.index + 1} of ${interviewItems.length}: ${item.concept}`
        },
        {
          text: item.answer,
          rate: 0.92,
          delayAfter: 800,
          heading: item.heading,
          status: `Answer ${item.index + 1} of ${interviewItems.length}: ${item.concept}`
        }
      ];

      const modes = {
        wall: {
          label: 'CM Word Wall',
          title: 'CM Word Wall',
          segments: wordWallSegments
        },
        concepts: {
          label: 'CM Concepts',
          title: 'CM Concepts and Questions',
          segments: conceptSegments
        },
        interview: {
          label: 'CM Interview Questions',
          title: 'CM Interview Questions and Answers',
          segments: interviewItems.flatMap(segmentsForInterview)
        }
      };

      const launchers = document.createElement('div');
      launchers.className = 'cm-audio-launchers';
      launchers.setAttribute('aria-label', 'Classroom Management audio');

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
        preferredVoice =
          voices.find(voice => /^en-IE$/i.test(voice.lang)) ||
          voices.find(voice => /^en-GB$/i.test(voice.lang)) ||
          voices.find(voice => /^en/i.test(voice.lang)) ||
          null;
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

      interviewItems.forEach(item => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cm-question-play';
        button.setAttribute('aria-label', `Play question and answer: ${item.question}`);
        button.title = 'Play question and answer';
        const key = `question-${item.index + 1}`;
        button.addEventListener('click', event => {
          event.stopPropagation();
          toggleSource(key, item.concept, segmentsForInterview(item), button);
        });
        item.heading.prepend(button);
      });

      pauseButton.addEventListener('click', () => {
        if (paused) resume();
        else pause();
      });
      stopButton.addEventListener('click', stop);
      window.addEventListener('pagehide', stop);
      window.addEventListener('beforeunload', stop);
    }
  }
})();

