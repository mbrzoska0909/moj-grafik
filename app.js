const variants={I:['06:00','14:00','14:00','22:00','22:00','06:00'],II:['06:00','14:00','14:00','22:00','22:00','06:00'],III:['06:00','14:00','14:00','22:00','22:00','06:00'],IV:['06:00','14:00','14:00','22:00','22:00','06:00'],V:['06:00','14:00','14:00','22:00','22:00','06:00'],VI:['06:00','14:00','14:00','22:00','22:00','06:00'],VII:['06:00','14:00','14:00','22:00','22:00','06:00'],VIII:['06:00','14:00','14:00','22:00','22:00','06:00'],IX:['06:00','14:00','14:00','22:00','22:00','06:00'],X:['06:00','14:00','14:00','22:00','22:00','06:00'],XI:['06:00','14:00','14:00','22:00','22:00','06:00'],XII:['06:00','14:00','14:00','22:00',null,null],XIII:['06:00','14:00','14:00','22:00',null,null],XIV:['06:00','14:00','14:00','22:00',null,null],XV:['05:00','13:00','13:00','21:00',null,null],S16:['05:00','13:00','14:00','22:00',null,null]};
for(let n=17;n<=26;n++)variants['S'+n]=['05:00','13:00','13:00','21:00',null,null];
const base={1:['06:00','14:00'],2:['14:00','22:00'],3:['22:00','06:00']};
const special={BHP:{label:'Szkolenie BHP',start:'06:00',end:'14:00'},BO:{label:'Badania okresowe',start:'06:00',end:'14:00'},UW:{label:'Urlop wypoczynkowy / wolne',allDay:true}};
function normalize(raw){return (raw||'').trim().toUpperCase().replace(/\s/g,'').replaceAll('S-','S')}
function parse(raw){raw=normalize(raw);if(!raw||raw==='-'||raw==='—')return{raw:'—',label:'Wolne',allDay:true,free:true,valid:true};if(special[raw])return{raw,...special[raw],valid:true};let [shift,v]=raw.split('/');if(!base[shift])return{raw,label:'Nieznany kod',valid:false};let start,end;if(v){let r=variants[v];if(!r)return{raw,shift,variant:v,label:'Nieznane oznaczenie',valid:false};let i=(+shift-1)*2;start=r[i];end=r[i+1];if(!start)return{raw,shift,variant:v,label:'Ta kombinacja nie występuje',valid:false};}else [start,end]=base[shift];return{raw,shift,variant:v,start,end,label:`Zmiana ${shift}${v?' • '+v:''}`,overnight:end<start,valid:true};}
const sample=['UW','UW','UW','3','3','3/I','','1','3','3','3','','','','2','2/VI','2/IX','3','3','3','','','','1','2/VIII','3','','','1','1','2/S16'];
function daysInMonth(v){if(!v)return 31;let [y,m]=v.split('-').map(Number);return new Date(y,m,0).getDate()}
function monthLabel(v){if(!v)return '';let [y,m]=v.split('-').map(Number);return new Intl.DateTimeFormat('pl-PL',{month:'long',year:'numeric'}).format(new Date(y,m-1,1))}
function splitRow(text){let s=text.trim();if(!s)return[];return s.split(/[;,\n]+/).map(x=>x.trim()).map(x=>(x==='-'||x==='—')?'':x)}
function render(entries){let good=0,bad=0;const month=document.querySelector('#month').value;let m=month?Number(month.split('-')[1]):8;document.querySelector('#schedule').innerHTML=entries.map((x,i)=>{let p=parse(x);p.valid?good++:bad++;let time=p.allDay?'cały dzień':p.start?`${p.start}–${p.end}${p.overnight?' (+1 dzień)':''}`:p.label;return `<div class='day'><span>${i+1}.${String(m).padStart(2,'0')}</span><input class='dayEdit' data-day='${i}' value='${p.raw==='—'?'':p.raw}' placeholder='wolne'><span>${time}</span><span class='${p.valid?'ok':'warn'}'>${p.valid?'✓':'!'}</span></div>`}).join('');document.querySelector('#summary').innerHTML=`<div class='result'><b>${entries.length} dni</b> • poprawne: ${good} • do sprawdzenia: ${bad}</div>`;document.querySelector('#scheduleTitle').textContent=`${document.querySelector('#employee').value||'Pracownik'} • ${monthLabel(month)}`;document.querySelectorAll('.dayEdit').forEach(el=>el.addEventListener('change',()=>{entries[+el.dataset.day]=el.value;render(entries)}));localStorage.setItem('lastSchedule',JSON.stringify({employee:document.querySelector('#employee').value,month,entries}));}
document.querySelector('#loadSample').onclick=()=>{document.querySelector('#rowInput').value=sample.map(x=>x||'-').join(', ');document.querySelector('#month').value='2026-08';document.querySelector('#employee').value='BRZÓSKA';render([...sample])};
document.querySelector('#analyzeRow').onclick=()=>{let entries=splitRow(document.querySelector('#rowInput').value), expected=daysInMonth(document.querySelector('#month').value),err=document.querySelector('#rowError');if(entries.length!==expected){err.innerHTML=`<div class='result warn'><b>Sprawdź liczbę dni:</b> odczytano ${entries.length}, a miesiąc ma ${expected}. Popraw wpisy przed zatwierdzeniem.</div>`;}else err.innerHTML='';render(entries)};
document.querySelector('#parseBtn').onclick=()=>{let p=parse(document.querySelector('#entry').value);document.querySelector('#parseResult').innerHTML=`<div class='result'><b>${p.raw}</b><br>${p.label}<br>${p.allDay?'Cały dzień':p.start?`${p.start}–${p.end}${p.overnight?' (koniec następnego dnia)':''}`:'⚠ '+p.label}</div>`};
let selectedPhoto=null;
function showPhoto(e){let f=e.target.files[0];if(!f)return;selectedPhoto=f;let img=document.querySelector('#preview');if(img.dataset.url)URL.revokeObjectURL(img.dataset.url);let url=URL.createObjectURL(f);img.dataset.url=url;img.src=url;img.hidden=false;document.querySelector('#photoInfo').textContent=`Wybrano: ${f.name||'zdjęcie'} • ${(f.size/1024/1024).toFixed(1)} MB`;document.querySelector('#ocrBtn').disabled=false;document.querySelector('#ocrStatus').innerHTML='';}
document.querySelector('#cameraPhoto').onchange=showPhoto;document.querySelector('#libraryPhoto').onchange=showPhoto;

function normWord(s){return (s||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/g,'')}
function editDistance(a,b){a=normWord(a);b=normWord(b);let d=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));for(let i=0;i<=a.length;i++)d[i][0]=i;for(let j=0;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
function validCode(raw){let x=normalize(raw).replace(/[.:]/g,'').replace(/^U[VW]$/,'UW');if(!x)return'';if(['UW','BO','BHP','1','2','3'].includes(x))return x;let m=x.match(/^([123])\/(S(?:1[6-9]|2[0-6])|I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV)$/);return m?x:''}
function groupLines(words){
  let arr=(words||[]).filter(w=>w.text&&w.bbox).map(w=>({text:w.text,x0:w.bbox.x0,x1:w.bbox.x1,y0:w.bbox.y0,y1:w.bbox.y1,cy:(w.bbox.y0+w.bbox.y1)/2,h:w.bbox.y1-w.bbox.y0}));
  arr.sort((a,b)=>a.cy-b.cy);let hs=arr.map(w=>w.h).sort((a,b)=>a-b), med=hs[Math.floor(hs.length/2)]||12, lines=[];
  for(const w of arr){let line=lines.find(l=>Math.abs(l.cy-w.cy)<Math.max(7,med*.75));if(!line){line={cy:w.cy,words:[]};lines.push(line)}line.words.push(w);line.cy=line.words.reduce((s,z)=>s+z.cy,0)/line.words.length}
  return lines.map(l=>{l.words.sort((a,b)=>a.x0-b.x0);l.text=l.words.map(w=>w.text).join(' ');l.x0=Math.min(...l.words.map(w=>w.x0));l.x1=Math.max(...l.words.map(w=>w.x1));l.y0=Math.min(...l.words.map(w=>w.y0));l.y1=Math.max(...l.words.map(w=>w.y1));return l}).sort((a,b)=>a.cy-b.cy)
}
function findEmployeeLine(lines,name){
  let target=normWord(name), best=null;
  for(const l of lines){for(const w of l.words){let n=normWord(w.text);if(!n)continue;let dist=editDistance(n,target), score=dist/Math.max(n.length,target.length);if(!best||score<best.score)best={line:l,word:w,score}}}
  return best&&best.score<=0.45?best:null
}
function inferGrid(words,employeeX,imageWidth,expected){
  let dayWords=(words||[]).filter(w=>w.bbox&&/^(?:[1-9]|[12]\d|3[01])$/.test((w.text||'').trim())&&w.bbox.x0>employeeX);
  let by={};for(const w of dayWords){let n=+w.text.trim();(by[n]??=[]).push((w.bbox.x0+w.bbox.x1)/2)}
  let xs=[];for(let n=1;n<=expected;n++)if(by[n])xs.push([n,by[n].sort((a,b)=>a-b)[0]]);
  xs.sort((a,b)=>a[0]-b[0]);
  if(xs.length>=Math.min(12,expected/2)){let vals=xs.map(([n,x])=>({n,x}));let slopes=[];for(let i=1;i<vals.length;i++){let dn=vals[i].n-vals[i-1].n;if(dn>0)slopes.push((vals[i].x-vals[i-1].x)/dn)}slopes=slopes.filter(x=>x>2).sort((a,b)=>a-b);let step=slopes[Math.floor(slopes.length/2)]||((imageWidth-employeeX)/expected);let starts=vals.map(v=>v.x-(v.n-1)*step).sort((a,b)=>a-b);return{start:starts[Math.floor(starts.length/2)],step,source:'nagłówek dni'}}
  return{start:employeeX+Math.max(35,(imageWidth-employeeX)*.025),step:(imageWidth-employeeX-Math.max(35,(imageWidth-employeeX)*.025))/expected,source:'geometria tabeli'}
}
function tokensForEmployee(words,line,employeeWord,grid,expected){
  let bandTop=line.y0-Math.max(4,(line.y1-line.y0)*.35),bandBottom=line.y1+Math.max(5,(line.y1-line.y0)*.55);
  let row=(words||[]).filter(w=>w.bbox&&w.bbox.y1>=bandTop&&w.bbox.y0<=bandBottom&&w.bbox.x0>employeeWord.x1+5);
  let cells=Array.from({length:expected},()=>[]);
  for(const w of row){let cx=(w.bbox.x0+w.bbox.x1)/2, idx=Math.round((cx-grid.start)/grid.step);if(idx>=0&&idx<expected)cells[idx].push(w)}
  return cells.map(cell=>{cell.sort((a,b)=>a.bbox.x0-b.bbox.x0);let joined=cell.map(w=>w.text).join('').replace(/\s/g,'');let direct=validCode(joined);if(direct)return direct;for(const w of cell){let c=validCode(w.text);if(c)return c}return''})
}
async function runOCR(){
  if(!selectedPhoto)return;
  const btn=document.querySelector('#ocrBtn'),status=document.querySelector('#ocrStatus');btn.disabled=true;
  status.innerHTML=`<div class='result'><b>Analizuję zdjęcie i szukam wiersza pracownika…</b><div class='progress'><i id='ocrBar'></i></div><span id='ocrPct'>0%</span></div>`;
  try{
    const result=await Tesseract.recognize(selectedPhoto,'pol+eng',{logger:m=>{if(m.status==='recognizing text'){let pct=Math.round((m.progress||0)*100),b=document.querySelector('#ocrBar'),t=document.querySelector('#ocrPct');if(b)b.style.width=pct+'%';if(t)t.textContent=pct+'%'}}});
    let data=result.data||{}, words=data.words||[], text=data.text||'', expected=daysInMonth(document.querySelector('#month').value), employee=document.querySelector('#employee').value||'BRZÓSKA';
    document.querySelector('#ocrRaw').textContent=text;
    if(!words.length)throw new Error('OCR zwrócił tekst, ale bez położeń wyrazów. Spróbuj ponownie lub użyj wyraźniejszego zdjęcia.');
    let lines=groupLines(words), found=findEmployeeLine(lines,employee);
    if(!found)throw new Error(`Nie znalazłem pewnie nazwiska „${employee}”. Wpisz nazwisko dokładnie tak, jak jest na grafiku i spróbuj ponownie.`);
    let img=document.querySelector('#preview'), imageWidth=data.imageSize?.width||img.naturalWidth||2000;
    let grid=inferGrid(words,found.word.x1,imageWidth,expected), entries=tokensForEmployee(words,found.line,found.word,grid,expected);
    let recognized=entries.filter(Boolean).length;
    document.querySelector('#rowInput').value=entries.map(x=>x||'-').join(', ');
    render(entries);
    status.innerHTML=`<div class='result'><b>Znalazłem wiersz ${employee}.</b><br>Odczytano ${recognized} z ${expected} dni. Puste komórki traktuję jako wolne. Siatka: ${grid.source}. <b>Sprawdź miesiąc poniżej</b> i popraw tylko ewentualne błędy.</div>`;
  }catch(err){status.innerHTML=`<div class='result warn'><b>Nie udało się pewnie wydzielić wiersza.</b><br>${String(err.message||err)}<br>Możesz nadal wpisać/poprawić dni ręcznie.</div>`}
  finally{btn.disabled=false}
}
document.querySelector('#ocrBtn').onclick=runOCR;
let keys=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','S16',...Array.from({length:10},(_,i)=>'S'+(17+i))];document.querySelector('#rules').innerHTML=`<div class='rule head'><span>Kod</span><span>1 zm.</span><span>2 zm.</span><span>3 zm.</span></div>`+keys.map(k=>{let r=variants[k];let t=(a,b)=>a?`${a}–${b}`:'brak';return `<div class='rule'><b>${k}</b><span>${t(r[0],r[1])}</span><span>${t(r[2],r[3])}</span><span>${t(r[4],r[5])}</span></div>`}).join('');
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;document.querySelector('#install').hidden=false});document.querySelector('#install').onclick=async()=>{if(deferred){deferred.prompt();deferred=null}};
let saved=localStorage.getItem('lastSchedule');if(saved){try{let s=JSON.parse(saved);document.querySelector('#employee').value=s.employee||'';document.querySelector('#month').value=s.month||'2026-08';document.querySelector('#rowInput').value=(s.entries||[]).map(x=>x||'-').join(', ');render(s.entries||[])}catch(e){}}
