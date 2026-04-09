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

// Drink types with sensible Niche Zero defaults & typical dose/yield
export const DRINK_TYPES = [
  {
    id: 'single',
    label: 'Single Shot',
    emoji: '☕',
    defaults: { grind: 15, dose: 9, yield: 28, time: 27 },
    grindRange: [8, 22],
  },
  {
    id: 'double',
    label: 'Double Shot',
    emoji: '☕☕',
    defaults: { grind: 15, dose: 18, yield: 36, time: 28 },
    grindRange: [8, 22],
  },
  {
    id: 'cafe-creme',
    label: 'Café Crème',
    emoji: '🫗',
    defaults: { grind: 22, dose: 16, yield: 120, time: 27 },
    grindRange: [18, 30],
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
  // The Barn (Berlin)
  b('The Barn', 'Berlin', 'Nano Challa', 'Äthiopien', 'Jimma', 'washed', 'light', 'Heirloom', '1900-2100m', ['Jasmin', 'Zitrus', 'Steinobst']),
  b('The Barn', 'Berlin', 'El Vergel Lychee', 'Kolumbien', 'Tolima', 'anaerobic', 'light', 'Castillo', '1800m', ['Tropenfrüchte', 'Blumen', 'Honig']),
  b('The Barn', 'Berlin', 'Giakanja', 'Kenia', 'Nyeri', 'washed', 'light', 'SL28', '1700m', ['Brombeere', 'Zitrus', 'Karamell']),

  // Bonanza Coffee (Berlin)
  b('Bonanza Coffee', 'Berlin', 'Kilenso Moconissa', 'Äthiopien', 'Guji', 'natural', 'light', 'Heirloom', '2000-2200m', ['Blaubeere', 'Erdbeere', 'Schokolade']),
  b('Bonanza Coffee', 'Berlin', 'La Palma', 'Kolumbien', 'Huila', 'washed', 'light-medium', 'Caturra', '1750m', ['Karamell', 'Orange', 'Nuss']),
  b('Bonanza Coffee', 'Berlin', 'Daterra', 'Brasilien', 'Cerrado', 'natural', 'medium', 'Yellow Bourbon', '1100m', ['Schokolade', 'Nuss', 'Karamell']),

  // Five Elephant (Berlin)
  b('Five Elephant', 'Berlin', 'Rumukia', 'Kenia', 'Nyeri', 'washed', 'light', 'SL28/SL34', '1800m', ['Beeren', 'Zitrus', 'Toffee']),
  b('Five Elephant', 'Berlin', 'Finca San Sebastián', 'Guatemala', 'Huehuetenango', 'washed', 'light-medium', 'Bourbon', '1600m', ['Schokolade', 'Steinobst', 'Honig']),

  // Father Carpenter (Berlin)
  b('Father Carpenter', 'Berlin', 'Guji Natural', 'Äthiopien', 'Guji', 'natural', 'light', 'Heirloom', '2100m', ['Blaubeere', 'Tropenfrüchte', 'Vanille']),
  b('Father Carpenter', 'Berlin', 'San Ignacio', 'Peru', 'Cajamarca', 'washed', 'medium', 'Typica', '1700m', ['Schokolade', 'Karamell', 'Mandel']),

  // Hoppenworth & Ploch (Frankfurt)
  b('Hoppenworth & Ploch', 'Frankfurt', 'Kochere', 'Äthiopien', 'Yirgacheffe', 'washed', 'light', 'Heirloom', '1900m', ['Jasmin', 'Zitrus', 'Honig']),
  b('Hoppenworth & Ploch', 'Frankfurt', 'Santa Bárbara', 'Honduras', 'Santa Bárbara', 'honey', 'light-medium', 'Catuaí', '1500m', ['Karamell', 'Steinobst', 'Nuss']),
  b('Hoppenworth & Ploch', 'Frankfurt', 'Cerrado Blend', 'Brasilien', 'Cerrado', 'natural', 'medium', 'Mundo Novo', '1050m', ['Nuss', 'Schokolade', 'Toffee']),

  // Elbgold (Hamburg)
  b('Elbgold', 'Hamburg', 'Sidamo', 'Äthiopien', 'Sidamo', 'washed', 'light', 'Heirloom', '1800m', ['Blumen', 'Zitrus', 'Honig']),
  b('Elbgold', 'Hamburg', 'La Ventana', 'Kolumbien', 'Nariño', 'washed', 'light-medium', 'Castillo', '1900m', ['Karamell', 'Beeren', 'Orange']),
  b('Elbgold', 'Hamburg', 'Fazenda Rainha', 'Brasilien', 'Sul de Minas', 'natural', 'medium', 'Yellow Bourbon', '1200m', ['Schokolade', 'Nuss', 'Vanille']),

  // Public Coffee Roasters (Hamburg)
  b('Public Coffee Roasters', 'Hamburg', 'Chelelektu', 'Äthiopien', 'Yirgacheffe', 'washed', 'light', 'Heirloom', '2000m', ['Jasmin', 'Beeren', 'Zitrus']),
  b('Public Coffee Roasters', 'Hamburg', 'Hacienda Sonora', 'Costa Rica', 'West Valley', 'honey', 'light-medium', 'Villa Sarchí', '1500m', ['Honig', 'Steinobst', 'Karamell']),

  // Nord Coast Coffee (Hamburg)
  b('Nord Coast Coffee', 'Hamburg', 'Limu', 'Äthiopien', 'Limu', 'washed', 'light-medium', 'Heirloom', '1700m', ['Blumen', 'Zitrus', 'Gewürze']),
  b('Nord Coast Coffee', 'Hamburg', 'Tarrazú', 'Costa Rica', 'Tarrazú', 'washed', 'medium', 'Caturra', '1400m', ['Schokolade', 'Orange', 'Karamell']),

  // Machhorndl (Nürnberg)
  b('Machhorndl', 'Nürnberg', 'Yirgacheffe Aricha', 'Äthiopien', 'Yirgacheffe', 'natural', 'light', 'Heirloom', '1950m', ['Erdbeere', 'Blumen', 'Tropenfrüchte']),
  b('Machhorndl', 'Nürnberg', 'Finca El Injerto', 'Guatemala', 'Huehuetenango', 'washed', 'light-medium', 'Bourbon', '1650m', ['Schokolade', 'Honig', 'Nuss']),

  // Rösterei Vier (Nürnberg)
  b('Rösterei Vier', 'Nürnberg', 'Nyamasheke', 'Ruanda', 'Nyamasheke', 'washed', 'light', 'Red Bourbon', '1800m', ['Beeren', 'Zitrus', 'Karamell']),
  b('Rösterei Vier', 'Nürnberg', 'Mogiana', 'Brasilien', 'São Paulo', 'natural', 'medium', 'Mundo Novo', '1000m', ['Nuss', 'Schokolade', 'Toffee']),

  // JB Kaffee (Dortmund)
  b('JB Kaffee', 'Dortmund', 'Worka Sakaro', 'Äthiopien', 'Sidamo', 'natural', 'light', 'Heirloom', '2100m', ['Blaubeere', 'Schokolade', 'Vanille']),
  b('JB Kaffee', 'Dortmund', 'La Ceiba', 'Honduras', 'Marcala', 'washed', 'medium', 'Catuaí', '1500m', ['Karamell', 'Nuss', 'Schokolade']),

  // Röststätte (Berlin)
  b('Röststätte', 'Berlin', 'Duromina', 'Äthiopien', 'Jimma', 'washed', 'light', 'Heirloom', '2000m', ['Jasmin', 'Steinobst', 'Honig']),
  b('Röststätte', 'Berlin', 'Finca Hartmann', 'Panama', 'Chiriquí', 'washed', 'light-medium', 'Geisha', '1800m', ['Jasmin', 'Tropenfrüchte', 'Zitrus']),
  b('Röststätte', 'Berlin', 'Decaf Colombia', 'Kolumbien', 'Huila', 'washed', 'medium', 'Caturra', '1600m', ['Schokolade', 'Karamell', 'Mandel']),

  // Coffee Circle (Berlin)
  b('Coffee Circle', 'Berlin', 'Limu Kaffee', 'Äthiopien', 'Limu', 'washed', 'light-medium', 'Heirloom', '1800m', ['Blumen', 'Zitrus', 'Honig']),
  b('Coffee Circle', 'Berlin', 'Yirga Santos', 'Äthiopien', 'Yirgacheffe', 'natural', 'medium', 'Heirloom', '1900m', ['Beeren', 'Schokolade', 'Gewürze']),
  b('Coffee Circle', 'Berlin', 'Cerrado Kaffee', 'Brasilien', 'Cerrado', 'natural', 'medium', 'Catuaí', '1100m', ['Nuss', 'Schokolade', 'Karamell']),

  // 19grams (Berlin)
  b('19grams', 'Berlin', 'Benti Nenka', 'Äthiopien', 'Jimma', 'washed', 'light', 'Heirloom', '2000m', ['Zitrus', 'Blumen', 'Steinobst']),
  b('19grams', 'Berlin', 'Finca La Esperanza', 'Kolumbien', 'Cauca', 'washed', 'light-medium', 'Pink Bourbon', '1850m', ['Beeren', 'Tropenfrüchte', 'Karamell']),
  b('19grams', 'Berlin', 'House Blend', 'Brasilien', 'Sul de Minas', 'natural', 'medium', 'Yellow Bourbon', '1150m', ['Schokolade', 'Nuss', 'Karamell']),

  // Heilandt (Köln)
  b('Heilandt', 'Köln', 'Äthiopien Guji', 'Äthiopien', 'Guji', 'natural', 'light', 'Heirloom', '2100m', ['Blaubeere', 'Erdbeere', 'Vanille']),
  b('Heilandt', 'Köln', 'Huila Excelso', 'Kolumbien', 'Huila', 'washed', 'medium', 'Caturra', '1700m', ['Schokolade', 'Karamell', 'Nuss']),

  // Martermühle (München)
  b('Martermühle', 'München', 'Indian Monsooned', 'Indien', 'Malabar', 'natural', 'medium-dark', 'Robusta/Arabica', '600m', ['Gewürze', 'Schokolade', 'Nuss']),
  b('Martermühle', 'München', 'Nicaragua Maragogype', 'Nicaragua', 'Jinotega', 'washed', 'medium', 'Maragogype', '1200m', ['Schokolade', 'Honig', 'Mandel']),
  b('Martermühle', 'München', 'Espresso Bohne', 'Brasilien', 'Cerrado', 'natural', 'medium-dark', 'Mundo Novo', '1000m', ['Schokolade', 'Nuss', 'Toffee']),

  // Supremo (München/Unterhaching)
  b('Supremo', 'München', 'Kenia Kiambu', 'Kenia', 'Kiambu', 'washed', 'light-medium', 'SL28', '1700m', ['Beeren', 'Zitrus', 'Toffee']),
  b('Supremo', 'München', 'Guatemala Antigua', 'Guatemala', 'Antigua', 'washed', 'medium', 'Bourbon', '1500m', ['Schokolade', 'Gewürze', 'Karamell']),

  // Cross Coffee (Bremen)
  b('Cross Coffee', 'Bremen', 'El Salvador Finca', 'El Salvador', 'Santa Ana', 'honey', 'light-medium', 'Pacamara', '1400m', ['Steinobst', 'Honig', 'Karamell']),
  b('Cross Coffee', 'Bremen', 'Rwanda Buf', 'Ruanda', 'Nyamasheke', 'washed', 'light', 'Red Bourbon', '1900m', ['Beeren', 'Zitrus', 'Blumen']),

  // Flying Roasters (Berlin)
  b('Flying Roasters', 'Berlin', 'Aramo', 'Äthiopien', 'Sidamo', 'washed', 'light', 'Heirloom', '1950m', ['Jasmin', 'Zitrus', 'Honig']),
  b('Flying Roasters', 'Berlin', 'Volcan Azul', 'Costa Rica', 'Central Valley', 'honey', 'light-medium', 'SL28', '1400m', ['Tropenfrüchte', 'Karamell', 'Honig']),

  // Quijote Kaffee (Hamburg)
  b('Quijote Kaffee', 'Hamburg', 'Kamwangi', 'Kenia', 'Kirinyaga', 'washed', 'light', 'SL28/SL34', '1800m', ['Brombeere', 'Zitrus', 'Steinobst']),
  b('Quijote Kaffee', 'Hamburg', 'Finca Tasta', 'Kolumbien', 'Huila', 'washed', 'light-medium', 'Caturra', '1750m', ['Karamell', 'Beeren', 'Schokolade']),
  b('Quijote Kaffee', 'Hamburg', 'Myanmar Mogok', 'Myanmar', 'Shan State', 'natural', 'light', 'Catimor', '1200m', ['Tropenfrüchte', 'Blumen', 'Gewürze']),
];

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
