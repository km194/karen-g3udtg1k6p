/* ============================================================
   KEVIN: this is the only file you need to edit.
   Change the words between the quotes. Keep the quotes and commas.
   Then run ./build.sh to update the public link.
   If you change her name, also run gen_voices.py so the voices say it.
   ============================================================ */
window.STORY = {
  herName: 'Karen',
  from: 'Kevin',

  // A song file placed next to this page, e.g. 'music.mp3'. Leave '' for no music.
  music: '',

  // Plays when the candles go out and it says HAPPY BIRTHDAY. Public-domain recording
  // (Wikimedia Commons, "Happy Birthday to You.ogg"). Leave '' for no song.
  birthdaySong: 'happy-birthday.mp3',

  // One sweet note per toy. Each one shows up on that toy's collector card.
  // These are drafts: make them yours.
  notes: {
    harry:     'Happy birthday from Gryffindor to our favorite Ravenclaw! Ron ate half your candy. Sorry. — Harry, Ron & Hermione',
    yato:      'Happy birthday, Karen! I put your name on my shrine. It\'s a very small shrine. It\'s a bottle cap. But it\'s yours. — Yato',
    tanjiro:   'Happy birthday, Karen! You got two brothers to stand side by side. That\'s real magic. You smell like kindness, by the way. — Tanjiro, Genya & (grumpily) Sanemi',
    toothless: 'Happy birthday, Karen! Toothless wanted to bring you a fish. I talked him out of it. You\'re welcome. — Hiccup & Toothless {paw}',
    neytiri:   'Happy birthday, Karen! The whole forest glowed for you tonight. That doesn\'t happen for just anyone. — Jake, Neytiri, Kiri & Tuk',
    golden:    'The rarest one in the set. Only one exists, just like you. — Kevin ♥'
  },

  // Your letter. Each line in quotes is one paragraph.
  // \n starts a new line inside a paragraph. '# ' at the start makes a title, '! ' makes it big.
  letter: [
    'Hi ML,',
    'I just wanted to say thank you for being you. You make me feel safe, unjudged, and loved. I feel at home when I\'m with you.',
    '# Home',
    'I\'ve knocked on a lot of doors,\nbut none have felt like yours.\nYou welcomed every part of me,\nthe version no one else gets to see.',
    'You never make me feel too much,\nyou calm my heart with just a touch.\nYou hear the things I never say,\nand somehow love me anyway.',
    'So blow the candles, make a wish,\nbut first, just let me tell you this:\nwherever we go, whatever we roam,\nyou\'ll always be my home.',
    '! Happy 24th Birthday ML \u2665'
  ],

  invite: 'Halloween is five days after your birthday. Spend it with me?'
};
