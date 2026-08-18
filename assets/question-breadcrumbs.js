(() => {
  if (window.__rdQuestionBreadcrumbWrapper) return;
  window.__rdQuestionBreadcrumbWrapper = true;

  const sourceUrl = document.currentScript?.src || location.href;

  // Interview heading convention:
  //   Short handle - Concise interview question?
  // The ordinary keyboard hyphen is the preferred separator. Legacy em dashes
  // are still accepted so older notes keep working while they are edited over time.
  const splitQuestionHeading = value => {
    const text = (value || '').replace(/\s+/g, ' ').trim();
    const match = text.match(/^(.+?)\s(?:-|—)\s*(.+)$/);
    if (!match) return null;
    const handle = match[1].trim();
    const question = match[2].trim();
    if (!handle || !question) return null;
    return { handle, question };
  };

  const localHandles = new Map();

  const applyQuestionHeadingSyntax = () => {
    const body = document.getElementById('docBody');
    if (!body) return;

    body.querySelectorAll(':scope > h2').forEach(heading => {
      if (heading.dataset.shortQuestionSyntax === 'true') return;
      const parsed = splitQuestionHeading(heading.textContent);
      if (!parsed) return;

      heading.dataset.shortQuestionSyntax = 'true';
      heading.dataset.interviewConcept = parsed.handle;
      heading.dataset.interviewQuestion = parsed.question;
      if (heading.id) localHandles.set(heading.id, parsed.handle);

      // Keep the short handle as metadata for menus, but show only the actual
      // interview question on the page.
      heading.textContent = parsed.question;
    });
  };

  const shortenDropdownLinks = () => {
    document.querySelectorAll('.topnav .dropmenu a:not([data-menu-page])').forEach(link => {
      const parsed = splitQuestionHeading(link.textContent);
      if (parsed) {
        if (link.textContent.trim() !== parsed.handle) link.textContent = parsed.handle;
        return;
      }

      try {
        const url = new URL(link.href, location.href);
        const currentPath = location.pathname.replace(/\/+$/, '') || '/';
        const targetPath = url.pathname.replace(/\/+$/, '') || '/';
        const id = decodeURIComponent((url.hash || '').replace(/^#/, ''));
        if (targetPath === currentPath && id && localHandles.has(id)) {
          const wanted = localHandles.get(id);
          if (link.textContent.trim() !== wanted) link.textContent = wanted;
        }
      } catch (_) {
        // Leave non-standard links alone.
      }
    });
  };

  applyQuestionHeadingSyntax();
  shortenDropdownLinks();

  const nav = document.querySelector('.topnav');
  if (nav) {
    let menuFixQueued = false;
    const queueMenuFix = () => {
      if (menuFixQueued) return;
      menuFixQueued = true;
      requestAnimationFrame(() => {
        menuFixQueued = false;
        applyQuestionHeadingSyntax();
        shortenDropdownLinks();
      });
    };
    const menuObserver = new MutationObserver(queueMenuFix);
    menuObserver.observe(nav, { childList: true, subtree: true, characterData: true });
    window.setTimeout(queueMenuFix, 120);
    window.setTimeout(queueMenuFix, 500);
    window.setTimeout(queueMenuFix, 1200);
  }

  const coreScript = document.createElement('script');
  coreScript.src = new URL('question-breadcrumbs-core.js?v=20260818-0818', sourceUrl).href;
  coreScript.dataset.questionBreadcrumbsCore = 'true';

  const buttonLabel = button => [
    button?.textContent,
    button?.title,
    button?.getAttribute?.('aria-label')
  ].filter(Boolean).join(' ');

  const isWordWallAudio = button => /word\s*wall/i.test(buttonLabel(button));
  const isSecondaryAudio = button => /concepts?|breadcrumb|retrieval\s*(?:chain|map|draft|table)/i.test(buttonLabel(button));

  const adjustPageAudioControls = () => {
    const rail = document.getElementById('floating-page-tools');
    const toolbar = document.querySelector('.doc-toolbar');
    const group = document.querySelector('.cm-audio-launchers');
    if (!group) return;

    const groupButtons = Array.from(group.querySelectorAll('button'));
    groupButtons.forEach(button => {
      const shouldHide = isWordWallAudio(button) || isSecondaryAudio(button) || button.disabled;
      if (shouldHide && !button.hidden) button.hidden = true;
    });

    let primary = document.getElementById('floating-page-listen');
    if (!primary || primary.parentElement !== rail) {
      const candidates = groupButtons.filter(button => !button.hidden && !button.disabled && !isWordWallAudio(button) && !isSecondaryAudio(button));
      primary = candidates.find(button => /\blisten\b/i.test(buttonLabel(button)))
        || candidates.find(button => /interview\s+questions|play\s+all|whole\s+page/i.test(buttonLabel(button)))
        || (candidates.length === 1 ? candidates[0] : null);
    }

    if (rail && primary) {
      const originalLabel = buttonLabel(primary);
      const listenAll = /play\s+all|whole\s+page/i.test(originalLabel);
      const wantedText = listenAll ? 'Listen all' : 'Listen';
      if (primary.textContent.trim() !== wantedText) primary.textContent = wantedText;
      primary.id = 'floating-page-listen';
      primary.hidden = false;
      primary.removeAttribute('aria-hidden');
      primary.setAttribute('aria-label', listenAll ? 'Listen to the whole page' : 'Listen to this page');
      primary.title = listenAll ? 'Listen to the whole page' : 'Listen to this page';

      const print = rail.querySelector('#floating-page-print');
      const wantedBefore = print?.nextSibling || null;
      if (primary.parentElement !== rail || primary.previousElementSibling !== print) {
        rail.insertBefore(primary, wantedBefore);
      }
    }

    const remaining = Array.from(group.querySelectorAll('button')).some(button => !button.hidden && !button.disabled);
    if (group.hidden === remaining) group.hidden = !remaining;

    if (toolbar) {
      const visibleToolbarChild = Array.from(toolbar.children).some(child => child !== group && !child.hidden);
      const shouldHideToolbar = !visibleToolbarChild && group.hidden;
      if (toolbar.hidden !== shouldHideToolbar) toolbar.hidden = shouldHideToolbar;
    }
  };

  const startAdjustments = () => {
    let scheduled = false;
    const queue = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        adjustPageAudioControls();
      });
    };

    adjustPageAudioControls();
    window.setTimeout(queue, 120);
    window.setTimeout(queue, 500);
    window.setTimeout(queue, 1200);

    const observer = new MutationObserver(queue);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'disabled'] });
  };

  coreScript.addEventListener('load', startAdjustments, { once: true });
  document.head.appendChild(coreScript);
})();
