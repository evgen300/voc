"use client"

import { createContext, useContext, useState, useEffect } from "react";
//import { SessionProvider } from "next-auth/react";
import { WordContextProvider } from "@/context/modules/WordsContext";
import { DataContextProvider } from "@/context/modules/DataContext";
import { ProjectContextProvider } from "@/context/modules/ProjectsContext";

const MainContext = createContext({});

export function MainContextProvider ({ children }: any ) {

  return (
    <MainContext.Provider value={{
    }}>
      <ProjectContextProvider>
        <WordContextProvider>
          <DataContextProvider>
            {children}
          </DataContextProvider>
        </WordContextProvider>
      </ProjectContextProvider>
    </MainContext.Provider>
  )
}

export function useMainContext() {
  const context = useContext(MainContext);
  if (context === undefined) {
    return new Error("MainContext not defined");
  }
  return context;
};