(() => {
  const run = () => {
    const body = document.getElementById('docBody');
    if (!body) return;

    document.querySelector('.doc-intro')?.remove();

    const normalise = value => (value || '')
      .replace(/^\s*\d+[.)]?\s+/, '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const headings = Array.from(body.querySelectorAll('h2'));
    const retrievalHeading = headings.find(heading => /retrieval\s+(chains|draft|map)/i.test(heading.textContent || ''));
    if (!retrievalHeading) return;

    let table = retrievalHeading.nextElementSibling;
    while (table && table.tagName !== 'H2' && table.tagName !== 'TABLE') {
      const nested = table.querySelector?.('table');
      if (nested) {
        table = nested;
        break;
      }
      table = table.nextElementSibling;
    }
    if (!table || table.tagName !== 'TABLE') return;

    const chains = new Map();
    Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
      const conceptCell = row.children[0];
      const chainCell = row.children[row.children.length - 1];
      if (!conceptCell || !chainCell || conceptCell === chainCell) return;
      const concept = conceptCell.textContent.trim();
      const chain = chainCell.textContent.trim();
      if (concept && chain) chains.set(normalise(concept), chain);
    });
    if (!chains.size) return;

    let style = document.getElementById('question-breadcrumb-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'question-breadcrumb-style';
      document.head.appendChild(style);
    }
    style.textContent = `
      .question-breadcrumb-line{
        display:block;
        width:100%;
        box-sizing:border-box;
        order:99;
        margin:18px 0 28px;
        padding:10px 13px 11px;
        border-top:1px solid #d8dde3;
        border-bottom:1px solid #d8dde3;
        background:#f5f6f7;
        color:#4f5965;
        font-size:.91rem;
        line-height:1.48;
        font-weight:500;
        letter-spacing:0;
      }
      @media(max-width:600px){
        .question-breadcrumb-line{
          margin:16px 0 22px;
          padding:9px 11px 10px;
          font-size:.85rem;
        }
      }
      @media print{
        .question-breadcrumb-line{
          margin:2.8mm 0 3.8mm;
          padding:1.8mm 2.2mm;
          border-top:.5pt solid #bfc5cb;
          border-bottom:.5pt solid #bfc5cb;
          background:#f6f6f6;
          font-size:8pt;
          line-height:1.2;
          font-weight:500;
        }
      }
    `;

    body.querySelectorAll('.question-breadcrumb-line').forEach(line => line.remove());

    Array.from(body.querySelectorAll('h2')).forEach(heading => {
      const text = (heading.textContent || '').trim();
      if (!text.includes('—')) return;
      const concept = text.split(/\s+—\s+/)[0].trim();
      const chain = chains.get(normalise(concept));
      if (!chain) return;

      const line = document.createElement('div');
      line.className = 'question-breadcrumb-line';
      line.dataset.breadcrumbConcept = concept;
      line.textContent = chain;

      const section = heading.closest('.answer-section');
      if (section) {
        // Make the retrieval prompt the final child of the whole Q&A section.
        // This forces the visible order: question -> answer -> prompt.
        section.appendChild(line);
        return;
      }

      // Plain Markdown fallback: put the prompt immediately before the next H2,
      // after every paragraph/list belonging to this answer.
      let nextHeading = heading.nextElementSibling;
      while (nextHeading && nextHeading.tagName !== 'H2') {
        nextHeading = nextHeading.nextElementSibling;
      }
      if (nextHeading) body.insertBefore(line, nextHeading);
      else body.appendChild(line);
    });
  };

  const schedule = () => {
    run();
    requestAnimationFrame(run);
    window.setTimeout(run, 150);
    window.setTimeout(run, 600);
    window.setTimeout(run, 1500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
  window.addEventListener('load', run, { once: true });
})();