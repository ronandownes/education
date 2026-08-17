# Education Site — Working Instructions

## Purpose

This repository is Ronan Downes's working education and interview-preparation site. It is a professional notebook, not a public marketing site. Keep it fast to scan, easy to edit, and useful immediately before or during interview preparation.

## Information Architecture

The main navigation is built around **eight interview areas**, followed by **Up Next**, **Resources**, and dedicated **Profiles** and **Plans** shelves:

1. Teaching & Learning
2. Classroom Management
3. SEN / AEN & Inclusion
4. Differentiation & Accessibility
5. Assessment, Feedback & Reporting
6. Planning & Curriculum
7. Relationships & Wellbeing
8. Professional Responsibility & School Community
9. Up Next
10. Resources
11. Profiles
12. Plans

Do not restore **Subjects** as permanent top-level navigation unless Ronan explicitly asks for it. Subject pages can remain in the repository and may be reached from homepage launchpads or contextual links.

Do not add separate top-level **Home**, **Practice**, **Schools**, **Timeline**, **Glossary** or **Interview** tabs unless Ronan explicitly asks for them. The Ronan Downes Education logo is the Home link.

## Navigation Rules

- Each of the eight interview-area titles is a direct link to the full notes page for that area.
- **Up Next** is the short working queue for the next things to build, read or prepare. Keep it brief.
- **Resources** is the document library for primary documents that Ronan wants close at hand. Prefer an in-page viewer and concise working summaries over sending the reader away from the site.
- Where a resource benefits from variable depth, use a fast pre-built summary scale rather than requiring live processing on each change.
- **Profiles** is a top-level shelf containing both **Class Profiles** and **School Profiles**.
- **Plans** is a top-level shelf containing actual plans, schemes of work and curriculum specifications—not Planning & Curriculum interview questions.
- Keep **Profiles** and then **Plans** as the final two top-level shelves.
- Keep class pages and school profiles out of the **Teaching & Learning** dropdown.
- Keep scheme-of-work pages out of the **Planning & Curriculum** dropdown.
- The small dropdown control beside each interview-area title opens the current interview questions or subtopics.
- Do not rely on stale hard-coded question anchors: navigation must be generated from or checked against the current rendered headings.
- Keep the desktop headings compact and deliberately wrapped where appropriate rather than stretching them across the full width.
- Policies is reached from the homepage reference shelf rather than occupying permanent top-level navigation.
- Teaching experience is retained as an evidence bank under **Professional Responsibility**, not as a permanent Timeline tab.
- Recurring professional language should live primarily in the relevant domain Word Walls. A legacy glossary file may remain in the repository but is not a permanent top-level navigation item.
- On smaller screens, collapse the full navigation behind a standard hamburger button.

## Profiles

**Class Profiles** are practical planning documents. They should capture the learner picture that changes teaching: starting point, strengths, needs, barriers, misconceptions, support, challenge and evidence of progress. Use synthetic data only; do not publish identifiable student information.

**School Profiles** are interview-preparation documents. They should capture ethos, mission, school type, curriculum, inclusion, priorities, policies, community links and—most importantly—the connections between the school and Ronan's own experience.

A school profile is not merely a history of the school. Keep asking: **what does this tell me about the school, and what evidence from my own experience connects to it?**

## Where Content Belongs

Use the eight areas as the default filing system.

**Professional Responsibility & School Community** is the home for:
- collaboration with colleagues and management
- professional conduct and contribution
- teaching experience evidence
- extracurricular contribution
- school-specific fit
- interview opener and closer
- questions to ask the school
- links to school profiles where relevant

**Up Next** is for:
- the current build/read/preparation priority
- a very short queue of what comes immediately after it
- links into the relevant working page or resource

**Resources** is for:
- authoritative or high-value source documents
- embedded document viewing where practical
- adjustable summaries for rapid recall and deeper study
- source links and brief metadata

**Profiles** is the home for:
- class profiles
- school profiles
- learner-context summaries
- school-context summaries used for interview preparation

Keep **school sector/governance** separate from **ethos/patronage**. Voluntary secondary and denominational are related concepts but are not synonyms.

**Policies** is for authoritative or frequently used documents and links. Keep it curated around practical shelves such as school-specific reports, inspection/SSE, curriculum/reform, assessment/feedback and AEN/inclusion.

## Word Walls

Each of the eight interview domains has a compact Word Wall near the top of its notes page. The wall should use the user's settled interview language and display useful occurrence counts where those counts are being maintained.

Word Wall terms should reinforce the answers below them. Where a wall term occurs naturally in an answer, bolding may be used to strengthen visual retrieval. Do not force vocabulary into answers merely to increase counts.

Keep Word Walls compact enough to print cleanly. Avoid wrapping a usage count onto a line by itself.

## Content Style

- Write for oral recall, not essay reading.
- Write key notes as complete, speakable sentences so sentence-by-sentence reveal supports genuine retrieval practice rather than exposing fragments.
- Prefer a strong interview question as an H2/H3 heading according to the current page pattern.
- Keep answers concise, concrete and reconstructable from headings.
- Preserve Ronan's own teaching language and examples where possible.
- Avoid generic educational jargon unless it adds precision.
- Distinguish clearly between low-level classroom practice, policy/procedure questions, safeguarding, SEN/AEN, and whole-school responsibilities.

## Editing and Publishing

- Core content lives in Markdown under `content/` and shared interview chunks may live in `_includes/`.
- `_layouts/doc.html` controls the main site navigation and document shell.
- `assets/navigation.js` controls mobile navigation and may apply compact information-architecture corrections before dynamic menus are rebuilt.
- `assets/doc-page.js` may apply small live navigation corrections and page-specific enhancements.
- `assets/styles.css` controls the desktop/mobile navigation and document appearance.
- `.pages.yml` supports browser-based editing through Pages CMS and should mirror the current content architecture when material editing collections change.
- GitHub Pages publishes from `main` at the repository root.
- Preserve the `noindex,nofollow` setting while this remains a working preparation site.
- Do not add student names, confidential student information, or sensitive school records to the public repository.

## Change Discipline

When reorganising navigation, do not delete useful content merely because a top-level tab disappears. Re-link it from the appropriate interview area, Up Next, Resources, Profiles shelf or homepage launchpad. Prefer a small number of durable categories over creating new categories for individual interview questions or schools.
