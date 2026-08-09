import i18n from "i18next";                      

import { initReactI18next } from "react-i18next";

export const supportedLngs = {
   ua: "Українська",
   en: "English",
};

i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    supportedLngs: Object.keys(supportedLngs),
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          email: "Email",
          password: "Password"
        },
      },
      ua: {
        translation: {
          
        },
      },
    },
  });

export default i18n;