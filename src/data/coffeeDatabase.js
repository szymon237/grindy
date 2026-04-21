// Grindy — Deutsche Specialty Coffee Datenbank
// Echte Röstereien mit plausiblen Bohnen-Daten

export const FLAVOR_NOTES = [
  'Schokolade', 'Beeren', 'Nuss', 'Zitrus', 'Blumen',
  'Karamell', 'Tropenfrüchte', 'Gewürze', 'Honig', 'Steinobst',
  'Vanille', 'Toffee', 'Jasmin', 'Hibiskus', 'Mandel',
  'Brombeere', 'Blaubeere', 'Orange', 'Aprikose', 'Erdbeere',
];

// Hick's Law: max 6 initially visible, rest via "Mehr anzeigen"
export const INITIAL_VISIBLE_TAGS = 6;

// Niche Zero: stepless 0–50 dial
export const GRINDER = {
  name: 'Niche Zero',
  min: 0,
  max: 50,
  step: 0.5, // stepless, but 0.5 increments are practical
};

// Roastery brand colors — sourced from each roastery's website CSS/branding
export const ROASTERY_COLORS = {
  'The Barn':              '#A67C52', // warm bronze — thebarn.de --color-button
  'Bonanza Coffee':        '#293E3A', // deep forest green — bonanzacoffee.de --color-button
  'Five Elephant':         '#AB8C52', // warm gold — fiveelephant.com --COLOR-PRIMARY
  'Father Carpenter':      '#2A3E6F', // navy blue — fathercarpenter.com --color-primary-accent
  'Röststätte':            '#4A6741', // sage green — roeststaette.de
  'Coffee Circle':         '#0F59A6', // medium blue — coffeecircle.com --mantine-color-cta-6
  '19grams':               '#20124D', // deep purple — 19grams.coffee --leat-primary-color
  'Flying Roasters':       '#E63946', // red — flyingroasters.de
  'Elbgold':               '#C9A84C', // gold — elbgold.com (name = "Elbe Gold")
  'Public Coffee Roasters':'#32373C', // dark charcoal — publiccoffeeroasters.com
  'Nord Coast Coffee':     '#1B4965', // maritime blue — nordcoast.coffee
  'Quijote Kaffee':        '#008490', // teal — quijote-kaffee.de
  'SCHVARZ':               '#EF963F', // warm amber — schvarz.com --accent
  'RVTC':                  '#8B2252', // burgundy — rvtc.de
  'Carl Ferdinand':        '#5B7553', // olive green — carlferdinand.de
  'Röstzeit':              '#8B6914', // dark gold — roestzeit.de
  'Hoppenworth & Ploch':   '#2C5F2D', // forest green — hoppenworth-ploch.de
  'Machhorndl':            '#C17817', // amber — machhorndl.de
  'Heilandt':              '#ED6D05', // vibrant orange — heilandt.de --color-button
  'Martermühle':           '#012B6A', // deep blue — martermuehle.de --color-base-accent
  'Supremo':               '#6B3A2A', // warm brown — supremo.de
  'Cross Coffee':          '#C3A759', // warm gold — crosscoffee.de
};

// ── Roastery & Café Locations ─────────────────
// Coordinates for map-based discovery. Focused on Düsseldorf + other cities.
// Each entry: { name, city, address, lat, lng, type: 'roastery'|'cafe', sellsBeans }

export const LOCATIONS = [
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Röstereien
  // ══════════════════════════════════════════════
  { name: 'SCHVARZ', city: 'Düsseldorf', address: 'Ronsdorfer Str. 74, Flingern', lat: 51.2192, lng: 6.8236, type: 'roastery', sellsBeans: true },
  { name: 'RVTC', city: 'Düsseldorf', address: 'Wallstraße 10, Altstadt', lat: 51.2246, lng: 6.7736, type: 'roastery', sellsBeans: true },
  { name: 'Carl Ferdinand', city: 'Düsseldorf', address: 'Düsselthaler Str. 39, Pempelfort', lat: 51.2335, lng: 6.7925, type: 'roastery', sellsBeans: true },
  { name: 'Röstzeit', city: 'Düsseldorf', address: 'Oststraße 115, Stadtmitte', lat: 51.2219, lng: 6.7856, type: 'roastery', sellsBeans: true },
  { name: 'BREW Specialty Coffee', city: 'Düsseldorf', address: 'Bilker Allee 53, Bilk', lat: 51.2108, lng: 6.7678, type: 'roastery', sellsBeans: true },
  { name: 'Lightroast Coffee', city: 'Düsseldorf', address: 'Hoffeldstr. 104, Flingern Süd', lat: 51.2265, lng: 6.8170, type: 'roastery', sellsBeans: true },
  { name: 'Fjaka Café & Rösterei', city: 'Düsseldorf', address: 'Ackerstr. 204, Flingern', lat: 51.2318, lng: 6.8119, type: 'roastery', sellsBeans: true },
  { name: 'Die Röstmeister', city: 'Düsseldorf', address: 'Quirinstr. 1a, Oberkassel', lat: 51.2318, lng: 6.7482, type: 'roastery', sellsBeans: true },
  { name: 'Kaffeeschmiede', city: 'Düsseldorf', address: 'Belsenstr. 11, Oberkassel', lat: 51.2305, lng: 6.7463, type: 'roastery', sellsBeans: true },
  { name: 'Das Coffe Roastery', city: 'Düsseldorf', address: 'Wiesenstr. 32, Heerdt', lat: 51.2294, lng: 6.7094, type: 'roastery', sellsBeans: true },
  { name: 'Rivercoffee', city: 'Düsseldorf', address: 'Am Kreuzberg 8, Kaiserswerth', lat: 51.3014, lng: 6.7407, type: 'roastery', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Altstadt / Carlstadt / Stadtmitte
  // ══════════════════════════════════════════════
  { name: 'Woyton', city: 'Düsseldorf', address: 'Friedrichstr. 20, Carlstadt', lat: 51.2168, lng: 6.7771, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Unterbilk
  // ══════════════════════════════════════════════
  { name: 'Weird Space Cafe', city: 'Düsseldorf', address: 'Volmerswerther Str. 53, Unterbilk', lat: 51.2083, lng: 6.7607, type: 'cafe', sellsBeans: true },
  { name: 'Mercy Coffee Unterbilk', city: 'Düsseldorf', address: 'Neusser Str. 121, Unterbilk', lat: 51.2123, lng: 6.7634, type: 'cafe', sellsBeans: true },
  { name: 'Caffe Ma', city: 'Düsseldorf', address: 'Bilker Allee 38, Unterbilk', lat: 51.2112, lng: 6.7662, type: 'cafe', sellsBeans: false },
  { name: 'Covent Garden Coffee', city: 'Düsseldorf', address: 'Bilker Allee 126, Unterbilk', lat: 51.2108, lng: 6.7742, type: 'cafe', sellsBeans: true },
  { name: 'Café Reme', city: 'Düsseldorf', address: 'Kronprinzenstr. 97, Unterbilk', lat: 51.2114, lng: 6.7696, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Bilk
  // ══════════════════════════════════════════════
  { name: 'Röstzeit Café', city: 'Düsseldorf', address: 'Moorenstr. 68, Bilk', lat: 51.1991, lng: 6.7884, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Hafen / Medienhafen
  // ══════════════════════════════════════════════
  { name: 'Carl Ferdinand Kaffeebar', city: 'Düsseldorf', address: 'Wupperstr. 3, Hafen', lat: 51.2149, lng: 6.7573, type: 'cafe', sellsBeans: true },
  { name: 'Greger Café', city: 'Düsseldorf', address: 'Erftstr. 1, Hafen', lat: 51.2140, lng: 6.7560, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Friedrichstadt
  // ══════════════════════════════════════════════
  { name: 'Weird Space Friedrichstadt', city: 'Düsseldorf', address: 'Hüttenstr. 76, Friedrichstadt', lat: 51.2151, lng: 6.7867, type: 'cafe', sellsBeans: true },
  { name: 'Café Stoak', city: 'Düsseldorf', address: 'Adersstr. 48, Friedrichstadt', lat: 51.2181, lng: 6.7830, type: 'cafe', sellsBeans: true },
  { name: 'Espresso Perfetto', city: 'Düsseldorf', address: 'Bilker Allee 224, Friedrichstadt', lat: 51.2111, lng: 6.7820, type: 'cafe', sellsBeans: true },
  { name: 'Lina\'s Coffee', city: 'Düsseldorf', address: 'Fürstenplatz 1, Friedrichstadt', lat: 51.2141, lng: 6.7849, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Flingern Nord
  // ══════════════════════════════════════════════
  { name: 'Jaenner Modern Coffee', city: 'Düsseldorf', address: 'Ackerstr. 80, Flingern Nord', lat: 51.2273, lng: 6.8004, type: 'cafe', sellsBeans: true },
  { name: 'Kaffeehandwerk', city: 'Düsseldorf', address: 'Birkenstr. 127, Flingern Nord', lat: 51.2269, lng: 6.8091, type: 'cafe', sellsBeans: true },
  { name: 'Mercy Coffee Flingern', city: 'Düsseldorf', address: 'Birkenstr. 73, Flingern Nord', lat: 51.2268, lng: 6.8045, type: 'cafe', sellsBeans: true },
  { name: 'Bulle Bistro', city: 'Düsseldorf', address: 'Birkenstr. 47a, Flingern Nord', lat: 51.2266, lng: 6.8031, type: 'cafe', sellsBeans: true },
  { name: 'Kausal Café', city: 'Düsseldorf', address: 'Flurstr. 1, Flingern Nord', lat: 51.2274, lng: 6.8122, type: 'cafe', sellsBeans: false },
  { name: 'Café Hüftgold', city: 'Düsseldorf', address: 'Ackerstr. 113, Flingern Nord', lat: 51.2286, lng: 6.8038, type: 'cafe', sellsBeans: false },
  { name: 'Café Liebe', city: 'Düsseldorf', address: 'Platanenstr. 22, Flingern Nord', lat: 51.2282, lng: 6.8103, type: 'cafe', sellsBeans: false },
  { name: 'Oma Erika', city: 'Düsseldorf', address: 'Hermannstr. 34b, Flingern Nord', lat: 51.2291, lng: 6.8082, type: 'cafe', sellsBeans: false },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Flingern Süd
  // ══════════════════════════════════════════════
  { name: 'Coffee-Bar', city: 'Düsseldorf', address: 'Flurstr. 38, Flingern Süd', lat: 51.2286, lng: 6.8143, type: 'cafe', sellsBeans: false },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Oberbilk
  // ══════════════════════════════════════════════
  { name: 'Genussstation x Marny\'s', city: 'Düsseldorf', address: 'Ellerstr. 219, Oberbilk', lat: 51.2131, lng: 6.8059, type: 'cafe', sellsBeans: false },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Eller
  // ══════════════════════════════════════════════
  { name: 'Düssel Café', city: 'Düsseldorf', address: 'Gumbertstr. 190, Eller', lat: 51.1992, lng: 6.8443, type: 'cafe', sellsBeans: false },
  { name: 'Caffè Ma', city: 'Düsseldorf', address: 'Gumbertstr. 118, Eller', lat: 51.2015, lng: 6.8371, type: 'cafe', sellsBeans: false },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Gerresheim
  // ══════════════════════════════════════════════
  { name: 'Orange Finest Coffee', city: 'Düsseldorf', address: 'Neusser Tor 17A, Gerresheim', lat: 51.2371, lng: 6.8605, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Oberkassel / Niederkassel
  // ══════════════════════════════════════════════
  { name: 'Copenhagen Coffee Lab', city: 'Düsseldorf', address: 'Luegallee 136, Oberkassel', lat: 51.2320, lng: 6.7475, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Heerdt
  // ══════════════════════════════════════════════
  { name: 'Café Freund', city: 'Düsseldorf', address: 'Viersener Str. 34, Heerdt', lat: 51.2362, lng: 6.7294, type: 'cafe', sellsBeans: false },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Benrath
  // ══════════════════════════════════════════════
  { name: 'Röstzeit Benrath', city: 'Düsseldorf', address: 'Börchemstr. 38, Benrath', lat: 51.1650, lng: 6.8738, type: 'roastery', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Wersten
  // ══════════════════════════════════════════════
  { name: 'Café Südpark', city: 'Düsseldorf', address: 'In den Großen Banden 58, Wersten', lat: 51.1976, lng: 6.8031, type: 'cafe', sellsBeans: false },
  // ══════════════════════════════════════════════
  // ANDERE STÄDTE
  // ══════════════════════════════════════════════
  // ── Berlin ──
  { name: 'The Barn', city: 'Berlin', address: 'Schönhauser Allee 8, Mitte', lat: 52.5298, lng: 13.4107, type: 'roastery', sellsBeans: true },
  { name: 'Bonanza Coffee', city: 'Berlin', address: 'Adalbertstr. 70, Kreuzberg', lat: 52.5042, lng: 13.4203, type: 'roastery', sellsBeans: true },
  { name: 'Five Elephant', city: 'Berlin', address: 'Reichenberger Str. 101, Kreuzberg', lat: 52.4934, lng: 13.4383, type: 'roastery', sellsBeans: true },
  { name: '19grams', city: 'Berlin', address: 'Karl-Liebknecht-Str. 13, Mitte', lat: 52.5223, lng: 13.4077, type: 'roastery', sellsBeans: true },
  // ── Hamburg ──
  { name: 'Elbgold', city: 'Hamburg', address: 'Lagerstr. 34c, Schanzenviertel', lat: 53.5632, lng: 9.9669, type: 'roastery', sellsBeans: true },
  { name: 'Public Coffee Roasters', city: 'Hamburg', address: 'Goldbekplatz 1, Winterhude', lat: 53.5837, lng: 10.0089, type: 'roastery', sellsBeans: true },
  // ── Weitere ──
  { name: 'Hoppenworth & Ploch', city: 'Frankfurt', address: 'Friedberger Landstr. 86, Nordend', lat: 50.1248, lng: 8.6920, type: 'roastery', sellsBeans: true },
  { name: 'Heilandt', city: 'Köln', address: 'Bismarckstr. 41, Belgisches Viertel', lat: 50.9408, lng: 6.9345, type: 'roastery', sellsBeans: true },
];

// Haversine distance in meters
export function distanceBetween(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Bearing in degrees (0=N, 90=E, 180=S, 270=W)
export function bearingBetween(lat1, lng1, lat2, lng2) {
  const toRad = d => d * Math.PI / 180;
  const toDeg = r => r * 180 / Math.PI;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Drink types — Rocket Appartamento + Niche Zero
// Single: 11g bottomless | Double: 18g spouted | Café Crème: 16g
export const DRINK_TYPES = [
  {
    id: 'single',
    label: 'Single Shot',
    emoji: '☕',
    defaults: { grind: 12, dose: 11, yield: 24, time: 24 },
    grindRange: [6, 20],
  },
  {
    id: 'double',
    label: 'Double Shot',
    emoji: '☕☕',
    defaults: { grind: 13, dose: 18, yield: 40, time: 24 },
    grindRange: [7, 22],
  },
  {
    id: 'cafe-creme',
    label: 'Café Crème',
    emoji: '🫗',
    defaults: { grind: 23, dose: 16, yield: 120, time: 26 },
    grindRange: [18, 32],
  },
];

export const ROAST_LEVELS = [
  { id: 'light', label: 'Hell', color: '#D4A76A' },
  { id: 'light-medium', label: 'Hell-Mittel', color: '#B87333' },
  { id: 'medium', label: 'Mittel', color: '#8B5E3C' },
  { id: 'medium-dark', label: 'Mittel-Dunkel', color: '#5C3A2E' },
  { id: 'dark', label: 'Dunkel', color: '#2C1810' },
];

export const PROCESSING_METHODS = [
  { id: 'washed', label: 'Washed' },
  { id: 'natural', label: 'Natural' },
  { id: 'honey', label: 'Honey' },
  { id: 'anaerobic', label: 'Anaerob' },
];

// Country flag emoji helper
export const COUNTRY_FLAGS = {
  'Äthiopien': '🇪🇹',
  'Kolumbien': '🇨🇴',
  'Kenia': '🇰🇪',
  'Brasilien': '🇧🇷',
  'Guatemala': '🇬🇹',
  'Costa Rica': '🇨🇷',
  'Peru': '🇵🇪',
  'Honduras': '🇭🇳',
  'Ruanda': '🇷🇼',
  'El Salvador': '🇸🇻',
  'Indonesien': '🇮🇩',
  'Mexiko': '🇲🇽',
  'Uganda': '🇺🇬',
  'Tansania': '🇹🇿',
  'Panama': '🇵🇦',
  'Myanmar': '🇲🇲',
  'Indien': '🇮🇳',
  'Nicaragua': '🇳🇮',
  'Malawi': '🇲🇼',
  'Jemen': '🇾🇪',
};

let beanId = 1;
const b = (roastery, roasteryCity, name, origin, region, processing, roast, variety, altitude, flavorNotes) => ({
  id: beanId++,
  roastery,
  roasteryCity,
  name,
  origin,
  region,
  processing,
  roast,
  variety,
  altitude,
  flavorNotes,
});

export const COFFEE_DATABASE = [
  // ── Berlin ───────────────────────────────────────

  // The Barn — Roaster of the Year 2025
  b('The Barn', 'Berlin', 'Nano Challa', 'Äthiopien', 'Jimma', 'washed', 'light', 'Heirloom', '1900-2100m', ['Steinobst', 'Vanille', 'Jasmin']),
  b('The Barn', 'Berlin', 'El Vergel', 'Kolumbien', 'Tolima', 'washed', 'light', 'Castillo', '1800m', ['Karamell', 'Tropenfrüchte', 'Schokolade']),
  b('The Barn', 'Berlin', 'Daye Bensa', 'Äthiopien', 'Sidamo', 'natural', 'light', 'Heirloom', '2000m', ['Blaubeere', 'Erdbeere', 'Schokolade']),

  // Bonanza Coffee
  b('Bonanza Coffee', 'Berlin', 'Bonanza Blend', 'Brasilien', 'Cerrado', 'natural', 'medium', 'Yellow Bourbon', '1100m', ['Schokolade', 'Beeren', 'Karamell']),
  b('Bonanza Coffee', 'Berlin', 'Das Almas', 'Brasilien', 'Cerrado', 'natural', 'light-medium', 'Yellow Bourbon', '1100m', ['Karamell', 'Beeren', 'Schokolade']),
  b('Bonanza Coffee', 'Berlin', 'Gitesi', 'Ruanda', 'Nyamasheke', 'washed', 'light', 'Red Bourbon', '1800m', ['Beeren', 'Zitrus', 'Honig']),

  // Five Elephant — Kreuzberg
  b('Five Elephant', 'Berlin', 'Serra Dos Ciganos', 'Brasilien', 'Caconde', 'natural', 'medium', 'Bourbon', '1200m', ['Schokolade', 'Nuss', 'Karamell']),
  b('Five Elephant', 'Berlin', 'House Espresso', 'Kolumbien', 'Huila', 'washed', 'light-medium', 'Caturra', '1700m', ['Schokolade', 'Steinobst', 'Honig']),

  // Father Carpenter — Münzstraße
  b('Father Carpenter', 'Berlin', 'Finca Santa Elisa', 'Panama', 'Chiriquí', 'washed', 'light', 'Geisha', '1800m', ['Jasmin', 'Tropenfrüchte', 'Zitrus']),
  b('Father Carpenter', 'Berlin', 'Finca Montreal', 'Kolumbien', 'Huila', 'washed', 'light', 'Caturra', '1800m', ['Karamell', 'Steinobst', 'Orange']),

  // Röststätte — Spezialitätenkaffee & Baristakurse
  b('Röststätte', 'Berlin', 'Novum', 'Äthiopien', 'Sidamo', 'washed', 'light-medium', 'Heirloom', '1900m', ['Beeren', 'Schokolade', 'Zitrus']),
  b('Röststätte', 'Berlin', 'Gakuyu AA', 'Kenia', 'Kirinyaga', 'washed', 'light', 'SL28', '1800m', ['Brombeere', 'Zitrus', 'Mandel']),
  b('Röststätte', 'Berlin', 'Gesha Anaerobic', 'Kolumbien', 'Huila', 'anaerobic', 'light', 'Gesha', '1800m', ['Jasmin', 'Tropenfrüchte', 'Zitrus']),

  // Coffee Circle — Direct Trade & Social Impact
  b('Coffee Circle', 'Berlin', 'Buna Dimaa', 'Äthiopien', 'Sidamo', 'natural', 'medium-dark', 'Heirloom', '1900m', ['Schokolade', 'Nuss', 'Karamell']),
  b('Coffee Circle', 'Berlin', 'Limu', 'Äthiopien', 'Limu', 'washed', 'medium', 'Heirloom', '1900m', ['Beeren', 'Schokolade', 'Blumen']),
  b('Coffee Circle', 'Berlin', 'Yirgacheffe', 'Äthiopien', 'Yirgacheffe', 'natural', 'medium', 'Heirloom', '1900m', ['Vanille', 'Beeren', 'Blumen']),

  // 19grams — Specialty Coffee seit 2002
  b('19grams', 'Berlin', 'Wild At Heart', 'Brasilien', 'Sul de Minas', 'natural', 'medium', 'Yellow Bourbon', '1150m', ['Schokolade', 'Nuss', 'Karamell']),
  b('19grams', 'Berlin', 'Little Flower', 'Äthiopien', 'Guji', 'natural', 'light', 'Heirloom', '2000m', ['Blumen', 'Beeren', 'Zitrus']),
  b('19grams', 'Berlin', 'Berlinkaffee', 'Kolumbien', 'Cauca', 'washed', 'light-medium', 'Pink Bourbon', '1850m', ['Beeren', 'Tropenfrüchte', 'Karamell']),

  // Flying Roasters — Vogelwelt-Benennungen
  b('Flying Roasters', 'Berlin', 'Nightingale', 'Brasilien', 'Cerrado', 'natural', 'medium-dark', 'Mundo Novo', '1000m', ['Schokolade', 'Nuss', 'Karamell']),
  b('Flying Roasters', 'Berlin', 'Blackcap', 'Kolumbien', 'Huila', 'washed', 'medium', 'Caturra', '1700m', ['Nuss', 'Schokolade', 'Karamell']),
  b('Flying Roasters', 'Berlin', 'Fire Finch', 'Äthiopien', 'Sidamo', 'natural', 'light', 'Heirloom', '1950m', ['Erdbeere', 'Schokolade', 'Beeren']),

  // ── Hamburg ──────────────────────────────────────

  // Elbgold — Specialty Coffee seit 2004
  b('Elbgold', 'Hamburg', 'Neunbar', 'Brasilien', 'Cerrado', 'natural', 'medium', 'Yellow Bourbon', '1100m', ['Schokolade', 'Nuss', 'Karamell']),
  b('Elbgold', 'Hamburg', 'Sechs A', 'El Salvador', 'Santa Ana', 'washed', 'light-medium', 'Red Bourbon', '1500m', ['Karamell', 'Steinobst', 'Beeren']),
  b('Elbgold', 'Hamburg', 'Bombe', 'Äthiopien', 'Sidamo', 'natural', 'light', 'Heirloom', '1900m', ['Blaubeere', 'Erdbeere', 'Blumen']),

  // Public Coffee Roasters
  b('Public Coffee Roasters', 'Hamburg', 'Moonlight', 'Kolumbien', 'Nariño', 'washed', 'medium', 'Castillo', '1900m', ['Schokolade', 'Karamell', 'Nuss']),
  b('Public Coffee Roasters', 'Hamburg', 'Black Pearl', 'Brasilien', 'Sul de Minas', 'natural', 'medium-dark', 'Yellow Bourbon', '1200m', ['Schokolade', 'Nuss', 'Toffee']),

  // Nord Coast Coffee — Deichstraße am Nikolaifleet
  b('Nord Coast Coffee', 'Hamburg', 'Black Opium', 'Brasilien', 'Cerrado', 'natural', 'medium-dark', 'Mundo Novo', '1000m', ['Schokolade', 'Nuss', 'Gewürze']),
  b('Nord Coast Coffee', 'Hamburg', 'Guatemala Las Capuchinas', 'Guatemala', 'Antigua', 'washed', 'light-medium', 'Bourbon', '1500m', ['Schokolade', 'Steinobst', 'Honig']),

  // Quijote Kaffee — Direktimport-Rösterei
  b('Quijote Kaffee', 'Hamburg', 'Porcellinchen', 'Brasilien', 'Cerrado', 'natural', 'medium-dark', 'Mundo Novo', '1000m', ['Schokolade', 'Gewürze', 'Nuss']),
  b('Quijote Kaffee', 'Hamburg', 'Flying Pingo', 'Peru', 'Cajamarca', 'washed', 'light', 'Typica', '1700m', ['Zitrus', 'Beeren', 'Tropenfrüchte']),
  b('Quijote Kaffee', 'Hamburg', 'Hanni das Honighörnchen', 'Honduras', 'Marcala', 'honey', 'light', 'Catuaí', '1500m', ['Tropenfrüchte', 'Steinobst', 'Honig']),

  // ── Düsseldorf ───────────────────────────────────

  // SCHVARZ — Mikrorösterei Alte Farbwerke, Flingern
  // Espresso
  b('SCHVARZ', 'Düsseldorf', 'VRN', 'Brasilien', 'Blend', 'natural', 'medium', 'Catuai', '750-1000m', ['Schokolade', 'Nuss', 'Karamell']),
  b('SCHVARZ', 'Düsseldorf', 'FLR', 'Brasilien', 'Blend', 'natural', 'medium-dark', 'Catuai', '750-1000m', ['Schokolade', 'Gewürze', 'Nuss']),
  b('SCHVARZ', 'Düsseldorf', 'Chocolate Blend', 'Brasilien', 'Blend', 'natural', 'medium', 'Catuai', '750-1500m', ['Schokolade', 'Mandel', 'Karamell']),
  b('SCHVARZ', 'Düsseldorf', 'LAX', 'Brasilien', 'Blend', 'natural', 'light', 'Mixed', '1000-1900m', ['Zitrus', 'Tropenfrüchte', 'Honig']),
  b('SCHVARZ', 'Düsseldorf', 'MXP', 'Brasilien', 'Blend', 'natural', 'medium-dark', 'Yellow Bourbon PB', '750-1200m', ['Gewürze', 'Schokolade', 'Nuss']),
  b('SCHVARZ', 'Düsseldorf', 'Nicaragua El Limoncillo', 'Nicaragua', 'Matagalpa', 'washed', 'medium-dark', 'Red Catuai', '850-1200m', ['Schokolade', 'Nuss', 'Karamell']),
  b('SCHVARZ', 'Düsseldorf', 'Brasilien Paubrasilia', 'Brasilien', 'Cerrado Mineiro', 'natural', 'medium', 'Catuai', '750-1000m', ['Mandel', 'Schokolade', 'Karamell']),
  b('SCHVARZ', 'Düsseldorf', 'Kolumbien Decaf', 'Kolumbien', 'Huila', 'washed', 'medium', 'Caturra', '1700m', ['Schokolade', 'Karamell', 'Nuss']),
  // Filter
  b('SCHVARZ', 'Düsseldorf', 'DUS', 'Brasilien', 'Blend', 'natural', 'light-medium', 'Yellow Bourbon', '1100-1450m', ['Nuss', 'Schokolade', 'Karamell']),
  b('SCHVARZ', 'Düsseldorf', 'Ruanda Huye Mountain', 'Ruanda', 'Huye', 'washed', 'medium', 'Red Bourbon', '1800-2200m', ['Orange', 'Honig', 'Tropenfrüchte']),
  b('SCHVARZ', 'Düsseldorf', 'Äthiopien Sawana', 'Äthiopien', 'Guji', 'washed', 'light', 'Heirloom', '1920-2150m', ['Jasmin', 'Tropenfrüchte', 'Honig']),
  b('SCHVARZ', 'Düsseldorf', 'Costa Rica Java', 'Costa Rica', 'Pérez Zeledón', 'natural', 'light-medium', 'Java', '1300-1700m', ['Schokolade', 'Beeren', 'Karamell']),

  // RVTC — Rösterei Vier The Commonage, Altstadt
  // Blends (original 3 first — IDs müssen stabil bleiben für bestehende Collections)
  b('RVTC', 'Düsseldorf', 'Italo Pop', 'Tansania', 'Blend', 'washed', 'dark', 'Bourbon', '1500m', ['Gewürze', 'Schokolade', 'Nuss']),
  b('RVTC', 'Düsseldorf', 'Garage House', 'Kolumbien', 'Blend', 'washed', 'medium', 'Caturra', '1700m', ['Nuss', 'Karamell', 'Schokolade']),
  b('RVTC', 'Düsseldorf', 'Jungle Boogie', 'Äthiopien', 'Blend', 'natural', 'medium', 'Heirloom', '2000m', ['Beeren', 'Gewürze', 'Tropenfrüchte']),
  // Weitere Blends
  b('RVTC', 'Düsseldorf', 'Desert Rose', 'Jemen', 'Blend', 'natural', 'dark', 'Mocca Sanani', '2000m', ['Schokolade', 'Nuss', 'Gewürze']),
  b('RVTC', 'Düsseldorf', 'Bulle Blend', 'Tansania', 'Blend', 'washed', 'dark', 'Bourbon', '1500m', ['Schokolade', 'Gewürze', 'Beeren']),
  b('RVTC', 'Düsseldorf', 'The Commonage', 'Malawi', 'Ntchisi', 'washed', 'dark', 'Catimor', '1400m', ['Schokolade', 'Nuss', 'Karamell']),
  // Single Origins
  b('RVTC', 'Düsseldorf', 'Antonio Alvarado', 'Costa Rica', 'Pérez Zeledón', 'natural', 'light', 'Milenio', '1500m', ['Beeren', 'Karamell', 'Tropenfrüchte']),
  b('RVTC', 'Düsseldorf', 'Gara Kogne', 'Äthiopien', 'West Arsi', 'washed', 'light-medium', 'Heirloom', '2000m', ['Blumen', 'Zitrus', 'Honig']),
  b('RVTC', 'Düsseldorf', 'Mundayo AASH', 'Äthiopien', 'West Arsi', 'natural', 'medium', 'Heirloom', '2000m', ['Brombeere', 'Aprikose', 'Gewürze']),
  b('RVTC', 'Düsseldorf', 'El Congo', 'Costa Rica', 'Tarrazu', 'honey', 'medium', 'Typica', '1900m', ['Karamell', 'Steinobst', 'Mandel']),
  b('RVTC', 'Düsseldorf', 'Vanessa Moreno', 'Brasilien', 'Alta Mogiana', 'natural', 'medium', 'Yellow Bourbon', '1040m', ['Schokolade', 'Nuss', 'Vanille']),
  // Decaf
  b('RVTC', 'Düsseldorf', 'Italo Pop Decaf', 'Kolumbien', 'Blend', 'washed', 'dark', 'Caturra', '1700m', ['Schokolade', 'Gewürze', 'Nuss']),
  b('RVTC', 'Düsseldorf', 'Pink Bourbon Decaf', 'Kolumbien', 'Acevedo, Huila', 'anaerobic', 'medium', 'Pink Bourbon', '1750m', ['Gewürze', 'Blumen', 'Orange']),
  b('RVTC', 'Düsseldorf', 'Dimtu Tora Guji Decaf', 'Äthiopien', 'Guji', 'natural', 'medium', 'Heirloom', '1900-2300m', ['Beeren', 'Schokolade', 'Zitrus']),
  b('RVTC', 'Düsseldorf', 'Carbonic Natural Decaf', 'Kolumbien', 'Sierra Nevada', 'natural', 'dark', 'Caturra', '1600m', ['Schokolade', 'Karamell', 'Gewürze']),

  // Carl Ferdinand — Röstfabrik Pempelfort, Winde-der-See Blends
  b('Carl Ferdinand', 'Düsseldorf', 'Levante', 'Äthiopien', 'Yirgacheffe', 'washed', 'light-medium', 'Heirloom', '1900m', ['Blumen', 'Zitrus', 'Honig']),
  b('Carl Ferdinand', 'Düsseldorf', 'Chirocco', 'Brasilien', 'Cerrado', 'natural', 'medium', 'Yellow Bourbon', '1100m', ['Schokolade', 'Nuss', 'Karamell']),

  // Röstzeit — Highland-Röstungen, drei Standorte
  b('Röstzeit', 'Düsseldorf', 'Kolumbien El Silencio', 'Kolumbien', 'Huila', 'washed', 'medium', 'Castillo', '1700m', ['Schokolade', 'Karamell', 'Nuss']),
  b('Röstzeit', 'Düsseldorf', 'Röstzeit Espresso', 'Brasilien', 'Cerrado', 'natural', 'medium-dark', 'Yellow Bourbon', '1100m', ['Schokolade', 'Nuss', 'Gewürze']),
  b('Röstzeit', 'Düsseldorf', 'Brasil Miaki', 'Brasilien', 'Sul de Minas', 'natural', 'medium', 'Mundo Novo', '1100m', ['Nuss', 'Schokolade', 'Karamell']),

  // ── Weitere Städte ───────────────────────────────

  // Hoppenworth & Ploch (Frankfurt) — Roaster of the Year 2021
  b('Hoppenworth & Ploch', 'Frankfurt', 'Las Moras', 'Kolumbien', 'Huila', 'washed', 'light', 'Caturra', '1700m', ['Orange', 'Karamell', 'Honig']),
  b('Hoppenworth & Ploch', 'Frankfurt', 'La Primavera', 'Kolumbien', 'Huila', 'washed', 'light', 'Caturra', '1800m', ['Zitrus', 'Tropenfrüchte', 'Jasmin']),
  b('Hoppenworth & Ploch', 'Frankfurt', 'Tabe Burka', 'Äthiopien', 'Yirgacheffe', 'washed', 'light', 'Heirloom', '1900m', ['Jasmin', 'Zitrus', 'Honig']),

  // Machhorndl (Nürnberg) — Single Origin Pioniere seit 2008
  b('Machhorndl', 'Nürnberg', 'Kenia Thageini', 'Kenia', 'Nyeri', 'washed', 'light', 'SL28', '1800m', ['Beeren', 'Blumen', 'Zitrus']),
  b('Machhorndl', 'Nürnberg', 'Äthiopien Chelbesa', 'Äthiopien', 'Yirgacheffe', 'natural', 'light', 'Heirloom', '1950m', ['Erdbeere', 'Blumen', 'Zitrus']),

  // Heilandt (Köln) — 100% Direct Trade seit 2010
  b('Heilandt', 'Köln', 'Äthiopien Guji', 'Äthiopien', 'Guji', 'natural', 'light', 'Heirloom', '2100m', ['Blaubeere', 'Erdbeere', 'Vanille']),
  b('Heilandt', 'Köln', 'Kolumbien Huila', 'Kolumbien', 'Huila', 'washed', 'medium', 'Caturra', '1700m', ['Schokolade', 'Karamell', 'Nuss']),

  // Martermühle (München) — Bayerische Handrösterei
  b('Martermühle', 'München', 'Aßlinger Mischung', 'Brasilien', 'Cerrado', 'natural', 'medium', 'Mundo Novo', '1000m', ['Schokolade', 'Nuss', 'Karamell']),
  b('Martermühle', 'München', 'Guatemala', 'Guatemala', 'Antigua', 'washed', 'medium', 'Bourbon', '1500m', ['Schokolade', 'Gewürze', 'Karamell']),
  b('Martermühle', 'München', 'Colombia', 'Kolumbien', 'Huila', 'washed', 'medium', 'Caturra', '1700m', ['Schokolade', 'Honig', 'Mandel']),

  // Supremo (München) — Familienrösterei mit Rohkaffee-Humidor
  b('Supremo', 'München', 'Blackberry', 'Kolumbien', 'Huila', 'natural', 'light', 'Caturra', '1800m', ['Beeren', 'Brombeere', 'Schokolade']),
  b('Supremo', 'München', 'Family Celebration', 'Brasilien', 'Cerrado', 'natural', 'medium', 'Yellow Bourbon', '1100m', ['Schokolade', 'Karamell', 'Nuss']),
  b('Supremo', 'München', 'Familia Marin', 'Costa Rica', 'Central Valley', 'honey', 'light-medium', 'Villa Sarchí', '1500m', ['Schokolade', 'Beeren', 'Karamell']),

  // Cross Coffee (Bremen) — Erste Specialty Rösterei Bremens
  b('Cross Coffee', 'Bremen', 'Tunki', 'Peru', 'Puno', 'washed', 'light-medium', 'Typica', '1700m', ['Schokolade', 'Nuss', 'Honig']),
  b('Cross Coffee', 'Bremen', 'La Cristalina', 'Kolumbien', 'Huila', 'washed', 'light', 'Caturra', '1800m', ['Beeren', 'Zitrus', 'Karamell']),
];

// ── Recipe Overrides ──────────────────────────
// Community- & Rösterei-basierte Rezepte (Kaffee-Netz, RVTC Website, GrindDial)
// Überschreiben die algorithmischen Defaults wenn vorhanden
// Kalibriert auf: Rocket Appartamento (E61 HX) + Niche Zero (0–50)
// Referenzpunkt: Desert Rose Double=11 bestätigt (21.04.2026), Community-Werte ~9 Stufen zu grob für dark roast
const RECIPE_OVERRIDES = {
  // RVTC — Quellen: rvtc.com Produktseiten, Kaffee-Netz RVTC-Thread (S.1-10), User-Reports
  // RVTC-Café-Standard: 1:2.5, 94.5°C, 21g Baskets (La Marzocco + Mythos 1)
  'RVTC:Desert Rose': {
    // rvtc.com: 1:2, 91-92°C, 21-25s | Kalibriert: Double=11 bestätigt (21.04.2026)
    single:      { grind: 10,   dose: 10, yield: 22, time: 24 },
    double:      { grind: 11,   dose: 18, yield: 40, time: 25 },
    'cafe-creme': { grind: 22,   dose: 16, yield: 120, time: 26 },
  },
  'RVTC:Italo Pop': {
    // rvtc.com: 1:2, 91-92°C, 21-25s | KN S.9: 18.3g→39.5g, 27s
    single:      { grind: 9,   dose: 10, yield: 22, time: 25 },
    double:      { grind: 10,   dose: 18, yield: 39, time: 27 },
    'cafe-creme': { grind: 21,   dose: 16, yield: 120, time: 26 },
  },
  'RVTC:Garage House': {
    // rvtc.com: 1:2, 93-94°C, 30-33s | KN S.10: braucht mehr Temperatur als Italo Pop
    single:      { grind: 13,   dose: 11, yield: 24, time: 28 },
    double:      { grind: 14,   dose: 18, yield: 36, time: 30 },
    'cafe-creme': { grind: 24,   dose: 16, yield: 120, time: 27 },
  },
  'RVTC:Jungle Boogie': {
    // rvtc.com: 1:2.5, 93-94°C, 30-33s | KN S.3: 1:2.5, 34-36s, Sweet Spot "Mandel/Marzipan"
    single:      { grind: 14,   dose: 11, yield: 27, time: 30 },
    double:      { grind: 15,   dose: 18, yield: 45, time: 32 },
    'cafe-creme': { grind: 25,   dose: 16, yield: 125, time: 28 },
  },
  'RVTC:Bulle Blend': {
    // Abgeleitet von Italo Pop (dark, washed)
    single:      { grind: 9,   dose: 10, yield: 21, time: 24 },
    double:      { grind: 10,   dose: 18, yield: 38, time: 26 },
    'cafe-creme': { grind: 21,   dose: 16, yield: 120, time: 26 },
  },
  'RVTC:The Commonage': {
    // Dark washed Malawi
    single:      { grind: 9,   dose: 10, yield: 21, time: 24 },
    double:      { grind: 10,   dose: 18, yield: 38, time: 26 },
    'cafe-creme': { grind: 21,   dose: 16, yield: 120, time: 26 },
  },
  'RVTC:Antonio Alvarado': {
    // Light natural Costa Rica — anspruchsvollste Bohne auf HX
    single:      { grind: 12,   dose: 11, yield: 30, time: 30 },
    double:      { grind: 13,   dose: 18, yield: 50, time: 33 },
    'cafe-creme': { grind: 24,   dose: 16, yield: 130, time: 29 },
  },
  'RVTC:Gara Kogne': {
    // Light-medium washed Ethiopian, floral/teeig
    single:      { grind: 13,   dose: 11, yield: 28, time: 29 },
    double:      { grind: 14,   dose: 18, yield: 45, time: 32 },
    'cafe-creme': { grind: 25,   dose: 16, yield: 125, time: 28 },
  },
  'RVTC:Mundayo AASH': {
    // rvtc.com: gut als Flat White | Medium natural Ethiopian
    single:      { grind: 14,   dose: 11, yield: 25, time: 28 },
    double:      { grind: 15,   dose: 18, yield: 40, time: 30 },
    'cafe-creme': { grind: 25,   dose: 16, yield: 120, time: 27 },
  },
  'RVTC:El Congo': {
    // Medium honey Costa Rica, Tarrazu
    single:      { grind: 13,   dose: 11, yield: 25, time: 28 },
    double:      { grind: 14,   dose: 18, yield: 40, time: 30 },
    'cafe-creme': { grind: 24.5, dose: 16, yield: 120, time: 27 },
  },
  'RVTC:Vanessa Moreno': {
    // Medium natural Brasilien — schokoladig, verzeihend
    single:      { grind: 14,   dose: 11, yield: 24, time: 26 },
    double:      { grind: 15,   dose: 18, yield: 40, time: 28 },
    'cafe-creme': { grind: 25,   dose: 16, yield: 120, time: 27 },
  },
  'RVTC:Italo Pop Decaf': {
    // KN Decaf-Thread: Ristretto 1:1–1:1.5 bester Geschmack, Decaf extrahiert schneller (+1 gröber)
    single:      { grind: 10,   dose: 10, yield: 18, time: 23 },
    double:      { grind: 11,   dose: 17, yield: 30, time: 24 },
    'cafe-creme': { grind: 22,   dose: 16, yield: 120, time: 25 },
  },
  'RVTC:Pink Bourbon Decaf': {
    // rvtc.com: Lebkuchen, Jaffa Cake — intensiv genug für Flat White
    single:      { grind: 15,   dose: 11, yield: 25, time: 28 },
    double:      { grind: 16,   dose: 18, yield: 40, time: 30 },
    'cafe-creme': { grind: 26,   dose: 16, yield: 120, time: 27 },
  },
  'RVTC:Dimtu Tora Guji Decaf': {
    // Medium natural Ethiopian Decaf
    single:      { grind: 15,   dose: 11, yield: 25, time: 28 },
    double:      { grind: 16,   dose: 18, yield: 40, time: 30 },
    'cafe-creme': { grind: 26,   dose: 16, yield: 120, time: 27 },
  },
  'RVTC:Carbonic Natural Decaf': {
    // rvtc.com: nussig-süß, milde Säure | Dark natural Decaf (+1 gröber für Decaf)
    single:      { grind: 11,   dose: 10, yield: 20, time: 24 },
    double:      { grind: 12,   dose: 17, yield: 36, time: 25 },
    'cafe-creme': { grind: 23,   dose: 16, yield: 120, time: 26 },
  },
};

// ── Smart Recipe Defaults ──────────────────────
// Berechnet Startrezepte basierend auf Röstgrad & Processing
// Falls RECIPE_OVERRIDES vorhanden → diese bevorzugen
// Optimiert für: Rocket Appartamento (E61 HX) + Niche Zero (0–50)
// Single Basket: 11g bodenlos | Double Basket: 18g

const ROAST_RECIPE_MAP = {
  // [grindSingle, grindDouble, grindCreme, doseSingle, doseDouble, doseCreme, yieldSingle, yieldDouble, yieldCreme, timeSingle, timeDouble, timeCreme]
  'light':        [17, 18, 26, 11, 18, 16, 29, 48, 130, 26, 26, 28],
  'light-medium': [14, 15, 25, 11, 18, 16, 27, 44, 125, 25, 25, 27],
  'medium':       [12, 13, 23, 11, 18, 16, 24, 40, 120, 24, 24, 26],
  'medium-dark':  [10, 11, 22, 11, 18, 16, 22, 36, 120, 23, 23, 25],
  'dark':         [ 9, 10, 21, 10, 17, 16, 20, 34, 120, 22, 22, 25],
};

// Natural/Anaerobic: etwas gröber (+1), mehr Solubles
const PROCESSING_GRIND_OFFSET = {
  'washed': 0,
  'natural': 1,
  'honey': 0.5,
  'anaerobic': 1,
};

export function getRecipeDefaults(bean) {
  const key = `${bean.roastery}:${bean.name}`;
  if (RECIPE_OVERRIDES[key]) return RECIPE_OVERRIDES[key];

  const base = ROAST_RECIPE_MAP[bean.roast] || ROAST_RECIPE_MAP['medium'];
  const offset = PROCESSING_GRIND_OFFSET[bean.processing] || 0;

  return {
    single: {
      grind: Math.round((base[0] + offset) * 2) / 2,
      dose: base[3],
      yield: base[6],
      time: base[9],
    },
    double: {
      grind: Math.round((base[1] + offset) * 2) / 2,
      dose: base[4],
      yield: base[7],
      time: base[10],
    },
    'cafe-creme': {
      grind: Math.round((base[2] + offset) * 2) / 2,
      dose: base[5],
      yield: base[8],
      time: base[11],
    },
  };
}

// Group roasteries for the Discover view
// Miller's Law: chunk into alphabetical groups
export function getRoasteriesGrouped() {
  const roasteries = {};
  COFFEE_DATABASE.forEach(bean => {
    if (!roasteries[bean.roastery]) {
      roasteries[bean.roastery] = {
        name: bean.roastery,
        city: bean.roasteryCity,
        beans: [],
      };
    }
    roasteries[bean.roastery].beans.push(bean);
  });

  const sorted = Object.values(roasteries).sort((a, b) =>
    a.name.localeCompare(b.name, 'de')
  );

  const grouped = {};
  sorted.forEach(roastery => {
    const letter = roastery.name.charAt(0).toUpperCase();
    // Handle numbers and special chars
    const key = /[A-ZÄÖÜa-zäöü]/.test(letter) ? letter : '#';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(roastery);
  });

  return grouped;
}
