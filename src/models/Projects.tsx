import ProjectsSchema from "@/models/schemas/ProjectsSchema";
import Languages from "@/models/Languages";

import { LanguageInterface } from "@/models/Languages";

class FullProjectInfo {
    name: string;
    _id: string;
    language_id: string;
    language: LanguageInterface;

    constructor(data: any) {
      this.name = data.name;
      this._id = data._id;
      this.language_id = data.language_id;
      this.language = data.hasOwnProperty('language') ? data.language : {};
    }
}

const getList = async function () {
  let list = await ProjectsSchema.find();
  let langs = await Languages.getList();
  let response: Array<FullProjectInfo> = [];
  list.forEach(project => {
    let proj = new FullProjectInfo(project);
    let lang = langs.find(language => {
      return language._id.toString() === proj.language_id;
    });
    if (lang) {
      proj.language = lang;
    }
    response.push(proj);
  });
  return response;
}

const getById = async function(_id: string) {
  return await ProjectsSchema.findById(_id);
}

const getFullProjectInfo = async function (_id: string) {
  const proj = await getById(_id);
  const fullProj = new FullProjectInfo(proj);
  const lang = await Languages.get(proj.language_id);
  fullProj.language = lang;
  return fullProj;
}

export default {
  getList,
  getById,
  getFullProjectInfo
}