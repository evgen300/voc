'use client'

import { createContext, useContext, useState } from "react";

export interface WordFormInterface {
  word: string,
  transcription: string,
  translation: string,
  notes: string,
  audio?: string
};

export interface VerbFormInterface {
  type: String,
  word: String,
  transcription: String,
  translation: String,
  notes: String
};

export interface VerbTimeInterface {
  time: String,
  forms: Array<VerbFormInterface>
};

export interface WordInterface {
  word: string,
  transcription: string,
  translation: string,
  forms: Array<WordFormInterface>,
  notes: string,
  audio?: string,
  categories: Array<string>,
  type_id: string,
  project_id?: string,
  _id?: string,
  verb_times: Array<VerbTimeInterface>
};

export interface WordsFilterInterface {
  search?: string,
  word?: string,
  transcription?: string,
  translation?: string,
  notes?: string,
  categories?: Array<string>,
  type_id?: string
};

interface WordContextInterface {
  getList: Function,
  createWord: Function,
  getWord: Function,
  editWord: Function,
  setWordAudio: Function,
  deleteWord: Function,
  wordsFilters: WordsFilterInterface,
  setWordsFilters: Function
};

export interface PaginationInterface {
  page: number,
  pages: number,
  total: number,
  onpage: number
};

const WordContext = createContext<WordContextInterface>({
  getList: () => {},
  createWord: () => {},
  getWord: () => {},
  editWord: () => {},
  setWordAudio: () => {},
  deleteWord: () => {},
  wordsFilters: {},
  setWordsFilters: () => {}
});

interface VerbFormListInterface {
  key: String,
  label: String
};

export const VerbForms: Array<VerbFormListInterface> = [
  { key: 'first', label: 'I' }, 
  { key: 'second', label: 'You' }, 
  { key: 'third', label: '3rd' },
  { key: 'fourth', label: 'We' }, 
  { key: 'fifth', label: 'You - plural' }, 
  { key: 'sixth', label: 'They' }
];

export const VerbTimes: Array<VerbFormListInterface> = [
  { key: 'present', label: 'Present' },
  { key: 'past', label: 'Past' }
];

export function WordContextProvider({ children }: any) {

  const [ wordsFilters, setWordsFilters ] = useState<WordsFilterInterface>({});

  const getList = async function (project_id: string, searchString: string = "", word: string = "", tarnscription: string = "", translation: string = "", notes: string = "", type_id: string = "", categories: Array<string> = [], page: number = 1, onpage: number = 100) {
    let list = await fetch(`/api/words?project_id=${project_id}&search=${searchString}&word=${word}&transcription=${tarnscription}&translation=${translation}&notes=${notes}&type_id=${type_id}&categories=${categories}&page=${page}&onpage=${onpage}`);
    return await list.json();
  }

  const createWord = async function (data: WordInterface) {
    const response = await fetch(`/api/words`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type' : 'application/json'
      }
    });
    return await response.json();
  }

  const getWord = async function (id: string) {
    const response = await fetch(`/api/words/${id}`);
    return await response.json();
  }

  const editWord = async function (id: string, data: WordInterface) {
    const response = await fetch(`/api/words/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type' : 'application/json'
      }
    });
    return await response.json();
  }

  const deleteWord = async function (id: string) {
    const response = await fetch(`/api/words/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({}),
      headers: {
        'Content-Type' : 'application/json'
      }
    });
    return await response.json();
  }

  const setWordAudio = async function (id: string, form_idx: number | null = null) {
    let request: any = {};
    if (form_idx !== null) {
      request.form_idx = form_idx
    }
    const response = await fetch(`/api/words/${id}/audio`, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-Type' : 'application/json'
      }
    });
    return await response.json();
  }

  return (
    <WordContext.Provider value={{
      getList,
      createWord,
      getWord,
      editWord,
      setWordAudio,
      deleteWord,
      wordsFilters,
      setWordsFilters
    }}>
      { children }
    </WordContext.Provider>
  )
}

export function useWordContext() {
  const context = useContext(WordContext);
  return context;
}