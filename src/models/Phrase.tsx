import fse from "fs-extra";
import { Md5 } from "ts-md5";

import PhrasesSchema from "@/models/schemas/PhrasesSchema";
import Projects from "@/models/Projects";
import TextToSpeech from "@/api/textToSpeech";

const AUDIO_PATH = process.cwd() + '/public/audio/';
const AUDIO_URL = 'http://localhost:5181/audio/';

const textToSpeech = new TextToSpeech();

export interface PhraseInterface {
  phrase: string,
  translation: string,
  notes: string,
  audio?: string,
  categories: Array<string>,
  project_id: string
};

interface GetListInterface {
  project_id?: string,
  search?: string,
  phrase?: string,
  translation?: string,
  notes?: string
};

const getList = async function(request: GetListInterface) {
  let params: any = {};
  Object.keys(request).forEach(field => {
    let fieldValue = request[field as keyof GetListInterface];
    if (fieldValue && fieldValue.length)
    switch (field) {
      case 'search':
        let searchRegex = new RegExp(request.search || "", 'i');
        params['$or'] = [
          {phrase: searchRegex},
          {translation: searchRegex},
          {notes: searchRegex}
        ];
        break;
      case 'project_id':
        params.project_id = fieldValue;
        break;
      case 'phrase':
        let wordRegex = new RegExp(fieldValue, 'i');
        params['phrase'] = wordRegex;
        break;
      case 'translation':
        let translationRegex = new RegExp(fieldValue, 'i');
        params['translation'] = translationRegex;
        break;
      case 'notes':
        let notesRegex = new RegExp(fieldValue, 'i');
        params['notes'] = notesRegex;
        break;
    }
  });
  let phrases = await PhrasesSchema.find(params).sort("phrase");

  phrases.forEach(phrase => {
    if (phrase.audio) {
      phrase.audio = AUDIO_URL + phrase.audio;
    }
  });

  return phrases;
}

const create = async function (data: PhraseInterface) {
  let inserted = await PhrasesSchema.create(data);
  return inserted;
}

const edit = async function (_id: string, data: PhraseInterface) {
  if (data.audio) {
    data.audio = data.audio.replace(AUDIO_URL, '');
  }
  
  const phrase = await PhrasesSchema.findByIdAndUpdate(_id, data, { returnDocument: 'after' });
  if (phrase.audio) {
    phrase.audio = AUDIO_URL + phrase.audio;
  }

  return phrase;
}

const get = async function (_id: string) {
  const phrase = await PhrasesSchema.findById(_id);
  if (phrase.audio) {
    phrase.audio = AUDIO_URL + phrase.audio;
  }
  
  return phrase;
}

const getPhraseAudio = async function (text: string, langCode: string, targetFile: string) {
  const audioData = await textToSpeech.generateAudioAPI(text, langCode);

  fse.outputFileSync(targetFile, Buffer.from(audioData));
}

const setAudio = async function (_id: string) {
  const phrase = await get(_id);
  const project = await Projects.getFullProjectInfo(phrase.project_id);
  const audioName = Md5.hashStr(phrase.phrase + Date.now()) + '.mp3';
  await getPhraseAudio(phrase.phrase, project.language.code, AUDIO_PATH + audioName);
  phrase.audio = audioName;
  return edit(_id, phrase);
}

const remove = async function (_id: string) {
  return await PhrasesSchema.deleteOne({ _id: _id });
}

export default {
  getList,
  create,
  edit,
  get,
  setAudio,
  remove
}