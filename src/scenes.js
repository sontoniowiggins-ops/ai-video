// Scene data — edit text here to change what appears on screen and in voiceover

export const SCENES = [
  {
    id: 'opening-scripture',
    type: 'scripture',
    image: 'scene-00-scroll.png',
    audio: 'scene-00.mp3',
    durationInSeconds: 6,
    scripture: {
      lines: [
        'Beyond the rivers of Ethiopia...',
        'My suppliants...',
        'Even the daughter of My dispersed...',
        'shall return.',
      ],
      reference: 'Zephaniah 3:10',
    },
    narration: '',
  },
  {
    id: 'the-capture',
    type: 'scene',
    image: 'scene-01-capture.png',
    audio: 'scene-01.mp3',
    durationInSeconds: 8,
    lines: [
      'In 70 AD...',
      'Jerusalem fell.',
      '',
      'Judah was taken...',
      'scattered into captivity.',
    ],
    narration:
      'In 70 AD... the city fell. Jerusalem was consumed by fire. And the children of Judah... were taken.',
  },
  {
    id: 'arrival-sepharad',
    type: 'scene',
    image: 'scene-02-arrival.png',
    audio: 'scene-02.mp3',
    durationInSeconds: 7,
    lines: [
      'Driven across the sea...',
      'bound in chains...',
      'they arrived on foreign shores.',
    ],
    narration:
      'Bound in chains... they were driven across the sea... and unloaded on the shores of Iberia.',
  },
  {
    id: 'the-flourishing',
    type: 'scene',
    image: 'scene-03-flourishing.png',
    audio: 'scene-03.mp3',
    durationInSeconds: 7,
    lines: [
      'But they did not break.',
      '',
      'They built.',
      'They ruled.',
      'They remembered who they were.',
    ],
    narration:
      'But they did not break. For centuries... they built empires. They remembered their covenant.',
  },
  {
    id: 'the-reclassification',
    type: 'scene',
    image: 'scene-04-reclassification.png',
    audio: 'scene-04.mp3',
    durationInSeconds: 8,
    lines: [
      'Then came the Inquisition.',
      '',
      'A pen moved across a page.',
      'A people were renamed.',
    ],
    narration:
      'Then came the Inquisition. A scribe lifted his pen... and with one word... erased a people from their own history.',
  },
  {
    id: 'closing',
    type: 'closing',
    image: 'scene-05-sunset.png',
    audio: 'scene-05.mp3',
    durationInSeconds: 9,
    lines: [
      'But the prophecy did not end',
      'in captivity...',
      '',
      'It ends...',
      'with return.',
    ],
    narration:
      'But the prophecy did not end in captivity. It was never meant to. It ends... with return.',
  },
];

export const FPS = 30;
export const TOTAL_DURATION_FRAMES = SCENES.reduce(
  (sum, s) => sum + s.durationInSeconds * FPS,
  0
);
