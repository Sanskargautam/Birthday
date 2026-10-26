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

/** Sticky nav + hero video caption */
export const headerCopy = {
  wishTitle: 'Happiest Birthday, Ruu',
  wishDate: 'Happy 27th on the 27th',
  punchline: 'The date matched the artist — go be silly, loved, and unstoppable today.',
  signoff: 'Sanskar ♥ Ruu',
};

export const sliderPhotos = [
  { src: '/gallery/IMG_0068.jpg', caption: 'The day my world got cuter' },
  { src: '/gallery/IMG_0069.jpg', caption: 'You — unfairly pretty' },
  { src: '/gallery/IMG_0070.jpg', caption: 'This laugh. Always.' },
  { src: '/gallery/IMG_0071.jpg', caption: 'Us, no filter' },
  { src: '/gallery/IMG_0072.jpg', caption: 'More of this, please' },
];

export const aboutCopy = {
  title: 'To my artist girl',
  paragraphs: [
    'Happy birthday, Ruu — my childish, lovely, impossible-to-ignore artist. You make ordinary things beautiful just by caring about them the way you do, and you’re honestly the best at the things you pour your heart into. On your 27th, on the 27th: many, many happy returns. Luck, light, and every good thing — you deserve all of it.',
    'Three years ago you walked in, and my life got softer, louder, and so much more worth showing up for.',
    'We’ve been fighting more than either of us wants lately, and I hate that it makes us both sad. I’m sorry for my part in it. I want to grow into someone you can feel safe and happy with — with you, for you, even on the days we’re figuring it out.',
    'More than anything, I want you jolly again: silly, warm, creating, laughing, not carrying hurt if I can help it. Today and always, I’m on your side — and I’m glad it’s you.',
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
export const questCopy = {
  title: 'Four ribbons, all for you',
  subtitle:
    'Ruu — I hid four favourite moments here, each one a tiny “I adore you.” Open them one by one; when the last ribbon falls, your letter is right below.',
  done: 'Every ribbon undone — your letter is waiting, love.',
  skipLabel: 'Jump straight to your letter',
};

export const memoryQuestSteps = [
  {
    id: 'q1',
    messageId: 'm1',
    title: 'Where we began',
    teaser: 'Tap — this one’s us',
    whisper: 'Still my favourite hello. You walked in, and ordinary days learned how to glow.',
    photo: '/gallery/30DE7581-7BFE-4116-A730-21064633C9FC.JPEG',
    photoAlt: 'Ruu and Sanskar smiling together at a café table',
    photoCaption: 'The day my world got softer — and a lot more worth showing up for.',
  },
  {
    id: 'q2',
    messageId: 'm2',
    title: 'My soft spot',
    teaser: 'Us, up close',
    whisper: 'That smile could end wars. I fall for it every single time.',
    photo: '/gallery/IMG_0070.jpg',
    photoAlt: 'Ruu and Sanskar cheek to cheek, laughing',
    photoCaption: 'This laugh. Always.',
  },
  {
    id: 'q3',
    messageId: 'm3',
    title: 'Just you',
    teaser: 'The artist, unfiltered',
    whisper: 'Lovely, childish, brilliant — you make kindness look like art.',
    photo: '/gallery/IMG_0069.jpg',
    photoAlt: 'Ruu smiling at a café, gently with a cat',
    photoCaption: 'You — unfairly pretty, and even kinder than the picture lets on.',
  },
  {
    id: 'q4',
    messageId: 'm4',
    title: 'Birthday bow',
    teaser: 'Last ribbon — for 27 on the 27th',
    whisper: 'Happiest birthday, Ruueeeee. I’m on your team today and always.',
    photo: '/gallery/IMG_0072.jpg',
    photoAlt: 'Ruu and Sanskar smiling together in the car',
    photoCaption: 'Us, no filter — and I’d choose this again every time.',
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
