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
          margin:16px 0 24px;
          padding:9px 12px 10px;
          border-top:1px solid #e5e7eb;
          border-bottom:1px solid #e5e7eb;
          background:#fafafa;
          color:#59636e;
          font-size:.9rem;
          line-height:1.45;
          font-weight:400;
          letter-spacing:0;
        }
        @media(max-width:600px){
          .question-breadcrumb-line{
            margin:14px 0 20px;
            padding:8px 10px 9px;
            font-size:.84rem;
          }
        }
        @media print{
          .question-breadcrumb-line{
            margin:2.5mm 0 3.5mm;
            padding:1.6mm 2mm;
            border-top:.4pt solid #c7cbd0;
            border-bottom:.4pt solid #c7cbd0;
            background:#fafafa;
            font-size:8pt;
            line-height:1.2;
            font-weight:400;
          }
        }
      `;
      document.head.appendChild(style);
    }

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
      const content = section?.querySelector(':scope > .section-content');

      if (content) {
        // Put the prompt INSIDE the answer area after all answer content.
        // This guarantees: question -> answer -> retrieval prompt.
        content.appendChild(line);
        return;
      }

      // Plain Markdown fallback: place it after the answer paragraph/content,
      // immediately before the next interview-question heading.
      let lastAnswerNode = heading;
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'H2') {
        if (!node.classList?.contains('question-breadcrumb-line')) lastAnswerNode = node;
        node = node.nextElementSibling;
      }
      lastAnswerNode.insertAdjacentElement('afterend', line);
    });
  };

  const schedule = () => {
    run();
    requestAnimationFrame(run);
    window.setTimeout(run, 120);
    window.setTimeout(run, 500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
  window.addEventListener('load', run, { once: true });
})();