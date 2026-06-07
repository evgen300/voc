import fse from "fs-extra";
import { Md5 } from "ts-md5";
import { diffChars } from "diff";

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

export interface VerbTimeInterface {
  time: String,
  forms: Array<VerbFormInterface>
};

export interface VerbFormInterface {
  type: String,
  word: String,
  transcription: String,
  traslation: String,
  notes: String
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
  project_id: string,
  verb_times: Array<VerbTimeInterface>
};

interface GetListInterface {
  project_id: string,
  search?: string,
  word?: string,
  transcription?: string,
  translation?: string,
  notes?: string,
  type_id?: string,
  categories?: Array<string>
};

const VerbsFormOrder = [
  { key: 'first', order: 0 }, 
  { key: 'second', order: 1 }, 
  { key: 'third', order: 2 },
  { key: 'fourth', order: 3 }, 
  { key: 'fifth', order: 4 }, 
  { key: 'sixth', order: 5 }
];

const VerbTimesOrder = [
  { key: 'present', order: 0 },
  { key: 'present_imp', order: 1 },
  { key: 'continuous', order: 2 },
  { key: 'past', order: 3 },
  { key: 'future', order: 4 },
  { key: 'conditional', order: 5 },
  { key: 'passive', order: 6 }
];

const getList = async function(request: GetListInterface, page: number = 1, onpage: number = 30) {
  //await WordSchema.updateMany({type_id: "69dc93518fabedb3cefb8e6d", project_id: "69c6d5b82820de2358f30d89"}, {type_id: "adverb"});
  let params: any = {};
  let orParams = [];
  const project = await Projects.getFullProjectInfo(request.project_id);
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
        let wordRegex = new RegExp(fieldValue.toString(), 'i');
        params['$or'] = [
          {word: wordRegex},
          {'forms.word': wordRegex},
          {'verb_times.word': wordRegex},
        ];
        break;
      case 'transcription':
        let transcriptionRegex = new RegExp(fieldValue.toString(), 'i');
        params['$or'] = [
          {transcription: transcriptionRegex},
          {'forms.transcription': transcriptionRegex},
        ];
        break;
      case 'translation':
        let translationRegex = new RegExp(fieldValue.toString(), 'i');
        params['$or'] = [
          {translation: translationRegex},
          {'forms.translation': translationRegex},
          {'verb_times.translation': translationRegex},
        ];
        break;
      case 'notes':
        let notesRegex = new RegExp(fieldValue.toString(), 'i');
        params['$or'] = [
          {notes: notesRegex},
          {'forms.notes': notesRegex},
        ];
        break;
      case 'type_id':
        params.type_id = fieldValue.toString();
        break;
      case 'categories':
        console.log(fieldValue);
        if (fieldValue.includes('empty')) {
          if (fieldValue.length === 1) {
            params.categories = [];
          } else {
            params['$or'] = [ 
              {
                categories: {
                  '$in': []
                }
              },
              {
                categories: {
                  '$in': fieldValue
                }
              }
            ];
          }
        } else {
          params.categories = { '$in': fieldValue };
        }
        break;
    }
  });
  let pagedData = await WordSchema.aggregate([
    { $match: params },
    {
      $facet: {
        metadata: [{ $count: 'totalCount' }],
        data: [{ $sort: { "word": 1 } }, { $skip: ( page - 1 ) * onpage }, { $limit: onpage }],
      },
    }
  ],
  {
    collation: { locale: project.language.code, strength: 2 } // Ignores case differences
  });
  //let words = await WordSchema.find(params).sort("word").limit(100);
  if (!pagedData[0] || !Array.isArray(pagedData[0].data) || pagedData[0].data.length === 0) {
    return {words: [], pagination: {total: 0, page: 1, onpage: onpage}};
  }
  let words = pagedData[0].data;
  let pagination = {total: pagedData[0].metadata[0].totalCount, page: page, onpage: onpage};

  if (request.search && request.search.length > 0) {
    let searchSearch = request.search.toLowerCase();
    words.forEach((word: any) => {
      word.forms = word.forms.filter((form: WordFormInterface) => {
        return form.word.toLowerCase().indexOf(searchSearch || "") !== -1 || 
          form.transcription.toLowerCase().indexOf(searchSearch || "") !== -1 || 
          form.translation.toLowerCase().indexOf(searchSearch || "") !== -1 ||
          form.notes.toLowerCase().indexOf(searchSearch || "") !== -1;
      });
    });
  } else {
    if (request.word || request.transcription || request.translation || request.notes) {
      let wordSearch = request.word;
      let transcriptionSearch = request.transcription;
      let translationSearch = request.translation;
      let notesSearch = request.notes;
      words.forEach((word: any) => {
      word.forms = word.forms.filter((form: WordFormInterface) => {
        return (!request.word || form.word.toLowerCase().indexOf(wordSearch || "") !== -1) && 
          (!request.transcription || form.transcription.toLowerCase().indexOf(transcriptionSearch || "") !== -1) &&
          (!request.translation || form.translation.toLowerCase().indexOf(translationSearch || "") !== -1) &&
          (!request.notes || form.notes.toLowerCase().indexOf(notesSearch || "") !== -1);
      });
    });
    }
  }

  words.forEach((word: any) => {
    if (word.audio) {
      word.audio = AUDIO_URL + word.audio;
    }
    word.forms.forEach((form: WordFormInterface, idx: number) => {
      if (form.audio) {
        word.forms[idx].audio = AUDIO_URL + form.audio;
      }
    });
  });

  return {words: words, pagination: pagination};
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
  if (Array.isArray(data.verb_times)) {
    data.verb_times.sort((a, b) => {
      const timeA = VerbTimesOrder.find(time => {
        return time.key === a.time;
      });
      const timeB = VerbTimesOrder.find(time => {
        return time.key === b.time;
      });
      if (!timeA) {
        return 1;
      }
      if (!timeB) {
        return -1;
      }
      return timeA?.order < timeB?.order ? -1 : 1;
    });
    data.verb_times.forEach((v_time, idx) => {
      data.verb_times[idx].forms = v_time.forms.sort((a, b) => {
        let orderA = VerbsFormOrder.find(order => {
          return order.key === a.type;
        });
        let orderB = VerbsFormOrder.find(order => {
          return order.key === b.type;
        });
        return orderA && orderB && orderA.hasOwnProperty('order') && orderB.hasOwnProperty('order') ? (orderA.order < orderB.order ? -1 : 1) : -1;
      });
    });
  }
  const word = await WordSchema.findByIdAndUpdate(_id, data, { returnDocument: 'after' });
  if (word.audio) {
    word.audio = AUDIO_URL + word.audio;
  }

  word.forms.forEach((form: WordFormInterface, idx: number) => {
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
  word.forms.forEach((form: WordFormInterface, idx: number) => {
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

const remove = async function (_id: string) {
  //await WordSchema.updateMany({ project_id: "69d79b1e04d8c1e78a609181" }, { type_id: "69c6c3902820de2358f30d7f", categories: ["69d896daa942367dcd66c97f"] });
  return await WordSchema.deleteOne({ _id: _id });
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

interface GetRandInterface {
  limit: number | null,
  project_id: string
};

const getRandForTest = async function (request: GetRandInterface = { limit: 20, project_id: '' }) {
  const limit = request.limit || 20;
  const list = await WordSchema.aggregate([
    { $match: { project_id: request.project_id } },
    /*{ $addFields: { randomField: { $rand: {} } } },
    { $limit: request.limit || 20 },
    { $sort: { randomField: 1 } }*/
    { $sample: { size: limit } }
  ]);
  /*let test: SignTestInterface = {
    tasks: [],
    score: 0,
    max_score: count
  };
  list.forEach((sign) => {
    let titles: Array<string> = [];
    titles.push(sign.title);
    let signs = list.filter((s) => {
      return s.code !== sign.code;
    });
    titles = lodash.shuffle(lodash.sampleSize(signs, variants - 1).reduce((acc, variant) => {
      acc.push(variant.title);
      return acc;
    }, titles));
    console.log(sign, titles);
    test.tasks.push({
      sign: {
        image: sign.image,
        hash: Md5.hashStr(sign._id + sign.code)
      },
      variants: titles
    });
  });
  return test;*/
  return list;
}
interface TranslateTaskInterface {
  word: string,
  translation: string,
  correct_answer?: string,
  correct?: boolean,
  answer_correction?: string,
  type_id: string
}
interface TranslateFromTestInterface {
  tasks: Array<TranslateTaskInterface>
}

const getTranslateFromTest = async function (request: GetRandInterface) {
  const list = await getRandForTest(request);
  let response: TranslateFromTestInterface = {
    tasks: []
  };
  list.forEach(word => {
    response.tasks.push({
      word: word.word,
      translation: '',
      type_id: word.type_id
    });
  });

  return response;
}

const getTranslateToTest = async function (request: GetRandInterface) {
  const list = await getRandForTest(request);
  let response: TranslateFromTestInterface = {
    tasks: []
  };
  list.forEach(word => {
    response.tasks.push({
      word: word.translation,
      translation: '',
      type_id: word.type_id
    });
  });

  return response;
}

const validateFromTest = async function(test: TranslateFromTestInterface, project_id: string) {
  let params: any = {
    '$or': []
  };
  test.tasks.forEach((task, idx) => {
    params['$or'].push(
      {word: task.word}
    );
  });
  const words = await WordSchema.find(params);
  test.tasks.forEach(task => {
    const word = words.find(w => {
      return w.word === task.word;
    });
    if (word) {
      task.correct_answer = word.translation;
      task.correct = task.translation === word.translation;
      if (!task.correct) {
        const answerDiff = diffChars(task.translation, task.correct_answer || '');
        let answerCorrection = '';
        answerDiff.forEach(item => {
          if (!item.added && !item.removed) {
            answerCorrection+= item.value;
          } else if (item.added) {
            answerCorrection+= `+${item.value}+`;
          } else if (item.removed) {
            answerCorrection+= `-${item.value}-`;
          }
        });
        task.answer_correction = answerCorrection;
      }
    }
  });
  return test;
}

const validateToTest = async function(test: TranslateFromTestInterface, project_id: string) {
  let params: any = {
    '$or': []
  };
  test.tasks.forEach((task, idx) => {
    params['$or'].push(
      {translation: task.word}
    );
  });
  const words = await WordSchema.find(params);
  test.tasks.forEach(task => {
    const word = words.find(w => {
      return w.translation === task.word;
    });
    if (word) {
      task.correct_answer = word.word;
      task.correct = task.translation === word.word;
      if (!task.correct) {
        const answerDiff = diffChars(task.translation, task.correct_answer || '');
        let answerCorrection = '';
        answerDiff.forEach(item => {
          if (!item.added && !item.removed) {
            answerCorrection+= item.value;
          } else if (item.added) {
            answerCorrection+= `+${item.value}+`;
          } else if (item.removed) {
            answerCorrection+= `-${item.value}-`;
          }
        });
        task.answer_correction = answerCorrection;
      }
    }
  });
  return test;
}

export default {
  getList,
  create,
  edit,
  get,
  setAudio,
  remove,
  getTranslateFromTest,
  validateFromTest,
  getTranslateToTest,
  validateToTest
}