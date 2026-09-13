(()=>{"use strict";
const exercises=[
 ["Listar o nome de todos os clientes por ordem alfabética decrescente.",`nome\nTAP\nSofia\nPedro\nONU\nNASA\nLuisa\nLuis\nISCTE\nContinente\nCarlos\nCE\nAntonio\nAna`],
 ["Listar o número dos quartos do hotel cuja sigla é RM.",`numeroQuarto\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10`],
 ["Quantos hotéis existem na coleção?",`totalHoteis\n7`],
 ["Quantos quartos tem o hotel Majestic (MJ) e quantas camas têm, usando apenas um comando?",`totalQuartos | totalCamas\n4            | 10`],
 ["Listar o nome de todos os clientes individuais.",`nome\nAna\nPedro\nLuis\nCarlos\nSofia\nLuisa\nAntonio`],
 ["Listar o nome das organizações que trabalham no ramo Alimentar.",`nome\nContinente`],
 ["Quais são os clientes individuais que não têm BI?",`nome\nLuisa\nAntonio`],
 ["Quais são os hotéis com reservas em que pelo menos um quarto está afeto a mais de duas pessoas?",`designacao\nLisboa\nRoma`],
 ["Quais são os hotéis com reservas que se sobrepõem a agosto ou setembro de 2012? Basta existir pelo menos um dia da reserva nesse intervalo.",`designacao\nLisboa\nMajestic\nMundial\nRoma`],
 ["Quais são os números das reservas efetuadas pela ONU e pela Ana?",`numeroReserva\n1\n2\n3\n6\n10\n11\n12\n13\n14`],
 ["Liste os hotéis onde o cliente ISCTE já efetuou reservas.",`designacao\nAlfa\nMundial`],
 ["Para cada hotel, indicar a quantidade de faturas, incluindo hotéis sem faturas.",`designacao | totalFacturas\nAlfa       | 3\nBaia       | 0\nLisboa     | 4\nMajestic   | 2\nMundial    | 1\nRoma       | 5\nSheraton   | 1`],
 ["Para cada hotel, indicar o total de quartos, incluindo hotéis sem quartos.",`designacao | totalQuartos\nAlfa       | 8\nBaia       | 0\nLisboa     | 6\nMajestic   | 4\nMundial    | 12\nRoma       | 10\nSheraton   | 10`],
 ["Listar os hotéis com o maior número de quartos.",`designacao | totalQuartos\nMundial    | 12`],
 ["Para cada organização, indicar o total de reservas, incluindo organizações sem reservas.",`nome       | totalReservas\nISCTE      | 3\nONU        | 8\nNASA       | 0\nCE         | 2\nTAP        | 2\nContinente | 0`],
 ["Para cada organização e cada hotel, indicar o total de reservas, incluindo combinações sem reservas.",`organização | AL BH LS MJ MN RM SH\nISCTE       | 2  0  0  0  1  0  0\nONU         | 2  0  1  1  1  2  1\nNASA        | 0  0  0  0  0  0  0\nCE          | 0  0  0  0  0  2  0\nTAP         | 0  0  0  2  0  0  0\nContinente  | 0  0  0  0  0  0  0`],
 ["Listar os hotéis com o maior número de quartos livres, considerando livre um quarto que nunca aparece numa reserva.",`designacao | totalLivres\nMundial    | 8\nSheraton   | 8`],
 ["Listar as organizações que têm reservas em todos os hotéis com quartos. O hotel Baia fica excluído porque não tem quartos.",`nome\nONU`],
 ["Listar o hotel com maior volume de faturação e indicar o respetivo valor.",`designacao | total\nRoma       | 2000.00`]
];
const openAnswers={
 s1:`<h4>Resolução MongoDB</h4><pre><code>db.hotel.find(\n  { tipo: "cliente" },\n  { _id: 0, nome: 1 }\n).sort({ nome: -1 })</code></pre><p class="solution-note">O valor <code>-1</code> ordena o nome por ordem decrescente.</p>`,
 s2:`<h4>Resolução MongoDB</h4><pre><code>db.hotel.aggregate([\n  { $match: { tipo: "hotel", sigla: "RM" } },\n  { $unwind: "$quartos" },\n  { $project: { _id: 0, numeroQuarto: "$quartos.numero" } },\n  { $sort: { numeroQuarto: 1 } }\n])</code></pre><p class="solution-note"><code>$unwind</code> transforma cada elemento do array <code>quartos</code> num documento da pipeline.</p>`
};
const list=document.getElementById("exercise-list");
const esc=s=>s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
exercises.forEach((e,i)=>{const n=i+1,id=`s${n}`,visible=n<=2;const a=document.createElement("article");a.className="exercise";a.id=`ex${n}`;a.innerHTML=`<div class="number">${String(n).padStart(2,"0")}</div><div><h3>${e[0]}</h3><h4>Resultado esperado</h4><pre class="expected">${esc(e[1])}</pre>${visible?`<div class="solution visible">${openAnswers[id]}</div>`:`<button class="show" data-target="${id}">Ver resolução</button><div class="solution" id="${id}"></div>`}</div>`;list.appendChild(a)});
let answers=null;const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));async function unlock(){if(answers)return true;const password=prompt("Introduza a senha para consultar as resoluções:");if(password===null)return false;try{const e=await fetch("solutions.enc.json",{cache:"no-store"}).then(r=>r.json()),m=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveKey"]),k=await crypto.subtle.deriveKey({name:"PBKDF2",salt:bytes(e.salt),iterations:250000,hash:"SHA-256"},m,{name:"AES-GCM",length:256},false,["decrypt"]),d=bytes(e.data),t=bytes(e.tag),payload=new Uint8Array(d.length+t.length);payload.set(d);payload.set(t,d.length);answers=JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:"AES-GCM",iv:bytes(e.iv)},k,payload)));return true}catch(_){alert("Senha incorreta.");return false}}
document.querySelectorAll(".show").forEach(b=>b.addEventListener("click",async()=>{if(!await unlock())return;const target=document.getElementById(b.dataset.target);if(!target.hasChildNodes())target.innerHTML=answers[b.dataset.target];target.classList.toggle("open")}));
})();
