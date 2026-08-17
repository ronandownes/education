(() => {
if (!Array.from(document.scripts).some(script => /\/assets\/question-breadcrumbs\.js(?:\?|$)/.test(script.src || ''))) {
const breadcrumbScript = document.createElement('script');
breadcrumbScript.src = new URL('question-breadcrumbs.js', document.currentScript?.src || location.href).href;
breadcrumbScript.dataset.questionBreadcrumbs = 'true';
document.head.appendChild(breadcrumbScript);
}
const domains = [
{
path: '/teaching-learning.html',
name: 'Teaching & Learning',
short: 'TL',
wall: 'Teaching & Learning Word Wall',
concepts: 'Teaching & Learning Concepts and Questions',
breadcrumbs: 'Teaching & Learning Retrieval Chains',
splitAudio: true,
questionBank: [
['General approach', 'What does good teaching and learning look like in general.'],
['Good teaching', 'What are the key features of good teaching?'],
['Effective lesson', 'What does an effective lesson look like?'],
['Difficult concept', 'How do you teach a difficult concept?'],
['Clear explanation', 'How do you explain something clearly?'],
['Modelling', 'How do you use modelling effectively?'],
['Scaffolding', 'How do you scaffold learning?'],
['Cognitive load', 'How do you reduce cognitive load?'],
['Active learning', 'How do you make learning active without losing structure?'],
['Student thinking', 'How do you make sure students are doing the thinking?'],
['Questioning', 'How do you use questioning effectively?'],
['Check understanding', 'How do you know whether students have understood?'],
['Misconceptions', 'How do you identify and respond to misconceptions?'],
['Retrieval practice', 'How do you use retrieval practice?'],
['Formative assessment', 'How do you use formative assessment to inform teaching?'],
['Independence', 'How do you move students towards independent learning?'],
['Challenge', 'How do you challenge students who are ready to go further?'],
['Vocabulary', 'How do you teach subject-specific vocabulary?'],
['Engagement', 'How do you keep students engaged in learning?'],
['Digital learning', 'How do you use digital technology in teaching and learning?'],
['Digital inclusion', 'How can digital technology support inclusion?'],
['Choosing tools', 'How do you decide whether a digital tool is worth using?'],
['Lesson not working', 'What do you do when a lesson is not working?'],
['Consolidation', 'How do you consolidate learning?'],
['Improving practice', 'How do you evaluate and improve your own teaching?'],
['Unmotivated student', 'How would you teach an unmotivated student with a history of lack of success in the subject who would rather not be at school?']
]
},
{ path: '/classroom-management.html', name: 'Classroom Management', short: 'CM', wall: 'Classroom Management Word Wall', concepts: 'Classroom Management Concepts and Questions' },
{ path: '/sen-inclusion.html', name: 'AEN & Inclusion', short: 'AEN', wall: 'AEN & Inclusion Word Wall', concepts: 'AEN & Inclusion Concepts and Questions' },
{ path: '/differentiation-accessibility.html', name: 'Differentiation & Accessibility', short: 'DA', wall: 'Differentiation & Accessibility Word Wall', concepts: 'Differentiation & Accessibility Retrieval Draft' },
{ path: '/assessment-reporting.html', name: 'Assessment, Feedback & Reporting', short: 'AFR', wall: 'Assessment, Feedback & Reporting Word Wall', concepts: 'Assessment, Feedback & Reporting Concepts and Questions' },
{ path: '/planning-curriculum.html', name: 'Planning & Curriculum', short: 'PC', wall: 'Planning & Curriculum Word Wall', concepts: 'Planning & Curriculum Concepts and Questions' },
{ path: '/relationships-wellbeing.html', name: 'Relationships & Wellbeing', short: 'RW', wall: 'Relationships & Wellbeing Word Wall', concepts: 'Relationships & Wellbeing Concepts and Questions' },
{ path: '/professional-practice.html', name: 'Professional Responsibility', short: 'PR', wall: 'Professional Responsibility Word Wall', concepts: 'Professional Responsibility Concepts and Questions' },
{ path: '/school-research.html', name: "St Patrick's Comprehensive", short: 'SPC', wall: "St Patrick's Word Wall", concepts: "St Patrick's Retrieval Map", pageAudio: true }
];
const domain = domains.find(item => location.pathname.endsWith(item.path));
if (!domain) return;
const body = document.getElementById('docBody');
if (!body) return;
const cleanNumber = value => (value || '').replace(/^\s*\d+[.)]?\s+/, '').trim();
const removeVisibleNumber = element => {
const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
let node = walker.nextNode();
while (node && !node.nodeValue.trim()) node = walker.nextNode();
if (node) node.nodeValue = node.nodeValue.replace(/^\s*\d+[.)]?\s+/, '');
};
body.querySelectorAll(':scope > h2, table tbody td:first-child').forEach(removeVisibleNumber);
if (domain.splitAudio && Array.isArray(domain.questionBank) && !Array.from(body.querySelectorAll(':scope > h2')).some(h => cleanNumber(h.textContent) === domain.concepts)) {
const heading = document.createElement('h2');
heading.textContent = domain.concepts;
heading.id = 'teaching--learning-concepts-and-questions';
const table = document.createElement('table');
table.innerHTML = '<thead><tr><th>Concept</th><th>Question</th></tr></thead><tbody></tbody>';
const tbody = table.querySelector('tbody');
domain.questionBank.forEach(([concept, question]) => {
const row = document.createElement('tr');
const conceptCell = document.createElement('td');
const questionCell = document.createElement('td');
conceptCell.textContent = concept;
questionCell.textContent = question;
row.append(conceptCell, questionCell);
tbody.appendChild(row);
});
const wordWallHeading = Array.from(body.querySelectorAll(':scope > h2')).find(h => cleanNumber(h.textContent) === domain.wall);
if (wordWallHeading) {
body.insertBefore(heading, wordWallHeading);
body.insertBefore(table, wordWallHeading);
} else {
body.append(heading, table);
}
}
const toolbar = document.querySelector('.doc-toolbar');
const synth = window.speechSynthesis;
if (!toolbar || !synth || typeof SpeechSynthesisUtterance === 'undefined') return;
const audioHighlightStyle = document.createElement('style');
audioHighlightStyle.textContent = `
.cm-audio-speaking{background:#fff3bf!important;box-shadow:0 0 0 4px #fff3bf!important;border-radius:4px;transition:background .12s ease,box-shadow .12s ease}
.doc-body h2.cm-audio-speaking{color:inherit!important}
@media print{.cm-audio-speaking{background:transparent!important;box-shadow:none!important}}
`;
document.head.appendChild(audioHighlightStyle);
if (domain.splitAudio) {
const style = document.createElement('style');
style.textContent = `
.cm-audio-launchers.is-four-up{flex:0 1 auto;align-items:center}
.answer-section:has(#teaching--learning-concepts-and-questions) .section-content table{table-layout:fixed}
.answer-section:has(#teaching--learning-concepts-and-questions) .section-content th:first-child,
.answer-section:has(#teaching--learning-concepts-and-questions) .section-content td:first-child{width:22%;font-weight:700;text-align:left}
.answer-section:has(#teaching--learning-concepts-and-questions) .section-content th:last-child,
.answer-section:has(#teaching--learning-concepts-and-questions) .section-content td:last-child{width:78%;text-align:left}
@media(max-width:600px){
.cm-audio-launchers.is-four-up{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%}
.cm-audio-launchers.is-four-up .cm-audio-launch:last-child{grid-column:auto}
}
`;
document.head.appendChild(style);
}
const headings = Array.from(body.querySelectorAll(':scope > h2'));
const findHeading = text => headings.find(heading => cleanNumber(heading.textContent) === text);
const tableAfter = heading => {
let node = heading?.nextElementSibling;
while (node && node.tagName !== 'H2') {
if (node.tagName === 'TABLE') return node;
const nestedTable = node.querySelector?.('table');
if (nestedTable) return nestedTable;
node = node.nextElementSibling;
}
return null;
};
const wall = tableAfter(findHeading(domain.wall));
const conceptsTable = tableAfter(findHeading(domain.concepts));
const breadcrumbsTable = domain.breadcrumbs ? tableAfter(findHeading(domain.breadcrumbs)) : null;
const forSpeech = value => cleanNumber(value)
.replace(/\s*\(\d+\)\s*$/g, '')
.replace(/\bAEN\b/g, 'A. E. N.')
.replace(/\bSEN\b/g, 'S. E. N.')
.replace(/\bUDL\b/g, 'U. D. L.')
.replace(/\bCPD\b/g, 'C. P. D.')
.replace(/\bSSE\b/g, 'S. S. E.')
.replace(/\bLCA\b/g, 'L. C. A.')
.replace(/\bICT\b/g, 'I. C. T.')
.replace(/&/g, ' and ')
.replace(/\s+\/\s+/g, ' or ')
.replace(/\s+/g, ' ')
.trim();
const breadcrumbForSpeech = value => forSpeech(value)
.replace(/→/g, '. ')
.replace(/\bS\s*\/\s*C\b/gi, 'support and challenge')
.replace(/\bEx\/non-ex\b/gi, 'examples and non examples')
.replace(/\bLI\b/g, 'learning intention')
.replace(/\bSC\b/g, 'success criteria')
.replace(/\bGP\b/g, 'guided practice')
.replace(/\bIP\b/g, 'independent practice')
.replace(/\bAfL\b/g, 'assessment for learning')
.replace(/\bMWB\b/g, 'mini whiteboards')
.replace(/\bTPS\b/g, 'think pair share')
.replace(/\bGD\b/g, 'guided discovery')
.replace(/\bMCQ\b/g, 'multiple choice question')
.replace(/\bQ\b/g, 'questioning')
.replace(/\bMulti-reps\b/gi, 'multiple representations')
.replace(/\breps\b/gi, 'representations')
.replace(/\bRe-rep\b/gi, 'change representation')
.replace(/\bPrereqs\b/gi, 'prerequisites')
.replace(/\bCum\. review\b/gi, 'cumulative review')
.replace(/\bHigh exp\.\b/gi, 'high expectations')
.replace(/\bPL\b/g, 'professional learning')
.replace(/\//g, ' or ')
.replace(/\s+/g, ' ')
.trim();
const normaliseConcept = value => cleanNumber(value)
.toLowerCase()
.replace(/&/g, 'and')
.replace(/[^a-z0-9]+/g, ' ')
.replace(/\s+/g, ' ')
.trim();
const answerElementAfter = heading => {
let node = heading.nextElementSibling;
while (node && node.tagName !== 'H2') {
if (node.matches('p, ul, ol, blockquote') && forSpeech(node.textContent)) return node;
node = node.nextElementSibling;
}
return null;
};
const answerAfter = heading => {
const node = answerElementAfter(heading);
return node ? forSpeech(node.textContent) : '';
};
const wordWallSegments = [];
if (wall?.tagName === 'TABLE') {
const headers = Array.from(wall.querySelectorAll('thead th'));
const rows = Array.from(wall.querySelectorAll('tbody tr'));
headers.forEach((header, column) => {
const category = forSpeech(header.textContent);
const terms = rows.map(row => forSpeech(row.children[column]?.textContent)).filter(Boolean);
if (!category || !terms.length) return;
wordWallSegments.push(
{ text: `${domain.name}. ${category}.`, rate: 0.84, delayAfter: 550, status: category },
{ text: terms.join('. '), rate: 0.92, delayAfter: 850, status: category }
);
});
}
const sourceConceptRows = conceptsTable?.tagName === 'TABLE'
? Array.from(conceptsTable.querySelectorAll('tbody tr')).map(row => ({
concept: forSpeech(row.children[0]?.textContent),
question: forSpeech(row.children[1]?.textContent)
})).filter(row => row.concept || row.question)
: [];
const breadcrumbRows = breadcrumbsTable?.tagName === 'TABLE'
? Array.from(breadcrumbsTable.querySelectorAll('tbody tr')).map(row => ({
concept: forSpeech(row.children[0]?.textContent),
chain: breadcrumbForSpeech(row.children[1]?.textContent)
})).filter(row => row.concept || row.chain)
: [];
const candidateItems = headings.map(heading => {
const fullHeading = cleanNumber(heading.textContent);
if (!fullHeading.includes('—')) return null;
const parts = fullHeading.split(/\s+—\s+/);
const question = forSpeech(parts.pop());
const concept = forSpeech(parts.join(' — '));
const answerElement = answerElementAfter(heading);
const answer = answerElement ? forSpeech(answerElement.textContent) : '';
if (!concept || !question || !answer) return null;
return { heading, answerElement, concept, question, answer };
}).filter(Boolean);
const questionRows = sourceConceptRows.length
? sourceConceptRows
: candidateItems.map(item => ({ concept: item.concept, question: item.question }));
const findQuestionRow = concept => questionRows.find(row =>
normaliseConcept(row.concept) === normaliseConcept(concept)
);
const interviewItems = candidateItems.map(item => {
const row = findQuestionRow(item.concept);
return { ...item, question: row?.question || item.question };
});
const findInterviewItem = concept => interviewItems.find(item => normaliseConcept(item.concept) === normaliseConcept(concept));
const questionSegments = questionRows.map(row => {
const item = findInterviewItem(row.concept);
return {
text: row.question ? `${row.concept}. ${row.question}` : row.concept,
rate: 0.89,
delayAfter: 900,
heading: item?.heading,
target: item?.heading,
status: row.concept
};
});
const answerSegments = interviewItems.map(item => ({
text: `${item.concept}. ${item.answer}`,
rate: 0.92,
delayAfter: 850,
heading: item.heading,
target: item.answerElement,
status: item.concept
}));
const breadcrumbSegments = breadcrumbRows.map(row => ({
text: row.chain ? `${row.concept}. ${row.chain}` : row.concept,
rate: 0.88,
delayAfter: 700,
status: row.concept
}));
const interviewSegments = (item, showConcept) => [
{ text: item.question, rate: 0.89, delayAfter: 500, heading: item.heading, target: item.heading, status: showConcept ? `Question · ${item.concept}` : 'Question' },
{ text: item.answer, rate: 0.92, delayAfter: 800, heading: item.heading, target: item.answerElement, status: showConcept ? `Answer · ${item.concept}` : 'Answer' }
];
const conceptSegments = questionRows.map(row => ({
text: row.question ? `${row.concept}. ${row.question}` : row.concept,
rate: 0.92,
delayAfter: 500,
status: row.concept
}));
let modes;
if (domain.splitAudio) {
modes = {
questions: { label: 'Questions', title: 'Teaching & Learning — questions only', segments: questionSegments },
answers: { label: 'Answers', title: 'Teaching & Learning — answers only', segments: answerSegments },
wall: { label: 'Word Wall', title: 'Teaching & Learning — Word Wall', segments: wordWallSegments },
breadcrumbs: { label: 'Breadcrumbs', title: 'Teaching & Learning — retrieval breadcrumbs', segments: breadcrumbSegments }
};
} else if (domain.pageAudio) {
modes = {
all: {
label: 'Play all',
title: `${domain.name} — whole page`,
segments: [
...wordWallSegments,
...interviewItems.flatMap(item => interviewSegments(item, true))
]
},
wall: { label: `${domain.short} Word Wall`, title: `${domain.short} Word Wall`, segments: wordWallSegments },
concepts: { label: `${domain.short} Retrieval Map`, title: `${domain.short} Retrieval Map`, segments: conceptSegments }
};
} else {
modes = {
wall: { label: `${domain.short} Word Wall`, title: `${domain.short} Word Wall`, segments: wordWallSegments },
concepts: { label: `${domain.short} Concepts`, title: `${domain.short} Concepts and Questions`, segments: conceptSegments },
interview: { label: `${domain.short} Interview Questions`, title: `${domain.short} Interview Questions and Answers`, segments: interviewItems.flatMap(item => interviewSegments(item, true)) }
};
}
const launchers = document.createElement('div');
launchers.className = 'cm-audio-launchers';
if (Object.keys(modes).length === 4) launchers.classList.add('is-four-up');
launchers.setAttribute('aria-label', `${domain.name} audio`);
const player = document.createElement('div');
player.className = 'cm-audio-player';
player.hidden = true;
player.setAttribute('role', 'region');
player.setAttribute('aria-label', 'Audio controls');
const status = document.createElement('div');
status.className = 'cm-audio-status';
status.setAttribute('aria-live', 'polite');
const playerControls = document.createElement('div');
playerControls.className = 'cm-audio-player-controls';
const pauseButton = document.createElement('button');
pauseButton.type = 'button';
pauseButton.className = 'cm-audio-control cm-audio-pause';
pauseButton.innerHTML = '<span aria-hidden="true">❚❚</span><span class="visually-hidden">Pause</span>';
pauseButton.setAttribute('aria-label', 'Pause audio');
pauseButton.title = 'Pause';
const stopButton = document.createElement('button');
stopButton.type = 'button';
stopButton.className = 'cm-audio-control cm-audio-stop';
stopButton.innerHTML = '<span aria-hidden="true">■</span><span class="visually-hidden">Stop</span>';
stopButton.setAttribute('aria-label', 'Stop audio');
stopButton.title = 'Stop';
playerControls.append(pauseButton, stopButton);
player.append(status, playerControls);
toolbar.prepend(launchers);
toolbar.insertAdjacentElement('afterend', player);
let preferredVoice = null;
const selectVoice = () => {
const voices = synth.getVoices();
preferredVoice = voices.find(voice => /^en-IE$/i.test(voice.lang)) ||
voices.find(voice => /^en-GB$/i.test(voice.lang)) ||
voices.find(voice => /^en/i.test(voice.lang)) || null;
};
selectVoice();
synth.addEventListener?.('voiceschanged', selectVoice);
const launcherButtons = {};
let runId = 0;
let queue = [];
let queueIndex = 0;
let activeKey = null;
let activeSource = null;
let activeHeading = null;
let activeTarget = null;
let paused = false;
let delayTimer = null;
let currentTitle = '';
const clearActiveHeading = () => {
activeHeading?.classList.remove('cm-audio-active-question');
activeHeading = null;
};
const setActiveHeading = heading => {
if (activeHeading === heading) return;
clearActiveHeading();
activeHeading = heading || null;
activeHeading?.classList.add('cm-audio-active-question');
};
const clearActiveTarget = () => {
activeTarget?.classList.remove('cm-audio-speaking');
activeTarget = null;
};
const setActiveTarget = target => {
if (activeTarget === target) return;
clearActiveTarget();
activeTarget = target || null;
activeTarget?.classList.add('cm-audio-speaking');
if (activeTarget && activeSource?.classList.contains('cm-question-play')) {
activeTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
};
const updatePauseButton = () => {
pauseButton.innerHTML = paused
? '<span aria-hidden="true">▶</span><span class="visually-hidden">Resume</span>'
: '<span aria-hidden="true">❚❚</span><span class="visually-hidden">Pause</span>';
pauseButton.setAttribute('aria-label', paused ? 'Resume audio' : 'Pause audio');
pauseButton.title = paused ? 'Resume' : 'Pause';
player.classList.toggle('is-paused', paused);
};
const resetSources = () => {
Object.values(launcherButtons).forEach(button => button.classList.remove('is-active'));
body.querySelectorAll('.cm-question-play').forEach(button => button.classList.remove('is-active'));
};
const finish = () => {
window.clearTimeout(delayTimer);
delayTimer = null;
queue = [];
queueIndex = 0;
activeKey = null;
activeSource = null;
paused = false;
currentTitle = '';
resetSources();
clearActiveHeading();
clearActiveTarget();
updatePauseButton();
stopButton.hidden = false;
player.hidden = true;
};
const stop = () => {
runId += 1;
window.clearTimeout(delayTimer);
delayTimer = null;
synth.cancel();
finish();
};
const speakNext = sessionId => {
if (sessionId !== runId || paused || !activeKey) return;
if (queueIndex >= queue.length) {
finish();
return;
}
const segment = queue[queueIndex];
queueIndex += 1;
setActiveHeading(segment.heading);
setActiveTarget(segment.target || segment.heading);
status.textContent = segment.status ? `${currentTitle} · ${segment.status}` : currentTitle;
const utterance = new SpeechSynthesisUtterance(segment.text);
utterance.lang = 'en-IE';
utterance.rate = segment.rate || 0.92;
utterance.pitch = 1;
if (preferredVoice) utterance.voice = preferredVoice;
utterance.onend = () => {
if (sessionId !== runId || !activeKey) return;
clearActiveTarget();
delayTimer = window.setTimeout(() => speakNext(sessionId), segment.delayAfter || 350);
};
utterance.onerror = event => {
if (sessionId !== runId || event.error === 'canceled' || event.error === 'interrupted') return;
clearActiveTarget();
delayTimer = window.setTimeout(() => speakNext(sessionId), 100);
};
synth.speak(utterance);
};
const start = (key, title, segments, source) => {
if (!segments.length) return;
stop();
runId += 1;
const sessionId = runId;
activeKey = key;
activeSource = source;
currentTitle = title;
queue = segments;
queueIndex = 0;
paused = false;
resetSources();
activeSource?.classList.add('is-active');
status.textContent = title;
updatePauseButton();
const isQuestionButton = source?.classList.contains('cm-question-play');
stopButton.hidden = isQuestionButton;
player.hidden = false;
delayTimer = window.setTimeout(() => speakNext(sessionId), 60);
};
const pause = () => {
if (!activeKey || paused) return;
paused = true;
window.clearTimeout(delayTimer);
delayTimer = null;
if (synth.speaking && !synth.paused) synth.pause();
updatePauseButton();
};
const resume = () => {
if (!activeKey || !paused) return;
paused = false;
updatePauseButton();
if (synth.paused) synth.resume();
else speakNext(runId);
};
const toggleSource = (key, title, segments, source) => {
if (activeKey === key && activeSource === source) {
if (source?.classList.contains('cm-question-play')) stop();
else if (paused) resume();
else pause();
return;
}
start(key, title, segments, source);
};
Object.entries(modes).forEach(([key, mode]) => {
const button = document.createElement('button');
button.type = 'button';
button.className = 'cm-audio-launch';
button.textContent = mode.label;
button.setAttribute('aria-label', `Play ${mode.title}`);
button.title = `Play ${mode.title}`;
button.disabled = !mode.segments.length;
button.addEventListener('click', () => toggleSource(key, mode.title, mode.segments, button));
launcherButtons[key] = button;
launchers.appendChild(button);
});
interviewItems.forEach((item, index) => {
const button = document.createElement('button');
button.type = 'button';
button.className = 'cm-question-play';
button.setAttribute('aria-label', `Play question and answer: ${item.question}`);
button.title = 'Play question and answer · tap again to stop';
const key = `question-${index}`;
button.addEventListener('click', event => {
event.stopPropagation();
toggleSource(key, item.concept, interviewSegments(item, false), button);
});
item.heading.prepend(button);
});
pauseButton.addEventListener('click', () => paused ? resume() : pause());
stopButton.addEventListener('click', stop);
window.addEventListener('pagehide', stop);
window.addEventListener('beforeunload', stop);
})();