# Education Site — Working Instructions

## Purpose

This repository is Ronan Downes's working education and interview-preparation site. It is a professional notebook, not a public marketing site. Keep it fast to scan, easy to edit, and useful immediately before or during interview preparation.

## Information Architecture

The main navigation is built around **eight interview areas**, followed by **Snips**, **Policies** and **Timeline**:

1. Teaching & Learning
2. Classroom Management
3. SEN / AEN & Inclusion
4. Differentiation & Accessibility
5. Assessment, Feedback & Reporting
6. Planning & Curriculum
7. Relationships & Wellbeing
8. Professional Responsibility & School Community
9. Snips
10. Policies
11. Timeline

Do not restore **Subjects** as permanent top-level navigation unless Ronan explicitly asks for it. Subject pages can remain in the repository and may be reached from homepage launchpads or contextual links.

Do not add separate top-level **Home**, **Practice**, **Schools**, or **Interview** tabs unless Ronan explicitly asks for them. The Ronan Downes Education logo is the Home link.

## Navigation Rules

- Each of the eight interview-area titles is a direct link to the full notes page for that area.
- The small dropdown control beside each title opens its typical interview questions or subtopics. Do not make users click an extra "All Notes" item.
- Keep the desktop headings compact and deliberately wrapped where appropriate rather than stretching them across the full width.
- Snips is a direct top-level link for short follow-up answers, phrases and recall fragments.
- Policies is a top-level reference area for curated key documents and should use its actual shelf structure rather than an obsolete subject-based menu.
- Timeline remains top-level for teaching experience and school context.
- On smaller screens, collapse the full navigation behind a standard hamburger button.

## Where Content Belongs

Use the eight areas as the default filing system.

**Professional Responsibility & School Community** is the home for:
- school ethos and mission
- school types / sectors / patronage context
- collaboration with colleagues and management
- professional conduct and contribution
- extracurricular contribution
- school-specific fit
- interview opener and closer
- questions to ask the school
- links to school-specific research

Keep **school sector/governance** separate from **ethos/patronage**. Voluntary secondary and denominational are related concepts but are not synonyms.

School-specific research can remain in separate files, but it should be reached from the relevant professional-responsibility context rather than needing its own permanent top-level navigation tab.

**Snips** is for compact material that is useful under interview pressure but does not justify a full answer page: follow-up lines, distinctions, definitions, challenge questions and short retrieval chains.

**Policies** is for authoritative or frequently used documents and links. Keep it curated around practical shelves such as school-specific reports, inspection/SSE, curriculum/reform, assessment/feedback and AEN/inclusion.

## Content Style

- Write for oral recall, not essay reading.
- Prefer a strong interview question as an H2 heading.
- Put a concise H3 key line immediately below important question headings where useful.
- Keep answers concise, concrete and reconstructable from headings.
- Preserve Ronan's own teaching language and examples where possible.
- Avoid generic educational jargon unless it adds precision.
- Distinguish clearly between low-level classroom practice, policy/procedure questions, safeguarding, SEN/AEN, and whole-school responsibilities.

## Editing and Publishing

- Core content lives in Markdown under `content/`.
- `_layouts/doc.html` controls the main site navigation and document shell.
- `assets/doc-page.js` may apply small live navigation corrections and page-specific enhancements.
- `assets/styles.css` controls the desktop/mobile navigation and document appearance.
- `.pages.yml` supports browser-based editing through Pages CMS and should mirror the current content architecture.
- GitHub Pages publishes from `main` at the repository root.
- Preserve the `noindex,nofollow` setting while this remains a working preparation site.
- Do not add student names, confidential student information, or sensitive school records to the public repository.

## Change Discipline

When reorganising navigation, do not delete useful content merely because a top-level tab disappears. Re-link it from the appropriate interview area or homepage launchpad. Prefer a small number of durable categories over creating new categories for individual interview questions or schools.
