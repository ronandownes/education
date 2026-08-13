---
layout: doc
permalink: /planning-curriculum.html
title: Planning & Curriculum
eyebrow: PROFESSIONAL PRACTICE
intro: Learning intentions, sequencing, curriculum outcomes and appropriate pathways.
---
## If you were given a second-year Maths class in September, how would you plan the year?
**Key line: I would start with the students, the curriculum, and the evidence of where they are.**

First, I would check the existing scheme of work and compare what was planned in first year with where the class actually finished.

I would confirm that through teacher handover and prior assessment evidence, rather than assuming the scheme was completed exactly as written.

I would also review the learner profile of the class so I know about AEN, Level 2 Learning Programme needs where relevant, and any learning or access needs that should shape my planning.

Early in September, I would use a low-stakes diagnostic retrieval task to identify gaps and confirm the real starting point.

From there, I would map the Junior Cycle Mathematics learning outcomes across the year, sequence the topics logically, and build in realistic time for retrieval, assessment and consolidation.

The scheme would be structured but flexible: I would use ongoing formative assessment to adjust pacing, revisit misconceptions, and provide additional support or challenge.

So the plan gives me a clear direction for the year, but the evidence from the students determines the pace and the route.

## How do you plan?
**Key line: Every lesson belongs to a bigger journey.**

I start with curriculum outcomes and the class's current position, then identify the learning intention, prior knowledge, likely misconceptions, representations, questions and assessment evidence. I want individual lessons to connect into a coherent sequence rather than feel like isolated activities.

## How do you plan for different programmes and pathways?
The programme changes the route and context, not the expectation that learning should be purposeful. I adapt planning for Junior Cycle, Senior Cycle, LCA and learning-support contexts, including pacing, practical application and assessment requirements.

<script>
window.addEventListener('load', () => {
  document.querySelectorAll('.answer-section').forEach(section => {
    const controls = section.querySelector('.section-controls');
    const content = section.querySelector('.section-content');
    if (!controls || !content || controls.querySelector('.reveal-next')) return;

    const steps = Array.from(content.children).filter(el => el.tagName !== 'SCRIPT');
    if (!steps.length) return;

    section.dataset.revealIndex = String(steps.length - 1);

    const showThrough = index => {
      if (index < 0) {
        content.hidden = true;
        steps.forEach(step => step.hidden = false);
        section.dataset.revealIndex = '-1';
        return;
      }

      content.hidden = false;
      steps.forEach((step, i) => step.hidden = i > index);
      section.dataset.revealIndex = String(index);
    };

    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'reveal-prev';
    previous.textContent = '←';
    previous.title = 'Hide the last revealed line';
    previous.setAttribute('aria-label', 'Hide the last revealed line');

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'reveal-next';
    next.textContent = '→';
    next.title = 'Reveal the next line';
    next.setAttribute('aria-label', 'Reveal the next line');

    const toggle = controls.querySelector('button:last-child');
    controls.insertBefore(previous, toggle);
    controls.insertBefore(next, toggle);

    next.addEventListener('click', () => {
      let index = content.hidden ? -1 : Number(section.dataset.revealIndex || -1);
      index = Math.min(index + 1, steps.length - 1);
      showThrough(index);
    });

    previous.addEventListener('click', () => {
      if (content.hidden) return;
      const index = Number(section.dataset.revealIndex || 0) - 1;
      showThrough(index);
    });

    toggle?.addEventListener('click', () => {
      if (!content.hidden) {
        steps.forEach(step => step.hidden = false);
        section.dataset.revealIndex = String(steps.length - 1);
      } else {
        section.dataset.revealIndex = '-1';
      }
    });
  });

  document.querySelector('[data-action="show-all"]')?.addEventListener('click', () => {
    document.querySelectorAll('.answer-section').forEach(section => {
      const content = section.querySelector('.section-content');
      const steps = content ? Array.from(content.children).filter(el => el.tagName !== 'SCRIPT') : [];
      steps.forEach(step => step.hidden = false);
      section.dataset.revealIndex = String(steps.length - 1);
    });
  });

  document.querySelector('[data-action="hide-all"]')?.addEventListener('click', () => {
    document.querySelectorAll('.answer-section').forEach(section => {
      section.dataset.revealIndex = '-1';
    });
  });
});
</script>
