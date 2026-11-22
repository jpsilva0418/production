// Business facts, taken verbatim from premiereinsuranceinc.com on 2026-11-21.
// Nothing here is invented. Items the live site itself is inconsistent about
// are marked VERIFY and listed in docs/OPEN_QUESTIONS.md.

const CDN = 'https://cdn.prod.website-files.com/6672145b7ae90b4f0aee448c';
const cdn = (file: string) => `${CDN}/${file}`;
// Webflow serves background video from a "%2F"-joined path.
const vid = (id: string) => ({
  mp4: `${CDN}%2F${id}-transcode.mp4`,
  webm: `${CDN}%2F${id}-transcode.webm`,
  poster: `${CDN}%2F${id}-poster-00001.jpg`,
});

export const site = {
  name: 'Premiere Insurance',
  legalName: 'Premiere Insurance Inc',
  agencyName: 'Premiere Insurance Agency',
  since: 2019,
  domain: 'https://www.premiereinsuranceinc.com',
  phone: { e164: '+19782210139', display: '(978) 221-0139' },
  whatsapp: 'https://wa.me/19782210139',
  hours: { days: 'Mo-Fr', opens: '09:00', closes: '17:00' },
  offices: [
    {
      id: 'chelmsford',
      street: 'Summer St, Unit 19',
      city: 'Chelmsford',
      state: 'MA',
      zip: '01824',
      phone: '(978) 221-0139',
      phoneE164: '+19782210139',
      fax: '(857) 220-8436',
    },
    {
      // VERIFY: listed on every service page and on the PT/ES home pages, but
      // absent from the English home page.
      id: 'clinton',
      street: '116 Union St',
      city: 'Clinton',
      state: 'MA',
      zip: '01510',
      phone: '(978) 549-7676',
      phoneE164: '+19785497676',
      fax: '(978) 733-1956',
    },
  ],
  // Same embed the live site uses.
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11782.161208669748!2d-71.685305!3d42.416233!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e3f148eae82f47%3A0x947a1fd337959492!2sPremiere%20Advisors%2C%20Inc%20-%20Premiere%20Broker%2C%20Inc!5e0!3m2!1spt-BR!2sbr!4v1726162901592!5m2!1spt-BR!2sbr',
  // Existing third-party integrations found on the live site. Each is loaded
  // only when its PUBLIC_ENABLE_* flag is on, so a demo deployment on another
  // domain never writes into the business's real analytics or chat inbox.
  integrations: {
    gtmId: 'GTM-N358X889',
    callbell: { uuid: '0533fa15-d799-4fab-bde5-924adbb5c2c0', scriptToken: 'kPoWhxbQBNvUuE9wzhACgKS2' },
    elfsightReviewsApp: 'elfsight-app-a286fc8e-6f5e-46e3-9a64-da0ac4db6516',
  },
} as const;

export const assets = {
  logoDark: cdn('667216f5f3fb85014ac3a7cc_LOGOPI_PABLO.png'),
  logoLight: cdn('66e0fa6685e6e284763aa437_Logo_NEGATIVO_SemFundo%20(1).png'),
  logoFooter: cdn('667227f8043ef99bd3f12c48_Logo_Horizontal_SemFundo%20(1).png'),
  favicon: cdn('679a57b9aff362efe81f0680_favicon-32x32.png'),
  touchIcon: cdn('672a5403f3f5b26276560171_logo.png'),
  paperTexture: cdn('6714014d0aa4ddf068415263_watercolor-paper-texture.jpg'),
  grain: cdn('66e250906555dbf95f80df5c_graain.png'),
  check: cdn('66e7d7daaf060e8c0d45de26_66e3354f06efdfef61cc1ab7_check.png'),
  heroVideo: vid('66e25a56e8d82cb9468a0c2b_video_2024-09-12_00-04-35'),
  aerialVideo: vid('670df505891c270ca4747287_Aereo%202'),
  documents: [
    cdn('67155c6c876d15f5abc93fe5_ID%20CARD.png'),
    cdn('67155d8044492a4081677078_RTA%20Form.png'),
    cdn('67155dc37bb7c8630b397745_COI.png'),
    cdn('67155dc397866e3c256abcc3_PRF.png'),
  ],
};

export type Line = 'personal' | 'commercial';

export interface ServiceDef {
  slug: string;
  category: string; // stable lead category id
  line: Line;
  image: string;
}

// Order and grouping follow the live navigation ("For Personal" / "For Commercial").
export const services: ServiceDef[] = [
  { slug: 'life-insurance', category: 'life', line: 'personal', image: cdn('66e09b80b557c49f4032a071_pexels-vlada-karpovich-4617316.jpg') },
  { slug: 'homeowners', category: 'homeowners', line: 'personal', image: cdn('6674fa41743d0c2e137aecb2_5%20Cozy%20At%20Home%20Family%20Photo%20Ideas%20_%20Westchester%20NYC%20Family%20Photography%20_%20Amy%20Nghe%20Photography.jpeg') },
  { slug: 'personal-auto', category: 'personal_auto', line: 'personal', image: cdn('66e31677eb45d808f2564f18_Sem%20nome%20(2000%20x%202000%20px)%20(3).png') },
  { slug: 'recreational-vehicle-insurance', category: 'recreational', line: 'personal', image: cdn('66e09c06a93214cdc4c69122_Design%20sem%20nome%20(4).png') },
  { slug: 'commercial-auto', category: 'commercial_auto', line: 'commercial', image: cdn('66e04d17f95c727ce05597e1_Different-types-of-commercial-vehicles-in-a-row-Michigan.jpg') },
  { slug: 'general-liability', category: 'general_liability', line: 'commercial', image: cdn('66dfc56b1b9dd76218d862ab_General.png') },
  { slug: 'workers-compensation', category: 'workers_comp', line: 'commercial', image: cdn('66dfd8b33fe1ceb663b93d0b_crane-8400990_1920.jpg') },
  { slug: 'commercial-property', category: 'commercial_property', line: 'commercial', image: cdn('66e093babac9e831cce3661e_Commercial%20Property.jpg') },
  { slug: 'inland-marine', category: 'inland_marine', line: 'commercial', image: cdn('66e3098d08856135bbdc0e91_pexels-trupert-12835184.avif') },
  { slug: 'umbrella', category: 'umbrella', line: 'commercial', image: cdn('66e095422be9142d71b32979_umbrella-1521492_1920.jpg') },
];

// "Trusted by" carrier logos, in the live order.
export const homeCardOrder = ['life-insurance', 'homeowners', 'personal-auto', 'commercial-auto', 'general-liability', 'workers-compensation', 'commercial-property', 'inland-marine', 'umbrella', 'recreational-vehicle-insurance'];

export const carriers = [
  ['National Life Group', '67d498e6357677028614331f_NLG-logo.png'],
  ['GEICO', '67d495e0ace9711453162d3c_Geico.png'],
  ['The Hanover', '6713fd410026b6de8990e363_Hanover.png'],
  ['Lemonade', '6713fdfdc0dc2d4f1f1fcf1f_Lemonade.png'],
  ['Bristol West', '6713feb6777a77da89424ce9_Bristol.png'],
  ['Progressive', '6713ff2cc0dc2d4f1f20891e_Progressive.png'],
  ['MAPFRE', '6713ff9ec0dba7311eeeb6a7_mapfre.png'],
  ['Travelers', '6714002b9d3ac37ffa81e0e1_Travelers.png'],
  ['Embark General', '66d9139d9d2e5c94476d404e_Embark.png'],
  ['Appalachian Underwriters', '66d914663faf9aae90930da2_Apallachian.png'],
  ['Plymouth Rock Assurance', '66d9133f1ac7788d19513dba_Plymouth.png'],
  ['National General', '66d914f6e3f30632f47b2c31_NatGen.png'],
  ['USLI', '66d91a7e271220d0fe1070a0_USLI.png'],
  ['Pathpoint', '66d91b73eb129d1a17288c8c_Pathpoint.png'],
  ['J&J', '66d91c2fce306398ac5faf1c_J%26J.avif'],
  ['The Hartford', '6674a778d199d653b0b79ff6_pngegg%20(5).avif'],
  ['Safeco', '66d92394617e12054c25993c_Safeco.png'],
].map(([name, file]) => ({ name, src: cdn(file) }));
