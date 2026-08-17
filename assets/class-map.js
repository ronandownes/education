(() => {
  const scriptSource = document.currentScript?.src;
  if (scriptSource && /\/teaching\/class-profiles\//.test(location.pathname) && !document.querySelector('script[data-profile-dashboard]')) {
    const dashboardScript = document.createElement('script');
    dashboardScript.src = new URL('profile-dashboard.js', scriptSource).href;
    dashboardScript.dataset.profileDashboard = '';
    dashboardScript.async = false;
    document.head.appendChild(dashboardScript);
  }

  const roots = [...document.querySelectorAll('.class-map')];
  if (!roots.length) return;

  const DESKTOP_COLUMNS = 6;
  const mixed = ['Aidan','Maya','Luca','Niamh','Eoin','Zara','Tomasz','Aoife','Noah','Sofia','Cian','Amara','Ben','Leila','Oisín','Elena','Rory','Grace','Dylan','Katie','Patrick','John','Darren','Samir','Millie','Maeve','Jack','Hannah','Adam','Sarah','Daniel','Chloe','Conor','Layla','Finn','Eva','Alex','Lucy','Jamie','Erin','Seán','Ruth','Liam','Aisha'];
  const girls = ['Aoife','Niamh','Katie','Maeve','Grace','Millie','Sarah','Hannah','Chloe','Eva','Ruth','Aisha','Leila','Zara','Lucy','Erin','Sofia','Amara','Maya','Elena'];
  const surnames = ['Byrne','Murphy','O’Sullivan','Doyle','Flynn','Nolan','Kavanagh','Ryan','Walsh','Kelly','O’Donnell','Brennan','Fitzgerald','McCarthy','Keane','Moran','Quinn','Roche','Power','Gallagher','Casey','Connolly','Dunne'];
  const supports = ['Processing time','Reduced cognitive load','Worked examples','Visual vocabulary','Movement break','Private check-in','Extension'];
  const strengths = [
    'Explains mathematical thinking clearly when given preparation time.',
    'Responds strongly to visual patterns, diagrams and practical problems.',
    'Persists with unfamiliar tasks when the first step is made clear.',
    'Contributes useful ideas in paired discussion and collaborative problem-solving.',
    'Makes strong links between mathematics and real-life contexts.',
    'Shows good recall when learning is revisited little and often.'
  ];
  const priorities = [
    'Reduce working-memory load when instructions contain several steps.',
    'Strengthen confidence in reading and using mathematical vocabulary.',
    'Support task initiation and sustained attention during independent work.',
    'Build fluency without allowing speed to become the measure of success.',
    'Check understanding privately before expecting a public response.',
    'Increase independence by fading prompts once the method is secure.'
  ];
  const voices = [
    '“I do better when I can see one example before I start.”',
    '“Give me a moment to think before asking me to answer.”',
    '“I like knowing exactly what I have to finish first.”',
    '“Pictures and worked steps help me understand the words.”',
    '“I want harder questions, but not just more of the same.”',
    '“Checking the first question with me helps me get going.”'
  ];
  const targets = [
    'Complete a three-step task using a visual checklist with no more than one adult prompt.',
    'Use three key mathematical terms accurately when explaining a solution.',
    'Begin independent work within two minutes using the agreed first-step routine.',
    'Transfer a modelled strategy to a new problem without a worked example beside it.',
    'Check and correct one error independently before seeking help.',
    'Explain the reasoning behind an answer using a diagram, sentence or example.'
  ];
  const strategies = [
    'Chunk instructions; display the sequence; model the first example; allow processing time; check understanding privately.',
    'Pre-teach essential vocabulary; pair words with visuals; use sentence stems initially; fade the prompt as confidence grows.',
    'Use a clear entry task, short success cycles, a planned movement break where appropriate and a visible finish point.',
    'Use concrete or visual representation before symbols, then guided-to-independent practice with reduced copying.',
    'Offer a common learning intention with variable challenge and extension through explanation, proof or generalisation.',
    'Use retrieval of secure prior knowledge, immediate feedback and a deliberate transfer task before the end of the lesson.'
  ];
  const evidence = [
    'Student work, level of prompting required, short retrieval checks and student reflection.',
    'Accuracy of mathematical language in discussion and written explanations.',
    'Task-start time, completion of agreed chunks and independence during practice.',
    'Transfer to an unfamiliar example and ability to explain the chosen strategy.',
    'Participation, checking-understanding evidence and quality of corrections.',
    'Work samples across two lessons plus a brief student conference.'
  ];
  const nextSteps = [
    'Continue the strategy if access improves, then reduce prompts gradually.',
    'Keep the target for the next review cycle and increase independence before adding a new target.',
    'If progress is secure, fade the scaffold and monitor transfer in mainstream tasks.',
    'If progress is limited, review the barrier with the AEN team and adapt the strategy rather than simply intensifying it.'
  ];
  const supportLevels = ['Classroom Support','School Support','School Support Plus'];

  const skinTones = ['#f4c7a1','#eab38a','#d99569','#bd7655','#955b43','#704434'];
  const hairTones = ['#2f211b','#4b3428','#6a4833','#8a5e3b','#b97a42','#d1a26b','#1f2937'];
  const topTones = ['#315f86','#3f6d5b','#765586','#9b5f56','#536b8f','#5f7350','#6b5d54'];
  const backdrops = ['#e8f0fe','#e6f4ea','#fce8e6','#f3e8fd','#fff3d6','#e6f4f1','#edf2f7'];

  function avatarSvg(seed, feminine = false) {
    const skin = skinTones[(seed * 5 + 1) % skinTones.length];
    const hair = hairTones[(seed * 3 + 2) % hairTones.length];
    const top = topTones[(seed * 7 + 3) % topTones.length];
    const bg = backdrops[(seed * 11 + 1) % backdrops.length];
    const style = seed % 5;
    const freckles = seed % 4 === 0
      ? '<circle cx="53" cy="43" r="1" fill="#9a684f"/><circle cx="57" cy="44" r=".9" fill="#9a684f"/><circle cx="67" cy="44" r=".9" fill="#9a684f"/><circle cx="71" cy="43" r="1" fill="#9a684f"/>'
      : '';
    const glasses = seed % 6 === 0
      ? '<g fill="none" stroke="#374151" stroke-width="1.6"><rect x="45" y="35" width="13" height="9" rx="4"/><rect x="62" y="35" width="13" height="9" rx="4"/><path d="M58 39h4"/></g>'
      : '';

    let hairShape = '';
    if (style === 0) {
      hairShape = '<path d="M38 35Q39 14 59 12Q80 12 83 35Q73 29 63 25Q54 31 38 35Z" fill="' + hair + '"/>';
    } else if (style === 1) {
      hairShape = '<path d="M39 39Q36 17 58 12Q80 11 84 35L82 59Q77 51 76 34Q65 27 55 29Q47 34 44 55Q39 49 39 39Z" fill="' + hair + '"/>';
    } else if (style === 2) {
      hairShape = '<g fill="' + hair + '"><circle cx="43" cy="27" r="9"/><circle cx="51" cy="20" r="9"/><circle cx="61" cy="19" r="10"/><circle cx="71" cy="21" r="9"/><circle cx="79" cy="29" r="9"/></g>';
    } else if (style === 3) {
      hairShape = '<path d="M38 34Q42 12 61 13Q80 14 83 35Q72 23 56 25Q48 28 38 34Z" fill="' + hair + '"/><circle cx="77" cy="14" r="8" fill="' + hair + '"/>';
    } else {
      hairShape = '<path d="M38 34Q41 14 59 13Q77 12 83 34Q73 31 68 23Q58 31 48 25Q43 31 38 34Z" fill="' + hair + '"/>';
    }

    const sideHair = feminine && style % 2 === 0
      ? '<path d="M39 31Q34 46 39 61" fill="none" stroke="' + hair + '" stroke-width="7" stroke-linecap="round"/><path d="M81 31Q86 46 81 61" fill="none" stroke="' + hair + '" stroke-width="7" stroke-linecap="round"/>'
      : '';

    return `<svg viewBox="0 0 120 90" role="img" aria-label="Synthetic illustrated student portrait" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="90" rx="10" fill="${bg}"/>
      <circle cx="60" cy="38" r="25" fill="${skin}"/>
      ${sideHair}
      ${hairShape}
      <path d="M30 90Q34 66 60 64Q86 66 90 90Z" fill="${top}"/>
      <path d="M54 62Q60 68 66 62V72Q60 76 54 72Z" fill="${skin}"/>
      <ellipse cx="51" cy="39" rx="2.2" ry="2.6" fill="#263238"/>
      <ellipse cx="69" cy="39" rx="2.2" ry="2.6" fill="#263238"/>
      <path d="M48 33Q52 31 56 33M64 33Q68 31 72 33" fill="none" stroke="#4a3429" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M55 51Q60 55 65 51" fill="none" stroke="#9a4f4f" stroke-width="1.8" stroke-linecap="round"/>
      ${freckles}
      ${glasses}
    </svg>`;
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'student-dialog';
  document.body.appendChild(dialog);

  let activeGrid = null;
  let activeCard = null;

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  function desiredSsfCount(root, count) {
    const explicit = Number(root.dataset.ssfCount);
    if (Number.isFinite(explicit) && explicit > 0) return Math.min(count, Math.round(explicit));
    const isSupportPage = /(?:^|[-/])support(?:[-/.]|$)/i.test(window.location.pathname);
    if (isSupportPage) return Math.min(count, 4);
    if (count <= 10) return Math.min(count, 2);
    if (count <= 14) return 3;
    if (count <= 20) return 3;
    return 4;
  }

  function spreadPositions(count, desired) {
    const chosen = new Set();
    if (desired >= count) return new Set(Array.from({ length: count }, (_, i) => i));
    for (let n = 0; n < desired; n++) {
      chosen.add(Math.min(count - 1, Math.floor(((n + 1) * count) / (desired + 1))));
    }
    for (let i = 0; chosen.size < desired && i < count; i++) chosen.add(i);
    return chosen;
  }

  function profileFor(name, i) {
    return {
      name,
      support: supports[i % supports.length],
      strength: strengths[i % strengths.length],
      priority: priorities[(i * 3 + 1) % priorities.length],
      voice: voices[(i * 5 + 2) % voices.length],
      target: targets[(i * 7 + 3) % targets.length],
      strategy: strategies[(i * 2 + 1) % strategies.length],
      evidence: evidence[(i * 3 + 2) % evidence.length],
      next: nextSteps[i % nextSteps.length],
      level: supportLevels[i % supportLevels.length],
      cycle: ['4-week review','6-week review','Half-term review'][i % 3]
    };
  }

  function field(label, value, wide = false) {
    return `<section class="profile-field${wide ? ' profile-field--wide' : ''}"><h3>${label}</h3><p>${value}</p></section>`;
  }

  function cardsInActiveGrid() {
    return activeGrid ? [...activeGrid.querySelectorAll('.class-map-card')] : [];
  }

  function moveStudent(step) {
    const cards = cardsInActiveGrid();
    if (!cards.length || !activeCard) return;
    const current = cards.indexOf(activeCard);
    const next = cards[(current + step + cards.length) % cards.length];
    if (next) openCard(next);
  }

  function show(profile, hasSsf) {
    const title = hasSsf ? 'Student Support File' : 'Learner profile';
    const cards = cardsInActiveGrid();
    const position = Math.max(0, cards.indexOf(activeCard));
    dialog.innerHTML = `
      <button class="dialog-close" type="button" aria-label="Close">×</button>
      <p class="profile-kicker">${hasSsf ? 'FICTIONAL STUDENT SUPPORT FILE' : 'FICTIONAL WORKING PROFILE'}</p>
      <div class="profile-title-row">
        <div>
          <h2>${profile.name}</h2>
          <p class="profile-subtitle">${title} · synthetic demonstration data</p>
        </div>
        ${hasSsf ? '<span class="profile-ssf-mark">SSF</span>' : ''}
      </div>
      <nav class="profile-student-nav" aria-label="Move between students">
        <button class="profile-nav-button profile-nav-prev" type="button" aria-label="Previous student">← <span>Previous student</span></button>
        <span class="profile-nav-position">${cards.length ? `${position + 1} of ${cards.length}` : ''}</span>
        <button class="profile-nav-button profile-nav-next" type="button" aria-label="Next student"><span>Next student</span> →</button>
      </nav>
      <div class="profile-chips">
        <span>${profile.support}</span>
        <span>${hasSsf ? profile.level : 'Classroom profile'}</span>
        ${hasSsf ? `<span>${profile.cycle}</span>` : ''}
      </div>
      <div class="profile-field-grid">
        ${field('Strengths & interests', profile.strength)}
        ${field('Priority need / access barrier', profile.priority)}
        ${field('Student voice', profile.voice)}
        ${field(hasSsf ? 'Agreed short-term target' : 'Next learning target', profile.target)}
        ${field('Teaching & support strategies', profile.strategy, true)}
        ${field('Evidence to monitor', profile.evidence)}
        ${field(hasSsf ? 'Review / next step' : 'Next teaching move', profile.next)}
        ${hasSsf ? field('Coordination', 'Student voice, subject teacher evidence and AEN-team review are brought together; parent / guardian input is included where appropriate.', true) : ''}
      </div>
      ${hasSsf ? '<p class="profile-file-note"><strong>Purpose:</strong> record the agreed support, monitor its impact and review what should continue, change or fade.</p>' : ''}
      <p class="profile-demo-note">Entirely invented demonstration data. No real pupil is represented.</p>`;
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.profile-nav-prev').addEventListener('click', () => moveStudent(-1));
    dialog.querySelector('.profile-nav-next').addEventListener('click', () => moveStudent(1));
    if (!dialog.open) dialog.showModal();
  }

  function openCard(card) {
    if (!card) return;
    activeCard = card;
    activeGrid = card.closest('.class-map-grid');
    show(card._profile, card._hasSsf);
  }

  document.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveStudent(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveStudent(1);
    }
  });

  roots.forEach((root) => {
    const count = Number(root.dataset.count || 12);
    const start = Number(root.dataset.start || 0);
    const ssfPositions = spreadPositions(count, desiredSsfCount(root, count));
    const grid = document.createElement('div');
    const allGirlGroup = root.dataset.group === 'girls' || /all[- ]girl/i.test(document.title);
    grid.className = 'class-map-grid';
    root.appendChild(grid);

    for (let n = 0; n < count; n++) {
      const i = (start + n) % 121;
      const first = allGirlGroup ? girls[i % girls.length] : mixed[i % mixed.length];
      const feminine = girls.includes(first);
      const last = surnames[(i * 7) % surnames.length];
      const name = `${first} ${last}`;
      const hasSsf = ssfPositions.has(n);
      const profile = profileFor(name, i);

      const card = document.createElement('button');
      card.type = 'button';
      card.className = `class-map-card${hasSsf ? ' has-ssf' : ''}`;
      card.draggable = true;
      card._profile = profile;
      card._hasSsf = hasSsf;
      card.setAttribute('aria-label', `${name}. ${hasSsf ? 'Open fictional Student Support File.' : 'Open fictional learner profile.'}`);
      card.innerHTML = `
        ${hasSsf ? '<span class="class-map-ssf-badge">SSF</span>' : ''}
        <span class="class-map-photo">${avatarSvg(i, feminine)}</span>
        <strong>${name}</strong>
        <small>${hasSsf ? 'Student Support File' : profile.support}</small>`;
      card.addEventListener('click', () => openCard(card));
      grid.appendChild(card);
    }

    const slotCount = Math.max(DESKTOP_COLUMNS, Math.ceil(count / DESKTOP_COLUMNS) * DESKTOP_COLUMNS);
    for (let n = count; n < slotCount; n++) {
      const empty = document.createElement('div');
      empty.className = 'class-map-empty';
      empty.setAttribute('role', 'img');
      empty.setAttribute('aria-label', 'Empty seat');
      empty.innerHTML = '<span>Empty seat</span>';
      grid.appendChild(empty);
    }

    let drag = null;
    let over = null;
    const clearOver = () => {
      if (over) over.classList.remove('is-drop-target');
      over = null;
    };

    grid.addEventListener('dragstart', (event) => {
      drag = event.target.closest('.class-map-card');
      if (drag) drag.classList.add('is-dragging');
    });

    grid.addEventListener('dragover', (event) => {
      if (!drag) return;
      event.preventDefault();
      const target = event.target.closest('.class-map-card, .class-map-empty');
      if (target === drag) return;
      if (target !== over) {
        clearOver();
        over = target;
        if (over) over.classList.add('is-drop-target');
      }
    });

    grid.addEventListener('dragleave', (event) => {
      if (!grid.contains(event.relatedTarget)) clearOver();
    });

    grid.addEventListener('drop', (event) => {
      event.preventDefault();
      const target = event.target.closest('.class-map-card, .class-map-empty');
      if (target && drag && target !== drag) {
        const placeholder = document.createElement('i');
        drag.before(placeholder);
        target.before(drag);
        placeholder.before(target);
        placeholder.remove();
      }
      clearOver();
      if (drag) drag.classList.remove('is-dragging');
      drag = null;
    });

    grid.addEventListener('dragend', () => {
      clearOver();
      if (drag) drag.classList.remove('is-dragging');
      drag = null;
    });
  });
})();