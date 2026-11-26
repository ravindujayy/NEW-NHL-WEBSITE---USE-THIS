export type Category = {
  name: string;
  slug: string;
  short: string;
  sourceIntro?: string;
  tone: string;
};

export const HERO_IMAGE = "/assets/aistudio/authentic_editorial_macro_photography_of_luxury_garment_hardware_and_apparel__1__074f9b4b.png";
export const HERO_VIDEO = "/assets/aistudio/Workers_inspecting_garment_manuf__0b924154_1080p_7527d848.mp4";
export const STORY_IMAGE = "/assets/story-atelier-knolling.png";
export const DETAIL_IMAGE = "/assets/detail-trims.jpg";
export const GARMENT_EXPLORER_IMAGE = "/assets/garment-explorer-trims.jpg";
export const GARMENT_OUTERWEAR_IMAGE = "/assets/garment-explorer-trims.jpg";
export const GARMENT_TAILORING_IMAGE = "/assets/story-trims.jpg";
export const GARMENT_BOTTOMS_IMAGE = "/assets/detail-trims.jpg";
export const STANDARD_100_LOGO = "/assets/trust-standard-100.png";
export const MADE_IN_GREEN_LOGO = "/assets/trust-made-in-green.png";
export const CONFIDENCE_IN_TEXTILES_LOGO = "/assets/trust-confidence-in-textiles.png";
export const CERT_STANDARD_100_LOGO = "/assets/cert-standard-100.png";
export const CERT_MADE_IN_GREEN_LOGO = "/assets/cert-made-in-green.png";
export const CERT_CONFIDENCE_IN_TEXTILES_LOGO = "/assets/cert-confidence-in-textiles.png";

export const categories: Category[] = [
  { name: "Beads", slug: "beads", short: "Decorative accents for expressive collections.", tone: "sand" },
  { name: "Belts", slug: "belts", short: "Structured belts and waistband components.", tone: "olive" },
  { name: "Buckles", slug: "buckles", short: "Hardware designed for secure, refined fastening.", tone: "steel" },
  { name: "Buttons", slug: "buttons", short: "Buttons for everyday essentials and elevated detail.", tone: "brass" },
  { name: "D Rings", slug: "d-rings", short: "Reliable D-ring hardware for straps and adjustability.", tone: "slate" },
  { name: "Drawcords", slug: "drawcords", short: "Functional cords for fit, movement and finish.", tone: "clay" },
  { name: "Elastic Items", slug: "elastic-items", short: "Stretch components built around garment performance.", tone: "rose" },
  { name: "Grippers", slug: "grippers", short: "Practical fastening pieces for dependable wear.", tone: "ink" },
  { name: "Hook & Bar", slug: "hook-bar-2", short: "Low-profile closure hardware for clean silhouettes.", tone: "graphite" },
  { name: "Laces", slug: "laces", short: "Flat, oval and round profiles for apparel and footwear.", tone: "linen" },
  { name: "Loop Buttons", slug: "loop-buttons", short: "Tailored loop-button details with a considered finish.", tone: "moss" },
  { name: "Paper Bags", slug: "paper-bags", short: "Packaging accessories that carry the collection through.", tone: "paper" },
  { name: "Reflective Tape", slug: "reflective-tape", short: "Visibility-focused trims for performance applications.", tone: "silver" },
  { name: "Shank", slug: "shank", short: "Shank-style components for dependable attachment.", tone: "rust" },
  { name: "Snap", slug: "snap", short: "Snap fasteners made for repeatable performance.", tone: "blue" },
  { name: "Tapes & Cords", slug: "tapes-cords-2", short: "Woven and braided components for utility and identity.", tone: "navy" },
  { name: "Toggles", slug: "toggles-2", short: "Adjustable toggle solutions for outerwear and activewear.", tone: "ochre" },
  { name: "Zip Pullers", slug: "zip-pullers-2", short: "Small details that give a zipper its final character.", tone: "plum" },
  { name: "Zippers", slug: "zippers-2", short: "Zippers for apparel, accessories and technical applications.", sourceIntro: "The current source page is labelled Zippers but carries a laces description. Zipper-specific copy is marked for confirmation.", tone: "charcoal" },
];

export const processSteps = [
  { number: "01", title: "Design & Development", body: "We review your requirements, artwork, and technical specifications to develop the ideal trim solution for your garment.", icon: "ruler" },
  { number: "02", title: "Tooling & Production", body: "Using advanced manufacturing processes, we produce trims with consistent quality, precision, and durability.", icon: "factory" },
  { number: "03", title: "Quality Assurance", body: "Every production batch undergoes strict inspections for dimensions, colour, finish, strength, and performance.", icon: "check" },
  { number: "04", title: "Packaging & Global Delivery", body: "Products are securely packed and shipped worldwide with complete export documentation and on-time delivery.", icon: "package" },
];

export const capabilities = [
  { title: "Button Attaching Machine", body: "Button attaching machines test and verify secure attachment to customer specifications.", icon: "settings" },
  { title: "Pull Test Machine", body: "Critical trims undergo pull strength testing for secure attachment, durability and compliance.", icon: "move" },
  { title: "DTM (Colour Matching)", body: "Dyed-to-Match colour development uses Pantone references and physical swatches.", icon: "palette" },
  { title: "Quality Inspection", body: "Quality is monitored from raw material inspection through final pre-shipment verification.", icon: "scan" },
  { title: "After-Sales Service", body: "Responsive support continues after shipment with prompt resolution of quality concerns.", icon: "heart" },
  { title: "Packaging", body: "Export-standard packing, labels, barcodes and cartons can be customized to requirements.", icon: "boxes" },
];

export const certifications = [
  { name: "Confidence in Textiles", image: CERT_CONFIDENCE_IN_TEXTILES_LOGO, body: "Verified under the Confidence in Textiles label, ensuring textile products are independently tested for harmful substances and meet internationally recognized safety and quality standards." },
  { name: "Made in Green", image: CERT_MADE_IN_GREEN_LOGO, body: "Certified under Made in Green, confirming products are manufactured in environmentally responsible facilities under socially responsible working conditions, with full supply chain traceability." },
  { name: "STANDARD 100 Certified", image: CERT_STANDARD_100_LOGO, body: "Certified to the STANDARD 100 standard, verifying that every component of the textile product has been tested for harmful substances and complies with strict international safety requirements." },
];

export const contact = {
  phone: "+94 77 578 1519",
  email: "sales@nhltrims.com",
  address: "4th Floor, No 192/10, 9th Lane, Nawala Road, Kotte, Colombo, Sri Lanka",
  whatsapp: "https://wa.me/+447748220601",
  maps: {
    ningbo: "https://maps.app.goo.gl/QEsgh9WEi1KKtVE39",
    colombo: "https://maps.app.goo.gl/dYt9D2TuvyCVXe1M91",
  },
  socials: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/nhlinternational/" },
    { id: "facebook", label: "Facebook", href: "https://www.facebook.com/nhlinternational/" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/nhl-international/" },
  ] as const,
};

export const getCategory = (slug: string) => categories.find((category) => category.slug === slug);
