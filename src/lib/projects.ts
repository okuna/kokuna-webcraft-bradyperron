export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  type: string;
  description?: string;
  videoUrl?: string;
  previewVideoUrl?: string;
  imageUrl: string;
  sourceUrl: string;
  width: number;
  height: number;
};

export const PROJECTS: Project[] = [
  {
    id: "harlaut-apparel",
    slug: "harlaut-apparel",
    title: "Harlaut Apparel Winter Campaign",
    client: "Harlaut Apparel Winter Campaign",
    year: "2024",
    type: "Campaign",
    videoUrl: "https://www.youtube.com/watch?v=-gETTd7vTrE",
    imageUrl: "/assets/bradyperron/home/harlaut-apparel.webp",
    sourceUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/d6ac3e0ce944481e0732d26436d27640e0400470-1080x1080.jpg",
    width: 1200,
    height: 1200,
  },
  {
    id: "lo-behold",
    slug: "lo-behold-henrik-harlaut",
    title: '"Lo & Behold" Henrik Harlaut',
    client: "Monster Energy",
    year: "2023",
    type: "Short Film",
    videoUrl: "https://www.youtube.com/watch?v=Hn21UDVOk3E",
    previewVideoUrl: "/assets/bradyperron/video/lo-behold.mp4",
    imageUrl: "/assets/bradyperron/home/lo-behold.webp",
    sourceUrl:
      "https://image.mux.com/pWpmeh2nG7EX6MHchaIRXBL00wr2N2zR9zZc3D00wLJH8/thumbnail.webp?width=1200&time=0.45",
    width: 1200,
    height: 1500,
  },
  {
    id: "timberland",
    slug: "timberland",
    title: "Timberland Built for the Bold",
    client: "Timberland",
    year: "2023",
    type: "Commercial",
    description:
      "Timberland men’s Premium 6“ Waterproof Boot, reimagined with regenerative leather. Available now. 1 of 3 ads.",
    videoUrl: "https://www.youtube.com/shorts/RFudzdvrvPc",
    previewVideoUrl: "/assets/bradyperron/video/timberland.mp4",
    imageUrl: "/assets/bradyperron/home/timberland.webp",
    sourceUrl:
      "https://image.mux.com/sfl3vxN2dMGgKu9TMWztvia9YpAmQTrdgSMdLS5EbMw/thumbnail.webp?width=1200&time=7.65",
    width: 1200,
    height: 1500,
  },
  {
    id: "nuance",
    slug: "nuance-phil-casabon-x-armada-skis",
    title: '"Nuance" Phil Casabon x Armada Skis',
    client: "Armada Skis",
    year: "2023",
    type: "Short Film",
    videoUrl: "https://www.youtube.com/watch?v=AZH6GulSGYQ",
    previewVideoUrl: "/assets/bradyperron/video/nuance.mp4",
    imageUrl: "/assets/bradyperron/home/nuance.webp",
    sourceUrl:
      "https://image.mux.com/aRHAvLuj8OTimrgtjFxBzTgIUNd02zHUzW8Dr8uy8IBo/thumbnail.webp?width=1200&time=3.6",
    width: 1200,
    height: 675,
  },
  {
    id: "valerie-omari",
    slug: "valerie-omari",
    title: "Valerie Omari",
    client: "Valerie Omari",
    year: "2025",
    type: "Music Video",
    description:
      "“Closure” is the anchor track of Congolese-born R&B singer-songwriter Valerie Omari’s highly praised sophomore EP.",
    videoUrl: "https://www.youtube.com/watch?v=M-f_vdpkP_M",
    previewVideoUrl: "/assets/bradyperron/video/valerie-omari.mp4",
    imageUrl: "/assets/bradyperron/home/valerie-omari.webp",
    sourceUrl:
      "https://image.mux.com/JIbtVyo57Rn2Q1e00Y01r11kRQIIJ2hR00q47bAgroVfEM/thumbnail.webp?width=1200&time=0.6074195",
    width: 1200,
    height: 675,
  },
  {
    id: "novos-labs",
    slug: "novos-labs",
    title: "NOVOS Labs",
    client: "NOVOS Labs",
    year: "2025",
    type: "Commercial",
    videoUrl: "https://vimeo.com/1026087238/3b96da2d29",
    imageUrl: "/assets/bradyperron/home/novos-labs.webp",
    sourceUrl:
      "https://image.mux.com/bxDFA6bbADD4f6cIXOlyoaOjjcpu3CTIdKg8ECQLdIg/thumbnail.webp?width=1200&time=15.3",
    width: 1200,
    height: 675,
  },
  {
    id: "jack-moore",
    slug: "jack-moore-head-in-sand",
    title: "JACK MOORE HEAD IN SAND",
    client: "JACK MOORE",
    year: "2025",
    type: "Documentary",
    description: "A short view into the world of Jack Moore.",
    videoUrl: "https://vimeo.com/1031949663",
    imageUrl: "/assets/bradyperron/home/jack-moore.webp",
    sourceUrl:
      "https://image.mux.com/5kJQOj4lbLwo00YISA5Za4Z5asGjODrQkpRXiYQUzZSM/thumbnail.webp?width=1200&time=0.37",
    width: 1200,
    height: 1500,
  },
  {
    id: "shy-of-summer-ii",
    slug: "shy-of-summer-ii",
    title: "Shy of Summer II",
    client: "Monster Energy",
    year: "2025",
    type: "Commercial",
    description: "A short ski video for Monster Energy.",
    videoUrl: "https://www.youtube.com/watch?v=zvkRjNP7wzY",
    imageUrl: "/assets/bradyperron/home/shy-of-summer-ii.webp",
    sourceUrl:
      "https://image.mux.com/ed2G4UAptkBwZKbZUeTdp4dY01OmXyNh7tBWS4wOOeLY/thumbnail.webp?width=1200&time=3.43",
    width: 1200,
    height: 675,
  },
  {
    id: "omar-al-sudani",
    slug: "ill-see-you-on-the-other-side-omar-al-sudani-x-office-mag",
    title: '"I\'ll See You on the Other Side" Omar Al-Sudani x Office Mag',
    client: "Omar Al-Sudani x Office Mag",
    year: "2025",
    type: "Documentary",
    description:
      "Alongside Mike Brewer, a short glimpse into memorials of murals in NYC.",
    videoUrl: "https://www.youtube.com/watch?v=rug_Ixf5D9M",
    imageUrl: "/assets/bradyperron/home/other-side.webp",
    sourceUrl:
      "https://image.mux.com/EQluCF0201sFXN003rzo1F017G5c6OX02e7Z8U6Oo02DpU4Ck/thumbnail.webp?width=1200&time=2.70534725",
    width: 1200,
    height: 675,
  },
  {
    id: "686-jogger",
    slug: "686-jogger",
    title: "686 Jogger",
    client: "686",
    year: "2025",
    type: "Commercial",
    description: "Commercial edit for 686 Outerwear new jogger pants.",
    imageUrl: "/assets/bradyperron/home/686-jogger.webp",
    sourceUrl:
      "https://image.mux.com/yM02barDPyENJoFERifqakgUSRlruVXnWwqTptjM01Tz4/thumbnail.webp?width=1200&time=17.73",
    width: 1200,
    height: 675,
  },
  {
    id: "erne",
    slug: "erne",
    title: "ERNE",
    client: "ERNE",
    year: "2024",
    type: "Music Video",
    description:
      "Visual identity for ERNE, a rapper/producer. Music videos & album art.",
    videoUrl: "https://www.youtube.com/watch?v=e52SADE8cEY",
    imageUrl: "/assets/bradyperron/home/erne.webp",
    sourceUrl:
      "https://image.mux.com/xosZAriSATvxlSNRyN3G00XxkDLxwL200X702BAs00DihwM/thumbnail.webp?width=1200&time=2.28377225",
    width: 1200,
    height: 675,
  },
  {
    id: "elaine-hersby",
    slug: "elaine-hersby",
    title: "Elaine Hersby",
    client: "Elaine Hersby",
    year: "2023",
    type: "Commercial",
    description: "Dance Set by Elaine Hersby. Shot in Copenhagen, DK. Gaardbodans.",
    videoUrl: "https://vimeo.com/868790153",
    imageUrl: "/assets/bradyperron/home/elaine-hersby.webp",
    sourceUrl:
      "https://image.mux.com/WWH4qjZS6tEpQucHsY4eFvs8q500DPYux2cHkkWOxN7w/thumbnail.webp?width=1200&time=0.51",
    width: 1200,
    height: 1200,
  },
  {
    id: "tnf-freeride",
    slug: "the-north-face-freeride",
    title: "The North Face | Freeride",
    client: "The North Face",
    year: "2026",
    type: "Commercial",
    description: "A collaboration with Jossi Wells for The North Face.",
    videoUrl: "https://www.youtube.com/watch?v=Fy5GxRCs59I",
    imageUrl: "/assets/bradyperron/home/tnf-freeride.webp",
    sourceUrl:
      "https://image.mux.com/5LyfaAhx9ru01QhWl8WRJDGAk43yDqQMxHxCnZPPsZLg/thumbnail.webp?width=1200&time=1.55",
    width: 1200,
    height: 675,
  },
  {
    id: "something-in-water",
    slug: "something-in-the-water-jake-mageau-x-level-1",
    title: '"Something in the Water" Jake Mageau x Level 1',
    client: "686, ON3P, Fat Tire",
    year: "2025",
    type: "Commercial",
    description:
      'Jake Mageau and Brady Perron proudly offer their second short film, "Something In The Water". Presented by Level 1, made possible by the generous support of 686, Fat Tire, and ON3P Skis.',
    videoUrl: "https://www.youtube.com/watch?v=XBC2B3Pp_iQ",
    imageUrl: "/assets/bradyperron/home/something-water.webp",
    sourceUrl:
      "https://image.mux.com/HmKDMLG98KmDiDgBHkEGY83xl9EkNgCMsgDgX9IIcnE/thumbnail.webp?width=1200&time=1.72",
    width: 1200,
    height: 675,
  },
  {
    id: "tnf-coalesce",
    slug: "the-north-face-coalesce",
    title: 'The North Face "COALESCE"',
    client: "The North Face",
    year: "2023",
    type: "Short Film",
    description:
      'The North Face presents "Coalesce". Jossi Wells unites the movement of skiing and dance alongside ballerina Chelsea Keefer to create a duet focused on precise execution and the beauty therein.',
    videoUrl: "https://www.youtube.com/watch?v=6ABm12ThTPY",
    imageUrl: "/assets/bradyperron/home/tnf-coalesce.webp",
    sourceUrl:
      "https://image.mux.com/XRsKtCiv7obu8vEyNi5yAh8j0200pJpk5Hrfypj7ufHmw/thumbnail.webp?width=1200&time=4.37",
    width: 1200,
    height: 675,
  },
  {
    id: "attn-bite",
    slug: "attn-bite-online",
    title: "ATTN for bite.",
    client: "bite.",
    year: "2026",
    type: "Film",
    description:
      "Edouard and accomplices moving like they can. Québec, Colorado, Austria. No push, no pose — natural, familiar but still new.",
    videoUrl: "https://www.youtube.com/watch?v=7Fw0kNam90o",
    imageUrl: "/assets/bradyperron/home/attn-bite.webp",
    sourceUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/ebd23bed6589565e72b0d01f75246af6662faef7-1920x1080.jpg",
    width: 1200,
    height: 675,
  },
  {
    id: "good-bacteria",
    slug: "good-bacteria",
    title: "Good Bacteria",
    client: "Good Bacteria",
    year: "2026",
    type: "Commercial",
    description: "www.itsgoodbacteria.com",
    videoUrl: "https://vimeo.com/1204594282/7d827858f6?share=copy&fl=sv&fe=ci",
    imageUrl: "/assets/bradyperron/home/good-bacteria.webp",
    sourceUrl:
      "https://image.mux.com/KZL902VCGPzwZEEFhVyGWTMdQ6CnsilqWZTjq1008vIBY/thumbnail.webp?width=1200&time=5",
    width: 1200,
    height: 675,
  },
];

export const SETTINGS = {
  siteTitle: "bradyperron",
  description: "Videographer/Editor/Director",
  longDescription:
    "Brady Perron is a Brooklyn-based Videographer/Director/Editor/Photographer. Rhythm. Range. Poetic. Dynamic.",
  instagram: "https://instagram.com/bradyperron",
  email: "brady.perron@gmail.com",
  portrait: {
    url: "/assets/bradyperron/brady-portrait.jpg",
    sourceUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/ce4e709dd358c6174402b1342cef9809f85035b5-3339x5035.jpg",
    width: 3339,
    height: 5035,
    alt: "Brady Perron standing outside in winter",
  },
};
