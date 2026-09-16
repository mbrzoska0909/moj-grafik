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


let selectedPhoto=null, imageEl=null, lastCells=[];
const $=s=>document.querySelector(s);
const mode=()=>document.querySelector('input[name="mode"]:checked').value;
function monthName(m){return ['','styczeń','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpień','wrzesień','październik','listopad','grudzień'][m]||''}
function parseEntry(raw){const p=parse(raw);return {raw:p.raw==='—'?'':p.raw,ok:!!p.valid,time:p.allDay?'cały dzień':p.start?`${p.start}–${p.end}${p.overnight?' (+1 dzień)':''}`:(p.label||''),error:p.label||'Nieznany wpis'}}

async function loadPhoto(input){
 const f=input.files?.[0]; if(!f)return;
 selectedPhoto=f; $('#photoInfo').textContent='Wczytuję zdjęcie…'; $('#ocrBtn').disabled=true; $('#ocrRaw').textContent=''; $('#ocrStatus').innerHTML=''; $('#schedule').innerHTML=''; $('#summary').innerHTML=''; $('#scheduleTitle').textContent='Jeszcze nie odczytano grafiku'; lastCells=[];
 const img=$('#preview'), u=URL.createObjectURL(f);
 await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src=u;img.hidden=false});
 imageEl=img; $('#photoInfo').textContent=`Gotowe • ${(f.size/1048576).toFixed(1)} MB • ${img.naturalWidth}×${img.naturalHeight}`;
 $('#ocrBtn').disabled=false; $('#cropWrap').hidden=mode()!=='collective'; drawRowPreview();
 input.value='';
}
['#cameraPhoto','#libraryPhoto'].forEach(id=>$(id).addEventListener('change',e=>loadPhoto(e.currentTarget).catch(err=>$('#photoInfo').textContent='Błąd obrazu: '+err)));

function ranges(){
 let t=+$('#topRange').value,b=+$('#bottomRange').value,l=+$('#leftRange').value,r=+$('#rightRange').value;
 if(b<=t+2){b=t+3;$('#bottomRange').value=b}
 if(r<=l+20){r=Math.min(100,l+20);$('#rightRange').value=r}
 $('#topVal').textContent=t+'%';$('#bottomVal').textContent=b+'%';
 $('#leftVal').textContent=l+'%';$('#rightVal').textContent=r+'%';
 return [t/100,b/100,l/100,r/100];
}
function drawRowPreview(){
 if(!imageEl)return; const c=$('#cropCanvas'),ctx=c.getContext('2d'),scale=Math.min(1,1200/imageEl.naturalWidth);
 c.width=Math.round(imageEl.naturalWidth*scale);c.height=Math.round(imageEl.naturalHeight*scale);ctx.drawImage(imageEl,0,0,c.width,c.height);
 if(mode()==='collective'){
   let[t,b,l,r]=ranges(),y1=t*c.height,y2=b*c.height,x1=l*c.width,x2=r*c.width;
   ctx.fillStyle='rgba(255,255,255,.66)';ctx.fillRect(0,0,c.width,y1);ctx.fillRect(0,y2,c.width,c.height-y2);
   ctx.strokeStyle='#16a34a';ctx.lineWidth=4;ctx.strokeRect(x1,y1,x2-x1,y2-y1);
   ctx.strokeStyle='#2563eb';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x1,0);ctx.lineTo(x1,c.height);ctx.moveTo(x2,0);ctx.lineTo(x2,c.height);ctx.stroke();
   let n=daysInMonth($('#month').value),step=(x2-x1)/n;ctx.strokeStyle='rgba(37,99,235,.25)';ctx.lineWidth=1;
   for(let i=1;i<n;i++){let x=x1+i*step;ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.stroke()}
 }
}
$('#topRange').oninput=drawRowPreview;$('#bottomRange').oninput=drawRowPreview;$('#leftRange').oninput=drawRowPreview;$('#rightRange').oninput=drawRowPreview;$('#month').onchange=drawRowPreview;
document.querySelectorAll('input[name="mode"]').forEach(r=>r.onchange=()=>{let col=mode()==='collective';$('#privacyCard').style.display=col?'block':'none';$('#cropWrap').hidden=!col||!imageEl;drawRowPreview()});

function norm(s){return (s||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[|\\]/g,'/').replace(/\s/g,'')}
function cleanCode(s){
 s=norm(s).replace(/[.,:;]/g,'').replace(/^U[VW]$/,'UW').replace(/^[Il]$/,'1');
 if(['1','2','3','UW','BO','BHP'].includes(s))return s;
 let m=s.match(/^([123])\/(.+)$/);if(!m)return '';
 let suf=m[2].replace(/1/g,'I').replace(/0/g,'O');
 const romans=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'];
 if(romans.includes(suf))return m[1]+'/'+suf;
 let sm=suf.match(/^S(?:I|1)?([6-9])$/);if(sm)return m[1]+'/S1'+sm[1];
 sm=suf.match(/^S2([0-6])$/);if(sm)return m[1]+'/S2'+sm[1];
 return '';
}
function canvasCrop(x0,y0,x1,y1,boost=4){
 const c=document.createElement('canvas'),w=Math.max(1,x1-x0),h=Math.max(1,y1-y0);c.width=Math.round(w*boost);c.height=Math.round(h*boost);
 const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.drawImage(imageEl,x0,y0,w,h,0,0,c.width,c.height);
 // grayscale + strong contrast
 let im=ctx.getImageData(0,0,c.width,c.height),d=im.data;
 for(let i=0;i<d.length;i+=4){let g=.299*d[i]+.587*d[i+1]+.114*d[i+2];g=g<185?Math.max(0,(g-80)*1.65):255;d[i]=d[i+1]=d[i+2]=g}
 ctx.putImageData(im,0,0);return c;
}
async function ocrCanvas(c,whitelist){
 let r=await Tesseract.recognize(c,'eng',{tessedit_char_whitelist:whitelist||'123UWBHPSIVX/0123456789'});
 return (r.data.text||'').trim();
}
async function findHeader(){
 // OCR only top ~45%; use word geometry to locate row containing most day numbers.
 let c=canvasCrop(0,0,imageEl.naturalWidth,Math.round(imageEl.naturalHeight*.48),2);
 let r=await Tesseract.recognize(c,'eng'), words=r.data.words||[];
 let pts=words.filter(w=>/^(?:[1-9]|[12]\d|3[01])$/.test((w.text||'').trim())).map(w=>({n:+w.text,x:(w.bbox.x0+w.bbox.x1)/4,y:(w.bbox.y0+w.bbox.y1)/4}));
 let bins=[];for(const p of pts){let b=bins.find(z=>Math.abs(z.y-p.y)<12);if(!b){b={y:p.y,a:[]};bins.push(b)}b.a.push(p)}
 bins.sort((a,b)=>b.a.length-a.a.length);let a=bins[0]?.a||[];if(a.length<12)throw Error('Nie znalazłem pewnie wiersza z numerami dni.');
 a.sort((x,y)=>x.n-y.n);let slopes=[];for(let i=1;i<a.length;i++){let dn=a[i].n-a[i-1].n;if(dn>0)slopes.push((a[i].x-a[i-1].x)/dn)}
 slopes.sort((x,y)=>x-y);let step=slopes[Math.floor(slopes.length/2)];let starts=a.map(p=>p.x-(p.n-1)*step).sort((x,y)=>x-y);return{start:starts[Math.floor(starts.length/2)],step}
}
async function collectiveOCR(){
 let n=daysInMonth($('#month').value),[t,b,l,r]=ranges();
 let y0=Math.round(t*imageEl.naturalHeight),y1=Math.round(b*imageEl.naturalHeight);
 let xStart=Math.round(l*imageEl.naturalWidth),xEnd=Math.round(r*imageEl.naturalWidth),step=(xEnd-xStart)/n;
 if(step<8)throw Error('Zakres dni jest zbyt wąski.');
 lastCells=[];let out=[];
 for(let i=0;i<n;i++){
   // Small inset avoids vertical grid lines dominating OCR.
   let x0=Math.round(xStart+i*step+step*.06),x1=Math.round(xStart+(i+1)*step-step*.06);
   let c=canvasCrop(x0,y0,x1,y1,6);lastCells.push(c.toDataURL('image/jpeg',.9));
   let d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,dark=0,total=0;
   // Ignore a border around each cell when deciding whether it is empty.
   let cw=c.width,ch=c.height,ctx=c.getContext('2d'),im=ctx.getImageData(0,0,cw,ch).data;
   for(let yy=Math.floor(ch*.18);yy<ch*.82;yy+=2)for(let xx=Math.floor(cw*.12);xx<cw*.88;xx+=2){
     let k=(yy*cw+xx)*4;total++;if(im[k]<105)dark++;
   }
   let ratio=total?dark/total:0;
   if(ratio<.008){out.push('wolne');$('#ocrPct').textContent=`${i+1}/${n}`;continue}
   let txt=await ocrCanvas(c),code=cleanCode(txt);out.push(code||'?');
   $('#ocrPct').textContent=`${i+1}/${n}`;
 }
 return out;
}
function render(a){
 let [y,m]=$('#month').value.split('-').map(Number),bad=a.filter(x=>x==='?').length;
 $('#scheduleTitle').textContent=`${$('#employee').value} • ${monthName(m)} ${y}`;
 $('#summary').innerHTML=`<div class="summary"><b>${a.length} dni</b> • do sprawdzenia: <b>${bad}</b></div>`;
 $('#schedule').innerHTML=a.map((x,i)=>{
   let p=x==='wolne'?{ok:true,time:'cały dzień'}:x==='?'?{ok:false,time:'niepewny odczyt'}:parseEntry(x);
   let pic=lastCells[i]?`<img class="cellshot" src="${lastCells[i]}" alt="komórka ${i+1}">`:'';
   return `<div class="day ${p.ok?'':'bad'}"><span>${String(i+1).padStart(2,'0')}.${String(m).padStart(2,'0')}</span>${pic}<input value="${x}"><span>${p.time||p.error}</span><b>${p.ok?'✓':'!'}</b></div>`
 }).join('');
}
async function run(){
 if(!imageEl)return;$('#ocrBtn').disabled=true;$('#ocrStatus').innerHTML='<div class="result"><b>Analizuję…</b> <span id="ocrPct"></span></div>';
 try{
  if(mode()==='collective'){
   let a=await collectiveOCR();render(a);$('#ocrStatus').innerHTML='<div class="result"><b>Gotowe.</b> Tabela została podzielona według ustawionych granic, a każdy dzień przeanalizowany osobno. „?” oznacza, że aplikacja nie zgaduje.</div>';
  }else{
   // retain simple full-image individual recognition, conservative.
   let r=await Tesseract.recognize(selectedPhoto,'pol+eng'),text=r.data.text||'';$('#ocrRaw').textContent=text;
   let mo=text.match(/(?:miesiąc|miesiac)\D{0,12}(0?[1-9]|1[0-2])\s*[\/.-]\s*(20\d{2})/i);if(mo)$('#month').value=`${mo[2]}-${String(+mo[1]).padStart(2,'0')}`;
   let n=daysInMonth($('#month').value), lines=text.split(/\n/), all=text.match(/\b(?:[01]?\d|2[0-3])[:.]\d{2}\b/g)||[];
   $('#ocrStatus').innerHTML='<div class="result">Tryb indywidualny pozostaje w wersji testowej. Najważniejsza zmiana v0.7 dotyczy grafiku zbiorczego.</div>';
   $('#scheduleTitle').textContent=`${$('#employee').value} • ${$('#month').value}`;$('#summary').innerHTML=`<div class="summary">Rozpoznano ${all.length} zapisów godzinowych. Użyj diagnostyki OCR do kontroli.</div>`;
  }
 }catch(e){$('#ocrStatus').innerHTML=`<div class="result warn"><b>Nie udało się odczytać:</b> ${e.message}</div>`}finally{$('#ocrBtn').disabled=false}
}
$('#ocrBtn').onclick=run;
$('#autoRow').onclick=()=>{$('#ocrStatus').innerHTML='<div class="result">W v0.7 ustaw wiersz ręcznie suwakami — to jest pewniejsze niż automatyczne zgadywanie nazwiska.</div>'};

$('#loadSample').onclick=()=>{let a=['UW','UW','UW','3','3','3/I','wolne','1','3','3','3','wolne','wolne','wolne','2','2/VI','2/IX','3','3','3','wolne','wolne','wolne','1','2/VIII','3','wolne','wolne','1','1','2/S16'];$('#month').value='2026-08';render(a)};
$('#analyzeRow').onclick=()=>{let n=daysInMonth($('#month').value),a=$('#rowInput').value.split(/[,;\n]+/).map(x=>x.trim());if(a.length!==n){$('#rowError').innerHTML=`<div class="result warn">Miesiąc ma ${n} dni, podano ${a.length}.</div>`;return}render(a)};
$('#rules').innerHTML='<p>I–XI: 1=06–14, 2=14–22, 3=22–06. XII–XIV: bez 3. XV: 1=05–13, 2=13–21. S16: 1=05–13, 2=14–22. S17–S26: 1=05–13, 2=13–21.</p>';
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
setTimeout(()=>{let d=$('#appDiag');if(d)d.textContent='Moduł zdjęć: gotowy ✓ • ręczna geometria + OCR komórek';},0);
