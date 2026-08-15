---
layout: doc
title: Ronan Downes — Education
eyebrow: WORKING PROFESSIONAL NOTEBOOK
intro: A calm, editable answer bank for teaching, inclusion, assessment, planning, school research and interview preparation.
---

## Hope · Expectation · Trust

This is the organising idea behind the site. **Hope** that progress is possible; **expectation** that students engage, behave and move forward; **trust** that the classroom is fair, safe and purposeful.

## How this site is organised

The main navigation follows the core interview domains. **Glossary** holds recurring professional language, short definitions and recall phrases. **Timeline** holds teaching experience and school context. **Policies** is available from the reference shelf below.

Subject material is deliberately kept out of the permanent navigation for now so the interview structure stays clean.

## Subject Launchpad

- [Mathematics](subjects/mathematics.html)
- [Science](subjects/science.html)
- [Physics](subjects/physics.html)
- [Computer Science](subjects/computer-science.html)
- [Applied Mathematics](subjects/applied-mathematics.html)

## Reference Shelf

- [Glossary](glossary.html)
- [Policies](policies.html)
- [Timeline](timeline.html)

## Editing

Use **Edit this page** on the site to open the browser-based editor. Changes are saved back to GitHub and become part of the working site.

## Notebooks

A quiet holding shelf for useful material that does not yet have a permanent home. Open any notebook, use **Edit this page**, and change its **Title** when its purpose becomes clear.

<div class="notebook-grid">
{% assign notebooks = site.pages | where: "notebook", true | sort: "notebook_order" %}
{% for notebook in notebooks %}
  <a class="notebook-card" href="{{ notebook.url | relative_url }}">
    <span class="notebook-number">NOTEBOOK {{ notebook.notebook_label }}</span>
    <span class="notebook-title">{{ notebook.title }}</span>
    <span class="notebook-action">Open notebook</span>
  </a>
{% endfor %}
</div>
