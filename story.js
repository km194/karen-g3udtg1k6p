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
    harry:     'The Sorting Hat didn\'t even have to think. Smartest girl I know, and you never show off about it.',
    yato:      'Yato will grant any wish for five yen. I didn\'t need him. I already got mine when I met you.',
    tanjiro:   'Tanjiro can smell kindness from a mile away. He\'d find you in a second.',
    toothless: 'Toothless only lets a few people get close. I get it now. You\'re one of mine.',
    manolo:    'Manolo picked love over everything everyone expected of him. Easiest choice I ever made too.',
    calcifer:  'Calcifer kept a whole castle warm. You do that for me just by texting good morning.',
    neytiri:   'On Pandora, "I see you" means "I understand you." I see you, Karen. All of you.',
    golden:    'The rarest one in the set. Only one exists, just like you. Happy birthday.'
  },

  // Your letter. Each line in quotes is one paragraph.
  // \n starts a new line inside a paragraph. '# ' at the start makes a title, '! ' makes it big.
  letter: [
    'Hi ML,',
    'I just wanted to say thank you for being you. You make me feel safe, unjudged, and loved. I feel at home when I\'m with you.',
    'I love how I can be myself around you without feeling judged, and I love how you truly love me for me, even the little quirky things I do.',
    '# Home',
    'I\'ve knocked on a lot of doors,\nbut none have felt like yours.\nYou welcomed every part of me,\nthe version no one else gets to see.',
    'You never make me feel too much,\nyou calm my heart with just a touch.\nI don\'t have to try or hide;\nI feel at home when you\'re beside.',
    'So here\'s the thing I want to say\non this, your very special day:\nwherever we go, whatever we roam,\nyou\'ll always be my home.',
    'Thank you so much for being you and loving me the way you do.',
    '! Happy 24th Birthday ML \u2665'
  ],

  invite: 'Halloween is five days after your birthday. Spend it with me?'
};
