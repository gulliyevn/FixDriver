const commonRu = require("./ru.json");
const commonEn = require("./en.json");
const commonTr = require("./tr.json");
const commonAz = require("./az.json");
const commonFr = require("./fr.json");
const commonAr = require("./ar.json");
const commonEs = require("./es.json");
const commonDe = require("./de.json");
const levels = require("./levels.json");

module.exports = {
  ru: { ...commonRu, levels: levels.ru },
  en: { ...commonEn, levels: levels.en },
  tr: { ...commonTr, levels: levels.tr },
  az: { ...commonAz, levels: levels.az },
  fr: { ...commonFr, levels: levels.fr },
  ar: { ...commonAr, levels: levels.ar },
  es: { ...commonEs, levels: levels.es },
  de: { ...commonDe, levels: levels.de },
};
