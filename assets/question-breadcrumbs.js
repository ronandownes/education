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

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const chains = new Map();
    rows.forEach(row => {
      const conceptCell = row.children[0];
      const chainCell = row.children[row.children.length - 1];
      if (!conceptCell || !chainCell || conceptCell === chainCell) return;
      const concept = conceptCell.textContent.trim();
      const chain = chainCell.textContent.trim();
      if (!concept || !chain) return;
      chains.set(normalise(concept), chain);
    });
    if (!chains.size) return;

    const style = document.createElement('style');
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
      @media(max-width:600px){
        .question-breadcrumb-line{font-size:.84rem}
      }
      @media print{
        .question-breadcrumb-line{margin:1mm 0 1.8mm;padding:0;font-size:8pt;line-height:1.2;background:transparent;border:0;font-weight:400}
      }
    `;
    document.head.appendChild(style);

    headings.forEach(heading => {
      const text = (heading.textContent || '').trim();
      if (!text.includes('—')) return;
      const concept = text.split(/\s+—\s+/)[0].trim();
      const chain = chains.get(normalise(concept));
      if (!chain) return;
      if (heading.closest('.answer-section')?.querySelector(':scope > .question-breadcrumb-line')) return;
      if (heading.nextElementSibling?.classList?.contains('question-breadcrumb-line')) return;

      const line = document.createElement('div');
      line.className = 'question-breadcrumb-line';
      line.dataset.breadcrumbConcept = concept;
      line.textContent = chain;

      const section = heading.closest('.answer-section');
      const headingRow = heading.closest('.answer-heading-row');
      if (section && headingRow && headingRow.parentElement === section) {
        headingRow.insertAdjacentElement('afterend', line);
      } else {
        heading.insertAdjacentElement('afterend', line);
      }
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
