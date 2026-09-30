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
    let encrypted;
    try {
      encrypted = await fetch("solutions.enc.json", { cache: "no-store" }).then(response => {
        if (!response.ok) throw new Error("load");
        return response.json();
      });
    } catch (error) {
      if (location.protocol === "file:") {
        alert("As resoluções protegidas não podem ser carregadas quando a página é aberta diretamente como ficheiro local. Abra a versão publicada em https://pnramos-iscte.github.io/docker/exercicios-select-hotel/ e use a senha indicada pelo docente.");
      } else {
        alert("Não foi possível carregar o ficheiro das resoluções. Atualize a página e tente novamente.");
      }
      return false;
    }
    try {
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

  function block(title, parts) {
    const wrap = document.createElement("section");
    const heading = document.createElement("h3");
    heading.textContent = title;
    wrap.append(heading);
    parts.forEach((part, index) => {
      if (index > 0) {
        const subheading = document.createElement("h4");
        subheading.textContent = part.title;
        wrap.append(subheading);
      }
      const pre = document.createElement("pre");
      pre.textContent = part.value;
      pre.className = "answer-block";
      wrap.append(pre);
    });
    return wrap;
  }

  const reviewedExercises = new Set([3, 4]);

  function presentation(number, answer) {
    if (reviewedExercises.has(number)) {
      return {
        title: "Resposta",
        parts: [{ value: answer.reviewed }],
      };
    }

    const result = {
      title: "Resposta",
      parts: [{ value: answer.original }],
    };

    if (number === 5) {
      result.parts.push({ title: "Alternativa com JOIN", value: answer.reviewed });
    }
    if (number === 9) {
      result.parts[0].value = answer.original.split("\n\n-- Alternativa apresentada")[0];
    }
    if (number === 14) {
      result.parts.push({ title: "Alternativa com WITH", value: answer.reviewed });
    }
    if (number === 17) {
      result.parts.push({ title: "Outra alternativa com MAX", value: answer.reviewed });
    }
    return result;
  }

  document.querySelectorAll(".show").forEach(button => button.addEventListener("click", async () => {
    if (!await unlock()) return;
    const target = document.getElementById(button.dataset.target);
    if (!target.hasChildNodes()) {
      const answer = answers[button.dataset.target];
      const number = Number(button.dataset.target.slice(1));
      const selected = presentation(number, answer);
      target.append(block(selected.title, selected.parts));
    }
    target.classList.toggle("open");
    button.textContent = target.classList.contains("open")
      ? "Ocultar resolução"
      : "Ver resolução";
  }));
})();
