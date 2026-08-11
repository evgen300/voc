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
          password: "Password",
          projects: "Projects",
          words: "Words",
          phrases: "Phrases",
          practice: "Practice",
          words_list: "Words list",
          add: "Add",
          filter: "Filter",
          word: "Word",
          transcription: "Transcription",
          translation: "Translation",
          notes: "Notes",
          type: "Type",
          categories: "Categories",
          apply: "Apply",
          reset: "Reset",
          remove_word_confirm: "Are you sure you want to remove this word?"
        },
      },
      ua: {
        translation: {
          
        },
      },
    },
  });

export default i18n;