'use client'

import { createContext, useContext, useState } from "react";

export interface TranslateTaskInterface {
  word: string,
  translation: string,
  correct?: boolean,
  correct_answer?: string,
  answer_correction?: string,
  type_id: string
}

export interface TranslatePracticeInterface {
  tasks: Array<TranslateTaskInterface>
}

interface PracticeContextInterface {
  getTranslateFromTest: Function,
  checkTranslateFromTest: Function,
  getTranslateToTest: Function,
  checkTranslateToTest: Function
}

const PracticeContext = createContext<PracticeContextInterface>({
  getTranslateFromTest: () => {},
  checkTranslateFromTest: () => {},
  getTranslateToTest: () => {},
  checkTranslateToTest: () => {}
});

export function PracticeContextProvider({ children }: any) {

  const getTranslateFromTest = async function (projct_id: string) {
    const response = await fetch(`/api/practice/translate_from?project_id=${projct_id}`);
    return await response.json();
  }

  const getTranslateToTest = async function (projct_id: string) {
    const response = await fetch(`/api/practice/translate_to?project_id=${projct_id}`);
    return await response.json();
  }

  const checkTranslateFromTest = async function (test: TranslatePracticeInterface, project_id: string) {
    const response = await fetch(`/api/practice/translate_from`, {
      method: 'POST',
      body: JSON.stringify({
        project_id: project_id,
        test: test
      })
    });
    return await response.json();
  }

  const checkTranslateToTest = async function (test: TranslatePracticeInterface, project_id: string) {
    const response = await fetch(`/api/practice/translate_to`, {
      method: 'POST',
      body: JSON.stringify({
        project_id: project_id,
        test: test
      })
    });
    return await response.json();
  }

  return (
    <PracticeContext.Provider value={{
      getTranslateFromTest,
      checkTranslateFromTest,
      getTranslateToTest,
      checkTranslateToTest
    }}>
      { children }
    </PracticeContext.Provider>
  )
}

export function usePracticeContext() {
  const context = useContext(PracticeContext);
  return context;
}