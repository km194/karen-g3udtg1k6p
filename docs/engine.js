(() => {
  if (location.hash) addEventListener('error', (e) => document.body.insertAdjacentHTML('beforeend',
    `<pre style="position:fixed;left:0;top:0;z-index:999;background:#fff;color:#000;font:11px monospace;white-space:pre-wrap;max-width:100%">${e.message} @${e.lineno}:${e.colno}</pre>`));
  const $ = (s) => document.querySelector(s);
  const STORY = window.STORY, ART = window.ART;
  const stage = $('#stage'), world = $('#world');
  const W = 390, H = 800;
  function fit() { stage.style.transform = `translate(-50%, -50%) scale(${Math.min(innerWidth / W, innerHeight / H)})`; }
  addEventListener('resize', fit); fit();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.Physics2DPlugin) gsap.registerPlugin(Physics2DPlugin);
  const name = STORY.herName || 'you';
  document.title = `${name}'s Halloween Birthday`;
  $('#introName').textContent = name; $('#pTitle').textContent = name;

  /* ================= sound: synthesized effects + optional music file ================= */
  const S = { ctx: null, on: true, master: null };
  function audioInit() {
    try { S.ctx = new (window.AudioContext || window.webkitAudioContext)(); S.master = S.ctx.createGain(); S.master.gain.value = .8; S.master.connect(S.ctx.destination); }
    catch (e) { S.ctx = null; }
    const m = $('#music');
    if (STORY.music) { m.src = STORY.music; m.volume = .45; m.play().catch(() => {}); }
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
    poof() { const t = now(); noise(t, .5, 1200, .6, .35, 200); tone(220, t, .3, 'triangle', .08); },
    slam() { const t = now(); noise(t, .6, 180, .5, .6, 60); tone(70, t, .5, 'sine', .4); },
    cheer() { const t = now(); [523, 659, 784, 1046].forEach((f, i) => tone(f, t + i * .07, .35, 'triangle', .12)); },
    giggle() { const t = now(); [900, 1000, 880, 1050].forEach((f, i) => tone(f, t + i * .09, .08, 'sine', .05)); },
    blow() { const t = now(); noise(t, .45, 900, .4, .25, 300); },
    fanfare() { const t = now(); [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => { tone(f, t + i * .12, .5, 'triangle', .14); tone(f / 2, t + i * .12, .5, 'sine', .06); }); }
  };
  $('#mute').addEventListener('click', () => {
    S.on = !S.on; if (S.master) S.master.gain.value = S.on ? .8 : 0; $('#music').muted = !S.on;
    $('#mute').textContent = S.on ? 'Sound on' : 'Sound off';
  });

  /* ================= scenery ================= */
  const flags = $('#flags'), fc = ['#ff9a52', '#7d4cc0', '#ff8fbd', '#a8ecd6', '#ffd25e'];
  for (let i = 0; i < 13; i++) {
    const x = 8 + i * 30, y = x < 195 ? 8 + 24 * Math.sin(Math.PI * x / 195) : 8 + 24 * Math.sin(Math.PI * (x - 195) / 195);
    flags.insertAdjacentHTML('beforeend', `<path d="M${x - 10} ${y} L${x + 10} ${y} L${x} ${y + 22} Z" fill="${fc[i % 5]}" stroke="#2e2148" stroke-width="2"/>`);
  }
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
  const sparkSVG = (c) => `<svg viewBox="0 0 24 24"><path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5Z" fill="${c}"/></svg>`;
  const heartSVG = (c) => `<svg viewBox="0 0 24 22"><path d="M12 21 C-6 9 4 -4 12 5 C20 -4 30 9 12 21Z" fill="${c}" stroke="#2e2148" stroke-width="1.8"/></svg>`;
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
    for (let i = 0; i < 10; i++) {
      const sp = document.createElement('div'); sp.className = 'abs';
      const a = Math.PI + (i / 9) * Math.PI;
      sp.style.cssText = `left:${195 + Math.cos(a) * 128 - 6}px;top:${276 + Math.sin(a) * 128 - 6}px;width:12px;z-index:6;pointer-events:none`;
      sp.innerHTML = sparkSVG(['#ffd98a', '#ffd3e4', '#a8ecd6'][i % 3]); world.appendChild(sp);
      gsap.fromTo(sp, { scale: .2, opacity: .3 }, { scale: 1, opacity: 1, duration: .9 + Math.random(), yoyo: true, repeat: -1, ease: 'sine.inOut', delay: Math.random() * 2 });
    }
  }
  const collect = $('#collect');
  for (let i = 0; i < 6; i++) { const s = document.createElement('div'); s.className = 'slot'; collect.appendChild(s); }

  /* ================= the guests ================= */
  const VISITORS = [
    { series: 'Hello Kitty', box: 'HELLO KITTY', toy: 'kitty', layout: 'trio', cast: ['kuromi', 'kitty', 'melody'], mech: 'colors',
      peep: 'Ding-dong! Three tiny shadows... one of them has bunny ears.',
      greet: [['melody', 'Trick or treat!'], ['kitty', '(waves at you)'], ['kuromi', 'Treats. Now. Or else~']],
      cap: 'Each friend only wants candy in her own color.',
      gift: [['melody', 'We brought you something!']], bye: [['melody', 'Bye bye, ' + name + '!'], ['kuromi', '...You\'re alright.']] },
    { series: 'Kamisama Kiss', box: 'KAMISAMA KISS', toy: 'tomoe', layout: 'solo', cast: ['tomoe'], mech: 'picky',
      peep: 'Ding-dong! A tall shadow... with fox ears?',
      greet: [['tomoe', 'Hmph. Trick or treat, I suppose.']],
      cap: 'A fox spirit. He looks very hard to please.',
      gift: [['tomoe', 'Take this. Don\'t make it weird.']], bye: [['tomoe', '...Happy birthday, ' + name + '.']] },
    { series: 'Naruto', box: 'NARUTO', toy: 'naruto', layout: 'duo', cast: ['naruto', 'sasuke'], mech: 'clones',
      peep: 'Ding-dong! Two spiky shadows. One will not stop bouncing.',
      greet: [['naruto', 'Believe it! Happy birthday!!'], ['sasuke', '...Happy birthday.']],
      cap: 'Drag candy from your bowl into their bags.',
      gift: [['sasuke', '...This is from both of us.'], ['naruto', 'It\'s a collab, believe it!']], bye: [['naruto', 'Bye!! Happy birthday, ' + name + '!'], ['sasuke', '...See you.']] },
    { series: 'Noragami', box: 'NORAGAMI', toy: 'yato', layout: 'solo', cast: ['yato'], mech: 'fiveyen',
      peep: 'Ding-dong! A shadow in a tracksuit... and a scarf.',
      greet: [['yato', 'Yato God, at your service! Trick or treat!']],
      cap: 'A stray god. He doesn\'t look like he gets treats often.',
      gift: [['yato', 'And this is for you, my best worshipper!']], bye: [['yato', 'Call me anytime! Only 5 yen!']] },
    { series: 'Black Clover', box: 'BLACK CLOVER', toy: 'asta', layout: 'solo', cast: ['asta'], mech: 'limits',
      peep: 'Ding-dong ding-dong ding-dong! Someone with a VERY big sword.',
      greet: [['asta', 'TRICK OR TREAT!! I\'M GONNA BE THE WIZARD KING!!']],
      cap: 'He is very, very loud. Give him candy.',
      gift: [['asta', 'THIS IS FOR YOU!! HAPPY BIRTHDAY!!']], bye: [['asta', 'NEVER GIVE UP, ' + name.toUpperCase() + '!!']] }
  ];
  const LAYOUT = { solo: [[30, 168, 150]], duo: [[-4, 196, 124], [98, 206, 116]], trio: [[-12, 226, 92], [58, 214, 92], [118, 226, 92]] };
  const WANT = { kitty: 'red', melody: 'pink', kuromi: 'purple' };

  let vi = 0, step = 'intro', st = {}, actors = [], candies = [];
  const actor = (n) => actors.find((a) => a.name === n);
  const node = (a, part) => document.getElementById(a.p + '-' + part);

  function setupVisitor(i) {
    vi = i; const V = VISITORS[i];
    $('#cast').innerHTML = ''; actors = []; $('#bubbles').innerHTML = '';
    V.cast.forEach((n, j) => {
      const [x, y, w] = LAYOUT[V.layout][j], p = `v${i}${n}`;
      const el = document.createElement('div'); el.className = 'actor';
      el.style.cssText = `left:${x}px;top:${y}px;width:${w}px`; el.innerHTML = ART.char(n, p);
      $('#cast').appendChild(el); gsap.set(el, { y: 90, opacity: 0 });
      actors.push({ name: n, p, el });
    });
    $('#peepCast').innerHTML = V.cast.map((n, j) => ART.char(n, `pk${i}${n}${j}`)).join('');
    $('#hmLabel').textContent = V.box;
    st = { given: Object.fromEntries(V.cast.map((n) => [n, 0])), total: 0, rejected: false, clones: false };
    makeCandies(V.mech === 'colors');
  }

  /* ================= candy ================= */
  const wrapped = (c) => `<svg viewBox="0 0 60 34"><path d="M2 6 L16 17 L2 28Z M58 6 L44 17 L58 28Z" fill="${c}" stroke="#2e2148" stroke-width="2" stroke-linejoin="round"/><ellipse cx="30" cy="17" rx="16" ry="13" fill="${c}" stroke="#2e2148" stroke-width="2.5"/><path d="M22 11 Q30 23 38 11" fill="none" stroke="#fff" stroke-width="2.5" opacity=".8"/></svg>`;
  const CANDY = {
    choc: `<svg viewBox="0 0 60 34"><path d="M2 8 L10 4 L10 30 L2 26Z M58 8 L50 4 L50 30 L58 26Z" fill="#c9a26b" stroke="#2e2148" stroke-width="2"/><rect x="9" y="3" width="42" height="28" rx="4" fill="#d6322b" stroke="#2e2148" stroke-width="2.5"/><rect x="15" y="11" width="30" height="12" rx="3" fill="#fff"/><path d="M19 17h22" stroke="#d6322b" stroke-width="3"/></svg>`,
    lolli: `<svg viewBox="0 0 40 60"><rect x="18" y="30" width="4" height="28" rx="2" fill="#fff6ea" stroke="#2e2148" stroke-width="1.5"/><circle cx="20" cy="18" r="16" fill="#ff8fbd" stroke="#2e2148" stroke-width="2.5"/><path d="M20 18 m-10 0 a10 10 0 1 1 10 10 a6 6 0 1 1 -6 -6 a3 3 0 1 1 3 3" fill="none" stroke="#fff" stroke-width="2.5"/></svg>`,
    corn: `<svg viewBox="0 0 40 44"><path d="M20 2 Q34 26 34 36 Q20 44 6 36 Q6 26 20 2Z" fill="#ffd25e"/><path d="M11 22 Q20 18 29 22 L32 34 Q20 40 8 34Z" fill="#ff8a2b"/><path d="M8 34 Q20 40 32 34 L34 36 Q20 44 6 36Z" fill="#fff"/><path d="M20 2 Q34 26 34 36 Q20 44 6 36 Q6 26 20 2Z" fill="none" stroke="#2e2148" stroke-width="2.5"/></svg>`,
    gummy: `<svg viewBox="0 0 44 38"><ellipse cx="22" cy="22" rx="19" ry="14" fill="#9b6be0" stroke="#2e2148" stroke-width="2.5"/><path d="M14 10 Q10 22 14 34 M30 10 Q34 22 30 34" fill="none" stroke="#7a4cc0" stroke-width="2"/><path d="M22 8 q1 -6 6 -6" fill="none" stroke="#5c8f3a" stroke-width="3" stroke-linecap="round"/></svg>`
  };
  const COLORS = { red: '#ff3b5c', pink: '#ff9cc6', purple: '#9b6be0' };
  const HOMES = [[96, 616], [140, 604], [186, 598], [232, 604], [276, 616], [118, 640], [164, 632], [210, 632], [254, 640]];

  function makeCandies(colorGame) {
    candies.forEach((c) => c.remove()); candies = [];
    const kinds = colorGame
      ? ['red', 'pink', 'purple', 'pink', 'red', 'purple', 'purple', 'red', 'pink'].map((c) => ({ art: wrapped(COLORS[c]), color: c }))
      : ['choc', 'lolli', 'corn', 'gummy', 'choc', 'lolli', 'mint', 'corn', 'gold'].map((k) => ({ art: CANDY[k] || wrapped(k === 'mint' ? '#a8ecd6' : '#ffd25e'), color: k }));
    kinds.forEach((k, i) => {
      const c = document.createElement('div'); c.className = 'abs candy'; c.innerHTML = k.art; c.dataset.color = k.color;
      const [x, y] = HOMES[i]; c.style.left = (x - 23) + 'px'; c.style.top = (y - 20) + 'px';
      stage.appendChild(c); candies.push(c); gsap.set(c, { rotation: Math.random() * 30 - 15 }); bindDrag(c);
    });
    gsap.from(candies, { y: 40, opacity: 0, stagger: .04, duration: .45, ease: 'back.out(2)' });
  }

  function center(el) {
    const r = el.getBoundingClientRect(), sr = stage.getBoundingClientRect(), k = sr.width / W;
    return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k, top: (r.top - sr.top) / k };
  }
  function targets() {
    const t = actors.map((a) => ({ a, el: node(a, 'bag') }));
    if (st.clones) document.querySelectorAll('.clone [id$="-bag"]').forEach((el) => t.push({ a: actor('naruto'), el, clone: true }));
    return t.filter((t) => t.el);
  }
  function bindDrag(c) {
    let sx, sy, moved, base;
    c.addEventListener('pointerdown', (e) => {
      if (step !== 'give' || c.dataset.used) return;
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
  function pickTarget(c) { // a tap gives to whoever wants it most
    const t = targets();
    if (VISITORS[vi].mech === 'colors') { const m = t.find((x) => WANT[x.a.name] === c.dataset.color); if (m) return m; }
    return t.sort((a, b) => (st.given[a.a.name] || 0) - (st.given[b.a.name] || 0))[0];
  }
  function home(c) { gsap.to(c, { x: 0, y: 0, scale: 1, opacity: 1, duration: .5, ease: 'back.out(2)' }); }
  function fly(c, t) {
    if (!t) return;
    c.dataset.flying = 1;
    const a = center(c), b = center(t.el), bx = gsap.getProperty(c, 'x'), by = gsap.getProperty(c, 'y');
    gsap.timeline().to(c, { keyframes: [
      { x: bx + (b.x - a.x) * .5, y: by + (b.y - a.y) * .5 - 120, rotation: '+=200', scale: 1.1, duration: .32, ease: 'power1.out' },
      { x: bx + (b.x - a.x), y: by + (b.y - a.y), rotation: '+=160', scale: .6, duration: .3, ease: 'power1.in' }
    ] }).add(() => { delete c.dataset.flying; give(c, t); });
  }
  function give(c, t) {
    if (c.dataset.used) return;
    const M = MECH[VISITORS[vi].mech];
    if (!t.clone && M.accept && !M.accept(t.a, c)) { sfx.nope(); home(c); return; }
    c.dataset.used = 1;
    gsap.to(c, { scale: .3, opacity: 0, duration: .18, onComplete: () => c.remove() });
    sfx.rustle();
    gsap.fromTo(t.el, { scale: 1 }, { scale: 1.18, transformOrigin: '50% 50%', duration: .09, yoyo: true, repeat: 1 });
    hearts(center(t.el));
    const who = t.clone ? t.el.closest('.actor') : t.a.el;
    gsap.fromTo(who, { scaleX: 1.12, scaleY: .88 }, { scaleX: 1, scaleY: 1, duration: .6, ease: 'elastic.out(1.2, .35)' });
    if (t.clone) { say('naruto', 'The clones say thank you too!', 1.4); }
    else { st.given[t.a.name]++; st.total++; M.react(t.a); }
    if (!t.clone) st.total = Object.values(st.given).reduce((s, n) => s + n, 0);
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
    document.querySelectorAll('#bubbles .bub').forEach((o) => { if (o !== b) { gsap.killTweensOf(o); gsap.to(o, { opacity: 0, duration: .15 }); } });
    b.textContent = text; gsap.killTweensOf(b);
    const c = center(a.el), w = b.offsetWidth, h = b.offsetHeight;
    const headY = c.top + (a.el.offsetWidth * 0.2);
    b.style.left = Math.max(8, Math.min(W - w - 8, c.x - w / 2)) + 'px';
    b.style.top = Math.max(118, headY - h - 6) + 'px';
    gsap.fromTo(b, { opacity: 0, scale: .5, transformOrigin: '50% 100%' }, { opacity: 1, scale: 1, duration: .35, ease: 'back.out(2.6)' });
    if (hold) gsap.to(b, { opacity: 0, duration: .3, delay: hold });
  }
  function bigSay(text, hold = 1.8) {
    document.querySelectorAll('#bubbles .bub').forEach((o) => { gsap.killTweensOf(o); gsap.to(o, { opacity: 0, duration: .15 }); });
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
  function blush(a, v) { const b = node(a, 'blush'); if (b) gsap.to(b, { opacity: v, duration: .4 }); }
  function shake(el) { gsap.fromTo(el, { x: -7 }, { x: 7, duration: .06, repeat: 5, yoyo: true, onComplete: () => gsap.set(el, { x: 0 }) }); }
  function hop(a) { gsap.fromTo(a.el, { y: 0 }, { y: -26, duration: .18, yoyo: true, repeat: 1, ease: 'power2.out' }); }
  function hearts(p, n = 7, spread = 2.2, dist = 50) {
    const cols = ['#ff8fbd', '#ffd25e', '#a8ecd6', '#ff6fa8', '#c7a6ff'];
    for (let i = 0; i < n; i++) {
      const h = document.createElement('div'); h.className = 'abs';
      h.style.cssText = `left:${p.x - 9}px;top:${p.y - 9}px;width:${i % 2 ? 14 : 18}px;z-index:35;pointer-events:none`;
      h.innerHTML = i % 3 === 2 ? sparkSVG(cols[i % 5]) : heartSVG(cols[i % 5]); stage.appendChild(h);
      const ang = -Math.PI / 2 + (Math.random() - .5) * spread, d = dist + Math.random() * 50;
      gsap.fromTo(h, { scale: 0, rotation: Math.random() * 40 - 20 }, { x: Math.cos(ang) * d, y: Math.sin(ang) * d, scale: 1, duration: .55, ease: 'back.out(2)',
        onComplete: () => gsap.to(h, { y: '-=24', opacity: 0, duration: .5, onComplete: () => h.remove() }) });
    }
  }

  const MECH = {
    colors: {
      accept(a, c) {
        if (c.dataset.color === WANT[a.name]) return true;
        say(a.name, { kitty: '(points at the red ones)', melody: 'Ehehe, that one isn\'t my color~', kuromi: 'Ew. Not purple.' }[a.name]); shake(a.el); return false;
      },
      react(a) {
        const n = st.given[a.name]; happy(a);
        if (a.name === 'kitty') { say('kitty', n === 1 ? '♡' : '♡ ♡ ♡'); hearts(center(a.el), 10, 3, 70); }
        else if (a.name === 'melody') say('melody', n === 1 ? 'Yay! Pink is my favorite!' : 'You\'re so sweet, ' + name + '!');
        else { say('kuromi', n === 1 ? '...Purple. Acceptable.' : 'Fine. You\'re my favorite house.'); blush(a, 1); }
        hop(a);
      },
      ready: () => ['kitty', 'melody', 'kuromi'].every((n) => st.given[n] >= 1)
    },
    picky: {
      accept(a) { if (st.rejected) return true; st.rejected = true; say('tomoe', 'I don\'t accept cheap human sweets.'); shake(a.el); return false; },
      react(a) {
        if (st.given.tomoe === 1) { say('tomoe', '...Fine. Just this once.'); blush(a, .9); setMouth(a, 'smile'); }
        else { say('tomoe', st.given.tomoe === 2 ? '...These are not bad.' : '...Are you trying to spoil me?'); blush(a, 1);
          const f = node(a, 'fire'); if (f) gsap.fromTo(f, { scale: 1, transformOrigin: '100px 170px' }, { scale: 1.35, rotation: 360, duration: 1.1, ease: 'power2.inOut', yoyo: true, repeat: 1 }); }
      },
      ready: () => st.given.tomoe >= 2
    },
    clones: {
      react(a) {
        if (a.name === 'naruto') { const n = st.given.naruto; say('naruto', ['Whoa, thanks!!', 'Another one?! You\'re the best!', 'BEST HOUSE ON THE STREET!'][Math.min(n - 1, 2)]); happy(a, 1800); hop(a);
          if (n === 3 && !st.clones) shadowClones(); }
        else { const n = st.given.sasuke; say('sasuke', ['...Thanks.', '...You didn\'t have to.', '...Hn. Thank you, ' + name + '.'][Math.min(n - 1, 2)]); blush(a, Math.min(.3 + n * .3, 1)); if (n >= 2) setMouth(a, 'smile'); }
      },
      ready: () => st.total >= 4 && st.given.sasuke >= 1
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
    limits: {
      react(a) {
        const n = st.given.asta; happy(a);
        if (n === 1) say('asta', 'THANK YOU!!'); else if (n === 2) say('asta', 'MORE POWER!!');
        else if (n === 3) {
          bigSay('SURPASS MY LIMITS!!', 2.2);
          gsap.timeline().to(a.el, { y: -40, duration: .25, ease: 'power2.out' }).to(a.el, { y: 0, duration: .15, ease: 'power3.in' })
            .add(() => { sfx.slam(); shake(world); shake('#hands'); candies.forEach((c) => { if (!c.dataset.used) gsap.fromTo(c, { y: 0 }, { y: -30, duration: .2, yoyo: true, repeat: 1, ease: 'power2.out' }); }); });
        } else say('asta', 'I\'M NEVER GIVING UP ON THIS CANDY!!');
        hop(a);
      },
      ready: () => st.given.asta >= 3
    }
  };

  function shadowClones() {
    st.clones = true;
    gsap.delayedCall(.9, () => {
      bigSay('SHADOW CLONE JUTSU!!', 1.8); sfx.poof();
      [[-30, 150, 92], [128, 146, 92]].forEach(([x, y, w], i) => {
        const el = document.createElement('div'); el.className = 'actor clone';
        el.style.cssText = `left:${x}px;top:${y}px;width:${w}px;z-index:0`; el.innerHTML = ART.char('naruto', `clone${vi}${i}`);
        $('#cast').insertBefore(el, $('#cast').firstChild);
        const pf = document.createElement('div'); pf.className = 'o puff'; pf.style.cssText = `left:${x}px;top:${y + 20}px`; $('#cast').appendChild(pf);
        gsap.timeline().fromTo(pf, { opacity: 0, scale: .3 }, { opacity: 1, scale: 1.3, duration: .25 }).fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .4, ease: 'back.out(2.5)' }, '<.15').to(pf, { opacity: 0, scale: 1.8, duration: .5, onComplete: () => pf.remove() }, '<');
        if (!reduce) gsap.to(el, { y: -5, duration: .4 + i * .1, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: .6 });
      });
      cap('He made shadow clones to get more candy. Feed the clones too.');
    });
  }

  /* ================= the knock cycle ================= */
  function idle(a, i) {
    if (reduce) return;
    gsap.to(a.el, { y: -5 - (i % 2) * 2, duration: .55 + i * .12, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.2 + i * .2 });
    const arm = node(a, 'arm'); if (arm) gsap.to(arm, { rotation: -14, svgOrigin: '60 182', duration: .38, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.6 });
    const f = node(a, 'fire'); if (f) gsap.to(f, { y: -8, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    // blink
    const e = node(a, 'eyes'); if (e) gsap.to(e, { scaleY: .1, svgOrigin: '100 126', duration: .07, yoyo: true, repeat: 1, repeatDelay: 0, delay: 2 + Math.random() * 3,
      onComplete: function () { this.delay(2 + Math.random() * 3).restart(true); } });
  }

  function ring() {
    step = 'ring';
    const finale = vi === 5;
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
    if (vi === 5) return openFinale();
    const V = VISITORS[vi];
    const tl = gsap.timeline();
    tl.to('#door', { rotationY: -100, duration: 1.2, ease: 'power3.inOut' })
      .to('#roomFog', { opacity: 1, duration: 1.4 }, '<.4');
    actors.forEach((a, i) => tl.to(a.el, { y: 0, opacity: 1, duration: .55, ease: 'back.out(2.2)' }, i === 0 ? '-=.5' : '<.12'));
    tl.add(() => { bigSay('TRICK OR TREAT!!', 1.5); sfx.cheer(); }, '<.2');
    V.greet.forEach(([n, t], i) => tl.add(() => say(n, t, 2.4), `+=${i === 0 ? 1.3 : .7}`));
    tl.add(() => { step = 'give'; cap(V.cap); actors.forEach(idle); if (auto.give) autoGive(); }, '+=.3');
  }

  function finishGiving() {
    if (step !== 'give') return;
    step = 'thanks';
    $('#done').hidden = true;
    candies.forEach((c) => { if (!c.dataset.used) gsap.to(c, { opacity: .4, duration: .3 }); });
    document.querySelectorAll('.clone').forEach((el) => { sfx.poof(); gsap.to(el, { opacity: 0, scale: .5, duration: .3, onComplete: () => el.remove() }); });
    const V = VISITORS[vi];
    V.gift.forEach(([n, t], i) => gsap.delayedCall(i * .8, () => say(n, t, 2.4)));
    if (V.mech === 'fiveyen') { gsap.delayedCall(1, showYen); return; }
    showBox(1.2);
  }
  function showYen() {
    cap('He handed you his business card.');
    sfx.pop(); step = 'yen';
    gsap.fromTo('#yen', { autoAlpha: 0, y: 40, rotation: -8, scale: .6 }, { autoAlpha: 1, y: 0, rotation: -3, scale: 1, duration: .6, ease: 'back.out(2)' });
  }
  function flipYen() {
    if (step !== 'yen') return;
    step = 'yenRead'; sfx.cheer();
    gsap.to('#yen .flip', { rotationY: 180, duration: .7, ease: 'back.out(1.4)' });
    gsap.delayedCall(2.8, () => { gsap.to('#yen', { autoAlpha: 0, y: -40, duration: .4, onComplete: () => gsap.set('#yen .flip', { rotationY: 0 }) }); showBox(.3); });
  }
  function showBox(delay) {
    step = 'box';
    cap('They brought you something.');
    gsap.delayedCall(delay, sfx.pop);
    gsap.fromTo('#hmBox', { autoAlpha: 0, y: 40, scale: .4, rotation: -12 }, { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: .7, ease: 'back.out(2)', delay });
    gsap.to('#hmBox', { rotation: 4, duration: .25, yoyo: true, repeat: -1, delay: delay + 1, ease: 'sine.inOut' });
    if (auto.card) gsap.delayedCall(delay + 1.2, openBox);
  }
  function fillCard(i) {
    const V = VISITORS[i], m = (STORY.memories || [])[i] || {};
    $('#cEyebrow').textContent = `${V.series} x Happy Meal · toy ${i + 1} of 6`;
    $('#cTitle').textContent = m.title || '';
    $('#cToy').innerHTML = ART.toy(V.toy);
    const ph = $('#cPhoto');
    if (m.photo) { ph.className = 'photo has'; ph.innerHTML = `<img src="${m.photo}" alt="">`; } else { ph.className = 'photo'; ph.textContent = 'your photo of you two goes here'; }
    $('#cText').textContent = m.text || '';
  }
  function openBox() {
    if (step !== 'box') return;
    step = 'card'; sfx.cheer();
    gsap.killTweensOf('#hmBox'); gsap.to('#hmBox', { scale: 1.3, autoAlpha: 0, duration: .35 });
    fillCard(vi);
    gsap.to('#cap', { opacity: 0, duration: .2 });
    gsap.set('#card', { visibility: 'visible' });
    gsap.fromTo('#card', { opacity: 0, y: 90, rotation: -4, scale: .85 }, { opacity: 1, y: 0, rotation: 0, scale: 1, duration: .8, ease: 'back.out(1.5)' });
    gsap.from('#card > *', { opacity: 0, y: 12, duration: .4, stagger: .07, delay: .3 });
  }
  function keep() {
    if (step !== 'card') return;
    step = 'bye';
    const slot = collect.children[vi], V = VISITORS[vi];
    gsap.timeline()
      .to('#card', { opacity: 0, x: 120, y: 160, scale: .1, rotation: 20, duration: .65, ease: 'power3.in' })
      .set('#card', { visibility: 'hidden', x: 0, y: 0, rotation: 0 })
      .add(() => { slot.innerHTML = ART.toy(V.toy); sfx.pop(); })
      .fromTo(slot, { scale: 0 }, { scale: 1, duration: .6, ease: 'bounce.out' })
      .add(() => V.bye.forEach(([n, t]) => say(n, t, 1.8)))
      .add(() => actors.forEach((a) => gsap.killTweensOf(a.el)), '+=1.2')
      .add(() => actors.forEach((a, i) => gsap.to(a.el, { y: -150, scale: .3, opacity: 0, duration: 1.3, ease: 'power1.in', delay: i * .12 })))
      .add(() => sfx.creak(), '+=1.2')
      .to('#door', { rotationY: 0, duration: 1, ease: 'power3.inOut' })
      .to('#roomFog', { opacity: 0, duration: .8 }, '<')
      .add(() => {
        const n = vi + 1;
        if (n < 5) { setupVisitor(n); cap(`${n} of 6 toys. Someone else is coming up the walk...`); gsap.delayedCall(2.2, ring); }
        else { setupFinale(); cap('5 of 6 toys. The street is getting quiet...'); gsap.delayedCall(2.6, ring); }
        step = 'wait';
      });
  }

  /* ================= finale ================= */
  function setupFinale() {
    vi = 5; actors = []; $('#cast').innerHTML = ''; $('#bubbles').innerHTML = '';
    candies.forEach((c) => gsap.to(c, { opacity: 0, duration: .4, onComplete: () => c.remove() })); candies = [];
    $('#peepCast').innerHTML = `<svg viewBox="0 0 50 70" style="width:46px"><path d="M25 0 v12" stroke="#000" stroke-width="3"/><path d="M25 66 C-8 42 4 12 25 26 C46 12 58 42 25 66Z" fill="#000"/></svg>`;
  }
  function openFinale() {
    const tl = gsap.timeline();
    tl.to('#door', { rotationY: -100, duration: 1.3, ease: 'power3.inOut' })
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
      bulbs.insertAdjacentHTML('beforeend', `<circle class="bulb" cx="${x}" cy="${y + 6}" r="6" fill="#4a3a66" stroke="#2e2148" stroke-width="2" data-c="${['#ffd98a', '#ff8fbd', '#a8ecd6', '#c7a6ff'][i % 4]}"/>`); }
    const word = 'HAPPY BIRTHDAY', bf = $('#bannerFlags'); bf.innerHTML = '';
    [...word].forEach((ch, i) => { const x = 22 + i * 26.6, y = 4 + 36 * (x / 390) * (1 - x / 390) * 2;
      if (ch === ' ') return;
      bf.insertAdjacentHTML('beforeend', `<g class="pen" transform="translate(${x} ${y})"><path d="M-12 0 L12 0 L12 22 L0 30 L-12 22Z" fill="${['#ff8fbd', '#ffd25e', '#a8ecd6', '#c7a6ff', '#ff9a52'][i % 5]}" stroke="#2e2148" stroke-width="2"/><text x="0" y="17" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="13" fill="#2e2148">${ch}</text></g>`); });
    const crowd = $('#crowd'); crowd.innerHTML = '';
    const spots = [['tomoe', 4, 6], ['yato', 98, 0], ['asta', 196, 0], ['sasuke', 292, 6], ['kuromi', -8, 74], ['naruto', 76, 84], ['kitty', 220, 84], ['melody', 304, 74]];
    spots.forEach(([n, x, y], i) => { const el = document.createElement('div'); el.className = 'actor'; el.style.cssText = `left:${x}px;top:${y}px`; el.innerHTML = ART.char(n, `pt${n}`); crowd.appendChild(el); });
    const cg = $('#candles'); cg.innerHTML = '';
    [52, 71, 90, 109, 128].forEach((x, i) => cg.insertAdjacentHTML('beforeend', `<rect x="${x - 4}" y="30" width="8" height="30" rx="3" fill="${['#ff8fbd', '#a8ecd6', '#ffd25e', '#c7a6ff', '#ff8fbd'][i]}" stroke="#2e2148" stroke-width="2.5"/>
      <g class="flame" id="flame${i}"><path d="M${x} 8 Q${x + 9} 20 ${x} 28 Q${x - 9} 20 ${x} 8Z" fill="#ffb347"/><path d="M${x} 15 Q${x + 4} 22 ${x} 26 Q${x - 4} 22 ${x} 15Z" fill="#fff3c2"/></g>`));
    if (!reduce) document.querySelectorAll('.flame').forEach((f, i) => gsap.to(f, { scaleY: 1.15, scaleX: .9, svgOrigin: `${[52, 71, 90, 109, 128][i]} 28`, duration: .18 + i * .03, yoyo: true, repeat: -1 }));
  }
  function goOutside() {
    if (step !== 'outside') return;
    step = 'party';
    $('#done').hidden = true; $('#cap').textContent = '';
    gsap.killTweensOf('#lantern');
    buildParty();
    gsap.set('#party', { visibility: 'visible' });
    const tl = gsap.timeline();
    tl.to('#hands', { y: 220, duration: .8, ease: 'power2.in' })
      .to(world, { scale: 4.2, duration: 1.4, ease: 'power3.in' }, '<')
      .to(world, { opacity: 0, duration: .5 }, '-=.5')
      .set('#party', { opacity: 1 })
      .fromTo('#crowd .actor', { opacity: 0 }, { opacity: 1, duration: .01 })
      .add(() => { const bulbs = [...document.querySelectorAll('.bulb')];
        bulbs.forEach((b, i) => gsap.to(b, { attr: { fill: b.dataset.c }, duration: .05, delay: i * .07, onStart: () => i % 3 === 0 && sfx.pop() })); }, '+=.4')
      .add(() => { sfx.fanfare(); bigSay('SURPRISE!!', 2); confetti(70, 195, 300); }, '+=1.1')
      .fromTo('#crowd .actor', { y: 30 }, { y: 0, duration: .5, stagger: .05, ease: 'back.out(3)' }, '<')
      .fromTo('.pen', { opacity: 0, y: -20 }, { opacity: 1, y: 0, stagger: .05, duration: .4, ease: 'back.out(2)' }, '<.2')
      .fromTo('#pTitle', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .8, ease: 'elastic.out(1, .5)' }, '<.4')
      .add(() => {
        $('#pCap').textContent = 'Make a wish, then tap the cake to blow out the candles.';
        gsap.fromTo('#pCap', { opacity: 0 }, { opacity: 1, duration: .5 });
        if (!reduce) document.querySelectorAll('#crowd .actor').forEach((el, i) => gsap.to(el, { y: -8, duration: .5 + (i % 3) * .1, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * .1 }));
        step = 'cake'; if (auto.letter) { blowAll(); }
      }, '+=.6');
  }
  let blown = 0;
  function blow() {
    if (step !== 'cake') return;
    sfx.blow();
    const flames = [...document.querySelectorAll('.flame')].filter((f) => !f.dataset.out);
    flames.slice(0, 2).forEach((f) => { f.dataset.out = 1; gsap.killTweensOf(f); gsap.to(f, { opacity: 0, scale: .2, duration: .3 });
      const b = f.getBBox(); const p = center($('#cake')); hearts({ x: p.x - 90 + b.x + b.width / 2, y: p.y - 85 + b.y }, 3, 1, 30); });
    gsap.fromTo('#cake', { rotation: -2 }, { rotation: 0, duration: .4, ease: 'elastic.out(1, .3)' });
    if (![...document.querySelectorAll('.flame')].some((f) => !f.dataset.out)) celebrate();
  }
  function blowAll() { blow(); blow(); blow(); }
  function celebrate() {
    step = 'celebrate'; sfx.fanfare();
    bigSay('HAPPY BIRTHDAY, ' + name.toUpperCase() + '!!', 2.6);
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
  function confetti(n, x, y) {
    const cols = ['#ff8fbd', '#ffd25e', '#a8ecd6', '#c7a6ff', '#ff9a52', '#fff6ea'];
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div'); c.className = 'confetti';
      c.style.cssText = `left:${x}px;top:${y}px;background:${cols[i % 6]};${i % 4 === 0 ? 'border-radius:50%;width:9px;height:9px;' : ''}`;
      stage.appendChild(c);
      if (window.Physics2DPlugin && !reduce) {
        gsap.to(c, { physics2D: { velocity: 350 + Math.random() * 450, angle: -150 + Math.random() * 120, gravity: 700 }, rotation: Math.random() * 720, duration: 3, ease: 'none', onComplete: () => c.remove() });
      } else {
        gsap.to(c, { x: Math.random() * 300 - 150, y: 300 + Math.random() * 200, opacity: 0, duration: 2, onComplete: () => c.remove() });
      }
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
    step = 'final'; sfx.fanfare();
    hearts({ x: 195, y: 400 }, 30, 6.3, 120);
    confetti(80, 195, 400);
    gsap.to('#invite', { opacity: 0, scale: 1.2, duration: .5, delay: .6, onComplete: () => gsap.set('#invite', { visibility: 'hidden' }) });
    const all = $('#shelfAll'); all.innerHTML = '';
    VISITORS.forEach((V) => { const d = document.createElement('div'); d.innerHTML = ART.toy(V.toy); all.appendChild(d); });
    const d = document.createElement('div'); d.innerHTML = ART.heartToy(); all.appendChild(d);
    gsap.set('#final', { visibility: 'visible' });
    gsap.fromTo('#final', { opacity: 0 }, { opacity: 1, duration: .8, delay: 1.2 });
    gsap.from('#shelfAll > div', { scale: 0, duration: .5, stagger: .12, ease: 'back.out(2.5)', delay: 1.8 });
  }

  /* ================= intro ================= */
  $('#introCast').innerHTML = ['kitty', 'tomoe', 'naruto', 'yato', 'asta'].map((n) => ART.char(n, 'in' + n)).join('');
  const t = $('#introTitle'); t.innerHTML = [...t.textContent].map((ch) => `<span>${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
  gsap.from('#introTitle span', { y: -30, opacity: 0, duration: .6, stagger: .05, ease: 'back.out(3)' });
  gsap.from('#introName', { scale: .3, opacity: 0, duration: 1, ease: 'elastic.out(1, .5)', delay: .7 });
  gsap.from('#introCast > *', { y: 40, opacity: 0, duration: .6, stagger: .1, ease: 'back.out(2)', delay: .3 });
  if (!reduce) gsap.to('#introCast > *', { y: -6, duration: .5, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: { each: .12, repeat: -1, yoyo: true }, delay: 1.4 });

  function start() {
    audioInit(); $('#mute').hidden = false;
    gsap.to('#intro', { opacity: 0, duration: .8, onComplete: () => { $('#intro').hidden = true; } });
    setupVisitor(0);
    cap('Get comfy. Someone is coming up the walk...');
    gsap.delayedCall(2.4, ring);
  }

  /* ================= wiring ================= */
  $('#start').addEventListener('click', start);
  const doorAct = () => (step === 'ring' ? openDoor() : null);
  $('#door').addEventListener('click', doorAct);
  $('#door').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doorAct(); } });
  $('#done').addEventListener('click', () => (step === 'outside' ? goOutside() : finishGiving()));
  const key = (el, fn) => { el.addEventListener('click', fn); el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } }); };
  key($('#hmBox'), openBox); key($('#yen'), flipYen); key($('#cake'), blow);
  $('#keep').addEventListener('click', keep);
  $('#letterNext').addEventListener('click', showInvite);
  document.querySelectorAll('[data-yes]').forEach((b) => b.addEventListener('click', sayYes));
  $('#again').addEventListener('click', () => { location.hash = ''; location.reload(); });

  /* ================= preview jumps: #k1..#k6, add -open / -give / -card; #party #letter #invite #final ================= */
  const auto = {};
  function autoGive() {
    const V = VISITORS[vi];
    const plan = { colors: [['kitty', 'red'], ['melody', 'pink'], ['kuromi', 'purple']], picky: [['tomoe'], ['tomoe']], clones: [['naruto'], ['sasuke'], ['naruto'], ['naruto']],
      fiveyen: [['yato'], ['yato']], limits: [['asta'], ['asta'], ['asta']] }[V.mech];
    if (V.mech === 'picky') st.rejected = true;
    plan.forEach(([n, color], i) => gsap.delayedCall(.6 + i * .9, () => {
      const c = candies.find((x) => !x.dataset.used && !x.dataset.flying && (!color || x.dataset.color === color));
      const tg = targets().find((x) => x.a.name === n && !x.clone); if (c && tg) fly(c, tg);
    }));
    if (auto.card) gsap.delayedCall(.6 + plan.length * .9 + 1.6, () => { finishGiving(); if (V.mech === 'fiveyen') gsap.delayedCall(1.6, flipYen); });
  }
  const h = (location.hash || '').slice(1);
  const m = h.match(/^k([1-6])(?:-(open|give|card))?$/);
  if (m || ['party', 'letter', 'invite', 'final'].includes(h)) {
    $('#intro').hidden = true; $('#mute').hidden = false;
    gsap.ticker.lagSmoothing(0);
    const k = m ? +m[1] - 1 : 5;
    for (let i = 0; i < Math.min(k, 5); i++) collect.children[i].innerHTML = ART.toy(VISITORS[i].toy);
    const lvl = m ? m[2] : h;
    const order = ['open', 'give', 'card', 'party', 'letter', 'invite', 'final'];
    order.slice(0, order.indexOf(lvl) + 1).forEach((x) => { auto[x] = true; });
    if (!m) auto.open = true;
    if (k < 5) setupVisitor(k); else setupFinale();
    gsap.delayedCall(.6, ring);
    $('#mock').textContent = 'Mock · preview ' + h;
  }
})();
