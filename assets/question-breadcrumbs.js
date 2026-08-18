(() => {
  if (window.__rdQuestionBreadcrumbWrapper) return;
  window.__rdQuestionBreadcrumbWrapper = true;

  const sourceUrl = document.currentScript?.src || location.href;
  const coreScript = document.createElement('script');
  coreScript.src = new URL('question-breadcrumbs-core.js?v=20260818-0200', sourceUrl).href;
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
