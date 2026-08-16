(() => {
  const normalise = value => (value || '')
    .replace(/^\s*\d+[.)]?\s+/, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const abbreviate = value => (value || '')
    .replace(/examples and non-examples/gi, 'ex/non-ex')
    .replace(/multiple representations/gi, 'multi-reps')
    .replace(/representations?/gi, 'reps')
    .replace(/exemplars?/gi, 'exempl.')
    .replace(/examples?/gi, 'ex')
    .replace(/misconceptions?/gi, 'miscon.')
    .replace(/prerequisites?/gi, 'prereq.')
    .replace(/assessment/gi, 'assess.')
    .replace(/conversion/gi, 'convert.')
    .replace(/questioning/gi, 'Q')
    .replace(/explanations?/gi, 'explain')
    .replace(/observations?/gi, 'observe')
    .replace(/independent practice/gi, 'indep. practice')
    .replace(/guided practice/gi, 'guided practice')
    .replace(/formative assessment/gi, 'AfL')
    .replace(/learning intention/gi, 'learning intent.')
    .replace(/success criteria/gi, 'success crit.')
    .replace(/cumulative review/gi, 'cum. review')
    .replace(/high expectations/gi, 'high expect.')
    .replace(/professional learning/gi, 'prof. learning')
    .replace(/consolidation/gi, 'consol.')
    .replace(/independence/gi, 'indep.')
    .replace(/participation/gi, 'particip.')
    .replace(/understanding/gi, 'underst.')
    .replace(/collaborative/gi, 'collab.')
    .replace(/technology/gi, 'tech')
    .replace(/differentiate[d]?/gi, 'diff.')
    .replace(/responsive adjustment/gi, 'adapt')
    .replace(/change representation/gi, 're-rep')
    .replace(/re-teach/gi, 'reteach')
    .replace(/expectations/gi, 'expect.')
    .replace(/procedures/gi, 'procs.')
    .replace(/factual handover/gi, 'fact. handover')
    .replace(/\s+/g, ' ')
    .trim();

  const rememberQuestion = heading => {
    if (heading.dataset.interviewConcept && heading.dataset.interviewQuestion) {
      return {
        concept: heading.dataset.interviewConcept,
        question: heading.dataset.interviewQuestion
      };
    }

    const text = (heading.textContent || '').trim();
    const parts = text.split(/\s+—\s+/);
    if (parts.length < 2) return null;
    const concept = parts.shift().trim();
    const question = parts.join(' — ').trim();
    if (!concept || !question) return null;
    heading.dataset.interviewConcept = concept;
    heading.dataset.interviewQuestion = question;
    return { concept, question };
  };

  const hideConceptPrefix = (heading, concept) => {
    if (!heading || !concept || heading.dataset.conceptHidden === 'true') return;
    const escaped = concept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefix = new RegExp(`^\\s*${escaped}\\s+—\\s+`);
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('button')) continue;
      if (!prefix.test(node.nodeValue || '')) continue;
      node.nodeValue = (node.nodeValue || '').replace(prefix, '');
      heading.dataset.conceptHidden = 'true';
      break;
    }
  };

  const compactMenuLinks = () => {
    document.querySelectorAll('.topnav .dropmenu a[href*="#"]').forEach(link => {
      if (link.dataset.menuPage !== undefined) return;
      const raw = (link.textContent || '').trim();
      if (!raw) return;

      const parts = raw.split(/\s+—\s+/);
      if (parts.length > 1) {
        link.textContent = parts[0].trim();
        return;
      }

      try {
        const url = new URL(link.href, location.href);
        if (url.pathname !== location.pathname || !url.hash) return;
        const heading = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (heading?.dataset.interviewConcept) link.textContent = heading.dataset.interviewConcept;
      } catch (_) {
        // Leave the existing menu label alone if the URL is not parseable.
      }
    });
  };

  const run = () => {
    const body = document.getElementById('docBody');
    if (!body) return;

    document.querySelector('.doc-intro')?.remove();

    const headings = Array.from(body.querySelectorAll('h2'));
    const retrievalHeading = headings.find(heading => /retrieval\s+(chains|draft|map|table)/i.test(heading.textContent || ''));
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
        margin:18px 0 30px;
        padding:10px 13px 11px;
        border-top:1.5px solid #cfd5dc;
        border-bottom:1px solid #dfe3e8;
        background:#f3f4f5;
        color:#48525e;
        font-size:.9rem;
        line-height:1.35;
        font-weight:500;
        letter-spacing:0;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:clip;
      }
      @media(max-width:700px){
        .question-breadcrumb-line{
          margin:16px 0 24px;
          padding:9px 10px 10px;
          font-size:.82rem;
          overflow-x:auto;
        }
      }
      @media print{
        .question-breadcrumb-line{
          margin:2.8mm 0 4mm;
          padding:1.7mm 2mm;
          border-top:.6pt solid #adb4bc;
          border-bottom:.4pt solid #c9ced4;
          background:#f3f3f3;
          font-size:8pt;
          line-height:1.15;
          font-weight:500;
          white-space:nowrap;
          overflow:visible;
        }
      }
    `;

    body.querySelectorAll('.question-breadcrumb-line').forEach(line => line.remove());

    headings.forEach(heading => {
      const remembered = rememberQuestion(heading);
      if (!remembered) return;
      const { concept } = remembered;
      const chain = chains.get(normalise(concept));
      if (!chain) return;

      const line = document.createElement('div');
      line.className = 'question-breadcrumb-line';
      line.dataset.breadcrumbConcept = concept;
      line.textContent = abbreviate(chain);

      const section = heading.closest('.answer-section');
      if (section) {
        section.appendChild(line);
      } else {
        let nextHeading = heading.nextElementSibling;
        while (nextHeading && nextHeading.tagName !== 'H2') {
          nextHeading = nextHeading.nextElementSibling;
        }
        if (nextHeading) body.insertBefore(line, nextHeading);
        else body.appendChild(line);
      }

      hideConceptPrefix(heading, concept);
    });

    const fitLine = line => {
      line.style.fontSize = '';
      let size = parseFloat(getComputedStyle(line).fontSize) || 14.4;
      const min = window.matchMedia('(max-width:700px)').matches ? 10 : 11.5;
      while (line.scrollWidth > line.clientWidth + 1 && size > min) {
        size -= .25;
        line.style.fontSize = `${size}px`;
      }
    };
    const fitAll = () => body.querySelectorAll('.question-breadcrumb-line').forEach(fitLine);
    requestAnimationFrame(fitAll);
    window.setTimeout(fitAll, 250);
    compactMenuLinks();
  };

  const schedule = () => {
    run();
    requestAnimationFrame(run);
    window.setTimeout(run, 150);
    window.setTimeout(run, 600);
    window.setTimeout(run, 1500);
    window.setTimeout(compactMenuLinks, 1800);
  };

  if (!document.documentElement.dataset.compactInterviewMenus) {
    document.documentElement.dataset.compactInterviewMenus = 'true';
    const observer = new MutationObserver(() => compactMenuLinks());
    const nav = document.querySelector('.topnav');
    if (nav) observer.observe(nav, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
  window.addEventListener('load', run, { once: true });
  window.addEventListener('resize', () => window.setTimeout(run, 60));
})();