export interface TrimCategory {
  name: string;
  slug: string;
  assetSlug: string;
  family: string;
  short: string;
  specs: {
    material: string;
    sizes: string;
    finish: string;
    moq: string;
  };
  profiles: {
    id: string;
    name: string;
    detail: string;
  }[];
}

export interface RunwayTrim {
  trimId: string;
  name: string;
  categorySlug: string;
  family: string;
  image: string;
  pinX: number; // % of garment box
  pinY: number; // % of garment box
  isNew?: boolean;
}

export interface RunwayLook {
  index: number;
  code: string;
  name: string;
  trimCountLabel: string;
  catalogDescription: string;
  image: string;
  imageMobile: string;
  trims: RunwayTrim[];
}

export const FINISH_OPTIONS = ["Matt Black", "Antique Brass", "Gunmetal", "Nickel"] as const;
export const SIZE_OPTIONS = ["12 mm", "15 mm", "18 mm", "20 mm"] as const;

export const HEADER_COPY = {
  logo: "/assets/HDLOGO-transparent.png",
  logoAlt: "NHL International",
  nav: [
    { label: "Home", to: "/" },
    { label: "About us", to: "/#about" },
    { label: "How we work", to: "/#work" },
    { label: "Catalog", to: "/catalog", hasDropdown: true },
    { label: "Contact", to: "/contact" },
  ],
  inquiryButtonLabel: "Inquiry list",
};

export const RUNWAY_COPY = {
  title: "Trim the Look.",
  sub: "Six garments, trimmed head to toe. Click any garment to inspect its trims.",
  panelHeading: "In this garment",
  panelCountLabel: "3 trims",
  priceLine: "Quote on request",
  popupHint: "Tap a dot to shop the trim",
  bundleTitle: "Complete the look",
  bundleNote: "Add all 3 trims to one inquiry",
  bundleCta: "Add full trim set to inquiry",
  bundleCtaDone: "Full trim set in your inquiry",
  bundlePendingPrefix: "Choose a finish and size for:",
  confirmLabel: "Add to inquiry",
  toastSingle: "Trim added to your inquiry list",
  toastBundle: "Trim set added to your inquiry list",
  modalTitle: "Your inquiry list",
  modalNote: "A shortlist of trims you want quoted. Prices on request.",
  modalEmpty: "Your inquiry list is empty. Pick a finish and size beside a trim to save it.",
  modalDownloadLabel: "Download inquiry list",
  modalSendLabel: "Send inquiry",
};

export const categories: TrimCategory[] = [
  {
    name: "Beads",
    slug: "beads",
    assetSlug: "beads",
    family: "Decorative trims",
    short: "Decorative accents for expressive collections.",
    specs: { material: "Resin, wood & brass", sizes: "6 mm – 18 mm", finish: "DTM Pantone & plating", moq: "On request" },
    profiles: [
      { id: "beads-1", name: "Faceted Brass Spacer Bead", detail: "Precision-bored metal bead for drawcord terminations and knitwear accents." },
      { id: "beads-2", name: "Matte Resin Barrel Bead", detail: "Lightweight dyed-to-match resin bead with smooth inner channel." },
      { id: "beads-3", name: "Knurled Alloy Stopper Bead", detail: "Machined cylindrical accent engineered for outerwear cords." },
    ],
  },
  {
    name: "Belts",
    slug: "belts",
    assetSlug: "belts",
    family: "Waistband hardware",
    short: "Structured belts and waistband components.",
    specs: { material: "Woven nylon, cotton webbing & leather", sizes: "25 mm – 38 mm width", finish: "DTM & matte hardware", moq: "On request" },
    profiles: [
      { id: "belts-1", name: "Heavy Twill Cargo Webbing Belt", detail: "High-density woven strap paired with alloy utility buckle." },
      { id: "belts-2", name: "Tailored Waistband Belt Tab", detail: "Clean-edge self-fabric or webbing belt tab for pleated trousers." },
      { id: "belts-3", name: "Tactical Release Belt Assembly", detail: "Quick-adjust strap with reinforced bar-tack tipping." },
    ],
  },
  {
    name: "Buckles",
    slug: "buckles",
    assetSlug: "buckles",
    family: "Garment hardware",
    short: "Hardware designed for secure, refined fastening.",
    specs: { material: "Zinc alloy, brass & acetal", sizes: "15 mm – 40 mm", finish: "Plated & brushed DTM", moq: "On request" },
    profiles: [
      { id: "buckles-1", name: "Single-Prong Roller Buckle", detail: "Low-friction roller bar engineered for structured utility waistbands." },
      { id: "buckles-2", name: "Cam Slide Waist Adjuster", detail: "Slim-profile alloy slider for coats, cuffs, and cargo pockets." },
      { id: "buckles-3", name: "Quick-Release Side Buckle", detail: "Contoured technical clasp tested for high tensile load." },
    ],
  },
  {
    name: "Buttons",
    slug: "buttons",
    assetSlug: "buttons",
    family: "Garment closures",
    short: "Buttons for everyday essentials and elevated detail.",
    specs: { material: "Corozo, horn, polyester & urea", sizes: "12 mm – 28 mm", finish: "Laser engraved & DTM", moq: "On request" },
    profiles: [
      { id: "buttons-1", name: "Four-Hole Horn Effect Button", detail: "Turned rim profile with deep thread channel for shirting and tailoring." },
      { id: "buttons-2", name: "Matte Urea Workwear Button", detail: "Heat-resistant and launderable button for denim and outerwear." },
      { id: "buttons-3", name: "Natural Corozo Shirt Button", detail: "Fine-grained botanical button dyed to custom Pantone reference." },
    ],
  },
  {
    name: "D Rings",
    slug: "d-rings",
    assetSlug: "d-rings",
    family: "Garment hardware",
    short: "Reliable D-ring hardware for straps and adjustability.",
    specs: { material: "Stamped steel & cast zinc alloy", sizes: "12 mm – 32 mm", finish: "Nickel, brass & gunmetal", moq: "On request" },
    profiles: [
      { id: "d-rings-1", name: "Welded Wire D-Ring", detail: "Seamless closed joint built for high-load outerwear and bag straps." },
      { id: "d-rings-2", name: "Flat-Profile Cast D-Ring", detail: "Sharp architectural edges with smooth inner webbing channel." },
      { id: "d-rings-3", name: "Double D-Ring Waist Cinch", detail: "Matched pair for adjustable side tabs and belted cuffs." },
    ],
  },
  {
    name: "Drawcords",
    slug: "drawcords",
    assetSlug: "drawcords",
    family: "Cords & tipping",
    short: "Functional cords for fit, movement and finish.",
    specs: { material: "Organic cotton, polyester & braided poly", sizes: "4 mm – 10 mm", finish: "Metal, silicone & dipped aglets", moq: "On request" },
    profiles: [
      { id: "drawcords-1", name: "Braided Cotton Hood Drawcord", detail: "Soft-hand tubular cord finished with engraved metal aglets." },
      { id: "drawcords-2", name: "Flat Herringbone Waist Cord", detail: "Tight weave engineered to resist twisting inside trouser channels." },
      { id: "drawcords-3", name: "Silicone-Dipped Technical Cord", detail: "Clean matte dipped tip with subtle tonal branding option." },
    ],
  },
  {
    name: "Elastic Items",
    slug: "elastic-items",
    assetSlug: "elastic-items",
    family: "Stretch trims",
    short: "Stretch components built around garment performance.",
    specs: { material: "Polyester / spandex & natural rubber", sizes: "10 mm – 50 mm", finish: "Woven jacquard & knit", moq: "On request" },
    profiles: [
      { id: "elastic-items-1", name: "High-Recovery Ribbed Waist Elastic", detail: "Maintains snap-back tension across repeated industrial wash cycles." },
      { id: "elastic-items-2", name: "Brushed Soft-Touch Jacquard Band", detail: "Plush inner face for activewear waistbands and cuffs." },
      { id: "elastic-items-3", name: "Fold-Over Binding Elastic", detail: "Pre-creased stretch binding for clean activewear hems and armholes." },
    ],
  },
  {
    name: "Grippers",
    slug: "grippers",
    assetSlug: "grippers",
    family: "Performance trims",
    short: "Practical fastening pieces for dependable wear.",
    specs: { material: "Silicone-coated nylon & elastic", sizes: "12 mm – 25 mm", finish: "Clear, tonal & patterned", moq: "On request" },
    profiles: [
      { id: "grippers-1", name: "Twin-Bead Silicone Hem Gripper", detail: "Non-slip interior band that anchors activewear hems in motion." },
      { id: "grippers-2", name: "Woven Waistband Shirt Gripper", detail: "Rubberized weave designed to hold tucked shirting neatly in place." },
      { id: "grippers-3", name: "Breathable Micro-Dot Gripper Tape", detail: "Perforated elastic gripper for high-output training apparel." },
    ],
  },
  {
    name: "Hook & Bar",
    slug: "hook-bar-2",
    assetSlug: "hook-bar",
    family: "Tailored closures",
    short: "Low-profile closure hardware for clean silhouettes.",
    specs: { material: "Stamped brass & stainless steel", sizes: "12 mm – 20 mm", finish: "Nickel, gunmetal & black", moq: "On request" },
    profiles: [
      { id: "hook-bar-1", name: "4-Part Trouser Hook & Bar", detail: "Concealed flat-lock closure engineered for tailored and cargo waistbands." },
      { id: "hook-bar-2", name: "Sew-On Collar Hook & Eye", detail: "Fine-gauge stamped closure for structured necklines and plackets." },
      { id: "hook-bar-3", name: "Heavy Duty Workwear Hook Set", detail: "Reinforced prong grip tested for high lateral waist tension." },
    ],
  },
  {
    name: "Laces",
    slug: "laces",
    assetSlug: "laces",
    family: "Cords & lacing",
    short: "Flat, oval and round profiles for apparel and footwear.",
    specs: { material: "Mercerized cotton & waxed polyester", sizes: "5 mm – 10 mm", finish: "Metal or clear aglets", moq: "On request" },
    profiles: [
      { id: "laces-1", name: "Waxed Flat Technical Lace", detail: "Crisp flat profile with moisture-resistant finish and metal tips." },
      { id: "laces-2", name: "Tubular Performance Lace", detail: "High-abrasion weave engineered for active sets and utility garments." },
      { id: "laces-3", name: "Herringbone Cotton Lace", detail: "Natural tactile weave with dyed-to-match thread uniformity." },
    ],
  },
  {
    name: "Loop Buttons",
    slug: "loop-buttons",
    assetSlug: "loop-buttons",
    family: "Tailored closures",
    short: "Tailored loop-button details with a considered finish.",
    specs: { material: "Braided cord, elastic & resin/horn", sizes: "12 mm – 20 mm", finish: "DTM fabric & matte", moq: "On request" },
    profiles: [
      { id: "loop-buttons-1", name: "Rouleau Linen Loop & Button", detail: "Pre-formed fabric loop matched with dome or flat-rim button." },
      { id: "loop-buttons-2", name: "Elasticated Cuff Loop Assembly", detail: "Low-stretch elastic loop paired with tonal matte button." },
      { id: "loop-buttons-3", name: "Braided Toggle Loop Closure", detail: "Structured double-cord loop designed for outerwear plackets." },
    ],
  },
  {
    name: "Paper Bags",
    slug: "paper-bags",
    assetSlug: "paper-bags",
    family: "Packaging accessories",
    short: "Packaging accessories that carry the collection through.",
    specs: { material: "FSC-certified kraft & uncoated board", sizes: "Custom retail dimensions", finish: "Foil, deboss & matte", moq: "On request" },
    profiles: [
      { id: "paper-bags-1", name: "Uncoated Cotton-Cord Carrier", detail: "Heavyweight board bag with knotting cotton cord handles." },
      { id: "paper-bags-2", name: "Matte Kraft Garment Bag", detail: "Reinforced fold-over gusset with crisp single-colour print." },
      { id: "paper-bags-3", name: "Gusseted Boutique Accessory Bag", detail: "Compact packaging tailored for trims, knitwear, and small goods." },
    ],
  },
  {
    name: "Reflective Tape",
    slug: "reflective-tape",
    assetSlug: "reflective-tape",
    family: "Performance trims",
    short: "Visibility-focused trims for performance applications.",
    specs: { material: "Glass-bead polyester & PU transfer", sizes: "10 mm – 50 mm", finish: "Silver, iridescent & tonal", moq: "On request" },
    profiles: [
      { id: "reflective-tape-1", name: "High-Luminance Sew-On Tape", detail: "Weatherproof reflective strip tested for storm shells and outerwear." },
      { id: "reflective-tape-2", name: "Segmented Heat-Transfer Tape", detail: "Flexible perforated transfer engineered for stretch technical shells." },
      { id: "reflective-tape-3", name: "Reflective Piping Cord", detail: "3 mm flanged reflective piping for clean seam insertion." },
    ],
  },
  {
    name: "Shank",
    slug: "shank",
    assetSlug: "shank",
    family: "Denim & outerwear",
    short: "Shank-style components for dependable attachment.",
    specs: { material: "Solid brass, zinc alloy & stainless", sizes: "14 mm – 22 mm", finish: "Antique brass, nickel & black", moq: "On request" },
    profiles: [
      { id: "shank-1", name: "Swivel-Post Denim Shank Button", detail: "Articulated tack pin prevents fabric pull and eases buttoning." },
      { id: "shank-2", name: "Fixed-Post Donut Shank", detail: "Open-center heavy gauge metal button with debossed rim." },
      { id: "shank-3", name: "Dome Alloy Jacket Shank", detail: "Smooth domed face engineered for heavy twill and selvedge denim." },
    ],
  },
  {
    name: "Snap",
    slug: "snap",
    assetSlug: "snap",
    family: "Garment hardware",
    short: "Snap fasteners made for repeatable performance.",
    specs: { material: "Brass & stainless spring ring", sizes: "12 mm – 20 mm", finish: "Enamel, electroplated & raw", moq: "On request" },
    profiles: [
      { id: "snap-1", name: "Ring-Spring Heavy Snap Fastener", detail: "Consistent snap action rated for outerwear plackets and cuff tabs." },
      { id: "snap-2", name: "Prong-Ring Pearl & Enamel Snap", detail: "Low-profile western and shirting snap with DTM cap." },
      { id: "snap-3", name: "Hidden Magnetic-Assist Snap", detail: "Clean blind-hem closure encapsulated for waterproof garments." },
    ],
  },
  {
    name: "Tapes & Cords",
    slug: "tapes-cords-2",
    assetSlug: "tapes-cords",
    family: "Woven trims",
    short: "Woven and braided components for utility and identity.",
    specs: { material: "Cotton, herringbone, twill & poly", sizes: "6 mm – 38 mm", finish: "Piece-dyed & yarn-dyed", moq: "On request" },
    profiles: [
      { id: "tapes-cords-1", name: "Organic Herringbone Neck Tape", detail: "Soft fine-twill back-neck reinforcement tape in custom Pantone." },
      { id: "tapes-cords-2", name: "Grosgrain Placket Stabilizer", detail: "Crisp ribbed weave for button stands, collar bands, and waistbands." },
      { id: "tapes-cords-3", name: "Tubular Cotton Draw-Tape", detail: "Flat-woven natural tape for relaxed shirting and utility hems." },
    ],
  },
  {
    name: "Toggles",
    slug: "toggles-2",
    assetSlug: "toggles",
    family: "Outerwear hardware",
    short: "Adjustable toggle solutions for outerwear and activewear.",
    specs: { material: "Horn, wood, nylon & zinc alloy", sizes: "12 mm – 45 mm", finish: "Matte, rubberized & natural", moq: "On request" },
    profiles: [
      { id: "toggles-1", name: "Single-Hole Spring Cord Lock", detail: "Stainless internal spring mechanism for hood and hem drawcords." },
      { id: "toggles-2", name: "Cylindrical Alloy Barrel Toggle", detail: "Compact machined stopper with zero-slip internal grip." },
      { id: "toggles-3", name: "Turned Horn Coat Toggle", detail: "Traditional duffle toggle profile with clean countersunk bores." },
    ],
  },
  {
    name: "Zip Pullers",
    slug: "zip-pullers-2",
    assetSlug: "zip-pullers",
    family: "Zipper components",
    short: "Small details that give a zipper its final character.",
    specs: { material: "Zinc alloy, TPU & braided cord", sizes: "12 mm – 35 mm", finish: "Matte rubberized & plated", moq: "On request" },
    profiles: [
      { id: "zip-pullers-1", name: "Molded TPU Storm Pull Tab", detail: "Glove-friendly ergonomic grip textured for rainwear and technical shells." },
      { id: "zip-pullers-2", name: "Machined Rectangular Metal Pull", detail: "Sharp geometric slider puller with optional debossed wordmark." },
      { id: "zip-pullers-3", name: "Knotted Cord Extension Puller", detail: "Lightweight paracord loop with heat-shrunk end cap." },
    ],
  },
  {
    name: "Zippers",
    slug: "zippers-2",
    assetSlug: "zippers",
    family: "Garment closures",
    short: "Zippers for apparel, accessories and technical applications.",
    specs: { material: "Brass #5/#8, nylon coil & vislon", sizes: "12 mm – 20 mm tape / #3–#8", finish: "DTM tape & plated teeth", moq: "On request" },
    profiles: [
      { id: "zippers-1", name: "Polished Metal #5 Open-End Zipper", detail: "Smooth-gliding brass teeth with auto-lock slider for fleece and outerwear." },
      { id: "zippers-2", name: "Reverse-Coil Water-Repellent Zipper", detail: "PU-laminated tape seal built for storm parkas and technical jackets." },
      { id: "zippers-3", name: "Concealed Invisible Seam Zipper", detail: "Fine nylon spiral engineered to disappear cleanly into tailored seams." },
    ],
  },
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug || c.assetSlug === slug);

export const RUNWAY_LOOKS: RunwayLook[] = [
  {
    index: 0,
    code: "Look 01",
    name: "The Zip Hoodie",
    trimCountLabel: "3 trims",
    catalogDescription: "Precision zippers, drawcords and ribbed elastic trims for structured fleece outerwear.",
    image: "/assets/garments/look-1.webp",
    imageMobile: "/assets/garments/look-1-640.webp",
    trims: [
      {
        trimId: "look1-zippers",
        name: "Zippers",
        categorySlug: "zippers-2",
        family: "Garment trims",
        image: "/assets/trims/zippers.webp",
        pinX: 50,
        pinY: 34,
        isNew: true,
      },
      {
        trimId: "look1-drawcords",
        name: "Drawcords",
        categorySlug: "drawcords",
        family: "Garment trims",
        image: "/assets/trims/drawcords.webp",
        pinX: 44.5,
        pinY: 27,
      },
      {
        trimId: "look1-elastic-items",
        name: "Elastic Items",
        categorySlug: "elastic-items",
        family: "Garment trims",
        image: "/assets/trims/elastic-items.webp",
        pinX: 61,
        pinY: 86,
      },
    ],
  },
  {
    index: 1,
    code: "Look 02",
    name: "The Denim Jacket",
    trimCountLabel: "3 trims",
    catalogDescription: "Heavy-gauge denim shanks, utility buttons and ring-spring snaps built for rugged wear.",
    image: "/assets/garments/look-2.webp",
    imageMobile: "/assets/garments/look-2-640.webp",
    trims: [
      {
        trimId: "look2-shank",
        name: "Shank",
        categorySlug: "shank",
        family: "Garment trims",
        image: "/assets/trims/shank.webp",
        pinX: 46,
        pinY: 32,
        isNew: true,
      },
      {
        trimId: "look2-buttons",
        name: "Buttons",
        categorySlug: "buttons",
        family: "Garment trims",
        image: "/assets/trims/buttons.webp",
        pinX: 51,
        pinY: 42.5,
      },
      {
        trimId: "look2-snap",
        name: "Snap",
        categorySlug: "snap",
        family: "Garment trims",
        image: "/assets/trims/snap.webp",
        pinX: 61.5,
        pinY: 82.5,
      },
    ],
  },
  {
    index: 2,
    code: "Look 03",
    name: "The Cargo Trouser",
    trimCountLabel: "3 trims",
    catalogDescription: "Waistband belts, cast hardware buckles and concealed hook & bar closures for utility trousers.",
    image: "/assets/garments/look-3.webp",
    imageMobile: "/assets/garments/look-3-640.webp",
    trims: [
      {
        trimId: "look3-belts",
        name: "Belts",
        categorySlug: "belts",
        family: "Garment trims",
        image: "/assets/trims/belts.webp",
        pinX: 58,
        pinY: 42.5,
      },
      {
        trimId: "look3-buckles",
        name: "Buckles",
        categorySlug: "buckles",
        family: "Garment trims",
        image: "/assets/trims/buckles.webp",
        pinX: 50,
        pinY: 43,
        isNew: true,
      },
      {
        trimId: "look3-hook-bar",
        name: "Hook & Bar",
        categorySlug: "hook-bar-2",
        family: "Garment trims",
        image: "/assets/trims/hook-bar.webp",
        pinX: 44.5,
        pinY: 44,
      },
    ],
  },
  {
    index: 3,
    code: "Look 04",
    name: "The Rain Jacket",
    trimCountLabel: "3 trims",
    catalogDescription: "High-visibility reflective tapes, molded zip pullers and weatherproof hood drawcords.",
    image: "/assets/garments/look-4.webp",
    imageMobile: "/assets/garments/look-4-640.webp",
    trims: [
      {
        trimId: "look4-reflective-tape",
        name: "Reflective Tape",
        categorySlug: "reflective-tape",
        family: "Garment trims",
        image: "/assets/trims/reflective-tape.webp",
        pinX: 58,
        pinY: 58.5,
        isNew: true,
      },
      {
        trimId: "look4-zip-pullers",
        name: "Zip Pullers",
        categorySlug: "zip-pullers-2",
        family: "Garment trims",
        image: "/assets/trims/zip-pullers.webp",
        pinX: 51,
        pinY: 21,
      },
      {
        trimId: "look4-drawcords",
        name: "Drawcords",
        categorySlug: "drawcords",
        family: "Garment trims",
        image: "/assets/trims/drawcords.webp",
        pinX: 44,
        pinY: 24.5,
      },
    ],
  },
  {
    index: 4,
    code: "Look 05",
    name: "The Linen Shirt",
    trimCountLabel: "3 trims",
    catalogDescription: "Refined shirting buttons, tailored loop buttons and herringbone collar tapes.",
    image: "/assets/garments/look-5.webp",
    imageMobile: "/assets/garments/look-5-640.webp",
    trims: [
      {
        trimId: "look5-buttons",
        name: "Buttons",
        categorySlug: "buttons",
        family: "Garment trims",
        image: "/assets/trims/buttons.webp",
        pinX: 50.5,
        pinY: 32.5,
      },
      {
        trimId: "look5-loop-buttons",
        name: "Loop Buttons",
        categorySlug: "loop-buttons",
        family: "Garment trims",
        image: "/assets/trims/loop-buttons.webp",
        pinX: 50.5,
        pinY: 40.5,
        isNew: true,
      },
      {
        trimId: "look5-tapes-cords",
        name: "Tapes & Cords",
        categorySlug: "tapes-cords-2",
        family: "Garment trims",
        image: "/assets/trims/tapes-cords.webp",
        pinX: 48.5,
        pinY: 20.5,
      },
    ],
  },
  {
    index: 5,
    code: "Look 06",
    name: "The Active Set",
    trimCountLabel: "3 trims",
    catalogDescription: "High-recovery elastic bands, non-slip hem grippers and performance laces.",
    image: "/assets/garments/look-6.webp",
    imageMobile: "/assets/garments/look-6-640.webp",
    trims: [
      {
        trimId: "look6-elastic-items",
        name: "Elastic Items",
        categorySlug: "elastic-items",
        family: "Garment trims",
        image: "/assets/trims/elastic-items.webp",
        pinX: 51,
        pinY: 41,
      },
      {
        trimId: "look6-grippers",
        name: "Grippers",
        categorySlug: "grippers",
        family: "Garment trims",
        image: "/assets/trims/grippers.webp",
        pinX: 43,
        pinY: 84.5,
        isNew: true,
      },
      {
        trimId: "look6-laces",
        name: "Laces",
        categorySlug: "laces",
        family: "Garment trims",
        image: "/assets/trims/laces.webp",
        pinX: 47,
        pinY: 24,
      },
    ],
  },
];

export const OUR_STORY_COPY = {
  label: "Our Story",
  headline: "Built on precision, sustained by trust.",
  paragraphs: [
    "At NHL International, our story is built on a passion for connecting global apparel brands with reliable, high-quality garment accessories. Headquartered in Ningbo, China, with strong market experience across Sri Lanka and Southeast Asia, we have established ourselves as a trusted sourcing and manufacturing partner for customers worldwide. From zippers, buttons, labels, and drawcords to a complete range of garment trims and packaging accessories, we are committed to delivering precision, consistency, and value in every order.",
    "By combining industry expertise, a dependable supply chain, and a customer-first approach, we help brands streamline their sourcing while maintaining the highest standards of quality, competitive pricing, and on-time delivery. As we continue to grow, our mission remains the same: to build lasting partnerships through trust, innovation, and excellence in every detail.",
  ],
  image: "/assets/story-atelier.jpg",
  imageAlt: "Warm travertine flat-lay of NHL International solid brass shanks, metal zippers, herringbone cotton drawcords, Pantone swatches, brass shears and digital caliper",
};

export const FULL_RANGE_COPY = {
  headline: "Browse the full range.",
  sub: "Explore every category of trims, hardware and accessories we supply to apparel manufacturers worldwide.",
};

export const CERTIFICATIONS_COPY = {
  label: "Certifications",
  headline: "Certified Quality, Globally Trusted",
  sub: "Our products meet international safety and sustainability standards.",
  items: [
    {
      name: "Confidence In Textiles",
      logo: "/assets/cert-confidence-in-textiles.png",
      body: "Verified under the Confidence in Textiles label, ensuring textile products are independently tested for harmful substances and meet internationally recognized safety and quality standards.",
    },
    {
      name: "Made In Green",
      logo: "/assets/cert-made-in-green.png",
      body: "Certified under Made in Green, confirming products are manufactured in environmentally responsible facilities under socially responsible working conditions, with full supply chain traceability.",
    },
    {
      name: "STANDARD 100 Certified",
      logo: "/assets/cert-standard-100.png",
      body: "Certified to the STANDARD 100 standard, verifying that every component of the textile product has been tested for harmful substances and complies with strict international safety requirements.",
    },
  ],
};

export const HOW_WE_WORK_COPY = {
  label: "How We Work",
  headline: "A clear process from inquiry to delivery.",
  steps: [
    {
      number: "01",
      title: "Design & Development",
      body: "We review your requirements, artwork, and technical specifications to develop the ideal trim solution for your garment.",
    },
    {
      number: "02",
      title: "Tooling & Production",
      body: "Using advanced manufacturing processes, we produce trims with consistent quality, precision, and durability.",
    },
    {
      number: "03",
      title: "Quality Assurance",
      body: "Every production batch undergoes strict inspections for dimensions, colour, finish, strength, and performance.",
    },
    {
      number: "04",
      title: "Packaging & Global Delivery",
      body: "Products are securely packed and shipped worldwide with complete export documentation and on-time delivery.",
    },
  ],
};

export const CAPABILITIES_COPY = {
  headline: "Our Manufacturing Capabilities",
  intro:
    "With advanced production equipment, strict quality control systems, and experienced technical teams, we ensure every trim is manufactured to international standards with consistent quality, reliability, and performance.",
  items: [
    {
      number: "01",
      title: "Button Attaching Machine",
      body: "Our button attaching machines test and verify the secure attachment of buttons, eyelets, and other trims to customer specifications, ensuring consistent quality and reliable performance.",
      image: "/assets/capabilities/button-attaching.jpg",
    },
    {
      number: "02",
      title: "Pull Test Machine",
      body: "Every critical trim undergoes pull strength testing to ensure secure attachment, durability, and compliance with customer specifications and quality standards.",
      image: "/assets/capabilities/pull-test.jpg",
    },
    {
      number: "03",
      title: "DTM (Colour Matching)",
      body: "We provide precise Dyed-to-Match (DTM) colour development using Pantone references and physical swatches for consistent, accurate colour matching.",
      image: "/assets/capabilities/dtm-matching.jpg",
    },
    {
      number: "04",
      title: "Quality Inspection",
      body: "Quality is monitored at every stage, from raw material inspection to final inspection and pre-shipment verification, ensuring every order meets customer expectations.",
      image: "/assets/capabilities/quality-inspection.jpg",
    },
    {
      number: "05",
      title: "After-Sales Service",
      body: "Our support continues after shipment with responsive after-sales service and prompt resolution of any quality concerns.",
      image: "/assets/capabilities/after-sales.jpg",
    },
    {
      number: "06",
      title: "Packaging",
      body: "Every order is packed using export-standard methods, with customized packaging, labels, barcodes, and cartons available to meet customer requirements.",
      image: "/assets/capabilities/packaging.jpg",
    },
  ],
};

export const INQUIRY_SECTION_COPY = {
  headline: "Request samples or a quotation",
  text: "Our sourcing team will share specifications, minimum order quantities and lead times tailored to your production schedule.",
  catalogLabel: "View Catalog",
  contactLabel: "Send an Inquiry",
};

export const CONTACT_AND_FOOTER_COPY = {
  tagline:
    "The silent partner behind the world's leading apparel brands, precision-engineered garment trims and accessories.",
  exploreLinks: [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/#about" },
    { label: "Catalog", to: "/catalog" },
    { label: "Contact", to: "/contact" },
  ],
  phone: "+94 77 578 1519",
  email: "sales@nhltrims.com",
  colomboOfficeLabel: "NHL regional office",
  colomboAddress: "Paramount Tower, 3rd Floor, No 192/10, 9th Lane, Nawala Rd, Kotte, Sri Lanka 10107",
  ningboOfficeLabel: "China office (HQ)",
  ningboAddress: "Room 709, 4# Block, Oriental Business Center, No.456 Xingning Road, Ningbo, Zhejiang Province, China 315041",
  kotteMapEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=79.8832%2C6.8842%2C79.8982%2C6.8962&layer=mapnik&marker=6.8902%2C79.8907",
  kotteMapDirectionsUrl: "https://maps.app.goo.gl/kUH7g6pWoMWqBgMu6",
  ningboMapDirectionsUrl: "https://maps.app.goo.gl/NACnowEHe38JzGS76",
  copyright: "© 2026 NHL International. All rights reserved.",
};

export interface StoryChapter {
  id: string;
  kicker: string;
  headline: string;
  paragraphs: string[];
  plinthImage: string;
  plinthAlt: string;
  loupeImage: string;
  loupeAlt: string;
  facts: string[];
  ctaLabel: string;
  ctaTo: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "heritage",
    kicker: "Our Story · Global Trim Sourcing",
    headline: OUR_STORY_COPY.headline,
    paragraphs: OUR_STORY_COPY.paragraphs,
    plinthImage: "/assets/story-atelier.jpg",
    plinthAlt: OUR_STORY_COPY.imageAlt,
    loupeImage: "/assets/detail-trims.jpg",
    loupeAlt: "Close-up surface finish of NHL International brass shanks and woven trims",
    facts: ["Ningbo HQ, China", "Kotte Office, Sri Lanka", "19 Trim Categories"],
    ctaLabel: "Explore catalog",
    ctaTo: "/catalog",
  },
  {
    id: "ningbo",
    kicker: "Ningbo Headquarters · Zhejiang, China",
    headline: "Tooling, plating, and dye-house precision at source.",
    paragraphs: [
      "From our headquarters in Ningbo, China, NHL International coordinates custom zinc and brass casting, nylon and metal zipper production, narrow-fabric weaving, and automated finishing lines.",
      "Direct factory oversight allows our merchandising engineers to verify plating thickness, nickel-free compliance, and Pantone dye-lot consistency before bulk cartons leave the port.",
    ],
    plinthImage: "/assets/home-factory.webp",
    plinthAlt: "NHL International garment trim production and finishing facility in Ningbo, China",
    loupeImage: "/assets/capabilities/dtm-matching.jpg",
    loupeAlt: "Dyed-to-match colour calibration against textile swatches",
    facts: ["FOB Ningbo Consolidation", "Custom Mold Development", "OEKO-TEX Annex VI Labs"],
    ctaLabel: "Manufacturing standards",
    ctaTo: "/#capabilities",
  },
  {
    id: "colombo",
    kicker: "Regional Office · Kotte, Colombo, Sri Lanka",
    headline: "On-ground merchandising for South Asian apparel makers.",
    paragraphs: [
      "Our Colombo regional office in Kotte places technical trim specialists directly beside Sri Lankan and South Asian garment manufacturers—turning tech packs into physical sample cards in days rather than weeks.",
      "From emergency colour lab dips to export documentation and consolidated air-sea schedules, our local team keeps cutting-room lines moving without interruption.",
    ],
    plinthImage: "/assets/story-details-matter.jpg",
    plinthAlt: "Curated trim swatch board prepared for garment factory merchandising teams",
    loupeImage: "/assets/garment-explorer-trims.jpg",
    loupeAlt: "Technical inspection of garment closures and drawcord hardware",
    facts: ["Kotte, Colombo Desk", "5–7 Day Sample Dispatch", "Direct Mill Support"],
    ctaLabel: "Contact Colombo desk",
    ctaTo: "/contact",
  },
];

export interface ArchShowcaseTrim {
  id: string;
  kicker: string;
  headline: string;
  description: string;
  slug: string;
  archImage: string;
  archAlt: string;
  circleImage: string;
  circleAlt: string;
  specCode: string;
  specMaterial: string;
  specRange: string;
  specOrigin: string;
}

export const ARCH_SHOWCASE_TRIMS: ArchShowcaseTrim[] = [
  {
    id: "zippers",
    kicker: "Collection 01 · Garment Closures",
    headline: "Engineered movement",
    description:
      "Brass #5/#8 open-end zippers, reverse-coil waterproof seals, and concealed seam spirals matched to your fabric Pantone and slider weight.",
    slug: "zippers-2",
    archImage: "/assets/trims/zippers.webp",
    archAlt: "NHL International polished metal and coil garment zippers",
    circleImage: "/assets/trims/zip-pullers.webp",
    circleAlt: "Custom TPU and machined zinc alloy zipper puller detail",
    specCode: "NHL-ZP #5 / #8",
    specMaterial: "Brass teeth & PU reverse-coil",
    specRange: "DTM tape · Auto-lock sliders",
    specOrigin: "Ningbo Production Line",
  },
  {
    id: "shank-denim",
    kicker: "Collection 02 · Denim Hardware",
    headline: "Built under tension",
    description:
      "Swivel-post denim shank buttons, fixed-post donut shanks, and burr rivets finished in antique brass, nickel, and matte gunmetal.",
    slug: "shank",
    archImage: "/assets/trims/shank.webp",
    archAlt: "Solid brass and cast zinc alloy denim shank buttons",
    circleImage: "/assets/trims/snap.webp",
    circleAlt: "Ring-spring heavy snap fastener cross section",
    specCode: "NHL-SH 14–22",
    specMaterial: "Solid brass & zinc alloy",
    specRange: "14 mm – 22 mm · Stone-wash safe",
    specOrigin: "Pull-Test Verified",
  },
  {
    id: "drawcords",
    kicker: "Collection 03 · Cords & Tipping",
    headline: "Refined terminations",
    description:
      "Tubular organic cotton drawcords and herringbone waist tapes tipped with laser-engraved metal aglets or matte silicone dips.",
    slug: "drawcords",
    archImage: "/assets/trims/drawcords.webp",
    archAlt: "Braided cotton hood drawcords with metal and silicone aglets",
    circleImage: "/assets/trims/toggles.webp",
    circleAlt: "Single-hole spring cord lock toggle detail",
    specCode: "NHL-DC 04–10",
    specMaterial: "Organic cotton & braided poly",
    specRange: "4 mm – 10 mm · Custom tipping",
    specOrigin: "OEKO-TEX Certified Dye",
  },
  {
    id: "buckles-hook",
    kicker: "Collection 04 · Waistband Hardware",
    headline: "Architectural fit",
    description:
      "Single-prong roller buckles, low-profile trouser hook-and-bar closures, and welded steel D-rings calibrated for cargo and tailored silhouettes.",
    slug: "buckles",
    archImage: "/assets/trims/buckles.webp",
    archAlt: "Cast zinc alloy roller buckles and cam waist adjusters",
    circleImage: "/assets/trims/hook-bar.webp",
    circleAlt: "Concealed four-part stamped brass trouser hook and bar",
    specCode: "NHL-BK 15–40",
    specMaterial: "Cast alloy & stamped steel",
    specRange: "15 mm – 40 mm · Electroplated",
    specOrigin: "Colombo & Ningbo Stock",
  },
];

export const CERT_METADATA = [
  { code: "CERT 01", standard: "Harmful Substance Screening", scope: "All plated metals & dyed tapes" },
  { code: "CERT 02", standard: "Chain Traceability", scope: "Eco-audited partner mills" },
  { code: "CERT 03", standard: "Annex IV / VI Limits", scope: "Skin-contact apparel & infantwear" },
];

export const WORK_STEP_DETAILS = [
  "CAD blueprints & lab-dip approvals in 5–7 days",
  "Dedicated molds, plating & yarn dyeing in Ningbo",
  "Pull-strength, wash-fastness & needle-detector checks",
  "Barcode cartons · Air & sea freight from Ningbo & Colombo",
];

export const CAPABILITY_SPECS = [
  { code: "LAB 01", metric: "Pneumatic & manual die calibration", standard: "Zero fabric tear tolerance" },
  { code: "LAB 02", metric: "ASTM D7142 / EN 17394 pull testing", standard: "70N–90N retention check" },
  { code: "LAB 03", metric: "D65 lightbox & Pantone TCX/TPG", standard: "Delta-E < 1.0 batch control" },
  { code: "LAB 04", metric: "AQL 2.5 multi-stage audit", standard: "100% lot traceability" },
  { code: "LAB 05", metric: "48h Colombo & Ningbo desk response", standard: "Replenishment guarantee" },
  { code: "LAB 06", metric: "Moisture-sealed export cartons", standard: "GS1 barcode & hangtag ready" },
];

export type GarmentZoneGroup =
  | "All"
  | "Hood & Collar"
  | "Front & Placket"
  | "Waist & Cargo"
  | "Cuffs & Hem"
  | "Packaging";

export interface TrimPlacementZone {
  slug: string;
  zoneTitle: string;
  group: Exclude<GarmentZoneGroup, "All">;
  x?: number;
  y?: number;
  isPackaging?: boolean;
}

export const TRIM_PLACEMENT_ZONES: TrimPlacementZone[] = [
  { slug: "beads", zoneTitle: "Collar cord decorative spacer bead", group: "Hood & Collar", x: 47.5, y: 19 },
  { slug: "belts", zoneTitle: "Integrated webbing trouser waistband belt", group: "Waist & Cargo", x: 66.5, y: 13 },
  { slug: "buckles", zoneTitle: "Quick-release tactical waist strap buckle", group: "Waist & Cargo", x: 82.5, y: 11.5 },
  { slug: "buttons", zoneTitle: "Four-hole matte & horn chest closures", group: "Front & Placket", x: 28, y: 36.5 },
  { slug: "d-rings", zoneTitle: "Collar utility D-ring hardware loop", group: "Hood & Collar", x: 43.5, y: 27 },
  { slug: "drawcords", zoneTitle: "Metal-tipped hood drawcord assembly", group: "Hood & Collar", x: 31, y: 18.5 },
  { slug: "elastic-items", zoneTitle: "High-recovery ribbed trouser ankle cuff", group: "Cuffs & Hem", x: 78, y: 94 },
  { slug: "grippers", zoneTitle: "Non-slip interior sleeve & cuff gripper", group: "Cuffs & Hem", x: 56.5, y: 73 },
  { slug: "hook-bar-2", zoneTitle: "Concealed metal trouser hook & bar fly closure", group: "Waist & Cargo", x: 71.5, y: 11 },
  { slug: "laces", zoneTitle: "Reinforced eyelet & storm cuff lacing", group: "Cuffs & Hem", x: 74.5, y: 84 },
  { slug: "loop-buttons", zoneTitle: "Elasticated loop & button placket detail", group: "Front & Placket", x: 34.5, y: 36.5 },
  { slug: "paper-bags", zoneTitle: "FSC export & boutique garment carrier packaging", group: "Packaging", isPackaging: true },
  { slug: "reflective-tape", zoneTitle: "High-visibility trouser & cuff reflective stripe", group: "Cuffs & Hem", x: 80.5, y: 42 },
  { slug: "shank", zoneTitle: "Cast brass center chest shank hardware", group: "Front & Placket", x: 31.2, y: 36.5 },
  { slug: "snap", zoneTitle: "Storm placket ring-spring snap stud", group: "Front & Placket", x: 33, y: 25 },
  { slug: "tapes-cords-2", zoneTitle: "Woven trim strip & technical pocket tape", group: "Waist & Cargo", x: 81, y: 39 },
  { slug: "toggles-2", zoneTitle: "Shock-cord hem adjuster spring toggle", group: "Cuffs & Hem", x: 22, y: 87.5 },
  { slug: "zip-pullers-2", zoneTitle: "Cord-and-metal pocket zip pulls", group: "Front & Placket", x: 44, y: 43.5 },
  { slug: "zippers-2", zoneTitle: "Full-length front storm coil zipper track", group: "Front & Placket", x: 40.5, y: 58 },
];

export interface OfficeLocation {
  id: "ningbo" | "colombo";
  pinNumber: string;
  role: string;
  title: string;
  shortName: string;
  address: string;
  capabilities: string;
  lat: number;
  lng: number;
  zoom: number;
  directionsUrl: string;
  phone?: string;
  email?: string;
}

export const OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    id: "ningbo",
    pinNumber: "01",
    role: "China Headquarters",
    title: "China Office — Ningbo Headquarters",
    shortName: "Ningbo, China",
    address:
      "Room 709, 4# Block, Oriental Business Center, No.456 Xingning Road, Ningbo, Zhejiang Province, China 315041",
    capabilities: "Custom Tooling · Alloy Casting · Dye-House · FOB Consolidation",
    lat: 29.8606,
    lng: 121.5648,
    zoom: 16,
    directionsUrl: "https://maps.app.goo.gl/NACnowEHe38JzGS76",
  },
  {
    id: "colombo",
    pinNumber: "02",
    role: "Regional Office",
    title: "NHL Regional Office — Kotte, Sri Lanka",
    shortName: "Kotte, Sri Lanka",
    address:
      "Paramount Tower, 3rd Floor, No 192/10, 9th Lane, Nawala Rd, Kotte, Sri Lanka 10107",
    capabilities: "Merchandising Desk · Lab Dips · 5–7 Day Sample Dispatch",
    lat: 6.8902,
    lng: 79.8907,
    zoom: 16,
    directionsUrl: "https://maps.app.goo.gl/kUH7g6pWoMWqBgMu6",
    phone: CONTACT_AND_FOOTER_COPY.phone,
    email: CONTACT_AND_FOOTER_COPY.email,
  },
];



