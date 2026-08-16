(() => {
  const body = document.getElementById('docBody');
  const isProfilePage = /\/teaching\/class-profiles\//.test(location.pathname);

  const numberWords = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12
  };

  const normaliseNumbers = text => text.replace(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/gi,
    word => String(numberWords[word.toLowerCase()] ?? word)
  );

  const textOf = section => section ? section.nodes.map(node => node.textContent.trim()).filter(Boolean).join(' ') : '';
  const keyOf = text => text.trim().toLowerCase().replace(/\s+/g, ' ');

  function collectSections(container) {
    const sections = new Map();
    let current = null;
    Array.from(container.children).forEach(node => {
      if (node.tagName === 'H2') {
        current = { heading: node, nodes: [] };
        sections.set(keyOf(node.textContent), current);
      } else if (current) {
        current.nodes.push(node);
      }
    });
    return sections;
  }

  function findSection(sections, ...names) {
    for (const name of names) {
      const exact = sections.get(keyOf(name));
      if (exact) return exact;
    }
    for (const section of sections.values()) {
      const label = keyOf(section.heading.textContent);
      if (names.some(name => label.includes(keyOf(name)))) return section;
    }
    return null;
  }

  function extractAccessItems(text, classSize) {
    const source = normaliseNumbers(text);
    const patterns = [
      { label: 'Dyslexia', re: /(\d+)\s+(?:(?:students?|learners?)\s+)?(?:with\s+)?(?:identified\s+)?dyslexia\b/i },
      { label: 'ADHD', re: /(\d+)\s+(?:(?:students?|learners?)\s+)?(?:with\s+)?(?:identified\s+)?ADHD\b/i },
      { label: 'Autism', re: /(\d+)\s+(?:autistic\s+(?:students?|learners?)|(?:(?:students?|learners?)\s+)(?:with\s+)?(?:autism|ASD))\b/i },
      { label: 'EAL', re: /(\d+)\s+(?:EAL\s+(?:students?|learners?)|(?:(?:students?|learners?)\s+)(?:with\s+)?EAL)\b/i },
      { label: 'Language disorder', re: /(\d+)\s+(?:(?:students?|learners?)\s+)?(?:with\s+)?developmental language disorder\b/i },
      { label: 'Language needs', re: /(\d+)\s+(?:(?:students?|learners?)\s+)?(?:with\s+)?language needs\b/i },
      { label: 'Performance anxiety', re: /(\d+)\s+(?:(?:students?|learners?)\s+)?(?:with\s+|experiencing\s+)?(?:high\s+)?performance anxiety\b/i },
      { label: 'Anxiety', re: /(\d+)\s+(?:(?:students?|learners?)\s+)?(?:with\s+|experiencing\s+|whose\s+)?anxiety\b/i },
      { label: 'School avoidance', re: /(\d+)\s+(?:(?:students?|learners?)\s+)?(?:with\s+)?(?:significant\s+)?school[- ]avoidance\b/i },
      { label: 'Further assessment', re: /(\d+)\s+(?:(?:students?|learners?)\s+)?(?:awaiting\s+|requiring\s+)?further assessment\b/i }
    ];

    const seen = new Set();
    return patterns.flatMap(({ label, re }) => {
      const match = source.match(re);
      if (!match || seen.has(label)) return [];
      seen.add(label);
      const count = Number(match[1]);
      const percent = classSize ? Math.min(100, (count / classSize) * 100) : null;
      return [{ label, count, percent }];
    });
  }

  function extractAccessChips(text) {
    const source = text.toLowerCase();
    const options = [
      ['Dyslexia', /dyslexia/],
      ['ADHD', /adhd/],
      ['Autism', /autis|\basd\b/],
      ['EAL', /\beal\b/],
      ['Language', /language disorder|language needs|academic vocabulary/],
      ['Anxiety', /anxiety/],
      ['Attendance', /attendance/],
      ['School avoidance', /school[- ]avoidance/],
      ['Bereavement', /bereavement/],
      ['Regulation', /regulation|dysregulation/],
      ['Working memory', /working memory/],
      ['Sensory', /sensory/]
    ];
    return options.filter(([, re]) => re.test(source)).map(([label]) => label);
  }

  function pathwayFromTitle(title) {
    if (/learning[- ]support|learning support/i.test(title)) return 'Support';
    if (/ordinary level/i.test(title)) return 'OL';
    if (/higher level/i.test(title)) return 'HL';
    if (/\bLCA\b/i.test(title)) return 'LCA';
    if (/transition year|\bTY\b/i.test(title)) return 'TY';
    if (/first year/i.test(title)) return '1st year';
    if (/second year/i.test(title)) return '2nd year';
    if (/third year/i.test(title)) return '3rd year';
    if (/fifth year/i.test(title)) return '5th year';
    if (/sixth year/i.test(title)) return '6th year';
    if (/digital|computer/i.test(title)) return 'Digital';
    return 'Mixed';
  }

  function makeSnapshot(value, label, tone = 'blue') {
    const card = document.createElement('div');
    card.className = `profile-snapshot tone-${tone}`;
    const valueNode = document.createElement('strong');
    valueNode.className = 'profile-snapshot-value';
    valueNode.textContent = value;
    const labelNode = document.createElement('span');
    labelNode.className = 'profile-snapshot-label';
    labelNode.textContent = label;
    card.append(valueNode, labelNode);
    return card;
  }

  function makePanel(title, className = '') {
    const panel = document.createElement('section');
    panel.className = `profile-panel ${className}`.trim();
    const heading = document.createElement('h2');
    heading.textContent = title;
    panel.appendChild(heading);
    return panel;
  }

  function appendNodes(panel, section) {
    if (!section) return;
    section.nodes.forEach(node => panel.appendChild(node));
  }

  function buildStrengthList(text) {
    const list = document.createElement('div');
    list.className = 'profile-strength-list';
    const parts = text.split(/;|,(?=\s+(?:good|strong|high|several|supportive|positive|reliable|practical|creative|willingness|interest|confidence|fast|curiosity))/i)
      .map(part => part.trim().replace(/[.;]+$/, ''))
      .filter(Boolean)
      .slice(0, 4);
    (parts.length ? parts : [text]).forEach((part, index) => {
      const item = document.createElement('div');
      item.className = 'profile-strength-item';
      const icon = document.createElement('span');
      icon.className = 'profile-strength-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = ['◆', '●', '▲', '■'][index % 4];
      const copy = document.createElement('span');
      copy.textContent = part;
      item.append(icon, copy);
      list.appendChild(item);
    });
    return list;
  }

  function buildAccessPanel(profileText, accessItems, accessChips, classSize) {
    const panel = makePanel('AEN & access picture', 'profile-access-panel');
    if (accessItems.length) {
      const chart = document.createElement('div');
      chart.className = 'profile-bar-chart';
      accessItems.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = `profile-bar-row bar-tone-${(index % 4) + 1}`;
        const label = document.createElement('span');
        label.className = 'profile-bar-label';
        label.textContent = item.label;
        const track = document.createElement('span');
        track.className = 'profile-bar-track';
        const fill = document.createElement('span');
        fill.className = 'profile-bar-fill';
        const visualPercent = item.percent == null ? Math.min(100, item.count * 10) : item.percent;
        fill.style.width = `${visualPercent}%`;
        track.appendChild(fill);
        const count = document.createElement('span');
        count.className = 'profile-bar-count';
        count.textContent = String(item.count);
        if (classSize && item.percent != null) {
          row.setAttribute('aria-label', `${item.label}: ${item.count} of ${classSize} students`);
        } else {
          row.setAttribute('aria-label', `${item.label}: ${item.count}`);
        }
        row.append(label, track, count);
        chart.appendChild(row);
      });
      panel.appendChild(chart);
    }

    if (accessChips.length) {
      const chips = document.createElement('div');
      chips.className = 'profile-access-chips';
      accessChips.forEach(label => {
        const chip = document.createElement('span');
        chip.textContent = label;
        chips.appendChild(chip);
      });
      panel.appendChild(chips);
    }

    if (profileText) {
      const note = document.createElement('p');
      note.className = 'profile-panel-note';
      note.textContent = profileText;
      panel.appendChild(note);
    }
    return panel;
  }

  function enhanceProfilePage() {
    if (!body || !isProfilePage) return;
    const paper = body.closest('.doc-paper');
    paper?.classList.add('profile-dashboard-page');

    const existing = body.querySelector(':scope > .class-dashboard');
    if (existing) {
      existing.classList.add('profile-dashboard-enhanced');
      const supportTitle = existing.querySelector('#profile-title');
      if (supportTitle) supportTitle.textContent = 'AEN & access picture';
      existing.querySelectorAll('.bar-row').forEach(row => {
        const label = row.querySelector('.bar-label')?.textContent.trim();
        const count = row.querySelector('.bar-count')?.textContent.trim();
        if (label && count) row.setAttribute('aria-label', `${label}: ${count}`);
      });
      return;
    }

    const sections = collectSections(body);
    if (!sections.size) return;

    const context = findSection(sections, 'Class context');
    const strengths = findSection(sections, 'Strengths and interests');
    const profile = findSection(sections, 'Fictional learning and access profile', 'Learning and access profile');
    const evidence = findSection(sections, 'Starting evidence');
    const response = findSection(sections, 'Planned teaching response');
    const review = findSection(sections, 'Assessment and review loop');
    const connected = findSection(sections, 'Connected pages');
    const interview = findSection(sections, 'Interview language');

    const notice = body.querySelector(':scope > blockquote');
    const mapRoot = body.querySelector('.class-map');
    const mapNote = body.querySelector('.class-map-note');
    const title = document.querySelector('.doc-paper > h1')?.textContent.trim() || document.title;
    const contextText = textOf(context);
    const noteText = mapNote?.textContent || '';
    const classSizeMatch = normaliseNumbers(`${contextText} ${noteText}`).match(/\b(\d{1,3})\s+(?:students?|learners?)\b/i);
    const classSize = classSizeMatch ? Number(classSizeMatch[1]) : null;
    const profileText = textOf(profile);
    const accessItems = extractAccessItems(profileText, classSize);
    const accessChips = extractAccessChips(profileText);
    const mapCount = mapRoot ? Number(mapRoot.dataset.count || 0) : 0;

    const dashboard = document.createElement('div');
    dashboard.className = 'profile-dashboard profile-dashboard-auto';

    if (notice) {
      notice.classList.add('profile-synthetic-notice');
      dashboard.appendChild(notice);
    }

    const glance = document.createElement('section');
    glance.className = 'profile-glance';
    const glanceTitle = document.createElement('h2');
    glanceTitle.textContent = 'Class at a glance';
    const snapshots = document.createElement('div');
    snapshots.className = 'profile-snapshot-grid';
    if (classSize) snapshots.appendChild(makeSnapshot(String(classSize), 'students in the class', 'blue'));
    snapshots.appendChild(makeSnapshot(pathwayFromTitle(title), 'programme / pathway', 'red'));
    if (accessItems.length || accessChips.length) {
      const count = Math.max(accessItems.length, accessChips.length);
      snapshots.appendChild(makeSnapshot(String(count), 'AEN / access strands', 'green'));
    }
    if (mapCount) {
      snapshots.appendChild(makeSnapshot(String(mapCount), 'interactive learner cards', 'black'));
    } else {
      snapshots.appendChild(makeSnapshot('↻', 'assess → adapt loop', 'black'));
    }
    glance.append(glanceTitle, snapshots);
    dashboard.appendChild(glance);

    if (context || strengths || profile) {
      const overviewRow = document.createElement('div');
      overviewRow.className = 'profile-dashboard-row';

      const left = makePanel(strengths ? 'What I can build on' : 'Class context', 'profile-strength-panel');
      if (strengths) {
        left.appendChild(buildStrengthList(textOf(strengths)));
        if (context) {
          const contextCopy = document.createElement('p');
          contextCopy.className = 'profile-context-line';
          contextCopy.textContent = contextText;
          left.appendChild(contextCopy);
        }
      } else {
        appendNodes(left, context);
      }
      overviewRow.appendChild(left);

      if (profile) {
        overviewRow.appendChild(buildAccessPanel(profileText, accessItems, accessChips, classSize));
      } else if (context && strengths) {
        const contextPanel = makePanel('Class context', 'profile-context-panel');
        appendNodes(contextPanel, context);
        overviewRow.appendChild(contextPanel);
      }
      dashboard.appendChild(overviewRow);
    }

    if (evidence) {
      const evidencePanel = makePanel('Starting evidence', 'profile-evidence-panel');
      appendNodes(evidencePanel, evidence);
      dashboard.appendChild(evidencePanel);
    }

    if (response || review) {
      const actionRow = document.createElement('div');
      actionRow.className = 'profile-action-grid';
      if (response) {
        const responsePanel = makePanel('Planned teaching response', 'profile-action-card profile-action-teach');
        appendNodes(responsePanel, response);
        actionRow.appendChild(responsePanel);
      }
      if (review) {
        const reviewPanel = makePanel('Assessment & review loop', 'profile-action-card profile-action-review');
        appendNodes(reviewPanel, review);
        actionRow.appendChild(reviewPanel);
      }
      dashboard.appendChild(actionRow);
    }

    if (interview) {
      const interviewPanel = makePanel('Interview language', 'profile-interview-card');
      appendNodes(interviewPanel, interview);
      dashboard.appendChild(interviewPanel);
    }

    if (mapRoot) {
      const mapPanel = makePanel('Interactive learner map', 'profile-map-panel');
      if (mapNote) mapPanel.appendChild(mapNote);
      mapPanel.appendChild(mapRoot);
      dashboard.appendChild(mapPanel);
    }

    if (connected) {
      const connectPanel = document.createElement('nav');
      connectPanel.className = 'profile-connected-strip';
      connectPanel.setAttribute('aria-label', 'Connected pages');
      const label = document.createElement('span');
      label.textContent = 'Connect';
      connectPanel.appendChild(label);
      connected.nodes.forEach(node => {
        node.querySelectorAll?.('a').forEach(link => connectPanel.appendChild(link));
      });
      dashboard.appendChild(connectPanel);
    }

    body.replaceChildren(dashboard);
  }

  const scriptUrl = document.currentScript?.src;
  if (scriptUrl && !document.querySelector('link[data-profile-dashboard-style]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('profile-dashboard.css', scriptUrl).href;
    link.dataset.profileDashboardStyle = '';
    document.head.appendChild(link);
  }

  enhanceProfilePage();
})();
