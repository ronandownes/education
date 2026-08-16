---
layout: doc
title: Ronan Downes — Education
eyebrow: WORKING PROFESSIONAL NOTEBOOK
intro: A calm, editable answer bank for teaching, inclusion, assessment, planning, school research and interview preparation.
---

## Hope · Expectation · Trust

This is the organising idea behind the site. **Hope** that progress is possible; **expectation** that students engage, behave and move forward; **trust** that the classroom is fair, safe and purposeful.

## How this site is organised

The main navigation keeps the core interview domains visible and adds two practical shelves: **Classes** for class profiles and **Plans** for actual schemes of work and the curriculum specifications they use. **Glossary** holds recurring professional language and recall phrases. **Timeline** holds teaching experience and school context. **Policies** is available from the reference shelf below.

Use the top navigation as the first place to look: interview questions stay under their domains, while class records and working plans have their own obvious homes.

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

{% assign notebooks = site.pages | where: "notebook", true | sort: "notebook_order" %}

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-top:16px;">
{% for notebook in notebooks %}
<a href="{{ notebook.url | relative_url }}" style="display:block;padding:16px;border:1px solid #d7d7d7;border-radius:10px;text-decoration:none;color:inherit;background:#fff;">
<strong>Notebook {{ notebook.notebook_label }}</strong><br>
<span>{{ notebook.title }}</span><br>
<small>Open notebook →</small>
</a>
{% endfor %}
</div>
