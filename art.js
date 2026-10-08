/* Character art. Every character is drawn on the same 200x300 chibi grid with the
   same eyes, line weight and blush, so the whole cast reads as one set.
   Each builder takes a prefix `p` so ids stay unique: p-eyes, p-happy, p-blush,
   p-mouth, p-bag (+ extras like p-arm, p-fire, p-tears). */
(function () {
  const INK = '#2e2148';
  const st = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  const MOUTH = {
    grin:  { d: 'M82 148 Q100 170 118 148 Z', fill: '#c2413b' },
    open:  { d: 'M86 148 Q100 172 114 148 Q100 154 86 148 Z', fill: '#c2413b' },
    smile: { d: 'M88 152 Q100 163 112 152', fill: 'none' },
    flat:  { d: 'M92 156 L108 156', fill: 'none' },
    smirk: { d: 'M90 155 Q102 161 113 150', fill: 'none' },
    tiny:  { d: 'M95 160 Q100 165 105 160', fill: 'none' }
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
  const plate = `<rect x="76" y="76" width="48" height="22" rx="4" fill="#d5dde8" ${st(3.5)}/><path d="M96 87 a5 5 0 1 1 5 5 a8 8 0 1 1 -8 -8 M104 82 l7 -5" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`;
  const bagWrap = (p, x, y, k, inner) => `<g transform="translate(${x} ${y}) scale(${k})"><g id="${p}-bag">${inner}</g></g>`;

  const BAG = {
    pumpkin: () => `<path d="M-16 -22 Q0 -42 16 -22" fill="none" ${st(5)}/><ellipse cx="0" cy="0" rx="28" ry="24" fill="#ff9a52" ${st(5)}/>
      <path d="M-9 -22 Q-13 0 -9 22 M9 -22 Q13 0 9 22" fill="none" stroke="#e07a34" stroke-width="3"/>
      <path d="M-11 -4 l5 -6 5 6z M2 -4 l5 -6 5 6z" fill="${INK}"/><path d="M-11 8 Q0 15 11 8" fill="none" ${st(3.5)}/>`,
    ghostBucket: (c) => `<path d="M-14 -20 Q0 -38 14 -20" fill="none" ${st(5)}/><path d="M-24 -18 h48 l-4 40 h-40z" fill="${c}" ${st(5)}/>
      <path d="M-10 -2 Q-10 -12 0 -12 Q10 -12 10 -2 V10 l-4 -3 -3 3 -3 -3 -3 3 -3 -3 -4 3z" fill="#fff"/>
      <circle cx="-4" cy="-4" r="1.6" fill="${INK}"/><circle cx="4" cy="-4" r="1.6" fill="${INK}"/>`,
    pouch: (c) => `<path d="M-8 -16 L-16 -32 M8 -16 L16 -32" ${st(3.5)}/><path d="M-20 -14 Q-28 22 0 25 Q28 22 20 -14 Q0 -6 -20 -14Z" fill="${c}" ${st(5)}/>
      <path d="M-20 -14 Q0 -22 20 -14" fill="none" ${st(4)}/><circle cx="-8" cy="6" r="3" fill="#ffd3e4"/><circle cx="7" cy="12" r="3" fill="#ffd3e4"/><circle cx="4" cy="-2" r="2.5" fill="#ffd3e4"/>`,
    sack: () => `<path d="M-22 -16 Q-32 24 0 27 Q32 24 22 -16 Q0 -24 -22 -16Z" fill="#d1aa72" ${st(5)}/>
      <path d="M-14 -18 Q0 -10 14 -18" fill="none" stroke="#8a6a3a" stroke-width="3"/><rect x="-6" y="2" width="14" height="12" rx="2" fill="#b8915a" stroke="#8a6a3a" stroke-width="2" stroke-dasharray="3 2"/>`,
    plastic: () => `<path d="M-16 -16 Q-16 -34 -6 -30 Q-2 -26 -6 -16 M16 -16 Q16 -34 6 -30 Q2 -26 6 -16" fill="none" ${st(3.5)}/>
      <path d="M-22 -16 L22 -16 L18 24 L-18 24Z" fill="#f4f6ff" ${st(5)}/>
      <text x="0" y="2" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="7" fill="#e8322e">THANK</text>
      <text x="0" y="11" text-anchor="middle" font-family="Mochiy Pop One, sans-serif" font-size="7" fill="#e8322e">YOU</text>
      <path d="M-5 15 Q0 19 5 15" fill="none" stroke="#e8322e" stroke-width="1.8" stroke-linecap="round"/>`,
    basket: () => `<path d="M-20 -10 Q0 -44 20 -10" fill="none" ${st(4.5)}/><path d="M-24 -12 h48 l-6 34 h-36z" fill="#ffb3d1" ${st(5)}/>
      <path d="M-22 0 h44 M-20 10 h40" stroke="#ff8fbd" stroke-width="3"/><circle cx="16" cy="-12" r="5" fill="#fff" ${st(2)}/><circle cx="16" cy="-12" r="2" fill="#ffd25e"/>`,
    bat: () => `<path d="M-22 -12 Q-44 -26 -40 -4 Q-34 -12 -28 -4 Q-24 -12 -20 -2Z M22 -12 Q44 -26 40 -4 Q34 -12 28 -4 Q24 -12 20 -2Z" fill="#7d4cc0" ${st(3)}/>
      <path d="M-20 -16 h40 l-4 38 h-32z" fill="#9b6be0" ${st(5)}/><circle cx="-6" cy="0" r="2.4" fill="${INK}"/><circle cx="6" cy="0" r="2.4" fill="${INK}"/>
      <path d="M-5 8 l2 4 3 -4 3 4 2 -4" fill="none" ${st(2)}/>`
  };

  /* ---------------- the cast ---------------- */
  const C = {};

  C.naruto = (p) => `
    <g id="${p}-arm"><path d="M60 182 Q30 160 34 128" fill="none" stroke="#ff8a2b" stroke-width="16" stroke-linecap="round"/>${hand(34, 124, '#ffd9b8')}</g>
    ${legs('#ff8a2b', '#2c4a8a')}
    <path d="M62 170 Q100 158 138 170 L148 252 Q100 264 52 252 Z" fill="#ff8a2b" ${st()}/>
    <path d="M62 170 Q100 158 138 170 L134 190 Q100 180 66 190 Z" fill="#2b2b3a"/>
    <path d="M100 172 V250" stroke="#fff" stroke-width="3"/>
    <path d="M150 96 Q178 104 186 126 M150 102 Q172 118 172 140" fill="none" stroke="#2c4a8a" stroke-width="7" stroke-linecap="round"/>
    <path d="M40 104 L18 74 L46 78 L32 40 L66 56 L68 18 L94 46 L110 10 L124 46 L152 20 L152 56 L184 44 L166 80 L188 96 L156 104 Z" fill="#ffcd2e" ${st()}/>
    ${head('#ffd9b8')}
    <path d="M44 100 L54 80 L64 102 L78 78 L88 100 L100 76 L112 100 L122 78 L136 102 L146 80 L156 100 L158 72 Q100 40 42 72 Z" fill="#ffcd2e" ${st(4)}/>
    <path d="M42 84 Q100 72 158 84 L158 98 Q100 88 42 98 Z" fill="#2c4a8a" ${st(4)}/>${plate}
    ${features(p, { c: '#2e7be0', lt: '#6fb2ff', mouth: 'grin' })}
    <path d="M50 136 l13 2 M50 143 l13 0 M51 150 l12 -2 M150 136 l-13 2 M150 143 l-13 0 M149 150 l-12 -2" ${st(3)}/>
    ${bagWrap(p, 138, 238, 2.1, BAG.pumpkin())}
    ${hand(140, 210, '#ffd9b8')}`;

  C.sasuke = (p) => `
    ${legs('#f1f1f1', '#2c4a8a')}
    <path d="M62 172 Q100 160 138 172 L146 252 Q100 262 54 252 Z" fill="#2f3d73" ${st()}/>
    <path d="M70 164 Q100 176 130 164 L130 182 Q100 192 70 182 Z" fill="#2f3d73" ${st(4)}/>
    <path d="M40 116 Q30 44 100 38 L132 8 L136 40 L172 26 L160 60 L192 70 L162 92 L180 116 Z" fill="#2a3050" ${st()}/>
    ${head('#ffe2c8', 56, 54, 124)}
    <path d="M46 86 Q38 134 50 166 L62 124 L60 94 Z M154 86 Q162 134 150 166 L138 124 L140 94 Z" fill="#2a3050" ${st(4)}/>
    <path d="M48 88 Q100 52 152 88 L142 106 L130 90 L118 108 L104 90 L92 108 L80 90 L66 106 Z" fill="#2a3050" ${st(4)}/>
    <path d="M44 84 Q100 72 156 84 L156 98 Q100 88 44 98 Z" fill="#2c4a8a" ${st(4)}/>${plate}
    ${features(p, { c: '#3a3350', lt: '#6e6596', erx: 9.5, ery: 12, y: 130, mouth: 'flat', blush: 0,
      brows: `<path d="M66 110 l20 6 M134 110 l-20 6" ${st(4)}/>` })}
    ${bagWrap(p, 60, 240, 2, BAG.ghostBucket('#7d4cc0'))}
    ${hand(60, 212, '#ffe2c8')}`;

  C.tomoe = (p) => `
    <path d="M146 236 Q198 214 190 156 Q184 196 150 206 Z" fill="#f6f4ff" ${st(4)}/>
    <path d="M42 110 Q26 190 46 258 L70 238 L86 262 L104 240 L120 262 L136 238 L156 258 Q176 190 158 110 Q150 46 100 44 Q50 46 42 110Z" fill="#e9ecff" ${st()}/>
    <path d="M52 80 L58 12 L94 58Z" fill="#e9ecff" ${st()}/><path d="M61 64 L63 30 L81 54Z" fill="#ffb3d1"/>
    <path d="M148 80 L142 12 L106 58Z" fill="#e9ecff" ${st()}/><path d="M139 64 L137 30 L119 54Z" fill="#ffb3d1"/>
    <path d="M70 276 h26 v9 h-26z M104 276 h26 v9 h-26z" fill="#7a4a3a" ${st(3.5)}/>
    <path d="M58 172 Q28 190 32 238 L64 232Z" fill="#f6f4ff" ${st(4)}/><path d="M142 172 Q172 190 168 238 L136 232Z" fill="#f6f4ff" ${st(4)}/>
    <path d="M58 168 Q100 156 142 168 L148 222 L52 222Z" fill="#f6f4ff" ${st()}/>
    <path d="M52 216 L148 216 L156 280 L104 280 L100 252 L96 280 L44 280Z" fill="#6f4bb8" ${st()}/>
    <path d="M86 166 L100 196 L114 166" fill="none" stroke="#6f4bb8" stroke-width="5"/>
    <rect x="54" y="208" width="92" height="12" rx="3" fill="#ff8fbd" ${st(3)}/>
    ${head('#ffeadb')}
    <path d="M46 100 Q40 150 52 178 L62 128Z M154 100 Q160 150 148 178 L138 128Z" fill="#e9ecff" ${st(4)}/>
    <path d="M44 106 Q46 62 100 56 Q154 62 156 106 L146 92 L142 114 L130 88 L120 110 L108 86 L98 110 L88 86 L76 112 L66 90 L56 110Z" fill="#e9ecff" ${st(4)}/>
    ${features(p, { c: '#8f63d8', lt: '#c4a6ff', erx: 10, ery: 12.5, mouth: 'smirk', blush: 0 })}
    <path d="M60 144 l11 3 M140 144 l-11 3" stroke="#ff6f9f" stroke-width="3" stroke-linecap="round"/>
    <g id="${p}-fire">
      <path d="M22 200 Q10 178 26 160 Q24 178 38 184 Q42 200 22 200Z" fill="#8fd3ff" opacity=".92"/><path d="M24 196 Q19 186 26 178 Q27 188 32 190Z" fill="#e6f7ff"/>
      <path d="M180 176 Q168 154 184 136 Q182 154 196 160 Q200 176 180 176Z" fill="#b59cff" opacity=".92"/><path d="M182 172 Q177 162 184 154 Q185 164 190 166Z" fill="#f0e8ff"/>
    </g>
    ${bagWrap(p, 146, 244, 2, BAG.pouch('#8f63d8'))}
    ${hand(146, 214, '#ffeadb')}`;

  C.asta = (p) => `
    <g transform="rotate(-24 100 160)">
      <rect x="90" y="-34" width="32" height="232" rx="4" fill="#2b2b38" ${st()}/><path d="M106 -30 V194" stroke="#4a4a62" stroke-width="5"/>
      <rect x="66" y="196" width="80" height="15" rx="5" fill="#3d3d50" ${st(4)}/><rect x="98" y="211" width="16" height="40" rx="5" fill="#6b5240" ${st(4)}/>
    </g>
    <g id="${p}-arm"><path d="M62 182 Q34 168 36 132" fill="none" stroke="#2d2d3c" stroke-width="16" stroke-linecap="round"/>${hand(36, 126, '#f5d2b0')}</g>
    <path d="M52 172 Q100 150 148 172 L166 248 Q100 238 34 248Z" fill="#1d1d28" ${st()}/>
    ${legs('#4a4a5c', '#2b2b38')}
    <path d="M68 172 Q100 162 132 172 L140 250 Q100 260 60 250Z" fill="#3a3a4c" ${st()}/>
    <circle cx="100" cy="178" r="8" fill="#ffd25e" ${st(3)}/>
    <path d="M42 112 L20 92 L44 86 L28 52 L58 64 L56 22 L84 48 L98 6 L114 46 L136 16 L140 54 L172 40 L158 76 L186 84 L160 106Z" fill="#ede6c8" ${st()}/>
    ${head('#f5d2b0')}
    <path d="M44 100 L52 76 L62 98 L74 72 L86 96 L98 70 L110 96 L124 72 L136 96 L148 76 L156 100 L158 74 Q100 46 42 74Z" fill="#ede6c8" ${st(4)}/>
    <path d="M42 86 Q100 74 158 86 L158 100 Q100 90 42 100Z" fill="#1d1d26" ${st(4)}/>
    <path d="M44 92 Q22 96 14 116 M44 96 Q28 110 30 128" fill="none" stroke="#1d1d26" stroke-width="7" stroke-linecap="round"/>
    ${features(p, { c: '#3aa55a', lt: '#8fe0a0', mouth: 'open', blush: .45,
      brows: `<path d="M64 106 l22 8 M136 106 l-22 8" ${st(5)}/>` })}
    ${bagWrap(p, 146, 240, 2.1, BAG.sack())}
    ${hand(144, 212, '#f5d2b0')}`;

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
    ${bagWrap(p, 150, 240, 2, BAG.plastic())}
    ${hand(148, 212, '#ffe2c8')}`;

  // Sanrio friends: big round heads, tiny bodies
  const nub = (x, y, c) => `<ellipse cx="${x}" cy="${y}" rx="15" ry="11" fill="${c}" ${st(4)}/>`;
  const smallEyes = (p, y = 132, l = 66, r = 134) => `
    <g id="${p}-eyes"><ellipse cx="${l}" cy="${y}" rx="6.5" ry="9" fill="${INK}"/><ellipse cx="${r}" cy="${y}" rx="6.5" ry="9" fill="${INK}"/>
      <circle cx="${l + 2}" cy="${y - 3}" r="2" fill="#fff"/><circle cx="${r + 2}" cy="${y - 3}" r="2" fill="#fff"/></g>
    <g id="${p}-happy" opacity="0"><path d="M${l - 8} ${y + 2} Q${l} ${y - 8} ${l + 8} ${y + 2} M${r - 8} ${y + 2} Q${r} ${y - 8} ${r + 8} ${y + 2}" fill="none" ${st(4.5)}/></g>`;

  C.kitty = (p) => `
    ${nub(80, 284, '#fff')}${nub(120, 284, '#fff')}
    <path d="M64 196 Q100 186 136 196 L152 278 Q100 290 48 278Z" fill="#7d4cc0" ${st()}/>
    <path d="M70 196 Q100 214 130 196 L126 210 Q100 224 74 210Z" fill="#ff8fbd" ${st(3)}/>
    ${nub(54, 230, '#fff')}${nub(148, 226, '#fff')}
    <path d="M38 98 L42 46 L82 72Z M162 98 L158 46 L118 72Z" fill="#fff" ${st()}/>
    <ellipse cx="100" cy="128" rx="82" ry="62" fill="#fff" ${st()}/>
    <g transform="rotate(-14 70 70)"><ellipse cx="66" cy="76" rx="48" ry="9" fill="#5a3394" ${st(4)}/>
      <path d="M38 74 Q60 12 92 4 Q82 32 96 74Z" fill="#6a3db0" ${st(4)}/>
      <path d="M64 42 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1z" fill="#ffd25e"/></g>
    <g transform="translate(150 80) rotate(15)"><ellipse cx="-17" cy="0" rx="18" ry="14" fill="#ff3b5c" ${st(4)}/><ellipse cx="17" cy="0" rx="18" ry="14" fill="#ff3b5c" ${st(4)}/><circle r="8" fill="#ff1f48" ${st(4)}/></g>
    ${smallEyes(p)}
    <ellipse cx="100" cy="148" rx="8" ry="5.5" fill="#ffd25e" ${st(3)}/>
    <path d="M14 132 l26 4 M12 146 l28 0 M14 160 l26 -4 M186 132 l-26 4 M188 146 l-28 0 M186 160 l-26 -4" ${st(3)}/>
    <g id="${p}-blush" opacity=".5"><ellipse cx="46" cy="156" rx="11" ry="6" fill="#ff8fbd"/><ellipse cx="154" cy="156" rx="11" ry="6" fill="#ff8fbd"/></g>
    ${bagWrap(p, 150, 252, 1.8, BAG.pumpkin())}`;

  C.melody = (p) => `
    ${nub(80, 284, '#fff')}${nub(120, 284, '#fff')}
    <path d="M66 196 Q100 186 134 196 L148 278 Q100 290 52 278Z" fill="#ffd3e4" ${st()}/>
    <path d="M78 200 Q100 212 122 200 L120 240 Q100 248 80 240Z" fill="#fff" ${st(3)}/>
    ${nub(54, 230, '#fff')}${nub(148, 226, '#fff')}
    <path d="M36 140 Q30 72 70 62 L62 6 Q88 -6 94 52 Q100 50 106 52 Q112 -6 138 6 L130 62 Q170 72 164 140 Q160 196 100 198 Q40 196 36 140Z" fill="#ff8fbd" ${st()}/>
    <path d="M72 54 L68 18 Q80 12 86 50Z M128 54 L132 18 Q120 12 114 50Z" fill="#ffc2da"/>
    <ellipse cx="100" cy="140" rx="56" ry="46" fill="#fff" ${st(4)}/>
    <g transform="translate(130 46)"><circle cx="0" cy="-8" r="7" fill="#ffd3e4" ${st(2)}/><circle cx="8" cy="-2" r="7" fill="#ffd3e4" ${st(2)}/><circle cx="5" cy="7" r="7" fill="#ffd3e4" ${st(2)}/><circle cx="-5" cy="7" r="7" fill="#ffd3e4" ${st(2)}/><circle cx="-8" cy="-2" r="7" fill="#ffd3e4" ${st(2)}/><circle r="5" fill="#ffd25e"/></g>
    ${smallEyes(p, 140, 78, 122)}
    <ellipse cx="100" cy="153" rx="6" ry="4" fill="#ffd25e" ${st(2.5)}/>
    <path id="${p}-mouth" d="${MOUTH.tiny.d}" fill="none" ${st(3)}/>
    <g id="${p}-blush" opacity=".55"><ellipse cx="62" cy="158" rx="9" ry="5" fill="#ff8fbd"/><ellipse cx="138" cy="158" rx="9" ry="5" fill="#ff8fbd"/></g>
    ${bagWrap(p, 150, 250, 1.8, BAG.basket())}`;

  C.kuromi = (p) => `
    <path d="M58 262 Q16 272 22 230" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M14 236 L22 214 L32 234Z" fill="${INK}"/>
    ${nub(80, 284, '#2b2433')}${nub(120, 284, '#2b2433')}
    <path d="M66 196 Q100 186 134 196 L148 278 Q100 290 52 278Z" fill="#2b2433" ${st()}/>
    <path d="M76 198 Q100 214 124 198 L122 210 Q100 222 78 210Z" fill="#ff8fbd" ${st(3)}/>
    ${nub(54, 230, '#2b2433')}${nub(148, 226, '#2b2433')}
    <path d="M34 140 Q26 78 66 62 Q40 40 28 8 Q68 16 86 54 Q100 50 114 54 Q132 16 172 8 Q160 40 134 62 Q174 78 166 140 Q160 196 100 198 Q40 196 34 140Z" fill="#2b2433" ${st()}/>
    <g transform="translate(100 80)"><ellipse rx="13" ry="11" fill="#ff8fbd"/><circle cx="-4.5" cy="-1" r="2.8" fill="#2b2433"/><circle cx="4.5" cy="-1" r="2.8" fill="#2b2433"/><path d="M-4 6 h8" stroke="#2b2433" stroke-width="2"/></g>
    <ellipse cx="100" cy="142" rx="54" ry="44" fill="#fff" ${st(4)}/>
    ${smallEyes(p, 142, 78, 122)}
    <path d="M70 134 l-8 -4 M130 134 l8 -4" ${st(3)}/>
    <ellipse cx="100" cy="154" rx="4" ry="3" fill="#ff8fbd"/>
    <path id="${p}-mouth" d="M90 160 Q100 168 110 160" fill="none" ${st(3)}/><path d="M103 163 l2 6 3 -6" fill="#fff" ${st(1.5)}/>
    <g id="${p}-blush" opacity=".55"><ellipse cx="62" cy="158" rx="9" ry="5" fill="#ff8fbd"/><ellipse cx="138" cy="158" rx="9" ry="5" fill="#ff8fbd"/></g>
    ${bagWrap(p, 150, 252, 1.8, BAG.bat())}`;

  function char(name, p, cls = '') {
    return `<svg viewBox="0 0 200 300" class="chr ${cls}" data-char="${name}" overflow="visible" aria-hidden="true">${C[name](p)}</svg>`;
  }
  // a collectible figurine: the character's head and shoulders on a little stand
  let toyN = 0;
  function toy(name) {
    const p = 'toy' + (toyN++);
    return `<svg viewBox="10 -8 180 220" aria-hidden="true"><ellipse cx="100" cy="206" rx="70" ry="10" fill="#ffd25e" stroke="${INK}" stroke-width="5"/>${C[name](p)}</svg>`;
  }
  const heartToy = () => `<svg viewBox="0 0 60 60" aria-hidden="true"><ellipse cx="30" cy="54" rx="20" ry="4" fill="#ffd25e" stroke="${INK}" stroke-width="2.5"/>
    <path d="M30 50 C2 32 10 6 30 18 C50 6 58 32 30 50Z" fill="#ff6fa8" stroke="${INK}" stroke-width="3"/>
    <ellipse cx="23" cy="28" rx="2.4" ry="3.2" fill="${INK}"/><ellipse cx="37" cy="28" rx="2.4" ry="3.2" fill="${INK}"/>
    <path d="M26 34 Q30 38 34 34" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="18" cy="34" rx="4" ry="2.4" fill="#ffd3e4"/><ellipse cx="42" cy="34" rx="4" ry="2.4" fill="#ffd3e4"/></svg>`;

  window.ART = { INK, MOUTH, char, toy, heartToy, chars: Object.keys(C) };
})();
