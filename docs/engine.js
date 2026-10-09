(() => {
  if (location.hash) addEventListener('error', (e) => document.body.insertAdjacentHTML('beforeend',
    `<pre style="position:fixed;left:0;top:0;z-index:999;background:#fff;color:#000;font:11px monospace;white-space:pre-wrap;max-width:100%">${e.message} @${e.lineno}:${e.colno}</pre>`));
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const STORY = window.STORY, ART = window.ART;
  const stage = $('#stage'), world = $('#world');
  const W = 390, H = 800;
  function fit() { stage.style.transform = `translate(-50%, -50%) scale(${Math.min(innerWidth / W, innerHeight / H)})`; }
  addEventListener('resize', fit); fit();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.Physics2DPlugin) gsap.registerPlugin(Physics2DPlugin);
  const name = STORY.herName || 'you';
  document.title = `${name}'s Halloween Birthday`;
  $('#introName').textContent = name; $('#pTitle').textContent = name; $('#caseLabel').textContent = `${name}'s collection`;
  $('#yenWish').innerHTML = `A really happy birthday for ${name}.<br>Status: GRANTED. Paid in candy.`;

  /* ================= sound: synthesized effects + optional music file ================= */
  const S = { ctx: null, on: true, master: null };
  function audioInit() {
    try { S.ctx = new (window.AudioContext || window.webkitAudioContext)(); S.master = S.ctx.createGain(); S.master.gain.value = .8; S.master.connect(S.ctx.destination); }
    catch (e) { S.ctx = null; }
    if (STORY.music) { const m = $('#music'); m.src = STORY.music; m.volume = .45; m.play().catch(() => {}); }
  }
  function tone(f, t, dur, type = 'sine', vol = .2) {
    if (!S.ctx) return;
    const o = S.ctx.createOscillator(), g = S.ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(S.master); o.start(t); o.stop(t + dur + .05);
  }
  function noise(t, dur, f, q = 1, vol = .2, to) {
    if (!S.ctx) return;
    const len = Math.floor(S.ctx.sampleRate * dur), b = S.ctx.createBuffer(1, len, S.ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = S.ctx.createBufferSource(); src.buffer = b;
    const fl = S.ctx.createBiquadFilter(); fl.type = 'bandpass'; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (to) fl.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = S.ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    src.connect(fl); fl.connect(g); g.connect(S.master); src.start(t);
  }
  const now = () => (S.ctx ? S.ctx.currentTime : 0);
  const sfx = {
    bell() { const t = now(); tone(659, t, 1.2, 'sine', .28); tone(1318, t, .6, 'sine', .05); tone(523, t + .45, 1.5, 'sine', .28); tone(1046, t + .45, .7, 'sine', .05); },
    chime() { const t = now(); [784, 988, 1175, 1568].forEach((f, i) => { tone(f, t + i * .18, 1.6, 'sine', .18); tone(f * 2, t + i * .18, .6, 'sine', .03); }); },
    creak() { if (!S.ctx) return; const t = now(), o = S.ctx.createOscillator(), g = S.ctx.createGain(), f = S.ctx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(140, t); o.frequency.linearRampToValueAtTime(95, t + .5); o.frequency.linearRampToValueAtTime(120, t + .9);
      f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 6;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.1, t + .1); g.gain.linearRampToValueAtTime(.05, t + .5); g.gain.exponentialRampToValueAtTime(.0001, t + 1);
      o.connect(f); f.connect(g); g.connect(S.master); o.start(t); o.stop(t + 1.05); noise(t, 1.2, 600, .7, .05, 300); },
    rustle() { const t = now(); noise(t, .18, 3500, .8, .18); noise(t + .06, .14, 2400, .8, .12); tone(1568, t + .05, .25, 'sine', .05); },
    nope() { const t = now(); tone(330, t, .12, 'triangle', .12); tone(262, t + .1, .2, 'triangle', .12); },
    pop() { const t = now(); tone(880, t, .12, 'triangle', .15); tone(1320, t + .05, .12, 'triangle', .1); },
    magic() { const t = now(); [1046, 1318, 1568, 2093, 2637].forEach((f, i) => tone(f, t + i * .05, .5, 'sine', .07)); },
    cheer() { const t = now(); [523, 659, 784, 1046].forEach((f, i) => tone(f, t + i * .07, .35, 'triangle', .12)); },
    giggle() { const t = now(); [900, 1000, 880, 1050].forEach((f, i) => tone(f, t + i * .09, .08, 'sine', .05)); },
    warble() { const t = now(); [420, 520, 460, 600].forEach((f, i) => tone(f, t + i * .08, .14, 'triangle', .09)); },
    blow() { const t = now(); noise(t, .45, 900, .4, .25, 300); },
    shake() { const t = now(); noise(t, .12, 800, 1, .15); noise(t + .15, .12, 800, 1, .15); noise(t + .3, .12, 800, 1, .15); },
    burst() { const t = now(); noise(t, .35, 2000, .5, .25, 6000); [784, 988, 1175, 1568, 2093].forEach((f, i) => tone(f, t + .05 + i * .06, .8, 'sine', .1)); },
    fanfare() { const t = now(); [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => { tone(f, t + i * .12, .5, 'triangle', .14); tone(f / 2, t + i * .12, .5, 'sine', .06); }); }
  };
  $('#mute').addEventListener('click', () => {
    S.on = !S.on; if (S.master) S.master.gain.value = S.on ? .8 : 0; $('#music').muted = !S.on;
    $('#mute').textContent = S.on ? 'Sound on' : 'Sound off';
  });

  /* ================= hallway ================= */
  const sparkSVG = (c) => `<svg viewBox="0 0 24 24"><path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5Z" fill="${c}"/></svg>`;
  const heartSVG = (c) => `<svg viewBox="0 0 24 22"><path d="M12 21 C-6 9 4 -4 12 5 C20 -4 30 9 12 21Z" fill="${c}" stroke="#2e2148" stroke-width="1.8"/></svg>`;
  const fb = $('#fairyBulbs'), fcol = ['#ffd98a', '#ff8fbd', '#a8ecd6', '#c7a6ff'];
  for (let i = 0; i < 16; i++) {
    const x = 6 + i * 25, y = x < 195 ? 6 + 26 * Math.sin(Math.PI * x / 195) : 6 + 26 * Math.sin(Math.PI * (x - 195) / 195);
    fb.insertAdjacentHTML('beforeend', `<circle cx="${x}" cy="${y + 5}" r="4.5" fill="${fcol[i % 4]}"/><circle class="fglow" cx="${x}" cy="${y + 5}" r="10" fill="${fcol[i % 4]}" opacity=".35"/>`);
  }
  if (!reduce) $$('.fglow').forEach((g, i) => gsap.to(g, { opacity: .05, duration: .8 + (i % 4) * .3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * .13 }));
  const frameHeart = `<svg viewBox="0 0 40 40" width="60%"><path d="M20 34 C2 22 8 6 20 14 C32 6 38 22 20 34Z" fill="#ffc2da" stroke="#e8a0bc" stroke-width="2"/></svg>`;
  ['#pf1', '#pf2'].forEach((sel, i) => { const ph = (STORY.framePhotos || [])[i]; $(sel + ' .in').innerHTML = ph ? `<img src="${ph}" alt="">` : frameHeart; });

  let hour = 7;
  function setClock(h, animate = true) {
    hour = h;
    gsap.to('#hHour', { rotation: (h % 12) * 30, svgOrigin: '25 25', duration: animate ? 1.2 : 0, ease: 'power2.inOut' });
    gsap.to('#hMin', { rotation: animate ? '+=360' : 0, svgOrigin: '25 25', duration: animate ? 1.2 : 0, ease: 'power2.inOut' });
  }
  setClock(7, false);

  const out = $('#outside');
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('div'); s.className = 'o ostar';
    s.style.left = Math.random() * 200 + 'px'; s.style.top = Math.random() * 230 + 'px'; out.insertBefore(s, out.firstChild);
    if (!reduce) gsap.to(s, { opacity: .15, duration: 1 + Math.random() * 2, yoyo: true, repeat: -1, delay: Math.random() * 2 });
  }
  [[38, 120, 1], [172, 120, 1], [64, 60, .7], [146, 60, .7], [80, 22, .5], [130, 22, .5]].forEach(([x, y, k]) => {
    $('#pathPumpkins').insertAdjacentHTML('beforeend', `<g transform="translate(${x} ${y}) scale(${k})"><ellipse rx="16" ry="12" fill="#ff9a52" stroke="#2e2148" stroke-width="3"/><path d="M-6 -2 l3 -4 3 4z M3 -2 l3 -4 3 4z M-6 4 Q0 9 6 4" fill="#ffd98a"/><path d="M0 -12 q1 -5 5 -5" fill="none" stroke="#5c8f3a" stroke-width="3"/></g>`);
  });
  ['#ff8fbd', '#a8ecd6', '#ffd25e', '#c7a6ff'].forEach((c, i) => {
    const w = document.createElement('div'); w.className = 'walker';
    w.innerHTML = `<svg viewBox="0 0 14 26"><circle cx="7" cy="6" r="5" fill="#120d22"/><path d="M2 10 h10 l2 14 h-14z" fill="${c}" opacity=".8"/></svg>`;
    $('#walkers').appendChild(w);
    if (!reduce) gsap.fromTo(w, { x: i % 2 ? 230 : -30 }, { x: i % 2 ? -30 : 230, duration: 9 + i * 2.5, ease: 'none', repeat: -1, delay: i * 2.2 });
    else gsap.set(w, { x: 30 + i * 40 });
  });
  if (!reduce) {
    gsap.to('#fog1', { x: 40, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('#fog2', { x: -36, duration: 9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('#sconceGlow', { opacity: .75, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    for (let i = 0; i < 6; i++) {
      const l = document.createElement('div'); l.className = 'o leaf';
      l.innerHTML = `<svg viewBox="0 0 12 12"><path d="M6 0 Q12 6 6 12 Q0 6 6 0Z" fill="${['#ff9a52', '#e8623a', '#ffcf3a'][i % 3]}"/></svg>`;
      out.appendChild(l);
      gsap.fromTo(l, { x: Math.random() * 210, y: -20 }, { y: 480, x: '+=' + (Math.random() * 80 - 40), rotation: 360 * (Math.random() > .5 ? 1 : -1), duration: 6 + Math.random() * 4, ease: 'none', repeat: -1, delay: Math.random() * 6 });
    }
  }

  /* the display case: 5 slots, the last one a secret */
  const slots = [];
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('div'); s.className = 'cslot'; s.style.top = (8 + i * 52) + 'px';
    s.innerHTML = `<div class="lit"></div>${i === 4 ? '<span class="q">?</span>' : ''}`;
    s.addEventListener('click', () => { const t = s.querySelector('.toyfig'); if (t) gimmick(t); });
    $('#caseSlots').appendChild(s); slots.push(s);
  }
  function placeToy(i, key, animate) {
    const s = slots[i]; s.querySelector('.q')?.remove();
    s.insertAdjacentHTML('beforeend', ART.toy(key));
    gsap.to(s.querySelector('.lit'), { opacity: 1, duration: .6 });
    if (animate) gsap.fromTo(s.querySelector('.toyfig'), { scale: 0, y: -30 }, { scale: 1, y: 0, duration: .7, ease: 'bounce.out' });
  }

  /* ================= magic the guests leave behind ================= */
  function wisp(container, x, y, linger) {
    const w = document.createElement('div'); w.className = 'wisp'; w.innerHTML = ART.sprite;
    w.style.left = x + 'px'; w.style.top = y + 'px'; container.appendChild(w);
    gsap.fromTo(w, { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: 1 });
    if (!reduce) gsap.to(w, { x: '+=' + (Math.random() * 60 - 30), y: '-=' + (40 + Math.random() * 60), rotation: Math.random() * 90 - 45, duration: 4 + Math.random() * 3, yoyo: !!linger, repeat: linger ? -1 : 0, ease: 'sine.inOut' });
    return w;
  }
  const MAGIC = {
    candles(animate) {
      const box = $('#mCandles'); box.innerHTML = '';
      [[28, 64], [92, 72], [150, 62], [236, 62], [292, 72], [354, 64]].forEach(([x, y], i) => {
        const c = document.createElement('div'); c.className = 'candle'; c.style.left = x + 'px'; c.style.top = y + 'px'; c.style.width = '10px';
        c.innerHTML = `<svg viewBox="0 0 14 40"><path d="M7 1 Q12 8 7 13 Q2 8 7 1Z" fill="#ffd98a"/><circle cx="7" cy="9" r="7" fill="#ffd98a" opacity=".3"/><rect x="3" y="13" width="8" height="26" rx="2" fill="#fff6ea" stroke="#2e2148" stroke-width="1.5"/></svg>`;
        box.appendChild(c);
        if (!reduce) gsap.to(c, { y: -5, duration: 1.6 + i * .2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * .3 });
      });
      gsap.to(box, { opacity: 1, duration: animate ? 1.4 : 0 });
    },
    charm(animate) { gsap.to('#mCharm', { opacity: 1, duration: animate ? 1 : 0 }); if (!reduce) gsap.to('#mCharm', { rotation: 6, svgOrigin: '20 0', duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }); },
    dragon(animate) {
      const g = $('#scaleBits'); g.innerHTML = '';
      for (let i = 0; i < 11; i++) { const tt = (i + .5) / 11, x = 8 + 234 * tt, y = 54 - 4 * 78 * tt * (1 - tt);
        g.insertAdjacentHTML('beforeend', `<path d="M${x - 8} ${y} Q${x} ${y + 18} ${x + 8} ${y} Z" fill="#2a2b38" stroke="#4fae6a" stroke-width="2"/>`); }
      gsap.to('#mScales', { opacity: 1, duration: animate ? 1.2 : 0 });
      gsap.to('#lampGlass', { attr: { fill: '#8fd8ff' }, duration: animate ? 1 : 0 });
      $('#sconceGlow').style.setProperty('--lampGlow', 'rgba(143,216,255,.55)');
    },
    pandora(animate) {
      const g = $('#plantBits'); g.innerHTML = '';
      [[14, 1], [44, .8], [346, 1], [376, .8], [70, .6], [320, .6]].forEach(([x, k]) => g.insertAdjacentHTML('beforeend',
        `<g transform="translate(${x} 70) scale(${k})"><path d="M0 0 Q-14 -30 -4 -60 Q2 -30 0 0 Q8 -40 22 -56 Q10 -26 0 0" fill="#3d7a6a"/><circle cx="-4" cy="-60" r="5" fill="#a8fbff"/><circle cx="22" cy="-56" r="4" fill="#ff8fe0"/><path d="M-2 -10 q-6 -16 0 -30" fill="none" stroke="#a8fbff" stroke-width="2" opacity=".8"/></g>`));
      gsap.to('#mPlants', { opacity: 1, duration: animate ? 1.4 : 0 });
      if (!reduce) gsap.to('#plantBits circle', { opacity: .35, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .15 });
      for (let i = 0; i < 5; i++) wisp($('#wisps'), 30 + Math.random() * 330, 300 + Math.random() * 250, true);
    }
  };

  /* ================= the guests ================= */
  const VISITORS = [
    { series: 'Harry Potter', world: 'hogwarts', box: 'HARRY POTTER', band: '#7a2335', toy: 'harry', toyName: 'Harry with light-up wand',
      layout: 'trio', cast: ['hermione', 'harry', 'ron'], mech: 'spell', magic: 'candles',
      peep: 'Ding-dong! Three shadows in cloaks... and one is holding a wand.',
      greet: [['harry', 'Trick or treat!'], ['ron', 'Blimey, a whole bowl!'], ['hermione', `Happy birthday, ${name}!`]],
      cap: 'Tap a candy to cast a levitation spell, or drag it.',
      gift: [['harry', 'This is from all three of us.']], bye: [['ron', `Bye, ${name}!`], ['hermione', 'See you at Hogwarts!']] },
    { series: 'Noragami', world: 'shrine', box: 'NORAGAMI', band: '#c4262a', toy: 'yato', toyName: 'Yato with flipping 5-yen coin',
      layout: 'solo', cast: ['yato'], mech: 'fiveyen', magic: 'charm',
      peep: 'Ding-dong! A shadow in a tracksuit... and a scarf.',
      greet: [['yato', 'Yato God, at your service! Trick or treat!']],
      cap: 'A stray god. He doesn\'t look like he gets treats often.',
      gift: [['yato', 'And this is for you, my favorite worshipper!']], bye: [['yato', 'Call me anytime! Only 5 yen!']] },
    { series: 'How to Train Your Dragon', world: 'dragon', box: 'HOW TO TRAIN YOUR DRAGON', band: '#2f4a3a', toy: 'toothless', toyName: 'Toothless with flapping wings',
      layout: 'duo', cast: ['hiccup', 'toothless'], mech: 'dragon', magic: 'dragon',
      peep: 'Ding-dong! One shadow... and a much bigger one with wings.',
      greet: [['hiccup', 'Trick or treat! Don\'t worry, he\'s friendly.'], ['toothless', '(happy dragon noises)']],
      cap: 'Give them candy. Toothless looks picky...',
      gift: [['hiccup', 'Toothless picked this out for you.']], bye: [['hiccup', `Bye, ${name}!`], ['toothless', '(warbles goodbye)']] },
    { series: 'Avatar', world: 'pandora', box: 'AVATAR', band: '#2d6fa8', toy: 'neytiri', toyName: 'Neytiri glow-in-the-dark figure',
      layout: 'quad', cast: ['jake', 'neytiri', 'kiri', 'tuk'], mech: 'glow', magic: 'pandora',
      peep: 'Ding-dong! Very tall shadows... with long braids.',
      greet: [['tuk', 'Trick or treat!!'], ['jake', `Hey ${name}. Happy birthday.`], ['neytiri', 'We came a long way to see you.']],
      cap: 'Every candy makes them glow a little brighter.',
      gift: [['neytiri', 'From our family to you.']], bye: [['tuk', `Bye ${name}!!`], ['kiri', '(waves shyly)']] }
  ];
  const GOLDEN = { series: 'Birthday Edition', world: 'golden', box: 'BIRTHDAY EDITION', band: '#d99a1a', toy: 'golden', toyName: 'Secret golden birthday heart' };
  const LAYOUT = {
    solo: [[30, 168, 150]], duo: [[-6, 196, 124], [86, 178, 136]],
    trio: [[-12, 214, 96], [58, 204, 96], [120, 214, 96]],
    quad: [[8, 168, 104], [96, 160, 108], [-14, 250, 84], [138, 258, 78]]
  };

  let vi = 0, step = 'intro', st = {}, actors = [], candies = [];
  const actor = (n) => actors.find((a) => a.name === n);
  const node = (a, part) => document.getElementById(a.p + '-' + part);

  function setupVisitor(i) {
    vi = i; const V = VISITORS[i];
    $('#cast').innerHTML = ''; actors = []; $('#bubbles').innerHTML = '';
    V.cast.forEach((n, j) => {
      const [x, y, w] = LAYOUT[V.layout][j], p = `v${i}${n}`;
      const el = document.createElement('div'); el.className = 'actor';
      el.style.cssText = `left:${x}px;top:${y}px;width:${w}px;z-index:${j >= 2 ? 3 : 2}`; el.innerHTML = ART.char(n, p);
      $('#cast').appendChild(el); gsap.set(el, { y: 90, opacity: 0 });
      actors.push({ name: n, p, el });
    });
    $('#peepCast').innerHTML = V.cast.slice(0, 3).map((n, j) => ART.char(n, `pk${i}${n}${j}`)).join('');
    st = { given: Object.fromEntries(V.cast.map((n) => [n, 0])), total: 0, warned: false };
    makeCandies(V.mech);
  }

  /* ================= candy ================= */
  const wrapped = (c) => `<svg viewBox="0 0 60 34"><path d="M2 6 L16 17 L2 28Z M58 6 L44 17 L58 28Z" fill="${c}" stroke="#2e2148" stroke-width="2" stroke-linejoin="round"/><ellipse cx="30" cy="17" rx="16" ry="13" fill="${c}" stroke="#2e2148" stroke-width="2.5"/><path d="M22 11 Q30 23 38 11" fill="none" stroke="#fff" stroke-width="2.5" opacity=".8"/></svg>`;
  const CANDY = {
    choc: `<svg viewBox="0 0 60 34"><path d="M2 8 L10 4 L10 30 L2 26Z M58 8 L50 4 L50 30 L58 26Z" fill="#c9a26b" stroke="#2e2148" stroke-width="2"/><rect x="9" y="3" width="42" height="28" rx="4" fill="#d6322b" stroke="#2e2148" stroke-width="2.5"/><rect x="15" y="11" width="30" height="12" rx="3" fill="#fff"/><path d="M19 17h22" stroke="#d6322b" stroke-width="3"/></svg>`,
    lolli: `<svg viewBox="0 0 40 60"><rect x="18" y="30" width="4" height="28" rx="2" fill="#fff6ea" stroke="#2e2148" stroke-width="1.5"/><circle cx="20" cy="18" r="16" fill="#ff8fbd" stroke="#2e2148" stroke-width="2.5"/><path d="M20 18 m-10 0 a10 10 0 1 1 10 10 a6 6 0 1 1 -6 -6 a3 3 0 1 1 3 3" fill="none" stroke="#fff" stroke-width="2.5"/></svg>`,
    corn: `<svg viewBox="0 0 40 44"><path d="M20 2 Q34 26 34 36 Q20 44 6 36 Q6 26 20 2Z" fill="#ffd25e"/><path d="M11 22 Q20 18 29 22 L32 34 Q20 40 8 34Z" fill="#ff8a2b"/><path d="M8 34 Q20 40 32 34 L34 36 Q20 44 6 36Z" fill="#fff"/><path d="M20 2 Q34 26 34 36 Q20 44 6 36 Q6 26 20 2Z" fill="none" stroke="#2e2148" stroke-width="2.5"/></svg>`,
    gummy: `<svg viewBox="0 0 44 38"><ellipse cx="22" cy="22" rx="19" ry="14" fill="#9b6be0" stroke="#2e2148" stroke-width="2.5"/><path d="M14 10 Q10 22 14 34 M30 10 Q34 22 30 34" fill="none" stroke="#7a4cc0" stroke-width="2"/><path d="M22 8 q1 -6 6 -6" fill="none" stroke="#5c8f3a" stroke-width="3" stroke-linecap="round"/></svg>`,
    frog: `<svg viewBox="0 0 50 40"><path d="M6 30 Q4 14 16 12 Q18 4 24 8 Q30 4 34 12 Q46 14 44 30 Q25 38 6 30Z" fill="#7a4a2e" stroke="#2e2148" stroke-width="2.5"/><circle cx="18" cy="12" r="4" fill="#fff"/><circle cx="32" cy="12" r="4" fill="#fff"/><circle cx="18" cy="12" r="2" fill="#2e2148"/><circle cx="32" cy="12" r="2" fill="#2e2148"/><path d="M18 24 Q25 28 32 24" fill="none" stroke="#2e2148" stroke-width="2"/></svg>`,
    fish: `<svg viewBox="0 0 60 34"><path d="M8 17 Q22 2 40 10 L54 2 L50 17 L54 32 L40 24 Q22 32 8 17Z" fill="#ff9a52" stroke="#2e2148" stroke-width="2.5" stroke-linejoin="round"/><circle cx="18" cy="15" r="2.5" fill="#2e2148"/><path d="M26 10 q4 7 0 14 M33 11 q3 6 0 12" fill="none" stroke="#ffd25e" stroke-width="2"/></svg>`
  };
  const SETS = {
    spell: ['choc', 'lolli', 'frog', 'corn', 'gummy', 'choc', 'mint', 'corn', 'gold'],
    fiveyen: ['choc', 'lolli', 'corn', 'gummy', 'choc', 'lolli', 'mint', 'corn', 'gold'],
    dragon: ['choc', 'fish', 'lolli', 'corn', 'gummy', 'choc', 'fish', 'mint', 'corn'],
    glow: ['choc', 'lolli', 'corn', 'gummy', 'choc', 'lolli', 'mint', 'corn', 'gold']
  };
  const HOMES = [[96, 616], [140, 604], [186, 598], [232, 604], [276, 616], [118, 640], [164, 632], [210, 632], [254, 640]];

  function makeCandies(mech) {
    candies.forEach((c) => c.remove()); candies = [];
    SETS[mech].forEach((k, i) => {
      const c = document.createElement('div'); c.className = 'abs candy';
      c.innerHTML = CANDY[k] || wrapped(k === 'mint' ? '#a8ecd6' : '#ffd25e'); c.dataset.kind = k;
      const [x, y] = HOMES[i]; c.style.left = (x - 23) + 'px'; c.style.top = (y - 20) + 'px';
      stage.appendChild(c); candies.push(c); gsap.set(c, { rotation: Math.random() * 30 - 15 }); bindDrag(c);
    });
    gsap.from(candies, { y: 40, opacity: 0, stagger: .04, duration: .45, ease: 'back.out(2)' });
  }
  function center(el) {
    const r = el.getBoundingClientRect(), sr = stage.getBoundingClientRect(), k = sr.width / W;
    return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k, top: (r.top - sr.top) / k };
  }
  const targets = () => actors.map((a) => ({ a, el: node(a, 'bag') })).filter((t) => t.el);
  function bindDrag(c) {
    let sx, sy, moved, base;
    c.addEventListener('pointerdown', (e) => {
      if (step !== 'give' || c.dataset.used || c.dataset.flying) return;
      e.preventDefault(); c.setPointerCapture(e.pointerId); c.classList.add('dragging');
      sx = e.clientX; sy = e.clientY; moved = false; base = { x: gsap.getProperty(c, 'x'), y: gsap.getProperty(c, 'y') };
      gsap.to(c, { scale: 1.25, duration: .15 });
      targets().forEach((t) => gsap.to(t.el, { scale: 1.1, transformOrigin: '50% 50%', duration: .35, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    });
    c.addEventListener('pointermove', (e) => {
      if (!c.classList.contains('dragging')) return;
      const k = stage.getBoundingClientRect().width / W, dx = (e.clientX - sx) / k, dy = (e.clientY - sy) / k;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      gsap.set(c, { x: base.x + dx, y: base.y + dy });
    });
    const end = () => {
      if (!c.classList.contains('dragging')) return;
      c.classList.remove('dragging');
      targets().forEach((t) => { gsap.killTweensOf(t.el); gsap.set(t.el, { scale: 1 }); });
      const p = center(c); let best = null, bd = 1e9;
      targets().forEach((t) => { const q = center(t.el), d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = t; } });
      if (!moved) fly(c, pickTarget(c));
      else if (best && bd < 100) give(c, best);
      else home(c);
    };
    c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
  }
  function pickTarget(c) {
    const t = targets();
    if (VISITORS[vi].mech === 'dragon') { const tl = t.find((x) => x.a.name === 'toothless'), hc = t.find((x) => x.a.name === 'hiccup'); return c.dataset.kind === 'fish' ? tl : hc; }
    return t.sort((a, b) => (st.given[a.a.name] || 0) - (st.given[b.a.name] || 0))[0];
  }
  function home(c) { gsap.to(c, { x: 0, y: 0, scale: 1, opacity: 1, duration: .5, ease: 'back.out(2)' }); }
  function fly(c, t) {
    if (!t) return;
    c.dataset.flying = 1;
    const a = center(c), b = center(t.el), bx = gsap.getProperty(c, 'x'), by = gsap.getProperty(c, 'y');
    const spell = VISITORS[vi]?.mech === 'spell';
    const tl = gsap.timeline({ onComplete: () => { delete c.dataset.flying; give(c, t); } });
    if (spell) {
      if (!st.cast) { st.cast = true; bigSay('Wingardium Leviosa!', 1.4); }
      sfx.magic();
      tl.to(c, { y: by - 80, rotation: '+=20', scale: 1.15, duration: .55, ease: 'sine.out' })
        .to(c, { rotation: '-=30', duration: .25, yoyo: true, repeat: 1, ease: 'sine.inOut' })
        .to(c, { x: bx + (b.x - a.x), y: by + (b.y - a.y), scale: .6, rotation: '+=40', duration: .65, ease: 'power1.inOut',
          onUpdate() { if (Math.random() < .35) trail(center(c)); } });
    } else {
      tl.to(c, { keyframes: [
        { x: bx + (b.x - a.x) * .5, y: by + (b.y - a.y) * .5 - 120, rotation: '+=200', scale: 1.1, duration: .32, ease: 'power1.out' },
        { x: bx + (b.x - a.x), y: by + (b.y - a.y), rotation: '+=160', scale: .6, duration: .3, ease: 'power1.in' }
      ] });
    }
  }
  function trail(p) {
    const s = document.createElement('div'); s.className = 'trail'; s.style.left = (p.x - 5) + 'px'; s.style.top = (p.y - 5) + 'px';
    s.innerHTML = sparkSVG(['#ffd98a', '#a8ecd6', '#fff'][Math.floor(Math.random() * 3)]); stage.appendChild(s);
    gsap.fromTo(s, { scale: 1, opacity: 1 }, { scale: 0, opacity: 0, y: 10, duration: .6, onComplete: () => s.remove() });
  }
  function give(c, t) {
    if (c.dataset.used) return;
    const M = MECH[VISITORS[vi].mech];
    if (M.accept && !M.accept(t.a, c)) { sfx.nope(); home(c); return; }
    c.dataset.used = 1;
    gsap.to(c, { scale: .3, opacity: 0, duration: .18, onComplete: () => c.remove() });
    sfx.rustle();
    gsap.fromTo(t.el, { scale: 1 }, { scale: 1.18, transformOrigin: '50% 50%', duration: .09, yoyo: true, repeat: 1 });
    hearts(center(t.el));
    gsap.fromTo(t.a.el, { scaleX: 1.12, scaleY: .88 }, { scaleX: 1, scaleY: 1, duration: .6, ease: 'elastic.out(1.2, .35)' });
    st.given[t.a.name]++; st.total++;
    M.react(t.a, c);
    if (M.ready() && $('#done').hidden && step === 'give') {
      $('#done').hidden = false; gsap.fromTo('#done', { opacity: 0, y: 20, xPercent: -50 }, { opacity: 1, y: 0, xPercent: -50, duration: .4, ease: 'back.out(2)' });
    }
    if (!candies.some((x) => !x.dataset.used)) gsap.delayedCall(1.2, finishGiving);
  }

  /* ================= reactions ================= */
  function say(n, text, hold = 2.2) {
    const a = actor(n); if (!a) return;
    let b = document.getElementById('bub-' + a.p);
    if (!b) { b = document.createElement('div'); b.className = 'bub'; b.id = 'bub-' + a.p; $('#bubbles').appendChild(b); }
    $$('#bubbles .bub').forEach((o) => { if (o !== b) { gsap.killTweensOf(o); gsap.to(o, { opacity: 0, duration: .15 }); } });
    b.textContent = text; gsap.killTweensOf(b);
    const c = center(a.el), w = b.offsetWidth, h = b.offsetHeight;
    b.style.left = Math.max(8, Math.min(W - w - 8, c.x - w / 2)) + 'px';
    b.style.top = Math.max(118, c.top + a.el.offsetWidth * .2 - h - 6) + 'px';
    gsap.fromTo(b, { opacity: 0, scale: .5, transformOrigin: '50% 100%' }, { opacity: 1, scale: 1, duration: .35, ease: 'back.out(2.6)' });
    if (hold) gsap.to(b, { opacity: 0, duration: .3, delay: hold });
  }
  function bigSay(text, hold = 1.8) {
    $$('#bubbles .bub').forEach((o) => { gsap.killTweensOf(o); gsap.to(o, { opacity: 0, duration: .15 }); });
    const b = $('#bubBig'); b.textContent = text; gsap.killTweensOf(b);
    gsap.fromTo(b, { opacity: 0, scale: .4, xPercent: -50 }, { opacity: 1, scale: 1, xPercent: -50, duration: .4, ease: 'back.out(2.6)' });
    gsap.to(b, { opacity: 0, duration: .3, delay: hold });
  }
  function cap(text) {
    const el = $('#cap');
    gsap.timeline().to(el, { opacity: 0, y: -6, duration: .2 }).add(() => { el.textContent = text; }).to(el, { opacity: 1, y: 0, duration: .4, ease: 'back.out(1.6)' });
  }
  function setMouth(a, kind) { const m = node(a, 'mouth'), d = ART.MOUTH[kind]; if (m && d) { m.setAttribute('d', d.d); m.setAttribute('fill', d.fill); } }
  function happy(a, ms = 1400) {
    const e = node(a, 'eyes'), h = node(a, 'happy'); if (!e || !h) return;
    gsap.set(e, { opacity: 0 }); gsap.set(h, { opacity: 1 });
    gsap.delayedCall(ms / 1000, () => { gsap.set(e, { opacity: 1 }); gsap.set(h, { opacity: 0 }); });
  }
  function hop(a) { gsap.fromTo(a.el, { y: 0 }, { y: -26, duration: .18, yoyo: true, repeat: 1, ease: 'power2.out' }); }
  function hearts(p, n = 7, spread = 2.2, dist = 50, cols = ['#ff8fbd', '#ffd25e', '#a8ecd6', '#ff6fa8', '#c7a6ff']) {
    for (let i = 0; i < n; i++) {
      const h = document.createElement('div'); h.className = 'abs';
      h.style.cssText = `left:${p.x - 9}px;top:${p.y - 9}px;width:${i % 2 ? 14 : 18}px;z-index:85;pointer-events:none`;
      h.innerHTML = i % 3 === 2 ? sparkSVG(cols[i % cols.length]) : heartSVG(cols[i % cols.length]); stage.appendChild(h);
      const ang = -Math.PI / 2 + (Math.random() - .5) * spread, d = dist + Math.random() * 50;
      gsap.fromTo(h, { scale: 0, rotation: Math.random() * 40 - 20 }, { x: Math.cos(ang) * d, y: Math.sin(ang) * d, scale: 1, duration: .55, ease: 'back.out(2)',
        onComplete: () => gsap.to(h, { y: '-=24', opacity: 0, duration: .5, onComplete: () => h.remove() }) });
    }
  }

  const MECH = {
    spell: {
      react(a, c) {
        happy(a); hop(a);
        const n = st.given[a.name];
        if (c.dataset.kind === 'frog') { say('ron', 'A Chocolate Frog! Careful, they jump!', 2.4); return; }
        if (a.name === 'hermione') say('hermione', n === 1 ? 'It\'s Levi-O-sa, not Levio-SA!' : 'Ten points to Ravenclaw!');
        else if (a.name === 'ron') say('ron', n === 1 ? 'Bloody brilliant!' : 'Mum never lets me have this many!');
        else say('harry', n === 1 ? `Thanks, ${name}!` : 'Best house in the whole village.');
      },
      ready: () => ['hermione', 'harry', 'ron'].every((n) => st.given[n] >= 1)
    },
    fiveyen: {
      react(a) {
        const n = st.given.yato; happy(a);
        if (n === 1) say('yato', 'Wait... a real offering?! For ME?!');
        else if (n === 2) { say('yato', 'Nobody ever gives me stuff...', 2.6); const t = node(a, 'tears'); if (t) gsap.to(t, { opacity: 1, duration: .3 }); setMouth(a, 'open'); }
        else say('yato', 'You\'re officially my favorite worshipper!!');
        hop(a);
      },
      ready: () => st.given.yato >= 2
    },
    dragon: {
      accept(a, c) {
        if (a.name !== 'toothless' || c.dataset.kind === 'fish') return true;
        say('toothless', '(sniffs it... and turns away)', 1.6);
        gsap.fromTo(a.el, { rotation: 0 }, { rotation: -6, duration: .25, yoyo: true, repeat: 1 });
        if (!st.warned) { st.warned = true; gsap.delayedCall(1.4, () => say('hiccup', 'He only eats fish. Got any fish?', 2.4)); }
        return false;
      },
      react(a, c) {
        if (a.name === 'toothless') {
          setMouth(a, 'gummy'); happy(a, 2200); sfx.warble();
          say('toothless', '(gummy smile)', 1.8); hop(a);
          gsap.delayedCall(2.2, () => setMouth(a, 'shut'));
        } else {
          happy(a); hop(a);
          say('hiccup', c.dataset.kind === 'fish' ? 'Uh... I\'ll give this one to him later.' : st.given.hiccup === 1 ? 'Thanks! Way better than Viking candy.' : 'You\'re spoiling us.');
        }
      },
      ready: () => st.given.toothless >= 1 && st.given.hiccup >= 1
    },
    glow: {
      react(a) {
        const lvl = Math.min(1, st.total / 5);
        actors.forEach((x) => { const g = node(x, 'glow'); if (g) gsap.to(g, { opacity: .18 + .82 * lvl, duration: .6 }); });
        for (let i = 0; i < 2; i++) wisp($('#cast'), 20 + Math.random() * 170, 140 + Math.random() * 120, true);
        happy(a); hop(a);
        const lines = { tuk: ['Yay!! Candy!', 'I\'m glowing!!'], kiri: ['(smiles and glows)', 'Thank you.'], jake: [`Thanks, ${name}.`, 'Look at that glow.'], neytiri: ['You are kind.', 'The forest likes you.'] };
        say(a.name, lines[a.name][Math.min(st.given[a.name] - 1, 1)]);
      },
      ready: () => st.total >= 4
    }
  };

  /* ================= the knock cycle ================= */
  function idle(a, i) {
    if (reduce) return;
    gsap.to(a.el, { y: -5 - (i % 2) * 2, duration: .55 + i * .12, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.2 + i * .2 });
    const tip = node(a, 'wandtip'); if (tip) gsap.to(tip, { opacity: .7, duration: .8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    const wg = node(a, 'wing'); if (wg) gsap.to(wg, { scaleY: .92, svgOrigin: '100 190', duration: .9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    const e = node(a, 'eyes'); if (e) gsap.to(e, { scaleY: .1, svgOrigin: '100 122', duration: .07, yoyo: true, repeat: 1, delay: 2 + Math.random() * 3,
      onComplete: function () { this.delay(2 + Math.random() * 3).restart(true); } });
  }
  function ring() {
    step = 'ring';
    const finale = vi === 4;
    finale ? sfx.chime() : sfx.bell();
    gsap.to(world, { scale: 1.04, duration: 1.4, ease: 'power2.out' });
    gsap.fromTo('#peepCast', { y: 50 }, { y: 0, duration: .6, ease: 'back.out(1.6)' });
    if (!reduce) gsap.to('#peepCast', { y: -5, duration: .35, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: .6 });
    if (!finale) gsap.delayedCall(.9, sfx.giggle);
    cap(finale ? 'One last knock. This one sounds different...' : VISITORS[vi].peep);
    gsap.to('#hint', { opacity: 1, duration: .3, delay: .8 });
    gsap.to('#hint', { opacity: .35, duration: .7, yoyo: true, repeat: -1, delay: 1.4 });
    if (auto.open) gsap.delayedCall(1.2, openDoor);
  }
  function openDoor() {
    if (step !== 'ring') return;
    step = 'open';
    gsap.killTweensOf('#hint'); gsap.to('#hint', { opacity: 0, duration: .2 });
    gsap.killTweensOf('#peepCast'); sfx.creak();
    gsap.to(world, { scale: 1, duration: 1.2, ease: 'power2.inOut' });
    if (vi === 4) return openFinale();
    const V = VISITORS[vi], tl = gsap.timeline();
    tl.to('#door', { rotationY: -100, duration: 1.2, ease: 'power3.inOut' }).to('#roomFog', { opacity: 1, duration: 1.4 }, '<.4');
    actors.forEach((a, i) => tl.to(a.el, { y: 0, opacity: 1, duration: .55, ease: 'back.out(2.2)' }, i === 0 ? '-=.5' : '<.12'));
    tl.add(() => { bigSay('TRICK OR TREAT!!', 1.5); sfx.cheer(); }, '<.2');
    V.greet.forEach(([n, t], i) => tl.add(() => say(n, t, 2.4), `+=${i === 0 ? 1.3 : .8}`));
    tl.add(() => { step = 'give'; cap(V.cap); actors.forEach(idle); if (auto.give) autoGive(); }, '+=.3');
  }

  function finishGiving() {
    if (step !== 'give') return;
    step = 'special';
    $('#done').hidden = true;
    candies.forEach((c) => { if (!c.dataset.used) gsap.to(c, { opacity: .4, duration: .3 }); });
    ({ spell: sortingHat, fiveyen: showYen, dragon: handMoment, glow: spriteSwarm })[VISITORS[vi].mech]();
  }
  function afterSpecial() {
    const V = VISITORS[vi];
    V.gift.forEach(([n, t], i) => gsap.delayedCall(i * .8, () => say(n, t, 2.4)));
    gsap.delayedCall(1.2, () => unbox(V, vi));
  }

  /* Harry Potter: the Sorting Hat */
  function sortingHat() {
    cap('Harry brought someone else...');
    $('#hatWrap').innerHTML = ART.hat; $('#hatSay').textContent = ''; gsap.set('#raven', { opacity: 0, scale: .6 });
    gsap.set('#sorting', { autoAlpha: 0 }); gsap.to('#sorting', { autoAlpha: 1, duration: .5 });
    gsap.fromTo('#hatWrap', { y: -120, rotation: -10 }, { y: 0, rotation: 0, duration: .9, ease: 'bounce.out' });
    const talk = () => gsap.fromTo('#hatMouth', { scaleY: .4 }, { scaleY: 1.3, svgOrigin: '104 124', duration: .12, yoyo: true, repeat: 9 });
    const lines = ['Hmm... difficult. Very difficult.', 'Plenty of courage, I see. But oh, what a curious mind...', `Clever, kind, endlessly curious... I know exactly where to put you, ${name}.`];
    const tl = gsap.timeline({ delay: 1 });
    lines.forEach((l) => tl.add(() => { $('#hatSay').textContent = l; talk(); sfx.giggle(); }).to({}, { duration: 2.1 }));
    tl.add(() => { $('#hatSay').textContent = ''; sfx.fanfare(); confetti(70, 195, 360, ['#1f3a7a', '#c08a4a', '#f3d9a8', '#5a7ac8']); talk(); })
      .to('#raven', { opacity: 1, scale: 1, duration: .6, ease: 'back.out(2.4)' }, '<')
      .to('#sorting', { autoAlpha: 0, duration: .5, delay: 2.6 })
      .add(afterSpecial);
  }
  /* Noragami: the 5-yen wish card */
  function showYen() {
    cap('He handed you his business card.');
    sfx.pop(); step = 'yen';
    gsap.fromTo('#yen', { autoAlpha: 0, y: 40, rotation: -8, scale: .6 }, { autoAlpha: 1, y: 0, rotation: -3, scale: 1, duration: .6, ease: 'back.out(2)' });
    if (auto.card) gsap.delayedCall(1.2, flipYen);
  }
  function flipYen() {
    if (step !== 'yen') return;
    step = 'yenRead'; sfx.cheer();
    gsap.to('#yen .flip', { rotationY: 180, duration: .7, ease: 'back.out(1.4)' });
    gsap.delayedCall(2.8, () => { gsap.to('#yen', { autoAlpha: 0, y: -40, duration: .4, onComplete: () => gsap.set('#yen .flip', { rotationY: 0 }) }); afterSpecial(); });
  }
  /* How to Train Your Dragon: Toothless presses his nose to her hand */
  function handMoment() {
    cap('Toothless wants to say thank you. Hold out your hand.');
    say('hiccup', 'He likes you. Go on, hold out your hand.', 2.6);
    $('#handBtn').hidden = false;
    gsap.fromTo('#handBtn', { opacity: 0, y: 20, xPercent: -50 }, { opacity: 1, y: 0, xPercent: -50, duration: .4, ease: 'back.out(2)' });
    step = 'hand';
    if (auto.card) gsap.delayedCall(1, touch);
  }
  function touch() {
    if (step !== 'hand') return;
    step = 'touching';
    $('#handBtn').hidden = true;
    const t = actor('toothless'); gsap.killTweensOf(t.el);
    gsap.timeline()
      .to(candies.filter((c) => !c.dataset.used), { opacity: 0, duration: .3 })
      .to('#hands', { y: 200, duration: .5, ease: 'power2.in' }, '<')
      .to('#herHand', { y: -330, duration: .9, ease: 'power2.out' })
      .add(() => { gsap.set(node(t, 'eyes'), { opacity: 0 }); gsap.set(node(t, 'happy'), { opacity: 1 }); })
      .to(t.el, { scale: 1.35, y: 26, x: 18, duration: 1.1, ease: 'power2.inOut' }, '<')
      .add(() => { sfx.chime(); hearts({ x: 195, y: 470 }, 16, 6.3, 70, ['#b8e04a', '#a8ecd6', '#ff8fbd', '#fff']); gsap.fromTo(stage, { filter: 'brightness(1.35)' }, { filter: 'brightness(1)', duration: 1.2 }); cap('Toothless trusts you.'); })
      .to({}, { duration: 2 })
      .to('#herHand', { y: 0, duration: .7, ease: 'power2.in' })
      .to(t.el, { scale: 1, y: 0, x: 0, duration: .8, ease: 'power2.inOut' }, '<')
      .to('#hands', { y: 0, duration: .6, ease: 'power2.out' })
      .add(() => { gsap.set(node(t, 'eyes'), { opacity: 1 }); gsap.set(node(t, 'happy'), { opacity: 0 }); afterSpecial(); });
  }
  /* Avatar: the woodsprites come, and "I see you" */
  function spriteSwarm() {
    actors.forEach((x) => { const g = node(x, 'glow'); if (g) gsap.to(g, { opacity: 1, duration: .8 }); });
    sfx.chime();
    for (let i = 0; i < 14; i++) gsap.delayedCall(i * .12, () => wisp($('#wisps'), 90 + Math.random() * 210, 260 + Math.random() * 300, true));
    cap('The woodsprites came to see you.');
    gsap.delayedCall(2.4, () => say('neytiri', `I see you, ${name}.`, 3));
    gsap.delayedCall(5, afterSpecial);
  }

  /* ================= Happy Meal unboxing + collector card ================= */
  let boxing = null;
  function unbox(V, idx) {
    boxing = { V, idx }; step = 'box';
    $('#boxHold').innerHTML = ART.box(V.world, V.box);
    $('#rise').innerHTML = ART.toy(V.toy);
    gsap.set('#rise', { opacity: 0, y: 0, rotation: 0, scale: .5 }); gsap.set('#rays', { opacity: 0, scale: .4 });
    gsap.set('#boxHold', { opacity: 1 });
    gsap.set('#unbox', { autoAlpha: 0 }); gsap.to('#unbox', { autoAlpha: 1, duration: .5 });
    gsap.set('#tapOpen', { opacity: 1 });
    gsap.fromTo('#boxHold', { y: 260, rotation: -14, scale: .6 }, { y: 0, rotation: 0, scale: 1, duration: .8, ease: 'back.out(1.7)' });
    gsap.to('#boxHold', { rotation: 3, duration: .3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });
    gsap.to('#tapOpen', { opacity: .4, duration: .7, yoyo: true, repeat: -1, delay: 1 });
    sfx.pop();
    if (auto.card) gsap.delayedCall(1.2, openBox);
  }
  function openBox() {
    if (step !== 'box') return;
    step = 'opening';
    gsap.killTweensOf('#boxHold'); gsap.killTweensOf('#tapOpen'); gsap.to('#tapOpen', { opacity: 0, duration: .2 });
    gsap.timeline()
      .add(sfx.shake).to('#boxHold', { rotation: -6, duration: .07, yoyo: true, repeat: 5 }).to('#boxHold', { rotation: 0, duration: .05 })
      .add(sfx.burst)
      .to('#boxHold .lidL', { x: -40, y: -60, rotation: -50, opacity: 0, transformOrigin: '50% 50%', duration: .55, ease: 'power2.out' })
      .to('#boxHold .lidR', { x: 40, y: -60, rotation: 50, opacity: 0, transformOrigin: '50% 50%', duration: .55, ease: 'power2.out' }, '<')
      .to('#boxHold .topper', { y: -40, opacity: 0, duration: .4 }, '<')
      .to('#rays', { opacity: 1, scale: 1.2, duration: .5 }, '<')
      .add(() => gsap.to('#rays', { rotation: '+=360', duration: 8, ease: 'none', repeat: -1 }), '<')
      .to('#rise', { opacity: 1, y: -150, scale: 1, duration: 1.1, ease: 'back.out(1.4)' }, '<.1')
      .to('#rise', { keyframes: [{ scaleX: -1, duration: .25 }, { scaleX: 1, duration: .25 }, { scaleX: -1, duration: .25 }, { scaleX: 1, duration: .25 }], ease: 'none' }, '<')
      .add(() => hearts(center($('#rise')), 18, 6.3, 90, ['#ffd98a', '#fff', '#ff8fbd', '#a8ecd6']), '<.5')
      .add(() => gimmick($('#rise .toyfig')), '+=.2')
      .add(showCard, '+=1.1');
  }
  function showCard() {
    const { V, idx } = boxing, m = (STORY.memories || [])[idx] || {};
    $('#ccBand').style.background = V.band; $('#ccSeries').textContent = `${V.series} x`;
    $('#ccToy').innerHTML = ART.toy(V.toy); $('#ccName').textContent = V.toyName;
    $('#ccNum').textContent = idx === 4 ? 'Secret #5 of 5' : `#${idx + 1} of 5 · Collect them all!`;
    $('#ccDots').innerHTML = [0, 1, 2, 3, 4].map((i) => `<i class="${i <= idx ? 'on' : ''}"></i>`).join('');
    $('#cEyebrow').textContent = `${V.series} x Happy Meal · #${idx + 1}`;
    $('#cTitle').textContent = m.title || '';
    const ph = $('#cPhoto');
    if (m.photo) { ph.className = 'photo has'; ph.innerHTML = `<img src="${m.photo}" alt="">`; } else { ph.className = 'photo'; ph.textContent = 'your photo of you two goes here'; }
    $('#cText').textContent = m.text || '';
    gsap.set('#card .flip', { rotationY: 0 });
    gsap.to('#rise', { opacity: 0, duration: .3 });
    gsap.to('#boxHold', { y: 300, opacity: 0, duration: .5, ease: 'power2.in' });
    gsap.set('#card', { visibility: 'visible' });
    gsap.fromTo('#card', { opacity: 0, y: 80, scale: .85 }, { opacity: 1, y: 0, scale: 1, duration: .7, ease: 'back.out(1.5)' });
    step = 'card';
    if (auto.card && !auto.party) gsap.delayedCall(1.4, flipCard);
  }
  function flipCard() { sfx.pop(); gsap.to('#card .flip', { rotationY: '+=180', duration: .8, ease: 'back.out(1.2)' }); }
  function gimmick(svg) {
    if (!svg) return;
    const k = svg.dataset.toy, q = (s) => svg.querySelector(s);
    gsap.fromTo(svg, { y: 0 }, { y: -14, duration: .18, yoyo: true, repeat: 1, ease: 'power2.out' });
    if (k === 'harry') { sfx.magic(); gsap.fromTo(q('[id$="-wandtip"]'), { attr: { r: 7 }, opacity: .3 }, { attr: { r: 18 }, opacity: 1, duration: .2, yoyo: true, repeat: 5 }); }
    else if (k === 'toothless') { sfx.warble(); gsap.fromTo(q('[id$="-wing"]'), { scaleY: 1 }, { scaleY: .55, svgOrigin: '100 190', duration: .12, yoyo: true, repeat: 7 }); }
    else if (k === 'neytiri') { sfx.chime(); gsap.fromTo(q('[id$="-glow"]'), { opacity: .2 }, { opacity: 1, duration: .4, yoyo: true, repeat: 3 });
      gsap.fromTo(svg, { filter: 'drop-shadow(0 0 0px #a8fbff)' }, { filter: 'drop-shadow(0 0 12px #a8fbff)', duration: .4, yoyo: true, repeat: 3 }); }
    else if (k === 'yato') { sfx.pop(); const c = q('[id$="-coin"]'); gsap.set(c, { opacity: 1 });
      gsap.fromTo(c, { y: 0, scaleX: 1 }, { y: -60, scaleX: -1, svgOrigin: '40 200', duration: .35, yoyo: true, repeat: 1, ease: 'power2.out', onComplete: () => gsap.to(c, { opacity: 0, delay: .5 }) }); }
    else if (k === 'golden') { sfx.burst(); gsap.fromTo(svg, { rotationY: 0 }, { rotationY: 360, duration: 1 }); hearts(center(svg), 12, 6.3, 60, ['#ffd25e', '#fff0a8', '#ff8fbd']); }
  }
  const magicLine = { candles: 'They left floating candles in your hallway.', charm: 'Yato left a lucky charm on your wall.',
    dragon: 'A dragon-scale garland... and your lamp is glowing blue.', pandora: 'Glowing Pandora plants just bloomed in your hallway.' };
  function keep() {
    if (step !== 'card') return;
    step = 'bye';
    const { V, idx } = boxing;
    gsap.killTweensOf('#rays');
    const tl = gsap.timeline();
    tl.to('#card', { opacity: 0, x: 140, y: -40 + idx * 40, scale: .1, rotation: 20, duration: .65, ease: 'power3.in' })
      .set('#card', { visibility: 'hidden', x: 0, y: 0, rotation: 0 })
      .to('#unbox', { autoAlpha: 0, duration: .4 }, '<.3');
    if (idx === 4) { tl.add(showFinal); return; }
    tl.add(() => { placeToy(idx, V.toy, true); sfx.pop(); })
      .add(() => V.bye.forEach(([n, t]) => say(n, t, 1.8)), '+=.4')
      .add(() => actors.forEach((a) => gsap.killTweensOf(a.el)), '+=1.4')
      .add(() => actors.forEach((a, i) => gsap.to(a.el, { y: -150, scale: .3, opacity: 0, duration: 1.3, ease: 'power1.in', delay: i * .12 })))
      .add(() => sfx.creak(), '+=1.2')
      .to('#door', { rotationY: 0, duration: 1, ease: 'power3.inOut' })
      .to('#roomFog', { opacity: 0, duration: .8 }, '<')
      .add(() => { MAGIC[V.magic](true); sfx.magic(); setClock(hour + 1); cap(magicLine[V.magic]); })
      .add(() => {
        const n = idx + 1;
        if (n < 4) { setupVisitor(n); gsap.delayedCall(2.8, () => cap(`${n} of 4 visitors. Someone else is coming up the walk...`)); gsap.delayedCall(4.4, ring); }
        else { setupFinale(); gsap.delayedCall(3, () => cap('The street is getting quiet...')); gsap.delayedCall(4.6, ring); }
        step = 'wait';
      }, '+=.6');
  }

  /* ================= finale ================= */
  function setupFinale() {
    vi = 4; actors = []; $('#cast').innerHTML = ''; $('#bubbles').innerHTML = '';
    candies.forEach((c) => gsap.to(c, { opacity: 0, duration: .4, onComplete: () => c.remove() })); candies = [];
    $('#peepCast').innerHTML = `<svg viewBox="0 0 50 70" style="width:46px"><path d="M25 0 v12" stroke="#000" stroke-width="3"/><path d="M25 66 C-8 42 4 12 25 26 C46 12 58 42 25 66Z" fill="#000"/></svg>`;
  }
  function openFinale() {
    gsap.timeline()
      .to('#door', { rotationY: -100, duration: 1.3, ease: 'power3.inOut' })
      .to('#roomFog', { opacity: 1, duration: 1.2 }, '<.4')
      .fromTo('#lantern', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '-=.4')
      .add(() => { cap('Nobody is there. Just a heart balloon with a note: "Come outside."'); if (!reduce) gsap.to('#lantern', { y: -10, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }); })
      .add(() => { $('#done').textContent = 'Step outside'; $('#done').hidden = false; step = 'outside';
        gsap.fromTo('#done', { opacity: 0, y: 20, xPercent: -50 }, { opacity: 1, y: 0, xPercent: -50, duration: .4, ease: 'back.out(2)' });
        if (auto.party) goOutside(); }, '+=.6');
  }
  function buildParty() {
    const bulbs = $('#bulbs'); bulbs.innerHTML = '';
    for (let i = 0; i < 15; i++) { const x = 13 + i * 26, y = 6 + 64 * (x / 390) * (1 - x / 390) * 2;
      bulbs.insertAdjacentHTML('beforeend', `<circle class="bulb" cx="${x}" cy="${y + 6}" r="6" fill="#4a3a66" stroke="#2e2148" stroke-width="2" data-c="${fcol[i % 4]}"/>`); }
    const bf = $('#bannerFlags'); bf.innerHTML = '';
    [...'HAPPY BIRTHDAY'].forEach((ch, i) => { const x = 22 + i * 26.6, y = 4 + 36 * (x / 390) * (1 - x / 390) * 2; if (ch === ' ') return;
      bf.insertAdjacentHTML('beforeend', `<g class="pen" transform="translate(${x} ${y})"><path d="M-12 0 L12 0 L12 22 L0 30 L-12 22Z" fill="${['#ff8fbd', '#ffd25e', '#a8ecd6', '#c7a6ff', '#ff9a52'][i % 5]}" stroke="#2e2148" stroke-width="2"/><text x="0" y="17" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="13" fill="#2e2148">${ch}</text></g>`); });
    const crowd = $('#crowd'); crowd.innerHTML = '';
    [['hermione', 2, 0], ['harry', 78, -6], ['ron', 154, 0], ['yato', 230, -6], ['hiccup', 304, 0],
     ['kiri', -10, 92], ['jake', 62, 82], ['toothless', 140, 96, 108], ['neytiri', 244, 82], ['tuk', 318, 100, 74]].forEach(([n, x, y, w]) => {
      const el = document.createElement('div'); el.className = 'actor'; el.style.cssText = `left:${x}px;top:${y}px${w ? `;width:${w}px` : ''}`;
      el.innerHTML = ART.char(n, `pt${n}`); crowd.appendChild(el); });
    $$('#crowd [id$="-glow"]').forEach((g) => gsap.set(g, { opacity: .9 }));
    const cg = $('#candles'); cg.innerHTML = '';
    [52, 71, 90, 109, 128].forEach((x, i) => cg.insertAdjacentHTML('beforeend', `<rect x="${x - 4}" y="30" width="8" height="30" rx="3" fill="${['#ff8fbd', '#a8ecd6', '#ffd25e', '#c7a6ff', '#ff8fbd'][i]}" stroke="#2e2148" stroke-width="2.5"/>
      <g class="flame" id="flame${i}"><path d="M${x} 8 Q${x + 9} 20 ${x} 28 Q${x - 9} 20 ${x} 8Z" fill="#ffb347"/><path d="M${x} 15 Q${x + 4} 22 ${x} 26 Q${x - 4} 22 ${x} 15Z" fill="#fff3c2"/></g>`));
    if (!reduce) $$('.flame').forEach((f, i) => gsap.to(f, { scaleY: 1.15, scaleX: .9, svgOrigin: `${[52, 71, 90, 109, 128][i]} 28`, duration: .18 + i * .03, yoyo: true, repeat: -1 }));
    for (let i = 0; i < 8; i++) wisp($('#party'), 20 + Math.random() * 350, 250 + Math.random() * 300, true);
  }
  function goOutside() {
    if (step !== 'outside') return;
    step = 'party';
    $('#done').hidden = true; $('#cap').textContent = '';
    gsap.killTweensOf('#lantern');
    buildParty();
    gsap.set('#party', { visibility: 'visible' });
    gsap.timeline()
      .to('#hands', { y: 220, duration: .8, ease: 'power2.in' })
      .to(world, { scale: 4.2, duration: 1.4, ease: 'power3.in' }, '<')
      .to(world, { opacity: 0, duration: .5 }, '-=.5')
      .set('#party', { opacity: 1 })
      .add(() => $$('.bulb').forEach((b, i) => gsap.to(b, { attr: { fill: b.dataset.c }, duration: .05, delay: i * .07, onStart: () => i % 3 === 0 && sfx.pop() })), '+=.4')
      .add(() => { sfx.fanfare(); bigSay('SURPRISE!!', 2); confetti(70, 195, 300); }, '+=1.1')
      .fromTo('#crowd .actor', { y: 30 }, { y: 0, duration: .5, stagger: .05, ease: 'back.out(3)' }, '<')
      .fromTo('.pen', { opacity: 0, y: -20 }, { opacity: 1, y: 0, stagger: .05, duration: .4, ease: 'back.out(2)' }, '<.2')
      .fromTo('#pTitle', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .8, ease: 'elastic.out(1, .5)' }, '<.4')
      .add(() => {
        $('#pCap').textContent = 'Make a wish, then tap the cake to blow out the candles.';
        gsap.fromTo('#pCap', { opacity: 0 }, { opacity: 1, duration: .5 });
        if (!reduce) $$('#crowd .actor').forEach((el, i) => gsap.to(el, { y: -8, duration: .5 + (i % 3) * .1, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * .1 }));
        step = 'cake'; if (auto.letter) { blow(); blow(); blow(); }
      }, '+=.6');
  }
  function blow() {
    if (step !== 'cake') return;
    sfx.blow();
    $$('.flame').filter((f) => !f.dataset.out).slice(0, 2).forEach((f) => { f.dataset.out = 1; gsap.killTweensOf(f); gsap.to(f, { opacity: 0, scale: .2, duration: .3 }); });
    gsap.fromTo('#cake', { rotation: -2 }, { rotation: 0, duration: .4, ease: 'elastic.out(1, .3)' });
    if (!$$('.flame').some((f) => !f.dataset.out)) celebrate();
  }
  function celebrate() {
    step = 'celebrate'; sfx.fanfare();
    bigSay(`HAPPY BIRTHDAY, ${name.toUpperCase()}!!`, 2.6);
    confetti(120, 195, 520);
    $('#pCap').textContent = '';
    for (let i = 0; i < 8; i++) {
      const b = document.createElement('div'); b.className = 'balloon';
      const c = ['#ff8fbd', '#ffd25e', '#a8ecd6', '#c7a6ff', '#ff9a52'][i % 5];
      b.innerHTML = `<svg viewBox="0 0 44 80"><ellipse cx="22" cy="22" rx="18" ry="22" fill="${c}" stroke="#2e2148" stroke-width="2.5"/><path d="M22 44 q-6 14 2 34" fill="none" stroke="#2e2148" stroke-width="1.5"/><ellipse cx="15" cy="14" rx="4" ry="7" fill="#fff" opacity=".45"/></svg>`;
      b.style.left = (10 + i * 46) + 'px'; b.style.top = '820px'; $('#party').appendChild(b);
      gsap.to(b, { y: -1000, x: '+=' + (Math.random() * 60 - 30), duration: 6 + Math.random() * 3, ease: 'none', delay: i * .25 });
    }
    gsap.delayedCall(auto.letter ? .4 : 3.2, showLetter);
  }
  function confetti(n, x, y, cols = ['#ff8fbd', '#ffd25e', '#a8ecd6', '#c7a6ff', '#ff9a52', '#fff6ea']) {
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div'); c.className = 'confetti';
      c.style.cssText = `left:${x}px;top:${y}px;background:${cols[i % cols.length]};${i % 4 === 0 ? 'border-radius:50%;width:9px;height:9px;' : ''}`;
      stage.appendChild(c);
      if (window.Physics2DPlugin && !reduce) gsap.to(c, { physics2D: { velocity: 350 + Math.random() * 450, angle: -150 + Math.random() * 120, gravity: 700 }, rotation: Math.random() * 720, duration: 3, ease: 'none', onComplete: () => c.remove() });
      else gsap.to(c, { x: Math.random() * 300 - 150, y: 300 + Math.random() * 200, opacity: 0, duration: 2, onComplete: () => c.remove() });
    }
  }
  function showLetter() {
    step = 'letter';
    const box = $('#letterLines'); box.innerHTML = '';
    (STORY.letter || []).forEach((t) => { const p = document.createElement('p'); p.textContent = t; box.appendChild(p); });
    $('#letterSig').textContent = '— ' + (STORY.from || '');
    gsap.set('#letter', { visibility: 'visible' });
    gsap.fromTo('#letter', { opacity: 0, y: 60, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .8, ease: 'back.out(1.5)' });
    gsap.from('#letterLines p, #letterSig, #letterNext', { opacity: 0, y: 14, duration: .6, stagger: .45, delay: .5 });
    if (auto.invite) gsap.delayedCall(.2, showInvite);
  }
  function showInvite() {
    if (step !== 'letter') return;
    step = 'invite';
    gsap.to('#letter', { opacity: 0, y: -40, duration: .4, onComplete: () => gsap.set('#letter', { visibility: 'hidden' }) });
    $('#inviteText').textContent = STORY.invite;
    gsap.set('#invite', { visibility: 'visible' });
    gsap.fromTo('#invite', { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .7, ease: 'back.out(2)', delay: .3 });
    if (auto.final) gsap.delayedCall(.2, sayYes);
  }
  function sayYes() {
    if (step !== 'invite') return;
    step = 'yes'; sfx.fanfare();
    hearts({ x: 195, y: 400 }, 30, 6.3, 120);
    confetti(80, 195, 400);
    gsap.to('#invite', { opacity: 0, scale: 1.2, duration: .5, delay: .6, onComplete: () => gsap.set('#invite', { visibility: 'hidden' }) });
    gsap.delayedCall(1.6, () => bigSay('One more box...', 1.6));
    gsap.delayedCall(3, () => unbox(GOLDEN, 4));
  }
  function showFinal() {
    step = 'final';
    const all = $('#shelfAll'); all.innerHTML = '';
    [...VISITORS.map((V) => V.toy), 'golden'].forEach((k) => { const d = document.createElement('div'); d.innerHTML = ART.toy(k); d.addEventListener('click', () => gimmick(d.querySelector('.toyfig'))); all.appendChild(d); });
    gsap.set('#final', { visibility: 'visible' });
    gsap.fromTo('#final', { opacity: 0 }, { opacity: 1, duration: .8 });
    gsap.from('#shelfAll > div', { scale: 0, duration: .5, stagger: .12, ease: 'back.out(2.5)', delay: .6 });
    gsap.from('#final .complete', { scale: 0, duration: .6, ease: 'elastic.out(1, .5)', delay: 1.4 });
  }

  /* ================= intro ================= */
  $('#introCast').innerHTML = ['hermione', 'harry', 'yato', 'toothless', 'neytiri'].map((n) => ART.char(n, 'in' + n)).join('');
  $$('#introCast [id$="-glow"]').forEach((g) => gsap.set(g, { opacity: .8 }));
  const tt = $('#introTitle'); tt.innerHTML = [...tt.textContent].map((ch) => `<span>${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
  gsap.from('#introTitle span', { y: -30, opacity: 0, duration: .6, stagger: .05, ease: 'back.out(3)' });
  gsap.from('#introName', { scale: .3, opacity: 0, duration: 1, ease: 'elastic.out(1, .5)', delay: .7 });
  gsap.from('#introCast > *', { y: 40, opacity: 0, duration: .6, stagger: .1, ease: 'back.out(2)', delay: .3 });
  if (!reduce) gsap.to('#introCast > *', { y: -6, duration: .5, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: { each: .12, repeat: -1, yoyo: true }, delay: 1.4 });
  function start() {
    audioInit(); $('#mute').hidden = false;
    gsap.to('#intro', { opacity: 0, duration: .8, onComplete: () => { $('#intro').hidden = true; } });
    setupVisitor(0);
    cap('7pm. Get comfy. Someone is coming up the walk...');
    gsap.delayedCall(2.4, ring);
  }

  /* ================= wiring ================= */
  const key = (el, fn) => { el.addEventListener('click', fn); el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } }); };
  $('#start').addEventListener('click', start);
  key($('#door'), () => (step === 'ring' ? openDoor() : null));
  $('#done').addEventListener('click', () => (step === 'outside' ? goOutside() : finishGiving()));
  $('#handBtn').addEventListener('click', touch);
  key($('#yen'), flipYen); key($('#boxHold'), openBox); key($('#cake'), blow);
  key($('#ccBubble'), () => gimmick($('#ccToy .toyfig')));
  $('#ccFlip').addEventListener('click', flipCard);
  $('#keep').addEventListener('click', keep);
  $('#letterNext').addEventListener('click', showInvite);
  $$('[data-yes]').forEach((b) => b.addEventListener('click', sayYes));
  $('#again').addEventListener('click', () => { location.hash = ''; location.reload(); });

  /* ================= preview jumps: #k1..#k5 (+ -open / -give / -card); #party #letter #invite #final ================= */
  const auto = {};
  function autoGive() {
    const plan = { spell: [['hermione'], ['harry'], ['ron', 'frog']], fiveyen: [['yato'], ['yato']], dragon: [['toothless', 'choc'], ['toothless', 'fish'], ['hiccup', 'lolli']], glow: [['tuk'], ['jake'], ['neytiri'], ['kiri'], ['tuk']] }[VISITORS[vi].mech];
    plan.forEach(([n, kind], i) => gsap.delayedCall(.6 + i * 1.4, () => {
      const c = candies.find((x) => !x.dataset.used && !x.dataset.flying && (!kind || x.dataset.kind === kind));
      const tg = targets().find((x) => x.a.name === n); if (c && tg) fly(c, tg);
    }));
    if (auto.card) gsap.delayedCall(.6 + plan.length * 1.4 + 2.4, finishGiving);
  }
  const h = (location.hash || '').slice(1);
  const m = h.match(/^k([1-5])(?:-(open|give|card))?$/);
  if (m || ['party', 'letter', 'invite', 'final'].includes(h)) {
    $('#intro').hidden = true; $('#mute').hidden = false;
    gsap.ticker.lagSmoothing(0);
    const k = m ? +m[1] - 1 : 4;
    for (let i = 0; i < Math.min(k, 4); i++) { placeToy(i, VISITORS[i].toy); MAGIC[VISITORS[i].magic](false); }
    setClock(7 + Math.min(k, 4), false);
    const lvl = m ? m[2] : h, order = ['open', 'give', 'card', 'party', 'letter', 'invite', 'final'];
    order.slice(0, order.indexOf(lvl) + 1).forEach((x) => { auto[x] = true; });
    if (!m) auto.open = true;
    if (k < 4) setupVisitor(k); else setupFinale();
    gsap.delayedCall(.6, ring);
    $('#mock').textContent = 'Mock · preview ' + h;
  }
})();
