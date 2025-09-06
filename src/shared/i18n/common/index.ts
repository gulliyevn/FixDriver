const ru = require('./ru.json');
const en = require('./en.json');
const tr = require('./tr.json');
const az = require('./az.json');
const fr = require('./fr.json');
const ar = require('./ar.json');
const es = require('./es.json');
const de = require('./de.json');
const levels = require('./levels.json');

module.exports = {
  ru: { ...ru, levels: levels.ru },
  en: { ...en, levels: levels.en },
  tr: { ...tr, levels: levels.tr },
  az: { ...az, levels: levels.az },
  fr: { ...fr, levels: levels.fr },
  ar: { ...ar, levels: levels.ar },
  es: { ...es, levels: levels.es },
  de: { ...de, levels: levels.de },
}; 