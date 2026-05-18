(function() {
  'use strict';

  const splash = document.getElementById('splash');
  const mainContent = document.getElementById('main-content');
  const enterBtn = document.getElementById('enter-btn');
  const starCanvas = document.getElementById('starfield');

  // ====== STARFIELD (minimalista) ======
  if (starCanvas) {
    const ctx = starCanvas.getContext('2d');
    let stars = [], starRaf = null, w, h;

    function resize() {
      w = starCanvas.width = window.innerWidth;
      h = starCanvas.height = window.innerHeight;
    }
    resize();
    stars = Array.from({length: Math.min(50, Math.floor(w * h / 4000))}, () => ({
      x: Math.random() * w, y: Math.random() * h,
      s: Math.random() * 1.5 + 0.5, sp: Math.random() * 0.2 + 0.05
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(Date.now() * 0.002 + i) * 0.2 + 0.2})`;
        ctx.fill();
        st.y += st.sp;
        if (st.y > h) { st.y = 0; st.x = Math.random() * w; }
      }
      starRaf = requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', resize);

    enterBtn.addEventListener('click', function stopStar() {
      if (starRaf) cancelAnimationFrame(starRaf);
      clearInterval(sparkleInt);
      splash.classList.add('hidden-splash');
      mainContent.classList.remove('hidden');
      launchConfetti(25);
      setTimeout(() => spawnFloatingText('💖'), 300);
    }, {once: true});
  }

  // ====== VISITOR COUNTER ======
  (function() {
    let c = parseInt(localStorage.getItem('voceeumaxxx_visitors'));
    if (!c) { c = Math.floor(Math.random() * 500) + 42; }
    c++;
    localStorage.setItem('voceeumaxxx_visitors', c);
    document.getElementById('visitor-count-splash').textContent = c;
    document.getElementById('visitor-count-footer').textContent = c;
  })();

  // ====== SCROLL ANIMATIONS ======
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section').forEach(s => observer.observe(s));

  // ====== QUIZ (delegation) ======
  let quizAnswers = {};
  document.querySelector('.quiz-container')?.addEventListener('click', e => {
    const btn = e.target.closest('.quiz-btn');
    if (!btn) return;
    const q = btn.closest('.quiz-question');
    q.querySelectorAll('.quiz-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    quizAnswers[q.id] = btn.dataset.answer || btn.textContent.trim();

      if (document.querySelectorAll('.quiz-question').length === Object.keys(quizAnswers).length) {
          const vals = Object.values(quizAnswers);
          const msgs = [
            `🎉 Parabéns! Você é ${vals[0]} que também ${vals[1]} — igual a May!`,
            `🔥 Resultado: ${vals[2]} + ${vals[3]} = ${vals[4]}. Level May: RADICAL!`,
            `💖 Você: ${vals[0]}, ${vals[2]}, ${vals[4]} — May aprovou! 🤘`,
            `🌟 ${vals[1]} que ${vals[3]} mas no fundo é ${vals[0]} — só uma May entende!`,
            `⛸️ Patinadora? ${vals[0]}. Rockeira? ${vals[1]}. May? SIM!`,
            `🎸 ${vals[2]} + ${vals[4]} = VOCÊ É UMA MAY EM TREINAMENTO!`,
          ];
          document.getElementById('quiz-result-text').textContent = msgs[Math.floor(Math.random() * msgs.length)];
          document.getElementById('quiz-result').classList.remove('hidden');
          launchConfetti(12);
        }
  });

  // ====== BOLA DA SORTE ======
  const fortAnswers = [
    'Sinais dizem que SIM! ✨', 'Nao. Vai lavar uma louca.',
    'A May patinando responde: sim! ⛸️', 'Bola ocupada vendo dorama tailandês 📞',
    'Com certeza! A cara fechada diz sim 🎯', 'Nem ferrando, rockeira nao aceita 🚫',
    'Pergunta pra May no intervalo do telemarketing 👨‍⚖️', 'Sim, e ela disse com cara fechada 💅',
    'Toma um cafe e escuta um rock primeiro ☕', 'O universo rockeiro disse SIM... 🎸',
    'Claro que sim, patinadora radical! 💖', '404 - Resposta not found (tá vendo dorama) 🤖',
    'Depois do episódio do dorama eu respondo 🍫', 'Sim! A May de cara fechada concordou 🤥',
    'May, cai na real (e patina) 😂', 'O rock respondeu: SIM! 🤘',
  ];
  const ball = document.getElementById('magic-ball');
  const fortInput = document.getElementById('fortune-input');
  const ballAns = document.getElementById('ball-answer');
  const fortHist = document.getElementById('fortune-history');

  function shake() {
    ball.style.animation = 'shake 0.4s ease';
    setTimeout(() => ball.style.animation = '', 400);
  }
  function ask() {
    const q = fortInput.value.trim();
    if (!q) { ballAns.textContent = 'DIGITA ALGO!'; shake(); return; }
    ballAns.textContent = fortAnswers[Math.floor(Math.random() * fortAnswers.length)];
    shake();
    const e = document.createElement('div');
    e.style.cssText = 'margin-top:4px;font-size:0.75rem;opacity:0.7';
    e.textContent = `"${q}" → ${ballAns.textContent}`;
    fortHist.prepend(e);
    if (fortHist.children.length > 4) fortHist.removeChild(fortHist.lastChild);
  }
  document.getElementById('fortune-btn').addEventListener('click', ask);
  fortInput.addEventListener('keydown', e => { if (e.key === 'Enter') ask(); });

  // ====== LOVE CALCULATOR ======
  document.getElementById('love-btn').addEventListener('click', function() {
    const n1 = document.getElementById('love-name1').value.trim() || 'Voce';
    const n2 = document.getElementById('love-name2').value.trim() || 'May';
    const seed = n1.length * 7 + n2.length * 13 + (n1.charCodeAt(0)||0) * 3 + (n2.charCodeAt(n2.length-1)||0) * 5;
    const pct = Math.min(99, Math.max(1, (seed % 50) + 50 + Math.floor(Math.random() * 8)));
    const res = document.getElementById('love-result');
    const pctEl = document.getElementById('love-percentage');
    const fill = document.getElementById('love-fill');
    const msg = document.getElementById('love-message');
    res.classList.remove('hidden');

    let cur = 0;
    const iv = setInterval(() => {
      cur += Math.ceil(pct / 20);
      if (cur >= pct) {
        cur = pct; clearInterval(iv);
        fill.style.width = pct + '%';
        pctEl.textContent = pct + '%';

        const msgs = ['🔥 QUEIMOU O SERVIDOR!','💖 Chama o padre!','✨ Perfeicao total!','🥹 Lindo demais','💯 Perfeitos!','🚀 Patinando pra lua!','🎸 Rock do amor!','⛸️ Radical demais!'];
        if (pct >= 85) { msg.textContent = msgs[Math.floor(Math.random() * msgs.length)]; launchConfetti(15); }
        else if (pct >= 65) { msg.textContent = '💪 Cara fechada mas o coração ta aquecendo!'; launchConfetti(6); }
        else if (pct >= 45) msg.textContent = '🤔 Hmm... igual dorama tailandês, precisa de mais episódios';
        else msg.textContent = '😬 Atende o telemarketing do amor de novo mais tarde';
      }
      pctEl.textContent = cur + '%';
      fill.style.width = cur + '%';
    }, 40);
  });

  // ====== CARDS (delegation) ======
  document.getElementById('cards-grid')?.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    card.classList.toggle('flipped');
    if (card.dataset.type === 'desafio') setTimeout(() => spawnFloatingText('🔥'), 300);
  });

  // ====== MUSIC PLAYER ======
  const audio = document.getElementById('audio-player');
  const playBtn = document.getElementById('play-btn');
  const np = document.getElementById('now-playing');
  const cdW = document.querySelector('.cd-wrapper');
  const bars = document.querySelectorAll('.bar');
  const playlist = [
    { t: "Ariana Grande - We Can't Be Friends", f: 'assets/songs/we-cant-be-friends.mp3' },
    { t: 'Sabrina Carpenter - Espresso', f: 'assets/songs/expresso_sabrina_carpter.mp3' },
    { t: 'Beabadobee - The Perfect Pair', f: 'assets/songs/the_perfect_pair.mp3' },
  ];
  let cur = 0;

  function load(i) {
    if (i >= 0 && i < playlist.length) {
      cur = i; audio.src = playlist[cur].f;
      np.textContent = `🎵 ${playlist[cur].t}`; audio.load();
    }
  }

  function toggle() {
    if (!playlist[0].f) { return; }
    if (!audio.src || audio.src === location.href) load(0);
    if (audio.paused) {
      audio.play().then(() => {
        playBtn.textContent = '⏸'; cdW.classList.add('playing');
        bars.forEach(b => b.classList.add('active'));
      }).catch(() => np.textContent = '⚠️ MP3 nao encontrado');
    } else {
      audio.pause(); playBtn.textContent = '▶';
      cdW.classList.remove('playing'); bars.forEach(b => b.classList.remove('active'));
    }
  }

  function next() { if (!playlist[0].f) return; const p = !audio.paused; load((cur + 1) % playlist.length); if (p) audio.play().catch(()=>{}); }
  function prev() { if (!playlist[0].f) return; const p = !audio.paused; load((cur - 1 + playlist.length) % playlist.length); if (p) audio.play().catch(()=>{}); }

  playBtn.addEventListener('click', toggle);
  document.getElementById('next-btn').addEventListener('click', next);
  document.getElementById('prev-btn').addEventListener('click', prev);
  audio.addEventListener('ended', next);
  document.getElementById('volume-slider').addEventListener('input', function() { audio.volume = this.value; });

  // ====== GUESTBOOK ======
  (function() {
    const nameEl = document.getElementById('gb-name');
    const msgEl = document.getElementById('gb-message');
    const btn = document.getElementById('gb-btn');
    const entries = document.getElementById('gb-entries');

    function load() {
      try {
        JSON.parse(localStorage.getItem('voceeumaxxx_guestbook') || '[]').forEach(e => add(e.name, e.msg, e.date, false));
      } catch(e) {}
    }
    function add(name, msg, date, save) {
      const d = document.createElement('div'); d.className = 'gb-entry';
      const ds = date || new Date().toLocaleString('pt-BR');
      d.innerHTML = `<p class="gb-author">💖 ${esc(name)} <span class="gb-date">- ${ds}</span></p><p class="gb-text">${esc(msg)}</p>`;
      entries.appendChild(d);
      if (save) {
        const saved = JSON.parse(localStorage.getItem('voceeumaxxx_guestbook') || '[]');
        saved.push({name, msg, date: ds});
        localStorage.setItem('voceeumaxxx_guestbook', JSON.stringify(saved));
      }
    }
    function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

    btn.addEventListener('click', function() {
      const n = nameEl.value.trim() || 'Anonimo';
      const m = msgEl.value.trim(); if (!m) return;
      add(n, m, null, true); msgEl.value = '';
    });
    load();
  })();

  // ====== MOUSE TRAIL (pool reciclado) ======
  const trailEmojis = ['💖', '✨', '🌟', '💕', '🔥', '⭐', '💗'];
  const trailPool = [];
  for (let i = 0; i < 3; i++) {
    const el = document.createElement('div'); el.className = 'trail-emoji';
    el.style.display = 'none'; document.body.appendChild(el); trailPool.push(el);
  }
  let tIdx = 0, tTimer = null;
  document.addEventListener('mousemove', function(e) {
    if (tTimer) return;
    tTimer = setTimeout(function() {
      tTimer = null;
      const el = trailPool[tIdx]; tIdx = (tIdx + 1) % 3;
      el.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
      el.style.left = e.clientX + 'px';
      el.style.top = e.clientY + 'px';
      el.style.display = '';
      el.style.animation = 'none'; el.offsetHeight; el.style.animation = '';
      setTimeout(function() { el.style.display = 'none'; }, 900);
    }, 150);
  }, {passive: true});

  // ====== FLOATING TEXT ======
  const floatTexts = ['Ow! 🥰','Ai! 🤭','Para! 😳','Que isso! 🤣','Aff 😏','Nossa! 😱','💖','🔥','✨','Rsrs 💕'];
  document.addEventListener('click', function(e) {
    if (e.target.closest('button,input,textarea,.card')) return;
    if (Math.random() > 0.45) spawnAt(floatTexts[Math.floor(Math.random() * floatTexts.length)], e.clientX, e.clientY);
  }, {passive: true});

  function spawnFloatingText(text) {
    spawnAt(text, window.innerWidth * (0.2 + Math.random() * 0.6), window.innerHeight * (0.2 + Math.random() * 0.4));
  }
  function spawnAt(text, x, y) {
    const el = document.createElement('div'); el.className = 'float-text';
    el.textContent = text; el.style.left = x + 'px'; el.style.top = y + 'px';
    el.style.color = ['#FF97A5','#00FFFF','#FFD700','#FF69B4','#7FFF00'][Math.floor(Math.random() * 5)];
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  // ====== CONFETTI ======
  function launchConfetti(count) {
    count = count || 15;
    const colors = ['#FF97A5','#00FFFF','#FFD700','#FF69B4','#7FFF00','#BF00FF'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div'); p.className = 'confetti-piece';
      p.style.cssText = `left:${Math.random()*100}vw;top:-10px;width:${4+Math.random()*6}px;height:${3+Math.random()*4}px;background:${colors[i%colors.length]};animation-duration:${1.5+Math.random()*1.5}s;animation-delay:${Math.random()*0.3}s`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 3500);
    }
  }

  // ====== SPARKLES (splash apenas) ======
  const sparkleChars = ['✦','✧','★','💖','✨'];
  let sparkleInt = setInterval(function() {
    if (!splash || splash.classList.contains('hidden-splash')) return;
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;pointer-events:none;z-index:99996;left:${Math.random()*100}vw;top:${Math.random()*100}vh;font-size:${0.8+Math.random()*1}rem;opacity:0;animation:sparkle-pop 1.2s ease-out forwards`;
    el.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }, 6000);

  // ====== DATE ======
  const d = document.getElementById('update-date');
  if (d) { const n = new Date(); d.textContent = n.toLocaleDateString('pt-BR') + ' ' + n.toLocaleTimeString('pt-BR'); }

  // ====== EASTER EGG ======
  let kp = '';
  document.addEventListener('keydown', function(e) {
    kp += e.key.toLowerCase();
    if (kp.length > 6) kp = kp.slice(-6);
    if (kp === 'mayara') {
      kp = '';
      document.querySelectorAll('.section-title').forEach(el => el.classList.add('rainbow-text'));
      launchConfetti(30);
    }
  });

  console.log('%c💖 voceeumaxxx.com 💖', 'font-size:1.5rem;color:#FF97A5');
})();
