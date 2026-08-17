(() => {
  const body = document.getElementById('docBody');
  if (!body) return;

  const removableHeading = text => {
    const value = (text || '').replace(/\s+/g, ' ').trim();
    return /word wall/i.test(value)
      || /concepts?\s+(?:&|and)\s+questions/i.test(value)
      || /retrieval draft/i.test(value);
  };

  const removeSections = () => {
    const headings = Array.from(body.querySelectorAll(':scope > h2'));
    headings.forEach(heading => {
      if (!removableHeading(heading.textContent)) return;
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'H2') {
        const next = node.nextElementSibling;
        node.remove();
        node = next;
      }
      heading.remove();
    });
  };

  const removeCountedWordWalls = () => {
    body.querySelectorAll(':scope > table').forEach(table => {
      const matches = table.textContent.match(/\(\d+\)/g) || [];
      if (matches.length >= 3) table.remove();
    });
  };

  const pruneNavigation = () => {
    document.querySelectorAll('.dropmenu a').forEach(link => {
      if (removableHeading(link.textContent)) link.remove();
    });
  };

  const clean = () => {
    removeSections();
    removeCountedWordWalls();
    pruneNavigation();
  };

  clean();

  const observer = new MutationObserver(clean);
  observer.observe(document.body, { childList: true, subtree: true });
})();
