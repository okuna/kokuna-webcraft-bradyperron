export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  type: string;
  videoUrl?: string;
  imageUrl: string;
  width: number;
  height: number;
};

export const PROJECTS: Project[] = [
  {
    id: "harlaut-apparel",
    slug: "harlaut-apparel",
    title: "Harlaut Apparel Winter Campaign",
    client: "Harlaut Apparel",
    year: "2024",
    type: "",
    videoUrl: "https://www.youtube.com/watch?v=-gETTd7vTrE",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/d6ac3e0ce944481e0732d26436d27640e0400470-1080x1080.jpg",
    width: 1080,
    height: 1080,
  },
  {
    id: "lo-behold",
    slug: "lo-behold-henrik-harlaut",
    title: '"Lo & Behold" Henrik Harlaut',
    client: "Monster Energy",
    year: "2023",
    type: "Short Film",
    videoUrl: "https://www.youtube.com/watch?v=Hn21UDVOk3E",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/90b6f28fe8519373e5942619884af5622fc383cc-2048x1536.jpg",
    width: 2048,
    height: 1536,
  },
  {
    id: "timberland",
    slug: "timberland",
    title: "Timberland Built for the Bold",
    client: "Timberland",
    year: "2023",
    type: "Commercial",
    videoUrl: "https://www.youtube.com/shorts/RFudzdvrvPc",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/5a193cc9f4ad9d2c6af3203a1a98e042f407aa3a-1920x1080.jpg",
    width: 1920,
    height: 1080,
  },
  {
    id: "nuance",
    slug: "nuance-phil-casabon-x-armada-skis",
    title: '"Nuance" Phil Casabon x Armada Skis',
    client: "Armada Skis",
    year: "2023",
    type: "Short Film",
    videoUrl: "https://www.youtube.com/watch?v=AZH6GulSGYQ",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/d4002ec0d079d7781d1ddacbf5ca55568c3fa82a-5035x3339.jpg",
    width: 5035,
    height: 3339,
  },
  {
    id: "valerie-omari",
    slug: "valerie-omari",
    title: "Valerie Omari",
    client: "Valerie Omari",
    year: "2025",
    type: "Music Video",
    videoUrl: "https://www.youtube.com/watch?v=M-f_vdpkP_M",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/cf3774860fc2e259b5b98c7ed0d4190b08d7036b-3840x2160.jpg",
    width: 3840,
    height: 2160,
  },
  {
    id: "novos-labs",
    slug: "novos-labs",
    title: "NOVOS Labs",
    client: "NOVOS Labs",
    year: "2024",
    type: "Commercial",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/189c09419553268b45572cda075fec37313878ae-3089x2048.jpg",
    width: 3089,
    height: 2048,
  },
  {
    id: "jack-moore",
    slug: "jack-moore-head-in-sand",
    title: "JACK MOORE HEAD IN SAND",
    client: "Jack Moore",
    year: "2024",
    type: "Music Video",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/0881f51ccf5932c3a352365a7e277de5024b2547-2048x1536.jpg",
    width: 2048,
    height: 1536,
  },
  {
    id: "shy-of-summer-ii",
    slug: "shy-of-summer-ii",
    title: "Shy of Summer II",
    client: "Shy of Summer",
    year: "2023",
    type: "Short Film",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/11cdc3fe547613d2dc6ea0dc038d7c34b03fc850-2988x1616.png",
    width: 2988,
    height: 1616,
  },
  {
    id: "omar-al-sudani",
    slug: "ill-see-you-on-the-other-side",
    title: "\"I'll See You on the Other Side\" Omar Al-Sudani x Office Mag",
    client: "Office Magazine",
    year: "2024",
    type: "Editorial",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/4c6b9a827a15c981dd76f55d1167379e30e568f7-3006x1330.png",
    width: 3006,
    height: 1330,
  },
  {
    id: "686-jogger",
    slug: "686-jogger",
    title: "686 Jogger",
    client: "686",
    year: "2023",
    type: "Commercial",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/39f899373e9893b04ef43877b8f0eea98f1f71a1-1080x1080.jpg",
    width: 1080,
    height: 1080,
  },
  {
    id: "erne",
    slug: "erne",
    title: "ERNE",
    client: "ERNE",
    year: "2024",
    type: "Commercial",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/f7d007555a98695447d9c8376d546fc708df2c55-1600x1436.jpg",
    width: 1600,
    height: 1436,
  },
  {
    id: "elaine-hersby",
    slug: "elaine-hersby",
    title: "Elaine Hersby",
    client: "Elaine Hersby",
    year: "2023",
    type: "Editorial",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/1f71c6afd77b2f175a2a6cc23afeadf57debeb1a-1600x1200.jpg",
    width: 1600,
    height: 1200,
  },
  {
    id: "tnf-freeride",
    slug: "the-north-face-freeride",
    title: "The North Face | Freeride",
    client: "The North Face",
    year: "2024",
    type: "Commercial",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/b03b7f78cc137f6fc786fc3952b74f8db58fe82b-1600x968.jpg",
    width: 1600,
    height: 968,
  },
  {
    id: "something-in-water",
    slug: "something-in-the-water-jake-mageau",
    title: '"Something in the Water" Jake Mageau x Level 1',
    client: "Level 1",
    year: "2023",
    type: "Short Film",
    videoUrl: "https://www.youtube.com/watch?v=AZH6GulSGYQ",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/54eaeff8f4671a54752a304cb9ec296df3f9ae89-3130x2075.jpg",
    width: 3130,
    height: 2075,
  },
  {
    id: "tnf-coalesce",
    slug: "the-north-face-coalesce",
    title: 'The North Face "COALESCE"',
    client: "The North Face",
    year: "2023",
    type: "Short Film",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/b311550b0d640b8383ef5d10295e767e9256dd2f-3840x2160.jpg",
    width: 3840,
    height: 2160,
  },
  {
    id: "attn-bite",
    slug: "attn-for-bite",
    title: "ATTN for bite.",
    client: "bite",
    year: "2024",
    type: "Commercial",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/ba68756c2e95ff5c4be548d079843783c2105c3a-3680x2760.jpg",
    width: 3680,
    height: 2760,
  },
  {
    id: "good-bacteria",
    slug: "good-bacteria",
    title: "Good Bacteria",
    client: "Good Bacteria",
    year: "2023",
    type: "Short Film",
    imageUrl:
      "https://cdn.sanity.io/images/qrv69xlg/production/e44975709317e32bc577b39bd9d77b15b495fd28-1920x1080.jpg",
    width: 1920,
    height: 1080,
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
    url: "https://cdn.sanity.io/images/qrv69xlg/production/ce4e709dd358c6174402b1342cef9809f85035b5-3339x5035.jpg",
    width: 3339,
    height: 5035,
    alt: "Brady Perron",
  },
};
