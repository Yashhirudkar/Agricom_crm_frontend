/**
 * Global seaports dataset keyed by ISO 3166-1 alpha-2 country code.
 * Source: UN/LOCODE dataset + major agricultural trade routes.
 * Filtered to ONLY include actual marine seaports, omitting dry ports and inland cities.
 * Each entry is an array of { code, name } objects.
 * - code: UN/LOCODE port code (Country + Location)
 * - name: Human-readable port name
 */
/**
 * PORTS_BY_COUNTRY
 * Master seaport reference, grouped by ISO 3166-1 alpha-2 country code.
 * Covers the primary commercial / container ports of every significant
 * maritime trading nation. Landlocked countries are intentionally omitted.
 */
export const PORTS_BY_COUNTRY = {
  // India
  IN: [
    { code: "IN BOM", name: "Mumbai Port" },
    { code: "IN NHV", name: "Nhava Sheva (JNPT)" },
    { code: "IN MUN", name: "Mundra Port" },
    { code: "IN MAA", name: "Chennai Port" },
    { code: "IN COK", name: "Cochin (Kochi) Port" },
    { code: "IN VIS", name: "Visakhapatnam Port" },
    { code: "IN KAP", name: "Kandla Port" },
    { code: "IN HLD", name: "Haldia Port" },
    { code: "IN CCU", name: "Kolkata Port" },
    { code: "IN GOA", name: "Mormugao Port (Goa)" },
    { code: "IN TPP", name: "Tuticorin (V.O. Chidambaranar) Port" },
    { code: "IN MRO", name: "Mangalore Port" },
    { code: "IN PRT", name: "Paradip Port" },
    { code: "IN HZR", name: "Hazira Port" },
    { code: "IN DPP", name: "Dahej Port" },
    { code: "IN KRQ", name: "Krishnapatnam Port" },
    { code: "IN ENR", name: "Ennore Port" },
    { code: "IN PAV", name: "Pipavav Port" },
    { code: "IN VIZ", name: "Vizhinjam International Seaport" },
    { code: "IN KAK", name: "Kakinada Port" },
    { code: "IN KTP", name: "Kattupalli Port" },
    { code: "IN KAR", name: "Karaikal Port" },
    { code: "IN DHM", name: "Dhamra Port" },
    { code: "IN GPP", name: "Gangavaram Port" },
  ],

  // United Arab Emirates
  AE: [
    { code: "AE JEA", name: "Jebel Ali Port" },
    { code: "AE AUH", name: "Abu Dhabi Port (Zayed)" },
    { code: "AE SHJ", name: "Sharjah Port (Khaled)" },
    { code: "AE DXB", name: "Dubai Port (Rashid)" },
    { code: "AE FUJ", name: "Fujairah Port" },
    { code: "AE RAK", name: "Ras Al Khaimah Port" },
    { code: "AE HAM", name: "Hamriyah Port" },
    { code: "AE KHA", name: "Khalifa Port" },
  ],

  // China
  CN: [
    { code: "CN SHA", name: "Shanghai Port" },
    { code: "CN NGO", name: "Ningbo-Zhoushan Port" },
    { code: "CN TXG", name: "Tianjin Port" },
    { code: "CN GZH", name: "Guangzhou Port (Nansha)" },
    { code: "CN SZX", name: "Shenzhen (Yantian) Port" },
    { code: "CN XMN", name: "Xiamen Port" },
    { code: "CN QDO", name: "Qingdao Port" },
    { code: "CN DLC", name: "Dalian Port" },
    { code: "CN LYG", name: "Lianyungang Port" },
    { code: "CN YIK", name: "Yingkou Port" },
    { code: "CN RIZ", name: "Rizhao Port" },
    { code: "CN FUZ", name: "Fuzhou Port" },
    { code: "CN FCG", name: "Fangchenggang Port (Beibu Gulf)" },
    { code: "CN YTA", name: "Yantai Port" },
    { code: "CN ZHA", name: "Zhanjiang Port" },
  ],

  // USA
  US: [
    { code: "US LAX", name: "Los Angeles Port" },
    { code: "US LGB", name: "Long Beach Port" },
    { code: "US NYK", name: "New York/New Jersey Port" },
    { code: "US SAV", name: "Savannah Port" },
    { code: "US HOU", name: "Houston Port" },
    { code: "US SEA", name: "Seattle Port" },
    { code: "US BAL", name: "Baltimore Port" },
    { code: "US MIA", name: "Miami Port" },
    { code: "US OAK", name: "Oakland Port" },
    { code: "US CHS", name: "Charleston Port" },
    { code: "US ORF", name: "Norfolk (Virginia) Port" },
    { code: "US EVR", name: "Port Everglades" },
    { code: "US JAX", name: "Jacksonville Port" },
    { code: "US TAC", name: "Tacoma Port" },
    { code: "US PDX", name: "Portland (Oregon) Port" },
    { code: "US MSY", name: "New Orleans Port" },
  ],

  // Russia
  RU: [
    { code: "RU VVO", name: "Vladivostok Port" },
    { code: "RU SPE", name: "Saint Petersburg Port" },
    { code: "RU NVS", name: "Novorossiysk Port" },
    { code: "RU NAK", name: "Nakhodka Port" },
    { code: "RU MUK", name: "Murmansk Port" },
    { code: "RU KGD", name: "Kaliningrad Port" },
  ],

  // Singapore
  SG: [
    { code: "SG SIN", name: "Singapore Port (PSA)" },
    { code: "SG JUR", name: "Jurong Port" },
  ],

  // Malaysia
  MY: [
    { code: "MY PEN", name: "Penang Port (Butterworth)" },
    { code: "MY PKL", name: "Port Klang (Westports)" },
    { code: "MY JOH", name: "Johor Port" },
    { code: "MY PTP", name: "Tanjung Pelepas Port (PTP)" },
    { code: "MY KUA", name: "Kuantan Port" },
    { code: "MY BTU", name: "Bintulu Port" },
  ],

  // Bangladesh
  BD: [
    { code: "BD CGP", name: "Chittagong Port" },
    { code: "BD MGL", name: "Mongla Port" },
    { code: "BD PAY", name: "Payra Port" },
    { code: "BD MTB", name: "Matarbari Port" },
  ],

  // Pakistan
  PK: [
    { code: "PK KHI", name: "Karachi Port" },
    { code: "PK BIN", name: "Port Qasim (Bin Qasim)" },
    { code: "PK GWD", name: "Gwadar Port" },
  ],

  // Sri Lanka
  LK: [
    { code: "LK CMB", name: "Colombo Port" },
    { code: "LK TRR", name: "Trincomalee Port" },
    { code: "LK HAM", name: "Hambantota Port" },
  ],

  // Vietnam
  VN: [
    { code: "VN HAN", name: "Hai Phong Port" },
    { code: "VN SGN", name: "Ho Chi Minh City Port (Cat Lai)" },
    { code: "VN DAD", name: "Da Nang Port" },
    { code: "VN CMP", name: "Cai Mep-Thi Vai Port" },
    { code: "VN UIH", name: "Quy Nhon Port" },
  ],

  // Germany
  DE: [
    { code: "DE HAM", name: "Hamburg Port" },
    { code: "DE BRE", name: "Bremen Port" },
    { code: "DE ROC", name: "Rostock Port" },
    { code: "DE WVN", name: "Wilhelmshaven Port (JadeWeserPort)" },
  ],

  // Netherlands
  NL: [
    { code: "NL RTM", name: "Rotterdam Port" },
    { code: "NL AMS", name: "Amsterdam Port" },
  ],

  // Australia
  AU: [
    { code: "AU SYD", name: "Sydney Port (Botany Bay)" },
    { code: "AU MEL", name: "Melbourne Port" },
    { code: "AU BNE", name: "Brisbane Port" },
    { code: "AU FRE", name: "Fremantle Port (Perth)" },
    { code: "AU ADL", name: "Adelaide Port" },
    { code: "AU PHE", name: "Port Hedland" },
    { code: "AU NTL", name: "Newcastle Port" },
  ],

  // Brazil
  BR: [
    { code: "BR SAN", name: "Santos Port" },
    { code: "BR PAR", name: "Paranaguá Port" },
    { code: "BR RIO", name: "Rio de Janeiro Port" },
    { code: "BR ITJ", name: "Itajaí Port" },
    { code: "BR RIG", name: "Rio Grande Port" },
    { code: "BR SSZ", name: "Itaguaí (Sepetiba) Port" },
  ],

  // South Africa
  ZA: [
    { code: "ZA DUR", name: "Durban Port" },
    { code: "ZA CPT", name: "Cape Town Port" },
    { code: "ZA PLZ", name: "Gqeberha (Port Elizabeth) Port" },
    { code: "ZA RCB", name: "Richards Bay Port" },
    { code: "ZA NGQ", name: "Ngqura Port" },
  ],

  // Saudi Arabia
  SA: [
    { code: "SA JED", name: "Jeddah Islamic Port" },
    { code: "SA DAM", name: "Ad Dammam Port (King Abdulaziz)" },
    { code: "SA JUB", name: "Jubail Industrial Port" },
    { code: "SA KAE", name: "King Abdullah Port (KAEC)" },
    { code: "SA YNB", name: "Yanbu Commercial Port" },
  ],

  // United Kingdom
  GB: [
    { code: "GB FXT", name: "Felixstowe Port" },
    { code: "GB SOT", name: "Southampton Port" },
    { code: "GB LGP", name: "London Gateway Port" },
    { code: "GB LIV", name: "Liverpool Port" },
    { code: "GB IMM", name: "Immingham Port" },
    { code: "GB TIL", name: "Tilbury Port" },
    { code: "GB BRS", name: "Bristol Port" },
  ],

  // ---------- EAST ASIA ----------

  // Japan
  JP: [
    { code: "JP TYO", name: "Tokyo Port" },
    { code: "JP YOK", name: "Yokohama Port" },
    { code: "JP NGO", name: "Nagoya Port" },
    { code: "JP OSA", name: "Osaka Port" },
    { code: "JP UKB", name: "Kobe Port" },
    { code: "JP HKT", name: "Hakata Port (Fukuoka)" },
    { code: "JP SMZ", name: "Shimizu Port" },
  ],

  // South Korea
  KR: [
    { code: "KR PUS", name: "Busan Port" },
    { code: "KR INC", name: "Incheon Port" },
    { code: "KR KAN", name: "Gwangyang Port" },
    { code: "KR USN", name: "Ulsan Port" },
  ],

  // Taiwan
  TW: [
    { code: "TW KHH", name: "Kaohsiung Port" },
    { code: "TW KEL", name: "Keelung Port" },
    { code: "TW TXG", name: "Taichung Port" },
  ],

  // Hong Kong
  HK: [{ code: "HK HKG", name: "Hong Kong Port (Kwai Tsing)" }],

  // ---------- SOUTHEAST ASIA ----------

  // Thailand
  TH: [
    { code: "TH LCH", name: "Laem Chabang Port" },
    { code: "TH BKK", name: "Bangkok Port" },
    { code: "TH MTP", name: "Map Ta Phut Port" },
  ],

  // Indonesia
  ID: [
    { code: "ID TPK", name: "Tanjung Priok Port (Jakarta)" },
    { code: "ID SUB", name: "Tanjung Perak Port (Surabaya)" },
    { code: "ID BLW", name: "Belawan Port (Medan)" },
    { code: "ID MAK", name: "Makassar Port" },
  ],

  // Philippines
  PH: [
    { code: "PH MNL", name: "Manila Port" },
    { code: "PH CEB", name: "Cebu Port" },
    { code: "PH BTG", name: "Batangas Port" },
    { code: "PH SFS", name: "Subic Bay Port" },
  ],

  // Myanmar
  MM: [
    { code: "MM RGN", name: "Yangon Port" },
    { code: "MM THL", name: "Thilawa Port" },
  ],

  // Cambodia
  KH: [
    { code: "KH KOS", name: "Sihanoukville Port" },
    { code: "KH PNH", name: "Phnom Penh Port" },
  ],

  // Brunei
  BN: [{ code: "BN MUA", name: "Muara Port" }],

  // ---------- SOUTH ASIA (ADDITIONAL) ----------

  // Maldives
  MV: [{ code: "MV MLE", name: "Malé Commercial Harbour" }],

  // ---------- MIDDLE EAST ----------

  // Qatar
  QA: [
    { code: "QA HAM", name: "Hamad Port" },
    { code: "QA DOH", name: "Doha Port" },
  ],

  // Kuwait
  KW: [
    { code: "KW SWK", name: "Shuwaikh Port" },
    { code: "KW SHU", name: "Shuaiba Port" },
    { code: "KW MAK", name: "Mubarak Al Kabeer Port" },
  ],

  // Bahrain
  BH: [
    { code: "BH MSL", name: "Khalifa Bin Salman Port" },
    { code: "BH MIN", name: "Mina Salman Port" },
  ],

  // Oman
  OM: [
    { code: "OM SLL", name: "Salalah Port" },
    { code: "OM SOH", name: "Sohar Port" },
    { code: "OM MCT", name: "Port Sultan Qaboos (Muscat)" },
    { code: "OM DQM", name: "Duqm Port" },
  ],

  // Yemen
  YE: [
    { code: "YE ADE", name: "Aden Port" },
    { code: "YE HOD", name: "Hodeidah Port" },
  ],

  // Iraq
  IQ: [
    { code: "IQ UQR", name: "Umm Qasr Port" },
    { code: "IQ BSR", name: "Basra Port" },
  ],

  // Iran
  IR: [
    { code: "IR BND", name: "Bandar Abbas Port" },
    { code: "IR BIK", name: "Bandar Imam Khomeini Port" },
    { code: "IR CHB", name: "Chabahar Port" },
  ],

  // Israel
  IL: [
    { code: "IL HFA", name: "Haifa Port" },
    { code: "IL ASH", name: "Ashdod Port" },
    { code: "IL ELT", name: "Eilat Port" },
  ],

  // Jordan
  JO: [{ code: "JO AQJ", name: "Aqaba Port" }],

  // Turkey
  TR: [
    { code: "TR AMB", name: "Ambarli Port (Istanbul)" },
    { code: "TR MER", name: "Mersin Port" },
    { code: "TR IZM", name: "Izmir Port (Alsancak)" },
    { code: "TR ISK", name: "Iskenderun Port" },
  ],

  // Cyprus
  CY: [{ code: "CY LIM", name: "Limassol Port" }],

  // Lebanon
  LB: [
    { code: "LB BEY", name: "Beirut Port" },
    { code: "LB TRI", name: "Tripoli Port" },
  ],

  // Syria
  SY: [
    { code: "SY LTK", name: "Latakia Port" },
    { code: "SY TTS", name: "Tartus Port" },
  ],

  // ---------- CAUCASUS & CENTRAL ASIA ----------

  // Georgia
  GE: [
    { code: "GE POT", name: "Poti Port" },
    { code: "GE BUS", name: "Batumi Port" },
  ],

  // Azerbaijan
  AZ: [{ code: "AZ BAK", name: "Baku Port" }],

  // Kazakhstan
  KZ: [
    { code: "KZ AKT", name: "Aktau Port" },
    { code: "KZ KUR", name: "Kuryk Port" },
  ],

  // ---------- AFRICA ----------

  // Egypt
  EG: [
    { code: "EG ALY", name: "Alexandria Port" },
    { code: "EG PSD", name: "Port Said" },
    { code: "EG DAM", name: "Damietta Port" },
    { code: "EG SUZ", name: "Suez Port" },
    { code: "EG SOK", name: "Sokhna Port (Ain Sokhna)" },
  ],

  // Morocco
  MA: [
    { code: "MA TNG", name: "Tangier Med Port" },
    { code: "MA CAS", name: "Casablanca Port" },
    { code: "MA AGA", name: "Agadir Port" },
  ],

  // Algeria
  DZ: [
    { code: "DZ ALG", name: "Algiers Port" },
    { code: "DZ ORN", name: "Oran Port" },
    { code: "DZ BJA", name: "Bejaia Port" },
  ],

  // Tunisia
  TN: [
    { code: "TN RDS", name: "Rades Port" },
    { code: "TN SFA", name: "Sfax Port" },
  ],

  // Libya
  LY: [
    { code: "LY TIP", name: "Tripoli Port" },
    { code: "LY BEN", name: "Benghazi Port" },
  ],

  // Nigeria
  NG: [
    { code: "NG APP", name: "Apapa Port (Lagos)" },
    { code: "NG TCI", name: "Tin Can Island Port (Lagos)" },
    { code: "NG LEK", name: "Lekki Deep Sea Port" },
    { code: "NG PHC", name: "Port Harcourt Port" },
    { code: "NG ONN", name: "Onne Port" },
  ],

  // Ghana
  GH: [
    { code: "GH TEM", name: "Tema Port" },
    { code: "GH TAK", name: "Takoradi Port" },
  ],

  // Ivory Coast
  CI: [
    { code: "CI ABJ", name: "Abidjan Port" },
    { code: "CI SPY", name: "San Pedro Port" },
  ],

  // Mauritania
  MR: [{ code: "MR NKC", name: "Nouakchott Port" }],

  // Gambia
  GM: [{ code: "GM BJL", name: "Banjul Port" }],

  // Senegal
  SN: [{ code: "SN DKR", name: "Dakar Port" }],

  // Guinea
  GN: [{ code: "GN CKY", name: "Conakry Port" }],

  // Sierra Leone
  SL: [{ code: "SL FNA", name: "Freetown Port" }],

  // Liberia
  LR: [{ code: "LR MLW", name: "Monrovia Port" }],

  // Togo
  TG: [{ code: "TG LFW", name: "Lomé Port" }],

  // Benin
  BJ: [{ code: "BJ COO", name: "Cotonou Port" }],

  // Cameroon
  CM: [
    { code: "CM DLA", name: "Douala Port" },
    { code: "CM KBI", name: "Kribi Port" },
  ],

  // Equatorial Guinea
  GQ: [
    { code: "GQ SSG", name: "Malabo Port" },
    { code: "GQ BSG", name: "Bata Port" },
  ],

  // Gabon
  GA: [
    { code: "GA LBV", name: "Owendo Port" },
    { code: "GA POG", name: "Port-Gentil Port" },
  ],

  // Angola
  AO: [
    { code: "AO LAD", name: "Luanda Port" },
    { code: "AO LOB", name: "Lobito Port" },
  ],

  // DR Congo
  CD: [
    { code: "CD MAT", name: "Matadi Port" },
    { code: "CD BOA", name: "Boma Port" },
  ],

  // Congo Republic
  CG: [{ code: "CG PNR", name: "Pointe-Noire Port" }],

  // Kenya
  KE: [
    { code: "KE MBA", name: "Mombasa Port" },
    { code: "KE LAM", name: "Lamu Port" },
  ],

  // Tanzania
  TZ: [
    { code: "TZ DAR", name: "Dar es Salaam Port" },
    { code: "TZ ZNZ", name: "Zanzibar Port" },
  ],

  // Mozambique
  MZ: [
    { code: "MZ MPM", name: "Maputo Port" },
    { code: "MZ BEW", name: "Beira Port" },
    { code: "MZ NAC", name: "Nacala Port" },
  ],

  // Djibouti
  DJ: [
    { code: "DJ JIB", name: "Djibouti Port" },
    { code: "DJ DOR", name: "Doraleh Port" },
  ],

  // Eritrea
  ER: [{ code: "ER MSW", name: "Massawa Port" }],

  // Somalia
  SO: [
    { code: "SO MGQ", name: "Mogadishu Port" },
    { code: "SO BBO", name: "Berbera Port" },
  ],

  // Sudan
  SD: [{ code: "SD PZU", name: "Port Sudan" }],

  // Namibia
  NA: [{ code: "NA WVB", name: "Walvis Bay Port" }],

  // Mauritius
  MU: [{ code: "MU PLU", name: "Port Louis" }],

  // Madagascar
  MG: [{ code: "MG TOA", name: "Toamasina Port" }],

  // Réunion
  RE: [{ code: "RE PDG", name: "Port Réunion (Le Port)" }],

  // ---------- EUROPE (ADDITIONAL) ----------

  // France
  FR: [
    { code: "FR LEH", name: "Le Havre Port" },
    { code: "FR MRS", name: "Marseille-Fos Port" },
    { code: "FR DKK", name: "Dunkirk Port" },
    { code: "FR CQF", name: "Calais Port" },
  ],

  // Italy
  IT: [
    { code: "IT GOA", name: "Genoa Port" },
    { code: "IT GIT", name: "Gioia Tauro Port" },
    { code: "IT SPE", name: "La Spezia Port" },
    { code: "IT TRS", name: "Trieste Port" },
    { code: "IT NAP", name: "Naples Port" },
    { code: "IT LIV", name: "Livorno Port" },
  ],

  // Spain
  ES: [
    { code: "ES VLC", name: "Valencia Port" },
    { code: "ES ALG", name: "Algeciras Port" },
    { code: "ES BCN", name: "Barcelona Port" },
    { code: "ES BIO", name: "Bilbao Port" },
    { code: "ES LPA", name: "Las Palmas Port" },
  ],

  // Belgium
  BE: [
    { code: "BE ANR", name: "Antwerp Port" },
    { code: "BE ZEE", name: "Zeebrugge Port" },
    { code: "BE GNE", name: "Ghent Port" },
  ],

  // Portugal
  PT: [
    { code: "PT LIS", name: "Lisbon Port" },
    { code: "PT SIE", name: "Sines Port" },
    { code: "PT LEI", name: "Leixões Port (Porto)" },
  ],

  // Greece
  GR: [
    { code: "GR PIR", name: "Piraeus Port" },
    { code: "GR SKG", name: "Thessaloniki Port" },
  ],

  // Poland
  PL: [
    { code: "PL GDN", name: "Gdansk Port" },
    { code: "PL GDY", name: "Gdynia Port" },
    { code: "PL SZZ", name: "Szczecin Port" },
  ],

  // Sweden
  SE: [
    { code: "SE GOT", name: "Gothenburg Port" },
    { code: "SE STO", name: "Stockholm Port" },
  ],

  // Norway
  NO: [
    { code: "NO OSL", name: "Oslo Port" },
    { code: "NO BGO", name: "Bergen Port" },
  ],

  // Denmark
  DK: [
    { code: "DK CPH", name: "Copenhagen Port" },
    { code: "DK AAR", name: "Aarhus Port" },
  ],

  // Finland
  FI: [
    { code: "FI HEL", name: "Helsinki Port" },
    { code: "FI KTK", name: "Kotka Port (HaminaKotka)" },
  ],

  // Ireland
  IE: [
    { code: "IE DUB", name: "Dublin Port" },
    { code: "IE ORK", name: "Cork Port" },
  ],

  // Ukraine
  UA: [
    { code: "UA ODS", name: "Odessa Port" },
    { code: "UA YUZ", name: "Yuzhne Port" },
  ],

  // Romania
  RO: [{ code: "RO CND", name: "Constanta Port" }],

  // Bulgaria
  BG: [
    { code: "BG VAR", name: "Varna Port" },
    { code: "BG BOJ", name: "Burgas Port" },
  ],

  // Croatia
  HR: [{ code: "HR RJK", name: "Rijeka Port" }],

  // Malta
  MT: [
    { code: "MT MAR", name: "Marsaxlokk Port (Malta Freeport)" },
    { code: "MT VAL", name: "Valletta Port" },
  ],

  // Estonia
  EE: [
    { code: "EE TLL", name: "Tallinn Port" },
    { code: "EE PRN", name: "Pärnu Port" },
  ],

  // Latvia
  LV: [
    { code: "LV RIX", name: "Riga Port" },
    { code: "LV VNT", name: "Ventspils Port" },
    { code: "LV LPX", name: "Liepāja Port" },
  ],

  // Lithuania
  LT: [{ code: "LT KLJ", name: "Klaipėda Port" }],

  // Slovenia
  SI: [{ code: "SI KOP", name: "Koper Port" }],

  // Albania
  AL: [{ code: "AL DUR", name: "Durrës Port" }],

  // Montenegro
  ME: [{ code: "ME BAR", name: "Bar Port" }],

  // Iceland
  IS: [{ code: "IS REY", name: "Reykjavík Port" }],

  // ---------- NORTH AMERICA (ADDITIONAL) ----------

  // Canada
  CA: [
    { code: "CA VAN", name: "Vancouver Port" },
    { code: "CA MTR", name: "Montreal Port" },
    { code: "CA HAL", name: "Halifax Port" },
    { code: "CA PRU", name: "Prince Rupert Port" },
  ],

  // Mexico
  MX: [
    { code: "MX ZLO", name: "Manzanillo Port" },
    { code: "MX VER", name: "Veracruz Port" },
    { code: "MX LZC", name: "Lázaro Cárdenas Port" },
    { code: "MX ALT", name: "Altamira Port" },
    { code: "MX ENS", name: "Ensenada Port" },
  ],

  // ---------- CENTRAL AMERICA & CARIBBEAN ----------

  // Panama
  PA: [
    { code: "PA BLB", name: "Balboa Port" },
    { code: "PA CRI", name: "Colón Port (Cristóbal)" },
  ],

  // Costa Rica
  CR: [
    { code: "CR LIO", name: "Limón-Moín Port" },
    { code: "CR CAL", name: "Caldera Port" },
  ],

  // Guatemala
  GT: [
    { code: "GT PRQ", name: "Puerto Quetzal" },
    { code: "GT STC", name: "Santo Tomás de Castilla" },
  ],

  // Honduras
  HN: [{ code: "HN PCR", name: "Puerto Cortés" }],

  // Nicaragua
  NI: [{ code: "NI COR", name: "Corinto Port" }],

  // El Salvador
  SV: [{ code: "SV ACJ", name: "Acajutla Port" }],

  // Belize
  BZ: [{ code: "BZ BZE", name: "Belize City Port" }],

  // Jamaica
  JM: [{ code: "JM KIN", name: "Kingston Port" }],

  // Dominican Republic
  DO: [
    { code: "DO CAU", name: "Caucedo Port" },
    { code: "DO SDQ", name: "Santo Domingo Port" },
  ],

  // Bahamas
  BS: [{ code: "BS FPO", name: "Freeport Port" }],

  // Cuba
  CU: [
    { code: "CU MRL", name: "Mariel Port" },
    { code: "CU HAV", name: "Havana Port" },
  ],

  // Trinidad and Tobago
  TT: [{ code: "TT POS", name: "Port of Spain" }],

  // Haiti
  HT: [{ code: "HT PAP", name: "Port-au-Prince Port" }],

  // Barbados
  BB: [{ code: "BB BGI", name: "Bridgetown Port" }],

  // Curaçao
  CW: [{ code: "CW CUR", name: "Willemstad Port (Curaçao)" }],

  // Puerto Rico
  PR: [{ code: "PR SJU", name: "San Juan Port" }],

  // ---------- SOUTH AMERICA (ADDITIONAL) ----------

  // Argentina
  AR: [
    { code: "AR BUE", name: "Buenos Aires Port" },
    { code: "AR ROS", name: "Rosario Port" },
  ],

  // Chile
  CL: [
    { code: "CL VAP", name: "Valparaíso Port" },
    { code: "CL SAI", name: "San Antonio Port" },
  ],

  // Peru
  PE: [{ code: "PE CLL", name: "Callao Port" }],

  // Colombia
  CO: [
    { code: "CO CTG", name: "Cartagena Port" },
    { code: "CO BUN", name: "Buenaventura Port" },
    { code: "CO BAQ", name: "Barranquilla Port" },
  ],

  // Ecuador
  EC: [{ code: "EC GYE", name: "Guayaquil Port" }],

  // Uruguay
  UY: [{ code: "UY MVD", name: "Montevideo Port" }],

  // Venezuela
  VE: [
    { code: "VE LGV", name: "La Guaira Port" },
    { code: "VE PBL", name: "Puerto Cabello Port" },
  ],

  // Guyana
  GY: [{ code: "GY GEO", name: "Georgetown Port" }],

  // Suriname
  SR: [{ code: "SR PBM", name: "Paramaribo Port" }],

  // ---------- OCEANIA (ADDITIONAL) ----------

  // New Zealand
  NZ: [
    { code: "NZ AKL", name: "Auckland Port" },
    { code: "NZ TRG", name: "Tauranga Port" },
    { code: "NZ WLG", name: "Wellington Port" },
  ],

  // Papua New Guinea
  PG: [{ code: "PG POM", name: "Port Moresby" }],

  // Fiji
  FJ: [{ code: "FJ SUV", name: "Suva Port" }],

  // French Polynesia
  PF: [{ code: "PF PPT", name: "Papeete Port" }],

  // New Caledonia
  NC: [{ code: "NC NOU", name: "Nouméa Port" }],
};
/**
 * Get ports for a given ISO2 country code.
 * @param {string} iso2Code - Two-letter ISO country code (e.g. "IN", "AE")
 * @returns {Array<{code: string, name: string}>} - Array of port objects, or empty array
 */
export function getPortsByCountryCode(iso2Code) {
  if (!iso2Code) return [];
  const code = iso2Code.toUpperCase();
  const ports = PORTS_BY_COUNTRY[code] || [];

  // Sort alphabetically
  return [...ports].sort((a, b) => a.name.localeCompare(b.name));
}
