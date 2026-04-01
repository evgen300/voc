import LanguagesSchema from "@/models/schemas/LanguagesSchema";

export interface LanguageInterface {
  name: string,
  code: string
};

const getList = async function() {
  const langs = await LanguagesSchema.find();

  return langs;
}

const get = async function (_id: string) {
  const lang = await LanguagesSchema.findById(_id);
  return lang;
}

export default {
  getList,
  get
}