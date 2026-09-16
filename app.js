const $=s=>document.querySelector(s);let photo=null;
async function chosen(input){
 const f=input.files&&input.files[0];if(!f)return;photo=f;$('#photo').textContent='Wczytuję…';
 const u=URL.createObjectURL(f),im=$('#preview');
 await new Promise((ok,no)=>{im.onload=ok;im.onerror=no;im.src=u});im.hidden=false;
 $('#photo').textContent=`Gotowe • ${(f.size/1048576).toFixed(1)} MB • ${im.naturalWidth}×${im.naturalHeight}`;$('#ocr').disabled=false;input.value='';
}
$('#cam').onchange=e=>chosen(e.currentTarget);$('#file').onchange=e=>chosen(e.currentTarget);
$('#ocr').onclick=async()=>{
 if(!photo)return;$('#ocr').disabled=true;$('#status').innerHTML='<div class="msg">OCR: 0%</div>';
 try{
  const r=await Tesseract.recognize(photo,'pol+eng',{logger:m=>{if(m.status==='recognizing text')$('#status').innerHTML=`<div class="msg">OCR: ${Math.round(m.progress*100)}%</div>`}});
  const text=r.data.text||'';$('#raw').textContent=text;$('#result').value=text;
  $('#status').innerHTML='<div class="msg ok"><b>Gotowe.</b> To jest prosty pełnoobrazowy OCR, bez filtrowania i bez dzielenia tabeli.</div>';
 }catch(e){$('#status').innerHTML=`<div class="msg bad">Błąd OCR: ${e.message||e}</div>`}finally{$('#ocr').disabled=false}
};
function dim(){let [y,m]=$('#month').value.split('-').map(Number);return new Date(y,m,0).getDate()}
$('#build').onclick=()=>{
 let a=$('#manual').value.split(/[,;\n]+/).map(x=>x.trim()).filter(x=>x.length),n=dim();
 if(a.length!==n){$('#days').innerHTML=`<div class="msg bad">Miesiąc ma ${n} dni, a wpisów jest ${a.length}.</div>`;return}
 $('#days').innerHTML=a.map((x,i)=>`<div class="day"><b>${i+1}</b><input value="${x}"></div>`).join('');
};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
