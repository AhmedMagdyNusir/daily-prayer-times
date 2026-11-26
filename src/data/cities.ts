// Egyptian cities: every governorate capital plus major new and tourist cities.
// Coordinates are city centers, which is precise enough for prayer times
// (0.1° of longitude shifts times by well under a minute).

export interface City {
  id: string;
  name: string;
  governorate: string;
  lat: number;
  lng: number;
}

export const DEFAULT_CITY_ID = "cairo";

export const cities: City[] = [
  // القاهرة
  { id: "cairo", name: "القاهرة", governorate: "القاهرة", lat: 30.0444, lng: 31.2357 },
  { id: "new-cairo", name: "القاهرة الجديدة", governorate: "القاهرة", lat: 30.03, lng: 31.47 },
  { id: "helwan", name: "حلوان", governorate: "القاهرة", lat: 29.85, lng: 31.334 },
  { id: "new-capital", name: "العاصمة الإدارية الجديدة", governorate: "القاهرة", lat: 30.02, lng: 31.76 },

  // الجيزة
  { id: "giza", name: "الجيزة", governorate: "الجيزة", lat: 30.0131, lng: 31.2089 },
  { id: "6th-october", name: "السادس من أكتوبر", governorate: "الجيزة", lat: 29.9285, lng: 30.9188 },
  { id: "sheikh-zayed", name: "الشيخ زايد", governorate: "الجيزة", lat: 30.044, lng: 30.98 },

  // القليوبية
  { id: "banha", name: "بنها", governorate: "القليوبية", lat: 30.466, lng: 31.1848 },
  { id: "shubra-el-kheima", name: "شبرا الخيمة", governorate: "القليوبية", lat: 30.1286, lng: 31.2422 },
  { id: "obour", name: "العبور", governorate: "القليوبية", lat: 30.228, lng: 31.477 },

  // الإسكندرية
  { id: "alexandria", name: "الإسكندرية", governorate: "الإسكندرية", lat: 31.2001, lng: 29.9187 },
  { id: "borg-el-arab", name: "برج العرب الجديدة", governorate: "الإسكندرية", lat: 30.85, lng: 29.58 },

  // البحيرة
  { id: "damanhour", name: "دمنهور", governorate: "البحيرة", lat: 31.0341, lng: 30.4682 },
  { id: "kafr-el-dawwar", name: "كفر الدوار", governorate: "البحيرة", lat: 31.1339, lng: 30.1297 },

  // كفر الشيخ
  { id: "kafr-el-sheikh", name: "كفر الشيخ", governorate: "كفر الشيخ", lat: 31.1107, lng: 30.9388 },
  { id: "desouk", name: "دسوق", governorate: "كفر الشيخ", lat: 31.1325, lng: 30.6478 },

  // الغربية
  { id: "tanta", name: "طنطا", governorate: "الغربية", lat: 30.7865, lng: 31.0004 },
  { id: "mahalla", name: "المحلة الكبرى", governorate: "الغربية", lat: 30.9706, lng: 31.1669 },

  // المنوفية
  { id: "shebin-el-kom", name: "شبين الكوم", governorate: "المنوفية", lat: 30.559, lng: 31.009 },
  { id: "sadat-city", name: "مدينة السادات", governorate: "المنوفية", lat: 30.37, lng: 30.53 },

  // الدقهلية
  { id: "mansoura", name: "المنصورة", governorate: "الدقهلية", lat: 31.0409, lng: 31.3785 },
  { id: "mit-ghamr", name: "ميت غمر", governorate: "الدقهلية", lat: 30.7186, lng: 31.2564 },

  // دمياط
  { id: "damietta", name: "دمياط", governorate: "دمياط", lat: 31.4165, lng: 31.8133 },
  { id: "ras-el-bar", name: "رأس البر", governorate: "دمياط", lat: 31.51, lng: 31.83 },

  // الشرقية
  { id: "zagazig", name: "الزقازيق", governorate: "الشرقية", lat: 30.5877, lng: 31.502 },
  { id: "10th-of-ramadan", name: "العاشر من رمضان", governorate: "الشرقية", lat: 30.296, lng: 31.743 },
  { id: "belbeis", name: "بلبيس", governorate: "الشرقية", lat: 30.4204, lng: 31.5622 },

  // بورسعيد
  { id: "port-said", name: "بورسعيد", governorate: "بورسعيد", lat: 31.2653, lng: 32.3019 },

  // الإسماعيلية
  { id: "ismailia", name: "الإسماعيلية", governorate: "الإسماعيلية", lat: 30.5965, lng: 32.2715 },

  // السويس
  { id: "suez", name: "السويس", governorate: "السويس", lat: 29.9668, lng: 32.5498 },

  // شمال سيناء
  { id: "arish", name: "العريش", governorate: "شمال سيناء", lat: 31.1316, lng: 33.7984 },

  // جنوب سيناء
  { id: "el-tor", name: "الطور", governorate: "جنوب سيناء", lat: 28.241, lng: 33.622 },
  { id: "sharm-el-sheikh", name: "شرم الشيخ", governorate: "جنوب سيناء", lat: 27.9158, lng: 34.33 },
  { id: "dahab", name: "دهب", governorate: "جنوب سيناء", lat: 28.509, lng: 34.513 },

  // البحر الأحمر
  { id: "hurghada", name: "الغردقة", governorate: "البحر الأحمر", lat: 27.2579, lng: 33.8116 },
  { id: "safaga", name: "سفاجا", governorate: "البحر الأحمر", lat: 26.7333, lng: 33.9333 },
  { id: "el-quseir", name: "القصير", governorate: "البحر الأحمر", lat: 26.106, lng: 34.281 },
  { id: "marsa-alam", name: "مرسى علم", governorate: "البحر الأحمر", lat: 25.0676, lng: 34.879 },

  // الفيوم
  { id: "faiyum", name: "الفيوم", governorate: "الفيوم", lat: 29.3084, lng: 30.8428 },

  // بني سويف
  { id: "beni-suef", name: "بني سويف", governorate: "بني سويف", lat: 29.0661, lng: 31.0994 },

  // المنيا
  { id: "minya", name: "المنيا", governorate: "المنيا", lat: 28.0871, lng: 30.7618 },
  { id: "mallawi", name: "ملوي", governorate: "المنيا", lat: 27.7314, lng: 30.8417 },

  // أسيوط
  { id: "asyut", name: "أسيوط", governorate: "أسيوط", lat: 27.1783, lng: 31.1859 },

  // سوهاج
  { id: "sohag", name: "سوهاج", governorate: "سوهاج", lat: 26.5591, lng: 31.6957 },

  // قنا
  { id: "qena", name: "قنا", governorate: "قنا", lat: 26.1551, lng: 32.716 },
  { id: "nag-hammadi", name: "نجع حمادي", governorate: "قنا", lat: 26.049, lng: 32.242 },

  // الأقصر
  { id: "luxor", name: "الأقصر", governorate: "الأقصر", lat: 25.6872, lng: 32.6396 },

  // أسوان
  { id: "aswan", name: "أسوان", governorate: "أسوان", lat: 24.0889, lng: 32.8998 },
  { id: "kom-ombo", name: "كوم أمبو", governorate: "أسوان", lat: 24.476, lng: 32.946 },
  { id: "edfu", name: "إدفو", governorate: "أسوان", lat: 24.9781, lng: 32.8758 },
  { id: "abu-simbel", name: "أبو سمبل", governorate: "أسوان", lat: 22.3372, lng: 31.6258 },

  // الوادي الجديد
  { id: "kharga", name: "الخارجة", governorate: "الوادي الجديد", lat: 25.439, lng: 30.5586 },
  { id: "dakhla", name: "الداخلة", governorate: "الوادي الجديد", lat: 25.495, lng: 28.98 },
  { id: "farafra", name: "الفرافرة", governorate: "الوادي الجديد", lat: 27.058, lng: 27.97 },

  // مطروح
  { id: "marsa-matrouh", name: "مرسى مطروح", governorate: "مطروح", lat: 31.3543, lng: 27.2373 },
  { id: "new-alamein", name: "العلمين الجديدة", governorate: "مطروح", lat: 30.83, lng: 28.95 },
  { id: "siwa", name: "سيوة", governorate: "مطروح", lat: 29.2032, lng: 25.5195 },
];

export function getCityById(id: string): City | undefined {
  return cities.find((city) => city.id === id);
}

// Nearest listed city, used to label a GPS position
export function findNearestCity(lat: number, lng: number): City {
  let nearest = cities[0];
  let best = Infinity;
  for (const city of cities) {
    const dLat = city.lat - lat;
    const dLng = (city.lng - lng) * Math.cos((lat * Math.PI) / 180);
    const d = dLat * dLat + dLng * dLng;
    if (d < best) {
      best = d;
      nearest = city;
    }
  }
  return nearest;
}
