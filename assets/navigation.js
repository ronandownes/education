(() => {
  const topbar = document.querySelector('.topbar');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  if (!topbar || !mobileNavToggle) return;

  const brand = document.querySelector('.brand');
  const siteRoot = brand?.href || `${location.origin}/`;
  const siteHref = path => new URL(path.replace(/^\/+/, ''), siteRoot).href;

  // Interview dropdowns are reading/rehearsal tools. On a desktop, use nearly the
  // full available screen height so long 24-question banks remain visible without
  // an unnecessary small internal scroll box.
  const interviewMenuStyle = document.createElement('style');
  interviewMenuStyle.textContent = '@media (min-width:1501px){.topnav .dropmenu{max-height:calc(100vh - 92px)!important;overflow-y:auto!important;}}';
  document.head.appendChild(interviewMenuStyle);

  // Keep the information architecture compact: Profiles contains class and school
  // profiles; Glossary and Timeline are no longer permanent top-level items.
  const profilesItem = document.querySelector('.nav-classes');
  if (profilesItem) {
    profilesItem.classList.add('nav-profiles');
    const label = profilesItem.querySelector(':scope > .navlabel');
    const toggle = profilesItem.querySelector(':scope > [data-nav-toggle]');
    const menu = profilesItem.querySelector(':scope > .dropmenu');

    if (label) {
      label.href = siteHref('content/profiles.html');
      const text = label.querySelector('span');
      if (text) text.textContent = 'Profiles';
    }
    if (toggle) toggle.setAttribute('aria-label', 'Open Profiles menu');

    if (menu) {
      const addProfileLink = (href, text) => {
        if (Array.from(menu.querySelectorAll('a')).some(link => link.href === href)) return;
        const link = document.createElement('a');
        link.href = href;
        link.textContent = text;
        link.dataset.menuPage = '';
        menu.insertBefore(link, menu.firstChild);
      };

      addProfileLink(siteHref('content/schools/st-patricks.html'), "School Profiles — St Patrick's Comprehensive");
      addProfileLink(siteHref('teaching/class-profiles.html'), 'Class Profiles — overview');
    }
  }

  // Professional Responsibility is an interview-question bank, not a shelf of
  // separate pages. Keep useful material as H2 sections on the page itself.
  const professionalMenu = document.querySelector('.nav-professional > .dropmenu');
  professionalMenu?.querySelectorAll('a').forEach(link => {
    const url = new URL(link.href, location.href);
    if (
      url.pathname.endsWith('/timeline.html') ||
      url.pathname.endsWith('/school-research.html') ||
      url.pathname.endsWith('/content/schools/st-patricks.html')
    ) {
      link.remove();
    }
  });

  document.querySelector('.nav-glossary')?.remove();
  document.querySelector('.nav-timeline')?.remove();
  const topnav = document.querySelector('.topnav');
  const plansItem = document.querySelector('.nav-plans');
  if (profilesItem) topnav?.appendChild(profilesItem);
  if (plansItem) topnav?.appendChild(plansItem);

  // Keep the old /timeline.html URL working, but stop presenting the page as a
  // "Timeline" now that its useful role is an evidence bank for experience.
  if (location.pathname.endsWith('/timeline.html')) {
    document.title = document.title.replace(/^Timeline(?=\s*\|)/, 'Teaching Experience');
    const pageHeading = document.querySelector('main h1');
    if (pageHeading && pageHeading.textContent.trim() === 'Timeline') {
      pageHeading.textContent = 'Teaching Experience';
    }
    const kicker = document.querySelector('.doc-kicker');
    if (kicker && kicker.textContent.trim().toUpperCase() === 'TIMELINE') {
      kicker.textContent = 'PROFESSIONAL EVIDENCE';
    }
  }

  // Teaching & Learning uses "chunk" three times in the current interview answers.
  // Surface that settled language in the live Word Wall and visually reinforce the
  // same term in the answers.
  if (location.pathname.endsWith('/teaching-learning.html')) {
    const body = document.getElementById('docBody');
    if (body) {
      const wallHeading = Array.from(body.querySelectorAll('h2')).find(
        heading => heading.textContent.trim() === 'Teaching & Learning Word Wall'
      );
      const wall = wallHeading?.nextElementSibling;
      if (wall?.tagName === 'TABLE') {
        const headers = Array.from(wall.querySelectorAll('thead th'));
        const teachIndex = headers.findIndex(header => header.textContent.trim() === 'Teach');
        if (teachIndex >= 0) {
          const rows = Array.from(wall.querySelectorAll('tbody tr'));
          const alreadyPresent = rows.some(row =>
            row.children[teachIndex]?.textContent.trim().toLowerCase().startsWith('chunk')
          );
          if (!alreadyPresent) {
            let targetCell = rows
              .map(row => row.children[teachIndex])
              .find(cell => cell && !cell.textContent.trim());

            if (!targetCell) {
              const row = document.createElement('tr');
              headers.forEach(() => row.appendChild(document.createElement('td')));
              wall.querySelector('tbody')?.appendChild(row);
              targetCell = row.children[teachIndex];
            }
            if (targetCell) targetCell.textContent = 'Chunk (3)';
          }
        }
      }

      const textNodes = [];
      const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!/\bchunk\b/i.test(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent || parent.closest('strong, a, code, table')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      while (walker.nextNode()) textNodes.push(walker.currentNode);

      textNodes.forEach(node => {
        const parts = node.nodeValue.split(/(\bchunk\b)/gi);
        if (parts.length < 2) return;
        const fragment = document.createDocumentFragment();
        parts.forEach(part => {
          if (/^chunk$/i.test(part)) {
            const strong = document.createElement('strong');
            strong.textContent = part;
            fragment.appendChild(strong);
          } else {
            fragment.appendChild(document.createTextNode(part));
          }
        });
        node.replaceWith(fragment);
      });

      // Teaching & Learning audio is generated directly from the current page
      // text, avoiding room/microphone artefacts. The top control reads every
      // question and answer; each interview question also gets one small,
      // unambiguous play control for its own question-and-answer pair.
      const toolbar = document.querySelector('.doc-toolbar');
      const synth = window.speechSynthesis;
      if (toolbar && synth && typeof SpeechSynthesisUtterance !== 'undefined' && !document.querySelector('.tl-audio-panel')) {
        const questionHeadings = Array.from(body.querySelectorAll(':scope > h2')).filter(
          heading => /^\d+\s/.test(heading.textContent.trim())
        );
        const pairs = questionHeadings.map(heading => {
          const headingText = heading.textContent.replace(/\s+/g, ' ').trim();
          const question = headingText.split(/\s+—\s+/).pop() || headingText;
          const answerParts = [];
          let node = heading.nextElementSibling;
          while (node && node.tagName !== 'H2') {
            if (node.matches('p, ul, ol, blockquote')) {
              const text = node.textContent.replace(/\s+/g, ' ').trim();
              if (text) answerParts.push(text);
            }
            node = node.nextElementSibling;
          }
          return { heading, question, answer: answerParts.join(' ') };
        }).filter(pair => pair.question && pair.answer);

        const panel = document.createElement('section');
        panel.className = 'tl-audio-panel';
        panel.setAttribute('aria-labelledby', 'tl-audio-title');
        panel.innerHTML = `
          <div class="tl-audio-copy">
            <p class="tl-audio-eyebrow">TEACHING &amp; LEARNING AUDIO</p>
            <h2 id="tl-audio-title">Question first. Answer second.</h2>
            <p>Clean synthetic voice from the current page text · ${pairs.length} interview questions</p>
          </div>
          <div class="tl-audio-actions">
            <button class="tl-play-all" type="button">
              <span class="tl-play-icon" aria-hidden="true"></span>
              <span class="tl-play-label">Play all Q&amp;A</span>
            </button>
            <button class="tl-audio-stop" type="button" hidden>Stop</button>
            <p class="tl-audio-status" aria-live="polite">Ready</p>
          </div>
        `;

        const playAllButton = panel.querySelector('.tl-play-all');
        const playAllLabel = panel.querySelector('.tl-play-label');
        const stopButton = panel.querySelector('.tl-audio-stop');
        const status = panel.querySelector('.tl-audio-status');
        const questionButtons = [];
        let selectedVoice = null;
        let activeButton = null;
        let currentQueue = [];
        let queueIndex = 0;
        let runId = 0;

        const selectVoice = () => {
          const voices = synth.getVoices();
          selectedVoice = voices.find(voice => voice.lang.toLowerCase() === 'en-ie')
            || voices.find(voice => voice.lang.toLowerCase().startsWith('en-gb') && /natural|google|microsoft|siri/i.test(voice.name))
            || voices.find(voice => voice.lang.toLowerCase().startsWith('en-gb'))
            || voices.find(voice => voice.lang.toLowerCase().startsWith('en'))
            || null;
        };
        selectVoice();
        synth.addEventListener?.('voiceschanged', selectVoice);

        const resetControls = () => {
          playAllButton.classList.remove('is-playing');
          playAllButton.setAttribute('aria-pressed', 'false');
          playAllLabel.textContent = 'Play all Q&A';
          questionButtons.forEach(button => {
            button.classList.remove('is-playing');
            button.setAttribute('aria-pressed', 'false');
          });
        };

        const finish = () => {
          resetControls();
          activeButton = null;
          currentQueue = [];
          queueIndex = 0;
          stopButton.hidden = true;
          status.textContent = 'Ready';
        };

        const stop = () => {
          runId += 1;
          synth.cancel();
          finish();
        };

        const setPlayingState = playing => {
          resetControls();
          if (!activeButton) return;
          activeButton.classList.toggle('is-playing', playing);
          activeButton.setAttribute('aria-pressed', String(playing));
          if (activeButton === playAllButton) {
            playAllLabel.textContent = playing ? 'Pause' : 'Resume';
            playAllButton.classList.toggle('is-playing', playing);
          }
        };

        const speakNext = sessionId => {
          if (sessionId !== runId || !activeButton) return;
          if (queueIndex >= currentQueue.length) {
            finish();
            return;
          }

          const segment = currentQueue[queueIndex];
          const utterance = new SpeechSynthesisUtterance(segment.text);
          utterance.lang = 'en-IE';
          utterance.rate = segment.type === 'question' ? 0.92 : 0.96;
          utterance.pitch = 1;
          if (selectedVoice) utterance.voice = selectedVoice;
          utterance.onend = () => {
            if (sessionId !== runId) return;
            queueIndex += 1;
            speakNext(sessionId);
          };
          utterance.onerror = () => {
            if (sessionId === runId) finish();
          };
          status.textContent = segment.status;
          synth.speak(utterance);
        };

        const start = (segments, button) => {
          runId += 1;
          const sessionId = runId;
          synth.cancel();
          activeButton = button;
          currentQueue = segments;
          queueIndex = 0;
          stopButton.hidden = false;
          setPlayingState(true);
          speakNext(sessionId);
        };

        pairs.forEach((pair, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'tl-question-audio';
          button.title = 'Play this question and answer';
          button.setAttribute('aria-label', `Play question ${index + 1} and its answer`);
          button.setAttribute('aria-pressed', 'false');
          button.addEventListener('click', event => {
            event.stopPropagation();
            if (activeButton === button && synth.speaking && !synth.paused) {
              synth.pause();
              setPlayingState(false);
              status.textContent = `Question ${index + 1} paused`;
              return;
            }
            if (activeButton === button && synth.paused) {
              synth.resume();
              setPlayingState(true);
              status.textContent = `Playing question ${index + 1}`;
              return;
            }
            start([
              { text: pair.question, type: 'question', status: `Question ${index + 1}` },
              { text: pair.answer, type: 'answer', status: `Answer ${index + 1}` }
            ], button);
          });
          pair.heading.append(' ', button);
          questionButtons.push(button);
        });

        playAllButton.setAttribute('aria-pressed', 'false');
        playAllButton.addEventListener('click', () => {
          if (activeButton === playAllButton && synth.speaking && !synth.paused) {
            synth.pause();
            setPlayingState(false);
            status.textContent = 'All questions paused';
            return;
          }
          if (activeButton === playAllButton && synth.paused) {
            synth.resume();
            setPlayingState(true);
            return;
          }
          const allSegments = pairs.flatMap((pair, index) => [
            { text: pair.question, type: 'question', status: `Question ${index + 1} of ${pairs.length}` },
            { text: pair.answer, type: 'answer', status: `Answer ${index + 1} of ${pairs.length}` }
          ]);
          start(allSegments, playAllButton);
        });
        stopButton.addEventListener('click', stop);
        window.addEventListener('beforeunload', stop);
        toolbar.before(panel);
      }
    }
  }

  // Planning & Curriculum Word Wall: selecting a term highlights every interview
  // question/answer that uses it. This is deliberately page-scoped so the rest of
  // the site and the editable Markdown remain untouched.
  if (location.pathname.endsWith('/planning-curriculum.html')) {
    const body = document.getElementById('docBody');
    if (body) {
      const wallHeading = Array.from(body.querySelectorAll('h2')).find(
        heading => heading.textContent.trim() === 'Planning & Curriculum Word Wall'
      );
      const wall = wallHeading?.nextElementSibling;

      if (wall?.tagName === 'TABLE') {
        wall.classList.add('interactive-word-wall');

        const style = document.createElement('style');
        style.textContent = `
          .interactive-word-wall tbody td.wordwall-term{cursor:pointer;transition:background .12s ease,box-shadow .12s ease,color .12s ease}
          .interactive-word-wall tbody td.wordwall-term:hover,.interactive-word-wall tbody td.wordwall-term:focus-visible{outline:none;box-shadow:inset 0 0 0 2px #34a853;background:#f3fbf5!important}
          .interactive-word-wall tbody td.wordwall-term.is-selected{box-shadow:inset 0 0 0 3px #34a853;background:#e6f4ea!important;color:#137333;font-weight:700}
          .wordwall-results{margin:-10px 0 26px;padding:12px 14px;border:1px solid #ceead6;border-radius:10px;background:#f6fff8}
          .wordwall-results-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px;color:#137333;font-weight:700}
          .wordwall-results-clear{border:1px solid #a8dab5;border-radius:999px;background:#fff;color:#137333;padding:4px 9px;font:inherit;font-size:.76rem;cursor:pointer}
          .wordwall-results-list{display:flex;flex-wrap:wrap;gap:7px}
          .wordwall-question-chip{display:inline-block;padding:6px 10px;border:2px solid #34a853;border-radius:999px;background:#fff;color:#137333;text-decoration:none;font-size:.78rem;font-weight:700;line-height:1.25}
          .wordwall-question-chip:hover,.wordwall-question-chip:focus-visible{background:#e6f4ea;outline:none}
          .doc-body h2.wordwall-question-hit{margin-top:8px;padding:8px 12px;border:2px solid #34a853;border-radius:14px;background:#e6f4ea;box-shadow:0 0 0 2px rgba(52,168,83,.08);scroll-margin-top:112px}
          mark.wordwall-term-mark{background:#b7e1cd;color:inherit;border-radius:3px;padding:0 .08em}
          @media(max-width:600px){.wordwall-results-head{align-items:flex-start}.wordwall-question-chip{font-size:.74rem}}
          @media print{.wordwall-results{display:none!important}.interactive-word-wall tbody td.wordwall-term{box-shadow:none!important}.doc-body h2.wordwall-question-hit{padding:0;border:0;background:transparent;box-shadow:none}mark.wordwall-term-mark{background:transparent;padding:0}}
        `;
        document.head.appendChild(style);

        const results = document.createElement('div');
        results.className = 'wordwall-results';
        results.hidden = true;
        wall.insertAdjacentElement('afterend', results);

        const questionHeadings = Array.from(body.querySelectorAll('h2')).filter(heading =>
          /^\s*\d+\b/.test(heading.textContent.trim())
        );

        const questionSections = questionHeadings.map((heading, index) => {
          if (!heading.id) heading.id = `planning-question-${index + 1}`;
          const nodes = [];
          let node = heading.nextElementSibling;
          while (node && node.tagName !== 'H2') {
            nodes.push(node);
            node = node.nextElementSibling;
          }
          return {
            heading,
            nodes,
            text: [heading.textContent, ...nodes.map(item => item.textContent || '')].join(' ')
          };
        });

        const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const normaliseTerm = value => value
          .toLowerCase()
          .replace(/[–—-]/g, ' ')
          .replace(/&/g, ' and ')
          .replace(/[^a-z0-9\s]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const stopWords = new Set(['a', 'an', 'the', 'of', 'and', 'to']);

        const tokenPattern = token => {
          const special = {
            assessment: 'assess\\w*',
            assessments: 'assess\\w*',
            challenge: 'challeng\\w*',
            consolidation: 'consolidat\\w*',
            decisions: 'decision\\w*',
            evidence: 'evidenc\\w*',
            expectations: 'expect\\w*',
            generalisation: 'generalis\\w*',
            grouping: 'group\\w*',
            independence: 'independen\\w*',
            interleaving: 'interleav\\w*',
            justification: 'justif\\w*',
            misconceptions: 'misconcept\\w*',
            observation: 'observ\\w*',
            outcomes: 'outcome\\w*',
            processing: 'process\\w*',
            progression: 'progress\\w*',
            questioning: 'question\\w*',
            reflect: 'reflect\\w*',
            representation: 'represent\\w*',
            representations: 'represent\\w*',
            responsive: 'respons\\w*',
            scaffold: 'scaffold\\w*',
            support: 'support\\w*',
            change: 'chang\\w*'
          };
          if (special[token]) return special[token];
          if (token.length > 4 && token.endsWith('s')) return `${escapeRegex(token.slice(0, -1))}\\w*`;
          if (token.length > 4) return `${escapeRegex(token)}\\w*`;
          return escapeRegex(token);
        };

        const matcherSource = term => {
          const key = normaliseTerm(term);
          if (key === 'revisit learning') return '\\brevisit\\w*\\b';
          const tokens = key.split(' ').filter(token => token && !stopWords.has(token));
          if (!tokens.length) return null;
          const joined = tokens.map(tokenPattern).join('(?:\\W+\\w+){0,6}\\W+');
          return `\\b${joined}\\b`;
        };

        const clearMarks = () => {
          body.querySelectorAll('mark.wordwall-term-mark').forEach(mark => {
            mark.replaceWith(document.createTextNode(mark.textContent || ''));
          });
          body.normalize();
        };

        const clearSelection = () => {
          wall.querySelectorAll('td.wordwall-term').forEach(cell => {
            cell.classList.remove('is-selected');
            cell.setAttribute('aria-pressed', 'false');
          });
          questionHeadings.forEach(heading => heading.classList.remove('wordwall-question-hit'));
          clearMarks();
          results.hidden = true;
          results.replaceChildren();
        };

        const markMatches = (nodes, source) => {
          const regex = new RegExp(source, 'gi');
          nodes.forEach(root => {
            const textNodes = [];
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
              acceptNode(node) {
                const parent = node.parentElement;
                if (!parent || parent.closest('script, style, table, mark, .wordwall-results')) return NodeFilter.FILTER_REJECT;
                regex.lastIndex = 0;
                return regex.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
              }
            });
            while (walker.nextNode()) textNodes.push(walker.currentNode);

            textNodes.forEach(node => {
              const text = node.nodeValue || '';
              const local = new RegExp(source, 'gi');
              let match;
              let last = 0;
              let changed = false;
              const fragment = document.createDocumentFragment();
              while ((match = local.exec(text))) {
                if (match.index > last) fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
                const mark = document.createElement('mark');
                mark.className = 'wordwall-term-mark';
                mark.textContent = match[0];
                fragment.appendChild(mark);
                last = match.index + match[0].length;
                changed = true;
                if (match[0].length === 0) local.lastIndex += 1;
              }
              if (!changed) return;
              if (last < text.length) fragment.appendChild(document.createTextNode(text.slice(last)));
              node.replaceWith(fragment);
            });
          });
        };

        const shortQuestion = heading => {
          const parts = heading.textContent.trim().split(/\s+—\s+/);
          if (parts.length > 1 && /\?$/.test(parts[parts.length - 1])) parts.pop();
          return parts.join(' — ');
        };

        const selectTerm = cell => {
          const raw = cell.textContent.trim();
          const parsed = raw.match(/^(.*?)(?:\s*\((\d+)\))?$/);
          const term = parsed?.[1]?.trim() || raw;
          const count = Number(parsed?.[2] || 0);
          const source = matcherSource(term);
          if (!term || !source) return;

          const alreadySelected = cell.classList.contains('is-selected');
          clearSelection();
          if (alreadySelected) return;

          cell.classList.add('is-selected');
          cell.setAttribute('aria-pressed', 'true');

          const matcher = new RegExp(source, 'i');
          const matches = questionSections.filter(section => matcher.test(section.text));
          matches.forEach(section => {
            section.heading.classList.add('wordwall-question-hit');
            markMatches(section.nodes, source);
          });

          const head = document.createElement('div');
          head.className = 'wordwall-results-head';
          const title = document.createElement('span');
          const usage = count ? `${term} (${count})` : term;
          title.textContent = `${usage} · ${matches.length} question${matches.length === 1 ? '' : 's'}`;
          const clear = document.createElement('button');
          clear.type = 'button';
          clear.className = 'wordwall-results-clear';
          clear.textContent = 'Clear';
          clear.addEventListener('click', clearSelection);
          head.append(title, clear);

          const list = document.createElement('div');
          list.className = 'wordwall-results-list';
          matches.forEach(section => {
            const chip = document.createElement('a');
            chip.className = 'wordwall-question-chip';
            chip.href = `#${section.heading.id}`;
            chip.textContent = shortQuestion(section.heading);
            chip.title = section.heading.textContent.trim();
            chip.addEventListener('click', event => {
              event.preventDefault();
              history.replaceState(null, '', `#${section.heading.id}`);
              section.heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            list.appendChild(chip);
          });

          results.append(head, list);
          results.hidden = false;
        };

        wall.querySelectorAll('tbody td').forEach(cell => {
          if (!cell.textContent.trim()) return;
          cell.classList.add('wordwall-term');
          cell.tabIndex = 0;
          cell.setAttribute('role', 'button');
          cell.setAttribute('aria-pressed', 'false');
          cell.title = 'Show the Planning & Curriculum questions that use this term';
          cell.addEventListener('click', () => selectTerm(cell));
          cell.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectTerm(cell);
          });
        });
      }
    }
  }

  // The document layout rebuilds question menus from the current rendered headings.
  // Before that async rebuild finishes, make every old hard-coded hash a safe page
  // fallback rather than leaving a stale/dead anchor clickable.
  document.querySelectorAll('.topnav .dropmenu a[href*="#"]').forEach(link => {
    const url = new URL(link.href, location.href);
    link.href = `${url.pathname}${url.search}`;
  });

  const closeSubmenus = (except = null) => {
    document.querySelectorAll('.navitem.is-open').forEach(item => {
      if (item === except) return;
      item.classList.remove('is-open');
      item.querySelectorAll('[data-nav-toggle]').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
      });
    });
  };

  const closeMobileNav = () => {
    topbar.classList.remove('nav-open');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNavToggle.setAttribute('aria-label', 'Open main navigation');
    closeSubmenus();
  };

  mobileNavToggle.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    const willOpen = !topbar.classList.contains('nav-open');
    topbar.classList.toggle('nav-open', willOpen);
    mobileNavToggle.setAttribute('aria-expanded', String(willOpen));
    mobileNavToggle.setAttribute('aria-label', willOpen ? 'Close main navigation' : 'Open main navigation');
    if (!willOpen) closeSubmenus();
  });

  document.querySelectorAll('.navitem > .navlabel').forEach(label => {
    label.addEventListener('click', event => {
      if (window.innerWidth > 1500) return;
      const item = label.closest('.navitem');
      const menu = item?.querySelector(':scope > .dropmenu');
      if (!item || !menu || item.classList.contains('is-open')) return;
      event.preventDefault();
      event.stopPropagation();
      closeSubmenus(item);
      item.classList.add('is-open');
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.topbar')) closeMobileNav();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMobileNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1500) closeMobileNav();
  });
})();
