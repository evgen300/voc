'use client'

import { createContext, useContext, useState } from "react";

export interface PhraseInterface {
  phrase: string,
  translation: string,
  notes: string,
  audio?: string,
  categories: Array<string>,
  project_id?: string,
  _id?: string
}

interface PhraseContextInterface {
  getList: Function,
  createPhrase: Function,
  getPhrase: Function,
  editPhrase: Function,
  setPhraseAudio: Function,
  deletePhrase: Function
};

export interface PhrasesFilterInterface {
  search?: string,
  phrase?: string,
  translation?: string,
  notes?: string
};

const PhraseContext = createContext<PhraseContextInterface>({
  getList: () => {},
  createPhrase: () => {},
  getPhrase: () => {},
  editPhrase: () => {},
  setPhraseAudio: () => {},
  deletePhrase: () => {}
});

export function PhraseContextProvider({ children }: any) {
  const getList = async function (project_id: string, searchString: string = "", phrase: string = "", translation: string = "", notes: string = "", page: number = 1, onpage: number = 100) {
    let list = await fetch(`/api/phrases?project_id=${project_id}&search=${searchString}&phrase=${phrase}&translation=${translation}&notes=${notes}&page=${page}&onpage=${onpage}`);
    return await list.json();
  }

  const createPhrase = async function (data: PhraseInterface) {
    const response = await fetch(`/api/phrases`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type' : 'application/json'
      }
    });
    return await response.json();
  }

  const getPhrase = async function (id: string) {
    const response = await fetch(`/api/phrases/${id}`);
    return await response.json();
  }

  const editPhrase = async function (id: string, data: PhraseInterface) {
    const response = await fetch(`/api/phrases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type' : 'application/json'
      }
    });
    return await response.json();
  }

  const deletePhrase = async function (id: string) {
    const response = await fetch(`/api/phrases/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type' : 'application/json'
      }
    });
    return await response.json();
  }

  const setPhraseAudio = async function (id: string) {
    const response = await fetch(`/api/phrases/${id}/audio`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type' : 'application/json'
      }
    });
    return await response.json();
  }

  return (
    <PhraseContext.Provider value={{
      getList,
      createPhrase,
      getPhrase,
      editPhrase,
      setPhraseAudio,
      deletePhrase
    }}>
      { children }
    </PhraseContext.Provider>
  )
}

export function usePhraseContext() {
  const context = useContext(PhraseContext);
  return context;
}