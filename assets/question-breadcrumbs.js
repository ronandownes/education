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

    if (!document.getElementById('question-breadcrumb-style')) {
      const style = document.createElement('style');
      style.id = 'question-breadcrumb-style';
      style.textContent = `
        .question-breadcrumb-line{
          display:block;
          width:100%;
          box-sizing:border-box;
          margin:5px 0 10px;
          padding:0;
          border:0;
          background:transparent;
          color:#4b5563;
          font-size:.9rem;
          line-height:1.4;
          font-weight:400;
          letter-spacing:0;
        }
        @media(max-width:600px){.question-breadcrumb-line{font-size:.84rem}}
        @media print{
          .question-breadcrumb-line{margin:1mm 0 1.8mm;padding:0;font-size:8pt;line-height:1.2;background:transparent;border:0;font-weight:400}
        }
      `;
      document.head.appendChild(style);
    }

    // Rebuild these lines each time so later page-enhancement scripts cannot leave
    // them sitting above the question. The master retrieval table remains the only
    // source of truth.
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

      const headingRow = heading.closest('.answer-heading-row');
      if (headingRow) {
        // The question lives in the heading row; put the prompt immediately after it.
        headingRow.insertAdjacentElement('afterend', line);
      } else {
        // Plain Markdown page: question H2, then prompt, then the answer paragraph.
        heading.insertAdjacentElement('afterend', line);
      }
    });
  };

  const schedule = () => {
    run();
    requestAnimationFrame(run);
    window.setTimeout(run, 120);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
  window.addEventListener('load', run, { once: true });
})();