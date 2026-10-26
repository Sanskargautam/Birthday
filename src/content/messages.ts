/** —— Sanskar → Ruu (27 October, turning 27) —— */

export const fromAuthor = {
  name: 'Sanskar',
  signoff: 'Sanskar',
};

export const friendProfile = {
  name: 'Ruu',
  nickname: 'Ruu',
  age: 27,
  email: 'ruu.birthday@example.com',
  instagramUrl: 'https://www.instagram.com/preetydaysofrueee/',
  instagramHandle: '@preetydaysofrueee',
};

export const sliderPhotos = [
  { src: '/gallery/IMG_0068.jpg', caption: 'The day my world got cuter' },
  { src: '/gallery/IMG_0069.jpg', caption: 'You — unfairly pretty' },
  { src: '/gallery/IMG_0070.jpg', caption: 'This laugh. Always.' },
  { src: '/gallery/IMG_0071.jpg', caption: 'Us, no filter' },
  { src: '/gallery/IMG_0072.jpg', caption: 'More of this, please' },
];

export const aboutCopy = {
  title: 'Hey Ruu',
  paragraphs: [
    'Three years ago you walked in — and my life got softer, louder, and a lot more worth showing up for.',
    'I mess up sometimes. I know our fights hurt. I still want every ordinary day with you, not just the pretty ones.',
    'Today you turn 27 on the 27th. I hope you feel silly, warm, and ridiculously loved — because you are.',
  ],
};

/** Full letter — read once in the card section */
export const groupCardMessages = [
  {
    id: 'm1',
    from: 'Sanskar',
    subtitle: 'When we met',
    message:
      'You didn’t just enter my life — you made it feel like home. I’m still so glad it was you.',
    accent: '#f472b6',
  },
  {
    id: 'm2',
    from: 'Sanskar',
    subtitle: 'What I see',
    message:
      'Crochet hands, messy art, big heart. You’re my favourite kind of magic — gentle and brave at once.',
    accent: '#c084fc',
  },
  {
    id: 'm3',
    from: 'Sanskar',
    subtitle: 'Honestly',
    message:
      'I’m sorry for the days I made you sad. I’m still learning. I’m still here — choosing you, on purpose.',
    accent: '#f9a8d4',
  },
  {
    id: 'm4',
    from: 'Sanskar',
    subtitle: '27 · 27',
    message:
      'Happy birthday, my Ruu. Wear the smile you give everyone else — but keep some of the love for yourself today.',
    accent: '#e879f9',
  },
];

/** Unlock quest — tiny whispers only (not the full letter) */
export const memoryQuestSteps = [
  {
    id: 'q1',
    messageId: 'm1',
    title: 'First little knot',
    teaser: 'Tap — I saved something for you',
    whisper: 'Still my favourite hello.',
    photo: '/gallery/IMG_0068.jpg',
  },
  {
    id: 'q2',
    messageId: 'm2',
    title: 'Soft spot',
    teaser: 'One more thread…',
    whisper: 'You make quiet days feel like a party.',
    photo: '/gallery/IMG_0070.jpg',
  },
  {
    id: 'q3',
    messageId: 'm3',
    title: 'From my heart',
    teaser: 'The real bit',
    whisper: 'I’m sorry. I care. I’m not going anywhere.',
    photo: '/gallery/IMG_0071.jpg',
  },
  {
    id: 'q4',
    messageId: 'm4',
    title: 'Birthday bow',
    teaser: 'Last one — for today',
    whisper: '27 looks gorgeous on you.',
    photo: '/gallery/IMG_0072.jpg',
  },
];

export const surpriseVideoSrc = '';

export const surpriseFallbackMessage =
  'No extra clip here — but the rest of this page is for you. — Sanskar';

/** She can pick several — edit titles to what you’ll actually do. */
export const birthdayGiftOptions = [
  {
    id: 'date-night',
    title: 'Date night',
    detail: 'Just us — dinner somewhere you’ve been wanting to try.',
  },
  {
    id: 'yarn-day',
    title: 'Yarn & craft day',
    detail: 'Trip to pick colours, then coffee while you crochet.',
  },
  {
    id: 'lazy-sunday',
    title: 'Lazy Sunday',
    detail: 'No plans. Blanket, snacks, and zero alarms.',
  },
  {
    id: 'pet-outing',
    title: 'Paws outing',
    detail: 'Cats, dogs, or both — a day out with the floofs.',
  },
  {
    id: 'movie-night',
    title: 'Movie night',
    detail: 'Your pick of film, my job is snacks and cuddles.',
  },
  {
    id: 'brunch',
    title: 'Birthday brunch',
    detail: 'Slow morning, good food, you in something comfy and pretty.',
  },
  {
    id: 'surprise-me',
    title: 'Surprise me',
    detail: 'You trust me to plan something — I’ll make it worth it.',
  },
  {
    id: 'just-us',
    title: 'Only time together',
    detail: 'No big event — just you, me, and a long hug.',
  },
];
