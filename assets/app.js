const grid = document.getElementById("subjectGrid");

SUBJECT_SITES.forEach(site => {
  const live = site.url && site.url !== "#";
  const card = document.createElement(live ? "a" : "div");
  card.className = "subject-card";
  if (live) {
    card.href = site.url;
    card.target = "_blank";
    card.rel = "noopener";
  }
  card.innerHTML = `
    <div class="status">${live ? "Open site" : "Coming soon"}</div>
    <h3>${site.name}</h3>
    <p>${site.description}</p>
  `;
  grid.appendChild(card);
});
