const $=s=>document.querySelector(s);
const names=['niedz.','pon.','wt.','śr.','czw.','pt.','sob.']; let data={}, detailDay=null, history=[];
function snapshot(){history.push(JSON.stringify(data));if(history.length>50)history.shift()}
function undo(){if(!history.length)return;data=JSON.parse(history.pop());localStorage.setItem(key(),JSON.stringify(data));render()}
function key(){return 'grafik-'+$('#month').value}
function load(){try{data=JSON.parse(localStorage.getItem(key())||'{}')}catch{data={}};render()}
function save(){localStorage.setItem(key(),JSON.stringify(data));render()}
function nDays(){let[y,m]=$('#month').value.split('-').map(Number);return new Date(y,m,0).getDate()}
function setShift(d,s){snapshot();data[d]=data[d]||{}; if(data[d].shift===s){delete data[d]}else{data[d].shift=s;delete data[d].special}save()}
function copyBelow(d){
 const n=nDays(); if(d>=n)return;
 const cur=data[d];
 if(!cur || (!cur.shift && !cur.special))return;
 snapshot();
 data[d+1]=JSON.parse(JSON.stringify(cur));
 save();
}
function label(v){if(!v)return '—';if(v.special)return v.special;return (v.shift||'—')+(v.ann?'/'+v.ann:'')}
function render(){
 let[y,m]=$('#month').value.split('-').map(Number),n=nDays(),html='',filled=0,hours=0;
 for(let d=1;d<=n;d++){let v=data[d]||{},dow=names[new Date(y,m-1,d).getDay()];if(v.shift||v.special)filled++;if(['1','2','3'].includes(v.shift)||['BHP','BO'].includes(v.special))hours+=8;
 html+=`<div class="day ${dow==='sob.'||dow==='niedz.'?'weekend':''}">
 <div class="date"><b>${d}</b><small>${dow}</small><em>${label(v)}</em></div>
 <div class="choices">
 ${['1','2','3','W'].map(s=>`<button class="shift s${s} ${(s==='W'&&v.shift==='W')||v.shift===s?'on':''}" onclick="setShift(${d},'${s}')">${s}</button>`).join('')}
 <button class="more" onclick="openDetail(${d})">•••</button></div>
 ${d<n?`<button class="copy" onclick="copyBelow(${d})">↓ Kopiuj poniżej</button>`:''}</div>`}
 $('#days').innerHTML=html;$('#progress').textContent=`${filled}/${n} dni`;
 $('#summary').innerHTML=`<b>${hours} h pracy</b><span> • uzupełniono ${filled} z ${n} dni</span>`;let ub=$('#undo');if(ub)ub.disabled=!history.length;
}
window.setShift=setShift;window.copyBelow=copyBelow;window.undo=undo;
window.openDetail=d=>{detailDay=d;let v=data[d]||{};$('#detailTitle').textContent=`Dzień ${d}`;$('#ann').value=v.ann||'';$('#special').value=v.special||'';$('#detail').showModal()}
$('#saveDetail').onclick=e=>{e.preventDefault();snapshot();let v=data[detailDay]||{};v.ann=$('#ann').value;v.special=$('#special').value;if(v.special){delete v.shift;delete v.ann}data[detailDay]=v;$('#detail').close();save()}
$('#month').onchange=load;
$('#clear').onclick=()=>{if(confirm('Wyczyścić cały wybrany miesiąc?')){snapshot();data={};localStorage.removeItem(key());render()}}
function pad(x){return String(x).padStart(2,'0')}
function esc(s){return String(s).replace(/([,;\\])/g,'\\$1').replace(/\n/g,'\\n')}
function times(v){
 if(v.special==='UW'||v.shift==='W')return null;
 if(v.special==='BHP'||v.special==='BO')return ['060000','140000'];
 let a=v.ann||'',s=v.shift;
 if(a==='XV')return s==='1'?['050000','130000']:s==='2'?['130000','210000']:null;
 if(/^S(1[7-9]|2[0-6])$/.test(a))return s==='1'?['050000','130000']:s==='2'?['130000','210000']:null;
 if(a==='S16')return s==='1'?['050000','130000']:s==='2'?['140000','220000']:null;
 // M1/M2: zwykły układ trzech zmian.
 if(a==='M1'||a==='M2')return s==='1'?['060000','140000']:s==='2'?['140000','220000']:s==='3'?['220000','060000']:null;
 // M1*/M2*: dwie zmiany, obie o godzinę wcześniej; nocna niedozwolona.
 if(a==='M1*'||a==='M2*')return s==='1'?['050000','130000']:s==='2'?['130000','210000']:null;
 return s==='1'?['060000','140000']:s==='2'?['140000','220000']:s==='3'?['220000','060000']:null;
}
function groupOf(v){
 if(!v)return null;
 if(v.special==='UW'||v.shift==='W')return 'W';
 if(v.special==='BHP'||v.special==='BO')return '1';
 return ['1','2','3'].includes(v.shift)?v.shift:null;
}
function eventLines(y,m,d,v){
 let title=v.special||label(v);
 if(v.special==='UW'||v.shift==='W'){
   let ds=`${y}${pad(m)}${pad(d)}`,nd=new Date(y,m-1,d+1),de=`${nd.getFullYear()}${pad(nd.getMonth()+1)}${pad(nd.getDate())}`;
   return ['BEGIN:VEVENT',`DTSTART;VALUE=DATE:${ds}`,`DTEND;VALUE=DATE:${de}`,`SUMMARY:${esc(title==='W'?'WOLNE':title)}`,'END:VEVENT'];
 }
 let t=times(v);if(!t)return []; // e.g. 3/M1* or 3/M2* is invalid and not exported
 let start=new Date(y,m-1,d,...t[0].match(/../g).slice(0,2).map(Number)),end=new Date(y,m-1,d,...t[1].match(/../g).slice(0,2).map(Number));
 if(end<=start)end.setDate(end.getDate()+1);
 let fmt=x=>`${x.getFullYear()}${pad(x.getMonth()+1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
 return ['BEGIN:VEVENT',`DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,`SUMMARY:${esc(title)}`,'END:VEVENT'];
}
function makeICS(group=null){
 let[y,m]=$('#month').value.split('-').map(Number),out=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Moj Grafik//PL','CALSCALE:GREGORIAN'];
 for(let d=1;d<=nDays();d++){let v=data[d];if(!v)continue;if(group&&groupOf(v)!==group)continue;out.push(...eventLines(y,m,d,v))}
 out.push('END:VCALENDAR');return out.join('\r\n');
}
function downloadICS(content,name){
 let b=new Blob([content],{type:'text/calendar;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
window.downloadGroup=g=>{
 const names={1:'1-zmiana',2:'2-zmiana',3:'3-zmiana',W:'wolne'};
 downloadICS(makeICS(g),`grafik-${$('#month').value}-${names[g]}.ics`);
};
$('#ics').onclick=()=>downloadICS(makeICS(),`grafik-${$('#month').value}-wszystko.ics`);

load(); if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});