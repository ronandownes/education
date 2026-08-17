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
    .replace(/misconceptions?/gi, 'miscon.')
    .replace(/prerequisites?/gi, 'prereq.')
    .replace(/assessment/gi, 'assess.')
    .replace(/questioning/gi, 'Q')
    .replace(/formative assessment/gi, 'AfL')
    .replace(/learning intention/gi, 'learning intent.')
    .replace(/success criteria/gi, 'success crit.')
    .replace(/high expectations/gi, 'high expect.')
    .replace(/consolidation/gi, 'consol.')
    .replace(/independence/gi, 'indep.')
    .replace(/participation/gi, 'particip.')
    .replace(/understanding/gi, 'underst.')
    .replace(/collaborative/gi, 'collab.')
    .replace(/technology/gi, 'tech')
    .replace(/responsive adjustment/gi, 'adapt')
    .replace(/change representation/gi, 're-rep')
    .replace(/re-teach/gi, 'reteach')
    .replace(/expectations/gi, 'expect.')
    .replace(/procedures/gi, 'procs.')
    .replace(/factual handover/gi, 'fact. handover')
    .replace(/\s+/g, ' ')
    .trim();

  const isRetrievalHeading = heading =>
    /retrieval\s+(chains|draft|map|table)/i.test(heading?.textContent || '');

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

      let nextText = raw;
      const parts = raw.split(/\s+—\s+/);

      if (parts.length > 1) {
        nextText = parts[0].trim();
      } else {
        try {
          const url = new URL(link.href, location.href);
          if (url.pathname === location.pathname && url.hash) {
            const heading = document.getElementById(decodeURIComponent(url.hash.slice(1)));
            if (heading?.dataset.interviewConcept) nextText = heading.dataset.interviewConcept;
          }
        } catch (_) {
          return;
        }
      }

      if (nextText && nextText !== raw) link.textContent = nextText;
    });
  };

  const hideAppendixSources = body => {
    const headings = Array.from(body.querySelectorAll('h2'));
    headings.forEach(heading => {
      const label = (heading.textContent || '').trim();
      if (!/word wall$/i.test(label) && !/concepts and questions$/i.test(label)) return;

      const section = heading.closest('.answer-section');
      if (section) {
        section.classList.add('interview-appendix-source');
        return;
      }

      heading.classList.add('interview-appendix-source');
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'H2') {
        node.classList.add('interview-appendix-source');
        node = node.nextElementSibling;
      }
    });
  };

  const findRetrievalTable = heading => {
    if (!heading) return null;

    const section = heading.closest('.answer-section');
    const nested = section?.querySelector('table');
    if (nested) return nested;

    let node = heading.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      if (node.tagName === 'TABLE') return node;
      const table = node.querySelector?.('table');
      if (table) return table;
      node = node.nextElementSibling;
    }
    return null;
  };

  const markRetrievalTable = table => {
    if (!table) return;
    const firstRow = table.querySelector('tr');
    if (firstRow?.children.length === 2) table.classList.add('retrieval-appendix-table');
  };

  const moveRetrievalAppendicesToBottom = body => {
    const headings = Array.from(body.querySelectorAll('h2')).filter(isRetrievalHeading);

    headings.forEach(heading => {
      const section = heading.closest('.answer-section');
      if (section && section.parentElement === body) {
        section.classList.add('retrieval-appendix-break');
        markRetrievalTable(section.querySelector('table'));
        body.appendChild(section);
        return;
      }

      if (heading.parentElement !== body) {
        heading.classList.add('retrieval-appendix-break');
        markRetrievalTable(findRetrievalTable(heading));
        return;
      }

      heading.classList.add('retrieval-appendix-break');
      const nodes = [heading];
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'H2') {
        nodes.push(node);
        node = node.nextElementSibling;
      }

      const table = nodes.find(item => item.tagName === 'TABLE') ||
        nodes.map(item => item.querySelector?.('table')).find(Boolean);
      markRetrievalTable(table);
      nodes.forEach(item => body.appendChild(item));
    });
  };

  const addNearbyEditLinks = body => {
    const pageEdit = document.querySelector('.doc-toolbar .edit-link[href]');
    if (!pageEdit?.href) return;

    body.querySelectorAll(':scope > h2').forEach(heading => {
      if (heading.dataset.sectionEditPrepared === 'true') return;
      if (heading.classList.contains('interview-appendix-source')) return;

      const sourceHeading = (heading.textContent || '').trim();
      const cmsBase = pageEdit.href.split('#')[0];
      const link = document.createElement('a');
      link.className = 'section-edit-nearby';
      link.href = `${cmsBase}#:~:text=${encodeURIComponent(sourceHeading)}`;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Edit here';
      link.title = `Open this section in Pages CMS near “${sourceHeading}”`;
      heading.insertAdjacentElement('afterend', link);
      heading.dataset.sectionEditPrepared = 'true';
    });
  };

  const ensureStyle = () => {
    let style = document.getElementById('question-breadcrumb-style');
    if (style) return;

    style = document.createElement('style');
    style.id = 'question-breadcrumb-style';
    style.textContent = `
      .interview-appendix-source{display:none!important}
      .section-edit-nearby{
        display:block;
        width:max-content;
        margin:-2px 0 7px auto;
        padding:4px 8px;
        border:1px solid #dadce0;
        border-radius:4px;
        background:#fff;
        color:#3c4043;
        text-decoration:none;
        font-size:.74rem;
        line-height:1.15;
        font-weight:500;
      }
      .section-edit-nearby:hover,.section-edit-nearby:focus-visible{
        background:#f8f9fa;
        border-color:#bdc1c6;
        outline:none;
      }
      .question-breadcrumb-line{
        display:block;
        width:100%;
        box-sizing:border-box;
        margin:18px 0 8px;
        padding:10px 13px 11px;
        border-top:1.5px solid #cfd5dc;
        border-bottom:1px solid #dfe3e8;
        background:#f3f4f5;
        color:#48525e;
        font-size:.9rem;
        line-height:1.35;
        font-weight:500;
        white-space:nowrap;
        overflow:hidden;
      }
      .retrieval-appendix-break{
        margin-top:44px!important;
        padding-top:22px;
        border-top:2px solid #d7dce2;
      }
      table.retrieval-appendix-table{
        width:100%!important;
        table-layout:fixed!important;
      }
      table.retrieval-appendix-table th,
      table.retrieval-appendix-table td{
        text-align:left!important;
        vertical-align:top!important;
      }
      table.retrieval-appendix-table th:first-child,
      table.retrieval-appendix-table td:first-child{
        width:17%!important;
        font-weight:700;
      }
      table.retrieval-appendix-table th:last-child,
      table.retrieval-appendix-table td:last-child{
        width:83%!important;
      }
      @media(max-width:700px){
        .section-edit-nearby{
          margin:1px 0 7px auto;
          font-size:.72rem;
        }
        .question-breadcrumb-line{
          margin:16px 0 8px;
          padding:9px 10px 10px;
          font-size:.82rem;
          overflow-x:auto;
        }
        table.retrieval-appendix-table th:first-child,
        table.retrieval-appendix-table td:first-child{width:25%!important}
        table.retrieval-appendix-table th:last-child,
        table.retrieval-appendix-table td:last-child{width:75%!important}
      }
      @media print{
        .interview-appendix-source,.section-edit-nearby{display:none!important}
        .retrieval-appendix-break{
          break-before:page!important;
          page-break-before:always!important;
          margin-top:0!important;
          padding-top:0!important;
          border-top:0!important;
        }
        table.retrieval-appendix-table th:first-child,
        table.retrieval-appendix-table td:first-child{width:15%!important}
        table.retrieval-appendix-table th:last-child,
        table.retrieval-appendix-table td:last-child{width:85%!important}
        .question-breadcrumb-line{
          margin:2.8mm 0 2mm;
          padding:1.7mm 2mm;
          border-top:.6pt solid #adb4bc;
          border-bottom:.4pt solid #c9ced4;
          background:#f3f3f3;
          font-size:8pt;
          line-height:1.15;
          white-space:nowrap;
          overflow:visible;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const run = () => {
    const body = document.getElementById('docBody');
    if (!body) return;

    ensureStyle();
    moveRetrievalAppendicesToBottom(body);
    hideAppendixSources(body);
    addNearbyEditLinks(body);

    const headings = Array.from(body.querySelectorAll('h2'));
    const retrievalHeading = headings.find(isRetrievalHeading);
    if (!retrievalHeading) {
      compactMenuLinks();
      return;
    }

    const table = findRetrievalTable(retrievalHeading);
    if (!table) {
      compactMenuLinks();
      return;
    }

    markRetrievalTable(table);

    const chains = new Map();
    Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
      const conceptCell = row.children[0];
      const chainCell = row.children[row.children.length - 1];
      if (!conceptCell || !chainCell || conceptCell === chainCell) return;

      const concept = conceptCell.textContent.trim();
      const chain = chainCell.textContent.trim();
      if (concept && chain) chains.set(normalise(concept), chain);
    });
    if (!chains.size) {
      compactMenuLinks();
      return;
    }

    headings.forEach(heading => {
      if (isRetrievalHeading(heading)) return;
      const remembered = rememberQuestion(heading);
      if (!remembered) return;

      const chain = chains.get(normalise(remembered.concept));
      if (!chain) return;

      hideConceptPrefix(heading, remembered.concept);

      const section = heading.closest('.answer-section');
      const host = section || heading.parentElement;
      if (!host) return;

      const key = normalise(remembered.concept);
      const existing = host.querySelector(`.question-breadcrumb-line[data-breadcrumb-key="${CSS.escape(key)}"]`);
      if (existing) return;

      const line = document.createElement('div');
      line.className = 'question-breadcrumb-line';
      line.dataset.breadcrumbKey = key;
      line.textContent = abbreviate(chain);

      if (section) {
        section.appendChild(line);
      } else {
        let node = heading.nextElementSibling;
        while (node && node.tagName !== 'H2') node = node.nextElementSibling;
        if (node) body.insertBefore(line, node);
        else body.appendChild(line);
      }
    });

    compactMenuLinks();
  };

  const start = () => {
    run();
    requestAnimationFrame(run);
    window.setTimeout(run, 250);
    window.setTimeout(run, 900);
    window.setTimeout(compactMenuLinks, 1600);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('load', run, { once: true });
})();
