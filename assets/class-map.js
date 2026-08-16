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

  const dialog = document.createElement('dialog');
  dialog.className = 'student-dialog';
  document.body.appendChild(dialog);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  function desiredSsfCount(root, count) {
    const explicit = Number(root.dataset.ssfCount);
    if (Number.isFinite(explicit) && explicit > 0) return Math.min(count, Math.round(explicit));
    const isSupportPage = /(?:^|[-/])support(?:[-/.]|$)/i.test(window.location.pathname);
    if (isSupportPage) return Math.min(count, 4);
    if (count <= 10) return Math.min(count, 2);
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

  function show(profile, hasSsf) {
    const title = hasSsf ? 'Student Support File' : 'Learner profile';
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
    dialog.showModal();
  }

  roots.forEach((root) => {
    const count = Number(root.dataset.count || 12);
    const start = Number(root.dataset.start || 0);
    const ssfPositions = spreadPositions(count, desiredSsfCount(root, count));
    const grid = document.createElement('div');
    grid.className = 'class-map-grid';
    root.appendChild(grid);

    for (let n = 0; n < count; n++) {
      const i = (start + n) % 121;
      const row = Math.floor(i / 11);
      const col = i % 11;
      const female = i >= 88;
      const first = (female ? girls : mixed)[i % (female ? girls.length : mixed.length)];
      const last = surnames[(i * 7) % surnames.length];
      const name = `${first} ${last}`;
      const hasSsf = ssfPositions.has(n);
      const profile = profileFor(name, i);

      const card = document.createElement('button');
      card.type = 'button';
      card.className = `class-map-card${hasSsf ? ' has-ssf' : ''}`;
      card.draggable = true;
      card.setAttribute('aria-label', `${name}. ${hasSsf ? 'Open fictional Student Support File.' : 'Open fictional learner profile.'}`);
      card.innerHTML = `
        ${hasSsf ? '<span class="class-map-ssf-badge">SSF</span>' : ''}
        <span class="class-map-photo" style="background-position:${col * 10}% ${row * 10}%"></span>
        <strong>${name}</strong>
        <small>${hasSsf ? 'Student Support File' : profile.support}</small>`;
      card.addEventListener('click', () => show(profile, hasSsf));
      grid.appendChild(card);
    }

    let drag = null;
    grid.addEventListener('dragstart', (event) => {
      drag = event.target.closest('.class-map-card');
    });
    grid.addEventListener('dragover', (event) => event.preventDefault());
    grid.addEventListener('drop', (event) => {
      const target = event.target.closest('.class-map-card');
      if (target && drag && target !== drag) {
        const placeholder = document.createElement('i');
        drag.before(placeholder);
        target.before(drag);
        placeholder.before(target);
        placeholder.remove();
      }
      drag = null;
    });
  });
})();