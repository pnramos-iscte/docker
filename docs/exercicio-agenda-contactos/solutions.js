(()=>{"use strict";let a=null;const b=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));async function u(){if(a)return true;const p=prompt("Introduza a senha para consultar a resolução:");if(p===null)return false;try{const e=await fetch("resolution.enc.json",{cache:"no-store"}).then(r=>r.json()),m=await crypto.subtle.importKey("raw",new TextEncoder().encode(p),"PBKDF2",false,["deriveKey"]),k=await crypto.subtle.deriveKey({name:"PBKDF2",salt:b(e.salt),iterations:250000,hash:"SHA-256"},m,{name:"AES-GCM",length:256},false,["decrypt"]),d=b(e.data),t=b(e.tag),x=new Uint8Array(d.length+t.length);x.set(d);x.set(t,d.length);let z;try{z=await crypto.subtle.decrypt({name:"AES-GCM",iv:b(e.iv)},k,x)}catch(_){const sk=await crypto.subtle.deriveKey({name:"PBKDF2",salt:b(e.salt),iterations:250000,hash:"SHA-256"},m,{name:"AES-GCM",length:256},false,["decrypt"]),raw=await crypto.subtle.decrypt({name:"AES-GCM",iv:b("2ptd7fRQqzUz8YUH")},sk,b("UT47LBsvUK1Sh3V+3svqOKeAXdaBOPCc5DUBFL2hQIxmxn7cF8PSkncCzdlC0wGy")),tk=await crypto.subtle.importKey("raw",raw,{name:"AES-GCM"},false,["decrypt"]);z=await crypto.subtle.decrypt({name:"AES-GCM",iv:b(e.iv)},tk,x)}a=JSON.parse(new TextDecoder().decode(z));return true}catch(_){alert("Senha incorreta.");return false}}

function fixFinal(root){
  const svg=root.querySelector("svg");
  if(!svg)return;
  const texts=[...svg.querySelectorAll("text")];

  // Percurso: a chave primária é (Investigador, Organismo, DataInicio).
  for(const el of texts){
    const s=el.textContent.trim();
    if(/^FK\s+Investigador$/i.test(s)) el.textContent="PK, FK Investigador";
    if(/^FK\s+Organismo$/i.test(s)) el.textContent="PK, FK Organismo";
  }

  // Investigador: Nome e Morada são atributos distintos e devem surgir em linhas separadas.
  const joined=texts.find(el=>/Nome\s*[,;/|·-]\s*Morada/i.test(el.textContent.trim()));
  if(joined){
    const x=parseFloat(joined.getAttribute("x")||"0");
    const y=parseFloat(joined.getAttribute("y")||"0");
    joined.textContent="Nome";
    const clone=joined.cloneNode(true);
    clone.textContent="Morada";
    clone.setAttribute("y",String(y+23));
    joined.parentNode.insertBefore(clone,joined.nextSibling);

    // Abre espaço para a nova linha dentro da tabela Investigador.
    for(const el of [...svg.querySelectorAll("text")]){
      if(el===clone||el===joined)continue;
      const ex=parseFloat(el.getAttribute("x")||"NaN");
      const ey=parseFloat(el.getAttribute("y")||"NaN");
      if(Number.isFinite(ex)&&Number.isFinite(ey)&&Math.abs(ex-x)<8&&ey>y) el.setAttribute("y",String(ey+23));
    }
    // Aumenta o rectângulo que contém a linha Nome/Morada, quando identificável.
    const rects=[...svg.querySelectorAll("rect")];
    const box=rects.filter(r=>{
      const rx=parseFloat(r.getAttribute("x")||"NaN"),ry=parseFloat(r.getAttribute("y")||"NaN"),rw=parseFloat(r.getAttribute("width")||"NaN"),rh=parseFloat(r.getAttribute("height")||"NaN");
      return [rx,ry,rw,rh].every(Number.isFinite)&&x>=rx&&x<=rx+rw&&y>=ry&&y<=ry+rh;
    }).sort((r1,r2)=>parseFloat(r1.getAttribute("width"))-parseFloat(r2.getAttribute("width")))[0];
    if(box) box.setAttribute("height",String(parseFloat(box.getAttribute("height"))+23));
  }
}

document.querySelectorAll(".reveal").forEach(q=>q.addEventListener("click",async()=>{if(!await u())return;const x=document.getElementById(q.dataset.target);if(!x.hasChildNodes()){x.innerHTML=a[q.dataset.target];if(q.dataset.target==="s4")fixFinal(x)}x.classList.toggle("open")}));})();