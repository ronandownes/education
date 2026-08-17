(() => {
  const domains = {
    'Teaching & Learning': ['Know the students','Learning intention','Activate prior knowledge','Success criteria','Coherent sequence','Prerequisites','Misconceptions','Small steps','High expectations','Learner need','Scaffold','Explanation','Model','Multiple representations','Worked examples','Explicit instruction','Think aloud','Examples and non-examples','Remove redundancy','Subject vocabulary','Make thinking visible','Sentence stems','Cognitive load','Limit new information','Integrate words and visuals','Retrieval','Fade support','Independent practice','Consolidation','Closure','Guided practice','Gradual release','Rehearsal','Spacing','Cumulative review','Interleaving','Deliberate practice','Transfer','Student thinking','Questioning','Reasoning','Mini-whiteboards','Think-pair-share','Guided discovery','Collaborative learning','Inclusive participation','Justification','Wait time','Hinge questions','Student explanations','Student voice','Evidence of learning','Formative assessment','Check understanding','Change representation','Increase challenge','Re-teach','Pause and diagnose','Feedback loop','Adapt teaching','Adjust pace','Remove barriers','Evaluate impact','Reflect and refine','Remove distractions'],
    'Classroom Management': ['Clear routines','High expectations','Positive relationships','Task clarity','Active supervision','Belonging','Predictability','Trust','Seating plan','Smooth transitions','Teacher presence','Proximity','Non-verbal cue','Reminder','Redirection','Choice','Take-up time','Follow-through','Private correction','Appropriate boundary','Seating change','Proportionate consequence','De-escalation','Emotional regulation','Dignity','Calm tone','Pause','Reduced language','Processing time','Safety','Co-regulation','Sensory awareness','Movement break','Reset','School procedures','Factual record','Monitor','Year head','Accountability','AEN support','Safeguarding','Parent / guardian','Tutor system','Pastoral team','Refer','Collaboration','Fresh start','Listen','Reintegration','Restorative conversation','Acknowledge harm','Behaviour not person','Problem-solving','Repair relationship','Re-engagement','Trust rebuilt','Review'],
    'AEN & Inclusion': ['Learner profile','Strengths','Needs','Student Support File','Prior attainment','Attendance','Student voice','Aspirations','Interests','Communication profile','Sensory profile','Individual progress','Access barriers','Processing time','Communication needs','Autism','Executive function','ADHD','Literacy','Language access','Dyslexia','Numeracy','Sensory needs','General learning needs','Checking understanding','Clear routines','Predictability','Explicit language','Visual supports','Chunking','Choice','Accessible layout','Worked example','Assistive technology','Multiple representations','Retrieval','Short-term target','Reasonable accommodation','Scaffold','Guided prompt','Reduced first step','Faded support','Movement break','Alternative response','Part-completed example','Team-teaching','SNA support','L1LP / L2LP','Participation','Learner independence','High expectations','Ambition','Monitor progress','Evaluate impact','Record and review','AEN coordinator','Challenge','Coordinated support','Shared planning','Parents / guardians'],
    'Differentiation & Accessibility': ['Entry point','Access barrier','Common learning goal','Starting point','Prior knowledge','Diagnostic task','Low-floor task','Prerequisite skill','Early success','Familiar context','Concrete example','Success criteria','Scaffolding','Modelling','Worked example','Guided prompt','Sentence stem','Checklist','Part-completed example','Guided practice','Prompt hierarchy','Gradual release','Independent practice','Faded support','Multiple representations','Concrete model','Visual model','Symbolic form','Accessible layout','Explicit language','Visual cue','Universal design','Multiple means','Word bank','Vocabulary pre-teach','Assistive technology','Formative assessment','Responsive adjustment','Check-in points','Flexible grouping','Choice of format','Processing time','Alternative response','Oral response','Written response','Digital response','Flexible pacing','Wait time','Challenge','Productive struggle','Learner independence','Complexity','Extension','Reasoning','Rich questioning','Generalisation','Open-ended task','High-attaining learner','High potential','Transfer'],
    'Assessment, Feedback & Reporting': ['Elicit evidence','Questioning','Observation','Mini-whiteboards','Discussion','Student work','Retrieval','Quiz','Performance task','Diagnostic task','Hinge question','Exit ticket','Understanding','Misconceptions','Attainment','Progress','Professional judgement','Interpret evidence','Fluency','Reasoning','Strengths','Starting point','Error analysis','Retention','Timely','Focused','Actionable','Next step','Closing the loop','Feedback loop','Specific','Improvement prompt','Redrafting','Live feedback','Written feedback','Whole-class feedback','Self-assessment','Reflection','Check again','Learning intentions','Success criteria','Exemplars','Peer assessment','Metacognition','Ownership','Self-regulation','Learner independence','Assessment conversation','Record keeping','Responsive teaching','Adjust pace','Re-teach','Area for development','Assessment of learning','Common assessment','Validity','Reliability','Clear language','Parent communication','Evidence-informed report'],
    'Planning & Curriculum': ['Handover','Learner profile','Low-stakes diagnostic','Starting point','Assessment evidence','Previous work','Misconceptions','Access barriers','Strengths & gaps','Support needs','Observation','Student Support Files','Curriculum','Learning outcomes','Scheme of work','Unpack outcomes','Action verbs','Success criteria','Common expectations','Department plan','Professional judgement','Programme outcomes','Assessment requirements','Map across the year','Retrieval','Retrieval points','Consolidation','Natural next step','Coherent sequence','Prerequisite knowledge','Consolidation points','Time allocation','Progression','Cumulative review','Interleaving','Achievable learning goal','Key vocabulary','Support & challenge','Guided practice','Multiple representations','Worked examples','Scaffold','Independent practice','Reasoning','Justification','Generalisation','Processing time','Assistive technology','Learner independence','Practical contexts','Formative assessment','Effective questioning','Assessment points','Common assessments','Retrieval evidence','Hinge questions','Mini-whiteboards','Exit tasks','Record progress','Adjust pace','Responsive','Record decisions','Revisit learning','Re-teach','Change representation','Additional support','Increase challenge','Flexible grouping','Reflect'],
    'Relationships & Wellbeing': ['Trust','Consistency','Respect','Belonging','Relational safety','Psychological safety','Positive regard','High expectations','Dignity','Fairness','Connection','Attendance','Engagement','Peer dynamics','Change in presentation','Student voice','Help-seeking','Readiness to learn','School connectedness','Anxiety / distress','Emotional literacy','Peer relationships','Calm','Predictability','Emotional regulation','Co-regulation','Processing time','Movement break','Reset','Re-engagement','Self-regulation','Resilience','Recovery','Check in','Listen','Record','Communicate','Coordinated support','Year head','Pastoral team','Professional referral','Parents / guardians','Trusted adult','Pastoral support','Safeguarding','Child protection','DLP / DDLP','Confidentiality limits','Duty of care','Immediate safety','Refer','Appropriate boundary','Restorative conversation','Repair','Fresh start'],
    'Professional Responsibility': ['Integrity','Fairness','Respect','Accountability','Professional boundaries','Confidentiality','Duty of care','School policy','Professional judgement','Record keeping','Reliability','Ethical practice','Collegiality','Clear communication','Shared planning','Department planning','Co-teaching','AEN colleagues','Shared resources','Assessment evidence','Professional disagreement','Listen','Line management','Collective goals','School need','Beyond timetable','Initiative','Follow-through','Committee work','Extracurricular','STEM','Coding','Digital resources','Examination work','Resource development','Sustainable contribution','CPD','Reflective practice','Professional learning','Evidence-informed practice','Professional feedback','Peer observation','Goal setting','Professional reading','Evaluate impact','SSE','Review','Adapt','Ethos','Mission','School context','Parents / guardians','Community links','Student profile','Inclusion','Equality','Student wellbeing','Current priorities','School community','Professional growth']
  };

  const deep = {
    'Remove distractions': {
      why: 'Reduce irrelevant cognitive, sensory and procedural load so attention is available for the learning itself.',
      who: 'Everyone benefits. It is especially important where attention, sensory processing, anxiety, literacy, working memory or processing speed create additional load.',
      how: 'Use a clean layout; one clear task at a time; concise instructions; predictable routines; remove decorative clutter; place words beside the relevant visual; reduce competing talk, notifications and unnecessary materials; offer a quieter position or environment where needed.',
      watch: 'Do not reduce the mathematical or scientific demand. Remove irrelevant load, not productive struggle or appropriate challenge.',
      line: 'I remove unnecessary distraction for everyone first, then individualise further where learner evidence shows a need. The aim is to reduce irrelevant load, not reduce challenge.'
    },
    'Scaffold': {
      why: 'Give temporary support that enables successful participation in a task the learner could not yet complete independently.',
      who: 'Any learner who needs an access route, not a permanent lower-level task.',
      how: 'Model, use a worked example, sentence stem, visual cue, checklist, guided prompt or part-completed example; then deliberately fade the support.',
      watch: 'A scaffold should move. If it never fades, it can create dependence.',
      line: 'I scaffold towards independence: enough support to access the learning, then I fade it as competence grows.'
    },
    'Multiple representations': {
      why: 'Different representations expose different features of the same concept and help learners connect meaning with symbols.',
      who: 'Useful for all learners and particularly valuable when language, abstraction or prior knowledge is a barrier.',
      how: 'Move deliberately between concrete, visual, verbal, graphical, numerical and symbolic forms and ask students to explain the links.',
      watch: 'Do not show many representations at once without making the connection explicit.',
      line: 'I change representation before I lower the demand.'
    },
    'Retrieval': {
      why: 'Strengthen access to prior learning and reveal what is actually available in memory before new learning begins.',
      who: 'All learners; especially useful where prerequisite knowledge is fragile.',
      how: 'Use short low-stakes questions, cumulative review, mini-whiteboards, flash recall or a brief starter tied to the next learning step.',
      watch: 'Retrieval is not just testing. The evidence should inform what happens next.',
      line: 'I use retrieval both to strengthen memory and to diagnose the starting point for the next piece of learning.'
    },
    'Worked example': {
      why: 'Reduce unnecessary search while a learner is acquiring a new procedure or problem structure.',
      who: 'Particularly useful early in learning and where cognitive load is high.',
      how: 'Model a complete example, narrate the thinking, compare with a non-example, then move to completion problems and independent practice.',
      watch: 'Avoid endless copying. The example must transition into active thinking and practice.',
      line: 'I use worked examples early, then fade the support so the student carries more of the thinking.'
    },
    'Check understanding': {
      why: 'Find out what students have understood before deciding to continue, re-teach, change representation or increase challenge.',
      who: 'Everyone in the room, not only volunteers or students who appear unsure.',
      how: 'Use mini-whiteboards, hinge questions, targeted questioning, observation, student explanation or a brief task that exposes the concept.',
      watch: '“Any questions?” is not a reliable check for understanding.',
      line: 'I check the whole class, interpret the evidence, and act on it.'
    },
    'Processing time': {
      why: 'Allow the learner enough time to interpret language, organise a response and begin the task.',
      who: 'Useful for all learners and especially where language processing, autism, ADHD, anxiety or additional learning needs affect response speed.',
      how: 'Pause after questions, preview instructions, chunk information, allow brief note-making and avoid filling every silence.',
      watch: 'Processing time is not lowered expectation; it is access to the same expectation.',
      line: 'I give take-up and processing time without lowering the cognitive demand.'
    },
    'Productive struggle': {
      why: 'Keep enough intellectual challenge for learners to reason, persist and make connections.',
      who: 'All learners, including those receiving support and high-attaining learners.',
      how: 'Use prompts rather than answers, increase complexity, ask for justification, provide open-ended tasks and remove scaffolds when they are no longer needed.',
      watch: 'Struggle stops being productive when the learner lacks the prerequisite knowledge or an access route.',
      line: 'I remove barriers, not the thinking.'
    },
    'Clear routines': {
      why: 'Reduce uncertainty and executive-function demands while protecting learning time.',
      who: 'Everyone benefits; predictability is particularly supportive for many learners with AEN.',
      how: 'Keep entry, equipment, transitions, questioning, help-seeking and closure routines explicit and consistent.',
      watch: 'Consistency should not become rigidity; adapt when learner evidence requires it.',
      line: 'Predictability frees attention for learning.'
    },
    'Student voice': {
      why: 'Improve the accuracy of the learner profile and increase agency, belonging and ownership.',
      who: 'Every learner, including students receiving additional support.',
      how: 'Ask what helps, what creates difficulty, how support feels, what the learner wants to achieve and what should change next.',
      watch: 'Student voice informs professional judgement; it does not replace it.',
      line: 'I plan with the student, not only for the student.'
    },
    'Responsive teaching': {
      why: 'Use evidence during learning to alter teaching rather than waiting until the end of a unit.',
      who: 'The whole class and targeted learners as evidence requires.',
      how: 'Adjust pace, re-teach, change representation, regroup, add a scaffold, remove a scaffold or increase challenge.',
      watch: 'Adaptation should be tied to evidence, not guesswork.',
      line: 'The assessment matters because of the action that follows it.'
    },
    'Learning intention': {
      why: 'Make the purpose of the learning explicit so teacher and students are working towards the same outcome.',
      who: 'All learners.',
      how: 'State the learning clearly, link it to prior learning and align task, questioning and assessment with it.',
      watch: 'A learning intention is not simply a task instruction.',
      line: 'I want students to know what they are learning, not merely what they are doing.'
    },
    'Success criteria': {
      why: 'Make quality visible and give students a basis for self-assessment, feedback and improvement.',
      who: 'All learners, with accessible wording or exemplars where needed.',
      how: 'Co-construct or explain concise criteria, use examples, refer back during the task and close the feedback loop against them.',
      watch: 'Avoid turning criteria into a mechanical checklist that limits rich responses.',
      line: 'Success criteria make the next step visible.'
    }
  };

  function detailFor(term, domain, group) {
    if (deep[term]) return deep[term];
    return {
      why: `A high-value ${domain.toLowerCase()} concept that helps organise a clear professional response.`,
      who: 'Apply universally where appropriate, then individualise according to the learner profile and evidence.',
      how: `Connect ${term.toLowerCase()} to a concrete classroom action, the evidence you would look for, and the adjustment you would make next.`,
      watch: 'Avoid using the term as jargon on its own. Explain what you actually do and why.',
      line: `${term}: what I do, why I do it, who it helps, and how I know it worked.`
    };
  }

  function init(root) {
    const grid = root.querySelector('[data-word-wall-grid]');
    const tabs = root.querySelector('[data-word-wall-domains]');
    const search = root.querySelector('[data-word-wall-search]');
    const empty = root.querySelector('[data-word-wall-empty]');
    if (!grid || !tabs || !search) return;

    let active = root.dataset.defaultDomain || 'All';
    const allDomains = ['All', ...Object.keys(domains)];
    tabs.innerHTML = allDomains.map(name => `<button class="word-wall-domain" type="button" data-domain="${name}" aria-pressed="${name === active}">${name}</button>`).join('');

    function rows() {
      const seen = new Set();
      const items = [];
      Object.entries(domains).forEach(([domain, terms]) => terms.forEach(term => {
        if (active !== 'All' && domain !== active) return;
        const key = `${domain}|${term}`;
        if (!seen.has(key)) { seen.add(key); items.push({domain, term}); }
      }));
      return items;
    }

    function render() {
      const q = search.value.trim().toLowerCase();
      const items = rows().filter(x => !q || x.term.toLowerCase().includes(q) || x.domain.toLowerCase().includes(q));
      grid.innerHTML = items.map(x => `<button type="button" class="word-wall-term" data-term="${x.term.replace(/"/g,'&quot;')}" data-domain-name="${x.domain.replace(/"/g,'&quot;')}"><strong>${x.term}</strong><span>${x.domain}</span></button>`).join('');
      if (empty) empty.style.display = items.length ? 'none' : 'block';
    }

    tabs.addEventListener('click', e => {
      const b = e.target.closest('[data-domain]');
      if (!b) return;
      active = b.dataset.domain;
      tabs.querySelectorAll('[data-domain]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      render();
    });
    search.addEventListener('input', render);
    render();

    grid.addEventListener('click', e => {
      const b = e.target.closest('[data-term]');
      if (!b) return;
      openCard(b.dataset.term, b.dataset.domainName);
    });
  }

  let backdrop;
  function ensureCard() {
    if (backdrop) return backdrop;
    backdrop = document.createElement('div');
    backdrop.className = 'word-wall-card-backdrop';
    backdrop.innerHTML = `<section class="word-wall-card" role="dialog" aria-modal="true" aria-labelledby="ww-title"><div class="word-wall-card-top"><div><h3 id="ww-title"></h3><p class="word-wall-card-meta"></p></div><button class="word-wall-close" type="button" aria-label="Close">×</button></div><div class="word-wall-card-grid"><div class="word-wall-card-section"><h4>Why</h4><p data-field="why"></p></div><div class="word-wall-card-section"><h4>Who</h4><p data-field="who"></p></div><div class="word-wall-card-section"><h4>How</h4><p data-field="how"></p></div><div class="word-wall-card-section"><h4>Watch out</h4><p data-field="watch"></p></div><div class="word-wall-card-section keyline"><h4>Interview line</h4><p data-field="line"></p></div></div><div class="word-wall-card-actions"><button type="button" data-copy-line>Copy interview line</button></div></section>`;
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', e => { if (e.target === backdrop || e.target.closest('.word-wall-close')) closeCard(); });
    backdrop.querySelector('[data-copy-line]').addEventListener('click', async () => {
      const text = backdrop.querySelector('[data-field="line"]').textContent;
      try { await navigator.clipboard.writeText(text); backdrop.querySelector('[data-copy-line]').textContent = 'Copied'; setTimeout(() => backdrop.querySelector('[data-copy-line]').textContent = 'Copy interview line', 1200); } catch (_) {}
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCard(); });
    return backdrop;
  }

  function openCard(term, domain) {
    const card = ensureCard();
    const d = detailFor(term, domain, '');
    card.querySelector('#ww-title').textContent = term;
    card.querySelector('.word-wall-card-meta').textContent = domain;
    Object.entries(d).forEach(([k,v]) => { const el = card.querySelector(`[data-field="${k}"]`); if (el) el.textContent = v; });
    card.classList.add('is-open');
    card.querySelector('.word-wall-close').focus();
  }
  function closeCard() { if (backdrop) backdrop.classList.remove('is-open'); }

  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('[data-word-wall]').forEach(init));
})();