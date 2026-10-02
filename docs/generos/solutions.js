(() => {
  "use strict";
  let answers = null;
  const bytes = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
  async function unlock() {
    if (answers) return true;
    const password = prompt("Introduza a senha para consultar as respostas:");
    if (password === null) return false;
    try {
      const encrypted = await fetch("solutions.enc.json", { cache: "no-store" }).then(r => { if (!r.ok) throw new Error("load"); return r.json(); });
      const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey({name:"PBKDF2",salt:bytes(encrypted.salt),iterations:250000,hash:"SHA-256"}, material, {name:"AES-GCM",length:256}, false, ["decrypt"]);
      const body = bytes(encrypted.data), tag = bytes(encrypted.tag), combined = new Uint8Array(body.length + tag.length);
      combined.set(body); combined.set(tag, body.length);
      const clear = await crypto.subtle.decrypt({name:"AES-GCM",iv:bytes(encrypted.iv)}, key, combined);
      answers = JSON.parse(new TextDecoder().decode(clear));
      return true;
    } catch (error) {
      if (location.protocol === "file:") alert("Abra a versão publicada no GitHub Pages para consultar as respostas protegidas.");
      else alert("Senha incorreta.");
      return false;
    }
  }
  document.querySelectorAll(".show").forEach(button => button.addEventListener("click", async () => {
    if (!await unlock()) return;
    const target = document.getElementById(button.dataset.target);
    if (!target.hasChildNodes()) {
      const item = answers[button.dataset.target];
      const h = document.createElement("h3"); h.textContent = "Resposta"; target.append(h);
      if (item.note) { const p = document.createElement("p"); p.textContent = item.note; target.append(p); }
      const pre = document.createElement("pre"); pre.className = "answer-block"; pre.textContent = item.sql; target.append(pre);
      if (item.result) { const h4 = document.createElement("h4"); h4.textContent = "Resultado"; target.append(h4); const result = document.createElement("pre"); result.className = "answer-block"; result.textContent = item.result; target.append(result); }
    }
    target.classList.toggle("open");
    button.textContent = target.classList.contains("open") ? "Ocultar resposta" : "Ver resposta";
  }));
})();
