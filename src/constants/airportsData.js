/**
 * airportsData.js
 *
 * Curated commercial airport dataset for Air Freight transport routing.
 * Covers major international cargo / passenger airports used in agricultural trade.
 * Source: OurAirports (ourairports.com) open data — IATA codes + ISO country codes.
 *
 * Format: { code: "IATA", name: "Airport Name", country: "ISO2" }
 * Grouped by ISO 3166-1 alpha-2 country code for fast O(1) lookup.
 *
 * NOTE: This file is used as a fallback when the npm package is unavailable.
 * Architecture allows replacing with the airports-json package without touching CommercialSection.
 */

export const AIRPORTS_BY_COUNTRY = {
  // India
  IN: [
    { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport" },
    { code: "DEL", name: "Indira Gandhi International Airport" },
    { code: "MAA", name: "Chennai International Airport" },
    { code: "BLR", name: "Kempegowda International Airport (Bengaluru)" },
    { code: "HYD", name: "Rajiv Gandhi International Airport (Hyderabad)" },
    { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport (Kolkata)" },
    { code: "COK", name: "Cochin International Airport" },
    { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport (Ahmedabad)" },
    { code: "PNQ", name: "Pune Airport" },
    { code: "GOI", name: "Goa International Airport (Dabolim)" },
    { code: "JAI", name: "Jaipur International Airport" },
    { code: "ATQ", name: "Sri Guru Ram Dass Jee International Airport (Amritsar)" },
    { code: "VNS", name: "Lal Bahadur Shastri International Airport (Varanasi)" },
    { code: "VTZ", name: "Visakhapatnam Airport" },
    { code: "NAG", name: "Dr. Babasaheb Ambedkar International Airport (Nagpur)" },
    { code: "IXB", name: "Bagdogra Airport" },
    { code: "TRV", name: "Trivandrum International Airport" },
    { code: "IXC", name: "Chandigarh International Airport" },
    { code: "BBI", name: "Biju Patnaik International Airport (Bhubaneswar)" },
    { code: "SXR", name: "Sheikh ul-Alam International Airport (Srinagar)" },
  ],

  // United Arab Emirates
  AE: [
    { code: "DXB", name: "Dubai International Airport" },
    { code: "AUH", name: "Abu Dhabi International Airport" },
    { code: "SHJ", name: "Sharjah International Airport" },
    { code: "DWC", name: "Al Maktoum International Airport (Dubai World Central)" },
    { code: "AAN", name: "Al Ain International Airport" },
    { code: "RKT", name: "Ras Al Khaimah International Airport" },
  ],

  // China
  CN: [
    { code: "PEK", name: "Beijing Capital International Airport" },
    { code: "PKX", name: "Beijing Daxing International Airport" },
    { code: "PVG", name: "Shanghai Pudong International Airport" },
    { code: "SHA", name: "Shanghai Hongqiao International Airport" },
    { code: "CAN", name: "Guangzhou Baiyun International Airport" },
    { code: "SZX", name: "Shenzhen Bao'an International Airport" },
    { code: "CTU", name: "Chengdu Tianfu International Airport" },
    { code: "KMG", name: "Kunming Changshui International Airport" },
    { code: "XIY", name: "Xi'an Xianyang International Airport" },
    { code: "HGH", name: "Hangzhou Xiaoshan International Airport" },
    { code: "NKG", name: "Nanjing Lukou International Airport" },
    { code: "WUH", name: "Wuhan Tianhe International Airport" },
    { code: "CKG", name: "Chongqing Jiangbei International Airport" },
    { code: "TSN", name: "Tianjin Binhai International Airport" },
    { code: "TAO", name: "Qingdao Jiaodong International Airport" },
  ],

  // USA
  US: [
    { code: "JFK", name: "John F. Kennedy International Airport (New York)" },
    { code: "LAX", name: "Los Angeles International Airport" },
    { code: "ORD", name: "O'Hare International Airport (Chicago)" },
    { code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport" },
    { code: "DFW", name: "Dallas/Fort Worth International Airport" },
    { code: "MIA", name: "Miami International Airport" },
    { code: "SFO", name: "San Francisco International Airport" },
    { code: "SEA", name: "Seattle-Tacoma International Airport" },
    { code: "IAH", name: "George Bush Intercontinental Airport (Houston)" },
    { code: "EWR", name: "Newark Liberty International Airport" },
    { code: "BOS", name: "Boston Logan International Airport" },
    { code: "LAS", name: "Harry Reid International Airport (Las Vegas)" },
    { code: "MCO", name: "Orlando International Airport" },
    { code: "PHL", name: "Philadelphia International Airport" },
    { code: "CLT", name: "Charlotte Douglas International Airport" },
  ],

  // United Kingdom
  GB: [
    { code: "LHR", name: "London Heathrow Airport" },
    { code: "LGW", name: "London Gatwick Airport" },
    { code: "MAN", name: "Manchester Airport" },
    { code: "STN", name: "London Stansted Airport" },
    { code: "EDI", name: "Edinburgh Airport" },
    { code: "BHX", name: "Birmingham Airport" },
    { code: "GLA", name: "Glasgow Airport" },
    { code: "BRS", name: "Bristol Airport" },
  ],

  // Germany
  DE: [
    { code: "FRA", name: "Frankfurt Airport" },
    { code: "MUC", name: "Munich Airport" },
    { code: "DUS", name: "Düsseldorf Airport" },
    { code: "BER", name: "Berlin Brandenburg Airport" },
    { code: "HAM", name: "Hamburg Airport" },
    { code: "STR", name: "Stuttgart Airport" },
    { code: "CGN", name: "Cologne Bonn Airport" },
  ],

  // Singapore
  SG: [
    { code: "SIN", name: "Singapore Changi Airport" },
  ],

  // Malaysia
  MY: [
    { code: "KUL", name: "Kuala Lumpur International Airport" },
    { code: "PEN", name: "Penang International Airport" },
    { code: "BKI", name: "Kota Kinabalu International Airport" },
    { code: "KCH", name: "Kuching International Airport" },
  ],

  // Bangladesh
  BD: [
    { code: "DAC", name: "Hazrat Shahjalal International Airport (Dhaka)" },
    { code: "CGP", name: "Shah Amanat International Airport (Chittagong)" },
  ],

  // Pakistan
  PK: [
    { code: "KHI", name: "Jinnah International Airport (Karachi)" },
    { code: "LHE", name: "Allama Iqbal International Airport (Lahore)" },
    { code: "ISB", name: "Islamabad International Airport" },
    { code: "PEW", name: "Bacha Khan International Airport (Peshawar)" },
  ],

  // Sri Lanka
  LK: [
    { code: "CMB", name: "Bandaranaike International Airport (Colombo)" },
    { code: "HRI", name: "Mattala Rajapaksa International Airport" },
  ],

  // Nepal
  NP: [
    { code: "KTM", name: "Tribhuvan International Airport (Kathmandu)" },
  ],

  // Vietnam
  VN: [
    { code: "SGN", name: "Tan Son Nhat International Airport (Ho Chi Minh City)" },
    { code: "HAN", name: "Noi Bai International Airport (Hanoi)" },
    { code: "DAD", name: "Da Nang International Airport" },
  ],

  // Thailand
  TH: [
    { code: "BKK", name: "Suvarnabhumi Airport (Bangkok)" },
    { code: "DMK", name: "Don Mueang International Airport (Bangkok)" },
    { code: "HKT", name: "Phuket International Airport" },
    { code: "CNX", name: "Chiang Mai International Airport" },
  ],

  // Indonesia
  ID: [
    { code: "CGK", name: "Soekarno–Hatta International Airport (Jakarta)" },
    { code: "DPS", name: "Ngurah Rai International Airport (Bali)" },
    { code: "SUB", name: "Juanda International Airport (Surabaya)" },
    { code: "KNO", name: "Kualanamu International Airport (Medan)" },
  ],

  // Philippines
  PH: [
    { code: "MNL", name: "Ninoy Aquino International Airport (Manila)" },
    { code: "CEB", name: "Mactan–Cebu International Airport" },
    { code: "DVO", name: "Francisco Bangoy International Airport (Davao)" },
  ],

  // South Korea
  KR: [
    { code: "ICN", name: "Incheon International Airport" },
    { code: "GMP", name: "Gimpo International Airport" },
    { code: "PUS", name: "Gimhae International Airport (Busan)" },
  ],

  // Japan
  JP: [
    { code: "NRT", name: "Narita International Airport (Tokyo)" },
    { code: "HND", name: "Haneda Airport (Tokyo)" },
    { code: "KIX", name: "Kansai International Airport (Osaka)" },
    { code: "NGO", name: "Chubu Centrair International Airport (Nagoya)" },
    { code: "FUK", name: "Fukuoka Airport" },
    { code: "CTS", name: "New Chitose Airport (Sapporo)" },
  ],

  // Australia
  AU: [
    { code: "SYD", name: "Sydney Kingsford Smith Airport" },
    { code: "MEL", name: "Melbourne Airport" },
    { code: "BNE", name: "Brisbane Airport" },
    { code: "PER", name: "Perth Airport" },
    { code: "ADL", name: "Adelaide Airport" },
    { code: "OOL", name: "Gold Coast Airport" },
  ],

  // Saudi Arabia
  SA: [
    { code: "RUH", name: "King Khalid International Airport (Riyadh)" },
    { code: "JED", name: "King Abdulaziz International Airport (Jeddah)" },
    { code: "DMM", name: "King Fahd International Airport (Dammam)" },
    { code: "MED", name: "Prince Mohammad bin Abdulaziz Airport (Medina)" },
  ],

  // Qatar
  QA: [
    { code: "DOH", name: "Hamad International Airport (Doha)" },
  ],

  // Kuwait
  KW: [
    { code: "KWI", name: "Kuwait International Airport" },
  ],

  // Bahrain
  BH: [
    { code: "BAH", name: "Bahrain International Airport" },
  ],

  // Oman
  OM: [
    { code: "MCT", name: "Muscat International Airport" },
    { code: "SLL", name: "Salalah Airport" },
  ],

  // Turkey
  TR: [
    { code: "IST", name: "Istanbul Airport" },
    { code: "SAW", name: "Istanbul Sabiha Gökçen International Airport" },
    { code: "AYT", name: "Antalya Airport" },
    { code: "ESB", name: "Ankara Esenboğa Airport" },
    { code: "ADB", name: "Adnan Menderes Airport (İzmir)" },
  ],

  // Russia
  RU: [
    { code: "SVO", name: "Sheremetyevo International Airport (Moscow)" },
    { code: "DME", name: "Domodedovo International Airport (Moscow)" },
    { code: "VKO", name: "Vnukovo International Airport (Moscow)" },
    { code: "LED", name: "Pulkovo Airport (Saint Petersburg)" },
    { code: "OVB", name: "Tolmachevo Airport (Novosibirsk)" },
  ],

  // Egypt
  EG: [
    { code: "CAI", name: "Cairo International Airport" },
    { code: "HBE", name: "Borg El Arab Airport (Alexandria)" },
    { code: "HRG", name: "Hurghada International Airport" },
    { code: "SSH", name: "Sharm el-Sheikh International Airport" },
  ],

  // South Africa
  ZA: [
    { code: "JNB", name: "O.R. Tambo International Airport (Johannesburg)" },
    { code: "CPT", name: "Cape Town International Airport" },
    { code: "DUR", name: "King Shaka International Airport (Durban)" },
  ],

  // Kenya
  KE: [
    { code: "NBO", name: "Jomo Kenyatta International Airport (Nairobi)" },
    { code: "MBA", name: "Moi International Airport (Mombasa)" },
  ],

  // Ethiopia
  ET: [
    { code: "ADD", name: "Addis Ababa Bole International Airport" },
  ],

  // Nigeria
  NG: [
    { code: "LOS", name: "Murtala Muhammed International Airport (Lagos)" },
    { code: "ABV", name: "Nnamdi Azikiwe International Airport (Abuja)" },
    { code: "KAN", name: "Mallam Aminu Kano International Airport" },
  ],

  // Morocco
  MA: [
    { code: "CMN", name: "Mohammed V International Airport (Casablanca)" },
    { code: "RAK", name: "Marrakesh Menara Airport" },
    { code: "FEZ", name: "Fès–Saïss Airport" },
  ],

  // Netherlands
  NL: [
    { code: "AMS", name: "Amsterdam Airport Schiphol" },
  ],

  // France
  FR: [
    { code: "CDG", name: "Charles de Gaulle Airport (Paris)" },
    { code: "ORY", name: "Orly Airport (Paris)" },
    { code: "NCE", name: "Nice Côte d'Azur Airport" },
    { code: "LYS", name: "Lyon-Saint Exupéry Airport" },
  ],

  // Spain
  ES: [
    { code: "MAD", name: "Adolfo Suárez Madrid–Barajas Airport" },
    { code: "BCN", name: "Josep Tarradellas Barcelona–El Prat Airport" },
    { code: "AGP", name: "Málaga–Costa del Sol Airport" },
    { code: "ALC", name: "Alicante–Elche Miguel Hernández Airport" },
  ],

  // Italy
  IT: [
    { code: "FCO", name: "Leonardo da Vinci–Fiumicino Airport (Rome)" },
    { code: "MXP", name: "Milan Malpensa Airport" },
    { code: "LIN", name: "Milan Linate Airport" },
    { code: "VCE", name: "Venice Marco Polo Airport" },
    { code: "NAP", name: "Naples International Airport" },
  ],

  // Belgium
  BE: [
    { code: "BRU", name: "Brussels Airport" },
    { code: "LGG", name: "Liège Airport" },
  ],

  // Switzerland
  CH: [
    { code: "ZRH", name: "Zurich Airport" },
    { code: "GVA", name: "Geneva Airport" },
  ],

  // Canada
  CA: [
    { code: "YYZ", name: "Toronto Pearson International Airport" },
    { code: "YVR", name: "Vancouver International Airport" },
    { code: "YUL", name: "Montréal–Trudeau International Airport" },
    { code: "YYC", name: "Calgary International Airport" },
    { code: "YEG", name: "Edmonton International Airport" },
  ],

  // Brazil
  BR: [
    { code: "GRU", name: "São Paulo/Guarulhos–Governador André Franco Montoro International Airport" },
    { code: "BSB", name: "Presidente Juscelino Kubitscheck International Airport (Brasília)" },
    { code: "GIG", name: "Rio de Janeiro/Galeão–Antônio Carlos Jobim International Airport" },
    { code: "CNF", name: "Tancredo Neves International Airport (Belo Horizonte)" },
  ],

  // Argentina
  AR: [
    { code: "EZE", name: "Ministro Pistarini International Airport (Buenos Aires)" },
    { code: "AEP", name: "Aeroparque Jorge Newbery (Buenos Aires)" },
    { code: "COR", name: "Ingeniero Aeronáutico Ambrosio Taravella International Airport (Córdoba)" },
  ],

  // Mexico
  MX: [
    { code: "MEX", name: "Mexico City International Airport" },
    { code: "GDL", name: "Don Miguel Hidalgo y Costilla Guadalajara International Airport" },
    { code: "MTY", name: "General Mariano Escobedo International Airport (Monterrey)" },
    { code: "CUN", name: "Cancún International Airport" },
  ],

  // Hong Kong
  HK: [
    { code: "HKG", name: "Hong Kong International Airport" },
  ],

  // Taiwan
  TW: [
    { code: "TPE", name: "Taiwan Taoyuan International Airport" },
    { code: "KHH", name: "Kaohsiung International Airport" },
  ],

  // Kazakhstan
  KZ: [
    { code: "ALA", name: "Almaty International Airport" },
    { code: "NQZ", name: "Nursultan Nazarbayev International Airport (Astana)" },
  ],

  // Ukraine
  UA: [
    { code: "KBP", name: "Boryspil International Airport (Kyiv)" },
    { code: "IEV", name: "Kyiv Zhuliany International Airport" },
  ],

  // Poland
  PL: [
    { code: "WAW", name: "Warsaw Chopin Airport" },
    { code: "KRK", name: "John Paul II International Airport Kraków–Balice" },
  ],

  // Ghana
  GH: [
    { code: "ACC", name: "Kotoka International Airport (Accra)" },
  ],

  // Tanzania
  TZ: [
    { code: "DAR", name: "Julius Nyerere International Airport (Dar es Salaam)" },
    { code: "ZNZ", name: "Abeid Amani Karume International Airport (Zanzibar)" },
  ],

  // Mozambique
  MZ: [
    { code: "MPM", name: "Maputo International Airport" },
  ],

  // Zambia
  ZM: [
    { code: "LUN", name: "Kenneth Kaunda International Airport (Lusaka)" },
  ],

  // Myanmar
  MM: [
    { code: "RGN", name: "Yangon International Airport" },
  ],

  // Cambodia
  KH: [
    { code: "PNH", name: "Phnom Penh International Airport" },
    { code: "REP", name: "Siem Reap International Airport" },
  ],

  // Jordan
  JO: [
    { code: "AMM", name: "Queen Alia International Airport (Amman)" },
  ],

  // Israel
  IL: [
    { code: "TLV", name: "Ben Gurion Airport (Tel Aviv)" },
  ],

  // Iran
  IR: [
    { code: "IKA", name: "Imam Khomeini International Airport (Tehran)" },
    { code: "THR", name: "Mehrabad International Airport (Tehran)" },
    { code: "MHD", name: "Mashhad Shahid Hasheminejad International Airport" },
  ],

  // Iraq
  IQ: [
    { code: "BGW", name: "Baghdad International Airport" },
    { code: "BSR", name: "Basra International Airport" },
    { code: "EBL", name: "Erbil International Airport" },
  ],

  // Afghanistan
  AF: [
    { code: "KBL", name: "Hamid Karzai International Airport (Kabul)" },
  ],

  // Maldives
  MV: [
    { code: "MLE", name: "Velana International Airport (Malé)" },
  ],
};
