'use client'

import { createContext, useContext, useState } from "react";

export interface WordFormInterface {
  word: string,
  transcription: string,
  translation: string,
  notes: string,
  audio?: string
}

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
  _id?: string
}

interface WordContextInterface {
  getList: Function,
  createWord: Function,
  getWord: Function,
  editWord: Function,
  setWordAudio: Function,
  deleteWord: Function
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

const WordContext = createContext<WordContextInterface>({
  getList: () => {},
  createWord: () => {},
  getWord: () => {},
  editWord: () => {},
  setWordAudio: () => {},
  deleteWord: () => {}
});

export function WordContextProvider({ children }: any) {
  const getList = async function (project_id: string, searchString: string = "", word: string = "", tarnscription: string = "", translation: string = "", notes: string = "", type_id: string = "", categories: Array<string> = []) {
    let list = await fetch(`/api/words?project_id=${project_id}&search=${searchString}&word=${word}&transcription=${tarnscription}&translation=${translation}&notes=${notes}&type_id=${type_id}&categories=${categories}`);
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
      deleteWord
    }}>
      { children }
    </WordContext.Provider>
  )
}

export function useWordContext() {
  const context = useContext(WordContext);
  return context;
}