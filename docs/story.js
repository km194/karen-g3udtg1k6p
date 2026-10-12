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
  letter: [
    'Karen,',
    'Write your letter here. Say it like you would say it to her face.',
    'A second paragraph if you want one.',
    'Happy birthday.'
  ],

  invite: 'Halloween is five days after your birthday. Spend it with me?'
};
