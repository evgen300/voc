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
          remove_word_confirm: "Are you sure you want to remove this word?",
          register_link: "Do not have an account? Register",
          login_link: "Already have an account? Login",
          category: "Category",
          add_form: "add form",
          add_form_below: "Add form below",
          delete_form: "Delete form",
          verb_times: "Verb times",
          add_time: "add time",
          time: "Time",
          saved: "Saved",
          saving: "Saving",
          save: "Save",
          logout: "Logout",
          manual_link: "User Manual",
          manual_title: "User Manual",
          manual_intro: "This guide explains how to add and manage words in your vocabulary, including alternate word forms and verb conjugations.",
          manual_section_word_title: "Adding a word",
          manual_section_word_body: "Enter the word, its transcription and translation in the top fields, and optionally add notes. Choose a Type (e.g. Verb) and one or more Categories to help organize your vocabulary.",
          manual_section_forms_title: "Word forms",
          manual_section_forms_body: "Use \"add form\" to add another form of the word (for example, a plural or a related word), and \"Add form below\" to insert a new form right after an existing one (not shown on the last row). Each form can be removed with \"Delete form\", and reordered with the up/down arrows next to it.",
          manual_section_forms_note: "Note: moving the first form all the way up swaps it with the main word — the form becomes the main word, and the main word becomes the first form.",
          manual_section_verbs_title: "Verb conjugation",
          manual_section_verbs_body: "When Type is set to Verb, a \"Verb times\" section appears. Click \"add time\" to add a tense (Present, Present imperative, Present continuous, Past, Future, Conditional or Passive) — each tense can only be added once. Within a tense, add a form for each grammatical person (I, You, 3rd, We, You (pl), They) with its own word, transcription and translation, and remove or reorder them the same way as regular word forms.",
          manual_section_save_title: "Saving",
          manual_section_save_body: "Click Save to store your changes. The button shows \"Saving\" while the request is in progress and briefly confirms \"Saved\" once it completes."
        },
      },
      ua: {
        translation: {
          manual_link: "Посібник користувача",
          manual_title: "Посібник користувача",
          manual_intro: "Цей посібник пояснює, як додавати та керувати словами у вашому словнику, включно з альтернативними формами слова та дієвідмінами дієслів.",
          manual_section_word_title: "Додавання слова",
          manual_section_word_body: "Введіть слово, його транскрипцію та переклад у верхніх полях, за бажанням додайте нотатки. Оберіть Тип (наприклад, Дієслово) та одну чи кілька Категорій, щоб упорядкувати свій словник.",
          manual_section_forms_title: "Форми слова",
          manual_section_forms_body: "Натисніть «add form», щоб додати ще одну форму слова (наприклад, множину або споріднене слово), і «Add form below», щоб вставити нову форму одразу після наявної (не показується в останньому рядку). Кожну форму можна видалити кнопкою «Delete form» і переставити стрілками вгору/вниз поруч із нею.",
          manual_section_forms_note: "Зверніть увагу: переміщення першої форми вгору до кінця міняє її місцями з основним словом — форма стає основним словом, а колишнє основне слово стає першою формою.",
          manual_section_verbs_title: "Дієвідмінювання",
          manual_section_verbs_body: "Коли Тип встановлено як Дієслово, з'являється розділ «Verb times». Натисніть «add time», щоб додати час (Present, Present imperative, Present continuous, Past, Future, Conditional або Passive) — кожен час можна додати лише один раз. У межах часу додайте форму для кожної особи (I, You, 3rd, We, You (pl), They) з власним словом, транскрипцією та перекладом; видаляти чи переставляти їх можна так само, як і звичайні форми слова.",
          manual_section_save_title: "Збереження",
          manual_section_save_body: "Натисніть Save, щоб зберегти зміни. Під час збереження кнопка показує «Saving», а після завершення на короткий час з'являється підтвердження «Saved»."
        },
      },
    },
  });

export default i18n;