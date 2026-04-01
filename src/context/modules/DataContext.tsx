'use client'

import { createContext, useContext, useState } from "react";

export interface DataInterface {
  name: string,
  _id: string
}

export interface LanguageInterface {
  name: string,
  code: string
}

interface DataContextInterface {
  categories: Array<DataInterface>,
  types: Array<DataInterface>,
  getCategories: Function,
  getTypes: Function
};

const DataContext = createContext<DataContextInterface>({
  categories: [],
  types: [],
  getCategories: () => {},
  getTypes: () => {}
});

export function DataContextProvider({ children }: any) {

  const [ categories, setCategories ] = useState<Array<DataInterface>>([]);
  const [ types, setTypes ] = useState<Array<DataInterface>>([]);
  
  const getCategories = async function() {
    const response = await fetch(`/api/categories`);
    const data = await response.json();
    setCategories(data);
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
      getCategories: getCategories,
      getTypes: getTypes
    }}>
      { children }
    </DataContext.Provider>
  )
}

export function useDataContext() {
  const context = useContext(DataContext);
  return context;
}