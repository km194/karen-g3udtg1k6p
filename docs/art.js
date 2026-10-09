/* Character + prop art. Every character sits on the same 200x300 chibi grid with the
   same eyes, line weight and blush, so the cast reads as one set.
   Builders take a prefix `p` so ids stay unique: p-eyes, p-happy, p-blush, p-mouth,
   p-bag, plus extras (p-arm, p-wandtip, p-wing, p-glow, p-tears). */
(function () {
  const INK = '#2e2148';
  const st = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  const MOUTH = {
    grin:  { d: 'M82 148 Q100 170 118 148 Z', fill: '#c2413b' },
    open:  { d: 'M86 148 Q100 172 114 148 Q100 154 86 148 Z', fill: '#c2413b' },
    smile: { d: 'M88 152 Q100 163 112 152', fill: 'none' },
    flat:  { d: 'M92 156 L108 156', fill: 'none' },
    soft:  { d: 'M91 154 Q100 160 109 154', fill: 'none' },
    gummy: { d: 'M74 158 Q100 190 126 158 Q100 166 74 158 Z', fill: '#ff8fbd' },
    shut:  { d: 'M80 162 Q100 170 120 162', fill: 'none' }
  };

  const eye = (cx, cy, c, lt, rx = 11, ry = 14) => `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}" ${st(3)}/>
    <ellipse cx="${cx}" cy="${cy + ry * .38}" rx="${rx * .66}" ry="${ry * .42}" fill="${lt}"/>
    <ellipse cx="${cx}" cy="${cy - 1}" rx="${rx * .42}" ry="${ry * .5}" fill="${INK}" opacity=".8"/>
    <circle cx="${cx + rx * .35}" cy="${cy - ry * .42}" r="${rx * .38}" fill="#fff"/>
    <circle cx="${cx - rx * .38}" cy="${cy + ry * .45}" r="${rx * .17}" fill="#fff"/>
    <path d="M${cx - rx - 3} ${cy - ry + 5} Q${cx} ${cy - ry - 7} ${cx + rx + 3} ${cy - ry + 5}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;

  function features(p, o) {
    const lx = o.lx ?? 78, rx = o.rx ?? 122, y = o.y ?? 126, m = MOUTH[o.mouth || 'smile'];
    return `
      <g id="${p}-eyes">${eye(lx, y, o.c, o.lt, o.erx, o.ery)}${eye(rx, y, o.c, o.lt, o.erx, o.ery)}</g>
      <g id="${p}-happy" opacity="0"><path d="M${lx - 11} ${y + 3} Q${lx} ${y - 10} ${lx + 11} ${y + 3} M${rx - 11} ${y + 3} Q${rx} ${y - 10} ${rx + 11} ${y + 3}" fill="none" ${st(5)}/></g>
      <g id="${p}-blush" opacity="${o.blush ?? .55}"><ellipse cx="${lx - 18}" cy="${y + 21}" rx="10" ry="5.5" fill="#ff8fbd"/><ellipse cx="${rx + 18}" cy="${y + 21}" rx="10" ry="5.5" fill="#ff8fbd"/></g>
      ${o.brows || ''}
      <path id="${p}-mouth" d="${m.d}" fill="${m.fill}" ${st(3.5)}/>`;
  }
  const head = (skin, rx = 58, ry = 54, cy = 122) => `<ellipse cx="100" cy="${cy}" rx="${rx}" ry="${ry}" fill="${skin}" ${st(5)}/>`;
  const legs = (c, shoe) => `<path d="M70 250 h22 v30 h-22z M108 250 h22 v30 h-22z" fill="${c}" ${st(4)}/><path d="M66 280 h30 v10 h-30z M104 280 h30 v10 h-30z" fill="${shoe}" ${st(4)}/>`;
  const hand = (x, y, skin) => `<circle cx="${x}" cy="${y}" r="11" fill="${skin}" ${st(4)}/>`;
  const bagWrap = (p, x, y, k, inner) => `<g transform="translate(${x} ${y}) scale(${k})"><g id="${p}-bag">${inner}</g></g>`;
  const freckles = (y = 140, c = '#c97a4a') => `<g fill="${c}" opacity=".7"><circle cx="58" cy="${y}" r="2"/><circle cx="65" cy="${y + 4}" r="2"/><circle cx="56" cy="${y + 7}" r="2"/><circle cx="142" cy="${y}" r="2"/><circle cx="135" cy="${y + 4}" r="2"/><circle cx="144" cy="${y + 7}" r="2"/></g>`;

  const BAG = {
    pumpkin: () => `<path d="M-16 -22 Q0 -42 16 -22" fill="none" ${st(5)}/><ellipse cx="0" cy="0" rx="28" ry="24" fill="#ff9a52" ${st(5)}/>
      <path d="M-9 -22 Q-13 0 -9 22 M9 -22 Q13 0 9 22" fill="none" stroke="#e07a34" stroke-width="3"/>
      <path d="M-11 -4 l5 -6 5 6z M2 -4 l5 -6 5 6z" fill="${INK}"/><path d="M-11 8 Q0 15 11 8" fill="none" ${st(3.5)}/>`,
    paper: () => `<path d="M-21 -18 h42 l-4 42 h-34z" fill="#c99a63" ${st(5)}/><path d="M-21 -18 l5 -6 5 6 5 -6 5 6 5 -6 5 6 5 -6 5 6" fill="#d8ad78" ${st(3)}/>
      <rect x="-18" y="-4" width="36" height="12" fill="#ff8fbd"/><text x="0" y="5" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="5.6" fill="#fff">HONEYDUKES</text>`,
    beaded: () => `<path d="M-8 -16 L-12 -28 M8 -16 L12 -28" ${st(3)}/><path d="M-20 -14 Q-28 20 0 24 Q28 20 20 -14 Q0 -6 -20 -14Z" fill="#6a3db0" ${st(5)}/>
      <g fill="#ffd25e"><circle cx="-10" cy="-2" r="2"/><circle cx="0" cy="2" r="2"/><circle cx="10" cy="-2" r="2"/><circle cx="-6" cy="10" r="2"/><circle cx="6" cy="10" r="2"/><circle cx="-14" cy="8" r="1.6"/><circle cx="14" cy="8" r="1.6"/></g>`,
    plastic: () => `<path d="M-16 -16 Q-16 -34 -6 -30 Q-2 -26 -6 -16 M16 -16 Q16 -34 6 -30 Q2 -26 6 -16" fill="none" ${st(3.5)}/>
      <path d="M-22 -16 L22 -16 L18 24 L-18 24Z" fill="#f4f6ff" ${st(5)}/>
      <text x="0" y="2" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="7" fill="#e8322e">THANK</text>
      <text x="0" y="11" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="7" fill="#e8322e">YOU</text>
      <path d="M-5 15 Q0 19 5 15" fill="none" stroke="#e8322e" stroke-width="1.8" stroke-linecap="round"/>`,
    sack: () => `<path d="M-22 -16 Q-32 24 0 27 Q32 24 22 -16 Q0 -24 -22 -16Z" fill="#b98a55" ${st(5)}/>
      <path d="M-14 -18 Q0 -10 14 -18" fill="none" stroke="#7a5a33" stroke-width="3"/><path d="M-12 4 l8 -6 8 6 8 -6" fill="none" stroke="#7a5a33" stroke-width="2.5"/>`,
    pail: () => `<path d="M-16 -18 Q0 -36 16 -18" fill="none" ${st(4)}/><path d="M-22 -16 h44 l-5 38 h-34z" fill="#9a6a3e" ${st(5)}/>
      <path d="M-21 -6 h42 M-19 10 h38" stroke="#6f7a8a" stroke-width="4"/>
      <path d="M8 -16 q6 -14 16 -10 q-6 2 -6 8 q8 -4 10 2 q-10 2 -14 4z" fill="#7fb8d8" ${st(2.5)}/>`,
    navi: (c1 = '#e8823e', c2 = '#4fc3c8') => `<path d="M-18 -14 Q0 -40 18 -14" fill="none" ${st(4)}/><path d="M-24 -14 h48 l-6 36 h-36z" fill="#c99a63" ${st(5)}/>
      <path d="M-22 -2 l7 6 7 -6 7 6 7 -6 7 6 7 -6" fill="none" stroke="${c1}" stroke-width="3.5"/><path d="M-20 12 h40" stroke="${c2}" stroke-width="4"/>`
  };

  /* ---------------- the cast ---------------- */
  const C = {};
  const robe = `<path d="M56 170 Q100 158 144 170 L160 256 Q100 268 40 256Z" fill="#1f1f2b" ${st()}/>`;
  const scarf = (p) => `<path d="M66 166 Q100 182 134 166 L132 182 Q100 198 68 182Z" fill="#a8232e" ${st(4)}/>
    <path d="M78 172 v14 M92 176 v16 M108 176 v16 M122 172 v14" stroke="#e8c25a" stroke-width="4"/>
    <path d="M116 180 h16 v44 h-16z" fill="#a8232e" ${st(4)}/><path d="M116 192 h16 M116 206 h16" stroke="#e8c25a" stroke-width="4"/>`;

  C.harry = (p) => `
    ${legs('#2b2b38', '#1a1a24')}
    ${robe}<path d="M84 170 L100 206 L116 170Z" fill="#f1f1f1"/>${scarf(p)}
    <g id="${p}-arm"><path d="M62 184 Q38 166 38 136" fill="none" stroke="#1f1f2b" stroke-width="16" stroke-linecap="round"/>
      <path d="M38 132 L20 90" stroke="#6b4a2e" stroke-width="5" stroke-linecap="round"/>
      <circle id="${p}-wandtip" cx="20" cy="88" r="7" fill="#fff7c2" opacity=".25"/>${hand(38, 132, '#ffe2c8')}</g>
    <path d="M42 116 Q30 50 100 42 Q170 50 158 116 L170 98 L162 132 Z" fill="#1d1b26" ${st()}/>
    ${head('#ffe2c8')}
    <path d="M44 104 Q46 62 100 56 Q154 62 156 104 L150 88 L144 110 L132 82 L122 106 L112 80 L102 104 L92 80 L82 106 L72 84 L62 108 L54 88Z" fill="#1d1b26" ${st(4)}/>
    <path d="M118 84 l-6 9 6 2 -6 10" fill="none" stroke="#e8463c" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${features(p, { c: '#3aa55a', lt: '#8fe0a0', mouth: 'smile', blush: .45 })}
    <circle cx="78" cy="126" r="17" fill="none" ${st(4)}/><circle cx="122" cy="126" r="17" fill="none" ${st(4)}/><path d="M95 124 Q100 119 105 124 M61 122 L46 116 M139 122 L154 116" fill="none" ${st(4)}/>
    ${bagWrap(p, 148, 240, 2, BAG.paper())}
    ${hand(146, 212, '#ffe2c8')}`;

  C.hermione = (p) => `
    ${legs('#5a5a6e', '#1a1a24')}
    <path d="M30 132 Q12 92 36 64 Q40 28 80 28 Q100 14 122 28 Q164 28 166 66 Q190 94 172 134 Q186 172 158 192 L148 150 L52 150 L42 192 Q14 172 30 132Z" fill="#8a5a3a" ${st()}/>
    ${robe}<path d="M84 170 L100 206 L116 170Z" fill="#f1f1f1"/>${scarf(p)}
    ${head('#ffe8d6')}
    <path d="M46 110 Q48 64 100 58 Q152 64 154 110 Q140 84 118 82 Q100 94 82 82 Q60 84 46 110Z" fill="#8a5a3a" ${st(4)}/>
    ${features(p, { c: '#8a5a3a', lt: '#d6a878', mouth: 'smile', blush: .55 })}
    ${bagWrap(p, 56, 242, 2, BAG.beaded())}
    ${hand(58, 214, '#ffe8d6')}`;

  C.ron = (p) => `
    ${legs('#5a5a6e', '#1a1a24')}
    ${robe}<path d="M78 170 L122 170 L128 252 L72 252Z" fill="#7a2335" ${st(3)}/>
    <text x="100" y="230" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="30" fill="#e8c25a">R</text>
    <path d="M40 116 Q32 48 100 42 Q168 48 160 116Z" fill="#e8762e" ${st()}/>
    ${head('#ffe6d2')}
    <path d="M44 104 Q50 60 100 54 Q150 60 156 104 L148 90 L136 102 L124 86 L112 100 L100 84 L88 100 L76 86 L64 102 L52 90Z" fill="#e8762e" ${st(4)}/>
    ${freckles(140)}
    ${features(p, { c: '#3e9cff', lt: '#9fd0ff', mouth: 'open', blush: .5 })}
    ${bagWrap(p, 148, 240, 2, BAG.pumpkin())}
    ${hand(146, 212, '#ffe6d2')}`;

  C.yato = (p) => `
    ${legs('#2a2d44', '#f1f1f1')}
    <path d="M62 170 Q100 158 138 170 L148 252 Q100 264 52 252Z" fill="#2a2d44" ${st()}/>
    <path d="M56 190 L52 250 M144 190 L148 250" stroke="#fff" stroke-width="3"/><path d="M100 178 V252" stroke="#c9cbe0" stroke-width="3"/>
    <path d="M40 120 Q28 48 100 40 Q172 48 160 120 L172 104 L164 142 L150 122Z" fill="#1f2236" ${st()}/>
    ${head('#ffe2c8')}
    <path d="M44 104 Q50 60 100 54 Q150 60 156 104 L148 88 L142 112 L130 84 L122 110 L110 82 L100 108 L90 82 L80 110 L70 84 L60 112 L52 90Z" fill="#1f2236" ${st(4)}/>
    ${features(p, { c: '#3e9cff', lt: '#9fd0ff', mouth: 'grin', blush: .4 })}
    <g id="${p}-tears" opacity="0"><path d="M64 142 Q57 158 64 166 Q71 158 64 142Z M136 142 Q129 158 136 166 Q143 158 136 142Z" fill="#8fd3ff" ${st(2)}/></g>
    <path d="M64 164 Q100 184 136 164 L134 182 Q100 198 66 182Z" fill="#fff" ${st(4)}/>
    <path d="M122 180 Q152 196 172 184 Q156 210 126 198Z" fill="#fff" ${st(4)}/>
    <g id="${p}-coin" opacity="0"><circle cx="40" cy="200" r="13" fill="#f0c04a" ${st(3)}/><circle cx="40" cy="200" r="4" fill="#fff6ea" ${st(2)}/></g>
    ${bagWrap(p, 150, 240, 2, BAG.plastic())}
    ${hand(148, 212, '#ffe2c8')}`;

  C.hiccup = (p) => `
    <path d="M70 250 h22 v30 h-22z" fill="#6b4a33" ${st(4)}/><path d="M66 280 h30 v10 h-30z" fill="#4a3326" ${st(4)}/>
    <path d="M108 250 h22 v14 h-22z" fill="#6b4a33" ${st(4)}/><path d="M114 264 h10 v16 h-10z M108 280 h22 v10 h-22z" fill="#9aa3b4" ${st(4)}/>
    <path d="M62 170 Q100 158 138 170 L148 252 Q100 264 52 252Z" fill="#4f7a4a" ${st()}/>
    <path d="M58 172 Q100 160 142 172 L136 232 L118 236 L112 180 L88 180 L82 236 L64 232Z" fill="#7a5a3e" ${st(4)}/>
    <path d="M58 172 Q100 160 142 172 L140 182 Q100 172 60 182Z" fill="#efe2c8" ${st(3)}/>
    <rect x="54" y="226" width="92" height="9" rx="3" fill="#4a3326"/>
    <path d="M42 114 Q34 52 100 44 Q166 52 158 114 L168 100 L162 128Z" fill="#8a4e2c" ${st()}/>
    ${head('#ffe2c8')}
    <path d="M44 104 Q52 58 104 54 Q150 60 156 100 L140 86 L126 100 L112 80 L98 98 L84 80 L70 98 L58 84Z" fill="#8a4e2c" ${st(4)}/>
    ${freckles(140, '#c98a5a')}
    ${features(p, { c: '#3aa55a', lt: '#8fe0a0', mouth: 'smile', blush: .45 })}
    ${bagWrap(p, 148, 240, 2, BAG.sack())}
    ${hand(146, 212, '#ffe2c8')}`;

  C.toothless = (p) => `
    <path d="M140 262 Q196 262 192 214 Q190 196 176 196" fill="none" stroke="#22232e" stroke-width="15" stroke-linecap="round"/>
    <path d="M176 196 l-16 -14 l6 18z" fill="#22232e" ${st(3)}/><path d="M176 196 l18 -14 l-6 18z" fill="#d6322b" ${st(3)}/>
    <g id="${p}-wing"><path d="M54 202 Q10 176 16 124 Q36 158 66 170Z" fill="#1d1e28" ${st(4)}/><path d="M146 202 Q190 176 184 124 Q164 158 134 170Z" fill="#1d1e28" ${st(4)}/></g>
    <ellipse cx="100" cy="222" rx="58" ry="54" fill="#2a2b38" ${st()}/>
    <path d="M66 248 q-4 30 8 36 h16 q6 -16 2 -36z M134 248 q4 30 -8 36 h-16 q-6 -16 -2 -36z" fill="#2a2b38" ${st(4)}/>
    <path d="M72 284 v-6 M80 284 v-6 M120 284 v-6 M128 284 v-6" stroke="#4a4b5a" stroke-width="3" stroke-linecap="round"/>
    <path d="M56 92 Q24 66 26 40 Q52 58 74 84Z M144 92 Q176 66 174 40 Q148 58 126 84Z" fill="#2a2b38" ${st(4)}/>
    <path d="M72 80 Q58 54 66 40 Q80 58 86 76Z M128 80 Q142 54 134 40 Q120 58 114 76Z" fill="#2a2b38" ${st(4)}/>
    <ellipse cx="100" cy="122" rx="66" ry="54" fill="#2a2b38" ${st()}/>
    <ellipse cx="100" cy="150" rx="40" ry="22" fill="#33344a"/>
    <circle cx="90" cy="142" r="2.2" fill="#14141c"/><circle cx="110" cy="142" r="2.2" fill="#14141c"/>
    <g id="${p}-eyes">
      <ellipse cx="72" cy="118" rx="17" ry="19" fill="#b8e04a" ${st(3)}/><ellipse cx="72" cy="120" rx="5" ry="13" fill="#14141c"/><circle cx="78" cy="110" r="5" fill="#fff"/>
      <ellipse cx="128" cy="118" rx="17" ry="19" fill="#b8e04a" ${st(3)}/><ellipse cx="128" cy="120" rx="5" ry="13" fill="#14141c"/><circle cx="134" cy="110" r="5" fill="#fff"/>
    </g>
    <g id="${p}-happy" opacity="0"><path d="M58 122 Q72 106 86 122 M114 122 Q128 106 142 122" fill="none" stroke="#b8e04a" stroke-width="6" stroke-linecap="round"/></g>
    <g id="${p}-blush" opacity=".25"><ellipse cx="54" cy="144" rx="10" ry="5" fill="#ff8fbd"/><ellipse cx="146" cy="144" rx="10" ry="5" fill="#ff8fbd"/></g>
    <path id="${p}-mouth" d="${MOUTH.shut.d}" fill="none" stroke="#14141c" stroke-width="3.5" stroke-linecap="round"/>
    ${bagWrap(p, 150, 238, 1.9, BAG.pail())}`;

  // Na'vi (Avatar): blue skin, tiger stripes, big gold eyes, glow freckles
  function navi(p, o) {
    const skin = '#5b98e0', dark = '#3d73bd';
    const hair = o.hair === 'long'
      ? `<path d="M40 120 Q30 50 100 42 Q170 50 160 120 L170 230 Q160 246 150 230 L148 150 L52 150 L50 236 Q40 250 30 236Z" fill="#1a1726" ${st()}/>`
      : o.hair === 'kid'
        ? `<path d="M42 118 Q34 52 100 46 Q166 52 158 118Z" fill="#1a1726" ${st()}/><path d="M44 100 q-24 24 -14 56 M156 100 q24 24 14 56" fill="none" stroke="#1a1726" stroke-width="12" stroke-linecap="round"/>`
        : `<path d="M42 118 Q34 50 100 44 Q166 50 158 118 Q178 150 168 196" fill="#1a1726" ${st()}/><path d="M158 120 Q182 160 170 206" fill="none" stroke="#1a1726" stroke-width="10" stroke-linecap="round"/>`;
    const top = o.female ? `<path d="M66 176 Q100 196 134 176 L132 196 Q100 212 68 196Z" fill="#b8562e" ${st(3)}/><g fill="#e8c25a"><circle cx="78" cy="196" r="3"/><circle cx="92" cy="202" r="3"/><circle cx="108" cy="202" r="3"/><circle cx="122" cy="196" r="3"/></g>`
      : `<path d="M74 176 Q100 196 126 176" fill="none" stroke="#e8c25a" stroke-width="4"/><g fill="#4fc3c8"><circle cx="84" cy="186" r="3"/><circle cx="100" cy="190" r="3.4"/><circle cx="116" cy="186" r="3"/></g>`;
    return `
      <path d="M150 248 Q190 250 186 206" fill="none" stroke="${skin}" stroke-width="9" stroke-linecap="round"/>
      ${hair}
      <path d="M70 250 h22 v30 h-22z M108 250 h22 v30 h-22z" fill="${skin}" ${st(4)}/>
      <path d="M62 170 Q100 158 138 170 L146 244 Q100 254 54 244Z" fill="${skin}" ${st()}/>
      <path d="M64 196 q10 6 4 16 M136 196 q-10 6 -4 16 M90 220 q10 6 20 0" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>
      <path d="M54 236 Q100 248 146 236 L150 262 Q100 272 50 262Z" fill="#8a5a3a" ${st(4)}/>
      ${top}
      <path d="M48 118 Q16 102 24 78 Q38 100 56 110Z M152 118 Q184 102 176 78 Q162 100 144 110Z" fill="${skin}" ${st(4)}/>
      ${head(skin)}
      <path d="M100 74 v14 M78 80 q4 8 0 14 M122 80 q-4 8 0 14 M54 130 q8 -2 12 4 M146 130 q-8 -2 -12 4" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>
      <path d="M46 104 Q52 62 100 58 Q148 62 154 104 Q130 82 100 80 Q70 82 46 104Z" fill="#1a1726" ${st(4)}/>
      ${o.female ? `<path d="M50 96 Q100 74 150 96" fill="none" stroke="#d6322b" stroke-width="5"/><g fill="#4fc3c8"><circle cx="66" cy="90" r="3"/><circle cx="100" cy="82" r="3"/><circle cx="134" cy="90" r="3"/></g>` : ''}
      <path d="M96 132 Q100 142 104 132" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>
      ${features(p, { c: '#f2c94c', lt: '#fff0a8', mouth: o.mouth || 'smile', blush: .35 })}
      <g id="${p}-glow" opacity=".18" fill="#a8fbff">
        <circle cx="62" cy="108" r="2.6"/><circle cx="70" cy="102" r="2.2"/><circle cx="138" cy="108" r="2.6"/><circle cx="130" cy="102" r="2.2"/>
        <circle cx="56" cy="150" r="2.4"/><circle cx="144" cy="150" r="2.4"/><circle cx="100" cy="98" r="2"/>
        <circle cx="70" cy="214" r="2.6"/><circle cx="130" cy="214" r="2.6"/><circle cx="80" cy="228" r="2.2"/><circle cx="120" cy="228" r="2.2"/>
      </g>
      ${bagWrap(p, o.bagLeft ? 54 : 148, 238, 2, BAG.navi(o.c1, o.c2))}
      ${hand(o.bagLeft ? 56 : 146, 210, skin)}`;
  }
  C.jake = (p) => navi(p, { hair: 'short', mouth: 'smile', c1: '#4fc3c8', c2: '#e8823e' });
  C.neytiri = (p) => navi(p, { hair: 'long', female: true, mouth: 'soft', bagLeft: true });
  C.kiri = (p) => navi(p, { hair: 'long', female: true, mouth: 'soft', c1: '#a86ee0', c2: '#9ff7a8' });
  C.tuk = (p) => navi(p, { hair: 'kid', mouth: 'grin', bagLeft: true, c1: '#ff8fbd', c2: '#ffd25e' });

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
    golden: `<g transform="translate(70 34)"><path d="M0 0 Q-30 -26 -38 -6 Q-30 10 0 0 Q30 10 38 -6 Q30 -26 0 0Z" fill="#ff6fa8" ${st(3)}/><circle r="7" fill="#ff3d8a" ${st(3)}/></g>`
  };
  const BOXCOL = { hogwarts: ['#e8322e', '#c4262a'], shrine: ['#e8322e', '#c4262a'], dragon: ['#2f4a3a', '#24382c'], pandora: ['#2d6fa8', '#24578a'], golden: ['#ffcf3a', '#e0a51a'] };
  function box(world, label) {
    const [a, b] = BOXCOL[world];
    return `<svg viewBox="0 -30 140 180" overflow="visible" aria-hidden="true">
      <path d="M16 52 L124 52 L114 140 L26 140 Z" fill="${a}" ${st()}/>
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
