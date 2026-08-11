'use client'

import { createContext, useContext, useState } from "react";

export interface DataInterface {
  name: string,
  _id: string,
  key?: string
}

export interface LanguageInterface {
  name: string,
  code: string
}

interface DataContextInterface {
  categories: Array<DataInterface>,
  types: Array<DataInterface>,
  languages: Array<LanguageInterface>,
  getCategories: Function,
  getTypes: Function,
  getLanguages: Function
};

const DataContext = createContext<DataContextInterface>({
  categories: [],
  types: [],
  languages: [],
  getCategories: () => {},
  getTypes: () => {},
  getLanguages: () => {}
});

export function DataContextProvider({ children }: any) {

  const [ categories, setCategories ] = useState<Array<DataInterface>>([]);
  const [ types, setTypes ] = useState<Array<DataInterface>>([]);
  const [ languages, setLanguages ] = useState<Array<LanguageInterface>>([]);
  
  const getCategories = async function() {
    const response = await fetch(`/api/categories`);
    const data = await response.json();
    setCategories(data);
    return data;
  }

  const getLanguages = async function() {
    const response = await fetch(`/api/languages`);
    const data = await response.json();
    setLanguages(data);
    return data;
  }

  const getTypes = async function() {
    const response = await fetch(`/api/types`);
    const data = await response.json();
    setTypes(data);
    return data;
  }

  return (
    <DataContext.Provider value={{
      categories: categories,
      types: types,
      languages: languages,
      getCategories: getCategories,
      getTypes: getTypes,
      getLanguages: getLanguages
    }}>
      { children }
    </DataContext.Provider>
  )
}

export function useDataContext() {
  const context = useContext(DataContext);
  return context;
}