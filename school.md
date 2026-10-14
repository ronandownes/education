---
layout: doc
permalink: /school.html
handle: School
title: School
nav_order: 1
top_nav: true
description: Active interview-answer learning, practice and graduation.
eyebrow: INTERVIEW ANSWER LEARNING LAB
---

<style>
.school-lab{max-width:960px;margin:auto;color:#193247}.school-lab .lab-track{display:flex;flex-wrap:wrap;gap:8px;margin:17px 0}.school-lab button{font:inherit;border:1px solid #a9bfce;background:white;color:#173b57;border-radius:8px;padding:8px 11px;cursor:pointer}.school-lab button[aria-pressed="true"]{background:#154f82;color:white}.school-lab .panel{background:white;border:1px solid #d3e0e8;border-radius:14px;padding:18px;margin:15px 0}.school-lab textarea{font:inherit;line-height:1.6;width:100%;box-sizing:border-box;padding:12px;border:1px solid #bbceda;border-radius:7px;min-height:130px;background:#fff;color:#162f43}.school-lab table{border-collapse:collapse;width:100%;margin-top:12px}.school-lab th,.school-lab td{border:1px solid #ccdae3;padding:5px}.school-lab td textarea{min-height:48px;padding:6px;border:0;border-radius:0;resize:vertical}.school-lab .rowtools{white-space:nowrap;width:1%;vertical-align:middle}.school-lab .rowtools button{padding:5px 8px;margin:1px}.school-lab .headingrow{background:#eaf1f7}.school-lab .muted{color:#596e7e;font-size:.9rem}.school-lab .controls{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0}.school-lab .answer-section{margin-bottom:20px}.school-lab .answer-section h3{margin-bottom:7px}.school-lab .notice{font-size:.87rem;color:#4f6575}@media(max-width:600px){.school-lab .panel{padding:10px}.school-lab .rowtools button{padding:4px}.school-lab td textarea{min-width:110px}}
</style>
<div class="school-lab" id="school-lab">
  <p><strong>Your answer workshop.</strong> Every new question starts as an Undergraduate. Develop the paragraph and its recall table together; promote it when you can answer independently.</p>
  <div class="lab-track" id="lab-track" aria-label="Learning stage"></div>
  <section class="panel">
    <h2>Castletroy College · Ethos and values</h2>
    <p><strong>Question:</strong> In your own words, what is your understanding of our school's ethos and values, and how would you support them?</p>
    <p class="muted">Current stage: <strong id="lab-stage"></strong> · This is a working answer, not a final script.</p>
    <div id="lab-sections"></div>
    <div class="controls"><button id="lab-add-section" type="button">+ Add paragraph and recall table</button><button id="lab-copy" type="button">Copy all</button><button id="lab-reset" type="button">Restore original draft</button></div>
    <p class="notice">Edits and stage are saved in this browser only. They are not yet synchronised across computers or committed to GitHub. Use “Copy all” to keep a backup.</p>
  </section>
  <p>See your existing <a href="{{ '/stories.html' | relative_url }}">Stories</a> while we develop the remaining questions. Nothing there has been removed.</p>
</div>
<script>
(function(){
const key="education-school-ethos-v1",stages=["Undergraduate","Training","Validation","Graduate"];
const seed={stage:0,sections:[
{paragraph:"My understanding of Castletroy College's ethos is that it's built around five core ETB values: Excellence in Education, Care, Equality, Community and Respect.",rows:[["Core values","ETB ethos"],["Excellence","Care"],["Equality","Community and Respect"]]},
{paragraph:"I very much share Castletroy College's mission of providing holistic education. For me, that means educating the whole person, going well beyond academic achievement and giving young people opportunities to develop their confidence, character, independence and sense of responsibility. It's vital that we provide both the support and the challenge they need to reach their full potential.",rows:[["Shared mission","Holistic education"],["Whole person","Beyond academic achievement"],["Opportunities","Confidence · character · independence · responsibility"],["Teaching approach","Support and challenge"],["Destination","Reach full potential"]]},
{paragraph:"In my teaching, I put those values into practice through high expectations, inclusive teaching and positive relationships. In Mathematics, that means developing genuine understanding, making challenging ideas accessible, identifying misconceptions and adapting my teaching so that every student has the opportunity to make progress.",rows:[["Classroom practice","High expectations"],["Mathematics","Conceptual understanding"],["Inclusion","Identify misconceptions"],["Progress","Adapt teaching"]]},
{paragraph:"I believe that care, equality and respect have to be evident in how we treat students every day: listening to them, being fair and consistent, recognising individual needs and creating a classroom where everyone feels they belong.",rows:[["Values in action","Care · equality · respect"],["Relationships","Listen · fair · consistent"],["Inclusion","Recognise individual needs"],["Belonging","Every student"]]},
{paragraph:"I see community as going beyond the classroom. I'd contribute by working with colleagues, building positive relationships with parents and getting involved in the wider life of the school, whether that's sporting events, productions, graduations or other activities.",rows:[["Community","Beyond classroom"],["Partnership","Colleagues and parents"],["Contribution","Events and activities"]]},
{paragraph:"For me, ethos isn't just something written in a mission statement. It's something students should experience every day, through how we teach, how we treat one another and how we work together as a school community.",rows:[["Conclusion","Ethos lived daily"],["Experience","Teaching and relationships"],["Community","Work together"]]}
]};
let data;try{data=JSON.parse(localStorage.getItem(key))||structuredClone(seed)}catch(e){data=JSON.parse(JSON.stringify(seed))}
if(!Array.isArray(data.sections))data=JSON.parse(JSON.stringify(seed));
const root=document.getElementById("school-lab"),esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function save(){try{localStorage.setItem(key,JSON.stringify(data))}catch(e){}}
function render(){
document.getElementById("lab-stage").textContent=stages[data.stage]||stages[0];
document.getElementById("lab-track").innerHTML=stages.map((s,i)=>'<button type="button" data-stage="'+i+'" aria-pressed="'+(i===data.stage)+'">'+(i+1)+'. '+esc(s)+'</button>').join('');
document.getElementById("lab-sections").innerHTML=data.sections.map((sec,i)=>'<section class="answer-section" data-section="'+i+'"><h3>Paragraph '+(i+1)+'</h3><textarea aria-label="Paragraph '+(i+1)+'" data-paragraph="'+i+'">'+esc(sec.paragraph)+'</textarea><table><tbody>'+sec.rows.map((row,j)=>'<tr class="'+(j===0?'headingrow':'')+'">'+row.map((v,k)=>'<td><textarea aria-label="Row '+(j+1)+' cell '+(k+1)+'" data-cell="'+i+','+j+','+k+'">'+esc(v)+'</textarea></td>').join('')+'<td class="rowtools"><button type="button" title="Move row up" data-move="'+i+','+j+',-1" '+(j===0?'disabled':'')+'>↑</button><button type="button" title="Move row down" data-move="'+i+','+j+',1" '+(j===sec.rows.length-1?'disabled':'')+'>↓</button><button type="button" title="Insert row below" data-add-row="'+i+','+j+'">+</button><button type="button" title="Delete row" data-del-row="'+i+','+j+'">×</button></td></tr>').join('')+'</tbody></table><div class="controls"><button type="button" data-prepend="'+i+'">+ Row at top</button><button type="button" data-column="'+i+'">+ Column</button><button type="button" data-del-column="'+i+'" '+(sec.rows[0].length===1?'disabled':'')+'>− Column</button><button type="button" data-del-section="'+i+'">Remove paragraph</button></div></section>').join('');
}
root.addEventListener("input",e=>{const p=e.target.dataset.paragraph,c=e.target.dataset.cell;if(p!==undefined)data.sections[+p].paragraph=e.target.value;if(c){let [i,j,k]=c.split(',').map(Number);data.sections[i].rows[j][k]=e.target.value}save()});
root.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const d=b.dataset;if(d.stage!==undefined)data.stage=+d.stage;
else if(d.move){const[i,j,step]=d.move.split(',').map(Number),rows=data.sections[i].rows,k=j+step;if(k>=0&&k<rows.length)[rows[j],rows[k]]=[rows[k],rows[j]]}
else if(d.addRow){let[i,j]=d.addRow.split(',').map(Number);data.sections[i].rows.splice(j+1,0,data.sections[i].rows[0].map(()=>""))}
else if(d.prepend!==undefined){let rows=data.sections[+d.prepend].rows;rows.unshift(rows[0].map(()=>""))}
else if(d.delRow){let[i,j]=d.delRow.split(',').map(Number);if(data.sections[i].rows.length>1)data.sections[i].rows.splice(j,1)}
else if(d.column!==undefined)data.sections[+d.column].rows.forEach(r=>r.push(""));
else if(d.delColumn!==undefined)data.sections[+d.delColumn].rows.forEach(r=>{if(r.length>1)r.pop()});
else if(d.delSection!==undefined){if(data.sections.length>1)data.sections.splice(+d.delSection,1)}
else if(b.id==="lab-add-section")data.sections.push({paragraph:"",rows:[["",""],["",""]]});
else if(b.id==="lab-reset"){if(!confirm("Restore the original working answer? This will overwrite edits saved in this browser."))return;data=JSON.parse(JSON.stringify(seed))}
else if(b.id==="lab-copy"){const txt=data.sections.map((s,i)=>"Paragraph "+(i+1)+"\n"+s.paragraph+"\n"+s.rows.map(r=>"| "+r.join(" | ")+" |").join("\n")).join("\n\n");navigator.clipboard.writeText(txt).then(()=>{b.textContent="Copied"});return}
else return;save();render()});
render();
})();
</script>
