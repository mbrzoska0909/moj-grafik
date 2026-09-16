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
const legacyParseBtn=document.querySelector('#parseBtn');
if(legacyParseBtn) legacyParseBtn.onclick=()=>{const entry=document.querySelector('#entry'),out=document.querySelector('#parseResult');if(!entry||!out)return;let p=parse(entry.value);out.innerHTML=`<div class='result'><b>${p.raw}</b><br>${p.label}</div>`};



function monthName(m){return ['','styczeń','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpień','wrzesień','październik','listopad','grudzień'][m]||''}
function parseEntry(raw){const p=parse(raw);return {raw:p.raw==='—'?'':p.raw,ok:!!p.valid,time:p.allDay?'cały dzień':p.start?`${p.start}–${p.end}${p.overnight?' (+1 dzień)':''}`:(p.label||''),error:p.label||'Nieznany wpis'}}

let selectedPhoto=null, imageBitmap=null;
const $=s=>document.querySelector(s);
const mode=()=>document.querySelector('input[name="mode"]:checked').value;

let photoBusy=false;
async function handleChosenFile(input){
 if(photoBusy)return;
 const f=input.files && input.files[0];
 if(!f){return}
 photoBusy=true; selectedPhoto=f;
 const img=$('#preview');
 $('#photoInfo').textContent=`Wczytuję zdjęcie (${(f.size/1024/1024).toFixed(1)} MB)…`;
 $('#ocrStatus').innerHTML=`<div class="result">📷 Plik został wybrany. Przygotowuję podgląd…</div>`;
 $('#ocrBtn').disabled=true; $('#cropWrap').hidden=true;
 try{
   let loaded=false;
   // First choice for modern iOS Safari.
   if('createImageBitmap' in window){
     try{
       const bmp=await createImageBitmap(f);
       const c=document.createElement('canvas');
       c.width=bmp.width;c.height=bmp.height;
       c.getContext('2d').drawImage(bmp,0,0);
       img.src=c.toDataURL('image/jpeg',0.92);
       if(bmp.close)bmp.close();
       loaded=true;
     }catch(_){}
   }
   // Fallback: object URL. Keep it alive; revoking early can break iOS PWA.
   if(!loaded){
     const u=URL.createObjectURL(f);
     img.src=u; img.dataset.url=u;
   }
   await new Promise((resolve,reject)=>{
     if(img.complete && img.naturalWidth){resolve();return}
     const timer=setTimeout(()=>reject(new Error('Przekroczono czas dekodowania obrazu.')),12000);
     img.onload=()=>{clearTimeout(timer);resolve()};
     img.onerror=()=>{clearTimeout(timer);reject(new Error('Safari nie może wyświetlić tego obrazu.'))};
   });
   img.hidden=false; imageBitmap=img; $('#cropWrap').hidden=false; drawMask();
   $('#photoInfo').textContent=`Gotowe • ${(f.size/1024/1024).toFixed(1)} MB • ${img.naturalWidth}×${img.naturalHeight}`;
   $('#ocrStatus').innerHTML=`<div class="result"><b>✓ Zdjęcie wczytane.</b> Ustaw swój wiersz i naciśnij „Odczytaj grafik”.</div>`;
   $('#ocrBtn').disabled=false;
 }catch(err){
   $('#photoInfo').textContent='Nie udało się przygotować podglądu.';
   $('#ocrStatus').innerHTML=`<div class="result warn"><b>Błąd obrazu:</b> ${err.message||err}</div>`;
 }finally{
   photoBusy=false;
 }
}
function bindPhotoInput(id){
 const el=$(id);
 // Both events are intentional: iOS versions differ in which is most reliable after picker.
 el.addEventListener('change',()=>handleChosenFile(el));
 el.addEventListener('input',()=>handleChosenFile(el));
}
bindPhotoInput('#cameraPhoto');bindPhotoInput('#libraryPhoto');

function clampRanges(){
 let a=+$ ('#topRange').value,b=+$ ('#bottomRange').value;
 if(b<a+3){b=Math.min(100,a+3);$('#bottomRange').value=b}
 $('#topVal').textContent=a+'%';$('#bottomVal').textContent=b+'%';
 return [a/100,b/100];
}
function drawMask(){
 if(!imageBitmap)return; let c=$('#cropCanvas'),ctx=c.getContext('2d'), max=1000;
 let s=Math.min(1,max/imageBitmap.naturalWidth);c.width=Math.round(imageBitmap.naturalWidth*s);c.height=Math.round(imageBitmap.naturalHeight*s);
 ctx.drawImage(imageBitmap,0,0,c.width,c.height);
 if(mode()==='collective'){
  let [t,b]=clampRanges(), y1=t*c.height,y2=b*c.height;
  ctx.fillStyle='rgba(255,255,255,.82)';ctx.fillRect(0,Math.min(c.height*.13,y1),c.width,Math.max(0,y1-Math.min(c.height*.13,y1)));
  ctx.fillRect(0,y2,c.width,c.height-y2);
  ctx.strokeStyle='#16a34a';ctx.lineWidth=4;ctx.strokeRect(2,y1,c.width-4,y2-y1);
 }
}
$('#topRange').oninput=drawMask;$('#bottomRange').oninput=drawMask;
document.querySelectorAll('input[name="mode"]').forEach(x=>x.onchange=()=>{ $('#privacyCard').style.display=mode()==='collective'?'block':'none'; drawMask();});

function norm(s){return (s||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/g,'')}
function rows(words){let a=(words||[]).filter(w=>w.text&&w.bbox).map(w=>({...w,cy:(w.bbox.y0+w.bbox.y1)/2,h:w.bbox.y1-w.bbox.y0}));a.sort((x,y)=>x.cy-y.cy);let hs=a.map(x=>x.h).sort((x,y)=>x-y),med=hs[Math.floor(hs.length/2)]||10,R=[];for(const w of a){let r=R.find(q=>Math.abs(q.cy-w.cy)<Math.max(5,med*.7));if(!r){r={cy:w.cy,words:[]};R.push(r)}r.words.push(w);r.cy=r.words.reduce((s,z)=>s+z.cy,0)/r.words.length}return R}
async function autoFindRow(){
 if(!selectedPhoto)return;$('#ocrStatus').innerHTML='<div class="result">Szukam nazwiska na zdjęciu…</div>';
 try{
  let r=await Tesseract.recognize(selectedPhoto,'pol+eng'), W=r.data.words||[], target=norm($('#employee').value||'BRZÓSKA');
  let hit=W.find(w=>norm(w.text)===target)||W.find(w=>norm(w.text).includes(target.slice(0,5)));
  if(!hit)throw Error('Nie znalazłem nazwiska. Ustaw suwaki ręcznie.');
  let h=r.data.imageSize?.height||imageBitmap.naturalHeight, cy=(hit.bbox.y0+hit.bbox.y1)/2, rh=Math.max(18,(hit.bbox.y1-hit.bbox.y0)*2.2);
  $('#topRange').value=Math.max(0,Math.round((cy-rh/2)/h*100));$('#bottomRange').value=Math.min(100,Math.round((cy+rh/2)/h*100));drawMask();
  $('#ocrStatus').innerHTML='<div class="result"><b>Znalazłem nazwisko.</b> Sprawdź zielony pas i w razie potrzeby popraw suwaki.</div>';
 }catch(e){$('#ocrStatus').innerHTML=`<div class="result warn">${e.message}</div>`}
}
$('#autoRow').onclick=autoFindRow;

function valid(raw){let x=(raw||'').toUpperCase().replace(/\s/g,'').replace(/[|\\]/g,'/').replace(/^U[VW]$/,'UW');if(['UW','BO','BHP','1','2','3'].includes(x))return x;return /^([123])\/(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|S(?:1[6-9]|2[0-6]))$/.test(x)?x:''}
function inferGrid(words,n){
 let cand=(words||[]).filter(w=>w.bbox&&/^(?:[1-9]|[12]\d|3[01])$/.test((w.text||'').trim()));
 let R=rows(cand),best=null;for(const r of R){let v=r.words.map(w=>({n:+w.text,x:(w.bbox.x0+w.bbox.x1)/2})).filter(z=>z.n>=1&&z.n<=n);let d=new Set(v.map(z=>z.n)).size;if(!best||d>best.d)best={v,d,y:r.cy}}
 if(!best||best.d<10)return null;best.v.sort((a,b)=>a.n-b.n);let ss=[];for(let i=1;i<best.v.length;i++){let dn=best.v[i].n-best.v[i-1].n,s=(best.v[i].x-best.v[i-1].x)/dn;if(dn>0&&s>2)ss.push(s)}ss.sort((a,b)=>a-b);let step=ss[Math.floor(ss.length/2)];if(!step)return null;let st=best.v.map(v=>v.x-(v.n-1)*step).sort((a,b)=>a-b);return{start:st[Math.floor(st.length/2)],step,y:best.y}
}
function collectiveEntries(words,grid,n,ih){
 let [t,b]=clampRanges(), y1=t*ih,y2=b*ih,c=Array.from({length:n},()=>[]);
 for(const w of words||[]){if(!w.bbox)continue;let cy=(w.bbox.y0+w.bbox.y1)/2;if(cy<y1||cy>y2)continue;let cx=(w.bbox.x0+w.bbox.x1)/2,i=Math.round((cx-grid.start)/grid.step);if(i>=0&&i<n)c[i].push(w)}
 return c.map(a=>{a.sort((x,y)=>x.bbox.x0-y.bbox.x0);let s=a.map(w=>w.text).join('').replace(/\s/g,'');let v=valid(s);if(v)return v;for(const w of a){v=valid(w.text);if(v)return v}return '-'})
}
function renderEntries(a){
 let [y,m]=$('#month').value.split('-').map(Number),name=$('#employee').value||'Pracownik', rr=a.map((x,i)=>({day:i+1,...parseEntry(x)})),bad=rr.filter(x=>!x.ok).length;
 $('#scheduleTitle').textContent=`${name} • ${monthName(m)} ${y}`;$('#summary').innerHTML=`<div class="summary"><b>${a.length} dni</b> • poprawne: ${a.length-bad} • do sprawdzenia: <b>${bad}</b></div>`;
 $('#schedule').innerHTML=rr.map(r=>`<div class="day ${r.ok?'':'bad'}"><span>${String(r.day).padStart(2,'0')}.${String(m).padStart(2,'0')}</span><input value="${r.raw||'wolne'}"><span>${r.ok?r.time:r.error}</span><b>${r.ok?'✓':'!'}</b></div>`).join('');
}
function parseMonth(text){let m=(text||'').match(/(?:miesiąc|miesiac)\D{0,12}(0?[1-9]|1[0-2])\s*[\/.-]\s*(20\d{2})/i);return m?`${m[2]}-${String(+m[1]).padStart(2,'0')}`:null}

async function runOCR(){
 if(!selectedPhoto)return;let btn=$('#ocrBtn');btn.disabled=true;$('#ocrStatus').innerHTML='<div class="result"><b>Analizuję grafik…</b><div class="progress"><i id="ocrBar"></i></div><span id="ocrPct">0%</span></div>';
 try{
  let r=await Tesseract.recognize(selectedPhoto,'pol+eng',{logger:m=>{if(m.status==='recognizing text'){let p=Math.round(m.progress*100);if($('#ocrBar'))$('#ocrBar').style.width=p+'%';if($('#ocrPct'))$('#ocrPct').textContent=p+'%'}}}),d=r.data||{},text=d.text||'',W=d.words||[];
  $('#ocrRaw').textContent=text;let mo=parseMonth(text);if(mo)$('#month').value=mo;let n=daysInMonth($('#month').value),grid=inferGrid(W,n);if(!grid)throw Error('Nie udało się pewnie znaleźć nagłówka dni.');
  if(mode()==='collective'){
    let ih=d.imageSize?.height||imageBitmap.naturalHeight,a=collectiveEntries(W,grid,n,ih);$('#rowInput').value=a.join(', ');renderEntries(a);
    let known=a.filter(x=>x!=='-').length;$('#ocrStatus').innerHTML=`<div class="result"><b>Tryb zbiorczy:</b> odczytano ${known} wpisów z zaznaczonego wiersza. <b>Sprawdź każdy dzień</b> — puste komórki są traktowane jako wolne.</div>`;
  }else{
    // For individual format, use OCR text/time geometry conservatively; flag ambiguity rather than inventing details.
    let cells=Array.from({length:n},()=>[]);for(const w of W){if(!w.bbox)continue;let cy=(w.bbox.y0+w.bbox.y1)/2;if(cy<=grid.y)continue;let i=Math.round((((w.bbox.x0+w.bbox.x1)/2)-grid.start)/grid.step);if(i>=0&&i<n)cells[i].push((w.text||'').trim())}
    let a=cells.map(c=>{let s=c.join(' '),ts=[...s.matchAll(/\b(\d{1,2})[:.](\d{2})\b/g)].map(x=>`${x[1].padStart(2,'0')}:${x[2]}`);return ts.length>=2?`${ts[0]}–${ts[1]}`:(/\b0h\b/i.test(s)?'wolne':'?')});
    let [y,m]=$('#month').value.split('-').map(Number);$('#scheduleTitle').textContent=`${$('#employee').value} • ${monthName(m)} ${y}`;let bad=a.filter(x=>x==='?').length;$('#summary').innerHTML=`<div class="summary"><b>${n} dni</b> • do sprawdzenia: <b>${bad}</b></div>`;$('#schedule').innerHTML=a.map((x,i)=>`<div class="day ${x==='?'?'bad':''}"><span>${String(i+1).padStart(2,'0')}.${String(m).padStart(2,'0')}</span><input value="${x}"><span>${x==='?'?'niepewny odczyt':x==='wolne'?'cały dzień':x}</span><b>${x==='?'?'!':'✓'}</b></div>`).join('');
    $('#ocrStatus').innerHTML='<div class="result"><b>Tryb indywidualny:</b> odczytano godziny z harmonogramu. Ten format nie zawiera oznaczeń drużyn, więc aplikacja ich nie dopisuje.</div>';
  }
 }catch(e){$('#ocrStatus').innerHTML=`<div class="result warn"><b>OCR nie jest pewny wyniku.</b><br>${e.message}</div>`}finally{btn.disabled=false}
}
$('#ocrBtn').onclick=runOCR;


function buildRules(){
 let h='<table><tr><th>Kod</th><th>1 zm.</th><th>2 zm.</th><th>3 zm.</th></tr>';
 for(const k of Object.keys(variants)){
   const r=variants[k], cell=(a,b)=>a&&b?`${a}–${b}`:'brak';
   h+=`<tr><td>${k}</td><td>${cell(r[0],r[1])}</td><td>${cell(r[2],r[3])}</td><td>${cell(r[4],r[5])}</td></tr>`;
 }
 $('#rules').innerHTML=h+'</table>';
}
buildRules();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
setTimeout(()=>{const d=document.querySelector('#appDiag');if(d)d.textContent='Moduł zdjęć: gotowy ✓';},0);
