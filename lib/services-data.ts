export interface Service {
  name: string;
  dur: string;
  price: number;
  detail?: string;
}

export interface ServiceCategory {
  name: string;
  tagline: string;
  image: string;
  alt: string;
  services: Service[];
}

export const BOOK_URL =
  "https://excellencebeautybarnj.as.me/schedule/9671e509";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    name: "Waxing",
    tagline: "Our signature. Smooth, head to toe.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop",
    alt: "Calm spa setting with towels and candles",
    services: [
      { name: "Brazilian Wax", dur: "30 min", price: 55, detail: "Bikini strip, top strip, lip strips and butt strip." },
      { name: "Full Bikini", dur: "30 min", price: 50, detail: "Bikini strip, top strip and upper thigh." },
      { name: "Bikini Line", dur: "15 to 20 min", price: 45 },
      { name: "Underarm", dur: "15 min", price: 20 },
      { name: "Full Leg", dur: "40 min", price: 80, detail: "Upper thigh through lower leg, knees included." },
      { name: "Upper Leg", dur: "20 min", price: 45 },
      { name: "Lower Leg", dur: "25 min", price: 45 },
      { name: "Full Stomach", dur: "20 min", price: 25 },
      { name: "Full Arms", dur: "30 min", price: 40, detail: "Shoulders, biceps, elbows, forearms and wrists." },
      { name: "Lower Arms", dur: "15 min", price: 30 },
      { name: "Full Back", dur: "30 min", price: 45 },
      { name: "Lower Back", dur: "15 min", price: 30 },
      { name: "Full Butt", dur: "15 min", price: 25 },
      { name: "Toes", dur: "15 min", price: 10 },
    ],
  },
  {
    name: "Facial Waxes",
    tagline: "Brows, lip and everything framing your face.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1600&auto=format&fit=crop",
    alt: "Woman relaxing during a facial treatment",
    services: [
      { name: "Eyebrow Package", dur: "25 min", price: 40, detail: "Eyebrow wax and tint, shade matched to your hair color." },
      { name: "Full Face", dur: "15 min", price: 55, detail: "Brows, lip, cheeks, sideburns, chin, forehead and nose." },
      { name: "Eyebrows", dur: "20 min", price: 10 },
      { name: "Upper Lip", dur: "15 min", price: 10 },
      { name: "Chin", dur: "15 min", price: 10 },
      { name: "Cheeks", dur: "15 min", price: 15 },
      { name: "Nose", dur: "15 min", price: 10 },
    ],
  },
  {
    name: "Lash Extensions",
    tagline: "Full volume. Zero effort.",
    image: "/lash-extensions.png",
    alt: "Close up of a client's full-volume lash extensions",
    services: [
      { name: "Classic Lash Set", dur: "3 hr", price: 70, detail: "One extension per natural lash. An everyday, mascara like finish." },
      { name: "Hybrid Lash Set", dur: "3 hr", price: 80, detail: "A blend of classic and volume for texture with fullness." },
      { name: "Volume Lash Set", dur: "3 hr", price: 90, detail: "Handmade fans for a full, fluffy statement lash." },
      { name: "Two Week Fill", dur: "2 hr 30 min", price: 55 },
      { name: "Three Week Fill", dur: "2 hr 30 min", price: 65 },
      { name: "Lash Removal", dur: "30 min", price: 25 },
    ],
  },
  {
    name: "Skin Care",
    tagline: "Vajacials and facials that keep ingrowns away.",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1600&auto=format&fit=crop",
    alt: "Beauty treatment in a calm salon setting",
    services: [
      { name: "Vajacial", dur: "30 min", price: 65, detail: "Exfoliation, cleanse, steam, extractions, customized hydro jelly mask, hot towel and moisturizer." },
      { name: "Juicy Booty Facial", dur: "1 hr", price: 55, detail: "The full facial treatment for the buttocks. Smooths, clears and hydrates." },
      { name: "Underarm Facial", dur: "1 hr", price: 40, detail: "Brightening and smoothing care for the underarm area." },
    ],
  },
  {
    name: "Makeup",
    tagline: "Flawless, glowing skin for any event.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1600&auto=format&fit=crop",
    alt: "Makeup brushes and palettes arranged on a table",
    services: [
      { name: "Natural Glam", dur: "1 hr", price: 70, detail: "Neutral or bold shadow without false lashes. A flawless, glowing natural look." },
      { name: "Full Glam", dur: "1 hr", price: 80, detail: "Neutral or bold shadow with false lashes. The full red carpet finish." },
    ],
  },
  {
    name: "Men's Services",
    tagline: "Clean, simple grooming for him.",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1600&auto=format&fit=crop",
    alt: "Man receiving a grooming treatment",
    services: [
      { name: "Full Face", dur: "30 min", price: 50 },
      { name: "Full Back", dur: "30 min", price: 55 },
      { name: "Full Chest", dur: "30 min", price: 50 },
      { name: "Full Arm", dur: "30 min", price: 45 },
      { name: "Lower Arm", dur: "30 min", price: 30 },
      { name: "Full Leg", dur: "30 min", price: 80 },
      { name: "Eyebrows", dur: "15 min", price: 15 },
      { name: "Nose", dur: "15 min", price: 15 },
      { name: "Ears", dur: "15 min", price: 20 },
      { name: "Underarm", dur: "15 min", price: 20 },
    ],
  },
  {
    name: "Packages",
    tagline: "Made to be shared, or savored solo.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1600&auto=format&fit=crop",
    alt: "Relaxing spa treatment in progress",
    services: [
      { name: "Strawberry Package", dur: "1 hr 30 min", price: 120, detail: "Strawberry inspired luxury vajacial with serums, cream mask and hydro jelly finish." },
      { name: "Excellence Package", dur: "50 min", price: 100, detail: "Brazilian wax plus a 30 minute vajacial." },
      { name: "Bestie Package (for two)", dur: "1 hr", price: 100, detail: "Back to back Brazilians for you and your bestie." },
      { name: "Trio Package (for three)", dur: "1 hr 30 min", price: 150, detail: "Brazilians for three friends, booked together." },
      { name: "Full Body Package", dur: "1 hr 30 min", price: 300, detail: "Full face, underarms, arms, back, stomach, Brazilian, butt and full legs." },
      { name: "Juicy Booty Package", dur: "45 min", price: 100, detail: "Butt wax plus a 30 minute booty facial." },
      { name: "Underarm Glow Package", dur: "45 min", price: 50, detail: "Underarm wax plus a 30 minute underarm facial." },
    ],
  },
];
