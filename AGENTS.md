# Education Site — Working Instructions

## Purpose

This repository is Ronan Downes's working education and interview-preparation site. It is a professional notebook, not a public marketing site. Keep it fast to scan, easy to edit, and useful immediately before or during interview preparation.

## Information Architecture

The main navigation is built around **eight interview areas**, with **Subjects** as the ninth top-level item:

1. Teaching & Learning
2. Classroom Management
3. SEN / AEN & Inclusion
4. Differentiation & Accessibility
5. Assessment, Feedback & Reporting
6. Planning & Curriculum
7. Relationships & Wellbeing
8. Professional Responsibility & School Community
9. Subjects

Do not add separate top-level **Home**, **Practice**, **Schools**, or **Interview** tabs unless Ronan explicitly asks for them. The Ronan Downes Education logo is the Home link.

## Navigation Rules

- Each of the eight interview areas should be visible directly in the desktop navigation.
- Each interview area should open a dropdown containing its most typical interview questions or subtopics.
- The first dropdown item should open the full page for that area.
- Subjects remains a dropdown after the eight interview areas.
- On smaller screens, horizontal navigation is acceptable; do not hide the eight-area structure behind a generic Practice menu.

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

Keep **school sector/governance** separate from **ethos/patronage**. For example, voluntary secondary and denominational are related concepts but are not synonyms.

School-specific research can remain in separate files, but it should be reached from the relevant professional-responsibility context rather than needing its own permanent top-level navigation tab.

## Content Style

- Write for oral recall, not essay reading.
- Prefer a strong interview question as an H2 heading.
- Put a **Key line** immediately below important question headings where useful.
- Keep answers concise, concrete and reconstructable from headings.
- Preserve Ronan's own teaching language and examples where possible.
- Avoid generic educational jargon unless it adds precision.
- Distinguish clearly between low-level classroom practice, policy/procedure questions, safeguarding, SEN/AEN, and whole-school responsibilities.

## Editing and Publishing

- Core content lives in Markdown under `content/`.
- `_layouts/doc.html` controls the main site navigation and document shell.
- `assets/styles.css` controls the desktop/mobile navigation and document appearance.
- `.pages.yml` supports browser-based editing through Pages CMS.
- GitHub Pages publishes from `main` at the repository root.
- Preserve the `noindex,nofollow` setting while this remains a working preparation site.
- Do not add student names, confidential student information, or sensitive school records to the public repository.

## Change Discipline

When reorganising navigation, do not delete useful content merely because a top-level tab disappears. Re-link it from the appropriate interview area. Prefer a small number of durable categories over creating new categories for individual interview questions or schools.
