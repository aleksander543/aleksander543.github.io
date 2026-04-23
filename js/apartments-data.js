// Megapolis — dane mieszkan (prototyp)
// W produkcji: zastapimy to zapytaniem do /api/thtg/apartments z serwera.
// Na razie: 9 mieszkan z /wyszukiwarka/ plus dodatkowe pola dla strony szczegolow.

window.MEGAPOLIS_APARTMENTS = [
  {
    id: 'A-01',
    investment: 'ozon', invName: 'Osiedle OZON', city: 'Kraków', district: 'Ruczaj',
    rooms: 2, area: 42.3, floor: 0, floorLabel: 'Parter',
    direction: 'S', directionLabel: 'Południe',
    price: 359550, pricePerM2: 8501,
    priceOld: 379000, promo: '-5%',
    status: 'available', statusLabel: 'Dostępne',
    building: 'Budynek A', number: '01',
    plan: '/media/plans/plan-3p.avif',
    photos: ['/media/ozon/ozon-1.jpg','/media/ozon/ozon-2.jpg','/media/ozon/ozon-3.jpg'],
    summary: '2 pokoje z oknami na południe, na parterze — idealne do aranżacji pod potrzeby rodziny.',
    description: 'Mieszkanie 2-pokojowe na parterze z bezpośrednim wyjściem na zielony ogródek. Okna skierowane na południe gwarantują pełne nasłonecznienie przez cały dzień. Przestronny układ sprawdzi się jako pierwsze mieszkanie dla młodej rodziny lub jako komfortowe lokum dla osoby aktywnej zawodowo.',
    features: ['balkon', 'ogrodek', 'miejsce-postojowe'],
    delivery: 'Q4 2024',
    readiness: 'standard deweloperski'
  },
  {
    id: 'A-03',
    investment: 'ozon', invName: 'Osiedle OZON', city: 'Kraków', district: 'Ruczaj',
    rooms: 1, area: 29.8, floor: 1, floorLabel: '1 piętro',
    direction: 'E', directionLabel: 'Wschód',
    price: 253300, pricePerM2: 8500,
    status: 'available', statusLabel: 'Dostępne',
    building: 'Budynek A', number: '03',
    plan: '/media/plans/plan-1p.avif',
    photos: ['/media/ozon/ozon-2.jpg','/media/ozon/ozon-1.jpg'],
    summary: 'Kompaktowa kawalerka na pierwszym piętrze, z oknem na wschód — najlepsze poranne światło.',
    description: 'Funkcjonalna kawalerka z przemyślanym układem — aneks kuchenny otwarty na salon, oddzielna łazienka z oknem. Idealna dla osoby wchodzącej na rynek nieruchomości lub jako mieszkanie inwestycyjne pod wynajem.',
    features: ['balkon'],
    delivery: 'Q4 2024',
    readiness: 'standard deweloperski'
  },
  {
    id: 'A-05',
    investment: 'ozon', invName: 'Osiedle OZON', city: 'Kraków', district: 'Ruczaj',
    rooms: 3, area: 65.8, floor: 1, floorLabel: '1 piętro',
    direction: 'SW', directionLabel: 'Południowy zachód',
    price: 559300, pricePerM2: 8500,
    status: 'available', statusLabel: 'Dostępne',
    building: 'Budynek A', number: '05',
    plan: '/media/plans/plan-8p.avif',
    photos: ['/media/ozon/ozon-3.jpg','/media/ozon/ozon-1.jpg','/media/ozon/ozon-2.jpg'],
    summary: 'Przestronne 3 pokoje z ekspozycją południowo-zachodnią — ciepło słońca do późnego popołudnia.',
    description: 'Trzypokojowe mieszkanie na pierwszym piętrze z ekspozycją południowo-zachodnią. Dwie sypialnie, salon z aneksem i funkcjonalna łazienka. Idealne dla rodziny z dzieckiem lub pary ceniącej komfort i przestrzeń.',
    features: ['balkon', 'miejsce-postojowe', 'komorka'],
    delivery: 'Q4 2024',
    readiness: 'standard deweloperski'
  },
  {
    id: 'A-07',
    investment: 'ozon', invName: 'Osiedle OZON', city: 'Kraków', district: 'Ruczaj',
    rooms: 2, area: 44.5, floor: 2, floorLabel: '2 piętro',
    direction: 'N', directionLabel: 'Północ',
    price: 378250, pricePerM2: 8500,
    status: 'reserved', statusLabel: 'Zarezerwowane',
    building: 'Budynek A', number: '07',
    plan: '/media/plans/plan-3p.avif',
    photos: ['/media/ozon/ozon-1.jpg','/media/ozon/ozon-3.jpg'],
    summary: '2 pokoje na drugim piętrze, od strony północnej — stabilne rozproszone światło.',
    description: 'Dwupokojowe mieszkanie dla osób ceniących spokojne, rozproszone światło przez cały dzień. Ekspozycja północna to także niższe koszty chłodzenia latem.',
    features: ['balkon'],
    delivery: 'Q4 2024',
    readiness: 'standard deweloperski'
  },
  {
    id: 'A-10',
    investment: 'ozon', invName: 'Osiedle OZON', city: 'Kraków', district: 'Ruczaj',
    rooms: 3, area: 61.2, floor: 3, floorLabel: '3 piętro',
    direction: 'W', directionLabel: 'Zachód',
    price: 520200, pricePerM2: 8500,
    priceOld: 536100, promo: '-3%',
    status: 'available', statusLabel: 'Dostępne',
    building: 'Budynek A', number: '10',
    plan: '/media/plans/plan-8p.avif',
    photos: ['/media/ozon/ozon-2.jpg','/media/ozon/ozon-1.jpg','/media/ozon/ozon-3.jpg'],
    summary: '3 pokoje na trzecim piętrze, okna na zachód — widoki na zielone wnętrze osiedla.',
    description: 'Trzypokojowe mieszkanie na wyższej kondygnacji z widokiem na zielony dziedziniec. Okna zachodnie zapewniają piękne zachody słońca. Dwa balkony i duży salon z aneksem kuchennym.',
    features: ['balkon', 'taras', 'miejsce-postojowe'],
    delivery: 'Q4 2024',
    readiness: 'standard deweloperski'
  },
  {
    id: 'A-14',
    investment: 'ozon', invName: 'Osiedle OZON', city: 'Kraków', district: 'Ruczaj',
    rooms: 4, area: 85.9, floor: 3, floorLabel: '3 piętro',
    direction: 'SE', directionLabel: 'Południowy wschód',
    price: 730150, pricePerM2: 8500,
    status: 'available', statusLabel: 'Dostępne',
    building: 'Budynek A', number: '14',
    plan: '/media/plans/plan-8p.avif',
    photos: ['/media/ozon/ozon-3.jpg','/media/ozon/ozon-2.jpg','/media/ozon/ozon-1.jpg'],
    summary: 'Rodzinne 4 pokoje z ekspozycją południowo-wschodnią — dużo światła od samego rana.',
    description: 'Duże rodzinne mieszkanie z trzema sypialniami i osobnym salonem. Ekspozycja południowo-wschodnia oznacza pełne słońce od rana. Idealne dla rodziny 2+2, z miejscem na domowe biuro lub gabinet.',
    features: ['balkon', 'taras', 'miejsce-postojowe', 'komorka'],
    delivery: 'Q4 2024',
    readiness: 'standard deweloperski'
  },
  {
    id: 'B-02',
    investment: 'clou', invName: 'CLOU Lindego', city: 'Kraków', district: 'Bronowice',
    rooms: 2, area: 45.6, floor: 1, floorLabel: '1 piętro',
    direction: 'N', directionLabel: 'Północ',
    price: 419520, pricePerM2: 9200,
    status: 'available', statusLabel: 'Dostępne',
    building: 'Budynek B', number: '02',
    plan: '/media/plans/plan-3p.avif',
    photos: ['/media/clou/lindego-panorama.jpg','/media/clou/lindego-street.jpg','/media/clou/lindego-ogrodek.jpg'],
    summary: '2 pokoje w premium kwartale Bronowic, na pierwszym piętrze z oknami od północy.',
    description: 'Mieszkanie w kameralnej inwestycji CLOU Lindego na Bronowicach. Spokojna lokalizacja przy Młynówce Królewskiej i Parku Tetmajera. Budynek o wysokim standardzie, z windą i strefą recepcji.',
    features: ['balkon', 'miejsce-postojowe'],
    delivery: 'Zrealizowane · 2024',
    readiness: 'standard deweloperski +'
  },
  {
    id: 'B-07',
    investment: 'clou', invName: 'CLOU Lindego', city: 'Kraków', district: 'Bronowice',
    rooms: 3, area: 68.9, floor: 3, floorLabel: '3 piętro',
    direction: 'SW', directionLabel: 'Południowy zachód',
    price: 633880, pricePerM2: 9200,
    status: 'available', statusLabel: 'Dostępne',
    building: 'Budynek B', number: '07',
    plan: '/media/plans/plan-8p.avif',
    photos: ['/media/clou/lindego-panorama.jpg','/media/clou/lindego-ogrodek.jpg','/media/clou/lindego-filtrowa.jpg'],
    summary: '3 pokoje z widokiem na Młynówkę Królewską — ekspozycja SW, trzecie piętro.',
    description: 'Premium 3-pokojowe mieszkanie w CLOU Lindego z panoramicznym widokiem na zielone tereny rekreacyjne. Wysoki standard wykończenia części wspólnych, idealny w ciszy i spokoju starej Bronowic.',
    features: ['balkon', 'taras', 'miejsce-postojowe', 'komorka'],
    delivery: 'Zrealizowane · 2024',
    readiness: 'standard deweloperski +'
  },
  {
    id: 'B-11',
    investment: 'clou', invName: 'CLOU Lindego', city: 'Kraków', district: 'Bronowice',
    rooms: 5, area: 110.3, floor: 4, floorLabel: '4 piętro (ostatnie)',
    direction: 'S', directionLabel: 'Południe',
    price: 1014760, pricePerM2: 9200,
    status: 'available', statusLabel: 'Dostępne',
    building: 'Budynek B', number: '11',
    plan: '/media/plans/plan-8p.avif',
    photos: ['/media/clou/lindego-panorama.jpg','/media/clou/lindego-street.jpg','/media/clou/lindego-filtrowa.jpg'],
    summary: 'Przestronne 5 pokoi na ostatnim piętrze — pełna ekspozycja południowa, panoramiczne widoki.',
    description: 'Penthouse w CLOU Lindego — 110 m² na ostatnim piętrze z wielkim tarasem i panoramicznym widokiem na Bronowice. Cztery sypialnie, duży salon, osobna jadalnia, dwie łazienki. Najbardziej prestiżowa oferta w portfolio.',
    features: ['taras', 'antresola', 'miejsce-postojowe', 'komorka'],
    delivery: 'Zrealizowane · 2024',
    readiness: 'premium'
  }
];

// Helper — znajdz mieszkanie po id
window.getMegapolisApartment = function(id) {
  if (!id) return null;
  var list = window.MEGAPOLIS_APARTMENTS || [];
  for (var i = 0; i < list.length; i++) {
    if (String(list[i].id).toUpperCase() === String(id).toUpperCase()) return list[i];
  }
  return null;
};

// Helper — formatuj cene
window.formatMegapolisPrice = function(p) {
  if (!p && p !== 0) return '';
  return String(Math.round(p)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł';
};
