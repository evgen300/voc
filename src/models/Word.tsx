import fse from "fs-extra";
import { Md5 } from "ts-md5";

import WordSchema from "@/models/schemas/WordSchema";
import Projects from "@/models/Projects";
import TextToSpeech from "@/api/textToSpeech";

const AUDIO_PATH = process.cwd() + '/public/audio/';
const AUDIO_URL = 'http://localhost:5181/audio/';

const textToSpeech = new TextToSpeech();

export interface WordFormInterface {
  word: string,
  transcription: string,
  translation: string,
  notes: string,
  audio?: string
};

export interface WordInterface {
  word: string,
  transcription: string,
  translation: string,
  forms: Array<WordFormInterface>,
  notes: string,
  audio?: string,
  categories: Array<string>,
  type: string,
  project_id: string
};

interface GetListInterface {
  project_id?: string,
  search?: string,
  word?: string,
  transcription?: string,
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
          {word: searchRegex},
          {transcription: searchRegex},
          {translation: searchRegex},
          {notes: searchRegex},
          {'forms.word': searchRegex},
          {'forms.transcription': searchRegex},
          {'forms.translation': searchRegex},
          {'forms.notes': searchRegex},
        ];
        break;
      case 'project_id':
        params.project_id = fieldValue;
        break;
      case 'word':
        let wordRegex = new RegExp(fieldValue, 'i');
        params['$or'] = [
          {word: wordRegex},
          {'forms.word': wordRegex},
        ];
        break;
      case 'transcription':
        let transcriptionRegex = new RegExp(fieldValue, 'i');
        params['$or'] = [
          {transcription: transcriptionRegex},
          {'forms.transcription': transcriptionRegex},
        ];
        break;
      case 'translation':
        let translationRegex = new RegExp(fieldValue, 'i');
        params['$or'] = [
          {translation: translationRegex},
          {'forms.translation': translationRegex},
        ];
        break;
      case 'notes':
        let notesRegex = new RegExp(fieldValue, 'i');
        params['$or'] = [
          {notes: notesRegex},
          {'forms.notes': notesRegex},
        ];
        break;
    }
  });
  const words = await WordSchema.find(params).sort("word");

  words.forEach(word => {
    if (word.audio) {
      word.audio = AUDIO_URL + word.audio;
    }
    word.forms.forEach((form, idx) => {
      if (form.audio) {
        word.forms[idx].audio = AUDIO_URL + form.audio;
      }
    });
  });

  return words;
}

const create = async function (data: WordInterface) {
  let inserted = await WordSchema.create(data);
  return inserted;
}

const edit = async function (_id: string, data: WordInterface) {
  if (data.audio) {
    data.audio = data.audio.replace(AUDIO_URL, '');
  }

  if (Array.isArray(data.forms)) {
    data.forms.forEach((form, idx) => {
      if (form.audio) {
        data.forms[idx].audio = form.audio.replace(AUDIO_URL, '');
      }
    });
  }
  const word = await WordSchema.findByIdAndUpdate(_id, data, { returnDocument: 'after' });
  if (word.audio) {
    word.audio = AUDIO_URL + word.audio;
  }

  word.forms.forEach((form, idx) => {
    if (form.audio) {
      word.forms[idx].audio = AUDIO_URL + form.audio;
    }
  });

  return word;
}

const get = async function (_id: string) {
  const word = await WordSchema.findById(_id);
  if (word.audio) {
    word.audio = AUDIO_URL + word.audio;
  }
  word.forms.forEach((form, idx) => {
    if (form.audio) {
      word.forms[idx].audio = AUDIO_URL + form.audio;
    }
  });
  return word;
}

const getWordAudio = async function (word: string, langCode: string, targetFile: string) {
  const audioData = await textToSpeech.generateAudioAPI(word, langCode);

  fse.outputFileSync(targetFile, Buffer.from(audioData));
}

const setAudio = async function (word_id: string, part_idx: number | null = null) {
  const word = await get(word_id);
  const project = await Projects.getFullProjectInfo(word.project_id);
  if (part_idx === null) {
    const audioName = Md5.hashStr(word.word + Date.now()) + '.mp3';
    await getWordAudio(word.word, project.language.code, AUDIO_PATH + audioName);
    word.audio = audioName;
  } else {
    const audioName = Md5.hashStr(word.forms[part_idx].word + Date.now()) + '.mp3';
    await getWordAudio(word.forms[part_idx].word, project.language.code, AUDIO_PATH + audioName);
    word.forms[part_idx].audio = audioName;
  }
  return edit(word_id, word);
}

export default {
  getList,
  create,
  edit,
  get,
  setAudio
}