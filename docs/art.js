/* Character + prop art, v2. Big-head chibi on a 200x300 grid: head spans y 50-188, eyes at y 134,
   body 190-272. Every character shares the same eye, blush and line kit so the cast reads as one set,
   and each one carries its own signature details.
   Builders take a prefix `p` so ids stay unique: p-eyes, p-happy, p-blush, p-mouth, p-bag, plus extras
   (p-arm, p-wandtip, p-wing, p-glow, p-tears, p-coin, p-water, p-bolts, p-coins, p-sword, p-flame). */
(function () {
  const INK = '#2e2148';
  const st = (w = 4.5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const grad = (id, a, b, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const SK = '#ffe6d0';

  const MOUTH = {
    grin:  { d: 'M84 162 Q100 186 116 162 Z', fill: '#c2413b' },
    open:  { d: 'M89 163 Q100 182 111 163 Q100 168 89 163Z', fill: '#c2413b' },
    smile: { d: 'M90 165 Q100 175 110 165', fill: 'none' },
    flat:  { d: 'M93 169 L107 169', fill: 'none' },
    soft:  { d: 'M93 167 Q100 172 107 167', fill: 'none' },
    cat:   { d: 'M88 166 Q94 173 100 166 Q106 173 112 166', fill: 'none' },
    pout:  { d: 'M93 171 Q100 165 107 171', fill: 'none' },
    teeth: { d: 'M82 160 Q100 186 118 160 Z', fill: '#fff' },
    gummy: { d: 'M74 172 Q100 204 126 172 Q100 180 74 172Z', fill: '#ff8fbd' },
    shut:  { d: 'M80 174 Q100 182 120 174', fill: 'none' }
  };

  /* eyes: kinds 'norm' (sparkly), 'sharp' (angry lid), 'calm' (half lid), 'round' (kid, no wing) */
  function eye(p, side, cx, cy, o) {
    const id = `${p}-ir${side}`, L = side === 'L', out = L ? -1 : 1, kind = o.kind || 'norm', sk = o.skin || SK;
    let s = `<defs>${grad(id, o.dark, o.light)}</defs>
      <ellipse cx="${cx}" cy="${cy}" rx="15" ry="19" fill="#fff" ${st(3)}/>
      <ellipse cx="${cx}" cy="${cy + 1}" rx="13" ry="17" fill="url(#${id})"/>
      <ellipse cx="${cx}" cy="${cy + 2}" rx="6" ry="8.5" fill="${INK}" opacity=".85"/>
      <ellipse cx="${cx + 5}" cy="${cy - 7}" rx="5.5" ry="6.5" fill="#fff"/><circle cx="${cx - 5}" cy="${cy + 9}" r="2.6" fill="#fff"/>`;
    if (kind === 'sharp') {
      const oy = cy - 15, iy = cy - 3, ox = cx + out * 19, ix = cx - out * 19;
      s += `<path d="M${ox} ${cy - 34} L${ix} ${cy - 34} L${ix} ${iy} L${ox} ${oy}Z" fill="${sk}"/>
        <path d="M${ox + out * 2} ${oy - 1} L${ix} ${iy}" ${st(5.5)}/>`;
    } else if (kind === 'calm') {
      s += `<path d="M${cx - 18} ${cy - 34} L${cx + 18} ${cy - 34} L${cx + 18} ${cy - 5} Q${cx} ${cy - 9} ${cx - 18} ${cy - 5}Z" fill="${sk}"/>
        <path d="M${cx - 17} ${cy - 5} Q${cx} ${cy - 10} ${cx + 17} ${cy - 5}" fill="none" ${st(5)}/>`;
    } else {
      const wing = kind === 'round' ? '' : ` L${cx + out * 21} ${cy - 15}`;
      s += `<path d="M${cx - out * 17} ${cy - 10} Q${cx} ${cy - 26} ${cx + out * 17} ${cy - 10}${wing}" fill="${INK}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
    }
    return s;
  }
  const BROWS = {
    angry: `<path d="M50 106 L84 116 M150 106 L116 116" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,
    worried: `<path d="M54 110 L82 102 M146 110 L118 102" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`,
    heavy: `<path d="M50 112 L86 114 M150 112 L114 114" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`
  };
  function face(p, o) {
    const y = o.y ?? 134, m = MOUTH[o.mouth] || { d: o.mouth || MOUTH.smile.d, fill: o.mfill || 'none' };
    const blush = o.cheeks === 'doll'
      ? `<g id="${p}-blush"><circle cx="50" cy="${y + 26}" r="11" fill="#e8463c" opacity=".85"/><circle cx="150" cy="${y + 26}" r="11" fill="#e8463c" opacity=".85"/><circle cx="46" cy="${y + 22}" r="3" fill="#fff" opacity=".6"/><circle cx="146" cy="${y + 22}" r="3" fill="#fff" opacity=".6"/></g>`
      : `<g id="${p}-blush" opacity="${o.blush ?? .6}"><ellipse cx="50" cy="${y + 25}" rx="11" ry="6" fill="#ff8fbd"/><ellipse cx="150" cy="${y + 25}" rx="11" ry="6" fill="#ff8fbd"/></g>`;
    return `${o.under || ''}
      <g id="${p}-eyes">${eye(p, 'L', 70, y, o)}${eye(p, 'R', 130, y, o)}</g>
      <g id="${p}-happy" opacity="0"><path d="M55 ${y + 3} Q70 ${y - 13} 85 ${y + 3} M115 ${y + 3} Q130 ${y - 13} 145 ${y + 3}" fill="none" ${st(5.5)}/></g>
      ${blush}${BROWS[o.brows] || o.brows || ''}${o.extra || ''}
      <path id="${p}-mouth" d="${m.d}" fill="${m.fill}" ${st(3.5)}/>`;
  }
  const headShape = (skin) => `<path d="M30 120 Q30 52 100 50 Q170 52 170 120 Q170 186 100 188 Q30 186 30 120Z" fill="${skin}" ${st(5)}/>`;
  const ears = (skin) => `<ellipse cx="30" cy="138" rx="10" ry="14" fill="${skin}" ${st(4)}/><ellipse cx="170" cy="138" rx="10" ry="14" fill="${skin}" ${st(4)}/>`;
  const torso = (fill, w = 0) => `<path d="M${60 - w} 196 Q100 186 ${140 + w} 196 L${148 + w} 268 Q100 278 ${52 - w} 268Z" fill="${fill}" ${st(5)}/>`;
  const legs = (c, shoe) => `<path d="M76 264 h19 v16 h-19z M105 264 h19 v16 h-19z" fill="${c}" ${st(4)}/>
    <path d="M70 290 q0 -12 10 -12 h16 v12z M130 290 q0 -12 -10 -12 h-16 v12z" fill="${shoe}" ${st(4)}/>`;
  const hand = (x, y, skin = SK) => `<circle cx="${x}" cy="${y}" r="10" fill="${skin}" ${st(4)}/>`;
  const bag = (p, side, inner, skin = SK, k = 1.6) => `<g transform="translate(${side === 'L' ? 48 : 152} 250) scale(${k})"><g id="${p}-bag">${inner}</g></g>${hand(side === 'L' ? 50 : 150, 226, skin)}`;
  const shine = (d, c = '#ffffff', o = .35) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" opacity="${o}"/>`;
  const freckles = (c = '#c98a5a') => `<g fill="${c}"><circle cx="44" cy="160" r="2.2"/><circle cx="52" cy="156" r="2.2"/><circle cx="51" cy="165" r="2.2"/><circle cx="156" cy="160" r="2.2"/><circle cx="148" cy="156" r="2.2"/><circle cx="149" cy="165" r="2.2"/></g>`;
  const spiky = (fill, w = 4.5) => `<path d="M30 114 Q30 50 100 44 Q170 50 170 114 L162 88 L154 120 L142 80 L132 114 L120 76 L108 110 L98 74 L86 110 L74 78 L62 116 L50 86 L40 114Z" fill="${fill}" ${st(w)}/>`;

  const BAG = {
    pumpkin: () => `<path d="M-16 -22 Q0 -42 16 -22" fill="none" ${st(4)}/><ellipse cx="0" cy="0" rx="28" ry="24" fill="#ff9a52" ${st(4)}/>
      <path d="M-9 -22 Q-13 0 -9 22 M9 -22 Q13 0 9 22" fill="none" stroke="#e07a34" stroke-width="3"/>
      <path d="M-11 -4 l5 -6 5 6z M2 -4 l5 -6 5 6z" fill="${INK}"/><path d="M-11 8 Q0 15 11 8" fill="none" ${st(3)}/>`,
    paper: () => `<path d="M-21 -18 h42 l-4 42 h-34z" fill="#c99a63" ${st(4)}/><path d="M-21 -18 l5 -6 5 6 5 -6 5 6 5 -6 5 6 5 -6 5 6" fill="#d8ad78" ${st(2.5)}/>
      <rect x="-18" y="-4" width="36" height="12" fill="#ff8fbd"/><text x="0" y="5" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="5.6" fill="#fff">HONEYDUKES</text>`,
    beaded: (c = '#6a3db0') => `<path d="M-8 -16 L-12 -28 M8 -16 L12 -28" ${st(3)}/><path d="M-20 -14 Q-28 20 0 24 Q28 20 20 -14 Q0 -6 -20 -14Z" fill="${c}" ${st(4)}/>
      <g fill="#ffd25e"><circle cx="-10" cy="-2" r="2"/><circle cx="0" cy="2" r="2"/><circle cx="10" cy="-2" r="2"/><circle cx="-6" cy="10" r="2"/><circle cx="6" cy="10" r="2"/></g>`,
    plastic: () => `<path d="M-16 -16 Q-16 -34 -6 -30 Q-2 -26 -6 -16 M16 -16 Q16 -34 6 -30 Q2 -26 6 -16" fill="none" ${st(3)}/>
      <path d="M-22 -16 L22 -16 L18 24 L-18 24Z" fill="#f4f6ff" ${st(4)}/>
      <text x="0" y="2" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="7" fill="#e8322e">THANK</text>
      <text x="0" y="11" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="7" fill="#e8322e">YOU</text>`,
    basket: (fill = '') => `<path d="M-18 -10 Q0 -40 18 -10" fill="none" stroke="#a8743e" stroke-width="5"/><path d="M-24 -10 h48 l-6 30 h-36z" fill="#d6a05a" ${st(4)}/>
      <path d="M-22 0 h44 M-20 10 h40 M-12 -10 v30 M0 -10 v30 M12 -10 v30" stroke="#a8743e" stroke-width="2.5"/>${fill}`,
    pail: () => `<path d="M-16 -18 Q0 -36 16 -18" fill="none" ${st(4)}/><path d="M-22 -16 h44 l-5 38 h-34z" fill="#9a6a3e" ${st(4)}/>
      <path d="M-21 -6 h42 M-19 10 h38" stroke="#6f7a8a" stroke-width="4"/>
      <path d="M8 -16 q6 -14 16 -10 q-6 2 -6 8 q8 -4 10 2 q-10 2 -14 4z" fill="#7fb8d8" ${st(2.5)}/>`,
    furoshiki: () => `<path d="M-8 -20 Q-14 -32 -4 -30 Q0 -26 -2 -18 M8 -20 Q14 -32 4 -30 Q0 -26 2 -18" fill="#e8a0b8" ${st(3)}/>
      <path d="M-24 -14 Q0 -24 24 -14 L22 20 Q0 28 -22 20Z" fill="#e8a0b8" ${st(4)}/><path d="M-14 -4 l6 6 -6 6 M2 -6 l6 6 -6 6" fill="none" stroke="#fff" stroke-width="2.5"/>`,
    ohagi: () => `<rect x="-24" y="-8" width="48" height="26" rx="4" fill="#c08850" ${st(4)}/><path d="M-24 2 h48" stroke="#8a5a30" stroke-width="2.5"/>
      <circle cx="-12" cy="-10" r="9" fill="#6a3a2a" ${st(3)}/><circle cx="6" cy="-12" r="9" fill="#6a3a2a" ${st(3)}/><circle cx="-3" cy="-22" r="8" fill="#7a4632" ${st(3)}/>`,
    backpack: () => `<path d="M-14 -20 Q0 -30 14 -20" fill="none" ${st(3.5)}/><rect x="-22" y="-20" width="44" height="44" rx="12" fill="#ffcf3a" ${st(4)}/>
      <rect x="-14" y="4" width="28" height="14" rx="5" fill="#f2b51e" ${st(3)}/>`,
    suitcase: () => `<path d="M-8 -22 v-6 h16 v6" fill="none" ${st(3.5)}/><rect x="-26" y="-22" width="52" height="40" rx="5" fill="#8a5a33" ${st(4)}/>
      <path d="M-14 -22 v40 M14 -22 v40" stroke="#5a3a1e" stroke-width="4"/><rect x="-4" y="-8" width="8" height="8" rx="1" fill="#e8c25a" ${st(2)}/>`,
    pastry: () => `<rect x="-24" y="-16" width="48" height="36" rx="3" fill="#fff6ea" ${st(4)}/><path d="M0 -16 v36 M-24 2 h48" stroke="#d6322b" stroke-width="2.5"/>
      <path d="M-6 -16 q6 -10 12 0" fill="none" stroke="#d6322b" stroke-width="2.5"/>`,
    purse: () => `<path d="M-10 -12 Q0 -28 10 -12" fill="none" ${st(3)}/><path d="M-20 -12 h40 l-4 28 h-32z" fill="#7a4a3a" ${st(4)}/><circle cx="0" cy="-4" r="3" fill="#e8c25a"/>`,
    fireball: () => `<path d="M-20 4 Q-30 -20 -10 -34 Q-12 -20 0 -26 Q-2 -40 14 -40 Q8 -26 22 -18 Q32 -4 20 10Z" fill="#ff9a2b" ${st(3)}/>
      <circle cx="0" cy="6" r="20" fill="#fff6ea" ${st(4)}/><path d="M-14 -6 Q-6 6 -14 18 M14 -6 Q6 6 14 18" fill="none" stroke="#d6322b" stroke-width="2.5"/>`,
    goldpouch: () => `<path d="M-6 -18 Q0 -26 6 -18" fill="none" ${st(3)}/><path d="M-20 -14 Q-26 22 0 24 Q26 22 20 -14 Q0 -20 -20 -14Z" fill="#f2ecdc" ${st(4)}/><path d="M-16 -8 Q0 -2 16 -8" fill="none" stroke="#e8c25a" stroke-width="3"/>`,
    pinata: () => `<path d="M0 -26 v-8" ${st(3)}/>${[0, 72, 144, 216, 288].map((a, i) => `<path d="M0 0 L-7 -10 L0 -34 L7 -10Z" fill="${['#ff6fa8', '#ffcf3a', '#5ac8fa', '#7ad86a', '#ff8a2b'][i]}" ${st(2.5)} transform="rotate(${a})"/>`).join('')}<circle r="12" fill="#ffd25e" ${st(3)}/>`,
    medals: () => `<path d="M-22 -16 Q-30 22 0 25 Q30 22 22 -16 Q0 -24 -22 -16Z" fill="#8aa8d8" ${st(4)}/><circle cx="-8" cy="4" r="5" fill="#e8c25a" ${st(2)}/><circle cx="8" cy="4" r="5" fill="#e8c25a" ${st(2)}/>`,
    bouquet: () => `<path d="M-8 24 L0 -6 L8 24Z" fill="#9fd8a8" ${st(3)}/>${[[-10, -14, '#ff8fbd'], [8, -16, '#c7a6ff'], [0, -28, '#ffd25e'], [-14, -30, '#a8ecd6'], [14, -30, '#ff8fbd']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}" ${st(2.5)}/><circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join('')}`,
    pan: () => `<path d="M14 0 L40 -10" stroke="#3a3a4a" stroke-width="6" stroke-linecap="round"/><ellipse cx="0" cy="2" rx="22" ry="14" fill="#3a3a4a" ${st(4)}/>
      <ellipse cx="-6" cy="0" rx="9" ry="6" fill="#fff"/><circle cx="-6" cy="0" r="3.5" fill="#ffcf3a"/><ellipse cx="8" cy="4" rx="8" ry="5" fill="#fff"/><circle cx="8" cy="4" r="3" fill="#ffcf3a"/>`,
    lantern: () => `<path d="M0 -30 v-8" ${st(3)}/><rect x="-10" y="-31" width="20" height="6" rx="2" fill="${INK}"/><ellipse cx="0" cy="-4" rx="19" ry="23" fill="#e8463c" ${st(4)}/>
      <path d="M-18 -12 Q0 -8 18 -12 M-19 0 Q0 4 19 0 M-17 10 Q0 14 17 10" fill="none" stroke="#b02a26" stroke-width="2.5"/><rect x="-10" y="17" width="20" height="6" rx="2" fill="${INK}"/>`,
    navi: (c1 = '#e8823e', c2 = '#4fc3c8') => `<path d="M-18 -14 Q0 -40 18 -14" fill="none" ${st(3.5)}/><path d="M-24 -14 h48 l-6 36 h-36z" fill="#c99a63" ${st(4)}/>
      <path d="M-22 -2 l7 6 7 -6 7 6 7 -6 7 6 7 -6" fill="none" stroke="${c1}" stroke-width="3.5"/><path d="M-20 12 h40" stroke="${c2}" stroke-width="4"/>`
  };

  const C = {};
  /* ================= Harry Potter ================= */
  const robe = (p) => `<defs>${grad(p + '-rb', '#2a2a3a', '#14141e')}</defs><path d="M54 196 Q100 184 146 196 L160 270 Q100 282 40 270Z" fill="url(#${p}-rb)" ${st(5)}/>
    <path d="M86 196 L100 224 L114 196Z" fill="#fff"/><path d="M95 202 h10 l-2 18 h-6z" fill="#a8232e"/>
    <g transform="translate(70 238)"><path d="M-9 -10 h18 v12 q0 8 -9 11 q-9 -3 -9 -11z" fill="#a8232e" ${st(2)}/><path d="M-4 -4 l4 6 4 -6" fill="none" stroke="#e8c25a" stroke-width="2"/></g>`;
  const scarf = `<path d="M64 190 Q100 208 136 190 L134 208 Q100 226 66 208Z" fill="#a8232e" ${st(4)}/><path d="M80 197 v15 M94 201 v16 M108 201 v16 M122 197 v14" stroke="#e8c25a" stroke-width="4"/>
    <path d="M116 206 h16 v40 h-16z" fill="#a8232e" ${st(4)}/><path d="M116 218 h16 M116 232 h16" stroke="#e8c25a" stroke-width="4"/><path d="M118 246 v6 M124 246 v6 M130 246 v6" stroke="#e8c25a" stroke-width="2.5"/>`;

  C.harry = (p) => `
    <defs>${grad(p + '-hr', '#3a3448', '#141220')}</defs>
    ${legs('#2b2b38', '#1a1a24')}${robe(p)}${scarf}
    <path d="M24 122 Q14 30 100 26 Q186 30 176 122 L186 102 L180 140 L168 118 Z M24 122 L14 102 L20 140Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(SK)}
    <path d="M30 114 Q28 50 100 42 Q172 50 170 114 L164 92 L156 120 L146 84 L134 116 L124 80 L112 108 L100 76 L90 110 L76 80 L66 116 L54 86 L44 112 L38 96Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M60 58 Q80 46 102 50')}
    <path d="M92 44 Q96 22 112 18 Q104 30 108 42 Q116 28 130 30 Q118 36 118 46" fill="url(#${p}-hr)" ${st(4)}/>
    <path d="M126 86 l-7 11 7 2 -7 12" fill="none" stroke="#e8463c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    ${face(p, { dark: '#1f6a3a', light: '#7ee08f', mouth: 'smile', blush: .5 })}
    <circle cx="70" cy="134" r="23" fill="none" ${st(4)}/><circle cx="130" cy="134" r="23" fill="none" ${st(4)}/><path d="M93 131 Q100 125 107 131 M47 129 L31 123 M153 129 L169 123" fill="none" ${st(4)}/>
    <g id="${p}-arm"><path d="M58 220 Q40 214 34 196" fill="none" stroke="#1f1f2b" stroke-width="15" stroke-linecap="round"/>
      <path d="M32 192 L12 140" stroke="#6b4a2e" stroke-width="5" stroke-linecap="round"/><circle id="${p}-wandtip" cx="11" cy="137" r="7" fill="#fff7c2" opacity=".3"/>${hand(33, 192)}</g>
    ${bag(p, 'R', BAG.paper())}`;

  C.hermione = (p) => `
    <defs>${grad(p + '-hr', '#b07a48', '#6a4022')}</defs>
    <path d="M20 156 Q0 124 14 96 Q2 64 28 48 Q32 18 64 20 Q82 2 104 12 Q130 2 148 22 Q178 22 180 54 Q200 76 188 104 Q202 132 184 158 Q194 186 168 196 L162 168 L38 168 L32 196 Q6 186 20 156Z" fill="url(#${p}-hr)" ${st(5)}/>
    <path d="M24 120 q-10 20 4 40 M176 120 q10 20 -4 40 M40 40 q-4 14 6 24 M160 40 q4 14 -6 24" fill="none" stroke="#5a3418" stroke-width="3" stroke-linecap="round"/>
    ${legs('#5a5a6e', '#1a1a24')}${robe(p)}${scarf}
    <g transform="translate(46 234) rotate(-8)"><rect x="-18" y="-22" width="36" height="44" rx="3" fill="#7a2335" ${st(4)}/><rect x="-14" y="-18" width="4" height="36" fill="#e8c25a"/><path d="M-4 -8 h14 M-4 0 h14" stroke="#e8c25a" stroke-width="2.5"/></g>${hand(56, 226)}
    ${headShape('#ffe8d6')}
    <path d="M30 118 Q24 62 82 48 Q130 40 160 66 Q176 88 170 118 Q164 96 146 88 Q130 100 110 86 Q90 98 72 86 Q50 96 30 118Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M70 56 Q100 46 130 54')}
    ${face(p, { dark: '#5a3418', light: '#d8a46a', mouth: 'smile', blush: .6, skin: '#ffe8d6' })}
    ${bag(p, 'R', BAG.beaded(), '#ffe8d6')}`;

  C.ron = (p) => `
    <defs>${grad(p + '-hr', '#f59a48', '#c8571e')}${grad(p + '-sw', '#8a2a3a', '#6a1e2c')}</defs>
    ${legs('#5a5a6e', '#1a1a24')}
    <path d="M56 196 Q100 184 144 196 L152 270 Q100 282 48 270Z" fill="url(#${p}-sw)" ${st(5)}/>
    <path d="M52 262 Q100 274 148 262" fill="none" stroke="#5a1424" stroke-width="5" stroke-dasharray="4 4"/><path d="M80 196 Q100 206 120 196" fill="none" stroke="#5a1424" stroke-width="5"/>
    <text x="100" y="250" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="34" fill="#e8c25a" stroke="${INK}" stroke-width="2">R</text>
    <g transform="translate(42 196)"><path d="M-10 0 q-14 10 -10 22" fill="none" stroke="#e8a0a8" stroke-width="3" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="16" ry="11" fill="#9a8a8a" ${st(3)}/>
      <circle cx="12" cy="-6" r="9" fill="#9a8a8a" ${st(3)}/><circle cx="9" cy="-14" r="4" fill="#e8a0a8" ${st(2)}/><circle cx="15" cy="-7" r="2" fill="${INK}"/><circle cx="21" cy="-4" r="2.4" fill="#ff8fbd"/></g>
    <path d="M24 126 Q14 34 100 30 Q186 34 176 126Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape('#ffeadb')}
    <path d="M30 114 Q30 48 100 42 Q170 48 170 114 L162 98 L152 110 L140 94 L128 108 L116 92 L102 106 L90 92 L76 108 L64 94 L52 110 L40 98Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M62 56 Q86 46 108 50')}
    <g fill="#d9884a"><circle cx="84" cy="152" r="2"/><circle cx="90" cy="148" r="2"/><circle cx="110" cy="148" r="2"/><circle cx="116" cy="152" r="2"/><circle cx="46" cy="158" r="2.2"/><circle cx="54" cy="154" r="2.2"/><circle cx="154" cy="158" r="2.2"/><circle cx="146" cy="154" r="2.2"/></g>
    ${face(p, { dark: '#1e5ab8', light: '#8fd0ff', mouth: 'grin', blush: .55, skin: '#ffeadb' })}
    ${bag(p, 'R', BAG.pumpkin(), '#ffeadb')}`;

  /* ================= Noragami ================= */
  C.yato = (p) => `
    <defs>${grad(p + '-hr', '#2a2e4a', '#11131f')}${grad(p + '-tr', '#3a3e5c', '#22253a')}</defs>
    ${legs('#2a2d44', '#f1f1f1')}
    <path d="M58 196 Q100 184 142 196 L150 270 Q100 282 50 270Z" fill="url(#${p}-tr)" ${st(5)}/>
    <path d="M100 200 V270" stroke="#c9cbe0" stroke-width="3"/><path d="M58 206 L50 268 M142 206 L150 268" stroke="#fff" stroke-width="4"/>
    <path d="M24 124 Q12 36 100 30 Q188 36 176 124 L190 104 L180 148 L166 124Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(SK)}
    <path d="M30 116 Q28 50 100 42 Q172 50 170 116 L162 90 L156 122 L144 82 L134 118 L122 78 L110 114 L100 76 L90 114 L78 78 L66 118 L54 84 L44 120 L38 96Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M62 56 Q84 46 104 50', '#9fb0ff', .45)}
    ${face(p, { dark: '#1858b0', light: '#7fd8ff', mouth: 'grin', blush: .4 })}
    <g id="${p}-tears" opacity="0"><path d="M58 152 Q50 170 58 178 Q66 170 58 152Z M142 152 Q134 170 142 178 Q150 170 142 152Z" fill="#8fd3ff" ${st(2)}/></g>
    <path d="M58 186 Q100 206 142 186 L140 204 Q100 222 60 204Z" fill="#fff" ${st(4)}/>
    <path d="M128 200 Q160 216 182 200 Q170 232 132 222Z" fill="#fff" ${st(4)}/><path d="M140 210 q14 6 28 0" fill="none" stroke="#d8dce8" stroke-width="2.5"/>
    <g id="${p}-coin" opacity="0"><circle cx="40" cy="200" r="13" fill="#f0c04a" ${st(3)}/><circle cx="40" cy="200" r="4" fill="#fff6ea" ${st(2)}/></g>
    ${bag(p, 'R', BAG.plastic())}`;

  /* ================= Kamisama Kiss ================= */
  const sleeves = (c) => `<path d="M60 200 Q36 208 32 246 L62 242Z M140 200 Q164 208 168 246 L138 242Z" fill="${c}" ${st(4)}/>`;
  C.nanami = (p) => `
    <defs>${grad(p + '-hr', '#c08a5a', '#7a4a2a')}</defs>
    <path d="M24 128 Q12 40 100 32 Q188 40 176 128 Q184 168 168 196 L160 140 L40 140 L32 196 Q16 168 24 128Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${legs('#fff8f0', '#8a5a3a')}
    <path d="M58 222 Q100 214 142 222 L154 274 Q100 284 46 274Z" fill="#d6322b" ${st(5)}/><path d="M80 226 l-6 48 M100 224 v52 M120 226 l6 48" stroke="#a8232e" stroke-width="3"/>
    ${sleeves('#fff8f0')}
    <path d="M60 196 Q100 186 140 196 L142 228 Q100 236 58 228Z" fill="#fff8f0" ${st(5)}/>
    <path d="M86 196 L100 216 L114 196Z" fill="#d6322b"/><path d="M82 196 L100 224 L118 196" fill="none" ${st(3)}/>
    ${headShape(SK)}
    <path d="M30 118 Q28 50 100 44 Q172 50 170 118 Q160 92 146 98 Q138 80 122 92 Q112 74 100 90 Q88 74 78 92 Q62 80 54 98 Q40 92 30 118Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M64 58 Q86 48 108 52')}
    <g transform="translate(150 90) rotate(30)"><rect x="-13" y="-4.5" width="26" height="9" rx="4.5" fill="#ff8fbd" ${st(2.5)}/><circle cx="-6" cy="0" r="2" fill="#fff"/></g>
    ${face(p, { dark: '#7a4a2a', light: '#e8b47a', mouth: 'grin', blush: .65 })}
    ${bag(p, 'R', BAG.beaded('#ff8fbd'))}`;

  C.tomoe = (p) => `
    <defs>${grad(p + '-hr', '#ffffff', '#c8c8de')}</defs>
    <path d="M136 262 Q196 252 188 186 Q184 166 168 162 Q180 204 146 232Z" fill="url(#${p}-hr)" ${st(4)}/><path d="M182 180 Q186 168 176 164 Q178 176 172 182Z" fill="#c7a6ff"/>
    <path d="M24 128 Q12 40 100 32 Q188 40 176 128 Q186 196 172 248 L160 140 L40 140 L28 248 Q14 196 24 128Z" fill="url(#${p}-hr)" ${st(5)}/>
    <path d="M42 84 L30 14 L84 54Z M158 84 L170 14 L116 54Z" fill="url(#${p}-hr)" ${st(4.5)}/><path d="M46 70 L37 30 L68 54Z M154 70 L163 30 L132 54Z" fill="#c7a6ff"/>
    ${legs('#5a3a8a', '#f4f4fa')}
    <path d="M58 222 Q100 214 142 222 L154 274 Q100 284 46 274Z" fill="#6a4a9a" ${st(5)}/><path d="M80 226 l-6 48 M100 224 v52 M120 226 l6 48" stroke="#4a2e78" stroke-width="3"/>
    ${sleeves('#f4f4fa')}
    <path d="M60 196 Q100 186 140 196 L142 228 Q100 236 58 228Z" fill="#f4f4fa" ${st(5)}/>
    <path d="M86 196 L100 216 L114 196Z" fill="#6a4a9a"/><path d="M82 196 L100 224 L118 196" fill="none" ${st(3)}/>
    ${headShape(SK)}
    <path d="M30 120 Q28 50 100 44 Q172 50 170 120 L164 100 L156 128 L146 92 L136 120 L124 88 L112 116 L100 86 L88 116 L76 88 L64 120 L54 92 L44 128 L36 100Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    <path d="M32 110 Q22 150 36 186 L44 148Z M168 110 Q178 150 164 186 L156 148Z" fill="url(#${p}-hr)" ${st(4)}/>
    ${face(p, { dark: '#5a3a9a', light: '#c7a6ff', kind: 'calm', mouth: 'flat', blush: .4 })}
    <g id="${p}-fire" opacity=".9"><path d="M22 214 Q8 194 22 176 Q22 192 32 194 Q40 210 22 214Z" fill="#b89aff" ${st(2.5)}/><path d="M22 208 Q16 198 22 190 Q24 198 28 200 Q30 206 22 208Z" fill="#efe6ff"/></g>
    ${bag(p, 'R', BAG.lantern())}`;

  /* ================= How to Train Your Dragon ================= */
  C.hiccup = (p) => `
    <defs>${grad(p + '-hr', '#a8603a', '#6a3420')}</defs>
    <path d="M76 264 h19 v16 h-19z" fill="#6b4a33" ${st(4)}/><path d="M70 290 q0 -12 10 -12 h16 v12z" fill="#4a3326" ${st(4)}/>
    <path d="M105 264 h19 v8 h-19z" fill="#6b4a33" ${st(4)}/><path d="M111 272 h7 v12 h-7z" fill="#9aa3b4" ${st(3)}/><path d="M104 290 l4 -8 h16 l6 8z" fill="#9aa3b4" ${st(3.5)}/>
    <path d="M58 196 Q100 184 142 196 L150 270 Q100 282 50 270Z" fill="#4f7a4a" ${st(5)}/>
    <path d="M56 198 Q100 186 144 198 L138 252 L118 256 L112 206 L88 206 L82 256 L62 252Z" fill="#7a5a3e" ${st(4)}/>
    <path d="M54 200 Q66 188 80 196 Q92 186 100 196 Q108 186 120 196 Q134 188 146 200 Q130 210 100 206 Q70 210 54 200Z" fill="#c8a882" ${st(3)}/>
    <rect x="52" y="246" width="96" height="8" rx="3" fill="#4a3326"/><path d="M60 214 l6 30 M140 214 l-6 30" stroke="#4a3326" stroke-width="3"/>
    <path d="M24 124 Q12 40 100 32 Q188 40 176 124 L186 106 L180 146 L166 124 Z M24 124 L14 106 L20 146Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(SK)}
    <path d="M30 116 Q32 50 104 42 Q168 50 170 112 Q150 86 136 100 Q128 80 112 96 Q102 74 88 94 Q76 78 66 98 Q54 84 46 102 Q40 96 30 116Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    <path d="M30 130 l-4 10 6 4 -4 10 6 4 -4 10" fill="none" stroke="#6a3420" stroke-width="5" stroke-linecap="round"/>
    ${shine('M64 58 Q86 48 108 52')}
    ${freckles('#c98a5a')}
    ${face(p, { dark: '#2a7a3a', light: '#8fe0a0', mouth: 'smile', blush: .45 })}
    ${bag(p, 'R', BAG.basket(`<path d="M-12 -16 q8 -8 16 0 l6 -4 v10 l-6 -4 q-8 8 -16 0z" fill="#7fb8d8" ${st(2)}/>`))}`;

  C.toothless = (p) => `
    <path d="M140 262 Q196 262 192 214 Q190 196 176 196" fill="none" stroke="#22232e" stroke-width="15" stroke-linecap="round"/>
    <path d="M176 196 l-18 -16 l6 20z" fill="#22232e" ${st(3)}/><path d="M176 196 l20 -16 l-6 20z" fill="#d6322b" ${st(3)}/><circle cx="187" cy="188" r="2.5" fill="#fff"/>
    <g id="${p}-wing"><path d="M52 206 Q4 180 12 120 Q34 160 66 172Z" fill="#1d1e28" ${st(4)}/><path d="M148 206 Q196 180 188 120 Q166 160 134 172Z" fill="#1d1e28" ${st(4)}/>
      <path d="M20 140 Q36 168 58 180 M180 140 Q164 168 142 180" fill="none" stroke="#3a3b4c" stroke-width="2.5"/></g>
    <ellipse cx="100" cy="230" rx="54" ry="48" fill="#2a2b38" ${st(5)}/>
    <path d="M68 252 q-4 26 6 34 h18 q4 -16 2 -34z M132 252 q4 26 -6 34 h-18 q-4 -16 -2 -34z" fill="#2a2b38" ${st(4)}/>
    <path d="M74 286 v-6 M82 286 v-6 M118 286 v-6 M126 286 v-6" stroke="#4a4b5a" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 100 Q14 70 18 38 Q48 58 72 88Z M150 100 Q186 70 182 38 Q152 58 128 88Z" fill="#2a2b38" ${st(4)}/>
    <path d="M72 82 Q60 50 70 34 Q84 54 88 76Z M128 82 Q140 50 130 34 Q116 54 112 76Z" fill="#2a2b38" ${st(4)}/>
    <path d="M28 128 Q28 58 100 56 Q172 58 172 128 Q172 182 100 184 Q28 182 28 128Z" fill="#2a2b38" ${st(5)}/>
    <path d="M46 92 Q100 70 154 92" fill="none" stroke="#3a3b4c" stroke-width="3"/>
    <ellipse cx="100" cy="160" rx="42" ry="20" fill="#34354a"/><circle cx="90" cy="152" r="2.4" fill="#14141c"/><circle cx="110" cy="152" r="2.4" fill="#14141c"/>
    <g id="${p}-eyes">
      <ellipse cx="66" cy="126" rx="21" ry="23" fill="#b8e04a" ${st(3)}/><ellipse cx="66" cy="126" rx="15" ry="17" fill="#d8f07a"/><ellipse cx="66" cy="128" rx="5.5" ry="15" fill="#14141c"/><circle cx="73" cy="116" r="5.5" fill="#fff"/>
      <ellipse cx="134" cy="126" rx="21" ry="23" fill="#b8e04a" ${st(3)}/><ellipse cx="134" cy="126" rx="15" ry="17" fill="#d8f07a"/><ellipse cx="134" cy="128" rx="5.5" ry="15" fill="#14141c"/><circle cx="141" cy="116" r="5.5" fill="#fff"/>
    </g>
    <g id="${p}-happy" opacity="0"><path d="M48 130 Q66 110 84 130 M116 130 Q134 110 152 130" fill="none" stroke="#b8e04a" stroke-width="7" stroke-linecap="round"/></g>
    <g id="${p}-blush" opacity=".3"><ellipse cx="44" cy="156" rx="11" ry="6" fill="#ff8fbd"/><ellipse cx="156" cy="156" rx="11" ry="6" fill="#ff8fbd"/></g>
    <path id="${p}-mouth" d="${MOUTH.shut.d}" fill="none" stroke="#14141c" stroke-width="3.5" stroke-linecap="round"/>
    ${bag(p, 'R', BAG.pail(), '#2a2b38')}`;

  /* ================= Avatar (Na'vi) ================= */
  function navi(p, o) {
    const skin = '#5b98e0', dark = '#3d73bd';
    const hair = o.hair === 'long'
      ? `<path d="M26 128 Q14 40 100 32 Q186 40 174 128 L182 244 Q172 262 160 244 L156 160 L44 160 L40 248 Q28 264 18 248Z" fill="url(#${p}-hr)" ${st(5)}/><path d="M168 170 l6 8 -6 8 6 8 -6 8 6 8" fill="none" stroke="#0e0c18" stroke-width="3"/>`
      : o.hair === 'wavy'
        ? `<path d="M26 128 Q14 40 100 32 Q186 40 174 128 Q188 160 176 190 Q190 220 172 248 L156 160 L44 160 L28 248 Q10 220 24 190 Q12 160 26 128Z" fill="url(#${p}-hr)" ${st(5)}/>`
      : o.hair === 'kid'
        ? `<path d="M26 126 Q16 44 100 38 Q184 44 174 126Z" fill="url(#${p}-hr)" ${st(5)}/><path d="M30 104 q-26 24 -16 60 M170 104 q26 24 16 60" fill="none" stroke="#1a1726" stroke-width="12" stroke-linecap="round"/><circle cx="14" cy="166" r="6" fill="#ff8fbd" ${st(2)}/><circle cx="186" cy="166" r="6" fill="#ffd25e" ${st(2)}/>`
        : `<path d="M26 124 Q16 38 100 34 Q184 38 174 124 Q196 160 184 214" fill="url(#${p}-hr)" ${st(5)}/><path d="M172 126 Q196 168 182 224" fill="none" stroke="#1a1726" stroke-width="11" stroke-linecap="round"/>`;
    const top = o.kiri ? `<path d="M64 200 Q100 216 136 200 L134 226 Q100 240 66 226Z" fill="#3a9a7a" ${st(3)}/><path d="M70 214 Q100 228 130 214" fill="none" stroke="#a8ecd6" stroke-width="3"/><circle cx="100" cy="206" r="5" fill="#ff8fe0" ${st(2)}/>`
      : o.female ? `<path d="M64 200 Q100 220 136 200 L134 220 Q100 236 66 220Z" fill="#b8562e" ${st(3)}/><g fill="#e8c25a"><circle cx="76" cy="220" r="3"/><circle cx="90" cy="226" r="3"/><circle cx="110" cy="226" r="3"/><circle cx="124" cy="220" r="3"/></g>`
      : `<path d="M72 200 Q100 220 128 200" fill="none" stroke="#e8c25a" stroke-width="4"/><g fill="#4fc3c8"><circle cx="84" cy="210" r="3"/><circle cx="100" cy="214" r="3.4"/><circle cx="116" cy="210" r="3"/></g>`;
    return `
      <defs>${grad(p + '-hr', '#2a2438', '#0e0c18')}</defs>
      <path d="M150 260 Q192 262 188 216" fill="none" stroke="${skin}" stroke-width="9" stroke-linecap="round"/>
      ${hair}
      <path d="M76 264 h19 v24 h-19z M105 264 h19 v24 h-19z" fill="${skin}" ${st(4)}/>
      <path d="M62 196 Q100 184 138 196 L146 262 Q100 272 54 262Z" fill="${skin}" ${st(5)}/>
      <path d="M64 220 q10 6 4 16 M136 220 q-10 6 -4 16 M90 244 q10 6 20 0" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>
      <path d="M52 256 Q100 268 148 256 L152 280 Q100 290 48 280Z" fill="#8a5a3a" ${st(4)}/>
      ${top}
      <path d="M34 126 Q0 104 8 72 Q28 102 44 116Z M166 126 Q200 104 192 72 Q172 102 156 116Z" fill="${skin}" ${st(4)}/>
      ${headShape(skin)}
      <path d="M100 72 v18 M76 76 q4 8 0 14 M124 76 q-4 8 0 14 M42 136 q8 -2 12 4 M158 136 q-8 -2 -12 4 M44 156 q8 0 10 6 M156 156 q-8 0 -10 6" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 112 Q36 56 100 52 Q164 56 168 112 Q140 84 100 82 Q60 84 32 112Z" fill="url(#${p}-hr)" ${st(4.5)}/>
      ${o.female ? `<path d="M36 100 Q100 70 164 100" fill="none" stroke="#d6322b" stroke-width="5"/><g fill="#4fc3c8"><circle cx="54" cy="92" r="3.5"/><circle cx="100" cy="80" r="3.5"/><circle cx="146" cy="92" r="3.5"/></g>` : ''}
      ${o.kiri ? `<path d="M40 108 Q60 80 92 84 Q70 92 60 112 M160 108 Q140 80 108 84 Q130 92 140 112" fill="url(#${p}-hr)" ${st(3)}/><g transform="translate(150 84)"><circle r="7" fill="#9ff7a8" ${st(2.5)}/><circle r="2.5" fill="#fff"/></g>` : ''}
      <path d="M95 148 Q100 156 105 148" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>
      ${face(p, { dark: '#c8901a', light: '#fff0a0', mouth: o.mouth || 'smile', blush: .35, kind: o.kid ? 'round' : 'norm', skin })}
      <g id="${p}-glow" opacity=".18" fill="#a8fbff">
        <circle cx="48" cy="114" r="2.6"/><circle cx="56" cy="106" r="2.2"/><circle cx="152" cy="114" r="2.6"/><circle cx="144" cy="106" r="2.2"/>
        <circle cx="40" cy="160" r="2.4"/><circle cx="160" cy="160" r="2.4"/><circle cx="100" cy="98" r="2"/>
        <circle cx="70" cy="234" r="2.6"/><circle cx="130" cy="234" r="2.6"/><circle cx="80" cy="248" r="2.2"/><circle cx="120" cy="248" r="2.2"/>
      </g>
      ${bag(p, o.bagLeft ? 'L' : 'R', BAG.navi(o.c1, o.c2), skin)}`;
  }
  C.jake = (p) => navi(p, { hair: 'short', mouth: 'smile', c1: '#4fc3c8', c2: '#e8823e' });
  C.neytiri = (p) => navi(p, { hair: 'long', female: true, mouth: 'soft', bagLeft: true });
  C.kiri = (p) => navi(p, { hair: 'wavy', kiri: true, mouth: 'soft', c1: '#a86ee0', c2: '#9ff7a8' });
  C.tuk = (p) => navi(p, { hair: 'kid', kid: true, mouth: 'grin', bagLeft: true, c1: '#ff8fbd', c2: '#ffd25e' });

  /* ================= Demon Slayer ================= */
  const slayerSuit = (p, w = 0) => `<defs>${grad(p + '-un', '#2a2a3a', '#16161f')}</defs>${torso(`url(#${p}-un)`, w)}
    <rect x="${56 - w}" y="244" width="${88 + 2 * w}" height="8" rx="3" fill="#f1f1f1" ${st(2)}/><g fill="#e8c25a"><circle cx="100" cy="212" r="3"/><circle cx="100" cy="228" r="3"/></g>`;
  const wraps = `<path d="M76 264 h19 v16 h-19z M105 264 h19 v16 h-19z" fill="#f4f4f4" ${st(4)}/><path d="M76 270 h19 M76 276 h19 M105 270 h19 M105 276 h19" stroke="#c9c2d0" stroke-width="2"/>
    <path d="M70 290 q0 -10 10 -10 h16 v10z M130 290 q0 -10 -10 -10 h-16 v10z" fill="#c08850" ${st(4)}/>`;

  C.tanjiro = (p) => `
    <defs>${grad(p + '-hr', '#3e1216', '#b8402e')}<pattern id="${p}-chk" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#1f8a64"/><rect width="8" height="8" fill="#1d1d26"/><rect x="8" y="8" width="8" height="8" fill="#1d1d26"/></pattern>
      ${grad(p + '-nz', '#2a1a20', '#d8743a')}</defs>
    <g transform="rotate(-8 24 230)"><rect x="-10" y="186" width="66" height="96" rx="5" fill="#c99158" ${st(4)}/><path d="M-10 204 h66 M-10 262 h66" stroke="#8a5a30" stroke-width="3.5"/><path d="M10 186 v96 M36 186 v96" stroke="#b07a46" stroke-width="2"/></g>
    ${wraps}
    <path d="M54 196 Q100 184 146 196 L160 270 Q100 282 40 270Z" fill="url(#${p}-chk)" ${st(5)}/>
    <path d="M84 196 L116 196 L118 270 L82 270Z" fill="#1d1d26" ${st(3)}/><rect x="80" y="244" width="40" height="8" fill="#f1f1f1" ${st(2)}/>
    <path d="M36 258 L78 240" stroke="#1d1d26" stroke-width="9" stroke-linecap="round"/><rect x="70" y="234" width="9" height="14" rx="2" fill="#e8c25a" ${st(2)}/>
    <g transform="translate(14 176) rotate(-14)">
      <path d="M-30 6 Q-34 -34 0 -38 Q34 -34 30 6 Q36 30 26 46 L-26 46 Q-36 30 -30 6Z" fill="url(#${p}-nz)" ${st(3.5)}/>
      <ellipse cx="0" cy="4" rx="25" ry="23" fill="#ffeadb" ${st(3.5)}/>
      <path d="M-25 -2 Q-22 -30 0 -30 Q22 -30 25 -2 Q12 -16 0 -12 Q-12 -16 -25 -2Z" fill="#2a1a20" ${st(3)}/>
      <ellipse cx="-9" cy="4" rx="5.5" ry="7" fill="#ff7ab0" ${st(2)}/><ellipse cx="9" cy="4" rx="5.5" ry="7" fill="#ff7ab0" ${st(2)}/><circle cx="-7" cy="1" r="2" fill="#fff"/><circle cx="11" cy="1" r="2" fill="#fff"/>
      <rect x="-12" y="13" width="24" height="8" rx="4" fill="#8ac86a" ${st(2.5)}/><path d="M-6 13 v8 M0 13 v8 M6 13 v8" stroke="#5a8a3a" stroke-width="1.4"/><path d="M-14 17 h-8 M14 17 h8" stroke="#c0392b" stroke-width="2"/>
      <path d="M12 -28 q10 -10 18 -2 q-8 2 -10 8z" fill="#ff8fbd" ${st(2.5)}/></g>
    <path d="M24 122 Q14 32 100 28 Q186 32 176 122 L188 100 L180 148 L166 120 Z M24 122 L12 100 L20 148Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${ears(SK)}
    ${headShape(SK)}
    <path d="M30 114 Q30 48 100 42 Q170 48 170 114 L162 88 L154 120 L142 80 L132 114 L120 76 L108 110 L98 74 L86 110 L74 78 L62 116 L50 86 L40 114Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M62 56 Q84 46 104 50', '#ff9a8a', .4)}
    <path d="M118 98 q8 -13 24 -7 q-2 11 -15 15 q-7 -2 -9 -8z" fill="#9a2a2a" opacity=".9"/>
    <g><path d="M30 150 v6 M170 150 v6" ${st(2.5)}/><rect x="22" y="156" width="16" height="26" rx="2" fill="#fff6ea" ${st(2.5)}/><circle cx="30" cy="168" r="5.5" fill="#d6322b"/><path d="M30 160 v-2 M24 168 h-2 M36 168 h2" stroke="#d6322b" stroke-width="1.5"/>
      <rect x="162" y="156" width="16" height="26" rx="2" fill="#fff6ea" ${st(2.5)}/><circle cx="170" cy="168" r="5.5" fill="#d6322b"/><path d="M170 160 v-2 M164 168 h-2 M176 168 h2" stroke="#d6322b" stroke-width="1.5"/></g>
    ${face(p, { dark: '#5e161a', light: '#ec6450', mouth: 'open' })}
    <g id="${p}-water" opacity="0" fill="none" stroke-linecap="round"><ellipse cx="100" cy="224" rx="96" ry="34" stroke="#5ac8fa" stroke-width="9" stroke-dasharray="70 26"/><ellipse cx="100" cy="224" rx="80" ry="24" stroke="#dff6ff" stroke-width="4" stroke-dasharray="30 40"/></g>
    ${bag(p, 'R', BAG.furoshiki())}`;

  C.sanemi = (p) => `
    <defs>${grad(p + '-hr', '#ffffff', '#c8ccd8')}</defs>
    ${wraps}
    <path d="M50 196 Q100 184 150 196 L164 270 Q100 282 36 270Z" fill="#f6f3ec" ${st(5)}/>
    <path d="M72 196 L128 196 L132 270 L68 270Z" fill="#22232e" ${st(3)}/>
    <path d="M82 196 L100 236 L118 196Z" fill="${SK}" ${st(3)}/><path d="M88 202 l18 26 M112 200 l-10 24 M92 220 l14 -6" stroke="#d98a8a" stroke-width="3" stroke-linecap="round"/>
    <path d="M22 128 L4 112 L20 104 L6 80 L28 82 L22 54 L46 64 L50 34 L70 52 L84 22 L100 46 L118 20 L130 50 L152 32 L154 62 L180 54 L174 82 L196 82 L180 104 L196 114 L178 128Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(SK)}
    <path d="M30 116 L34 84 L44 98 L48 64 L62 90 L72 54 L82 86 L96 50 L104 84 L118 52 L124 88 L138 60 L144 94 L156 70 L158 102 L168 90 L170 118 Q100 92 30 116Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${face(p, { dark: '#5a2a8a', light: '#c8a0f0', kind: 'sharp', mouth: 'pout', blush: .25, brows: 'angry' })}
    <path d="M44 112 L66 164 M130 104 L150 140 M92 150 l16 10 M146 154 l10 -8" stroke="#d98a8a" stroke-width="3.5" stroke-linecap="round"/>
    ${bag(p, 'R', BAG.ohagi())}`;

  C.genya = (p) => `
    <defs>${grad(p + '-hr', '#4a3a6a', '#16121f')}</defs>
    ${wraps}${slayerSuit(p)}
    <path d="M58 198 Q38 204 40 226 L66 222Z M142 198 Q162 204 160 226 L134 222Z" fill="#3a3a4a" ${st(4)}/>
    ${headShape(SK)}
    <path d="M34 112 Q36 70 78 58 L80 100 Q50 98 34 112Z M166 112 Q164 70 122 58 L120 100 Q150 98 166 112Z" fill="#3e3450" opacity=".92"/><path d="M44 96 l6 -4 M52 84 l6 -4 M60 74 l6 -4 M156 96 l-6 -4 M148 84 l-6 -4 M140 74 l-6 -4" stroke="#5a5070" stroke-width="2"/>
    <path d="M74 106 L66 52 L80 60 L78 24 L92 40 L100 8 L108 40 L122 24 L120 60 L134 52 L126 106 Q100 94 74 106Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${face(p, { dark: '#4a2a7a', light: '#b090e8', kind: 'sharp', mouth: 'soft', blush: .75 })}
    <path d="M44 150 Q100 140 156 150" fill="none" stroke="#d98a8a" stroke-width="4.5" stroke-linecap="round"/>
    ${bag(p, 'R', BAG.pumpkin())}`;

  /* ================= My Hero Academia ================= */
  C.deku = (p) => `
    <defs>${grad(p + '-hr', '#2f6a52', '#12332a')}${grad(p + '-suit', '#3a9a74', '#24684e')}</defs>
    <path d="M54 120 Q20 70 30 22 Q44 4 60 20 Q78 60 84 110Z M146 120 Q180 70 170 22 Q156 4 140 20 Q122 60 116 110Z" fill="#2d7a5a" ${st(4)}/><path d="M42 32 Q38 70 60 104 M158 32 Q162 70 140 104" fill="none" stroke="#1d5a42" stroke-width="7" stroke-linecap="round"/>
    <path d="M60 196 Q100 186 140 196 L148 268 Q100 278 52 268Z" fill="url(#${p}-suit)" ${st(5)}/>
    <path d="M80 200 L88 266 M120 200 L112 266" stroke="#1a1a24" stroke-width="5"/><path d="M64 214 Q100 226 136 214" stroke="#1a1a24" stroke-width="4" fill="none"/>
    <rect x="56" y="244" width="88" height="9" rx="3" fill="#9aa3b4" ${st(2)}/><rect x="68" y="240" width="14" height="16" rx="3" fill="#7a8a9a" ${st(2)}/><rect x="118" y="240" width="14" height="16" rx="3" fill="#7a8a9a" ${st(2)}/>
    <path d="M76 264 h19 v12 h-19z M105 264 h19 v12 h-19z" fill="url(#${p}-suit)" ${st(4)}/>
    <path d="M66 292 q-2 -18 10 -18 h20 v18z M134 292 q2 -18 -10 -18 h-20 v18z" fill="#e8322e" ${st(4)}/><path d="M66 288 h32 M102 288 h32" stroke="#fff" stroke-width="3.5"/><path d="M80 276 l6 6 M114 276 l6 6" stroke="#fff" stroke-width="2"/>
    <path d="M24 124 Q6 44 62 32 Q78 14 100 24 Q122 12 140 32 Q196 44 176 124 Q190 134 180 152 L164 128 L36 128 L20 152 Q10 134 24 124Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(SK)}
    <path d="M30 116 Q20 84 44 70 Q46 48 70 52 Q80 34 100 44 Q120 32 132 52 Q156 48 158 72 Q182 86 170 116 Q160 98 148 108 Q142 90 126 100 Q116 84 100 96 Q86 84 74 100 Q60 90 52 108 Q40 98 30 116Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M58 62 q10 -8 20 -4 M110 50 q12 -6 22 2', '#7ad8a8', .5)}
    <g fill="#c98a5a"><circle cx="44" cy="160" r="2.3"/><circle cx="52" cy="156" r="2.3"/><circle cx="51" cy="165" r="2.3"/><circle cx="43" cy="168" r="2"/><circle cx="156" cy="160" r="2.3"/><circle cx="148" cy="156" r="2.3"/><circle cx="149" cy="165" r="2.3"/><circle cx="157" cy="168" r="2"/></g>
    ${face(p, { dark: '#156a3a', light: '#7ee8a0', mouth: 'open', blush: .5, brows: 'worried' })}
    <path d="M64 186 Q100 200 136 186 L134 202 Q100 216 66 202Z" fill="#eef4f2" ${st(3.5)}/><path d="M80 194 v10 M92 197 v10 M108 197 v10 M120 194 v10" stroke="#9aa3b4" stroke-width="2"/>
    <g id="${p}-bolts" opacity="0" fill="none" stroke="#7dffb0" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"><path d="M22 210 l14 -10 -8 -6 16 -12"/><path d="M178 220 l-14 -8 8 -8 -16 -10"/><path d="M32 266 l16 -6 -6 -8 16 -6"/><path d="M168 272 l-16 -6 6 -8 -16 -6"/></g>
    ${bag(p, 'R', BAG.backpack(), '#fff')}`;

  C.bakugo = (p) => `
    <defs>${grad(p + '-hr', '#fff6c8', '#d8c47a')}</defs>
    ${legs('#1e1e28', '#ff8a2b')}
    <path d="M60 196 Q100 186 140 196 L148 268 Q100 278 52 268Z" fill="#1e1e28" ${st(5)}/>
    <path d="M74 200 L126 252 M126 200 L74 252" stroke="#ff8a2b" stroke-width="9" stroke-linecap="round"/><circle cx="100" cy="226" r="6" fill="#ffcf3a" ${st(2.5)}/>
    <path d="M18 128 L2 98 L28 102 L14 64 L44 80 L42 38 L68 66 L80 22 L100 56 L120 22 L132 66 L158 38 L156 80 L186 64 L172 102 L198 98 L182 128Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(SK)}
    <path d="M30 116 L38 80 L50 98 L56 62 L70 92 L82 54 L94 88 L106 52 L114 88 L128 56 L134 92 L148 64 L150 98 L162 82 L170 116 Q100 88 30 116Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${face(p, { dark: '#8a1a1a', light: '#ff6a5a', kind: 'sharp', mouth: 'teeth', blush: .2, brows: 'angry',
      under: `<path d="M36 128 L22 112 L50 116 Q70 108 100 122 Q130 108 150 116 L178 112 L164 128 L164 146 Q130 156 100 146 Q70 156 36 146Z" fill="#1e1e28" stroke="#ff8a2b" stroke-width="3.5" stroke-linejoin="round"/>`,
      extra: `<path d="M90 164 v8 M100 166 v10 M110 164 v8" stroke="${INK}" stroke-width="2"/>` })}
    <g><path d="M12 214 Q8 180 36 174 L68 186 L62 230 Q30 242 12 214Z" fill="#5a7a4a" ${st(4)}/><path d="M20 196 h40 M18 214 h40" stroke="#3a5a2f" stroke-width="3.5"/><path d="M26 176 q4 -14 16 -8" fill="none" stroke="#ffcf3a" stroke-width="4" stroke-linecap="round"/><circle cx="42" cy="168" r="5" fill="none" stroke="#ffcf3a" stroke-width="3"/>
      <path d="M188 214 Q192 180 164 174 L132 186 L138 230 Q170 242 188 214Z" fill="#5a7a4a" ${st(4)}/><path d="M180 196 h-40 M182 214 h-40" stroke="#3a5a2f" stroke-width="3.5"/><path d="M174 176 q-4 -14 -16 -8" fill="none" stroke="#ffcf3a" stroke-width="4" stroke-linecap="round"/><circle cx="158" cy="168" r="5" fill="none" stroke="#ffcf3a" stroke-width="3"/></g>
    ${bag(p, 'R', BAG.pumpkin())}`;

  /* ================= The Book of Life (carved wooden-doll look: painted cheek circles) ================= */
  const WOOD = '#f2cfa8';
  const guitarBack = `<path d="M152 168 L184 96" stroke="#7a4a2a" stroke-width="7" stroke-linecap="round"/><path d="M178 92 l10 -10 6 6 -10 10z" fill="#5a3418" ${st(2.5)}/>
    <g transform="rotate(24 150 196)"><path d="M150 166 Q172 166 170 186 Q180 200 170 216 Q166 234 150 234 Q134 234 130 216 Q120 200 130 186 Q128 166 150 166Z" fill="#e8a24a" ${st(4)}/><circle cx="150" cy="196" r="6" fill="#4a2a1a"/><path d="M144 224 h12" ${st(3)}/></g>`;

  C.manolo = (p) => `
    <defs>${grad(p + '-hr', '#2a1a20', '#0e0a0e')}</defs>
    ${guitarBack}
    ${legs('#1a1a22', '#1a1a22')}
    <path d="M58 196 Q100 186 142 196 L146 248 Q100 258 54 248Z" fill="#1a1a22" ${st(5)}/>
    <path d="M62 204 q12 10 0 22 q12 10 0 20 M138 204 q-12 10 0 22 q-12 10 0 20" fill="none" stroke="#e8c25a" stroke-width="4"/>
    <path d="M88 196 L100 222 L112 196Z" fill="#fff"/><path d="M92 210 h16" stroke="#d6322b" stroke-width="6" stroke-linecap="round"/>
    <path d="M60 248 h80 v20 h-80z" fill="#1a1a22" ${st(4)}/><path d="M66 250 v16 M134 250 v16" stroke="#e8c25a" stroke-width="3"/>
    <path d="M26 124 Q18 40 100 34 Q182 40 174 124Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(WOOD)}
    <path d="M30 116 Q34 50 104 42 Q166 48 170 110 Q146 82 110 84 Q96 70 80 82 Q56 88 30 116Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    <path d="M100 46 Q76 52 84 74 Q92 62 104 60" fill="url(#${p}-hr)" ${st(3.5)}/>${shine('M110 54 Q134 52 150 66')}
    ${face(p, { dark: '#4a2a14', light: '#c08a4a', mouth: 'smile', cheeks: 'doll', skin: WOOD })}
    <path d="M56 118 l6 -4 M144 118 l-6 -4" stroke="#8a5a3a" stroke-width="2"/>
    ${bag(p, 'L', BAG.pinata(), WOOD)}`;

  C.maria = (p) => `
    <defs>${grad(p + '-hr', '#3a1e1a', '#140a0a')}${grad(p + '-dr', '#e83a4a', '#a8182e')}</defs>
    <path d="M22 138 Q8 50 100 34 Q192 50 178 138 Q186 210 164 250 L158 160 L42 160 L36 250 Q14 210 22 138Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${legs(WOOD, '#7a2335')}
    <path d="M58 196 Q100 186 142 196 L166 272 Q100 286 34 272Z" fill="url(#${p}-dr)" ${st(5)}/>
    <path d="M72 198 L100 240 L128 198 L124 226 Q100 236 76 226Z" fill="#1a1a22" ${st(3)}/>
    <path d="M44 262 Q100 276 156 262" fill="none" stroke="#1a1a22" stroke-width="6"/><path d="M46 252 Q100 266 154 252" fill="none" stroke="#ffcf3a" stroke-width="3" stroke-dasharray="6 5"/>
    ${headShape(WOOD)}
    <path d="M30 120 Q30 52 96 46 Q164 50 170 120 Q160 88 132 80 Q106 92 82 80 Q50 90 30 120Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M56 64 Q80 50 104 52')}
    <g transform="translate(150 70)"><path d="M0 -14 Q10 -10 8 0 Q14 6 6 12 Q0 18 -6 12 Q-14 6 -8 0 Q-10 -10 0 -14Z" fill="#e8323e" ${st(2.5)}/><circle r="4" fill="#ffcf3a"/></g>
    ${face(p, { dark: '#4a2a14', light: '#c08a4a', mouth: 'smile', cheeks: 'doll', skin: WOOD })}
    ${bag(p, 'R', BAG.basket(`<g fill="#ff9a2b">${[-12, 0, 12].map((x) => `<circle cx="${x}" cy="-16" r="7" stroke="${INK}" stroke-width="2"/>`).join('')}</g>`), WOOD)}`;

  C.joaquin = (p) => `
    <defs>${grad(p + '-hr', '#2a1a14', '#0e0a08')}${grad(p + '-un', '#9ab8e8', '#6a8ac8')}</defs>
    ${legs('#e8e2d4', '#1a1a22')}
    <path d="M46 196 Q100 180 154 196 L156 268 Q100 280 44 268Z" fill="url(#${p}-un)" ${st(5)}/>
    <path d="M40 200 Q50 186 68 192 L62 206Z M160 200 Q150 186 132 192 L138 206Z" fill="#e8c25a" ${st(3)}/><path d="M42 204 v8 M48 206 v8 M54 206 v8 M158 204 v8 M152 206 v8 M146 206 v8" stroke="#e8c25a" stroke-width="2.5"/>
    <path d="M100 196 V268" stroke="#4a6aa8" stroke-width="3"/><g fill="#e8c25a"><circle cx="108" cy="214" r="3"/><circle cx="108" cy="232" r="3"/><circle cx="108" cy="250" r="3"/></g>
    <g transform="translate(78 230)"><path d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4Z" fill="#ffcf3a" ${st(2.5)}/><circle r="3" fill="#d6322b"/></g>
    <path d="M26 118 Q20 40 100 36 Q180 40 174 118Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(WOOD)}
    <path d="M30 110 Q36 48 100 44 Q164 48 170 110 Q150 76 100 74 Q50 76 30 110Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M60 58 Q82 50 104 52')}
    ${face(p, { dark: '#4a2a14', light: '#c08a4a', mouth: 'grin', cheeks: 'doll', skin: WOOD, brows: 'heavy',
      extra: `<path d="M64 160 Q78 146 100 156 Q122 146 136 160 Q122 168 100 162 Q78 168 64 160Z" fill="#2a1a14" ${st(2.5)}/>` })}
    ${bag(p, 'R', BAG.medals(), WOOD)}`;

  /* ================= Howl's Moving Castle ================= */
  C.howl = (p) => `
    <defs>${grad(p + '-hr', '#fff0a8', '#e0b84a')}<pattern id="${p}-hq" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="20" height="20" fill="#f6b8cc"/><rect width="10" height="10" fill="#fff4f8"/><rect x="10" y="10" width="10" height="10" fill="#fff4f8"/></pattern></defs>
    ${legs('#2a2a3a', '#1a1a22')}
    <path d="M52 196 Q100 184 148 196 L160 270 Q100 282 40 270Z" fill="url(#${p}-hq)" ${st(5)}/>
    <path d="M84 196 L116 196 L114 270 L86 270Z" fill="#fff" ${st(3)}/><path d="M92 206 L100 226 L108 206" fill="none" stroke="#c9c2d0" stroke-width="2"/>
    <path d="M86 196 Q100 214 114 196" fill="none" stroke="#c8a040" stroke-width="2.5"/><path d="M100 212 l-5 8 5 8 5 -8z" fill="#3aa86a" ${st(2)}/>
    <path d="M24 130 Q14 36 100 30 Q186 36 176 130 Q182 160 168 176 L162 130 L38 130 L32 176 Q18 160 24 130Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(SK)}
    <path d="M30 118 Q30 50 100 44 Q170 50 170 118 Q160 96 150 106 Q146 82 128 92 Q118 76 104 90 Q92 74 80 90 Q66 78 58 100 Q46 90 40 112 Q36 104 30 118Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M64 58 Q88 46 112 50', '#ffffff', .55)}
    <path d="M28 150 v10 M172 150 v10" ${st(2)}/><path d="M24 160 l4 10 4 -10z M168 160 l4 10 4 -10z" fill="#5ac8fa" ${st(2)}/>
    ${face(p, { dark: '#1a4aa8', light: '#8ad0ff', mouth: 'smile', blush: .5 })}
    ${bag(p, 'R', BAG.bouquet())}`;

  C.sophie = (p) => `
    <defs>${grad(p + '-hr', '#f4f4fa', '#b8bccc')}${grad(p + '-dr', '#6a8ad0', '#3a5aa0')}</defs>
    <path d="M26 132 Q16 44 100 38 Q184 44 174 132 Q176 156 160 164 L156 128 L44 128 L40 164 Q24 156 26 132Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${legs('#f4e6d8', '#6a4a3a')}
    <path d="M56 196 Q100 186 144 196 L160 272 Q100 284 40 272Z" fill="url(#${p}-dr)" ${st(5)}/>
    <path d="M72 206 Q100 214 128 206 L132 266 Q100 274 68 266Z" fill="#fff8ee" ${st(3)}/><path d="M76 196 Q100 208 124 196" fill="none" stroke="#fff8ee" stroke-width="5"/>
    ${headShape(SK)}
    <path d="M30 118 Q30 50 100 44 Q170 50 170 118 Q154 88 128 86 Q112 96 98 84 Q80 94 66 86 Q44 92 30 118Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    <path d="M10 76 Q100 50 190 76 Q194 88 178 90 Q100 70 22 90 Q6 88 10 76Z" fill="#e8c878" ${st(4)}/>
    <path d="M36 74 Q40 22 100 18 Q160 22 164 74 Q100 60 36 74Z" fill="#f0d488" ${st(4.5)}/><path d="M38 66 Q100 50 162 66 L162 76 Q100 60 38 76Z" fill="#d6322b" ${st(2.5)}/>
    <path d="M60 34 l4 8 M80 26 l2 8 M120 26 l-2 8 M140 34 l-4 8" stroke="#c8a858" stroke-width="2"/>
    ${face(p, { dark: '#4a4a6a', light: '#a8a8c8', mouth: 'smile', blush: .55 })}
    ${bag(p, 'L', BAG.basket(`<path d="M-14 -14 h28" stroke="#fff8ee" stroke-width="6" stroke-linecap="round"/>`))}`;

  C.calcifer = (p) => `
    <defs><radialGradient id="${p}-fl" cx=".5" cy=".7" r=".7"><stop offset="0" stop-color="#fff2a8"/><stop offset=".45" stop-color="#ffa63a"/><stop offset="1" stop-color="#e8402a"/></radialGradient></defs>
    <path d="M44 282 L156 262 M48 262 L152 284" stroke="#6b4a33" stroke-width="18" stroke-linecap="round"/><path d="M44 282 L156 262 M48 262 L152 284" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".5"/>
    <g id="${p}-flame">
      <path d="M100 276 Q30 276 36 210 Q38 176 58 150 Q56 178 72 182 Q62 136 92 96 Q92 136 108 140 Q110 108 132 90 Q128 128 146 150 Q150 136 156 128 Q174 170 166 214 Q166 276 100 276Z" fill="url(#${p}-fl)" ${st(5)}/>
      <path d="M100 268 Q62 266 66 222 Q70 196 86 184 Q86 206 100 206 Q104 186 118 176 Q118 200 130 210 Q136 266 100 268Z" fill="#fff6c8" opacity=".6"/>
    </g>
    <g id="${p}-eyes"><ellipse cx="78" cy="206" rx="16" ry="20" fill="#fff" ${st(3.5)}/><ellipse cx="122" cy="206" rx="16" ry="20" fill="#fff" ${st(3.5)}/>
      <ellipse cx="80" cy="210" rx="7" ry="9" fill="${INK}"/><ellipse cx="120" cy="210" rx="7" ry="9" fill="${INK}"/><circle cx="83" cy="205" r="3" fill="#fff"/><circle cx="123" cy="205" r="3" fill="#fff"/></g>
    <g id="${p}-happy" opacity="0"><path d="M62 210 Q78 194 94 210 M106 210 Q122 194 138 210" fill="none" ${st(5.5)}/></g>
    <g id="${p}-blush" opacity="0"/>
    <path id="${p}-mouth" d="M78 236 Q100 258 122 236 Q100 244 78 236Z" fill="#a8241a" ${st(3.5)}/><path d="M88 240 l3 6 3 -5 3 6 3 -6 3 6 3 -5 3 5" fill="none" stroke="#fff" stroke-width="2"/>
    <g transform="translate(160 236) scale(1.2)"><g id="${p}-bag">${BAG.pan()}</g></g>`;

  /* ================= Fantastic Beasts ================= */
  C.newt = (p) => `
    <defs>${grad(p + '-hr', '#c07a46', '#7a4424')}${grad(p + '-ct', '#3a7aa0', '#25587a')}</defs>
    ${legs('#5a4436', '#2a1d14')}
    <path d="M50 196 Q100 184 150 196 L164 272 Q100 284 36 272Z" fill="url(#${p}-ct)" ${st(5)}/>
    <path d="M52 198 L66 184 L84 200Z M148 198 L134 184 L116 200Z" fill="url(#${p}-ct)" ${st(3.5)}/>
    <path d="M80 198 L120 198 L122 252 L78 252Z" fill="#c8923e" ${st(3)}/><g fill="#8a5a1e"><circle cx="100" cy="216" r="2.5"/><circle cx="100" cy="232" r="2.5"/></g>
    <path d="M86 196 L100 210 L114 196Z" fill="#f4f0e6"/><path d="M88 202 l12 6 -12 6z M112 202 l-12 6 12 6z" fill="#7a4a2a" ${st(2)}/>
    <g transform="translate(66 226)"><rect x="-12" y="-4" width="24" height="18" rx="2" fill="#25587a" ${st(3)}/>
      <path d="M0 -4 V-22 M0 -14 l-6 -6 M0 -14 l6 -5" stroke="#5c8f3a" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="M0 -36 Q9 -30 0 -22 Q-9 -30 0 -36Z" fill="#7ac850" ${st(1.8)}/>
      <circle cx="-2.5" cy="-27" r="1.4" fill="${INK}"/><circle cx="2.5" cy="-27" r="1.4" fill="${INK}"/></g>
    <path d="M26 122 Q16 38 100 32 Q184 38 174 122 Q180 138 170 150 L160 122 L40 122 L30 150 Q20 138 26 122Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(SK)}
    <path d="M30 116 Q26 54 92 44 Q150 40 168 78 Q174 96 170 114 Q156 84 136 92 Q124 70 104 86 Q92 70 76 86 Q58 78 48 100 Q38 100 30 116Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    <path d="M100 46 Q120 30 140 40 Q124 44 118 56" fill="url(#${p}-hr)" ${st(3.5)}/>${shine('M60 62 Q80 50 100 52')}
    ${freckles('#c98a5a')}
    ${face(p, { dark: '#2a6a7a', light: '#9fe0e0', mouth: 'soft', blush: .5, brows: 'worried' })}
    ${bag(p, 'R', BAG.suitcase())}`;

  C.tina = (p) => `
    <defs>${grad(p + '-hr', '#3a2620', '#120a08')}${grad(p + '-ct', '#4a5a7a', '#2e3a54')}</defs>
    <path d="M26 132 Q14 42 100 36 Q186 42 174 132 Q176 162 160 166 L158 126 L42 126 L40 166 Q24 162 26 132Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${legs('#2a2d44', '#1a1a24')}
    <path d="M48 196 Q100 184 152 196 L166 276 Q100 288 34 276Z" fill="url(#${p}-ct)" ${st(5)}/>
    <path d="M60 196 L84 222 L92 196Z M140 196 L116 222 L108 196Z" fill="url(#${p}-ct)" ${st(3)}/>
    <path d="M90 196 L100 214 L110 196Z" fill="#c4dcf4" ${st(2)}/><path d="M100 214 V276" stroke="#232c44" stroke-width="3"/>
    <path d="M40 236 L22 196" stroke="#4a3020" stroke-width="5" stroke-linecap="round"/>${hand(42, 236)}
    ${headShape(SK)}
    <path d="M30 118 Q30 50 100 44 Q170 50 170 118 L170 92 Q140 86 100 88 Q60 86 30 92Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    <path d="M32 96 Q100 82 168 96" fill="none" stroke="#120a08" stroke-width="2"/>${shine('M56 60 Q80 50 104 52')}
    ${face(p, { dark: '#4a2a1a', light: '#b08058', mouth: 'smile', blush: .45 })}
    ${bag(p, 'R', BAG.purse())}`;

  C.jacob = (p) => `
    <defs>${grad(p + '-hr', '#3e2c20', '#1a120c')}${grad(p + '-st', '#8a6a4a', '#64482e')}</defs>
    ${legs('#5a4030', '#2a1d14')}
    <path d="M52 196 Q100 182 148 196 Q174 236 154 270 Q100 284 46 270 Q26 236 52 196Z" fill="url(#${p}-st)" ${st(5)}/>
    <path d="M78 198 L100 240 L122 198 L118 254 Q100 262 82 254Z" fill="#a8845a" ${st(3)}/>
    <path d="M86 196 L100 214 L114 196Z" fill="#fff"/><path d="M96 206 h8 l4 26 -8 8 -8 -8z" fill="#7a2335" ${st(2)}/>
    <path d="M28 116 Q24 42 100 38 Q176 42 172 116Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape('#ffe2c8')}
    <path d="M30 106 Q36 50 104 46 Q164 50 170 106 Q144 72 96 74 Q72 74 54 84 Q40 92 30 106Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M64 58 Q90 50 116 54')}
    ${face(p, { dark: '#4a2a1a', light: '#b08058', mouth: 'smile', blush: .85, skin: '#ffe2c8',
      extra: `<path d="M74 156 Q88 144 100 154 Q112 144 126 156 Q112 162 100 158 Q88 162 74 156Z" fill="#3e2c20" ${st(2)}/>` })}
    ${bag(p, 'R', BAG.pastry(), '#ffe2c8')}`;

  C.queenie = (p) => `
    <defs>${grad(p + '-hr', '#fff6d0', '#e8cc80')}${grad(p + '-ct', '#ffb8d0', '#e8849e')}</defs>
    <path d="M22 140 Q4 112 18 86 Q10 52 44 40 Q64 18 100 26 Q136 18 156 40 Q190 52 182 86 Q196 112 178 140 Q186 162 166 168 Q156 150 160 130 L40 130 Q44 150 34 168 Q14 162 22 140Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${legs('#f6d0dc', '#c2413b')}
    <path d="M54 196 Q100 186 146 196 L160 272 Q100 284 40 272Z" fill="url(#${p}-ct)" ${st(5)}/>
    <path d="M58 194 Q70 180 84 192 Q92 182 100 192 Q108 182 116 192 Q130 180 142 194 Q138 210 120 206 Q110 214 100 206 Q90 214 80 206 Q62 210 58 194Z" fill="#fff4f8" ${st(3)}/>
    <g fill="#fff"><circle cx="100" cy="226" r="3.5" ${st(1.5)}/><circle cx="100" cy="244" r="3.5" ${st(1.5)}/></g>
    ${headShape('#ffeadf')}
    <path d="M30 118 Q24 60 64 50 Q84 34 104 44 Q128 36 146 52 Q176 64 170 118 Q164 96 148 92 Q150 76 134 76 Q124 90 108 80 Q96 92 84 82 Q70 88 62 80 Q46 90 46 106 Q36 106 30 118Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M58 58 q10 -8 22 -4 M104 48 q14 -6 26 2', '#ffffff', .6)}
    ${face(p, { dark: '#1a4aa8', light: '#8ad0ff', mouth: { d: 'M90 165 Q100 175 110 165 Q100 168 90 165Z' }.d, mfill: '#e8323e', blush: .7, skin: '#ffeadf' })}
    ${bag(p, 'L', BAG.beaded('#e85a8a'), '#ffeadf')}`;

  C.niffler = (p) => `
    <defs><radialGradient id="${p}-fur" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#4a4452"/><stop offset="1" stop-color="#1a1620"/></radialGradient></defs>
    <path d="M66 274 q-8 16 6 16 h16 M134 274 q8 16 -6 16 h-16" fill="#2a2630" ${st(4)}/>
    <path d="M38 230 Q34 176 64 158 Q60 140 74 136 Q84 148 100 148 Q116 148 126 136 Q140 140 136 158 Q166 176 162 230 Q160 284 100 284 Q40 284 38 230Z" fill="url(#${p}-fur)" ${st(5)}/>
    <path d="M52 172 l-6 -6 M60 164 l-4 -8 M140 164 l4 -8 M148 172 l6 -6 M96 148 l-2 -8 M106 148 l2 -8" stroke="#1a1620" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="100" cy="246" rx="34" ry="28" fill="#5a5262"/><path d="M72 236 Q100 250 128 236" fill="none" stroke="#2a2630" stroke-width="3.5"/>
    <g fill="#ffcf3a" stroke="${INK}" stroke-width="2"><circle cx="88" cy="234" r="6"/><circle cx="108" cy="232" r="6"/></g>
    <g id="${p}-eyes"><circle cx="76" cy="192" r="11" fill="#14141c" ${st(2.5)}/><circle cx="124" cy="192" r="11" fill="#14141c" ${st(2.5)}/><circle cx="80" cy="187" r="4.5" fill="#fff"/><circle cx="128" cy="187" r="4.5" fill="#fff"/><circle cx="73" cy="196" r="1.8" fill="#fff"/><circle cx="121" cy="196" r="1.8" fill="#fff"/></g>
    <g id="${p}-happy" opacity="0"><path d="M65 194 Q76 182 87 194 M113 194 Q124 182 135 194" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>
    <path d="M62 214 Q100 196 138 214 Q150 232 124 236 Q100 230 76 236 Q50 232 62 214Z" fill="#7a7084" ${st(3.5)}/><path d="M70 226 Q100 218 130 226" fill="none" stroke="#5a5266" stroke-width="2.5"/><ellipse cx="90" cy="212" rx="3" ry="2" fill="#14141c"/><ellipse cx="110" cy="212" rx="3" ry="2" fill="#14141c"/>
    <g id="${p}-blush" opacity=".6"><ellipse cx="58" cy="208" rx="9" ry="5" fill="#ff8fbd"/><ellipse cx="142" cy="208" rx="9" ry="5" fill="#ff8fbd"/></g>
    <path id="${p}-mouth" d="M94 240 Q100 244 106 240" fill="none" stroke="#c9c2d0" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M46 222 q-14 4 -12 18 q10 2 16 -8 M154 222 q14 4 12 18 q-10 2 -16 -8" fill="#2a2630" ${st(3.5)}/>
    <g id="${p}-coins" opacity="0" fill="#ffcf3a" stroke="${INK}" stroke-width="3">
      <circle cx="56" cy="268" r="11"/><circle cx="148" cy="272" r="10"/><circle cx="100" cy="130" r="10"/><circle cx="34" cy="236" r="9"/><circle cx="170" cy="240" r="9"/></g>`;

  /* ================= Black Clover ================= */
  const bullsCape = (p) => `<path d="M44 194 Q100 176 156 194 L164 240 Q100 254 36 240Z" fill="#1a1a22" ${st(5)}/>
    <g transform="translate(138 210) scale(.9)"><path d="M-10 -4 q-4 -8 0 -12 q1 6 5 8 M10 -4 q4 -8 0 -12 q-1 6 -5 8" fill="#e8c25a"/><path d="M-7 -4 q7 -4 14 0 l-2 12 q-5 5 -10 0z" fill="#e8c25a"/></g>`;
  const grimoire = (x, y, c = '#1a1a22', leaf = '#3aa55a', leaves = 5) => `<g transform="translate(${x} ${y})"><rect x="-13" y="-16" width="26" height="32" rx="3" fill="${c}" stroke="#e8c25a" stroke-width="3"/>
    ${[...Array(leaves).keys()].map((i) => `<ellipse cx="0" cy="-5" rx="3" ry="5" fill="${leaf}" transform="rotate(${i * 360 / leaves})"/>`).join('')}<circle r="2" fill="#e8c25a"/></g>`;

  C.asta = (p) => `
    <defs>${grad(p + '-hr', '#f2f2ec', '#a8a8a0')}</defs>
    <g id="${p}-sword"><path d="M42 234 L-8 84 L18 72 L62 228Z" fill="#1a1a22" ${st(4)}/><path d="M-8 84 l-2 -22 l18 2 l10 8z" fill="#1a1a22" ${st(3)}/>
      <path d="M2 104 l10 -4 M10 130 l10 -4 M18 156 l10 -4 M26 182 l10 -4" stroke="#5a5a6a" stroke-width="3"/><path d="M-2 92 l-6 2 M14 140 l6 -2" stroke="#3a3a4a" stroke-width="2"/>
      <rect x="36" y="220" width="40" height="10" rx="3" fill="#5a5a6a" ${st(3)}/>${hand(56, 230)}</g>
    ${legs('#22232e', '#3a2a1e')}
    <path d="M60 196 Q100 186 140 196 L148 268 Q100 278 52 268Z" fill="#2a2a34" ${st(5)}/>
    ${grimoire(132, 254)}
    ${bullsCape(p)}
    <path d="M18 128 L2 92 L28 98 L18 54 L46 74 L50 28 L74 58 L96 16 L112 54 L136 24 L140 66 L170 50 L162 92 L196 88 L180 128Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(SK)}
    ${spiky(`url(#${p}-hr)`)}
    <path d="M28 98 Q100 70 172 98 L170 114 Q100 86 30 114Z" fill="#1a1a22" ${st(3.5)}/><path d="M168 100 l18 -8 -4 14z" fill="#1a1a22" ${st(3)}/>
    ${face(p, { dark: '#1f7a3a', light: '#8fe8a0', mouth: 'grin', blush: .45, brows: 'angry' })}
    ${bag(p, 'R', BAG.basket(`<path d="M-14 -14 q14 -8 28 0" stroke="#fff" stroke-width="3" fill="none"/>`).replace(/#d6a05a/g, '#b98a55'))}`;

  C.yuno = (p) => `
    <defs>${grad(p + '-hr', '#2a2a3a', '#0e0e16')}</defs>
    ${legs('#22232e', '#e8c25a')}
    <path d="M48 194 Q100 178 152 194 L162 272 Q100 284 38 272Z" fill="#f6f1e2" ${st(5)}/>
    <path d="M80 196 L120 196 L122 270 L78 270Z" fill="#22232e" ${st(3)}/><path d="M50 202 L40 268 M150 202 L160 268" stroke="#e8c25a" stroke-width="4.5"/>
    <g transform="translate(62 212)"><path d="M0 -8 L-10 6 L0 2 L10 6Z" fill="#e8c25a" ${st(2)}/></g>
    ${grimoire(132, 252, '#2a3a2a', '#9ff7a8', 4)}
    <path d="M24 126 Q12 40 100 32 Q188 40 176 126 L188 108 L182 148 L168 124Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape(SK)}
    <path d="M30 120 Q28 50 100 44 Q172 50 170 120 L164 94 L152 118 L146 84 L130 108 L126 78 L110 104 L100 74 L90 104 L74 80 L70 112 L56 86 L46 116 L38 96Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M60 58 Q82 48 104 50', '#8a8ab0', .5)}
    ${face(p, { dark: '#a8781a', light: '#ffe08a', kind: 'calm', mouth: 'soft', blush: .35 })}
    <g transform="translate(170 186)"><path d="M-8 -6 Q-22 -20 -14 -28 Q-4 -22 -2 -8Z M8 -6 Q22 -20 14 -28 Q4 -22 2 -8Z" fill="#c8ffd8" opacity=".85" ${st(1.5)}/>
      <circle cx="0" cy="-6" r="9" fill="#ffeadb" ${st(2)}/><path d="M-9 -8 Q-8 -18 0 -18 Q8 -18 9 -8 Q4 -12 0 -10 Q-4 -12 -9 -8Z" fill="#3aa55a" ${st(1.5)}/>
      <circle cx="-3" cy="-5" r="1.5" fill="${INK}"/><circle cx="3" cy="-5" r="1.5" fill="${INK}"/><path d="M-5 4 Q0 14 5 4 L3 14 h-6z" fill="#7ad86a" ${st(1.5)}/></g>
    ${bag(p, 'R', BAG.goldpouch())}`;

  C.magna = (p) => `
    <defs>${grad(p + '-hr', '#fff4a0', '#e8c23a')}</defs>
    ${legs('#22232e', '#1a1a22')}
    <path d="M60 196 Q100 186 140 196 L148 268 Q100 278 52 268Z" fill="#f4f4f4" ${st(5)}/>
    ${bullsCape(p)}
    ${headShape(SK)}
    <path d="M30 112 Q28 72 44 58 L48 96 Q38 100 30 112Z M170 112 Q172 72 156 58 L152 96 Q162 100 170 112Z" fill="#c8a83a" opacity=".55"/>
    <path d="M44 100 Q34 30 104 16 Q150 10 168 34 Q146 30 136 38 Q160 52 156 100 Q140 72 100 70 Q60 72 44 100Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${shine('M70 40 Q100 22 132 28', '#ffffff', .55)}
    <g><circle cx="76" cy="84" r="13" fill="#2a2d44" ${st(3)}/><circle cx="124" cy="84" r="13" fill="#2a2d44" ${st(3)}/><path d="M89 84 h22" ${st(3)}/><path d="M70 80 l6 -4" stroke="#8a8ab0" stroke-width="2.5" stroke-linecap="round"/><path d="M118 80 l6 -4" stroke="#8a8ab0" stroke-width="2.5" stroke-linecap="round"/></g>
    ${face(p, { dark: '#3a4a8a', light: '#9fb0f0', kind: 'sharp', mouth: 'teeth', blush: .3, brows: 'angry', extra: `<path d="M106 162 l3 8 3 -7" fill="#fff" ${st(2)}/>` })}
    ${bag(p, 'R', BAG.fireball())}`;

  C.yami = (p) => `
    <defs>${grad(p + '-hr', '#2a2a34', '#0a0a10')}</defs>
    ${legs('#22232e', '#1a1a22')}
    <path d="M54 196 Q100 182 146 196 L152 268 Q100 278 48 268Z" fill="#2a2a34" ${st(5)}/>
    ${bullsCape(p)}
    <path d="M156 262 L180 136" stroke="#1a1a22" stroke-width="8" stroke-linecap="round"/><path d="M166 198 l16 4" stroke="#e8c25a" stroke-width="6" stroke-linecap="round"/>
    <path d="M22 124 L6 104 L24 98 L12 72 L38 76 L36 46 L62 62 L72 30 L92 54 L110 24 L122 54 L146 32 L148 64 L174 54 L168 80 L194 80 L178 104 L194 116 L178 124Z" fill="url(#${p}-hr)" ${st(5)}/>
    ${headShape('#f2d4b4')}
    <path d="M30 110 Q32 58 100 50 Q168 58 170 110 L160 90 L150 104 L140 80 L128 98 L116 74 L104 94 L92 72 L80 96 L68 78 L58 100 L46 86Z" fill="url(#${p}-hr)" ${st(4.5)}/>
    ${face(p, { dark: '#3a2a20', light: '#9a7a5a', kind: 'calm', mouth: 'flat', blush: .15, brows: 'heavy', skin: '#f2d4b4',
      extra: `<g fill="#7a6060" opacity=".6"><circle cx="84" cy="176" r="1.8"/><circle cx="92" cy="180" r="1.8"/><circle cx="100" cy="181" r="1.8"/><circle cx="108" cy="180" r="1.8"/><circle cx="116" cy="176" r="1.8"/><circle cx="88" cy="172" r="1.6"/><circle cx="112" cy="172" r="1.6"/></g>` })}
    ${bag(p, 'L', BAG.basket().replace(/#d6a05a/g, '#8a6a4a'), '#f2d4b4')}`;

  function char(name, p, cls = '') {
    return `<svg viewBox="0 0 200 300" class="chr ${cls}" data-char="${name}" overflow="visible" aria-hidden="true">${C[name](p)}</svg>`;
  }
  // a collectible figurine on a stand
  let toyN = 0;
  function toy(name) {
    const p = 'toy' + (toyN++);
    if (name === 'golden') return goldenToy(p);
    return `<svg viewBox="-6 -14 212 322" class="toyfig" data-toy="${name}" overflow="visible" aria-hidden="true"><ellipse cx="100" cy="294" rx="78" ry="13" fill="#ffd25e" stroke="${INK}" stroke-width="5"/>${C[name](p)}</svg>`;
  }
  function goldenToy(p) {
    return `<svg viewBox="-6 -14 212 322" class="toyfig" data-toy="golden" overflow="visible" aria-hidden="true">
      <ellipse cx="100" cy="294" rx="78" ry="13" fill="#ffd25e" stroke="${INK}" stroke-width="5"/>
      <g id="${p}-heart"><path d="M100 284 C-6 216 18 98 100 148 C182 98 206 216 100 284Z" fill="url(#gold${p})" stroke="${INK}" stroke-width="6"/>
      <defs><linearGradient id="gold${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0a8"/><stop offset=".5" stop-color="#ffcf3a"/><stop offset="1" stop-color="#e09a1a"/></linearGradient></defs>
      <path d="M40 134 l4 -10 4 10 10 4 -10 4 -4 10 -4 -10 -10 -4z M158 120 l3 -8 3 8 8 3 -8 3 -3 8 -3 -8 -8 -3z" fill="#fff0a8"/>
      <ellipse cx="80" cy="202" rx="7" ry="9" fill="${INK}"/><ellipse cx="120" cy="202" rx="7" ry="9" fill="${INK}"/><circle cx="83" cy="198" r="3" fill="#fff"/><circle cx="123" cy="198" r="3" fill="#fff"/>
      <path d="M88 220 Q100 232 112 220" fill="none" ${st(4)}/><ellipse cx="64" cy="220" rx="10" ry="6" fill="#ff8fbd" opacity=".7"/><ellipse cx="136" cy="220" rx="10" ry="6" fill="#ff8fbd" opacity=".7"/></g>
      <text x="100" y="262" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="13" fill="${INK}">K + K</text></svg>`;
  }

  /* ---------------- themed Happy Meal boxes ---------------- */
  const handle = `<path d="M44 46 Q44 20 70 20 Q96 20 96 46" fill="none" stroke="#ffcf3a" stroke-width="8" stroke-linecap="round"/>`;
  const smile = `<path d="M46 98 Q70 118 94 98" fill="none" stroke="#ffcf3a" stroke-width="7" stroke-linecap="round"/><circle cx="52" cy="86" r="5" fill="#ffcf3a"/><circle cx="88" cy="86" r="5" fill="#ffcf3a"/>`;
  const TOPPER = {
    hogwarts: `<g transform="translate(70 30)"><path d="M-34 14 v-22 h10 v22 M24 14 v-30 h10 v30 M-8 14 v-38 h16 v38" fill="#6d7fa8" ${st(3)}/>
      <path d="M-36 -8 l7 -14 7 14z M22 -16 l7 -16 7 16z M-10 -24 l10 -20 10 20z" fill="#2c3e78" ${st(3)}/><rect x="-3" y="-14" width="6" height="7" fill="#ffd98a"/><rect x="27" y="-6" width="4" height="6" fill="#ffd98a"/></g>`,
    shrine: `<g transform="translate(70 26)"><path d="M-40 -14 Q0 -24 40 -14 L42 -8 Q0 -18 -42 -8Z" fill="#d6322b" ${st(3)}/><rect x="-32" y="-4" width="64" height="5" fill="#d6322b" ${st(2.5)}/>
      <path d="M-26 -8 v26 M26 -8 v26" stroke="#d6322b" stroke-width="7"/></g>`,
    dragon: `<g transform="translate(70 34)"><path d="M-30 4 Q-62 -20 -58 -46 Q-44 -22 -24 -12Z M30 4 Q62 -20 58 -46 Q44 -22 24 -12Z" fill="#2a2b38" ${st(3)}/>
      <ellipse cx="0" cy="-2" rx="22" ry="16" fill="#2a2b38" ${st(3)}/><ellipse cx="-8" cy="-4" rx="5" ry="6" fill="#b8e04a"/><ellipse cx="8" cy="-4" rx="5" ry="6" fill="#b8e04a"/></g>`,
    pandora: `<g transform="translate(70 28)"><path d="M-36 6 Q-30 -22 0 -26 Q30 -22 36 6 Q20 22 0 26 Q-20 22 -36 6Z" fill="#5a9a5a" ${st(3)}/>
      <path d="M-10 18 v22 M8 20 v16" stroke="#9ff7ff" stroke-width="3" opacity=".9"/><circle cx="-14" cy="-10" r="4" fill="#ff8fbd"/><circle cx="12" cy="-14" r="3" fill="#a8fbff"/><circle cx="20" cy="0" r="3" fill="#a8fbff"/></g>`,
    slayer: `<g transform="translate(70 30)"><path d="M-38 10 L30 -40" stroke="#1a1a24" stroke-width="7" stroke-linecap="round"/><path d="M38 10 L-30 -40" stroke="#2a9a6e" stroke-width="7" stroke-linecap="round"/>
      <path d="M-26 -2 h14 M12 -2 h14" stroke="#e8c25a" stroke-width="5" stroke-linecap="round"/><g fill="#b89ae8"><circle cx="0" cy="-30" r="5"/><circle cx="-6" cy="-22" r="4.5"/><circle cx="6" cy="-22" r="4.5"/><circle cx="0" cy="-14" r="4"/></g></g>`,
    hero: `<g transform="translate(70 30)"><path d="M-6 -40 L-20 0 L-2 0 L-10 30 L20 -14 L2 -14 L12 -40Z" fill="#7dffb0" ${st(3)}/></g>`,
    beasts: `<g transform="translate(70 30)"><ellipse cx="0" cy="0" rx="26" ry="22" fill="#2a2630" ${st(3)}/><ellipse cx="0" cy="8" rx="12" ry="7" fill="#5a5060" ${st(2)}/>
      <circle cx="-9" cy="-5" r="4" fill="#fff"/><circle cx="9" cy="-5" r="4" fill="#fff"/><circle cx="-9" cy="-5" r="2" fill="#14141c"/><circle cx="9" cy="-5" r="2" fill="#14141c"/><circle cx="22" cy="-18" r="7" fill="#ffcf3a" ${st(2)}/></g>`,
    clover: `<g transform="translate(70 28)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-14" rx="9" ry="14" fill="#3aa55a" ${st(2.5)} transform="rotate(${a})"/>`).join('')}<circle r="5" fill="#e8c25a" ${st(2)}/></g>`,
    castle: `<g transform="translate(70 26)"><path d="M-26 14 L-26 -10 L-14 -22 L-6 -12 L4 -30 L16 -14 L28 -20 L30 14Z" fill="#8a7a9a" ${st(3)}/><circle cx="-8" cy="-2" r="5" fill="#ffd98a" ${st(2)}/><path d="M10 -2 h10 v8 h-10z" fill="#5a4a6a"/><path d="M-22 14 l-4 10 M26 14 l4 10 M-6 14 l-2 10 M10 14 l2 10" ${st(3)}/></g>`,
    muertos: `<g transform="translate(70 28)"><ellipse cx="0" cy="0" rx="22" ry="24" fill="#f4f0e6" ${st(3)}/><circle cx="-8" cy="-2" r="6" fill="#ff6fa8"/><circle cx="8" cy="-2" r="6" fill="#5ac8fa"/>
      <path d="M-3 9 l3 -5 3 5z" fill="${INK}"/><path d="M-8 16 h16" ${st(2)}/>${[-26, 26, -18, 18].map((x, i) => `<circle cx="${x}" cy="${i < 2 ? -10 : -24}" r="6" fill="#ff9a2b" ${st(2)}/>`).join('')}</g>`,
    kiss: `<g transform="translate(70 30)"><path d="M-20 -6 L-26 -36 L-6 -20Z M20 -6 L26 -36 L6 -20Z" fill="#fff" ${st(3)}/><path d="M-19 -12 L-22 -28 L-12 -19Z M19 -12 L22 -28 L12 -19Z" fill="#c7a6ff"/>
      <path d="M-24 -8 Q-22 -24 0 -24 Q22 -24 24 -8 Q20 12 0 22 Q-20 12 -24 -8Z" fill="#fff" ${st(3)}/><path d="M-15 -6 q5 -6 10 0 M5 -6 q5 -6 10 0" fill="none" stroke="#d6322b" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="12" r="3" fill="${INK}"/></g>`,
    golden: `<g transform="translate(70 34)"><path d="M0 0 Q-30 -26 -38 -6 Q-30 10 0 0 Q30 10 38 -6 Q30 -26 0 0Z" fill="#ff6fa8" ${st(3)}/><circle r="7" fill="#ff3d8a" ${st(3)}/></g>`
  };
  const BOXCOL = { hogwarts: ['#e8322e', '#c4262a'], shrine: ['#e8322e', '#c4262a'], dragon: ['#2f4a3a', '#24382c'], pandora: ['#2d6fa8', '#24578a'], slayer: ['#2a9a6e', '#1f7a56'], hero: ['#2d7a5a', '#1f5a42'], beasts: ['#8a5a33', '#6b4a33'], clover: ['#2a2a34', '#1a1a22'], muertos: ['#d6327a', '#b0255f'], castle: ['#3a5a8a', '#2a4470'], kiss: ['#9a6ad8', '#7a4cc0'], golden: ['#ffcf3a', '#e0a51a'] };
  function box(world, label) {
    const [a, b] = BOXCOL[world];
    return `<svg viewBox="0 -30 140 180" overflow="visible" aria-hidden="true">
      <path d="M16 52 L124 52 L114 140 L26 140 Z" fill="${a}" ${st()}/>
      ${world === 'slayer' ? '<path d="M28 64 h20 v20 h-20z M68 64 h20 v20 h-20z M48 84 h20 v20 h-20z M88 84 h20 v20 h-20z" fill="#1a1a24" opacity=".85"/>' : ''}
      ${world === 'dragon' ? '<path d="M30 70 q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0 M36 90 q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0" fill="none" stroke="#3f6a50" stroke-width="3"/>' : ''}
      ${smile}
      <text x="70" y="132" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="${label.length > 12 ? 7.5 : 10}" fill="${world === 'golden' ? INK : '#fff'}">${label}</text>
      <g class="lidL"><path d="M16 52 L40 30 L70 30 L70 52Z" fill="${b}" ${st(4)}/></g>
      <g class="lidR"><path d="M124 52 L100 30 L70 30 L70 52Z" fill="${b}" ${st(4)}/></g>
      <g class="topper">${handle}${TOPPER[world]}</g>
    </svg>`;
  }

  // the Sorting Hat
  const hat = `<svg viewBox="0 0 200 180" aria-hidden="true">
    <path d="M20 150 Q100 120 180 150 Q190 166 100 172 Q10 166 20 150Z" fill="#6b4a33" ${st()}/>
    <path d="M44 150 Q60 80 96 40 Q112 14 150 6 Q128 30 132 60 Q140 100 156 150 Q100 136 44 150Z" fill="#7d5a3e" ${st()}/>
    <path d="M70 92 q14 -8 26 0 M110 88 q14 -8 26 0" fill="none" stroke="#3d2a1e" stroke-width="5" stroke-linecap="round"/>
    <path id="hatMouth" d="M76 122 Q104 112 134 122 Q104 136 76 122Z" fill="#3d2a1e"/>
    <path d="M60 140 l6 -10 M140 136 l-4 -10 M96 50 l10 6" stroke="#4a3326" stroke-width="3"/></svg>`;
  // a woodsprite (Atokirina'): a floating glowing seed
  const sprite = `<svg viewBox="0 0 40 40" aria-hidden="true"><g stroke="#e6fffd" stroke-width="1.2" opacity=".9">
    <path d="M20 20 L20 2 M20 20 L33 7 M20 20 L38 20 M20 20 L33 33 M20 20 L7 33 M20 20 L2 20 M20 20 L7 7"/></g>
    <circle cx="20" cy="20" r="4.5" fill="#fff"/><circle cx="20" cy="20" r="9" fill="#a8fbff" opacity=".35"/></svg>`;

  window.ART = { INK, MOUTH, char, toy, box, hat, sprite, chars: Object.keys(C) };
})();
