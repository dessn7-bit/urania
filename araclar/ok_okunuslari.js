/* Derslerdeki ve sınavlardaki bütün "→" geçen cümleleri okunuşlarıyla testler/veri/ok_okunuslari.json'a yazar (v44).
   Okunuş kuralı değişince yeniden üretilir ve fark gözden geçirilir: node araclar/ok_okunuslari.js */
const path=require('path');const K=path.join(__dirname,'..');
const O=require(path.join(K,'okunus.js'));const fs=require('fs');
const kaynaklar=['veri/dersler.json','veri/sinavlar.json'];
const rows=[];let tum=0;
function cumleler(x){const o=[];let d=0,b=0;for(let i=0;i<x.length;i++){const c=x[i];if(c==='(')d++;else if(c===')')d=Math.max(0,d-1);else if(!d&&/[.;!?]/.test(c)&&/\s/.test(x[i+1]||'')){o.push(x.slice(b,i+1));b=i+2;}}o.push(x.slice(b));return o.map(s=>s.trim()).filter(Boolean);}const gor=new Set();
for(const f of kaynaklar){const d=JSON.parse(fs.readFileSync(path.join(K,f)));
(function walk(x,p){ if(typeof x==='string'){ if(x.includes('→')){ tum+=(x.match(/→/g)||[]).length; for(const s of cumleler(x)) if(s.includes('→')&&!gor.has(s)){gor.add(s);rows.push({yer:f+p,metin:s,okunus:O.okunus(s)});} } } else if(Array.isArray(x)) x.forEach((v,i)=>walk(v,p+'['+i+']')); else if(x&&typeof x==='object') for(const k in x) walk(x[k],p+'.'+k); })(d,'');}
const say=rows.reduce((a,r)=>a+(r.metin.match(/→/g)||[]).length,0);
const kat={};for(const r of rows){for(const k of ['hidrojenden','birleşerek','oluşur',' ise ','ardından','bu yüzden','yani',"'den","'ten","'dan","'tan"]) if(r.okunus.includes(k)) kat[k]=(kat[k]||0)+1;}
console.log('cumle',rows.length,'ok',say,kat, 'kalan ok', rows.filter(r=>r.okunus.includes('→')).length);
fs.writeFileSync(process.argv[2]||path.join(K,'testler/veri/ok_okunuslari.json'),JSON.stringify({aciklama:'Derslerdeki ve sınavlardaki bütün "→" geçen cümleler ve sesli okunuşları (okunus.js). Gözden geçirildi; test (okunus.spec.js) her satırı birebir karşılaştırır. Yeniden üretmek: node araclar/ok_okunuslari.js',ok_sayisi:tum,tekil_cumledeki_ok:say,cumleler:rows},null,1)+'\n');
