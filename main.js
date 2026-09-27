(function () {
  const $ = (id) => document.getElementById(id);
  const cfg = window.SITE || {};
  const launch = new Date(cfg.launch || "2026-09-27T14:30:00-03:00").getTime();

  // ---------------------------------------------------------------- contagem regressiva + botão de download
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    // ?agora=... na URL simula outro horário (para testar o botão)
    const q = new URLSearchParams(location.search).get("agora");
    const now = q ? new Date(q).getTime() : Date.now();
    let left = Math.max(0, launch - now);
    const d = Math.floor(left / 86400000); left -= d * 86400000;
    const h = Math.floor(left / 3600000); left -= h * 3600000;
    const m = Math.floor(left / 60000); left -= m * 60000;
    const s = Math.floor(left / 1000);
    $("cd-d").textContent = pad(d); $("cd-h").textContent = pad(h); $("cd-m").textContent = pad(m); $("cd-s").textContent = pad(s);
    const live = now >= launch;
    $("countdown").classList.toggle("live", live);
    const btn = $("download-btn");
    if (live) {
      btn.textContent = "⬇  Baixe agora — grátis";
      btn.href = cfg.download;
      btn.removeAttribute("aria-disabled");
      $("download-note").textContent = "Detetive Elias Launcher · Windows 10/11 · instale e escolha os jogos";
      for (const a of document.querySelectorAll(".download-link")) if (a !== btn) a.href = cfg.download;
    } else {
      btn.textContent = "Disponível hoje às 14:30";
      btn.href = "#baixar";
      btn.setAttribute("aria-disabled", "true");
    }
    return live;
  }
  tick();
  setInterval(tick, 1000);
  $("download-btn").addEventListener("click", (e) => { if ($("download-btn").getAttribute("aria-disabled") === "true") e.preventDefault(); });

  // ---------------------------------------------------------------- navegação fica sólida ao rolar
  const nav = $("nav");
  const onScroll = () => nav.classList.toggle("solid", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------------------------------------------------------------- galeria
  const shots = window.GALLERY || [];
  const gal = $("gallery");
  shots.forEach((s, i) => {
    const f = document.createElement("figure");
    if (i === 0) f.className = "wide";
    f.innerHTML = `<img loading="lazy" src="${s.src}" alt="${s.caption}"><figcaption>${s.caption}</figcaption>`;
    f.onclick = () => { $("lightbox-img").src = s.src; $("lightbox").classList.remove("hidden"); };
    gal.appendChild(f);
  });
  $("lightbox").onclick = () => $("lightbox").classList.add("hidden");
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("lightbox").classList.add("hidden"); });

  // ---------------------------------------------------------------- arquivo confidencial (charadas)
  const files = [
    ["CASO #01", "Sou feita de pedra, mas não sou muro. Tenho membros, mas ninguém nunca viu meu corpo. Quem sou?", "A Ordem da Pedra. E ninguém sabe quem dá as ordens."],
    ["CASO #02", "Chapéu, sobretudo e um humor que ninguém pediu. Resolve primeiro, explica depois.", "Detetive Elias, de Araraquara."],
    ["CASO #03", "Dez minutos no relógio e uma escolha que ninguém quer fazer. Onde a história começa?", "Missão 1 — O Julgamento."],
    ["CASO #04", "Fala baixo, usa suspensórios e sempre tem uma proposta pronta. De que lado ele está?", "Sean Albert. A resposta… só jogando."],
    ["CASO #05", "Muitos, barulhentos e sempre de preto. Andam em bando, mas não são passageiros.", "Os mini trem-balas."],
    ["CASO #06", "Um recorde de “Atire Neles” que o Elias jura até hoje que foi roubado. De quem é?", "Do Davi. (O Elias discorda.)"],
    ["CASO #07", "Cinquenta pacotinhos e um vício confesso. Que conquista é essa em Araraquara City?", "“Colete 50 pacotinhos de figurinhas” — Detetive Elias 1: Remake."],
    ["CASO #08", "Ele pisca na sua frente. Você aperta uma tecla. O que acontece?", "Finalização. Aperte E. (E às vezes o Elias sai voando por cima.)"],
    ["CASO #09", "Vermelho ou azul? Morreu, espera a próxima. Que modo é esse?", "O Coop do Detetive Elias 2: rodadas estilo CS/Valorant, de 1v1 a 4v4."],
  ];
  const box = $("files");
  files.forEach(([title, riddle, answer], i) => {
    const el = document.createElement("div");
    el.className = "file";
    el.style.setProperty("--r", (i % 3 === 0 ? -1.2 : i % 3 === 1 ? 0.8 : -0.4) + "deg");
    el.innerHTML = `<h4>${title}</h4><p>${riddle}</p><button>Abrir o envelope</button><div class="answer">${answer}</div>`;
    el.querySelector("button").onclick = () => { el.classList.toggle("open"); el.querySelector("button").textContent = el.classList.contains("open") ? "Fechar" : "Abrir o envelope"; };
    box.appendChild(el);
  });

  // ?secao=galeria abre o site já naquela seção (link para compartilhar)
  const secao = new URLSearchParams(location.search).get("secao");
  const alvo = secao && document.getElementById(secao);
  if (alvo) window.addEventListener("load", () => alvo.scrollIntoView());

})();
