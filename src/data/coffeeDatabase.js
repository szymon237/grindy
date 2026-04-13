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
  { name: 'SCHVARZ', city: 'Düsseldorf', address: 'Ronsdorfer Str. 74, Flingern', lat: 51.2195, lng: 6.8085, type: 'roastery', sellsBeans: true },
  { name: 'RVTC', city: 'Düsseldorf', address: 'Berger Str. 29, Altstadt', lat: 51.2258, lng: 6.7738, type: 'roastery', sellsBeans: true },
  { name: 'Carl Ferdinand', city: 'Düsseldorf', address: 'Düsselthaler Str. 39, Pempelfort', lat: 51.2368, lng: 6.7842, type: 'roastery', sellsBeans: true },
  { name: 'Röstzeit', city: 'Düsseldorf', address: 'Birkenstr. 81, Flingern', lat: 51.2192, lng: 6.8098, type: 'roastery', sellsBeans: true },
  { name: 'BREW Specialty Coffee', city: 'Düsseldorf', address: 'Bilker Allee 53, Bilk', lat: 51.2150, lng: 6.7830, type: 'roastery', sellsBeans: true },
  { name: 'Heinemann Kaffeerösterei', city: 'Düsseldorf', address: 'Flinger Str. 18, Altstadt', lat: 51.2250, lng: 6.7780, type: 'roastery', sellsBeans: true },
  { name: 'Lightroast Coffee', city: 'Düsseldorf', address: 'Hoffeldstr. 104, Flingern Süd', lat: 51.2175, lng: 6.8105, type: 'roastery', sellsBeans: true },
  { name: 'Fjaka Café & Rösterei', city: 'Düsseldorf', address: 'Ackerstr. 204, Flingern', lat: 51.2195, lng: 6.8060, type: 'roastery', sellsBeans: true },
  { name: 'Die Röstmeister', city: 'Düsseldorf', address: 'Quirinstr. 2, Oberkassel', lat: 51.2300, lng: 6.7525, type: 'roastery', sellsBeans: true },
  { name: 'Kaffeeschmiede', city: 'Düsseldorf', address: 'Belsenstr. 11, Oberkassel', lat: 51.2305, lng: 6.7530, type: 'roastery', sellsBeans: true },
  { name: 'Das Coffe Roastery', city: 'Düsseldorf', address: 'Wiesenstr. 32, Heerdt', lat: 51.2340, lng: 6.7280, type: 'roastery', sellsBeans: true },
  { name: 'Rivercoffee', city: 'Düsseldorf', address: 'Am Kreuzberg 8, Kaiserswerth', lat: 51.3025, lng: 6.7340, type: 'roastery', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Altstadt / Carlstadt / Stadtmitte
  // ══════════════════════════════════════════════
  { name: 'Drip Coffee', city: 'Düsseldorf', address: 'Bastionstr. 11, Carlstadt', lat: 51.2210, lng: 6.7720, type: 'cafe', sellsBeans: true },
  { name: 'Pourover', city: 'Düsseldorf', address: 'Carlsplatz 1, Carlstadt', lat: 51.2215, lng: 6.7745, type: 'cafe', sellsBeans: true },
  { name: 'Woyton', city: 'Düsseldorf', address: 'Königsallee 36, Stadtmitte', lat: 51.2240, lng: 6.7795, type: 'cafe', sellsBeans: true },
  { name: 'Jones Coffee', city: 'Düsseldorf', address: 'Oststr. 36, Stadtmitte', lat: 51.2230, lng: 6.7890, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Unterbilk
  // ══════════════════════════════════════════════
  { name: 'Röstzeit Café', city: 'Düsseldorf', address: 'Lorettostr. 54, Unterbilk', lat: 51.2138, lng: 6.7690, type: 'cafe', sellsBeans: true },
  { name: 'Weird Space Cafe', city: 'Düsseldorf', address: 'Volmerswerther Str. 53, Unterbilk', lat: 51.2135, lng: 6.7695, type: 'cafe', sellsBeans: true },
  { name: 'Mercy Coffee Unterbilk', city: 'Düsseldorf', address: 'Neusser Str. 121, Unterbilk', lat: 51.2170, lng: 6.7725, type: 'cafe', sellsBeans: true },
  { name: 'Caffe Ma', city: 'Düsseldorf', address: 'Bilker Allee 38, Unterbilk', lat: 51.2160, lng: 6.7820, type: 'cafe', sellsBeans: false },
  { name: 'Covent Garden Coffee', city: 'Düsseldorf', address: 'Bilker Allee 126, Unterbilk', lat: 51.2120, lng: 6.7870, type: 'cafe', sellsBeans: true },
  { name: 'Café Reme', city: 'Düsseldorf', address: 'Kronprinzenstr. 97, Unterbilk', lat: 51.2175, lng: 6.7780, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Bilk
  // ══════════════════════════════════════════════
  { name: 'Kaffeemacher', city: 'Düsseldorf', address: 'Aachener Str. 28, Bilk', lat: 51.2090, lng: 6.7770, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Hafen / Medienhafen
  // ══════════════════════════════════════════════
  { name: 'Carl Ferdinand Kaffeebar', city: 'Düsseldorf', address: 'Wupperstr. 3, Hafen', lat: 51.2145, lng: 6.7650, type: 'cafe', sellsBeans: true },
  { name: 'Greger Café', city: 'Düsseldorf', address: 'Erftstr. 1, Hafen', lat: 51.2160, lng: 6.7620, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Friedrichstadt
  // ══════════════════════════════════════════════
  { name: 'Weird Space Friedrichstadt', city: 'Düsseldorf', address: 'Hüttenstr. 76, Friedrichstadt', lat: 51.2155, lng: 6.7880, type: 'cafe', sellsBeans: true },
  { name: 'Café Stoak', city: 'Düsseldorf', address: 'Adersstr. 48, Friedrichstadt', lat: 51.2188, lng: 6.7905, type: 'cafe', sellsBeans: true },
  { name: 'Espresso Perfetto', city: 'Düsseldorf', address: 'Bilker Allee 224, Friedrichstadt', lat: 51.2080, lng: 6.7920, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Pempelfort / Derendorf / Golzheim
  // ══════════════════════════════════════════════
  { name: 'Manus Café', city: 'Düsseldorf', address: 'Herzogstr. 28, Pempelfort', lat: 51.2345, lng: 6.7880, type: 'cafe', sellsBeans: true },
  { name: 'The Coffee', city: 'Düsseldorf', address: 'Nordstr. 32, Pempelfort', lat: 51.2380, lng: 6.7855, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Flingern Nord
  // ══════════════════════════════════════════════
  { name: 'Jaenner Modern Coffee', city: 'Düsseldorf', address: 'Ackerstr. 80, Flingern Nord', lat: 51.2230, lng: 6.8010, type: 'cafe', sellsBeans: true },
  { name: 'Kaffeehandwerk', city: 'Düsseldorf', address: 'Birkenstr. 127, Flingern Nord', lat: 51.2185, lng: 6.8115, type: 'cafe', sellsBeans: true },
  { name: 'Mercy Coffee Flingern', city: 'Düsseldorf', address: 'Birkenstr. 73, Flingern Nord', lat: 51.2205, lng: 6.8070, type: 'cafe', sellsBeans: true },
  { name: 'Bulle Bistro', city: 'Düsseldorf', address: 'Birkenstr. 47a, Flingern Nord', lat: 51.2210, lng: 6.8055, type: 'cafe', sellsBeans: true },
  { name: 'Kausal Café', city: 'Düsseldorf', address: 'Flurstr. 1, Flingern Nord', lat: 51.2225, lng: 6.8035, type: 'cafe', sellsBeans: false },
  { name: 'Café Hüftgold', city: 'Düsseldorf', address: 'Ackerstr. 113, Flingern Nord', lat: 51.2218, lng: 6.8020, type: 'cafe', sellsBeans: false },
  { name: 'Café Liebe', city: 'Düsseldorf', address: 'Platanenstr. 22, Flingern Nord', lat: 51.2235, lng: 6.8020, type: 'cafe', sellsBeans: false },
  { name: 'Oma Erika', city: 'Düsseldorf', address: 'Hermannstr. 34b, Flingern Nord', lat: 51.2242, lng: 6.8000, type: 'cafe', sellsBeans: false },
  { name: 'Kathe', city: 'Düsseldorf', address: 'Birkenstr. 49, Flingern Nord', lat: 51.2200, lng: 6.8060, type: 'cafe', sellsBeans: true },
  { name: 'Coffeedrap', city: 'Düsseldorf', address: 'Grafenberger Allee 30, Flingern', lat: 51.2265, lng: 6.8045, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Flingern Süd
  // ══════════════════════════════════════════════
  { name: 'Coffee-Bar', city: 'Düsseldorf', address: 'Flurstr. 38, Flingern Süd', lat: 51.2178, lng: 6.8100, type: 'cafe', sellsBeans: false },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Düsseltal / Zooviertel
  // ══════════════════════════════════════════════
  { name: 'Lina\'s Coffee', city: 'Düsseldorf', address: 'Rethelstr. 113, Düsseltal', lat: 51.2325, lng: 6.8070, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Oberbilk
  // ══════════════════════════════════════════════
  { name: 'Genussstation x Marny\'s', city: 'Düsseldorf', address: 'Ellerstr. 219, Oberbilk', lat: 51.2140, lng: 6.7960, type: 'cafe', sellsBeans: false },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Eller
  // ══════════════════════════════════════════════
  { name: 'Düssel Café', city: 'Düsseldorf', address: 'Gumbertstr. 190, Eller', lat: 51.2030, lng: 6.8420, type: 'cafe', sellsBeans: false },
  { name: 'Caffè Ma Grande', city: 'Düsseldorf', address: 'Gumbertstr. 118, Eller', lat: 51.2050, lng: 6.8380, type: 'cafe', sellsBeans: false },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Gerresheim
  // ══════════════════════════════════════════════
  { name: 'Orange Finest Coffee', city: 'Düsseldorf', address: 'Neusser Tor 17A, Gerresheim', lat: 51.2350, lng: 6.8680, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Oberkassel / Niederkassel
  // ══════════════════════════════════════════════
  { name: 'Copenhagen Coffee Lab', city: 'Düsseldorf', address: 'Luegallee 136, Oberkassel', lat: 51.2310, lng: 6.7490, type: 'cafe', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Heerdt
  // ══════════════════════════════════════════════
  { name: 'Café Freund', city: 'Düsseldorf', address: 'Viersener Str. 34, Heerdt', lat: 51.2335, lng: 6.7260, type: 'cafe', sellsBeans: false },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Benrath
  // ══════════════════════════════════════════════
  { name: 'Röstzeit Benrath', city: 'Düsseldorf', address: 'Börchemstr. 38, Benrath', lat: 51.1630, lng: 6.8710, type: 'roastery', sellsBeans: true },
  // ══════════════════════════════════════════════
  // DÜSSELDORF — Wersten
  // ══════════════════════════════════════════════
  { name: 'Café Südpark', city: 'Düsseldorf', address: 'In den Großen Banden 68, Wersten', lat: 51.1985, lng: 6.7920, type: 'cafe', sellsBeans: false },
  // ══════════════════════════════════════════════
  // ANDERE STÄDTE
  // ══════════════════════════════════════════════
  // ── Berlin ──
  { name: 'The Barn', city: 'Berlin', address: 'Schönhauser Allee 8, Mitte', lat: 52.5290, lng: 13.4100, type: 'roastery', sellsBeans: true },
  { name: 'Bonanza Coffee', city: 'Berlin', address: 'Adalbertstr. 70, Kreuzberg', lat: 52.5005, lng: 13.4185, type: 'roastery', sellsBeans: true },
  { name: 'Five Elephant', city: 'Berlin', address: 'Reichenberger Str. 101, Kreuzberg', lat: 52.4970, lng: 13.4310, type: 'roastery', sellsBeans: true },
  { name: '19grams', city: 'Berlin', address: 'Alexanderstr. 7, Mitte', lat: 52.5220, lng: 13.4130, type: 'roastery', sellsBeans: true },
  // ── Hamburg ──
  { name: 'Elbgold', city: 'Hamburg', address: 'Lagerstr. 34c, Schanzenviertel', lat: 53.5630, lng: 9.9670, type: 'roastery', sellsBeans: true },
  { name: 'Public Coffee Roasters', city: 'Hamburg', address: 'Goldbekplatz 1, Winterhude', lat: 53.5810, lng: 10.0080, type: 'roastery', sellsBeans: true },
  // ── Weitere ──
  { name: 'Hoppenworth & Ploch', city: 'Frankfurt', address: 'Fahrgasse 111, Innenstadt', lat: 50.1140, lng: 8.6900, type: 'roastery', sellsBeans: true },
  { name: 'Heilandt', city: 'Köln', address: 'Herwarthstr. 18, Ehrenfeld', lat: 50.9480, lng: 6.9210, type: 'roastery', sellsBeans: true },
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
  b('RVTC', 'Düsseldorf', 'Italo Pop', 'Tansania', 'Kilimanjaro', 'natural', 'medium-dark', 'Bourbon', '1500m', ['Gewürze', 'Schokolade', 'Nuss']),
  b('RVTC', 'Düsseldorf', 'Garage House', 'Kolumbien', 'Huila', 'washed', 'light-medium', 'Castillo', '1800m', ['Nuss', 'Karamell', 'Schokolade']),
  b('RVTC', 'Düsseldorf', 'Jungle Boogie', 'Äthiopien', 'Sidamo', 'natural', 'light', 'Heirloom', '1900m', ['Tropenfrüchte', 'Beeren', 'Gewürze']),

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

// ── Smart Recipe Defaults ──────────────────────
// Berechnet Startrezepte basierend auf Röstgrad & Processing
// Optimiert für: Rocket Appartamento (E61 HX) + Niche Zero (0–50)
// Single Basket: 11g bodenlos | Double Basket: 18g

const ROAST_RECIPE_MAP = {
  // [grindSingle, grindDouble, grindCreme, doseSingle, doseDouble, doseCreme, yieldSingle, yieldDouble, yieldCreme, timeSingle, timeDouble, timeCreme]
  'light':        [17, 18, 26, 11, 18, 16, 29, 48, 130, 26, 26, 28],
  'light-medium': [14, 15, 25, 11, 18, 16, 27, 44, 125, 25, 25, 27],
  'medium':       [12, 13, 23, 11, 18, 16, 24, 40, 120, 24, 24, 26],
  'medium-dark':  [10, 11, 22, 11, 18, 16, 22, 36, 120, 23, 23, 25],
  'dark':         [ 8,  9, 20, 10, 17, 16, 20, 34, 120, 22, 22, 25],
};

// Natural/Anaerobic: etwas gröber (+1), mehr Solubles
const PROCESSING_GRIND_OFFSET = {
  'washed': 0,
  'natural': 1,
  'honey': 0.5,
  'anaerobic': 1,
};

export function getRecipeDefaults(bean) {
  const base = ROAST_RECIPE_MAP[bean.roast] || ROAST_RECIPE_MAP['medium'];
  const offset = PROCESSING_GRIND_OFFSET[bean.processing] || 0;

  return {
    single: {
      grind: Math.round((base[0] + offset) * 2) / 2, // Niche 0.5er Schritte
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
