'use client'

import { createContext, useContext, useState } from "react";
import { useCookies } from "next-client-cookies";

import { LanguageInterface } from "@/context/modules/DataContext";

export interface ProjectInterface {
  name?: string,
  _id?: string,
  language_id?: string,
  language?: LanguageInterface
}

interface ProjectContextInterface {
  projects: Array<ProjectInterface>,
  getList: Function,
  currentProject: ProjectInterface,
  loadProject: Function,
  createProject: Function,
  setProjectLocal: Function
};

const ProjectContext = createContext<ProjectContextInterface>({
  projects: [],
  getList: () => {},
  currentProject: { },
  loadProject: () => {},
  createProject: () => {},
  setProjectLocal: () => {}
});

export function ProjectContextProvider({ children }: any) {

  const cookies = useCookies();

  let defaultProject: ProjectInterface = {};

  const [ projects, setProjects ] = useState<Array<ProjectInterface>>([]);
  const [ currentProject, setCurrentProject ] = useState<ProjectInterface>(defaultProject);
  
  const getList = async function() {
    const response = await fetch(`/api/projects`);
    const data = await response.json();
    setProjects(data);
    return data;
  }

  const loadProject = async function(_id: string) {
    let response = await fetch(`/api/projects/${_id}`);
    let project = await response.json();
    setCurrentProject(project);
    return project;
  }

  const createProject = async function(data: ProjectInterface) {
    let response = await fetch(`/api/projects`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type" : "application/json"
      }
    });
    let project = await response.json();
    return project;
  }

  const setProjectLocal = async function (project_id: string) {
    cookies.set('project_id', project_id);
  }

  return (
    <ProjectContext.Provider value={{
      projects: projects,
      getList: getList,
      currentProject,
      loadProject,
      createProject,
      setProjectLocal
    }}>
      { children }
    </ProjectContext.Provider>
  )
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  return context;
}