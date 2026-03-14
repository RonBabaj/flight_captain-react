/**
 * Comprehensive airport dictionary for From/To autocomplete.
 * ~500 major commercial airports worldwide, covering all continents.
 * Localized city and airport names for Hebrew (he) and Russian (ru) where available.
 * Search works offline; results are Amadeus/IATA-ready codes.
 */

import type { AirportCityResult } from '../types';
import type { LanguageCode } from './translations';

export const AIRPORT_DICTIONARY: AirportCityResult[] = [
  // ── Israel ──────────────────────────────────────────────────────────────────
  { id: 'TLV', type: 'AIRPORT', airportCode: 'TLV', cityCode: 'TLV', name: 'Ben Gurion Intl', cityName: 'Tel Aviv', countryCode: 'IL', cityNameHe: 'תל אביב', cityNameRu: 'Тель-Авив', nameHe: 'נמל תעופה בן גוריון', nameRu: 'Аэропорт Бен-Гурион' },
  { id: 'HFA', type: 'AIRPORT', airportCode: 'HFA', cityCode: 'HFA', name: 'Haifa Intl', cityName: 'Haifa', countryCode: 'IL', cityNameHe: 'חיפה', cityNameRu: 'Хайфа' },
  { id: 'ETH', type: 'AIRPORT', airportCode: 'ETH', cityCode: 'ETH', name: 'Eilat J. Hozman', cityName: 'Eilat', countryCode: 'IL', cityNameHe: 'אילת', cityNameRu: 'Эйлат' },
  { id: 'VDA', type: 'AIRPORT', airportCode: 'VDA', cityCode: 'ETH', name: 'Ovda (Ramon Intl)', cityName: 'Eilat', countryCode: 'IL', cityNameHe: 'אילת (עובדה)', cityNameRu: 'Эйлат (Овда)' },
  { id: 'MHH', type: 'AIRPORT', airportCode: 'MHH', cityCode: 'MHH', name: 'Rosh Pina Airport', cityName: 'Rosh Pina', countryCode: 'IL', cityNameHe: 'ראש פינה', cityNameRu: 'Рош-Пина' },
  { id: 'SDV', type: 'AIRPORT', airportCode: 'SDV', cityCode: 'TLV', name: 'Sde Dov Airport', cityName: 'Tel Aviv', countryCode: 'IL', cityNameHe: 'שדה דב', cityNameRu: 'Тель-Авив Сде-Дов' },

  // ── Middle East ──────────────────────────────────────────────────────────────
  { id: 'AMM', type: 'AIRPORT', airportCode: 'AMM', cityCode: 'AMM', name: 'Queen Alia Intl', cityName: 'Amman', countryCode: 'JO', cityNameHe: 'עמאן', cityNameRu: 'Амман' },
  { id: 'AQJ', type: 'AIRPORT', airportCode: 'AQJ', cityCode: 'AQJ', name: 'Aqaba King Hussein Intl', cityName: 'Aqaba', countryCode: 'JO', cityNameHe: 'עקבה', cityNameRu: 'Акаба' },
  { id: 'BEY', type: 'AIRPORT', airportCode: 'BEY', cityCode: 'BEY', name: 'Beirut Rafic Hariri Intl', cityName: 'Beirut', countryCode: 'LB', cityNameHe: 'ביירות', cityNameRu: 'Бейрут' },
  { id: 'DXB', type: 'AIRPORT', airportCode: 'DXB', cityCode: 'DXB', name: 'Dubai Intl', cityName: 'Dubai', countryCode: 'AE', cityNameHe: 'דובאי', cityNameRu: 'Дубай' },
  { id: 'AUH', type: 'AIRPORT', airportCode: 'AUH', cityCode: 'AUH', name: 'Abu Dhabi Intl', cityName: 'Abu Dhabi', countryCode: 'AE', cityNameHe: 'אבו דאבי', cityNameRu: 'Абу-Даби' },
  { id: 'SHJ', type: 'AIRPORT', airportCode: 'SHJ', cityCode: 'SHJ', name: 'Sharjah Intl', cityName: 'Sharjah', countryCode: 'AE', cityNameHe: 'שארג\'ה', cityNameRu: 'Шарджа' },
  { id: 'DOH', type: 'AIRPORT', airportCode: 'DOH', cityCode: 'DOH', name: 'Hamad Intl', cityName: 'Doha', countryCode: 'QA', cityNameHe: 'דוחה', cityNameRu: 'Доха' },
  { id: 'BAH', type: 'AIRPORT', airportCode: 'BAH', cityCode: 'BAH', name: 'Bahrain Intl', cityName: 'Manama', countryCode: 'BH', cityNameHe: 'מנמה', cityNameRu: 'Манама' },
  { id: 'KWI', type: 'AIRPORT', airportCode: 'KWI', cityCode: 'KWI', name: 'Kuwait Intl', cityName: 'Kuwait City', countryCode: 'KW', cityNameHe: 'כווית סיטי', cityNameRu: 'Эль-Кувейт' },
  { id: 'MCT', type: 'AIRPORT', airportCode: 'MCT', cityCode: 'MCT', name: 'Muscat Intl', cityName: 'Muscat', countryCode: 'OM', cityNameHe: 'מוסקט', cityNameRu: 'Маскат' },
  { id: 'RUH', type: 'AIRPORT', airportCode: 'RUH', cityCode: 'RUH', name: 'King Khalid Intl', cityName: 'Riyadh', countryCode: 'SA', cityNameHe: 'ריאד', cityNameRu: 'Эр-Рияд' },
  { id: 'JED', type: 'AIRPORT', airportCode: 'JED', cityCode: 'JED', name: 'King Abdulaziz Intl', cityName: 'Jeddah', countryCode: 'SA', cityNameHe: 'ג\'דה', cityNameRu: 'Джидда' },
  { id: 'MED', type: 'AIRPORT', airportCode: 'MED', cityCode: 'MED', name: 'Prince Mohammad bin Abdulaziz Intl', cityName: 'Medina', countryCode: 'SA', cityNameHe: 'מדינה', cityNameRu: 'Медина' },
  { id: 'DMM', type: 'AIRPORT', airportCode: 'DMM', cityCode: 'DMM', name: 'King Fahd Intl', cityName: 'Dammam', countryCode: 'SA', cityNameHe: 'דמאם', cityNameRu: 'Даммам' },
  { id: 'IKA', type: 'AIRPORT', airportCode: 'IKA', cityCode: 'THR', name: 'Imam Khomeini Intl', cityName: 'Tehran', countryCode: 'IR', cityNameHe: 'טהראן', cityNameRu: 'Тегеран' },
  { id: 'MHD', type: 'AIRPORT', airportCode: 'MHD', cityCode: 'MHD', name: 'Mashhad Intl', cityName: 'Mashhad', countryCode: 'IR', cityNameHe: 'משהד', cityNameRu: 'Мешхед' },
  { id: 'IST', type: 'AIRPORT', airportCode: 'IST', cityCode: 'IST', name: 'Istanbul Airport', cityName: 'Istanbul', countryCode: 'TR', cityNameHe: 'איסטנבול', cityNameRu: 'Стамбул' },
  { id: 'SAW', type: 'AIRPORT', airportCode: 'SAW', cityCode: 'IST', name: 'Istanbul Sabiha Gökçen', cityName: 'Istanbul', countryCode: 'TR', cityNameHe: 'איסטנבול (סביחה)', cityNameRu: 'Стамбул (Сабиха)' },
  { id: 'ADB', type: 'AIRPORT', airportCode: 'ADB', cityCode: 'IZM', name: 'Adnan Menderes Intl', cityName: 'Izmir', countryCode: 'TR', cityNameHe: 'איזמיר', cityNameRu: 'Измир' },
  { id: 'ESB', type: 'AIRPORT', airportCode: 'ESB', cityCode: 'ANK', name: 'Ankara Esenboga Intl', cityName: 'Ankara', countryCode: 'TR', cityNameHe: 'אנקרה', cityNameRu: 'Анкара' },
  { id: 'AYT', type: 'AIRPORT', airportCode: 'AYT', cityCode: 'AYT', name: 'Antalya Intl', cityName: 'Antalya', countryCode: 'TR', cityNameHe: 'אנטליה', cityNameRu: 'Анталья' },
  { id: 'DLM', type: 'AIRPORT', airportCode: 'DLM', cityCode: 'DLM', name: 'Dalaman Intl', cityName: 'Dalaman', countryCode: 'TR', cityNameHe: 'דאלמן', cityNameRu: 'Даламан' },
  { id: 'BJV', type: 'AIRPORT', airportCode: 'BJV', cityCode: 'MIL', name: 'Milas-Bodrum Intl', cityName: 'Bodrum', countryCode: 'TR', cityNameHe: 'בודרום', cityNameRu: 'Бодрум' },
  { id: 'TZX', type: 'AIRPORT', airportCode: 'TZX', cityCode: 'TZX', name: 'Trabzon Airport', cityName: 'Trabzon', countryCode: 'TR', cityNameHe: 'טרבזון', cityNameRu: 'Трабзон' },
  { id: 'GZT', type: 'AIRPORT', airportCode: 'GZT', cityCode: 'GZT', name: 'Gaziantep Oğuzeli Intl', cityName: 'Gaziantep', countryCode: 'TR', cityNameHe: 'גזיאנטפ', cityNameRu: 'Газиантеп' },
  { id: 'BGW', type: 'AIRPORT', airportCode: 'BGW', cityCode: 'BGW', name: 'Baghdad Intl', cityName: 'Baghdad', countryCode: 'IQ', cityNameHe: 'בגדד', cityNameRu: 'Багдад' },
  { id: 'EBL', type: 'AIRPORT', airportCode: 'EBL', cityCode: 'EBL', name: 'Erbil Intl', cityName: 'Erbil', countryCode: 'IQ', cityNameHe: 'ארביל', cityNameRu: 'Эрбиль' },
  { id: 'BSR', type: 'AIRPORT', airportCode: 'BSR', cityCode: 'BSR', name: 'Basra Intl', cityName: 'Basra', countryCode: 'IQ', cityNameHe: 'בצרה', cityNameRu: 'Басра' },

  // ── Egypt ────────────────────────────────────────────────────────────────────
  { id: 'CAI', type: 'AIRPORT', airportCode: 'CAI', cityCode: 'CAI', name: 'Cairo Intl', cityName: 'Cairo', countryCode: 'EG', cityNameHe: 'קהיר', cityNameRu: 'Каир' },
  { id: 'HRG', type: 'AIRPORT', airportCode: 'HRG', cityCode: 'HRG', name: 'Hurghada Intl', cityName: 'Hurghada', countryCode: 'EG', cityNameHe: 'הורגאדה', cityNameRu: 'Хургада' },
  { id: 'SSH', type: 'AIRPORT', airportCode: 'SSH', cityCode: 'SSH', name: 'Sharm el-Sheikh Intl', cityName: 'Sharm el-Sheikh', countryCode: 'EG', cityNameHe: 'שארם אל-שייח', cityNameRu: 'Шарм-эль-Шейх' },
  { id: 'LXR', type: 'AIRPORT', airportCode: 'LXR', cityCode: 'LXR', name: 'Luxor Intl', cityName: 'Luxor', countryCode: 'EG', cityNameHe: 'לוקסור', cityNameRu: 'Луксор' },
  { id: 'ASW', type: 'AIRPORT', airportCode: 'ASW', cityCode: 'ASW', name: 'Aswan Intl', cityName: 'Aswan', countryCode: 'EG', cityNameHe: 'אסואן', cityNameRu: 'Асуан' },
  { id: 'RMF', type: 'AIRPORT', airportCode: 'RMF', cityCode: 'RMF', name: 'Marsa Alam Intl', cityName: 'Marsa Alam', countryCode: 'EG', cityNameHe: 'מרסה אלם', cityNameRu: 'Марса-Алам' },
  { id: 'ATZ', type: 'AIRPORT', airportCode: 'ATZ', cityCode: 'ATZ', name: 'Asyut Airport', cityName: 'Asyut', countryCode: 'EG', cityNameRu: 'Асьют' },
  { id: 'HBE', type: 'AIRPORT', airportCode: 'HBE', cityCode: 'ALY', name: 'Alexandria Borg El Arab Intl', cityName: 'Alexandria', countryCode: 'EG', cityNameHe: 'אלכסנדריה', cityNameRu: 'Александрия' },

  // ── North Africa ─────────────────────────────────────────────────────────────
  { id: 'CMN', type: 'AIRPORT', airportCode: 'CMN', cityCode: 'CAS', name: 'Casablanca Mohammed V Intl', cityName: 'Casablanca', countryCode: 'MA', cityNameHe: 'קזבלנקה', cityNameRu: 'Касабланка' },
  { id: 'RAK', type: 'AIRPORT', airportCode: 'RAK', cityCode: 'RAK', name: 'Marrakesh Menara', cityName: 'Marrakesh', countryCode: 'MA', cityNameHe: 'מרקש', cityNameRu: 'Марракеш' },
  { id: 'AGA', type: 'AIRPORT', airportCode: 'AGA', cityCode: 'AGA', name: 'Agadir Al Massira', cityName: 'Agadir', countryCode: 'MA', cityNameHe: 'אגאדיר', cityNameRu: 'Агадир' },
  { id: 'FEZ', type: 'AIRPORT', airportCode: 'FEZ', cityCode: 'FEZ', name: 'Fes-Saiss Airport', cityName: 'Fez', countryCode: 'MA', cityNameRu: 'Фес' },
  { id: 'TUN', type: 'AIRPORT', airportCode: 'TUN', cityCode: 'TUN', name: 'Tunis-Carthage Intl', cityName: 'Tunis', countryCode: 'TN', cityNameHe: 'תוניס', cityNameRu: 'Тунис' },
  { id: 'MIR', type: 'AIRPORT', airportCode: 'MIR', cityCode: 'MIR', name: 'Monastir Habib Bourguiba', cityName: 'Monastir', countryCode: 'TN', cityNameRu: 'Монастир' },
  { id: 'DJE', type: 'AIRPORT', airportCode: 'DJE', cityCode: 'DJE', name: 'Djerba-Zarzis Intl', cityName: 'Djerba', countryCode: 'TN', cityNameHe: 'ג\'רבה', cityNameRu: 'Джерба' },
  { id: 'ALG', type: 'AIRPORT', airportCode: 'ALG', cityCode: 'ALG', name: 'Algiers Houari Boumediene Intl', cityName: 'Algiers', countryCode: 'DZ', cityNameHe: 'אלג\'יר', cityNameRu: 'Алжир' },
  { id: 'TRI', type: 'AIRPORT', airportCode: 'TRI', cityCode: 'TRI', name: 'Tripoli Intl', cityName: 'Tripoli', countryCode: 'LY', cityNameRu: 'Триполи' },

  // ── Sub-Saharan Africa ────────────────────────────────────────────────────────
  { id: 'ADD', type: 'AIRPORT', airportCode: 'ADD', cityCode: 'ADD', name: 'Addis Ababa Bole Intl', cityName: 'Addis Ababa', countryCode: 'ET', cityNameHe: 'אדיס אבבה', cityNameRu: 'Аддис-Абеба' },
  { id: 'NBO', type: 'AIRPORT', airportCode: 'NBO', cityCode: 'NBO', name: 'Nairobi Jomo Kenyatta Intl', cityName: 'Nairobi', countryCode: 'KE', cityNameHe: 'ניירובי', cityNameRu: 'Найроби' },
  { id: 'MBA', type: 'AIRPORT', airportCode: 'MBA', cityCode: 'MBA', name: 'Mombasa Moi Intl', cityName: 'Mombasa', countryCode: 'KE', cityNameRu: 'Момбаса' },
  { id: 'DAR', type: 'AIRPORT', airportCode: 'DAR', cityCode: 'DAR', name: 'Julius Nyerere Intl', cityName: 'Dar es Salaam', countryCode: 'TZ', cityNameHe: 'דאר א-סלאם', cityNameRu: 'Дар-эс-Салам' },
  { id: 'ZNZ', type: 'AIRPORT', airportCode: 'ZNZ', cityCode: 'ZNZ', name: 'Abeid Amani Karume Intl', cityName: 'Zanzibar', countryCode: 'TZ', cityNameHe: 'זנזיבר', cityNameRu: 'Занзибар' },
  { id: 'JRO', type: 'AIRPORT', airportCode: 'JRO', cityCode: 'JRO', name: 'Kilimanjaro Intl', cityName: 'Kilimanjaro', countryCode: 'TZ', cityNameRu: 'Килиманджаро' },
  { id: 'JNB', type: 'AIRPORT', airportCode: 'JNB', cityCode: 'JNB', name: 'O.R. Tambo Intl', cityName: 'Johannesburg', countryCode: 'ZA', cityNameHe: 'יוהנסבורג', cityNameRu: 'Йоханнесбург' },
  { id: 'CPT', type: 'AIRPORT', airportCode: 'CPT', cityCode: 'CPT', name: 'Cape Town Intl', cityName: 'Cape Town', countryCode: 'ZA', cityNameHe: 'קייפטאון', cityNameRu: 'Кейптаун' },
  { id: 'DUR', type: 'AIRPORT', airportCode: 'DUR', cityCode: 'DUR', name: 'King Shaka Intl', cityName: 'Durban', countryCode: 'ZA', cityNameRu: 'Дурбан' },
  { id: 'LOS', type: 'AIRPORT', airportCode: 'LOS', cityCode: 'LOS', name: 'Murtala Muhammed Intl', cityName: 'Lagos', countryCode: 'NG', cityNameHe: 'לאגוס', cityNameRu: 'Лагос' },
  { id: 'ABV', type: 'AIRPORT', airportCode: 'ABV', cityCode: 'ABV', name: 'Nnamdi Azikiwe Intl', cityName: 'Abuja', countryCode: 'NG', cityNameRu: 'Абуджа' },
  { id: 'ACC', type: 'AIRPORT', airportCode: 'ACC', cityCode: 'ACC', name: 'Kotoka Intl', cityName: 'Accra', countryCode: 'GH', cityNameHe: 'אקרה', cityNameRu: 'Аккра' },
  { id: 'ABJ', type: 'AIRPORT', airportCode: 'ABJ', cityCode: 'ABJ', name: 'Félix-Houphouët-Boigny Intl', cityName: 'Abidjan', countryCode: 'CI', cityNameRu: 'Абиджан' },
  { id: 'DKR', type: 'AIRPORT', airportCode: 'DKR', cityCode: 'DKR', name: 'Blaise Diagne Intl', cityName: 'Dakar', countryCode: 'SN', cityNameHe: 'דקר', cityNameRu: 'Дакар' },
  { id: 'KGL', type: 'AIRPORT', airportCode: 'KGL', cityCode: 'KGL', name: 'Kigali Intl', cityName: 'Kigali', countryCode: 'RW', cityNameRu: 'Кигали' },
  { id: 'EBB', type: 'AIRPORT', airportCode: 'EBB', cityCode: 'KAM', name: 'Entebbe Intl', cityName: 'Kampala', countryCode: 'UG', cityNameRu: 'Кампала' },
  { id: 'TNR', type: 'AIRPORT', airportCode: 'TNR', cityCode: 'TNR', name: 'Antananarivo Ivato Intl', cityName: 'Antananarivo', countryCode: 'MG', cityNameRu: 'Антананариву' },
  { id: 'MRU', type: 'AIRPORT', airportCode: 'MRU', cityCode: 'MRU', name: 'Sir Seewoosagur Ramgoolam Intl', cityName: 'Mauritius', countryCode: 'MU', cityNameHe: 'מאוריציוס', cityNameRu: 'Маврикий' },

  // ── Greece ────────────────────────────────────────────────────────────────────
  { id: 'ATH', type: 'AIRPORT', airportCode: 'ATH', cityCode: 'ATH', name: 'Athens Eleftherios Venizelos Intl', cityName: 'Athens', countryCode: 'GR', cityNameHe: 'אתונה', cityNameRu: 'Афины' },
  { id: 'SKG', type: 'AIRPORT', airportCode: 'SKG', cityCode: 'SKG', name: 'Thessaloniki Makedonia Intl', cityName: 'Thessaloniki', countryCode: 'GR', cityNameHe: 'תסלוניקי', cityNameRu: 'Салоники' },
  { id: 'HER', type: 'AIRPORT', airportCode: 'HER', cityCode: 'HER', name: 'Heraklion Nikos Kazantzakis', cityName: 'Heraklion', countryCode: 'GR', cityNameHe: 'הרקליון', cityNameRu: 'Ираклион' },
  { id: 'RHO', type: 'AIRPORT', airportCode: 'RHO', cityCode: 'RHO', name: 'Rhodes Diagoras Intl', cityName: 'Rhodes', countryCode: 'GR', cityNameHe: 'רודוס', cityNameRu: 'Родос' },
  { id: 'CFU', type: 'AIRPORT', airportCode: 'CFU', cityCode: 'CFU', name: 'Corfu Ioannis Kapodistrias', cityName: 'Corfu', countryCode: 'GR', cityNameHe: 'קורפו', cityNameRu: 'Корфу' },
  { id: 'KGS', type: 'AIRPORT', airportCode: 'KGS', cityCode: 'KGS', name: 'Kos Hippocrates Intl', cityName: 'Kos', countryCode: 'GR', cityNameHe: 'קוס', cityNameRu: 'Кос' },
  { id: 'JMK', type: 'AIRPORT', airportCode: 'JMK', cityCode: 'JMK', name: 'Mykonos Intl', cityName: 'Mykonos', countryCode: 'GR', cityNameHe: 'מיקונוס', cityNameRu: 'Миконос' },
  { id: 'JSI', type: 'AIRPORT', airportCode: 'JSI', cityCode: 'JSI', name: 'Skiathos Alexandros Papadiamantis', cityName: 'Skiathos', countryCode: 'GR', cityNameRu: 'Скиатос' },
  { id: 'ZTH', type: 'AIRPORT', airportCode: 'ZTH', cityCode: 'ZTH', name: 'Zakinthos Intl', cityName: 'Zakynthos', countryCode: 'GR', cityNameHe: 'זקינתוס', cityNameRu: 'Закинф' },
  { id: 'CHQ', type: 'AIRPORT', airportCode: 'CHQ', cityCode: 'CHQ', name: 'Chania Intl', cityName: 'Chania', countryCode: 'GR', cityNameHe: 'חאניה', cityNameRu: 'Ханья' },
  { id: 'JTR', type: 'AIRPORT', airportCode: 'JTR', cityCode: 'JTR', name: 'Santorini Intl', cityName: 'Santorini', countryCode: 'GR', cityNameHe: 'סנטוריני', cityNameRu: 'Санторини' },

  // ── Italy ─────────────────────────────────────────────────────────────────────
  { id: 'FCO', type: 'AIRPORT', airportCode: 'FCO', cityCode: 'ROM', name: 'Rome Fiumicino', cityName: 'Rome', countryCode: 'IT', cityNameHe: 'רומא', cityNameRu: 'Рим' },
  { id: 'CIA', type: 'AIRPORT', airportCode: 'CIA', cityCode: 'ROM', name: 'Rome Ciampino', cityName: 'Rome', countryCode: 'IT', cityNameHe: 'רומא', cityNameRu: 'Рим (Чампино)' },
  { id: 'MXP', type: 'AIRPORT', airportCode: 'MXP', cityCode: 'MIL', name: 'Milan Malpensa Intl', cityName: 'Milan', countryCode: 'IT', cityNameHe: 'מילאנו', cityNameRu: 'Милан' },
  { id: 'LIN', type: 'AIRPORT', airportCode: 'LIN', cityCode: 'MIL', name: 'Milan Linate', cityName: 'Milan', countryCode: 'IT', cityNameHe: 'מילאנו (לינטה)', cityNameRu: 'Милан (Линате)' },
  { id: 'BGY', type: 'AIRPORT', airportCode: 'BGY', cityCode: 'MIL', name: 'Milan Bergamo Orio al Serio', cityName: 'Milan', countryCode: 'IT', cityNameHe: 'מילאנו (ברגמו)', cityNameRu: 'Милан (Бергамо)' },
  { id: 'VCE', type: 'AIRPORT', airportCode: 'VCE', cityCode: 'VCE', name: 'Venice Marco Polo Intl', cityName: 'Venice', countryCode: 'IT', cityNameHe: 'ונציה', cityNameRu: 'Венеция' },
  { id: 'TSF', type: 'AIRPORT', airportCode: 'TSF', cityCode: 'VCE', name: 'Venice Treviso', cityName: 'Venice', countryCode: 'IT', cityNameHe: 'ונציה (טרביזו)', cityNameRu: 'Венеция (Тревизо)' },
  { id: 'NAP', type: 'AIRPORT', airportCode: 'NAP', cityCode: 'NAP', name: 'Naples Intl', cityName: 'Naples', countryCode: 'IT', cityNameHe: 'נאפולי', cityNameRu: 'Неаполь' },
  { id: 'CTA', type: 'AIRPORT', airportCode: 'CTA', cityCode: 'CTA', name: 'Catania Fontanarossa Intl', cityName: 'Catania', countryCode: 'IT', cityNameHe: 'קטניה', cityNameRu: 'Катания' },
  { id: 'PMO', type: 'AIRPORT', airportCode: 'PMO', cityCode: 'PMO', name: 'Palermo Falcone Borsellino Intl', cityName: 'Palermo', countryCode: 'IT', cityNameHe: 'פלרמו', cityNameRu: 'Палермо' },
  { id: 'BLQ', type: 'AIRPORT', airportCode: 'BLQ', cityCode: 'BLQ', name: 'Bologna Guglielmo Marconi Intl', cityName: 'Bologna', countryCode: 'IT', cityNameHe: 'בולוניה', cityNameRu: 'Болонья' },
  { id: 'FLR', type: 'AIRPORT', airportCode: 'FLR', cityCode: 'FLR', name: 'Florence Peretola', cityName: 'Florence', countryCode: 'IT', cityNameHe: 'פירנצה', cityNameRu: 'Флоренция' },
  { id: 'PSA', type: 'AIRPORT', airportCode: 'PSA', cityCode: 'FLR', name: 'Pisa Galileo Galilei Intl', cityName: 'Florence', countryCode: 'IT', cityNameHe: 'פיזה', cityNameRu: 'Пиза' },
  { id: 'BRI', type: 'AIRPORT', airportCode: 'BRI', cityCode: 'BRI', name: 'Bari Karol Wojtyla Intl', cityName: 'Bari', countryCode: 'IT', cityNameHe: 'בארי', cityNameRu: 'Бари' },
  { id: 'TRS', type: 'AIRPORT', airportCode: 'TRS', cityCode: 'TRS', name: 'Trieste Friuli Venezia Giulia', cityName: 'Trieste', countryCode: 'IT', cityNameRu: 'Триест' },
  { id: 'GOA', type: 'AIRPORT', airportCode: 'GOA', cityCode: 'GOA', name: 'Genoa Cristoforo Colombo', cityName: 'Genoa', countryCode: 'IT', cityNameHe: 'גנואה', cityNameRu: 'Генуя' },
  { id: 'CAG', type: 'AIRPORT', airportCode: 'CAG', cityCode: 'CAG', name: 'Cagliari Elmas Intl', cityName: 'Cagliari', countryCode: 'IT', cityNameRu: 'Кальяри' },

  // ── Spain ──────────────────────────────────────────────────────────────────────
  { id: 'MAD', type: 'AIRPORT', airportCode: 'MAD', cityCode: 'MAD', name: 'Madrid Barajas Adolfo Suárez Intl', cityName: 'Madrid', countryCode: 'ES', cityNameHe: 'מדריד', cityNameRu: 'Мадрид' },
  { id: 'BCN', type: 'AIRPORT', airportCode: 'BCN', cityCode: 'BCN', name: 'Barcelona El Prat Intl', cityName: 'Barcelona', countryCode: 'ES', cityNameHe: 'ברצלונה', cityNameRu: 'Барселона' },
  { id: 'PMI', type: 'AIRPORT', airportCode: 'PMI', cityCode: 'PMI', name: 'Palma de Mallorca Son Joan Intl', cityName: 'Palma', countryCode: 'ES', cityNameHe: 'פאלמה דה מיורקה', cityNameRu: 'Пальма де Майорка' },
  { id: 'AGP', type: 'AIRPORT', airportCode: 'AGP', cityCode: 'AGP', name: 'Malaga Costa del Sol', cityName: 'Malaga', countryCode: 'ES', cityNameHe: 'מלגה', cityNameRu: 'Малага' },
  { id: 'ALC', type: 'AIRPORT', airportCode: 'ALC', cityCode: 'ALC', name: 'Alicante-Elche Miguel Hernández', cityName: 'Alicante', countryCode: 'ES', cityNameHe: 'אליקנטה', cityNameRu: 'Аликанте' },
  { id: 'VLC', type: 'AIRPORT', airportCode: 'VLC', cityCode: 'VLC', name: 'Valencia Intl', cityName: 'Valencia', countryCode: 'ES', cityNameHe: 'ולנסיה', cityNameRu: 'Валенсия' },
  { id: 'SVQ', type: 'AIRPORT', airportCode: 'SVQ', cityCode: 'SVQ', name: 'Seville San Pablo Intl', cityName: 'Seville', countryCode: 'ES', cityNameHe: 'סביליה', cityNameRu: 'Севилья' },
  { id: 'BIO', type: 'AIRPORT', airportCode: 'BIO', cityCode: 'BIO', name: 'Bilbao Loiu', cityName: 'Bilbao', countryCode: 'ES', cityNameHe: 'בילבאו', cityNameRu: 'Бильбао' },
  { id: 'IBZ', type: 'AIRPORT', airportCode: 'IBZ', cityCode: 'IBZ', name: 'Ibiza Intl', cityName: 'Ibiza', countryCode: 'ES', cityNameHe: 'איביזה', cityNameRu: 'Ибица' },
  { id: 'LPA', type: 'AIRPORT', airportCode: 'LPA', cityCode: 'LPA', name: 'Gran Canaria Intl', cityName: 'Las Palmas', countryCode: 'ES', cityNameHe: 'גראן קנריה', cityNameRu: 'Гран Канария' },
  { id: 'TFS', type: 'AIRPORT', airportCode: 'TFS', cityCode: 'TCI', name: 'Tenerife South Intl', cityName: 'Tenerife', countryCode: 'ES', cityNameHe: 'טנריף', cityNameRu: 'Тенерифе' },
  { id: 'ACE', type: 'AIRPORT', airportCode: 'ACE', cityCode: 'ACE', name: 'Lanzarote Arrecife Intl', cityName: 'Lanzarote', countryCode: 'ES', cityNameHe: 'לנזרוטה', cityNameRu: 'Лансароте' },
  { id: 'FUE', type: 'AIRPORT', airportCode: 'FUE', cityCode: 'FUE', name: 'Fuerteventura Intl', cityName: 'Fuerteventura', countryCode: 'ES', cityNameHe: 'פוארטוונטורה', cityNameRu: 'Фуэртевентура' },

  // ── Portugal ──────────────────────────────────────────────────────────────────
  { id: 'LIS', type: 'AIRPORT', airportCode: 'LIS', cityCode: 'LIS', name: 'Lisbon Humberto Delgado Intl', cityName: 'Lisbon', countryCode: 'PT', cityNameHe: 'ליסבון', cityNameRu: 'Лиссабон' },
  { id: 'OPO', type: 'AIRPORT', airportCode: 'OPO', cityCode: 'OPO', name: 'Porto Francisco Sá Carneiro Intl', cityName: 'Porto', countryCode: 'PT', cityNameHe: 'פורטו', cityNameRu: 'Порту' },
  { id: 'FAO', type: 'AIRPORT', airportCode: 'FAO', cityCode: 'FAO', name: 'Faro Intl', cityName: 'Faro', countryCode: 'PT', cityNameHe: 'פארו', cityNameRu: 'Фару' },
  { id: 'FNC', type: 'AIRPORT', airportCode: 'FNC', cityCode: 'FNC', name: 'Madeira Cristiano Ronaldo Intl', cityName: 'Funchal', countryCode: 'PT', cityNameHe: 'מדיירה', cityNameRu: 'Мадейра' },
  { id: 'PDL', type: 'AIRPORT', airportCode: 'PDL', cityCode: 'PDL', name: 'João Paulo II Airport', cityName: 'Ponta Delgada', countryCode: 'PT', cityNameRu: 'Азорские острова' },

  // ── France ─────────────────────────────────────────────────────────────────────
  { id: 'CDG', type: 'AIRPORT', airportCode: 'CDG', cityCode: 'PAR', name: 'Paris Charles de Gaulle Intl', cityName: 'Paris', countryCode: 'FR', cityNameHe: 'פריז', cityNameRu: 'Париж' },
  { id: 'ORY', type: 'AIRPORT', airportCode: 'ORY', cityCode: 'PAR', name: 'Paris Orly', cityName: 'Paris', countryCode: 'FR', cityNameHe: 'פריז (אורלי)', cityNameRu: 'Париж (Орли)' },
  { id: 'NCE', type: 'AIRPORT', airportCode: 'NCE', cityCode: 'NCE', name: 'Nice Côte d\'Azur Intl', cityName: 'Nice', countryCode: 'FR', cityNameHe: 'ניס', cityNameRu: 'Ницца' },
  { id: 'LYS', type: 'AIRPORT', airportCode: 'LYS', cityCode: 'LYS', name: 'Lyon Saint-Exupéry Intl', cityName: 'Lyon', countryCode: 'FR', cityNameHe: 'ליון', cityNameRu: 'Лион' },
  { id: 'MRS', type: 'AIRPORT', airportCode: 'MRS', cityCode: 'MRS', name: 'Marseille Provence Intl', cityName: 'Marseille', countryCode: 'FR', cityNameHe: 'מרסיי', cityNameRu: 'Марсель' },
  { id: 'TLS', type: 'AIRPORT', airportCode: 'TLS', cityCode: 'TLS', name: 'Toulouse-Blagnac Intl', cityName: 'Toulouse', countryCode: 'FR', cityNameHe: 'טולוז', cityNameRu: 'Тулуза' },
  { id: 'BOD', type: 'AIRPORT', airportCode: 'BOD', cityCode: 'BOD', name: 'Bordeaux-Mérignac Intl', cityName: 'Bordeaux', countryCode: 'FR', cityNameHe: 'בורדו', cityNameRu: 'Бордо' },
  { id: 'NTE', type: 'AIRPORT', airportCode: 'NTE', cityCode: 'NTE', name: 'Nantes Atlantique', cityName: 'Nantes', countryCode: 'FR', cityNameRu: 'Нант' },
  { id: 'SXB', type: 'AIRPORT', airportCode: 'SXB', cityCode: 'SXB', name: 'Strasbourg Airport', cityName: 'Strasbourg', countryCode: 'FR', cityNameRu: 'Страсбург' },
  { id: 'BIA', type: 'AIRPORT', airportCode: 'BIA', cityCode: 'BIA', name: 'Bastia-Poretta', cityName: 'Bastia', countryCode: 'FR', cityNameRu: 'Бастия' },
  { id: 'AJA', type: 'AIRPORT', airportCode: 'AJA', cityCode: 'AJA', name: 'Ajaccio Napoléon Bonaparte', cityName: 'Ajaccio', countryCode: 'FR', cityNameRu: 'Аяччо' },

  // ── Germany ───────────────────────────────────────────────────────────────────
  { id: 'FRA', type: 'AIRPORT', airportCode: 'FRA', cityCode: 'FRA', name: 'Frankfurt am Main Intl', cityName: 'Frankfurt', countryCode: 'DE', cityNameHe: 'פרנקפורט', cityNameRu: 'Франкфурт' },
  { id: 'MUC', type: 'AIRPORT', airportCode: 'MUC', cityCode: 'MUC', name: 'Munich Intl', cityName: 'Munich', countryCode: 'DE', cityNameHe: 'מינכן', cityNameRu: 'Мюнхен' },
  { id: 'BER', type: 'AIRPORT', airportCode: 'BER', cityCode: 'BER', name: 'Berlin Brandenburg Intl', cityName: 'Berlin', countryCode: 'DE', cityNameHe: 'ברלין', cityNameRu: 'Берлин' },
  { id: 'DUS', type: 'AIRPORT', airportCode: 'DUS', cityCode: 'DUS', name: 'Düsseldorf Intl', cityName: 'Düsseldorf', countryCode: 'DE', cityNameHe: 'דיסלדורף', cityNameRu: 'Дюссельдорф' },
  { id: 'HAM', type: 'AIRPORT', airportCode: 'HAM', cityCode: 'HAM', name: 'Hamburg Helmut Schmidt Intl', cityName: 'Hamburg', countryCode: 'DE', cityNameHe: 'המבורג', cityNameRu: 'Гамбург' },
  { id: 'STR', type: 'AIRPORT', airportCode: 'STR', cityCode: 'STR', name: 'Stuttgart Echterdingen Intl', cityName: 'Stuttgart', countryCode: 'DE', cityNameHe: 'שטוטגרט', cityNameRu: 'Штутгарт' },
  { id: 'CGN', type: 'AIRPORT', airportCode: 'CGN', cityCode: 'CGN', name: 'Cologne Bonn Intl', cityName: 'Cologne', countryCode: 'DE', cityNameHe: 'קלן', cityNameRu: 'Кёльн' },
  { id: 'NUE', type: 'AIRPORT', airportCode: 'NUE', cityCode: 'NUE', name: 'Nuremberg Intl', cityName: 'Nuremberg', countryCode: 'DE', cityNameRu: 'Нюрнберг' },
  { id: 'HAJ', type: 'AIRPORT', airportCode: 'HAJ', cityCode: 'HAJ', name: 'Hanover Intl', cityName: 'Hanover', countryCode: 'DE', cityNameRu: 'Ганновер' },
  { id: 'HHN', type: 'AIRPORT', airportCode: 'HHN', cityCode: 'FRA', name: 'Frankfurt Hahn', cityName: 'Frankfurt', countryCode: 'DE', cityNameRu: 'Франкфурт (Хан)' },
  { id: 'FMO', type: 'AIRPORT', airportCode: 'FMO', cityCode: 'FMO', name: 'Münster Osnabrück Intl', cityName: 'Münster', countryCode: 'DE', cityNameRu: 'Мюнстер' },

  // ── Netherlands / Belgium / Switzerland / Austria ──────────────────────────────
  { id: 'AMS', type: 'AIRPORT', airportCode: 'AMS', cityCode: 'AMS', name: 'Amsterdam Schiphol Intl', cityName: 'Amsterdam', countryCode: 'NL', cityNameHe: 'אמסטרדם', cityNameRu: 'Амстердам' },
  { id: 'EIN', type: 'AIRPORT', airportCode: 'EIN', cityCode: 'EIN', name: 'Eindhoven Airport', cityName: 'Eindhoven', countryCode: 'NL', cityNameRu: 'Эйндховен' },
  { id: 'RTM', type: 'AIRPORT', airportCode: 'RTM', cityCode: 'RTM', name: 'Rotterdam The Hague Airport', cityName: 'Rotterdam', countryCode: 'NL', cityNameRu: 'Роттердам' },
  { id: 'BRU', type: 'AIRPORT', airportCode: 'BRU', cityCode: 'BRU', name: 'Brussels Zaventem Intl', cityName: 'Brussels', countryCode: 'BE', cityNameHe: 'בריסל', cityNameRu: 'Брюссель' },
  { id: 'CRL', type: 'AIRPORT', airportCode: 'CRL', cityCode: 'BRU', name: 'Brussels South Charleroi', cityName: 'Brussels', countryCode: 'BE', cityNameHe: 'בריסל (שרלרואה)', cityNameRu: 'Брюссель (Шарлеруа)' },
  { id: 'ZRH', type: 'AIRPORT', airportCode: 'ZRH', cityCode: 'ZRH', name: 'Zürich Kloten Intl', cityName: 'Zurich', countryCode: 'CH', cityNameHe: 'ציריך', cityNameRu: 'Цюрих' },
  { id: 'GVA', type: 'AIRPORT', airportCode: 'GVA', cityCode: 'GVA', name: 'Geneva Cointrin Intl', cityName: 'Geneva', countryCode: 'CH', cityNameHe: 'ז\'נבה', cityNameRu: 'Женева' },
  { id: 'BSL', type: 'AIRPORT', airportCode: 'BSL', cityCode: 'BSL', name: 'EuroAirport Basel-Mulhouse-Freiburg', cityName: 'Basel', countryCode: 'CH', cityNameRu: 'Базель' },
  { id: 'VIE', type: 'AIRPORT', airportCode: 'VIE', cityCode: 'VIE', name: 'Vienna Schwechat Intl', cityName: 'Vienna', countryCode: 'AT', cityNameHe: 'וינה', cityNameRu: 'Вена' },
  { id: 'SZG', type: 'AIRPORT', airportCode: 'SZG', cityCode: 'SZG', name: 'Salzburg W.A. Mozart Airport', cityName: 'Salzburg', countryCode: 'AT', cityNameHe: 'זלצבורג', cityNameRu: 'Зальцбург' },
  { id: 'INN', type: 'AIRPORT', airportCode: 'INN', cityCode: 'INN', name: 'Innsbruck Airport', cityName: 'Innsbruck', countryCode: 'AT', cityNameRu: 'Инсбрук' },
  { id: 'GRZ', type: 'AIRPORT', airportCode: 'GRZ', cityCode: 'GRZ', name: 'Graz Airport', cityName: 'Graz', countryCode: 'AT', cityNameRu: 'Грац' },

  // ── UK & Ireland ───────────────────────────────────────────────────────────────
  { id: 'LHR', type: 'AIRPORT', airportCode: 'LHR', cityCode: 'LON', name: 'London Heathrow Intl', cityName: 'London', countryCode: 'GB', cityNameHe: 'לונדון', cityNameRu: 'Лондон' },
  { id: 'LGW', type: 'AIRPORT', airportCode: 'LGW', cityCode: 'LON', name: 'London Gatwick', cityName: 'London', countryCode: 'GB', cityNameHe: 'לונדון (גטוויק)', cityNameRu: 'Лондон (Гатвик)' },
  { id: 'STN', type: 'AIRPORT', airportCode: 'STN', cityCode: 'LON', name: 'London Stansted', cityName: 'London', countryCode: 'GB', cityNameHe: 'לונדון (סטנסטד)', cityNameRu: 'Лондон (Станстед)' },
  { id: 'LTN', type: 'AIRPORT', airportCode: 'LTN', cityCode: 'LON', name: 'London Luton', cityName: 'London', countryCode: 'GB', cityNameHe: 'לונדון (לוטון)', cityNameRu: 'Лондон (Лутон)' },
  { id: 'LCY', type: 'AIRPORT', airportCode: 'LCY', cityCode: 'LON', name: 'London City Airport', cityName: 'London', countryCode: 'GB', cityNameHe: 'לונדון סיטי', cityNameRu: 'Лондон (Сити)' },
  { id: 'MAN', type: 'AIRPORT', airportCode: 'MAN', cityCode: 'MAN', name: 'Manchester Intl', cityName: 'Manchester', countryCode: 'GB', cityNameHe: 'מנצ\'סטר', cityNameRu: 'Манчестер' },
  { id: 'EDI', type: 'AIRPORT', airportCode: 'EDI', cityCode: 'EDI', name: 'Edinburgh Airport', cityName: 'Edinburgh', countryCode: 'GB', cityNameHe: 'אדינבורו', cityNameRu: 'Эдинбург' },
  { id: 'GLA', type: 'AIRPORT', airportCode: 'GLA', cityCode: 'GLA', name: 'Glasgow Intl', cityName: 'Glasgow', countryCode: 'GB', cityNameHe: 'גלזגו', cityNameRu: 'Глазго' },
  { id: 'BHX', type: 'AIRPORT', airportCode: 'BHX', cityCode: 'BHX', name: 'Birmingham Intl', cityName: 'Birmingham', countryCode: 'GB', cityNameRu: 'Бирмингем' },
  { id: 'BRS', type: 'AIRPORT', airportCode: 'BRS', cityCode: 'BRS', name: 'Bristol Airport', cityName: 'Bristol', countryCode: 'GB', cityNameRu: 'Бристоль' },
  { id: 'NCL', type: 'AIRPORT', airportCode: 'NCL', cityCode: 'NCL', name: 'Newcastle Intl', cityName: 'Newcastle', countryCode: 'GB', cityNameRu: 'Ньюкасл' },
  { id: 'LPL', type: 'AIRPORT', airportCode: 'LPL', cityCode: 'LPL', name: 'Liverpool John Lennon', cityName: 'Liverpool', countryCode: 'GB', cityNameRu: 'Ливерпуль' },
  { id: 'ABZ', type: 'AIRPORT', airportCode: 'ABZ', cityCode: 'ABZ', name: 'Aberdeen Dyce Airport', cityName: 'Aberdeen', countryCode: 'GB', cityNameRu: 'Абердин' },
  { id: 'BFS', type: 'AIRPORT', airportCode: 'BFS', cityCode: 'BFS', name: 'Belfast Intl', cityName: 'Belfast', countryCode: 'GB', cityNameRu: 'Белфаст' },
  { id: 'DUB', type: 'AIRPORT', airportCode: 'DUB', cityCode: 'DUB', name: 'Dublin Intl', cityName: 'Dublin', countryCode: 'IE', cityNameHe: 'דבלין', cityNameRu: 'Дублин' },
  { id: 'ORK', type: 'AIRPORT', airportCode: 'ORK', cityCode: 'ORK', name: 'Cork Airport', cityName: 'Cork', countryCode: 'IE', cityNameRu: 'Корк' },
  { id: 'SNN', type: 'AIRPORT', airportCode: 'SNN', cityCode: 'SNN', name: 'Shannon Airport', cityName: 'Shannon', countryCode: 'IE', cityNameRu: 'Шеннон' },

  // ── Scandinavia / Nordic ────────────────────────────────────────────────────────
  { id: 'CPH', type: 'AIRPORT', airportCode: 'CPH', cityCode: 'CPH', name: 'Copenhagen Kastrup Intl', cityName: 'Copenhagen', countryCode: 'DK', cityNameHe: 'קופנהגן', cityNameRu: 'Копенгаген' },
  { id: 'ARN', type: 'AIRPORT', airportCode: 'ARN', cityCode: 'STO', name: 'Stockholm Arlanda Intl', cityName: 'Stockholm', countryCode: 'SE', cityNameHe: 'שטוקהולם', cityNameRu: 'Стокгольм' },
  { id: 'NYO', type: 'AIRPORT', airportCode: 'NYO', cityCode: 'STO', name: 'Stockholm Skavsta', cityName: 'Stockholm', countryCode: 'SE', cityNameHe: 'שטוקהולם (סקאוסטה)', cityNameRu: 'Стокгольм (Скавста)' },
  { id: 'GOT', type: 'AIRPORT', airportCode: 'GOT', cityCode: 'GOT', name: 'Gothenburg Landvetter Intl', cityName: 'Gothenburg', countryCode: 'SE', cityNameRu: 'Гётеборг' },
  { id: 'OSL', type: 'AIRPORT', airportCode: 'OSL', cityCode: 'OSL', name: 'Oslo Gardermoen Intl', cityName: 'Oslo', countryCode: 'NO', cityNameHe: 'אוסלו', cityNameRu: 'Осло' },
  { id: 'BGO', type: 'AIRPORT', airportCode: 'BGO', cityCode: 'BGO', name: 'Bergen Flesland Airport', cityName: 'Bergen', countryCode: 'NO', cityNameRu: 'Берген' },
  { id: 'TRF', type: 'AIRPORT', airportCode: 'TRF', cityCode: 'OSL', name: 'Oslo Torp Sandefjord', cityName: 'Oslo', countryCode: 'NO', cityNameRu: 'Осло (Торп)' },
  { id: 'HEL', type: 'AIRPORT', airportCode: 'HEL', cityCode: 'HEL', name: 'Helsinki Vantaa Intl', cityName: 'Helsinki', countryCode: 'FI', cityNameHe: 'הלסינקי', cityNameRu: 'Хельсинки' },
  { id: 'TMP', type: 'AIRPORT', airportCode: 'TMP', cityCode: 'TMP', name: 'Tampere-Pirkkala Airport', cityName: 'Tampere', countryCode: 'FI', cityNameRu: 'Тампере' },
  { id: 'OUL', type: 'AIRPORT', airportCode: 'OUL', cityCode: 'OUL', name: 'Oulu Airport', cityName: 'Oulu', countryCode: 'FI', cityNameRu: 'Оулу' },
  { id: 'KEF', type: 'AIRPORT', airportCode: 'KEF', cityCode: 'REY', name: 'Reykjavik Keflavik Intl', cityName: 'Reykjavik', countryCode: 'IS', cityNameHe: 'רייקיאוויק', cityNameRu: 'Рейкьявик' },

  // ── Eastern Europe ────────────────────────────────────────────────────────────
  { id: 'WAW', type: 'AIRPORT', airportCode: 'WAW', cityCode: 'WAW', name: 'Warsaw Chopin Intl', cityName: 'Warsaw', countryCode: 'PL', cityNameHe: 'ורשה', cityNameRu: 'Варшава' },
  { id: 'KRK', type: 'AIRPORT', airportCode: 'KRK', cityCode: 'KRK', name: 'Kraków John Paul II Intl', cityName: 'Kraków', countryCode: 'PL', cityNameHe: 'קרקוב', cityNameRu: 'Краков' },
  { id: 'WRO', type: 'AIRPORT', airportCode: 'WRO', cityCode: 'WRO', name: 'Wroclaw Copernicus Airport', cityName: 'Wroclaw', countryCode: 'PL', cityNameRu: 'Вроцлав' },
  { id: 'GDN', type: 'AIRPORT', airportCode: 'GDN', cityCode: 'GDN', name: 'Gdansk Lech Walesa Airport', cityName: 'Gdansk', countryCode: 'PL', cityNameRu: 'Гданьск' },
  { id: 'KTW', type: 'AIRPORT', airportCode: 'KTW', cityCode: 'KTW', name: 'Katowice Pyrzowice Airport', cityName: 'Katowice', countryCode: 'PL', cityNameRu: 'Катовице' },
  { id: 'PRG', type: 'AIRPORT', airportCode: 'PRG', cityCode: 'PRG', name: 'Prague Václav Havel Intl', cityName: 'Prague', countryCode: 'CZ', cityNameHe: 'פראג', cityNameRu: 'Прага' },
  { id: 'BRQ', type: 'AIRPORT', airportCode: 'BRQ', cityCode: 'BRQ', name: 'Brno-Turany Airport', cityName: 'Brno', countryCode: 'CZ', cityNameRu: 'Брно' },
  { id: 'BUD', type: 'AIRPORT', airportCode: 'BUD', cityCode: 'BUD', name: 'Budapest Ferenc Liszt Intl', cityName: 'Budapest', countryCode: 'HU', cityNameHe: 'בודפשט', cityNameRu: 'Будапешт' },
  { id: 'OTP', type: 'AIRPORT', airportCode: 'OTP', cityCode: 'BUH', name: 'Bucharest Henri Coandă Intl', cityName: 'Bucharest', countryCode: 'RO', cityNameHe: 'בוקרשט', cityNameRu: 'Бухарест' },
  { id: 'CLJ', type: 'AIRPORT', airportCode: 'CLJ', cityCode: 'CLJ', name: 'Cluj-Napoca Intl', cityName: 'Cluj-Napoca', countryCode: 'RO', cityNameRu: 'Клуж-Напока' },
  { id: 'TSR', type: 'AIRPORT', airportCode: 'TSR', cityCode: 'TSR', name: 'Timisoara Traian Vuia Intl', cityName: 'Timisoara', countryCode: 'RO', cityNameRu: 'Тимишоара' },
  { id: 'IAS', type: 'AIRPORT', airportCode: 'IAS', cityCode: 'IAS', name: 'Iasi Intl', cityName: 'Iasi', countryCode: 'RO', cityNameRu: 'Яссы' },
  { id: 'SOF', type: 'AIRPORT', airportCode: 'SOF', cityCode: 'SOF', name: 'Sofia Intl', cityName: 'Sofia', countryCode: 'BG', cityNameHe: 'סופיה', cityNameRu: 'София' },
  { id: 'VAR', type: 'AIRPORT', airportCode: 'VAR', cityCode: 'VAR', name: 'Varna Intl', cityName: 'Varna', countryCode: 'BG', cityNameHe: 'וארנה', cityNameRu: 'Варна' },
  { id: 'BOJ', type: 'AIRPORT', airportCode: 'BOJ', cityCode: 'BOJ', name: 'Burgas Airport', cityName: 'Burgas', countryCode: 'BG', cityNameHe: 'בורגס', cityNameRu: 'Бургас' },
  { id: 'BTS', type: 'AIRPORT', airportCode: 'BTS', cityCode: 'BTS', name: 'Bratislava M.R. Štefánik Airport', cityName: 'Bratislava', countryCode: 'SK', cityNameHe: 'ברטיסלבה', cityNameRu: 'Братислава' },
  { id: 'BEG', type: 'AIRPORT', airportCode: 'BEG', cityCode: 'BEG', name: 'Belgrade Nikola Tesla Intl', cityName: 'Belgrade', countryCode: 'RS', cityNameHe: 'בלגרד', cityNameRu: 'Белград' },
  { id: 'INI', type: 'AIRPORT', airportCode: 'INI', cityCode: 'INI', name: 'Niš Constantine the Great Airport', cityName: 'Niš', countryCode: 'RS', cityNameRu: 'Ниш' },
  { id: 'ZAG', type: 'AIRPORT', airportCode: 'ZAG', cityCode: 'ZAG', name: 'Zagreb Franjo Tuđman Intl', cityName: 'Zagreb', countryCode: 'HR', cityNameHe: 'זאגרב', cityNameRu: 'Загреб' },
  { id: 'SPU', type: 'AIRPORT', airportCode: 'SPU', cityCode: 'SPU', name: 'Split Airport', cityName: 'Split', countryCode: 'HR', cityNameHe: 'ספליט', cityNameRu: 'Сплит' },
  { id: 'DBV', type: 'AIRPORT', airportCode: 'DBV', cityCode: 'DBV', name: 'Dubrovnik Airport', cityName: 'Dubrovnik', countryCode: 'HR', cityNameHe: 'דוברובניק', cityNameRu: 'Дубровник' },
  { id: 'ZAD', type: 'AIRPORT', airportCode: 'ZAD', cityCode: 'ZAD', name: 'Zadar Airport', cityName: 'Zadar', countryCode: 'HR', cityNameRu: 'Задар' },
  { id: 'LJU', type: 'AIRPORT', airportCode: 'LJU', cityCode: 'LJU', name: 'Ljubljana Jože Pučnik Airport', cityName: 'Ljubljana', countryCode: 'SI', cityNameHe: 'ליובליאנה', cityNameRu: 'Любляна' },
  { id: 'SJJ', type: 'AIRPORT', airportCode: 'SJJ', cityCode: 'SJJ', name: 'Sarajevo Intl', cityName: 'Sarajevo', countryCode: 'BA', cityNameHe: 'סרייבו', cityNameRu: 'Сараево' },
  { id: 'SKP', type: 'AIRPORT', airportCode: 'SKP', cityCode: 'SKP', name: 'Skopje Alexander the Great Intl', cityName: 'Skopje', countryCode: 'MK', cityNameHe: 'סקופיה', cityNameRu: 'Скопье' },
  { id: 'TIA', type: 'AIRPORT', airportCode: 'TIA', cityCode: 'TIA', name: 'Tirana Rinas Mother Teresa Intl', cityName: 'Tirana', countryCode: 'AL', cityNameHe: 'טירנה', cityNameRu: 'Тирана' },
  { id: 'TGD', type: 'AIRPORT', airportCode: 'TGD', cityCode: 'TGD', name: 'Podgorica Golubovci Airport', cityName: 'Podgorica', countryCode: 'ME', cityNameRu: 'Подгорица' },
  { id: 'PRN', type: 'AIRPORT', airportCode: 'PRN', cityCode: 'PRN', name: 'Pristina Adem Jashari Intl', cityName: 'Pristina', countryCode: 'XK', cityNameRu: 'Приштина' },

  // ── Baltic & Eastern ───────────────────────────────────────────────────────────
  { id: 'RIX', type: 'AIRPORT', airportCode: 'RIX', cityCode: 'RIX', name: 'Riga Intl', cityName: 'Riga', countryCode: 'LV', cityNameHe: 'ריגה', cityNameRu: 'Рига' },
  { id: 'TLL', type: 'AIRPORT', airportCode: 'TLL', cityCode: 'TLL', name: 'Tallinn Lennart Meri', cityName: 'Tallinn', countryCode: 'EE', cityNameHe: 'טאלין', cityNameRu: 'Таллин' },
  { id: 'VNO', type: 'AIRPORT', airportCode: 'VNO', cityCode: 'VNO', name: 'Vilnius Intl', cityName: 'Vilnius', countryCode: 'LT', cityNameHe: 'וילנה', cityNameRu: 'Вильнюс' },
  { id: 'KBP', type: 'AIRPORT', airportCode: 'KBP', cityCode: 'IEV', name: 'Kyiv Boryspil Intl', cityName: 'Kyiv', countryCode: 'UA', cityNameHe: 'קיוב', cityNameRu: 'Киев (Борисполь)' },
  { id: 'LWO', type: 'AIRPORT', airportCode: 'LWO', cityCode: 'LWO', name: 'Lviv Danylo Halytskyi Intl', cityName: 'Lviv', countryCode: 'UA', cityNameRu: 'Львов' },
  { id: 'ODS', type: 'AIRPORT', airportCode: 'ODS', cityCode: 'ODS', name: 'Odessa Intl', cityName: 'Odessa', countryCode: 'UA', cityNameRu: 'Одесса' },
  { id: 'KIV', type: 'AIRPORT', airportCode: 'KIV', cityCode: 'KIV', name: 'Chișinău Intl', cityName: 'Chișinău', countryCode: 'MD', cityNameRu: 'Кишинёв' },
  { id: 'MSQ', type: 'AIRPORT', airportCode: 'MSQ', cityCode: 'MSQ', name: 'Minsk National Airport', cityName: 'Minsk', countryCode: 'BY', cityNameRu: 'Минск' },
  { id: 'TBS', type: 'AIRPORT', airportCode: 'TBS', cityCode: 'TBS', name: 'Tbilisi Shota Rustaveli Intl', cityName: 'Tbilisi', countryCode: 'GE', cityNameHe: 'טביליסי', cityNameRu: 'Тбилиси' },
  { id: 'BUS', type: 'AIRPORT', airportCode: 'BUS', cityCode: 'BUS', name: 'Batumi Intl', cityName: 'Batumi', countryCode: 'GE', cityNameHe: 'באטומי', cityNameRu: 'Батуми' },
  { id: 'GYD', type: 'AIRPORT', airportCode: 'GYD', cityCode: 'BAK', name: 'Heydar Aliyev Intl', cityName: 'Baku', countryCode: 'AZ', cityNameHe: 'באקו', cityNameRu: 'Баку' },
  { id: 'EVN', type: 'AIRPORT', airportCode: 'EVN', cityCode: 'EVN', name: 'Zvartnots Intl', cityName: 'Yerevan', countryCode: 'AM', cityNameHe: 'ירוואן', cityNameRu: 'Ереван' },

  // ── Cyprus / Malta ─────────────────────────────────────────────────────────────
  { id: 'LCA', type: 'AIRPORT', airportCode: 'LCA', cityCode: 'NIC', name: 'Larnaca Intl', cityName: 'Larnaca', countryCode: 'CY', cityNameHe: 'לרנקה', cityNameRu: 'Ларнака' },
  { id: 'PFO', type: 'AIRPORT', airportCode: 'PFO', cityCode: 'PAF', name: 'Paphos Intl', cityName: 'Paphos', countryCode: 'CY', cityNameHe: 'פאפוס', cityNameRu: 'Пафос' },
  { id: 'MLA', type: 'AIRPORT', airportCode: 'MLA', cityCode: 'MLA', name: 'Malta Intl', cityName: 'Valletta', countryCode: 'MT', cityNameHe: 'מלטה', cityNameRu: 'Мальта' },

  // ── Russia ──────────────────────────────────────────────────────────────────────
  { id: 'SVO', type: 'AIRPORT', airportCode: 'SVO', cityCode: 'MOW', name: 'Moscow Sheremetyevo Intl', cityName: 'Moscow', countryCode: 'RU', cityNameHe: 'מוסקבה', cityNameRu: 'Москва (Шереметьево)' },
  { id: 'DME', type: 'AIRPORT', airportCode: 'DME', cityCode: 'MOW', name: 'Moscow Domodedovo Intl', cityName: 'Moscow', countryCode: 'RU', cityNameHe: 'מוסקבה (דומדדובו)', cityNameRu: 'Москва (Домодедово)' },
  { id: 'VKO', type: 'AIRPORT', airportCode: 'VKO', cityCode: 'MOW', name: 'Moscow Vnukovo Intl', cityName: 'Moscow', countryCode: 'RU', cityNameHe: 'מוסקבה (ווינוקובו)', cityNameRu: 'Москва (Внуково)' },
  { id: 'LED', type: 'AIRPORT', airportCode: 'LED', cityCode: 'LED', name: 'Saint Petersburg Pulkovo Intl', cityName: 'Saint Petersburg', countryCode: 'RU', cityNameHe: 'סנט פטרסבורג', cityNameRu: 'Санкт-Петербург' },
  { id: 'SVX', type: 'AIRPORT', airportCode: 'SVX', cityCode: 'SVX', name: 'Yekaterinburg Koltsovo Intl', cityName: 'Yekaterinburg', countryCode: 'RU', cityNameRu: 'Екатеринбург' },
  { id: 'OVB', type: 'AIRPORT', airportCode: 'OVB', cityCode: 'OVB', name: 'Novosibirsk Tolmachevo Intl', cityName: 'Novosibirsk', countryCode: 'RU', cityNameRu: 'Новосибирск' },
  { id: 'KRR', type: 'AIRPORT', airportCode: 'KRR', cityCode: 'KRR', name: 'Krasnodar Pashkovsky Intl', cityName: 'Krasnodar', countryCode: 'RU', cityNameRu: 'Краснодар' },
  { id: 'AER', type: 'AIRPORT', airportCode: 'AER', cityCode: 'AER', name: 'Sochi Intl', cityName: 'Sochi', countryCode: 'RU', cityNameHe: 'סוצ\'י', cityNameRu: 'Сочи' },
  { id: 'KZN', type: 'AIRPORT', airportCode: 'KZN', cityCode: 'KZN', name: 'Kazan Intl', cityName: 'Kazan', countryCode: 'RU', cityNameRu: 'Казань' },
  { id: 'UFA', type: 'AIRPORT', airportCode: 'UFA', cityCode: 'UFA', name: 'Ufa Intl', cityName: 'Ufa', countryCode: 'RU', cityNameRu: 'Уфа' },
  { id: 'VVO', type: 'AIRPORT', airportCode: 'VVO', cityCode: 'VVO', name: 'Vladivostok Intl', cityName: 'Vladivostok', countryCode: 'RU', cityNameRu: 'Владивосток' },
  { id: 'KHV', type: 'AIRPORT', airportCode: 'KHV', cityCode: 'KHV', name: 'Khabarovsk Novy Intl', cityName: 'Khabarovsk', countryCode: 'RU', cityNameRu: 'Хабаровск' },
  { id: 'IKT', type: 'AIRPORT', airportCode: 'IKT', cityCode: 'IKT', name: 'Irkutsk Intl', cityName: 'Irkutsk', countryCode: 'RU', cityNameRu: 'Иркутск' },
  { id: 'KJA', type: 'AIRPORT', airportCode: 'KJA', cityCode: 'KJA', name: 'Krasnoyarsk Yemelyanovo Intl', cityName: 'Krasnoyarsk', countryCode: 'RU', cityNameRu: 'Красноярск' },
  { id: 'ROV', type: 'AIRPORT', airportCode: 'ROV', cityCode: 'ROV', name: 'Rostov-on-Don Platov Intl', cityName: 'Rostov-on-Don', countryCode: 'RU', cityNameRu: 'Ростов-на-Дону' },
  { id: 'MRV', type: 'AIRPORT', airportCode: 'MRV', cityCode: 'MRV', name: 'Mineralnye Vody Airport', cityName: 'Mineralnye Vody', countryCode: 'RU', cityNameRu: 'Минеральные Воды' },

  // ── Central Asia ─────────────────────────────────────────────────────────────
  { id: 'ALA', type: 'AIRPORT', airportCode: 'ALA', cityCode: 'ALA', name: 'Almaty Intl', cityName: 'Almaty', countryCode: 'KZ', cityNameRu: 'Алматы' },
  { id: 'TSE', type: 'AIRPORT', airportCode: 'TSE', cityCode: 'TSE', name: 'Astana Intl', cityName: 'Astana', countryCode: 'KZ', cityNameRu: 'Астана' },
  { id: 'TAS', type: 'AIRPORT', airportCode: 'TAS', cityCode: 'TAS', name: 'Tashkent Intl', cityName: 'Tashkent', countryCode: 'UZ', cityNameRu: 'Ташкент' },
  { id: 'FRU', type: 'AIRPORT', airportCode: 'FRU', cityCode: 'FRU', name: 'Bishkek Manas Intl', cityName: 'Bishkek', countryCode: 'KG', cityNameRu: 'Бишкек' },
  { id: 'DYU', type: 'AIRPORT', airportCode: 'DYU', cityCode: 'DYU', name: 'Dushanbe Intl', cityName: 'Dushanbe', countryCode: 'TJ', cityNameRu: 'Душанбе' },
  { id: 'ASB', type: 'AIRPORT', airportCode: 'ASB', cityCode: 'ASB', name: 'Ashgabat Intl', cityName: 'Ashgabat', countryCode: 'TM', cityNameRu: 'Ашхабад' },

  // ── South Asia ────────────────────────────────────────────────────────────────
  { id: 'DEL', type: 'AIRPORT', airportCode: 'DEL', cityCode: 'DEL', name: 'New Delhi Indira Gandhi Intl', cityName: 'New Delhi', countryCode: 'IN', cityNameHe: 'ניו דלהי', cityNameRu: 'Нью-Дели' },
  { id: 'BOM', type: 'AIRPORT', airportCode: 'BOM', cityCode: 'BOM', name: 'Mumbai Chhatrapati Shivaji Intl', cityName: 'Mumbai', countryCode: 'IN', cityNameHe: 'מומביי', cityNameRu: 'Мумбаи' },
  { id: 'BLR', type: 'AIRPORT', airportCode: 'BLR', cityCode: 'BLR', name: 'Bengaluru Kempegowda Intl', cityName: 'Bangalore', countryCode: 'IN', cityNameHe: 'בנגלור', cityNameRu: 'Бангалор' },
  { id: 'MAA', type: 'AIRPORT', airportCode: 'MAA', cityCode: 'MAA', name: 'Chennai Intl', cityName: 'Chennai', countryCode: 'IN', cityNameHe: 'צ\'נאי', cityNameRu: 'Ченнаи' },
  { id: 'HYD', type: 'AIRPORT', airportCode: 'HYD', cityCode: 'HYD', name: 'Hyderabad Rajiv Gandhi Intl', cityName: 'Hyderabad', countryCode: 'IN', cityNameRu: 'Хайдарабад' },
  { id: 'CCU', type: 'AIRPORT', airportCode: 'CCU', cityCode: 'CCU', name: 'Kolkata Netaji Subhash Chandra Bose Intl', cityName: 'Kolkata', countryCode: 'IN', cityNameRu: 'Калькутта' },
  { id: 'COK', type: 'AIRPORT', airportCode: 'COK', cityCode: 'COK', name: 'Kochi Intl', cityName: 'Kochi', countryCode: 'IN', cityNameRu: 'Кочи' },
  { id: 'GOI', type: 'AIRPORT', airportCode: 'GOI', cityCode: 'GOI', name: 'Goa Dabolim Intl', cityName: 'Goa', countryCode: 'IN', cityNameHe: 'גואה', cityNameRu: 'Гоа' },
  { id: 'AMD', type: 'AIRPORT', airportCode: 'AMD', cityCode: 'AMD', name: 'Ahmedabad Sardar Vallabhbhai Patel Intl', cityName: 'Ahmedabad', countryCode: 'IN', cityNameRu: 'Ахмадабад' },
  { id: 'DAC', type: 'AIRPORT', airportCode: 'DAC', cityCode: 'DAC', name: 'Dhaka Hazrat Shahjalal Intl', cityName: 'Dhaka', countryCode: 'BD', cityNameRu: 'Дакка' },
  { id: 'CMB', type: 'AIRPORT', airportCode: 'CMB', cityCode: 'CMB', name: 'Colombo Bandaranaike Intl', cityName: 'Colombo', countryCode: 'LK', cityNameHe: 'קולומבו', cityNameRu: 'Коломбо' },
  { id: 'KTM', type: 'AIRPORT', airportCode: 'KTM', cityCode: 'KTM', name: 'Kathmandu Tribhuvan Intl', cityName: 'Kathmandu', countryCode: 'NP', cityNameHe: 'קטמנדו', cityNameRu: 'Катманду' },
  { id: 'KHI', type: 'AIRPORT', airportCode: 'KHI', cityCode: 'KHI', name: 'Karachi Jinnah Intl', cityName: 'Karachi', countryCode: 'PK', cityNameRu: 'Карачи' },
  { id: 'LHE', type: 'AIRPORT', airportCode: 'LHE', cityCode: 'LHE', name: 'Lahore Allama Iqbal Intl', cityName: 'Lahore', countryCode: 'PK', cityNameRu: 'Лахор' },
  { id: 'ISB', type: 'AIRPORT', airportCode: 'ISB', cityCode: 'ISB', name: 'Islamabad Intl', cityName: 'Islamabad', countryCode: 'PK', cityNameRu: 'Исламабад' },
  { id: 'KBL', type: 'AIRPORT', airportCode: 'KBL', cityCode: 'KBL', name: 'Kabul Intl', cityName: 'Kabul', countryCode: 'AF', cityNameRu: 'Кабул' },

  // ── Southeast Asia ────────────────────────────────────────────────────────────
  { id: 'BKK', type: 'AIRPORT', airportCode: 'BKK', cityCode: 'BKK', name: 'Bangkok Suvarnabhumi Intl', cityName: 'Bangkok', countryCode: 'TH', cityNameHe: 'בנגקוק', cityNameRu: 'Бангкок' },
  { id: 'DMK', type: 'AIRPORT', airportCode: 'DMK', cityCode: 'BKK', name: 'Bangkok Don Mueang Intl', cityName: 'Bangkok', countryCode: 'TH', cityNameHe: 'בנגקוק (דון מיאנג)', cityNameRu: 'Бангкок (Дон Муанг)' },
  { id: 'HKT', type: 'AIRPORT', airportCode: 'HKT', cityCode: 'HKT', name: 'Phuket Intl', cityName: 'Phuket', countryCode: 'TH', cityNameHe: 'פוקט', cityNameRu: 'Пхукет' },
  { id: 'CNX', type: 'AIRPORT', airportCode: 'CNX', cityCode: 'CNX', name: 'Chiang Mai Intl', cityName: 'Chiang Mai', countryCode: 'TH', cityNameHe: 'צ\'יאנג מאי', cityNameRu: 'Чиангмай' },
  { id: 'USM', type: 'AIRPORT', airportCode: 'USM', cityCode: 'USM', name: 'Koh Samui Airport', cityName: 'Koh Samui', countryCode: 'TH', cityNameHe: 'קו סמוי', cityNameRu: 'Самуи' },
  { id: 'KBV', type: 'AIRPORT', airportCode: 'KBV', cityCode: 'KBV', name: 'Krabi Intl', cityName: 'Krabi', countryCode: 'TH', cityNameHe: 'קראבי', cityNameRu: 'Краби' },
  { id: 'SIN', type: 'AIRPORT', airportCode: 'SIN', cityCode: 'SIN', name: 'Singapore Changi Intl', cityName: 'Singapore', countryCode: 'SG', cityNameHe: 'סינגפור', cityNameRu: 'Сингапур' },
  { id: 'KUL', type: 'AIRPORT', airportCode: 'KUL', cityCode: 'KUL', name: 'Kuala Lumpur Intl', cityName: 'Kuala Lumpur', countryCode: 'MY', cityNameHe: 'קואלה לומפור', cityNameRu: 'Куала-Лумпур' },
  { id: 'PEN', type: 'AIRPORT', airportCode: 'PEN', cityCode: 'PEN', name: 'Penang Intl', cityName: 'Penang', countryCode: 'MY', cityNameRu: 'Пенанг' },
  { id: 'LGK', type: 'AIRPORT', airportCode: 'LGK', cityCode: 'LGK', name: 'Langkawi Intl', cityName: 'Langkawi', countryCode: 'MY', cityNameHe: 'לנגקווי', cityNameRu: 'Лангкави' },
  { id: 'CGK', type: 'AIRPORT', airportCode: 'CGK', cityCode: 'JKT', name: 'Jakarta Soekarno-Hatta Intl', cityName: 'Jakarta', countryCode: 'ID', cityNameHe: 'ג\'קרטה', cityNameRu: 'Джакарта' },
  { id: 'DPS', type: 'AIRPORT', airportCode: 'DPS', cityCode: 'DPS', name: 'Bali Ngurah Rai Intl', cityName: 'Bali', countryCode: 'ID', cityNameHe: 'באלי', cityNameRu: 'Бали' },
  { id: 'SUB', type: 'AIRPORT', airportCode: 'SUB', cityCode: 'SUB', name: 'Surabaya Juanda Intl', cityName: 'Surabaya', countryCode: 'ID', cityNameRu: 'Сурабая' },
  { id: 'MNL', type: 'AIRPORT', airportCode: 'MNL', cityCode: 'MNL', name: 'Manila Ninoy Aquino Intl', cityName: 'Manila', countryCode: 'PH', cityNameHe: 'מנילה', cityNameRu: 'Манила' },
  { id: 'CEB', type: 'AIRPORT', airportCode: 'CEB', cityCode: 'CEB', name: 'Mactan–Cebu Intl', cityName: 'Cebu', countryCode: 'PH', cityNameRu: 'Себу' },
  { id: 'DVO', type: 'AIRPORT', airportCode: 'DVO', cityCode: 'DVO', name: 'Francisco Bangoy Intl', cityName: 'Davao', countryCode: 'PH', cityNameRu: 'Давао' },
  { id: 'HAN', type: 'AIRPORT', airportCode: 'HAN', cityCode: 'HAN', name: 'Hanoi Noi Bai Intl', cityName: 'Hanoi', countryCode: 'VN', cityNameHe: 'האנוי', cityNameRu: 'Ханой' },
  { id: 'SGN', type: 'AIRPORT', airportCode: 'SGN', cityCode: 'HCM', name: 'Ho Chi Minh City Tan Son Nhat Intl', cityName: 'Ho Chi Minh City', countryCode: 'VN', cityNameHe: 'הו צ\'י מין', cityNameRu: 'Хошимин' },
  { id: 'DAD', type: 'AIRPORT', airportCode: 'DAD', cityCode: 'DAD', name: 'Da Nang Intl', cityName: 'Da Nang', countryCode: 'VN', cityNameHe: 'דא נאנג', cityNameRu: 'Дананг' },
  { id: 'PNH', type: 'AIRPORT', airportCode: 'PNH', cityCode: 'PNH', name: 'Phnom Penh Intl', cityName: 'Phnom Penh', countryCode: 'KH', cityNameRu: 'Пномпень' },
  { id: 'REP', type: 'AIRPORT', airportCode: 'REP', cityCode: 'REP', name: 'Siem Reap Angkor Intl', cityName: 'Siem Reap', countryCode: 'KH', cityNameHe: 'סיאם ריפ', cityNameRu: 'Сием-Рип' },
  { id: 'RGN', type: 'AIRPORT', airportCode: 'RGN', cityCode: 'RGN', name: 'Yangon Intl', cityName: 'Yangon', countryCode: 'MM', cityNameRu: 'Янгон' },
  { id: 'VTE', type: 'AIRPORT', airportCode: 'VTE', cityCode: 'VTE', name: 'Vientiane Wattay Intl', cityName: 'Vientiane', countryCode: 'LA', cityNameRu: 'Вьентьян' },
  { id: 'MDV', type: 'AIRPORT', airportCode: 'MDV', cityCode: 'MDV', name: 'Maldives Velana Intl', cityName: 'Malé', countryCode: 'MV', cityNameHe: 'מלדיביים', cityNameRu: 'Мальдивы' },

  // ── East Asia ─────────────────────────────────────────────────────────────────
  { id: 'PEK', type: 'AIRPORT', airportCode: 'PEK', cityCode: 'BJS', name: 'Beijing Capital Intl', cityName: 'Beijing', countryCode: 'CN', cityNameHe: 'בייג\'ינג', cityNameRu: 'Пекин' },
  { id: 'PKX', type: 'AIRPORT', airportCode: 'PKX', cityCode: 'BJS', name: 'Beijing Daxing Intl', cityName: 'Beijing', countryCode: 'CN', cityNameHe: 'בייג\'ינג (דאקסינג)', cityNameRu: 'Пекин (Дасин)' },
  { id: 'PVG', type: 'AIRPORT', airportCode: 'PVG', cityCode: 'SHA', name: 'Shanghai Pudong Intl', cityName: 'Shanghai', countryCode: 'CN', cityNameHe: 'שנגחאי', cityNameRu: 'Шанхай' },
  { id: 'SHA', type: 'AIRPORT', airportCode: 'SHA', cityCode: 'SHA', name: 'Shanghai Hongqiao Intl', cityName: 'Shanghai', countryCode: 'CN', cityNameHe: 'שנגחאי (הונגקיאו)', cityNameRu: 'Шанхай (Хунцяо)' },
  { id: 'CAN', type: 'AIRPORT', airportCode: 'CAN', cityCode: 'CAN', name: 'Guangzhou Baiyun Intl', cityName: 'Guangzhou', countryCode: 'CN', cityNameRu: 'Гуанчжоу' },
  { id: 'SZX', type: 'AIRPORT', airportCode: 'SZX', cityCode: 'SZX', name: 'Shenzhen Bao\'an Intl', cityName: 'Shenzhen', countryCode: 'CN', cityNameRu: 'Шэньчжэнь' },
  { id: 'CTU', type: 'AIRPORT', airportCode: 'CTU', cityCode: 'CTU', name: 'Chengdu Tianfu Intl', cityName: 'Chengdu', countryCode: 'CN', cityNameRu: 'Чэнду' },
  { id: 'KMG', type: 'AIRPORT', airportCode: 'KMG', cityCode: 'KMG', name: 'Kunming Changshui Intl', cityName: 'Kunming', countryCode: 'CN', cityNameRu: 'Куньмин' },
  { id: 'XIY', type: 'AIRPORT', airportCode: 'XIY', cityCode: 'SIA', name: "Xi'an Xianyang Intl", cityName: "Xi'an", countryCode: 'CN', cityNameRu: 'Сиань' },
  { id: 'HGH', type: 'AIRPORT', airportCode: 'HGH', cityCode: 'HGH', name: 'Hangzhou Xiaoshan Intl', cityName: 'Hangzhou', countryCode: 'CN', cityNameRu: 'Ханчжоу' },
  { id: 'WUH', type: 'AIRPORT', airportCode: 'WUH', cityCode: 'WUH', name: 'Wuhan Tianhe Intl', cityName: 'Wuhan', countryCode: 'CN', cityNameRu: 'Ухань' },
  { id: 'HAK', type: 'AIRPORT', airportCode: 'HAK', cityCode: 'HAK', name: 'Haikou Meilan Intl', cityName: 'Haikou', countryCode: 'CN', cityNameRu: 'Хайкоу' },
  { id: 'URC', type: 'AIRPORT', airportCode: 'URC', cityCode: 'URC', name: 'Urumqi Diwopu Intl', cityName: 'Urumqi', countryCode: 'CN', cityNameRu: 'Урумчи' },
  { id: 'HKG', type: 'AIRPORT', airportCode: 'HKG', cityCode: 'HKG', name: 'Hong Kong Chek Lap Kok Intl', cityName: 'Hong Kong', countryCode: 'HK', cityNameHe: 'הונג קונג', cityNameRu: 'Гонконг' },
  { id: 'MFM', type: 'AIRPORT', airportCode: 'MFM', cityCode: 'MFM', name: 'Macau Intl', cityName: 'Macau', countryCode: 'MO', cityNameRu: 'Макао' },
  { id: 'TPE', type: 'AIRPORT', airportCode: 'TPE', cityCode: 'TPE', name: 'Taipei Taoyuan Intl', cityName: 'Taipei', countryCode: 'TW', cityNameHe: 'טאיפיי', cityNameRu: 'Тайбэй' },
  { id: 'KHH', type: 'AIRPORT', airportCode: 'KHH', cityCode: 'KHH', name: 'Kaohsiung Intl', cityName: 'Kaohsiung', countryCode: 'TW', cityNameRu: 'Гаосюн' },
  { id: 'ICN', type: 'AIRPORT', airportCode: 'ICN', cityCode: 'SEL', name: 'Seoul Incheon Intl', cityName: 'Seoul', countryCode: 'KR', cityNameHe: 'סיאול', cityNameRu: 'Сеул' },
  { id: 'GMP', type: 'AIRPORT', airportCode: 'GMP', cityCode: 'SEL', name: 'Seoul Gimpo Intl', cityName: 'Seoul', countryCode: 'KR', cityNameHe: 'סיאול (גימפו)', cityNameRu: 'Сеул (Кимпхо)' },
  { id: 'PUS', type: 'AIRPORT', airportCode: 'PUS', cityCode: 'PUS', name: 'Busan Gimhae Intl', cityName: 'Busan', countryCode: 'KR', cityNameRu: 'Пусан' },
  { id: 'CJU', type: 'AIRPORT', airportCode: 'CJU', cityCode: 'CJU', name: 'Jeju Intl', cityName: 'Jeju', countryCode: 'KR', cityNameHe: 'ג\'ז\'ו', cityNameRu: 'Чеджу' },
  { id: 'NRT', type: 'AIRPORT', airportCode: 'NRT', cityCode: 'TYO', name: 'Tokyo Narita Intl', cityName: 'Tokyo', countryCode: 'JP', cityNameHe: 'טוקיו (נריטה)', cityNameRu: 'Токио (Нарита)' },
  { id: 'HND', type: 'AIRPORT', airportCode: 'HND', cityCode: 'TYO', name: 'Tokyo Haneda Intl', cityName: 'Tokyo', countryCode: 'JP', cityNameHe: 'טוקיו (הנדה)', cityNameRu: 'Токио (Ханэда)' },
  { id: 'KIX', type: 'AIRPORT', airportCode: 'KIX', cityCode: 'OSA', name: 'Osaka Kansai Intl', cityName: 'Osaka', countryCode: 'JP', cityNameHe: 'אוסקה', cityNameRu: 'Осака' },
  { id: 'ITM', type: 'AIRPORT', airportCode: 'ITM', cityCode: 'OSA', name: 'Osaka Itami Airport', cityName: 'Osaka', countryCode: 'JP', cityNameHe: 'אוסקה (איטמי)', cityNameRu: 'Осака (Итами)' },
  { id: 'NGO', type: 'AIRPORT', airportCode: 'NGO', cityCode: 'NGO', name: 'Nagoya Chubu Centrair Intl', cityName: 'Nagoya', countryCode: 'JP', cityNameRu: 'Нагоя' },
  { id: 'FUK', type: 'AIRPORT', airportCode: 'FUK', cityCode: 'FUK', name: 'Fukuoka Airport', cityName: 'Fukuoka', countryCode: 'JP', cityNameRu: 'Фукуока' },
  { id: 'CTS', type: 'AIRPORT', airportCode: 'CTS', cityCode: 'SPK', name: 'Sapporo New Chitose Intl', cityName: 'Sapporo', countryCode: 'JP', cityNameRu: 'Саппоро' },
  { id: 'OKA', type: 'AIRPORT', airportCode: 'OKA', cityCode: 'OKA', name: 'Okinawa Naha Airport', cityName: 'Okinawa', countryCode: 'JP', cityNameHe: 'אוקינאווה', cityNameRu: 'Окинава' },

  // ── Australia / New Zealand ────────────────────────────────────────────────────
  { id: 'SYD', type: 'AIRPORT', airportCode: 'SYD', cityCode: 'SYD', name: 'Sydney Kingsford Smith Intl', cityName: 'Sydney', countryCode: 'AU', cityNameHe: 'סידני', cityNameRu: 'Сидней' },
  { id: 'MEL', type: 'AIRPORT', airportCode: 'MEL', cityCode: 'MEL', name: 'Melbourne Tullamarine Intl', cityName: 'Melbourne', countryCode: 'AU', cityNameHe: 'מלבורן', cityNameRu: 'Мельбурн' },
  { id: 'BNE', type: 'AIRPORT', airportCode: 'BNE', cityCode: 'BNE', name: 'Brisbane Airport', cityName: 'Brisbane', countryCode: 'AU', cityNameRu: 'Брисбен' },
  { id: 'PER', type: 'AIRPORT', airportCode: 'PER', cityCode: 'PER', name: 'Perth Airport', cityName: 'Perth', countryCode: 'AU', cityNameRu: 'Перт' },
  { id: 'ADL', type: 'AIRPORT', airportCode: 'ADL', cityCode: 'ADL', name: 'Adelaide Airport', cityName: 'Adelaide', countryCode: 'AU', cityNameRu: 'Аделаида' },
  { id: 'OOL', type: 'AIRPORT', airportCode: 'OOL', cityCode: 'OOL', name: 'Gold Coast Airport', cityName: 'Gold Coast', countryCode: 'AU', cityNameHe: 'גולד קוסט', cityNameRu: 'Голд-Кост' },
  { id: 'CNS', type: 'AIRPORT', airportCode: 'CNS', cityCode: 'CNS', name: 'Cairns Airport', cityName: 'Cairns', countryCode: 'AU', cityNameHe: 'קיירנס', cityNameRu: 'Кэрнс' },
  { id: 'CBR', type: 'AIRPORT', airportCode: 'CBR', cityCode: 'CBR', name: 'Canberra Airport', cityName: 'Canberra', countryCode: 'AU', cityNameRu: 'Канберра' },
  { id: 'DRW', type: 'AIRPORT', airportCode: 'DRW', cityCode: 'DRW', name: 'Darwin Intl', cityName: 'Darwin', countryCode: 'AU', cityNameRu: 'Дарвин' },
  { id: 'AKL', type: 'AIRPORT', airportCode: 'AKL', cityCode: 'AKL', name: 'Auckland Intl', cityName: 'Auckland', countryCode: 'NZ', cityNameHe: 'אוקלנד', cityNameRu: 'Окленд' },
  { id: 'CHC', type: 'AIRPORT', airportCode: 'CHC', cityCode: 'CHC', name: 'Christchurch Intl', cityName: 'Christchurch', countryCode: 'NZ', cityNameRu: 'Крайстчёрч' },
  { id: 'WLG', type: 'AIRPORT', airportCode: 'WLG', cityCode: 'WLG', name: 'Wellington Intl', cityName: 'Wellington', countryCode: 'NZ', cityNameRu: 'Веллингтон' },
  { id: 'ZQN', type: 'AIRPORT', airportCode: 'ZQN', cityCode: 'ZQN', name: 'Queenstown Airport', cityName: 'Queenstown', countryCode: 'NZ', cityNameHe: 'קווינסטאון', cityNameRu: 'Квинстаун' },

  // ── Pacific Islands ────────────────────────────────────────────────────────────
  { id: 'PPT', type: 'AIRPORT', airportCode: 'PPT', cityCode: 'PPT', name: 'Papeete Faa\'a Intl', cityName: 'Papeete', countryCode: 'PF', cityNameRu: 'Папеэте' },
  { id: 'APW', type: 'AIRPORT', airportCode: 'APW', cityCode: 'APW', name: 'Apia Faleolo Intl', cityName: 'Apia', countryCode: 'WS', cityNameRu: 'Апиа' },
  { id: 'NOU', type: 'AIRPORT', airportCode: 'NOU', cityCode: 'NOU', name: 'Noumea La Tontouta Intl', cityName: 'Noumea', countryCode: 'NC', cityNameRu: 'Нумеа' },
  { id: 'SUV', type: 'AIRPORT', airportCode: 'SUV', cityCode: 'SUV', name: 'Suva Nausori Intl', cityName: 'Suva', countryCode: 'FJ', cityNameRu: 'Сува' },
  { id: 'NAN', type: 'AIRPORT', airportCode: 'NAN', cityCode: 'NAN', name: 'Nadi Intl', cityName: 'Nadi', countryCode: 'FJ', cityNameRu: 'Нади' },
  { id: 'HIR', type: 'AIRPORT', airportCode: 'HIR', cityCode: 'HIR', name: 'Honiara Intl', cityName: 'Honiara', countryCode: 'SB', cityNameRu: 'Хониара' },
  { id: 'GUM', type: 'AIRPORT', airportCode: 'GUM', cityCode: 'GUM', name: 'Guam Antonio B. Won Pat Intl', cityName: 'Guam', countryCode: 'GU', cityNameHe: 'גואם', cityNameRu: 'Гуам' },
  { id: 'HNL', type: 'AIRPORT', airportCode: 'HNL', cityCode: 'HNL', name: 'Honolulu Daniel K. Inouye Intl', cityName: 'Honolulu', countryCode: 'US', cityNameHe: 'הונולולו', cityNameRu: 'Гонолулу' },

  // ── North America – USA ────────────────────────────────────────────────────────
  { id: 'JFK', type: 'AIRPORT', airportCode: 'JFK', cityCode: 'NYC', name: 'New York John F. Kennedy Intl', cityName: 'New York', countryCode: 'US', cityNameHe: 'ניו יורק', cityNameRu: 'Нью-Йорк' },
  { id: 'EWR', type: 'AIRPORT', airportCode: 'EWR', cityCode: 'NYC', name: 'New York Newark Liberty Intl', cityName: 'New York', countryCode: 'US', cityNameHe: 'ניו יורק (ניוארק)', cityNameRu: 'Нью-Йорк (Ньюарк)' },
  { id: 'LGA', type: 'AIRPORT', airportCode: 'LGA', cityCode: 'NYC', name: 'New York LaGuardia Airport', cityName: 'New York', countryCode: 'US', cityNameRu: 'Нью-Йорк (Ла-Гуардиа)' },
  { id: 'LAX', type: 'AIRPORT', airportCode: 'LAX', cityCode: 'LAX', name: 'Los Angeles Intl', cityName: 'Los Angeles', countryCode: 'US', cityNameHe: 'לוס אנג\'לס', cityNameRu: 'Лос-Анджелес' },
  { id: 'SFO', type: 'AIRPORT', airportCode: 'SFO', cityCode: 'SFO', name: 'San Francisco Intl', cityName: 'San Francisco', countryCode: 'US', cityNameHe: 'סן פרנסיסקו', cityNameRu: 'Сан-Франциско' },
  { id: 'ATL', type: 'AIRPORT', airportCode: 'ATL', cityCode: 'ATL', name: 'Atlanta Hartsfield-Jackson Intl', cityName: 'Atlanta', countryCode: 'US', cityNameHe: 'אטלנטה', cityNameRu: 'Атланта' },
  { id: 'ORD', type: 'AIRPORT', airportCode: 'ORD', cityCode: 'CHI', name: "Chicago O'Hare Intl", cityName: 'Chicago', countryCode: 'US', cityNameHe: 'שיקגו', cityNameRu: 'Чикаго' },
  { id: 'MDW', type: 'AIRPORT', airportCode: 'MDW', cityCode: 'CHI', name: 'Chicago Midway Intl', cityName: 'Chicago', countryCode: 'US', cityNameHe: 'שיקגו (מידווי)', cityNameRu: 'Чикаго (Мидуэй)' },
  { id: 'DFW', type: 'AIRPORT', airportCode: 'DFW', cityCode: 'DFW', name: 'Dallas Fort Worth Intl', cityName: 'Dallas', countryCode: 'US', cityNameHe: 'דאלאס', cityNameRu: 'Даллас' },
  { id: 'MIA', type: 'AIRPORT', airportCode: 'MIA', cityCode: 'MIA', name: 'Miami Intl', cityName: 'Miami', countryCode: 'US', cityNameHe: 'מיאמי', cityNameRu: 'Майами' },
  { id: 'FLL', type: 'AIRPORT', airportCode: 'FLL', cityCode: 'MIA', name: 'Fort Lauderdale-Hollywood Intl', cityName: 'Fort Lauderdale', countryCode: 'US', cityNameRu: 'Форт-Лодердейл' },
  { id: 'SEA', type: 'AIRPORT', airportCode: 'SEA', cityCode: 'SEA', name: 'Seattle-Tacoma Intl', cityName: 'Seattle', countryCode: 'US', cityNameHe: 'סיאטל', cityNameRu: 'Сиэтл' },
  { id: 'DEN', type: 'AIRPORT', airportCode: 'DEN', cityCode: 'DEN', name: 'Denver Intl', cityName: 'Denver', countryCode: 'US', cityNameHe: 'דנבר', cityNameRu: 'Денвер' },
  { id: 'BOS', type: 'AIRPORT', airportCode: 'BOS', cityCode: 'BOS', name: 'Boston Logan Intl', cityName: 'Boston', countryCode: 'US', cityNameHe: 'בוסטון', cityNameRu: 'Бостон' },
  { id: 'IAD', type: 'AIRPORT', airportCode: 'IAD', cityCode: 'WAS', name: 'Washington Dulles Intl', cityName: 'Washington D.C.', countryCode: 'US', cityNameHe: 'וושינגטון', cityNameRu: 'Вашингтон' },
  { id: 'DCA', type: 'AIRPORT', airportCode: 'DCA', cityCode: 'WAS', name: 'Washington Reagan National', cityName: 'Washington D.C.', countryCode: 'US', cityNameRu: 'Вашингтон (Рейган)' },
  { id: 'IAH', type: 'AIRPORT', airportCode: 'IAH', cityCode: 'HOU', name: 'Houston George Bush Intl', cityName: 'Houston', countryCode: 'US', cityNameHe: 'יוסטון', cityNameRu: 'Хьюстон' },
  { id: 'PHX', type: 'AIRPORT', airportCode: 'PHX', cityCode: 'PHX', name: 'Phoenix Sky Harbor Intl', cityName: 'Phoenix', countryCode: 'US', cityNameRu: 'Феникс' },
  { id: 'MCO', type: 'AIRPORT', airportCode: 'MCO', cityCode: 'ORL', name: 'Orlando Intl', cityName: 'Orlando', countryCode: 'US', cityNameHe: 'אורלנדו', cityNameRu: 'Орландо' },
  { id: 'MSP', type: 'AIRPORT', airportCode: 'MSP', cityCode: 'MSP', name: 'Minneapolis-Saint Paul Intl', cityName: 'Minneapolis', countryCode: 'US', cityNameRu: 'Миннеаполис' },
  { id: 'DTW', type: 'AIRPORT', airportCode: 'DTW', cityCode: 'DTT', name: 'Detroit Metro Wayne County Airport', cityName: 'Detroit', countryCode: 'US', cityNameRu: 'Детройт' },
  { id: 'SLC', type: 'AIRPORT', airportCode: 'SLC', cityCode: 'SLC', name: 'Salt Lake City Intl', cityName: 'Salt Lake City', countryCode: 'US', cityNameRu: 'Солт-Лейк-Сити' },
  { id: 'LAS', type: 'AIRPORT', airportCode: 'LAS', cityCode: 'LAS', name: 'Las Vegas Harry Reid Intl', cityName: 'Las Vegas', countryCode: 'US', cityNameHe: 'לאס וגאס', cityNameRu: 'Лас-Вегас' },
  { id: 'SAN', type: 'AIRPORT', airportCode: 'SAN', cityCode: 'SAN', name: 'San Diego Intl', cityName: 'San Diego', countryCode: 'US', cityNameRu: 'Сан-Диего' },
  { id: 'SJC', type: 'AIRPORT', airportCode: 'SJC', cityCode: 'SJC', name: 'San Jose Mineta Intl', cityName: 'San Jose', countryCode: 'US', cityNameRu: 'Сан-Хосе' },
  { id: 'OAK', type: 'AIRPORT', airportCode: 'OAK', cityCode: 'SFO', name: 'Oakland Intl', cityName: 'Oakland', countryCode: 'US', cityNameRu: 'Окленд (Калифорния)' },
  { id: 'CLT', type: 'AIRPORT', airportCode: 'CLT', cityCode: 'CLT', name: 'Charlotte Douglas Intl', cityName: 'Charlotte', countryCode: 'US', cityNameRu: 'Шарлотт' },
  { id: 'PHL', type: 'AIRPORT', airportCode: 'PHL', cityCode: 'PHL', name: 'Philadelphia Intl', cityName: 'Philadelphia', countryCode: 'US', cityNameHe: 'פילדלפיה', cityNameRu: 'Филадельфия' },
  { id: 'TPA', type: 'AIRPORT', airportCode: 'TPA', cityCode: 'TPA', name: 'Tampa Intl', cityName: 'Tampa', countryCode: 'US', cityNameRu: 'Тампа' },
  { id: 'AUS', type: 'AIRPORT', airportCode: 'AUS', cityCode: 'AUS', name: 'Austin-Bergstrom Intl', cityName: 'Austin', countryCode: 'US', cityNameRu: 'Остин' },
  { id: 'BNA', type: 'AIRPORT', airportCode: 'BNA', cityCode: 'BNA', name: 'Nashville Intl', cityName: 'Nashville', countryCode: 'US', cityNameRu: 'Нэшвилл' },
  { id: 'PDX', type: 'AIRPORT', airportCode: 'PDX', cityCode: 'PDX', name: 'Portland Intl', cityName: 'Portland', countryCode: 'US', cityNameRu: 'Портленд' },
  { id: 'STL', type: 'AIRPORT', airportCode: 'STL', cityCode: 'STL', name: 'St. Louis Lambert Intl', cityName: 'St. Louis', countryCode: 'US', cityNameRu: 'Сент-Луис' },
  { id: 'MCI', type: 'AIRPORT', airportCode: 'MCI', cityCode: 'MKC', name: 'Kansas City Intl', cityName: 'Kansas City', countryCode: 'US', cityNameRu: 'Канзас-Сити' },
  { id: 'MKE', type: 'AIRPORT', airportCode: 'MKE', cityCode: 'MKE', name: 'Milwaukee Mitchell Intl', cityName: 'Milwaukee', countryCode: 'US', cityNameRu: 'Милуоки' },
  { id: 'RDU', type: 'AIRPORT', airportCode: 'RDU', cityCode: 'RDU', name: 'Raleigh-Durham Intl', cityName: 'Raleigh', countryCode: 'US', cityNameRu: 'Роли-Дарем' },
  { id: 'PIT', type: 'AIRPORT', airportCode: 'PIT', cityCode: 'PIT', name: 'Pittsburgh Intl', cityName: 'Pittsburgh', countryCode: 'US', cityNameRu: 'Питтсбург' },
  { id: 'CLE', type: 'AIRPORT', airportCode: 'CLE', cityCode: 'CLE', name: 'Cleveland Hopkins Intl', cityName: 'Cleveland', countryCode: 'US', cityNameRu: 'Кливленд' },
  { id: 'CMH', type: 'AIRPORT', airportCode: 'CMH', cityCode: 'CMH', name: 'Columbus John Glenn Intl', cityName: 'Columbus', countryCode: 'US', cityNameRu: 'Колумбус' },
  { id: 'IND', type: 'AIRPORT', airportCode: 'IND', cityCode: 'IND', name: 'Indianapolis Intl', cityName: 'Indianapolis', countryCode: 'US', cityNameRu: 'Индианаполис' },
  { id: 'MSY', type: 'AIRPORT', airportCode: 'MSY', cityCode: 'MSY', name: 'New Orleans Armstrong Intl', cityName: 'New Orleans', countryCode: 'US', cityNameHe: 'ניו אורלינס', cityNameRu: 'Новый Орлеан' },
  { id: 'ANC', type: 'AIRPORT', airportCode: 'ANC', cityCode: 'ANC', name: 'Anchorage Ted Stevens Intl', cityName: 'Anchorage', countryCode: 'US', cityNameRu: 'Анкоридж' },

  // ── Canada ─────────────────────────────────────────────────────────────────────
  { id: 'YYZ', type: 'AIRPORT', airportCode: 'YYZ', cityCode: 'YTO', name: 'Toronto Pearson Intl', cityName: 'Toronto', countryCode: 'CA', cityNameHe: 'טורונטו', cityNameRu: 'Торонто' },
  { id: 'YUL', type: 'AIRPORT', airportCode: 'YUL', cityCode: 'YMQ', name: 'Montreal Pierre Elliott Trudeau Intl', cityName: 'Montreal', countryCode: 'CA', cityNameHe: 'מונטריאול', cityNameRu: 'Монреаль' },
  { id: 'YVR', type: 'AIRPORT', airportCode: 'YVR', cityCode: 'YVR', name: 'Vancouver Intl', cityName: 'Vancouver', countryCode: 'CA', cityNameHe: 'ונקובר', cityNameRu: 'Ванкувер' },
  { id: 'YYC', type: 'AIRPORT', airportCode: 'YYC', cityCode: 'YYC', name: 'Calgary Intl', cityName: 'Calgary', countryCode: 'CA', cityNameRu: 'Калгари' },
  { id: 'YEG', type: 'AIRPORT', airportCode: 'YEG', cityCode: 'YEA', name: 'Edmonton Intl', cityName: 'Edmonton', countryCode: 'CA', cityNameRu: 'Эдмонтон' },
  { id: 'YWG', type: 'AIRPORT', airportCode: 'YWG', cityCode: 'YWG', name: 'Winnipeg James Armstrong Richardson Intl', cityName: 'Winnipeg', countryCode: 'CA', cityNameRu: 'Виннипег' },
  { id: 'YHZ', type: 'AIRPORT', airportCode: 'YHZ', cityCode: 'YHZ', name: 'Halifax Stanfield Intl', cityName: 'Halifax', countryCode: 'CA', cityNameRu: 'Галифакс' },
  { id: 'YOW', type: 'AIRPORT', airportCode: 'YOW', cityCode: 'YOW', name: 'Ottawa Macdonald-Cartier Intl', cityName: 'Ottawa', countryCode: 'CA', cityNameRu: 'Оттава' },
  { id: 'YQB', type: 'AIRPORT', airportCode: 'YQB', cityCode: 'YQB', name: 'Quebec City Jean Lesage Intl', cityName: 'Quebec City', countryCode: 'CA', cityNameRu: 'Квебек' },

  // ── Mexico ─────────────────────────────────────────────────────────────────────
  { id: 'MEX', type: 'AIRPORT', airportCode: 'MEX', cityCode: 'MEX', name: 'Mexico City Benito Juárez Intl', cityName: 'Mexico City', countryCode: 'MX', cityNameHe: 'מקסיקו סיטי', cityNameRu: 'Мехико' },
  { id: 'CUN', type: 'AIRPORT', airportCode: 'CUN', cityCode: 'CUN', name: 'Cancún Intl', cityName: 'Cancún', countryCode: 'MX', cityNameHe: 'קנקון', cityNameRu: 'Канкун' },
  { id: 'GDL', type: 'AIRPORT', airportCode: 'GDL', cityCode: 'GDL', name: 'Guadalajara Miguel Hidalgo Intl', cityName: 'Guadalajara', countryCode: 'MX', cityNameRu: 'Гвадалахара' },
  { id: 'MTY', type: 'AIRPORT', airportCode: 'MTY', cityCode: 'MTY', name: 'Monterrey Mariano Escobedo Intl', cityName: 'Monterrey', countryCode: 'MX', cityNameRu: 'Монтеррей' },
  { id: 'SJD', type: 'AIRPORT', airportCode: 'SJD', cityCode: 'SJD', name: 'Los Cabos Intl', cityName: 'Los Cabos', countryCode: 'MX', cityNameHe: 'לוס קאבוס', cityNameRu: 'Лос-Кабос' },
  { id: 'PVR', type: 'AIRPORT', airportCode: 'PVR', cityCode: 'PVR', name: 'Puerto Vallarta Licenciado Gustavo Díaz Ordaz Intl', cityName: 'Puerto Vallarta', countryCode: 'MX', cityNameRu: 'Пуэрто-Вальярта' },

  // ── Caribbean ─────────────────────────────────────────────────────────────────
  { id: 'MBJ', type: 'AIRPORT', airportCode: 'MBJ', cityCode: 'MBJ', name: 'Montego Bay Sangster Intl', cityName: 'Montego Bay', countryCode: 'JM', cityNameRu: 'Монтего-Бей' },
  { id: 'KIN', type: 'AIRPORT', airportCode: 'KIN', cityCode: 'KIN', name: 'Kingston Norman Manley Intl', cityName: 'Kingston', countryCode: 'JM', cityNameRu: 'Кингстон' },
  { id: 'NAS', type: 'AIRPORT', airportCode: 'NAS', cityCode: 'NAS', name: 'Nassau Lynden Pindling Intl', cityName: 'Nassau', countryCode: 'BS', cityNameHe: 'נסאו', cityNameRu: 'Нассау' },
  { id: 'PUJ', type: 'AIRPORT', airportCode: 'PUJ', cityCode: 'PUJ', name: 'Punta Cana Intl', cityName: 'Punta Cana', countryCode: 'DO', cityNameHe: 'פונטה קאנה', cityNameRu: 'Пунта-Кана' },
  { id: 'SDQ', type: 'AIRPORT', airportCode: 'SDQ', cityCode: 'SDQ', name: 'Santo Domingo Las Américas Intl', cityName: 'Santo Domingo', countryCode: 'DO', cityNameRu: 'Санто-Доминго' },
  { id: 'SJU', type: 'AIRPORT', airportCode: 'SJU', cityCode: 'SJU', name: 'San Juan Luis Muñoz Marín Intl', cityName: 'San Juan', countryCode: 'PR', cityNameHe: 'סן חואן', cityNameRu: 'Сан-Хуан' },
  { id: 'HAV', type: 'AIRPORT', airportCode: 'HAV', cityCode: 'HAV', name: 'Havana José Martí Intl', cityName: 'Havana', countryCode: 'CU', cityNameHe: 'הוואנה', cityNameRu: 'Гавана' },
  { id: 'AUA', type: 'AIRPORT', airportCode: 'AUA', cityCode: 'AUA', name: 'Aruba Reina Beatrix Intl', cityName: 'Aruba', countryCode: 'AW', cityNameHe: 'ארובה', cityNameRu: 'Аруба' },
  { id: 'SXM', type: 'AIRPORT', airportCode: 'SXM', cityCode: 'SXM', name: 'Sint Maarten Princess Juliana Intl', cityName: 'Sint Maarten', countryCode: 'SX', cityNameRu: 'Сент-Мартен' },

  // ── Central America ────────────────────────────────────────────────────────────
  { id: 'PTY', type: 'AIRPORT', airportCode: 'PTY', cityCode: 'PTY', name: 'Panama City Tocumen Intl', cityName: 'Panama City', countryCode: 'PA', cityNameHe: 'פנמה סיטי', cityNameRu: 'Панама-Сити' },
  { id: 'SJO', type: 'AIRPORT', airportCode: 'SJO', cityCode: 'SJO', name: 'San José Juan Santamaría Intl', cityName: 'San José', countryCode: 'CR', cityNameHe: 'סן חוסה', cityNameRu: 'Сан-Хосе' },
  { id: 'GUA', type: 'AIRPORT', airportCode: 'GUA', cityCode: 'GUA', name: 'Guatemala City La Aurora Intl', cityName: 'Guatemala City', countryCode: 'GT', cityNameRu: 'Гватемала' },
  { id: 'MGA', type: 'AIRPORT', airportCode: 'MGA', cityCode: 'MGA', name: 'Managua Augusto C. Sandino Intl', cityName: 'Managua', countryCode: 'NI', cityNameRu: 'Манагуа' },

  // ── South America ──────────────────────────────────────────────────────────────
  { id: 'GRU', type: 'AIRPORT', airportCode: 'GRU', cityCode: 'SAO', name: 'São Paulo Guarulhos Intl', cityName: 'São Paulo', countryCode: 'BR', cityNameHe: 'סאו פאולו', cityNameRu: 'Сан-Паулу' },
  { id: 'GIG', type: 'AIRPORT', airportCode: 'GIG', cityCode: 'RIO', name: 'Rio de Janeiro Galeão Intl', cityName: 'Rio de Janeiro', countryCode: 'BR', cityNameHe: 'ריו דה ז\'נירו', cityNameRu: 'Рио-де-Жанейро' },
  { id: 'SDU', type: 'AIRPORT', airportCode: 'SDU', cityCode: 'RIO', name: 'Rio de Janeiro Santos Dumont', cityName: 'Rio de Janeiro', countryCode: 'BR', cityNameRu: 'Рио-де-Жанейро (Сантус-Дюмон)' },
  { id: 'BSB', type: 'AIRPORT', airportCode: 'BSB', cityCode: 'BSB', name: 'Brasília Intl', cityName: 'Brasília', countryCode: 'BR', cityNameRu: 'Бразилиа' },
  { id: 'SSA', type: 'AIRPORT', airportCode: 'SSA', cityCode: 'SSA', name: 'Salvador Dep. Luís Eduardo Magalhães Intl', cityName: 'Salvador', countryCode: 'BR', cityNameRu: 'Салвадор' },
  { id: 'FOR', type: 'AIRPORT', airportCode: 'FOR', cityCode: 'FOR', name: 'Fortaleza Pinto Martins Intl', cityName: 'Fortaleza', countryCode: 'BR', cityNameRu: 'Форталеза' },
  { id: 'REC', type: 'AIRPORT', airportCode: 'REC', cityCode: 'REC', name: 'Recife Guararapes Intl', cityName: 'Recife', countryCode: 'BR', cityNameRu: 'Ресифи' },
  { id: 'POA', type: 'AIRPORT', airportCode: 'POA', cityCode: 'POA', name: 'Porto Alegre Salgado Filho Intl', cityName: 'Porto Alegre', countryCode: 'BR', cityNameRu: 'Порту-Алегри' },
  { id: 'MAO', type: 'AIRPORT', airportCode: 'MAO', cityCode: 'MAO', name: 'Manaus Eduardo Gomes Intl', cityName: 'Manaus', countryCode: 'BR', cityNameRu: 'Манаус' },
  { id: 'EZE', type: 'AIRPORT', airportCode: 'EZE', cityCode: 'BUE', name: 'Buenos Aires Ezeiza Intl', cityName: 'Buenos Aires', countryCode: 'AR', cityNameHe: 'בואנוס איירס', cityNameRu: 'Буэнос-Айрес' },
  { id: 'AEP', type: 'AIRPORT', airportCode: 'AEP', cityCode: 'BUE', name: 'Buenos Aires Jorge Newbery Airfield', cityName: 'Buenos Aires', countryCode: 'AR', cityNameRu: 'Буэнос-Айрес (Хорхе Ньюбери)' },
  { id: 'SCL', type: 'AIRPORT', airportCode: 'SCL', cityCode: 'SCL', name: 'Santiago Comodoro Arturo Merino Benítez Intl', cityName: 'Santiago', countryCode: 'CL', cityNameHe: 'סנטיאגו', cityNameRu: 'Сантьяго' },
  { id: 'BOG', type: 'AIRPORT', airportCode: 'BOG', cityCode: 'BOG', name: 'Bogotá El Dorado Intl', cityName: 'Bogotá', countryCode: 'CO', cityNameHe: 'בוגוטה', cityNameRu: 'Богота' },
  { id: 'MDE', type: 'AIRPORT', airportCode: 'MDE', cityCode: 'MDE', name: 'Medellín José María Córdova Intl', cityName: 'Medellín', countryCode: 'CO', cityNameRu: 'Медельин' },
  { id: 'CTG', type: 'AIRPORT', airportCode: 'CTG', cityCode: 'CTG', name: 'Cartagena Rafael Núñez Intl', cityName: 'Cartagena', countryCode: 'CO', cityNameRu: 'Картахена' },
  { id: 'LIM', type: 'AIRPORT', airportCode: 'LIM', cityCode: 'LIM', name: 'Lima Jorge Chávez Intl', cityName: 'Lima', countryCode: 'PE', cityNameHe: 'לימה', cityNameRu: 'Лима' },
  { id: 'CUZ', type: 'AIRPORT', airportCode: 'CUZ', cityCode: 'CUZ', name: 'Cusco Velasco Astete Intl', cityName: 'Cusco', countryCode: 'PE', cityNameHe: 'קוסקו', cityNameRu: 'Куско' },
  { id: 'UIO', type: 'AIRPORT', airportCode: 'UIO', cityCode: 'UIO', name: 'Quito Mariscal Sucre Intl', cityName: 'Quito', countryCode: 'EC', cityNameRu: 'Кито' },
  { id: 'GYE', type: 'AIRPORT', airportCode: 'GYE', cityCode: 'GYE', name: 'Guayaquil José Joaquín de Olmedo Intl', cityName: 'Guayaquil', countryCode: 'EC', cityNameRu: 'Гуаякиль' },
  { id: 'CCS', type: 'AIRPORT', airportCode: 'CCS', cityCode: 'CCS', name: 'Caracas Simón Bolívar Intl', cityName: 'Caracas', countryCode: 'VE', cityNameRu: 'Каракас' },
  { id: 'MVD', type: 'AIRPORT', airportCode: 'MVD', cityCode: 'MVD', name: 'Montevideo Carrasco Intl', cityName: 'Montevideo', countryCode: 'UY', cityNameRu: 'Монтевидео' },
  { id: 'ASU', type: 'AIRPORT', airportCode: 'ASU', cityCode: 'ASU', name: 'Asunción Silvio Pettirossi Intl', cityName: 'Asunción', countryCode: 'PY', cityNameRu: 'Асунсьон' },
  { id: 'LPB', type: 'AIRPORT', airportCode: 'LPB', cityCode: 'LPB', name: 'La Paz El Alto Intl', cityName: 'La Paz', countryCode: 'BO', cityNameRu: 'Ла-Пас' },
  { id: 'VVI', type: 'AIRPORT', airportCode: 'VVI', cityCode: 'SRZ', name: 'Santa Cruz Viru Viru Intl', cityName: 'Santa Cruz', countryCode: 'BO', cityNameRu: 'Санта-Крус' },
  { id: 'GEO', type: 'AIRPORT', airportCode: 'GEO', cityCode: 'GEO', name: 'Georgetown Cheddi Jagan Intl', cityName: 'Georgetown', countryCode: 'GY', cityNameRu: 'Джорджтаун' },
];

const lower = (s: string) => s.toLowerCase();

function matchesQuery(a: AirportCityResult, q: string): boolean {
  const code = a.airportCode || a.cityCode || a.id;
  if (lower(code).startsWith(q)) return true;   // IATA code prefix match first
  if (lower(code).includes(q)) return true;
  if (a.cityName && lower(a.cityName).includes(q)) return true;
  if (lower(a.name).includes(q)) return true;
  if (a.countryCode && lower(a.countryCode) === q) return true;
  if (a.cityNameHe && lower(a.cityNameHe).includes(q)) return true;
  if (a.cityNameRu && lower(a.cityNameRu).includes(q)) return true;
  if (a.nameHe && lower(a.nameHe).includes(q)) return true;
  if (a.nameRu && lower(a.nameRu).includes(q)) return true;
  return false;
}

/** Rank results: IATA prefix matches first, then city name, then other matches. */
function rankResult(a: AirportCityResult, q: string): number {
  const code = lower(a.airportCode || a.cityCode || a.id);
  if (code === q) return 0;
  if (code.startsWith(q)) return 1;
  if (a.cityName && lower(a.cityName).startsWith(q)) return 2;
  if (a.cityName && lower(a.cityName).includes(q)) return 3;
  if (lower(a.name).startsWith(q)) return 4;
  return 5;
}

/** Search the dictionary by code or city/airport name (incl. localized names); returns matches for Amadeus-ready codes. */
export function searchAirportsLocal(query: string, limit = 15, _language?: LanguageCode): AirportCityResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: AirportCityResult[] = [];
  for (const a of AIRPORT_DICTIONARY) {
    if (matchesQuery(a, q)) {
      out.push(a);
    }
  }
  out.sort((a, b) => rankResult(a, q) - rankResult(b, q));
  return out.slice(0, limit);
}

/** Display city name in the given language (for dropdown and selected value). */
export function getCityDisplayName(a: AirportCityResult, language: LanguageCode): string {
  if (language === 'he' && a.cityNameHe) return a.cityNameHe;
  if (language === 'ru' && a.cityNameRu) return a.cityNameRu;
  return a.cityName || a.name || '';
}

/** Display airport/place name in the given language (for subtitle). */
export function getAirportDisplayName(a: AirportCityResult, language: LanguageCode): string {
  if (language === 'he' && a.nameHe) return a.nameHe;
  if (language === 'ru' && a.nameRu) return a.nameRu;
  return a.name || '';
}

/** Get full display name for an airport by IATA code (e.g. "TLV" → "Tel Aviv (Ben Gurion Intl)"). Falls back to code if not in dictionary. */
export function getAirportNameByCode(code: string | undefined | null, language: LanguageCode): string {
  if (!code || typeof code !== 'string') return code || '?';
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return code;
  const a = AIRPORT_DICTIONARY.find((x) => x.airportCode === trimmed || x.id === trimmed);
  if (!a) return code;
  const city = getCityDisplayName(a, language);
  const airport = getAirportDisplayName(a, language);
  if (city && airport) return `${city} (${airport})`;
  return city || airport || code;
}
