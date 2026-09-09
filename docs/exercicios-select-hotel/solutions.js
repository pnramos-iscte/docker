(() => {
  "use strict";

  // Liga cada FK à PK que referencia. As coordenadas acompanham o SVG do diagrama.
  const relations = [
    "M430 125 H300",
    "M805 165 H690",
    "M930 320 V390",
    "M805 465 H690",
    "M300 385 H365 V465 H430",
    "M360 620 H395 V520 H430",
    "M690 682 H750 V540 H805",
  ];
  document.querySelectorAll(".links path").forEach((path, index) => {
    if (relations[index]) path.setAttribute("d", relations[index]);
  });

  let answers = null;
  const bytes = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));

  async function unlock() {
    if (answers) return true;
    const password = prompt("Introduza a senha para consultar as resoluções:");
    if (password === null) return false;
    try {
      const encrypted = await fetch("solutions.enc.json", { cache: "no-store" }).then(response => {
        if (!response.ok) throw new Error("load");
        return response.json();
      });
      const material = await crypto.subtle.importKey(
        "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"],
      );
      const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: bytes(encrypted.salt), iterations: 250000, hash: "SHA-256" },
        material,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"],
      );
      const body = bytes(encrypted.data);
      const tag = bytes(encrypted.tag);
      const combined = new Uint8Array(body.length + tag.length);
      combined.set(body);
      combined.set(tag, body.length);
      const clear = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: bytes(encrypted.iv) }, key, combined,
      );
      answers = JSON.parse(new TextDecoder().decode(clear));
      return true;
    } catch (error) {
      alert("Senha incorreta.");
      return false;
    }
  }

  function block(title, value) {
    const wrap = document.createElement("section");
    const heading = document.createElement("h3");
    const pre = document.createElement("pre");
    heading.textContent = title;
    pre.textContent = value;
    pre.className = "answer-block";
    wrap.append(heading, pre);
    return wrap;
  }

  document.querySelectorAll(".show").forEach(button => button.addEventListener("click", async () => {
    if (!await unlock()) return;
    const target = document.getElementById(button.dataset.target);
    if (!target.hasChildNodes()) {
      const answer = answers[button.dataset.target];
      target.append(
        block("Resolução de Pedro Ramos", answer.original),
        block("Solução revista", answer.reviewed),
      );
      if (answer.noWith) {
        target.append(block("Alternativa revista sem WITH", answer.noWith));
      }
    }
    target.classList.toggle("open");
    button.textContent = target.classList.contains("open")
      ? "Ocultar resoluções"
      : "Ver resoluções";
  }));
})();
